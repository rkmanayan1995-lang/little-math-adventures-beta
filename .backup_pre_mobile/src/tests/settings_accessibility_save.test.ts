import {
  ProgressManager,
  MemoryStorageAdapter,
  StorageAdapter,
  STORAGE_KEY_V5,
  CURRENT_VERSION
} from '../utils/progressManager';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`  ✓ PASS: ${message}`);
  }
}

/**
 * Throwing storage adapter to simulate quota exceeded or private browsing security restrictions
 */
class FailingStorageAdapter implements StorageAdapter {
  getItem(_key: string): string | null {
    throw new Error('SecurityError: The operation is insecure or storage is inaccessible.');
  }
  setItem(_key: string, _value: string): void {
    throw new Error('QuotaExceededError: Storage quota exceeded.');
  }
  removeItem(_key: string): void {
    throw new Error('SecurityError: Cannot access storage.');
  }
}

function runSettingsAccessibilitySaveTests() {
  console.log('\n========================================================');
  console.log('RUNNING SETTINGS, ACCESSIBILITY & SAVE RELIABILITY TESTS');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    console.log(`\nSuite: ${name}`);
    try {
      fn();
    } catch (err: any) {
      console.error(`  ❌ Suite Error: ${err.message}`);
      failed++;
      return;
    }
  }

  // --- Suite 1: Settings & Accessibility Persistence ---
  test('Settings and Accessibility Preferences Persistence', () => {
    const storage = new MemoryStorageAdapter();
    const pm1 = new ProgressManager(storage);

    const initial = pm1.getProgress().settings;
    assert(initial.soundMuted === false, 'Default sound is not muted');
    assert(initial.bgmEnabled === true, 'Default background music is enabled');
    assert(initial.reducedMotion === false, 'Default reduced motion is off');
    assert(initial.textSize === 'standard', 'Default text size is standard');
    passed += 4;

    // Update settings: enable reduced motion, large text, and sound preferences
    pm1.updateSettings({
      soundMuted: true,
      bgmEnabled: false,
      reducedMotion: true,
      textSize: 'large'
    });

    const updated = pm1.getProgress().settings;
    assert(updated.soundMuted === true, 'Sound muted updated to true');
    assert(updated.bgmEnabled === false, 'BGM updated to false');
    assert(updated.reducedMotion === true, 'Reduced motion updated to true');
    assert(updated.textSize === 'large', 'Text size updated to large');
    passed += 4;

    // Reload from storage with new ProgressManager instance
    const pm2 = new ProgressManager(storage);
    const restored = pm2.getProgress().settings;
    assert(restored.soundMuted === true, 'Restored soundMuted is true');
    assert(restored.bgmEnabled === false, 'Restored bgmEnabled is false');
    assert(restored.reducedMotion === true, 'Restored reducedMotion is true');
    assert(restored.textSize === 'large', 'Restored textSize is large');
    passed += 4;
  });

  // --- Suite 2: Inaccessible or Throwing Storage Resilience ---
  test('Inaccessible, Throwing or Failing Storage Resilience', () => {
    const failingStorage = new FailingStorageAdapter();

    // Must not crash when storage throws on startup or saving
    let pmFailing: ProgressManager | null = null;
    let didThrow = false;
    try {
      pmFailing = new ProgressManager(failingStorage);
    } catch {
      didThrow = true;
    }

    assert(didThrow === false, 'ProgressManager does not crash when storage throws on read');
    assert(pmFailing !== null, 'ProgressManager creates safe default in-memory instance');
    assert(pmFailing?.canAccessLevel(1).allowed === true, 'Allows Level 1 play even with failing storage');

    // Attempting to persist with throwing storage must not crash the app
    let saveThrew = false;
    try {
      pmFailing?.updateSettings({ soundMuted: true });
    } catch {
      saveThrew = true;
    }
    assert(saveThrew === false, 'Updating progress with throwing storage fails gracefully without crashing');
    passed += 4;
  });

  // --- Suite 3: Partial Save Corruption & Preserving Valid Unrelated Settings ---
  test('Partial Corruption Recovery & Preserving Unrelated Valid Settings', () => {
    const storage = new MemoryStorageAdapter();

    // Create a payload where completedLevels and destinations are completely corrupted,
    // but settings and screenTimeSettings are valid!
    const partiallyCorruptedPayload = {
      version: CURRENT_VERSION,
      completedLevels: 'malformed_string_instead_of_object',
      destinations: [1, 2, 'invalid_destination_objects'],
      settings: {
        soundMuted: true,
        bgmEnabled: false,
        reducedMotion: true,
        textSize: 'large'
      },
      screenTimeSettings: {
        enabled: true,
        allowanceMinutes: 15,
        presetId: 'custom',
        warningMinutes: 2
      },
      energyGauge: {
        remainingSeconds: 450,
        totalAllowanceSeconds: 900,
        isExhausted: false,
        exhaustedAtTimestamp: null,
        nextReplenishTimestamp: null
      }
    };

    storage.setItem(STORAGE_KEY_V5, JSON.stringify(partiallyCorruptedPayload));

    const pm = new ProgressManager(storage);
    const progress = pm.getProgress();

    // Progress should recover safe Level 1 access
    assert(progress.highestAccessibleLevel === 1, 'Corrupted levels recover to Level 1');
    assert(pm.canAccessLevel(1).allowed === true, 'Level 1 accessible');
    assert(pm.canAccessLevel(2).allowed === false, 'Level 2 remains locked');

    // Unrelated valid settings must be strictly preserved!
    assert(progress.settings.soundMuted === true, 'Preserved soundMuted setting');
    assert(progress.settings.bgmEnabled === false, 'Preserved bgmEnabled setting');
    assert(progress.settings.reducedMotion === true, 'Preserved reducedMotion accessibility setting');
    assert(progress.settings.textSize === 'large', 'Preserved textSize accessibility setting');

    // Unrelated parent screen-time limits must be strictly preserved!
    assert(progress.screenTimeSettings.allowanceMinutes === 15, 'Preserved parent allowance (15m)');
    assert(progress.screenTimeSettings.presetId === 'custom', 'Preserved parent preset (custom)');
    assert(progress.energyGauge.remainingSeconds === 450, 'Preserved remaining energy gauge seconds');
    passed += 9;
  });

  // --- Suite 4: Reset Game Progress & Parent Limit Preservation ---
  test('Reset Game Progress Preserves Parent-Controlled Playtime Limits', () => {
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage);

    // 1. Player completes Level 1, earns 3 stars, unlocks Level 2
    pm.completeLevel(1, { starsEarned: 3, questionsCompleted: 10, score: 10, firstTryCount: 10 });
    pm.saveResumeState('dest_02', 4);
    assert(pm.getProgress().totalStars === 3, 'Player has 3 stars');
    assert(pm.getProgress().highestAccessibleLevel === 2, 'Player unlocked Level 2');
    assert(pm.getProgress().resumeState?.questionIndex === 4, 'Resume state saved at question 4');

    // 2. Parent configures playtime limit and ticks down some time
    pm.updateScreenTimeSettings({ allowanceMinutes: 10, presetId: 'short' }, true);
    pm.tickActiveTime(120); // 2 minutes used
    assert(pm.getProgress().screenTimeSettings.allowanceMinutes === 10, 'Parent configured 10m limit');
    assert(pm.getProgress().energyGauge.remainingSeconds === 480, '480 seconds remaining');

    // 3. User configures accessibility preferences
    pm.updateSettings({ reducedMotion: true, textSize: 'large' });

    // 4. Reset Game Progress is executed (explicit confirmation)
    pm.resetGameProgress();

    const afterReset = pm.getProgress();

    // Child gameplay progress is reset:
    assert(afterReset.totalStars === 0, 'Stars reset to 0');
    assert(afterReset.highestAccessibleLevel === 1, 'Highest accessible level reset to 1');
    assert(afterReset.completedLevels[1] === undefined, 'Level 1 completion cleared');
    assert(afterReset.resumeState === null, 'Resume state cleared');
    assert(afterReset.hasPlayedIntro === false, 'Story intro reset so child can replay');

    // CRITICAL REQUIREMENT: Parent playtime limits are NOT silently disabled or wiped!
    assert(
      afterReset.screenTimeSettings.enabled === true,
      'Parent screen-time limits remain strictly enabled after game reset'
    );
    assert(
      afterReset.screenTimeSettings.allowanceMinutes === 10,
      'Parent allowance is strictly preserved (10m) after game reset'
    );
    assert(
      afterReset.screenTimeSettings.presetId === 'short',
      'Parent preset is preserved (short) after game reset'
    );
    assert(
      afterReset.energyGauge.remainingSeconds === 480,
      'Remaining energy gauge seconds are preserved so reset cannot bypass playtime limits'
    );

    // Accessibility settings are also preserved:
    assert(afterReset.settings.reducedMotion === true, 'Reduced motion preserved after reset');
    assert(afterReset.settings.textSize === 'large', 'Large text setting preserved after reset');
    passed += 12;
  });

  // --- Suite 5: Resume State Integrity & Recovery ---
  test('Resume State Saved and Restored Safely', () => {
    const storage = new MemoryStorageAdapter();
    const pm1 = new ProgressManager(storage);

    // Save resume state on Level 1, Question 6
    pm1.saveResumeState('dest_01', 6);
    const resume1 = pm1.getResumeState();
    assert(resume1 !== null, 'Resume state recorded');
    assert(resume1?.destId === 'dest_01', 'Resume destination is dest_01');
    assert(resume1?.levelNumber === 1, 'Resume level number is 1');
    assert(resume1?.questionIndex === 6, 'Resume question index is 6');

    // Reload with new instance
    const pm2 = new ProgressManager(storage);
    const resume2 = pm2.getResumeState();
    assert(resume2?.destId === 'dest_01', 'Restored resume destination is dest_01');
    assert(resume2?.questionIndex === 6, 'Restored resume question index is 6');

    // Clearing resume state on level completion
    pm2.completeLevel(1, { starsEarned: 3, questionsCompleted: 10, score: 10, firstTryCount: 9 });
    assert(pm2.getResumeState() === null, 'Resume state cleared after full level completion');
    passed += 7;
  });

  console.log('\n========================================================');
  console.log(`TEST RESULTS: ${passed} passed (${failed} failed)`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSettingsAccessibilitySaveTests();

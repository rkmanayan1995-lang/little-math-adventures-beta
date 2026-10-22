import {
  ProgressManager,
  MemoryStorageAdapter,
  STORAGE_KEY_V5,
  REPLENISHMENT_DURATION_MS
} from '../utils/progressManager';
import { ParentSecurityGate } from '../utils/parentSecurity';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`  ✓ PASS: ${message}`);
  }
}

function runEnergyGaugeTests() {
  console.log('\n========================================================');
  console.log('RUNNING ADVENTURE ENERGY GAUGE & SCREEN-TIME LIMITS TESTS');
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

  // --- Suite 1: Active Time Depletion & Low-Time Warning ---
  test('Active Time Depletion & Gentle Warning Threshold', () => {
    let mockTime = 1700000000000;
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage, () => mockTime);

    const initial = pm.getProgress();
    assert(initial.screenTimeSettings.enabled === true, 'Screen-time limits enabled by default');
    assert(initial.screenTimeSettings.allowanceMinutes === 20, 'Default allowance is 20 minutes');
    assert(initial.energyGauge.remainingSeconds === 1200, 'Initial remaining seconds is 1200 (20m)');
    assert(initial.energyGauge.isExhausted === false, 'Initial state is not exhausted');
    passed += 4;

    // Tick 60 seconds of active play
    mockTime += 60000;
    const tick1 = pm.tickActiveTime(60);
    assert(tick1.exhaustedNow === false, 'Not exhausted after 60 seconds');
    assert(tick1.lowWarningNow === false, 'No low warning yet after 60 seconds');
    assert(pm.getProgress().energyGauge.remainingSeconds === 1140, 'Remaining is 1140 seconds');
    passed += 3;

    // Tick until 120 seconds (2 minutes) remaining
    // 1140 - 1020 = 120 seconds
    mockTime += 1020000;
    const tickWarning = pm.tickActiveTime(1020);
    assert(tickWarning.lowWarningNow === true, 'Low warning triggered at 2 minutes remaining (120s)');
    assert(tickWarning.exhaustedNow === false, 'Not exhausted at warning threshold');
    assert(pm.getProgress().energyGauge.hasShownLowWarning === true, 'hasShownLowWarning recorded in state');
    passed += 3;

    // Next tick should NOT re-trigger low warning
    mockTime += 30000;
    const tickWarningRepeat = pm.tickActiveTime(30);
    assert(tickWarningRepeat.lowWarningNow === false, 'Low warning does not re-trigger on subsequent ticks');
    assert(pm.getProgress().energyGauge.remainingSeconds === 90, 'Remaining is 90 seconds');
    passed += 2;

    // Deplete remaining 90 seconds
    mockTime += 90000;
    const tickDeplete = pm.tickActiveTime(90);
    assert(tickDeplete.exhaustedNow === true, 'exhaustedNow is true upon hitting 0');
    assert(pm.getProgress().energyGauge.isExhausted === true, 'energyGauge.isExhausted is true');
    assert(pm.getProgress().energyGauge.remainingSeconds === 0, 'Remaining seconds is exactly 0');
    assert(pm.getProgress().energyGauge.exhaustedAtTimestamp === mockTime, 'exhaustedAtTimestamp recorded');
    assert(
      pm.getProgress().energyGauge.nextReplenishTimestamp === mockTime + REPLENISHMENT_DURATION_MS,
      'nextReplenishTimestamp set to exactly +12 hours'
    );
    passed += 5;

    // Level access is blocked while exhausted
    const access = pm.canAccessLevel(1);
    assert(access.allowed === false, 'Level 1 access is strictly blocked when screen time is exhausted');
    assert(
      access.reason?.includes('break') === true,
      'Rejection reason provides gentle rest message for player'
    );
    passed += 2;
  });

  // --- Suite 2: App Backgrounding & Pause/Resume (No Double-Counting) ---
  test('Pause on Background & No Double Counting across Transitions', () => {
    let mockTime = 1700000000000;
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage, () => mockTime);

    // Active gameplay for 5 minutes (300s)
    mockTime += 300000;
    pm.tickActiveTime(300);
    assert(pm.getProgress().energyGauge.remainingSeconds === 900, 'Remaining time is 900s (15m)');
    passed++;

    // Simulate Backgrounding: child minimizes app or locks device for 45 minutes
    mockTime += 45 * 60 * 1000;
    // During background, no ticks are sent (tickActiveTime(0) or no call)
    // When returning, deltaSec is reset and tick is not called for the background duration
    const resumedRemaining = pm.getProgress().energyGauge.remainingSeconds;
    assert(
      resumedRemaining === 900,
      'Background time was not deducted: remaining seconds stayed at 900s'
    );
    assert(pm.getProgress().energyGauge.isExhausted === false, 'Not exhausted while app was backgrounded');
    passed += 2;

    // Active gameplay resumes after returning to app
    mockTime += 60000;
    pm.tickActiveTime(60);
    assert(pm.getProgress().energyGauge.remainingSeconds === 840, 'Active ticking resumes cleanly (840s)');
    passed++;
  });

  // --- Suite 3: Persistence & App Restart across Refresh ---
  test('Deadline Persistence across App Restarts and Refreshes', () => {
    let mockTime = 1700000000000;
    const storage = new MemoryStorageAdapter();
    const pm1 = new ProgressManager(storage, () => mockTime);

    // Deplete full allowance
    mockTime += 1200000;
    pm1.tickActiveTime(1200);
    assert(pm1.getProgress().energyGauge.isExhausted === true, 'Instance 1 is exhausted');
    const expectedReplenish = mockTime + REPLENISHMENT_DURATION_MS;
    assert(
      pm1.getProgress().energyGauge.nextReplenishTimestamp === expectedReplenish,
      'Instance 1 replenishment timestamp set'
    );
    passed += 2;

    // Simulate App Restart / Browser Refresh with new ProgressManager instance
    const pm2 = new ProgressManager(storage, () => mockTime);
    assert(pm2.getProgress().energyGauge.isExhausted === true, 'Instance 2 restores exhausted state');
    assert(pm2.getProgress().energyGauge.remainingSeconds === 0, 'Instance 2 restores 0 remaining seconds');
    assert(
      pm2.getProgress().energyGauge.nextReplenishTimestamp === expectedReplenish,
      'Instance 2 restores exact same 12-hour replenishment deadline'
    );
    assert(pm2.canAccessLevel(1).allowed === false, 'Instance 2 strictly enforces level lock on startup');
    passed += 4;
  });

  // --- Suite 4: Staggered Hourly Replenishment Schedule ---
  test('Staggered Hourly Replenishment Schedule and Automatic Restoration', () => {
    let mockTime = 1700000000000;
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage, () => mockTime);

    // Deplete allowance to 0 (20 min = 1200 seconds)
    mockTime += 1200000;
    pm.tickActiveTime(1200);
    assert(pm.isScreenTimeExhausted() === true, 'Exhausted before replenishment');
    assert(pm.getProgress().energyGauge.remainingSeconds === 0, 'Remaining is 0s upon exhaustion');
    passed += 2;

    // Advance mock time by 1 hour (1/12th of 12-hour schedule)
    mockTime += 1 * 60 * 60 * 1000;
    const check1h = pm.checkReplenishment();
    assert(check1h === true, 'After 1 hour, checkReplenishment returns true (hourly increment awarded)');
    assert(
      pm.getProgress().energyGauge.remainingSeconds === 100,
      '1st hourly increment restored exactly 100 seconds (1200s / 12)'
    );
    assert(pm.isScreenTimeExhausted() === false, 'isScreenTimeExhausted is false after 1 hour partial recovery');
    assert(pm.canAccessLevel(1).allowed === true, 'Level 1 is accessible for 100s of playtime');
    passed += 4;

    // Advance mock time by 2nd hour (2 hours total from exhaustion)
    mockTime += 1 * 60 * 60 * 1000;
    const check2h = pm.checkReplenishment();
    assert(check2h === true, 'After 2 hours, checkReplenishment awards 2nd hourly increment');
    assert(
      pm.getProgress().energyGauge.remainingSeconds === 200,
      '2nd hourly increment increases available playtime to 200 seconds'
    );
    passed += 2;

    // Child plays for 100s of the available 200s
    pm.tickActiveTime(100);
    assert(pm.getProgress().energyGauge.remainingSeconds === 100, 'Remaining is 100s after active play');
    assert(pm.isScreenTimeExhausted() === false, 'Not exhausted while playtime remains');
    passed += 2;

    // Advance to 6 hours total (4 more hours)
    mockTime += 4 * 60 * 60 * 1000;
    pm.checkReplenishment();
    // Had 100s remaining, added 4 more hours * 100s = 500s total
    assert(
      pm.getProgress().energyGauge.remainingSeconds === 500,
      'Remaining seconds reflects earned hourly increments without clock resets (500s)'
    );
    passed++;

    // Advance mock time to 12 hours (exactly full replenishment deadline)
    mockTime += 6 * 60 * 60 * 1000;
    const check12h = pm.checkReplenishment();
    assert(check12h === true, 'After 12 hours, full recovery completed');
    assert(pm.isScreenTimeExhausted() === false, 'isScreenTimeExhausted is false after 12 hours');
    assert(
      pm.getProgress().energyGauge.remainingSeconds === 1200,
      'Full allowance of 1200 seconds restored'
    );
    assert(pm.getProgress().energyGauge.isExhausted === false, 'energyGauge.isExhausted is false');
    assert(
      pm.getProgress().energyGauge.nextReplenishTimestamp === null,
      'nextReplenishTimestamp cleared after full restoration'
    );
    assert(pm.canAccessLevel(1).allowed === true, 'Level 1 is accessible again after full restoration');
    passed += 6;

    // Advance clock even further (e.g. 24 hours later)
    mockTime += 24 * 60 * 60 * 1000;
    pm.checkReplenishment();
    assert(
      pm.getProgress().energyGauge.remainingSeconds === 1200,
      'Energy does not accumulate beyond 100% full allowance'
    );
    passed++;
  });

  // --- Suite 5: Parent Security Confirmation Gate ---
  test('Parent Security Confirmation Gate & Settings Protection', () => {
    const challenge = ParentSecurityGate.generateChallenge();
    assert(typeof challenge.expectedAnswer === 'number', 'Challenge generates expected numeric answer');
    assert(challenge.questionText.includes('×'), 'Challenge includes multiplication problem');
    passed += 2;

    // Incorrect answer fails
    const wrongAttempt = ParentSecurityGate.verifyAnswer(challenge.expectedAnswer + 7, challenge);
    assert(wrongAttempt === false, 'Wrong answer fails verification');
    passed++;

    // Correct answer passes
    const correctAttempt = ParentSecurityGate.verifyAnswer(challenge.expectedAnswer, challenge);
    assert(correctAttempt === true, 'Correct answer passes verification');
    passed++;

    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage);

    // Attempt updating settings without solving parent challenge
    const unauthorized = pm.updateScreenTimeSettings({ allowanceMinutes: 10, presetId: 'short' }, false);
    assert(unauthorized === false, 'Unauthorized settings change rejected');
    assert(pm.getProgress().screenTimeSettings.allowanceMinutes === 20, 'Allowance unchanged (20m)');
    passed += 2;

    // Authorized update with parent confirmation
    const authorized = pm.updateScreenTimeSettings({ allowanceMinutes: 10, presetId: 'short' }, true);
    assert(authorized === true, 'Authorized settings change accepted');
    assert(pm.getProgress().screenTimeSettings.allowanceMinutes === 10, 'Allowance changed to 10m');
    assert(pm.getProgress().energyGauge.totalAllowanceSeconds === 600, 'Gauge total updated to 600s');
    passed += 3;

    // Deplete and test parent manual replenishment
    pm.tickActiveTime(600);
    assert(pm.isScreenTimeExhausted() === true, 'Gauge is exhausted');

    const unauthorizedReset = pm.parentResetEnergyGauge(false);
    assert(unauthorizedReset === false, 'Unauthorized reset rejected');
    assert(pm.isScreenTimeExhausted() === true, 'Still exhausted after failed reset');

    const authorizedReset = pm.parentResetEnergyGauge(true);
    assert(authorizedReset === true, 'Authorized manual replenishment accepted');
    assert(pm.isScreenTimeExhausted() === false, 'Gauge is replenished immediately');
    assert(pm.getProgress().energyGauge.remainingSeconds === 600, 'Remaining reset to full 600s');
    passed += 6;
  });

  // --- Suite 6: Corrupted Data Recovery ---
  test('Corrupted Data Recovery & Safe Defaults', () => {
    const storage = new MemoryStorageAdapter();

    // Write corrupted JSON with damaged screen-time state
    const corruptPayload = {
      version: 5,
      screenTimeSettings: {
        allowanceMinutes: -50,
        presetId: 'unknown_hacked_preset'
      },
      energyGauge: {
        remainingSeconds: 'not_a_number',
        isExhausted: 'corrupted'
      }
    };
    storage.setItem(STORAGE_KEY_V5, JSON.stringify(corruptPayload));

    const pm = new ProgressManager(storage);
    const progress = pm.getProgress();

    assert(progress.screenTimeSettings.enabled === true, 'Recovers with screen-time enabled');
    assert(progress.screenTimeSettings.allowanceMinutes === 20, 'Recovers with safe 20m allowance');
    assert(progress.screenTimeSettings.presetId === 'standard', 'Recovers with standard preset');
    assert(progress.energyGauge.remainingSeconds === 1200, 'Recovers with safe remaining seconds');
    assert(progress.energyGauge.isExhausted === false, 'Recovers with safe non-exhausted state');
    passed += 5;
  });

  // --- Suite 7: Progress Preservation during Break ---
  test('Zero Star Deduction & Progress Preservation during Break', () => {
    let mockTime = 1700000000000;
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage, () => mockTime);

    // Complete Level 1 with 3 stars
    pm.completeLevel(1, { starsEarned: 3, questionsCompleted: 10, score: 10, firstTryCount: 8 });
    assert(pm.getProgress().completedLevels[1].completed === true, 'Level 1 completed');
    assert(pm.getProgress().totalStars === 3, 'Total stars is 3');
    assert(pm.getProgress().highestAccessibleLevel === 2, 'Level 2 unlocked');
    passed += 3;

    // Deplete active screen time to trigger break
    mockTime += 1200000;
    pm.tickActiveTime(1200);
    assert(pm.isScreenTimeExhausted() === true, 'Break active');

    // Verify player stars, levels, and badges are 100% preserved
    const breakProgress = pm.getProgress();
    assert(breakProgress.totalStars === 3, 'Total stars strictly preserved during break (no deductions)');
    assert(breakProgress.completedLevels[1].completed === true, 'Level 1 completion record intact');
    assert(breakProgress.completedLevels[1].starsEarned === 3, 'Level 1 stars intact');
    assert(breakProgress.highestAccessibleLevel === 2, 'Highest accessible level intact (Level 2)');
    passed += 4;
  });

  // --- Suite 8: Developer Testing Mode & Simulation Exemption ---
  test('Developer Testing Mode Authorization, Bypass, Level Overrides & Clock Simulation', () => {
    let mockTime = 1700000000000;
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage, () => mockTime);

    // 1. Initial State: Developer Mode disabled by default
    assert(pm.isDevModeActive() === false, 'Dev mode is inactive by default');
    assert(pm.getDevConfig().enabled === false, 'Dev config enabled is false');
    passed += 2;

    // 2. Passcode Authorization Gate
    const badAuth = pm.enableDevMode('wrong_passcode');
    assert(badAuth === false, 'Invalid developer passcode rejected');
    assert(pm.isDevModeActive() === false, 'Dev mode remains disabled on bad passcode');
    passed += 2;

    const goodAuth = pm.enableDevMode('LMA-DEV-2026');
    assert(goodAuth === true, 'Authorized developer passcode accepted');
    assert(pm.isDevModeActive() === true, 'Dev mode is active');
    const devCfg = pm.getDevConfig();
    assert(devCfg.bypassScreenTime === true, 'bypassScreenTime enabled by default');
    assert(devCfg.unlockAllLevels === true, 'unlockAllLevels enabled by default');
    assert(devCfg.infiniteAllowance === true, 'infiniteAllowance enabled by default');
    passed += 5;

    // 3. Infinite Testing Allowance: tickActiveTime never exhausts allowance
    const tickDev = pm.tickActiveTime(3600); // 1 hour of continuous testing
    assert(tickDev.exhaustedNow === false, 'Developer session does not exhaust timer');
    assert(tickDev.lowWarningNow === false, 'Developer session does not trigger low warning');
    assert(pm.isScreenTimeExhausted() === false, 'Screen time not exhausted during dev session');
    assert(pm.getRemainingScreenTime().formatted.includes('Dev'), 'Remaining time displays Dev status');
    passed += 4;

    // 4. Level Navigation QA: Can access any level (Level 10) while child progress remains Level 1
    const childDest10 = pm.getProgress().destinations.find((d) => d.number === 10);
    assert(childDest10?.status === 'locked', 'Child save state: Level 10 is still locked in player progress');
    assert(pm.getProgress().highestAccessibleLevel === 1, 'Child progression highest accessible level remains 1');

    const devAccess10 = pm.canAccessLevel(10);
    assert(devAccess10.allowed === true, 'Developer QA can access locked Level 10');
    assert(devAccess10.destination?.number === 10, 'Level 10 destination returned for inspection');
    passed += 4;

    // 5. Developer Simulation: Force 2-Minute Warning Toast
    pm.devSimulateLowTimeWarning();
    assert(pm.getProgress().energyGauge.remainingSeconds === 120, 'Simulated low warning set gauge to 120s');
    passed += 1;

    // 6. Developer Simulation: Trigger Exhaustion
    pm.devSimulateExhaustion();
    assert(pm.getProgress().energyGauge.isExhausted === true, 'Simulated exhaustion set isExhausted to true');
    assert(pm.getProgress().energyGauge.remainingSeconds === 0, 'Gauge remaining seconds set to 0');
    passed += 2;

    // 7. Developer Simulation: Hourly Replenishment Clock Leaps
    // Advance clock by 1 hour -> should award 1 increment (1200 / 12 = 100s)
    pm.devAdvanceClock(1);
    const hourlyInfo = pm.getHourlyReplenishmentInfo();
    assert(hourlyInfo.completedHours === 1, '1 hour elapsed recorded');
    assert(pm.getProgress().energyGauge.remainingSeconds === 100, 'Awarded 1 hour increment (100 seconds)');
    passed += 2;

    // Advance clock by 5 more hours (total 6 hours)
    pm.devAdvanceClock(5);
    assert(pm.getProgress().energyGauge.remainingSeconds === 600, 'Awarded 6 hours increment (600 seconds = 10m)');
    passed += 1;

    // Advance clock by 6 more hours (total 12 hours) -> full recovery
    pm.devAdvanceClock(6);
    assert(pm.getProgress().energyGauge.remainingSeconds === 1200, 'Full allowance restored after 12 hours');
    assert(pm.getProgress().energyGauge.isExhausted === false, 'Gauge is no longer exhausted');
    passed += 2;

    // 8. Instant Full Refill
    pm.devSimulateExhaustion();
    assert(pm.getProgress().energyGauge.isExhausted === true, 'Exhausted before refill');
    pm.devReplenishNow();
    assert(pm.getProgress().energyGauge.remainingSeconds === 1200, 'devReplenishNow restores 100% allowance');
    assert(pm.getProgress().energyGauge.isExhausted === false, 'Gauge is not exhausted after devReplenishNow');
    passed += 3;

    // 9. Deactivation: Immediate return to strict child rules
    pm.disableDevMode();
    assert(pm.isDevModeActive() === false, 'Dev mode is now disabled');
    assert(pm.getDevConfig().enabled === false, 'devConfig.enabled is false');

    // With dev mode disabled, Level 10 must be strictly locked again
    const normalAccess10 = pm.canAccessLevel(10);
    assert(normalAccess10.allowed === false, 'Normal child restrictions restored: Level 10 is strictly locked');
    passed += 3;
  });

  console.log('\n========================================================');
  console.log(`TEST RESULTS: ${passed} passed (${failed} failed)`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runEnergyGaugeTests();


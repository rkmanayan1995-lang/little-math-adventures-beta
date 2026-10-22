/**
 * Authoritative Progression and Level Locks Test Suite
 * Validates:
 * 1. Fresh-player access
 * 2. Sequential unlocking
 * 3. Incomplete levels
 * 4. Replay integrity
 * 5. Refresh / persistence
 * 6. Duplicate completion events
 * 7. Corrupted saves & anti-tamper validation
 * 8. Level 10 Champion completion
 */

import {
  ProgressManager,
  MemoryStorageAdapter,
  STORAGE_KEY_V4,
  STORAGE_KEY_V3
} from '../utils/progressManager';

// Lightweight test framework runner
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
  }
}

async function runAllTests() {
  console.log('========================================================');
  console.log('RUNNING AUTHORITATIVE PROGRESSION AND LEVEL LOCKS TESTS');
  console.log('========================================================\n');

  // TEST SUITE 1: FRESH-PLAYER ACCESS
  console.log('Suite 1: Fresh-Player Access');
  {
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage);

    const l1Access = pm.canAccessLevel(1);
    assert(l1Access.allowed === true, 'Fresh player can access Level 1');

    const l2Access = pm.canAccessLevel(2);
    assert(l2Access.allowed === false, 'Fresh player CANNOT access Level 2');
    assert(Boolean(l2Access.reason && l2Access.reason.includes('locked')), 'Level 2 rejection provides clear reason');

    for (let lvl = 2; lvl <= 10; lvl++) {
      const access = pm.canAccessLevel(lvl);
      assert(access.allowed === false, `Level ${lvl} is strictly locked for fresh player`);
    }

    const attempt = pm.attemptAccessLevel(3);
    assert(attempt.allowed === false, 'Attempting to access Level 3 is rejected');
    assert(pm.getProgress().activeLevelId === 'dest_01', 'Active level ID does not change when locked level is tapped');
    assert(pm.getProgress().highestAccessibleLevel === 1, 'Highest accessible level is 1 for fresh player');
  }

  // TEST SUITE 2: SEQUENTIAL UNLOCKING
  console.log('\nSuite 2: Sequential Unlocking');
  {
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage);

    // Complete Level 1
    const res1 = pm.completeLevel(1, { starsEarned: 3, questionsCompleted: 10, score: 10 });
    assert(res1.success === true, 'Level 1 completes successfully with 10 questions');
    assert(pm.canAccessLevel(2).allowed === true, 'Level 2 is now accessible after Level 1 completion');
    assert(pm.canAccessLevel(3).allowed === false, 'Level 3 remains locked until Level 2 is completed');
    assert(pm.getProgress().highestAccessibleLevel === 2, 'Highest accessible level is now 2');

    // Complete Level 2
    const res2 = pm.completeLevel(2, { starsEarned: 2, questionsCompleted: 10, score: 9 });
    assert(res2.success === true, 'Level 2 completes successfully with 10 questions');
    assert(pm.canAccessLevel(3).allowed === true, 'Level 3 is now accessible after Level 2 completion');
    assert(pm.canAccessLevel(4).allowed === false, 'Level 4 remains locked');
    assert(pm.canAccessLevel(1).allowed === true, 'Level 1 remains accessible for replay');
    assert(pm.canAccessLevel(2).allowed === true, 'Level 2 remains accessible for replay');
  }

  // TEST SUITE 3: INCOMPLETE LEVELS
  console.log('\nSuite 3: Incomplete Levels & Premature Completion');
  {
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage);

    // Attempt to complete Level 1 with only 9 questions
    const incompleteRes = pm.completeLevel(1, { starsEarned: 3, questionsCompleted: 9, score: 9 });
    assert(incompleteRes.success === false, 'completeLevel rejects when fewer than 10 questions are completed');
    assert(pm.canAccessLevel(2).allowed === false, 'Level 2 remains locked when Level 1 was incomplete');

    // Attempt to complete Level 4 directly while it is locked
    const lockedRes = pm.completeLevel(4, { starsEarned: 3, questionsCompleted: 10 });
    assert(lockedRes.success === false, 'completeLevel strictly rejects on locked level');
    assert(pm.canAccessLevel(4).allowed === false, 'Level 4 remains locked after unauthorized completeLevel call');
  }

  // TEST SUITE 4: REPLAY INTEGRITY
  console.log('\nSuite 4: Replay Integrity (History preservation & no duplicate bonuses)');
  {
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage);

    // First completion: Level 1 with 3 stars
    pm.completeLevel(1, { starsEarned: 3, questionsCompleted: 10, score: 10, firstTryCount: 8 });
    const starsAfterFirst = pm.getProgress().totalStars;
    const completedRecord = pm.getProgress().completedLevels[1];
    assert(completedRecord.starsEarned === 3, 'Level 1 has 3 stars');
    assert(completedRecord.timesCompleted === 1, 'Times completed is 1');

    // Replay Level 1 with only 1 star
    const replayRes = pm.completeLevel(1, { starsEarned: 1, questionsCompleted: 10, score: 6, firstTryCount: 2 });
    assert(replayRes.success === true, 'Replaying Level 1 succeeds');

    const updatedRecord = pm.getProgress().completedLevels[1];
    assert(updatedRecord.starsEarned === 3, 'Replay with lower stars does NOT decrease earned stars (best preserved)');
    assert(updatedRecord.bestScore === 10, 'Replay with lower score does NOT decrease best score');
    assert(updatedRecord.timesCompleted === 2, 'Times completed increments to 2 on replay');
    assert(pm.getProgress().totalStars === starsAfterFirst, 'Total stars are NOT duplicate-awarded or inflated on replay');
  }

  // TEST SUITE 5: PERSISTENCE & REFRESH (Simulated Restore)
  console.log('\nSuite 5: Persistence & Page Refresh Simulation');
  {
    const storage = new MemoryStorageAdapter();
    const pm1 = new ProgressManager(storage);

    pm1.completeLevel(1, { starsEarned: 3, questionsCompleted: 10, score: 10 });
    pm1.completeLevel(2, { starsEarned: 3, questionsCompleted: 10, score: 10 });
    pm1.saveResumeState(3, 4); // Resumed on Level 3 question index 4
    pm1.updateSettings({ soundMuted: true, preferredSpeaker: 'sancho' });

    // Simulate page reload by creating a new ProgressManager using the same storage
    const pm2 = new ProgressManager(storage);
    const restored = pm2.getProgress();

    assert(restored.highestAccessibleLevel === 3, 'Restored highest accessible level is 3');
    assert(pm2.canAccessLevel(1).allowed === true, 'Restored instance allows Level 1');
    assert(pm2.canAccessLevel(2).allowed === true, 'Restored instance allows Level 2');
    assert(pm2.canAccessLevel(3).allowed === true, 'Restored instance allows Level 3');
    assert(pm2.canAccessLevel(4).allowed === false, 'Restored instance locks Level 4');
    assert(restored.settings.soundMuted === true, 'Restored instance preserves sound settings');
    assert(restored.settings.preferredSpeaker === 'sancho', 'Restored instance preserves speaker settings');
    assert(restored.resumeState?.levelNumber === 3, 'Restored instance preserves resume level');
    assert(restored.resumeState?.questionIndex === 4, 'Restored instance preserves resume question index');
  }

  // TEST SUITE 6: DUPLICATE COMPLETION EVENTS
  console.log('\nSuite 6: Duplicate Completion Events');
  {
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage);

    // Call completeLevel 5 times rapidly for Level 1
    for (let i = 0; i < 5; i++) {
      pm.completeLevel(1, { starsEarned: 3, questionsCompleted: 10, score: 10 });
    }

    const progress = pm.getProgress();
    assert(progress.totalStars === 3, 'Total stars strictly equals 3 (no duplicate 3-star inflation)');

    const starCollectorBadges = progress.badges.filter((b) => b.id === 'star_collector' && b.unlocked);
    assert(starCollectorBadges.length === 1, 'Badges array contains exactly one unlocked badge, no duplicates');
  }

  // TEST SUITE 7: CORRUPTED SAVES & ANTI-TAMPER VALIDATION
  console.log('\nSuite 7: Corrupted Saves & Anti-Tamper Security');
  {
    // Case 7A: Corrupted malformed JSON string
    const storageCorrupt = new MemoryStorageAdapter();
    storageCorrupt.setItem(STORAGE_KEY_V4, '{"corrupted": true, broken JSON ...');

    const pmCorrupt = new ProgressManager(storageCorrupt);
    assert(pmCorrupt.canAccessLevel(1).allowed === true, 'Corrupt JSON recovers to valid Level 1 access');
    assert(pmCorrupt.canAccessLevel(2).allowed === false, 'Corrupt JSON recovers with Level 2 locked');
    assert(pmCorrupt.getProgress().highestAccessibleLevel === 1, 'Corrupt JSON recovers with highest accessible level 1');

    // Case 7B: Anti-tamper: Client stored unlockedNumbers: [1,2,3,4,5,6,7,8,9,10] without completion records
    const storageTampered = new MemoryStorageAdapter();
    const fakeSave = {
      version: 4,
      unlockedNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Attacker claims all levels are unlocked
      highestAccessibleLevel: 10,
      completedLevels: {}, // But NO valid completion records!
      destinations: [
        { id: 'dest_01', number: 1, status: 'unlocked' },
        { id: 'dest_02', number: 2, status: 'unlocked' },
        { id: 'dest_03', number: 3, status: 'unlocked' }
      ]
    };
    storageTampered.setItem(STORAGE_KEY_V4, JSON.stringify(fakeSave));

    const pmTampered = new ProgressManager(storageTampered);
    assert(pmTampered.canAccessLevel(1).allowed === true, 'Tampered save still allows Level 1');
    assert(pmTampered.canAccessLevel(2).allowed === false, 'Tampered save strictly locks Level 2 (no valid completion)');
    assert(pmTampered.canAccessLevel(10).allowed === false, 'Tampered save strictly locks Level 10');
    assert(pmTampered.getProgress().highestAccessibleLevel === 1, 'Highest accessible level is derived from completion records, NOT fake unlocked numbers');

    // Case 7C: Migration from older V3 format
    const storageV3 = new MemoryStorageAdapter();
    const v3Save = {
      hasPlayedIntro: true,
      energy: 4,
      destinations: [
        { id: 'dest_01', number: 1, status: 'completed', starsEarned: 3 },
        { id: 'dest_02', number: 2, status: 'completed', starsEarned: 2 },
        { id: 'dest_03', number: 3, status: 'unlocked', starsEarned: 0 }
      ],
      settings: { soundMuted: false, bgmEnabled: true, preferredSpeaker: 'andy' }
    };
    storageV3.setItem(STORAGE_KEY_V3, JSON.stringify(v3Save));

    const pmV3 = new ProgressManager(storageV3);
    assert(pmV3.canAccessLevel(1).allowed === true, 'V3 migration allows Level 1');
    assert(pmV3.canAccessLevel(2).allowed === true, 'V3 migration allows Level 2');
    assert(pmV3.canAccessLevel(3).allowed === true, 'V3 migration allows Level 3');
    assert(pmV3.canAccessLevel(4).allowed === false, 'V3 migration keeps Level 4 locked');
    assert(pmV3.getProgress().highestAccessibleLevel === 3, 'V3 migration derives highest accessible level as 3');
  }

  // TEST SUITE 8: LEVEL 10 COMPLETION & CHAMPION STATUS
  console.log('\nSuite 8: Level 10 Completion & Champion Screen');
  {
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage);

    // Complete Levels 1 through 9 sequentially
    for (let lvl = 1; lvl <= 9; lvl++) {
      const res = pm.completeLevel(lvl, { starsEarned: 3, questionsCompleted: 10, score: 10 });
      assert(res.success === true, `Level ${lvl} completes sequentially`);
    }

    assert(pm.getProgress().isChampion === false, 'Not champion before Level 10 is completed');
    assert(pm.canAccessLevel(10).allowed === true, 'Level 10 is unlocked after Level 9 completion');

    // Complete Level 10
    const res10 = pm.completeLevel(10, { starsEarned: 3, questionsCompleted: 10, score: 10 });
    assert(res10.success === true, 'Level 10 completes successfully');
    assert(pm.getProgress().isChampion === true, 'isChampion is TRUE after Level 10 completion');

    const mathMasterBadge = pm.getProgress().badges.find((b) => b.id === 'math_master');
    assert(Boolean(mathMasterBadge?.unlocked), 'math_master badge is unlocked after Level 10 completion');

    // Verify all 10 destinations are completed and replayable
    for (let lvl = 1; lvl <= 10; lvl++) {
      assert(pm.canAccessLevel(lvl).allowed === true, `Level ${lvl} remains replayable for Champion`);
    }
  }

  console.log('\n========================================================');
  console.log(`TEST RESULTS: ${passedTests} / ${totalTests} passed (${failedTests} failed)`);
  console.log('========================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Unhandled test error:', err);
  process.exit(1);
});

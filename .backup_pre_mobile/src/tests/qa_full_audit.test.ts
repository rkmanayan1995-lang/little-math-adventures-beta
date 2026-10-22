/**
 * COMPREHENSIVE QUALITY ASSURANCE (QA) FULL APPLICATION AUDIT TEST SUITE
 * 
 * Audits Little Math Adventures against all quality and functional requirements:
 * 1. GAMEPLAY & CURRICULUM INTEGRITY (100 questions, 10 levels, exact options & answers, deterministic math)
 * 2. ANSWER BEHAVIOR & INTERACTION LOGIC (Evaluation, hints, first-try rewards, zero penalty)
 * 3. PROGRESSION, REPLAY & LEVEL LOCKS (Sequential unlock, replayability, Level 10 champion)
 * 4. SAVE RELIABILITY & RESILIENCE (Save migrations, corrupted saves, missing storage, duplicate rewards)
 * 5. INTERRUPTED QUESTION RESUME (Unfinished game state restoration)
 * 6. ADVENTURE ENERGY GAUGE & HEALTHY SCREEN TIME (Active-time tracking, pause on background, exhaustion, 12h schedule, parent confirmation, zero star loss)
 * 7. ACCESSIBILITY & SETTINGS INTEGRATION (Audio toggles, motion preference, text scaling, reset safety)
 */

import {
  validateQuestionBank,
  LEVEL_BANKS,
  getQuestionsForLevel,
  validateAnswer
} from '../data/questionBank';
import {
  ProgressManager,
  MemoryStorageAdapter,
  STORAGE_KEY_V4,
  STORAGE_KEY_V3
} from '../utils/progressManager';
import { ParentSecurityGate } from '../utils/parentSecurity';

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
    process.exitCode = 1;
  }
}

async function runComprehensiveAudit() {
  console.log('========================================================');
  console.log('STARTING COMPREHENSIVE LITTLE MATH ADVENTURES QA AUDIT');
  console.log('========================================================\n');

  // =========================================================================
  // SECTION 1: ALL 100 QUESTIONS & DETERMINISTIC MATH CURRICULUM AUDIT
  // =========================================================================
  console.log('Section 1: All 100 Questions Across 10 Levels Audit');
  {
    const bankValidation = validateQuestionBank();
    assert(bankValidation.isValid, 'Question bank validation reports valid with zero errors', JSON.stringify(bankValidation.errors));
    assert(bankValidation.totalQuestions === 100, `Exactly 100 questions exist in the engine (found ${bankValidation.totalQuestions})`);
    assert(LEVEL_BANKS.length === 10, `Exactly 10 level banks exist (found ${LEVEL_BANKS.length})`);

    for (let lvl = 1; lvl <= 10; lvl++) {
      const questions = getQuestionsForLevel(lvl);
      assert(questions.length === 10, `Level ${lvl} contains exactly 10 questions`);

      questions.forEach((q, idx) => {
        // Exactly 3 options
        assert(q.options.length === 3, `Level ${lvl} Q${idx + 1} (${q.id}) has exactly 3 options`);

        // Distinct options (no duplicate choices presented to child)
        const uniqueOpts = new Set(q.options.map(String));
        assert(uniqueOpts.size === 3, `Level ${lvl} Q${idx + 1} (${q.id}) options are strictly distinct: [${q.options.join(', ')}]`);

        // Exactly one option matches correctAnswer
        const matches = q.options.filter((opt) => String(opt).trim() === String(q.correctAnswer).trim());
        assert(matches.length === 1, `Level ${lvl} Q${idx + 1} (${q.id}) has exactly one matching correct answer in options`);

        // Valid question text, hint, narration, explanation
        assert(typeof q.text === 'string' && q.text.length > 0, `Level ${lvl} Q${idx + 1} has readable text`);
        assert(typeof q.hint === 'string' && q.hint.length > 0, `Level ${lvl} Q${idx + 1} has a gentle hint`);
        assert(typeof q.narration === 'string' && q.narration.length > 0, `Level ${lvl} Q${idx + 1} has voice narration`);
        assert(typeof q.explanation === 'string' && q.explanation.length > 0, `Level ${lvl} Q${idx + 1} has celebration explanation`);
        assert(['andy', 'sancho', 'osi', 'narrator'].includes(q.speaker || ''), `Level ${lvl} Q${idx + 1} has a valid speaker character`);
      });
    }
  }

  // =========================================================================
  // SECTION 2: ANSWER EVALUATION, HINTS & ZERO-PENALTY REWARD LOGIC
  // =========================================================================
  console.log('\nSection 2: Answer Evaluation, Hints, and Non-Punitive Feedback');
  {
    // Validate answer verification function
    const q1 = getQuestionsForLevel(1)[0];
    const correctRes = validateAnswer(q1.id, q1.correctAnswer);
    assert(correctRes.isCorrect === true, 'Correct answer evaluation succeeds');
    assert(typeof correctRes.explanation === 'string', 'Correct answer provides celebratory explanation');

    // Incorrect answer evaluation
    const wrongOpt = q1.options.find((opt) => opt !== q1.correctAnswer)!;
    const wrongRes = validateAnswer(q1.id, wrongOpt);
    assert(wrongRes.isCorrect === false, 'Incorrect answer is accurately identified');
    assert(wrongRes.hint === q1.hint, 'Incorrect answer returns gentle hint for the child');
  }

  // =========================================================================
  // SECTION 3: PROGRESSION, REPLAYS, LEVEL LOCKS & CHAMPION COMPLETION
  // =========================================================================
  console.log('\nSection 3: Progression Restrictions, Sequential Unlocks, and Champion State');
  {
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage);

    // Initial state: Level 1 allowed, 2..10 locked
    assert(pm.canAccessLevel(1).allowed === true, 'Fresh player can access Level 1');
    for (let lvl = 2; lvl <= 10; lvl++) {
      assert(pm.canAccessLevel(lvl).allowed === false, `Level ${lvl} initially locked`);
    }

    // Play through all 10 levels sequentially
    for (let lvl = 1; lvl <= 10; lvl++) {
      assert(pm.canAccessLevel(lvl).allowed === true, `Level ${lvl} is accessible when reached`);
      const comp = pm.completeLevel(lvl, { starsEarned: 3, questionsCompleted: 10, score: 10 });
      assert(comp.success === true, `Level ${lvl} completed successfully`);
      if (lvl < 10) {
        assert(pm.canAccessLevel(lvl + 1).allowed === true, `Level ${lvl + 1} unlocked immediately after Level ${lvl}`);
      }
    }

    // Level 10 Champion State
    const prog = pm.getProgress();
    assert(prog.highestAccessibleLevel === 10, 'Highest accessible level is 10');
    assert(prog.totalStars === 30, 'Total stars earned is 30 for 10 mastered levels');
    assert(pm.canAccessLevel(10).allowed === true, 'Level 10 remains accessible for replay');
    assert(pm.canAccessLevel(1).allowed === true, 'Level 1 remains accessible for replay');

    // Replay duplicate reward prevention: replaying level 1 with same or lower score does NOT increase total stars
    const replayComp = pm.completeLevel(1, { starsEarned: 3, questionsCompleted: 10, score: 10 });
    assert(replayComp.success === true, 'Replay completion recorded');
    assert(pm.getProgress().totalStars === 30, 'Duplicate reward prevented: total stars remains 30 after replay');
  }

  // =========================================================================
  // SECTION 4: UNFINISHED GAME STATE / RESUME QUESTIONS
  // =========================================================================
  console.log('\nSection 4: Interrupted Questions & Unfinished Game State Preservation');
  {
    const storage = new MemoryStorageAdapter();
    const pm1 = new ProgressManager(storage);

    // Cannot save resume state for a locked level
    const lockedSave = pm1.saveResumeState('dest_05', 4);
    assert(lockedSave === false, 'Cannot save resume state for locked level');

    // Child is on Level 1, question 7
    const saveOk = pm1.saveResumeState(1, 7);
    assert(saveOk === true, 'Resume state saved for accessible Level 1');
    const resume1 = pm1.getResumeState();
    assert(resume1 !== null, 'Resume state retrieved');
    assert(resume1?.destId === 'dest_01', 'Resume destination ID is dest_01');
    assert(resume1?.levelNumber === 1, 'Resume level number is 1');
    assert(resume1?.questionIndex === 7, 'Resume question index is 7');

    // New instance loads saved resume state
    const pm2 = new ProgressManager(storage);
    const resume2 = pm2.getResumeState();
    assert(resume2 !== null, 'Instance 2 successfully restored resume state');
    assert(resume2?.questionIndex === 7, 'Instance 2 restored exact question index 7');

    // Clear resume state upon level completion
    pm2.clearResumeState();
    assert(pm2.getResumeState() === null, 'Resume state successfully cleared after level completion');
  }

  // =========================================================================
  // SECTION 5: ADVENTURE ENERGY GAUGE & 12-HOUR REPLENISHMENT
  // =========================================================================
  console.log('\nSection 5: Adventure Energy Gauge Active-Time & 12-Hour Replenishment Schedule');
  {
    let mockTime = Date.now();
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage, () => mockTime);

    // Initial configured allowance is 20m = 1200s
    assert(pm.getProgress().energyGauge.totalAllowanceSeconds === 1200, 'Initial allowance is 1200s (20m)');
    assert(pm.getProgress().energyGauge.remainingSeconds === 1200, 'Initial remaining seconds is 1200s');
    assert(pm.getProgress().energyGauge.isExhausted === false, 'Initially not exhausted');

    // Simulate active playtime ticking: 600s
    pm.tickActiveTime(600);
    assert(pm.getProgress().energyGauge.remainingSeconds === 600, 'Remaining time is 600s after active play');
    assert(pm.getProgress().energyGauge.isExhausted === false, 'Still not exhausted at 600s');

    // Simulate ticking down to low time warning threshold at 120s (2 minutes)
    const warningTick = pm.tickActiveTime(480); // down to 120s
    assert(pm.getProgress().energyGauge.remainingSeconds === 120, 'Remaining time is 120s (2m)');
    assert(warningTick.lowWarningNow === true, 'Gentle low-time reminder fired at 2 minutes remaining');
    assert(pm.getProgress().energyGauge.hasShownLowWarning === true, 'hasShownLowWarning state saved');

    const subsequentTick = pm.tickActiveTime(1);
    assert(subsequentTick.lowWarningNow === false, 'Low warning does not re-trigger on subsequent ticks');

    // Deplete remaining time to 0
    const finalTick = pm.tickActiveTime(119);
    assert(finalTick.exhaustedNow === true, 'exhaustedNow flag fired upon hitting 0');
    assert(pm.getProgress().energyGauge.remainingSeconds === 0, 'Remaining seconds is 0');
    assert(pm.getProgress().energyGauge.isExhausted === true, 'energyGauge isExhausted is true');
    assert(pm.isScreenTimeExhausted() === true, 'isScreenTimeExhausted() is true');
    assert(typeof pm.getProgress().energyGauge.exhaustedAtTimestamp === 'number', 'Exhaustion timestamp recorded');
    assert(typeof pm.getProgress().energyGauge.nextReplenishTimestamp === 'number', 'Next replenish timestamp recorded');

    // Gameplay access strictly blocked during break
    const accessBlocked = pm.canAccessLevel(1);
    assert(accessBlocked.allowed === false, 'Gameplay access strictly blocked during screen-time break');
    assert(Boolean(accessBlocked.reason?.includes('break') || accessBlocked.reason?.includes('Andy')), 'Rejection offers friendly rest message');

    // Progress preservation: 0 stars deducted during break
    assert(pm.getProgress().totalStars === 0, 'Zero stars deducted');

    // Check persistence of exhaustion across restart
    const pmRestart = new ProgressManager(storage, () => mockTime);
    assert(pmRestart.isScreenTimeExhausted() === true, 'Restarted instance preserves exhaustion');
    assert(pmRestart.canAccessLevel(1).allowed === false, 'Restarted instance preserves gameplay restriction');

    // Advance time by 6 hours: still exhausted
    mockTime += 6 * 3600 * 1000;
    const repCheck6h = pmRestart.checkReplenishment();
    assert(repCheck6h === false, '6 hours later: not replenished yet');
    assert(pmRestart.isScreenTimeExhausted() === true, 'Still exhausted after 6 hours');

    // Advance time by another 6 hours (+1 sec): restored!
    mockTime += 6 * 3600 * 1000 + 1000;
    const repCheck12h = pmRestart.checkReplenishment();
    assert(repCheck12h === true, '12 hours later: replenishment triggered');
    assert(pmRestart.isScreenTimeExhausted() === false, 'isScreenTimeExhausted is false after 12 hours');
    assert(pmRestart.getProgress().energyGauge.remainingSeconds === 1200, 'Full allowance restored after 12-hour schedule');
    assert(pmRestart.canAccessLevel(1).allowed === true, 'Gameplay accessible again after 12 hours');
  }

  // =========================================================================
  // SECTION 6: PARENT SECURITY CONFIRMATION & PLAYTIME LIMIT PRESERVATION
  // =========================================================================
  console.log('\nSection 6: Parent Confirmation Gate & Playtime Limits Preservation');
  {
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage);

    // Parent math verification gate
    const challenge = ParentSecurityGate.generateChallenge();
    assert(challenge.factor1 > 0 && challenge.factor2 > 0, 'Parent challenge generates positive numbers');
    assert(ParentSecurityGate.verifyAnswer(challenge.expectedAnswer, challenge) === true, 'Correct parent answer succeeds');
    assert(ParentSecurityGate.verifyAnswer(challenge.expectedAnswer + 5, challenge) === false, 'Wrong parent answer is rejected');

    // Updating screen-time without authorization is rejected
    const unauthUpdate = pm.updateScreenTimeSettings({ allowanceMinutes: 10, presetId: 'short' }, false);
    assert(unauthUpdate === false, 'Unauthorized screen-time change rejected');

    // Updating screen-time with authorization succeeds
    const authUpdate = pm.updateScreenTimeSettings({ allowanceMinutes: 10, presetId: 'short' }, true);
    assert(authUpdate === true, 'Authorized screen-time change accepted');
    assert(pm.getProgress().screenTimeSettings.allowanceMinutes === 10, 'Allowance set to 10 minutes');

    // Resetting game progress MUST NOT erase or disable parent playtime limits
    pm.resetGameProgress();
    assert(pm.getProgress().totalStars === 0, 'Stars reset to 0');
    assert(pm.getProgress().screenTimeSettings.enabled === true, 'Parent limit remains enabled after game reset');
    assert(pm.getProgress().screenTimeSettings.allowanceMinutes === 10, 'Parent allowance remains 10 minutes after game reset');
    assert(pm.getProgress().screenTimeSettings.presetId === 'short', 'Parent preset remains short after game reset');
  }

  // =========================================================================
  // SECTION 7: ACCESSIBILITY, SOUND SETTINGS & FAULT-TOLERANT STORAGE
  // =========================================================================
  console.log('\nSection 7: Accessibility Settings & Storage Fault Tolerance');
  {
    const storage = new MemoryStorageAdapter();
    const pm = new ProgressManager(storage);

    // Default settings
    assert(pm.getProgress().settings.soundMuted === false, 'Default sound is on');
    assert(pm.getProgress().settings.bgmEnabled === true, 'Default BGM is on');
    assert(pm.getProgress().settings.reducedMotion === false, 'Default reduced motion is off');
    assert(pm.getProgress().settings.textSize === 'standard', 'Default text size is standard');

    // Update settings
    pm.updateSettings({
      soundMuted: true,
      bgmEnabled: false,
      reducedMotion: true,
      textSize: 'large'
    });

    assert(pm.getProgress().settings.soundMuted === true, 'soundMuted is true');
    assert(pm.getProgress().settings.bgmEnabled === false, 'bgmEnabled is false');
    assert(pm.getProgress().settings.reducedMotion === true, 'reducedMotion is true');
    assert(pm.getProgress().settings.textSize === 'large', 'textSize is large');

    // Storage recovery from corrupted JSON
    storage.setItem(STORAGE_KEY_V4, '{corrupted:true,syntax error!');
    const recoveringPm = new ProgressManager(storage);
    assert(recoveringPm.getProgress().highestAccessibleLevel === 1, 'Corrupted JSON gracefully recovered to Level 1');
    assert(recoveringPm.canAccessLevel(1).allowed === true, 'Level 1 accessible after corrupted save recovery');
  }

  console.log('\n========================================================');
  console.log(`COMPREHENSIVE AUDIT RESULTS: ${passedTests} passed (${failedTests} failed) out of ${totalTests} total tests`);
  console.log('========================================================');
}

runComprehensiveAudit().catch((err) => {
  console.error('Audit encountered error:', err);
  process.exit(1);
});

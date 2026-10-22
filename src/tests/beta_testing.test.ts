import {
  VERIFIED_PUBLIC_BETA_URL,
  BETA_VERSION,
  BETA_TESTING_CHECKLIST,
  loadChecklistProgress,
  saveChecklistProgress,
  saveBetaFeedback,
  getSavedBetaFeedback,
  copyToClipboard
} from '../utils/betaTesting';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`  ✓ PASS: ${message}`);
  }
}

function runBetaTestingSuite() {
  console.log('\n========================================================');
  console.log('RUNNING SHAREABLE & PLAYABLE BETA TEST LINK SUITE');
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

  // --- Suite 1: Verified Public Beta URL & Version ---
  test('Verified Public Beta URL and Stable Production Target', () => {
    assert(typeof VERIFIED_PUBLIC_BETA_URL === 'string', 'Public beta URL is a string');
    assert(VERIFIED_PUBLIC_BETA_URL.startsWith('https://'), 'Public beta URL enforces secure HTTPS');
    assert(VERIFIED_PUBLIC_BETA_URL.includes('asia-northeast1.run.app'), 'Public beta URL points to deployed Cloud Run preview endpoint');
    assert(!VERIFIED_PUBLIC_BETA_URL.includes('localhost'), 'Public beta URL is not localhost');
    assert(BETA_VERSION.startsWith('v1.'), 'Beta version conforms to semantic release format');
    passed += 5;
  });

  // --- Suite 2: 10-Point Beta Testing Checklist Integrity ---
  test('10-Point Beta Testing Checklist Complete & Valid', () => {
    assert(Array.isArray(BETA_TESTING_CHECKLIST), 'Checklist is an array');
    assert(BETA_TESTING_CHECKLIST.length === 10, 'Checklist contains exactly 10 verification points');

    const expectedKeywords = [
      'Shared URL Access',
      'Story & Character Voices',
      'Character Visuals',
      'Adventure Map & Level Locks',
      'Math Questions & Feedback',
      'Progression & Star Rewards',
      'Responsive Mobile & Desktop Layout',
      'Screen-Time & Adventure Energy',
      'Save Persistence on Refresh',
      'Copy Beta Link Functionality'
    ];

    BETA_TESTING_CHECKLIST.forEach((item, index) => {
      assert(Boolean(item.id && item.title && item.description), `Item ${index + 1} has id, title, and description`);
      assert(item.title.includes(expectedKeywords[index]), `Item ${index + 1} matches expected specification: ${expectedKeywords[index]}`);
      passed += 2;
    });
  });

  // --- Suite 3: Local Checklist Persistence ---
  test('Local Checklist Progress Persistence', () => {
    const mockStorage: Record<string, string> = {};
    (globalThis as any).localStorage = {
      getItem: (k: string) => mockStorage[k] || null,
      setItem: (k: string, v: string) => { mockStorage[k] = v; },
      removeItem: (k: string) => { delete mockStorage[k]; }
    };

    saveChecklistProgress({ chk_1_open_url: true, chk_2_intro_voices: true });
    const loaded = loadChecklistProgress();
    assert(loaded.chk_1_open_url === true, 'Checklist item 1 saved and restored');
    assert(loaded.chk_2_intro_voices === true, 'Checklist item 2 saved and restored');
    assert(!loaded.chk_3_character_art, 'Unchecked item remains falsy');
    passed += 3;
  });

  // --- Suite 4: Tester Feedback Privacy & Storage ---
  test('Tester Feedback Anonymous Submission & Storage', () => {
    const mockStorage: Record<string, string> = {};
    (globalThis as any).localStorage = {
      getItem: (k: string) => mockStorage[k] || null,
      setItem: (k: string, v: string) => { mockStorage[k] = v; },
      removeItem: (k: string) => { delete mockStorage[k]; }
    };

    const submission = saveBetaFeedback({
      deviceBrowser: 'iPhone 14 Safari (iOS 17)',
      issueDescription: 'Audio played crisply, verified level 10 celebration crown displayed',
      stepsToReproduce: 'Replayed completed level 10',
      suggestions: 'Add more sound effects for Sancho',
      testedChecklistCount: 10
    });

    assert(Boolean(submission.id), 'Feedback submission receives unique ID');
    assert(Boolean(submission.timestamp), 'Feedback submission receives timestamp');
    assert(submission.deviceBrowser.includes('iPhone'), 'Device/browser stored');
    assert(submission.testedChecklistCount === 10, 'Checklist count recorded');

    const all = getSavedBetaFeedback();
    assert(all.length === 1, 'One feedback entry stored');
    assert(all[0].issueDescription.includes('Audio played crisply'), 'Issue description preserved');
    passed += 6;
  });

  console.log('\n========================================================');
  console.log(`BETA TEST SUITE RESULTS: ${passed} passed (${failed} failed)`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runBetaTestingSuite();

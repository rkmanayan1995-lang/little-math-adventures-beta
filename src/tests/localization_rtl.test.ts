import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  isRTLLanguage,
  SupportedLanguage
} from '../types/localization';
import {
  t,
  TRANSLATIONS,
  applyLanguageDirection,
  TranslationKey
} from '../utils/localization';
import { progressManager } from '../utils/progressManager';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`  FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`  ✓ PASS: ${message}`);
  }
}

function runLocalizationAndRTLSuite() {
  console.log('\n========================================================');
  console.log('RUNNING MULTI-LANGUAGE, ARABIC RTL & SETTINGS TEST SUITE');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    console.log(`\nSuite: ${name}`);
    try {
      fn();
      passed++;
    } catch (err: any) {
      console.error(`  ❌ Suite Error: ${err.message}`);
      failed++;
    }
  }

  // --- Suite 1: Supported Languages Specifications ---
  test('Supported Languages Specifications (7 Languages)', () => {
    assert(SUPPORTED_LANGUAGES.length === 7, 'Exactly 7 languages are supported');

    const expectedCodes: SupportedLanguage[] = ['en', 'fil', 'es', 'ja', 'ko', 'zh', 'ar'];
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expectedCodes.forEach((code) => {
      assert(codes.includes(code), `Language code "${code}" is registered in SUPPORTED_LANGUAGES`);
    });

    assert(DEFAULT_LANGUAGE === 'en', 'Default language is English ("en")');

    // Direction check
    const arLang = SUPPORTED_LANGUAGES.find((l) => l.code === 'ar');
    assert(arLang !== undefined && arLang.direction === 'rtl', 'Arabic is configured with direction="rtl"');

    const ltrCodes: SupportedLanguage[] = ['en', 'fil', 'es', 'ja', 'ko', 'zh'];
    ltrCodes.forEach((code) => {
      const l = SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
      assert(l !== undefined && l.direction === 'ltr', `Language "${code}" is configured with direction="ltr"`);
    });
  });

  // --- Suite 2: RTL Detection Helper ---
  test('RTL Detection Helper Function (isRTLLanguage)', () => {
    assert(isRTLLanguage('ar') === true, 'isRTLLanguage("ar") returns true');
    assert(isRTLLanguage('en') === false, 'isRTLLanguage("en") returns false');
    assert(isRTLLanguage('fil') === false, 'isRTLLanguage("fil") returns false');
    assert(isRTLLanguage('es') === false, 'isRTLLanguage("es") returns false');
    assert(isRTLLanguage('ja') === false, 'isRTLLanguage("ja") returns false');
    assert(isRTLLanguage('ko') === false, 'isRTLLanguage("ko") returns false');
    assert(isRTLLanguage('zh') === false, 'isRTLLanguage("zh") returns false');
  });

  // --- Suite 3: Native Language Names & Labels ---
  test('Native Language Names in Language Selector', () => {
    const ar = SUPPORTED_LANGUAGES.find((l) => l.code === 'ar');
    assert(ar?.nativeName === 'العربية', 'Arabic displays native name "العربية"');

    const ja = SUPPORTED_LANGUAGES.find((l) => l.code === 'ja');
    assert(ja?.nativeName === '日本語', 'Japanese displays native name "日本語"');

    const ko = SUPPORTED_LANGUAGES.find((l) => l.code === 'ko');
    assert(ko?.nativeName === '한국어', 'Korean displays native name "한국어"');

    const zh = SUPPORTED_LANGUAGES.find((l) => l.code === 'zh');
    assert(zh?.nativeName === '简体中文', 'Simplified Chinese displays native name "简体中文"');

    const es = SUPPORTED_LANGUAGES.find((l) => l.code === 'es');
    assert(es?.nativeName === 'Español', 'Spanish displays native name "Español"');

    const fil = SUPPORTED_LANGUAGES.find((l) => l.code === 'fil');
    assert(fil?.nativeName === 'Filipino', 'Filipino displays native name "Filipino"');
  });

  // --- Suite 4: Translation Dictionary Completeness & Fallbacks ---
  test('Translation Dictionary Completeness across All 7 Languages', () => {
    const enKeys = Object.keys(TRANSLATIONS.en) as TranslationKey[];
    assert(enKeys.length >= 40, `At least 40 key UI phrases translated (found ${enKeys.length})`);

    const allLanguages: SupportedLanguage[] = ['en', 'fil', 'es', 'ja', 'ko', 'zh', 'ar'];

    allLanguages.forEach((lang) => {
      assert(TRANSLATIONS[lang] !== undefined, `Dictionary for "${lang}" exists`);
      enKeys.forEach((key) => {
        const val = TRANSLATIONS[lang][key];
        assert(typeof val === 'string' && val.trim().length > 0, `Key "${key}" has non-empty translation in "${lang}"`);
      });
    });

    // Test t() accessor and fallback
    assert(t('app_title', 'en') === 'Little Math Adventures', 't() returns English app title');
    assert(t('app_title', 'ar') === 'مغامرات الرياضيات الصغيرة', 't() returns Arabic app title');
    assert(t('action_play', 'es') === 'Jugar', 't() returns Spanish play action ("Jugar")');
    assert(t('action_play', 'ja') === 'あそぶ', 't() returns Japanese play action ("あそぶ")');
    assert(t('action_play', 'ko') === '놀기', 't() returns Korean play action ("놀기")');
    assert(t('action_play', 'zh') === '玩游戏', 't() returns Chinese play action ("玩游戏")');
    assert(t('action_play', 'fil') === 'Laro', 't() returns Filipino play action ("Laro")');
    assert(t('action_play', 'ar') === 'العب', 't() returns Arabic play action ("العب")');

    // Test non-existent key fallback
    const fallbackVal = t('non_existent_key_12345' as any, 'ar');
    assert(typeof fallbackVal === 'string', 'Missing key returns fallback string without crashing');
  });

  // --- Suite 5: Settings Integration & State Preservation ---
  test('Language Setting Persistence in PlayerSettings', () => {
    // Check initial settings
    const initialSettings = progressManager.getSettings();
    assert(typeof initialSettings === 'object', 'Settings retrieved successfully');

    // Snapshot stars and destination state before language change
    const initialProgress = progressManager.getProgress();
    const initialStars = initialProgress.totalStars;
    const initialEnergy = initialProgress.energy;
    const initialDestCount = initialProgress.destinations.length;

    // Change language to Arabic ('ar')
    progressManager.updateSettings({ language: 'ar' });
    const updatedSettingsAr = progressManager.getSettings();
    assert(updatedSettingsAr.language === 'ar', 'Language successfully persisted as Arabic ("ar")');

    // Verify progress, stars, levels, and energy are preserved completely intact
    const afterProgressAr = progressManager.getProgress();
    assert(afterProgressAr.totalStars === initialStars, 'Total stars preserved when changing language');
    assert(afterProgressAr.energy === initialEnergy, 'Energy preserved when changing language');
    assert(afterProgressAr.destinations.length === initialDestCount, '10 Level destinations preserved');

    // Change language to Japanese ('ja')
    progressManager.updateSettings({ language: 'ja' });
    assert(progressManager.getSettings().language === 'ja', 'Language switched to Japanese ("ja")');

    // Reset back to English
    progressManager.updateSettings({ language: 'en' });
    assert(progressManager.getSettings().language === 'en', 'Language safely reset to English ("en")');
  });

  // --- Suite 6: HTML Document Direction Switching (applyLanguageDirection) ---
  test('applyLanguageDirection DOM and Class Application', () => {
    // Mock minimal DOM document object if running in Node
    const mockDocument = {
      documentElement: {
        dir: 'ltr',
        lang: 'en',
        classList: {
          classes: new Set<string>(),
          add(c: string) { this.classes.add(c); },
          remove(c: string) { this.classes.delete(c); },
          contains(c: string) { return this.classes.has(c); }
        }
      }
    };

    (globalThis as any).document = mockDocument;

    // Apply Arabic (RTL)
    applyLanguageDirection('ar');
    assert(mockDocument.documentElement.dir === 'rtl', 'Arabic sets document.documentElement.dir = "rtl"');
    assert(mockDocument.documentElement.lang === 'ar', 'Arabic sets document.documentElement.lang = "ar"');
    assert(mockDocument.documentElement.classList.contains('rtl-mode'), 'Arabic adds "rtl-mode" CSS class');

    // Apply Spanish (LTR)
    applyLanguageDirection('es');
    assert(mockDocument.documentElement.dir === 'ltr', 'Spanish sets document.documentElement.dir = "ltr"');
    assert(mockDocument.documentElement.lang === 'es', 'Spanish sets document.documentElement.lang = "es"');
    assert(!mockDocument.documentElement.classList.contains('rtl-mode'), 'Spanish removes "rtl-mode" CSS class');

    // Apply English (LTR)
    applyLanguageDirection('en');
    assert(mockDocument.documentElement.dir === 'ltr', 'English sets document.documentElement.dir = "ltr"');
    assert(mockDocument.documentElement.lang === 'en', 'English sets document.documentElement.lang = "en"');
  });

  console.log('\n========================================================');
  console.log(`LOCALIZATION & RTL TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================\n');

  if (failed > 0) {
    throw new Error(`${failed} localization test(s) failed.`);
  }
}

runLocalizationAndRTLSuite();

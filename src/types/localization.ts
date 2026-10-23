export type SupportedLanguage = 'en' | 'fil' | 'es' | 'ja' | 'ko' | 'zh' | 'ar';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;        // English name
  nativeName: string;  // Native form
  direction: 'ltr' | 'rtl';
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸'
  },
  {
    code: 'fil',
    name: 'Filipino / Tagalog',
    nativeName: 'Filipino',
    direction: 'ltr',
    flag: '🇵🇭'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    flag: '🇪🇸'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    flag: '🇯🇵'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    flag: '🇰🇷'
  },
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    direction: 'ltr',
    flag: '🇨🇳'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦'
  }
];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export function isRTLLanguage(lang: SupportedLanguage): boolean {
  return lang === 'ar';
}

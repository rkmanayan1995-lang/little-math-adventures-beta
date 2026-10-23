import React from 'react';
import { X, Check, Globe } from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, LanguageInfo } from '../../types/localization';
import { t } from '../../utils/localization';
import { soundManager } from '../../utils/soundEffects';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage
}) => {
  if (!isOpen) return null;

  const handleSelect = (lang: SupportedLanguage) => {
    soundManager.playPop();
    onSelectLanguage(lang);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="language-modal-title"
                className="text-lg sm:text-xl font-black font-fredoka tracking-tight text-white"
              >
                {t('settings_select_language', currentLanguage)}
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                {t('settings_language_desc', currentLanguage)}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all cursor-pointer min-w-[40px] min-h-[40px]"
            aria-label={t('action_close', currentLanguage)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5 flex-1">
          {SUPPORTED_LANGUAGES.map((lang: LanguageInfo) => {
            const isSelected = currentLanguage === lang.code;

            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                aria-pressed={isSelected}
                className={`w-full p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all min-h-[52px] cursor-pointer text-left ${
                  isSelected
                    ? 'bg-amber-100/80 border-amber-500 shadow-xs ring-2 ring-amber-300/60'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl" role="img" aria-label={lang.name}>
                    {lang.flag}
                  </span>
                  <div>
                    <div className="text-sm font-black font-fredoka text-slate-900 leading-tight">
                      {lang.nativeName}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500">
                      {lang.name} {lang.direction === 'rtl' ? '• RTL' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-xs font-fredoka shadow-2xs">
                      <Check className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-bold font-fredoka">
                      Select
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black font-fredoka text-sm shadow-md transition-all active:scale-95 cursor-pointer min-h-[44px]"
          >
            {t('action_done', currentLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
};

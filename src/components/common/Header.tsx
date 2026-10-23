import React from 'react';
import { Volume2, VolumeX, Zap, Settings, Wrench, Globe, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';
import { progressManager } from '../../utils/progressManager';
import { EnergyGauge } from '../home/EnergyGauge';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { t } from '../../utils/localization';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../../types/localization';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  soundMuted: boolean;
  setSoundMuted: (muted: boolean) => void;
  energy?: number;
  maxEnergy?: number;
  onOpenSpecsModal?: () => void;
  onOpenSettings?: () => void;
  onOpenDevModal?: () => void;
  onOpenBetaModal?: () => void;
  onOpenLanguageModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundMuted,
  setSoundMuted,
  energy,
  maxEnergy = 5,
  onOpenSpecsModal,
  onOpenSettings,
  onOpenDevModal,
  onOpenBetaModal,
  onOpenLanguageModal
}) => {
  const currentLang: SupportedLanguage = progressManager.getProgress().settings.language || 'en';
  const currentLangInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const navItems = [
    { id: 'home', label: t('nav_home', currentLang) },
    { id: 'map', label: t('nav_map', currentLang) },
    { id: 'engine', label: t('nav_engine', currentLang) },
    { id: 'intro', label: t('nav_intro', currentLang) },
    { id: 'team', label: t('nav_team', currentLang) },
    { id: 'expressions', label: t('nav_expressions', currentLang) },
    { id: 'counting', label: t('nav_counting', currentLang) },
    { id: 'uikit', label: t('nav_uikit', currentLang) },
    { id: 'specs', label: t('nav_specs', currentLang) },
    { id: 'story', label: t('nav_story', currentLang) }
  ];

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setSoundMuted(muted);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Zone 1: Wordmark */}
        <div
          onClick={() => {
            setActiveTab('home');
            soundManager.playPop();
          }}
          className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-amber-400 to-blue-500 flex items-center justify-center text-white font-extrabold text-sm font-fredoka shadow-xs group-hover:scale-105 transition-transform">
            M
          </div>
          <span className="text-sm sm:text-lg font-extrabold tracking-tight text-slate-900 font-fredoka">
            <span className="hidden xs:inline">Little Math Adventures</span>
            <span className="xs:hidden">Math Adv</span>
          </span>
          <span
            onClick={(e) => {
              if (onOpenBetaModal) {
                e.stopPropagation();
                soundManager.playPop();
                onOpenBetaModal();
              }
            }}
            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 hover:bg-blue-200 transition-colors cursor-pointer select-none"
            title="Playable Beta Version - Click to copy link & view tester checklist"
          >
            Beta
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600 font-fredoka">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                soundManager.playPop();
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                activeTab === item.id ? 'text-slate-950 font-black' : ''
              }`}
            >
              <span>{item.label}</span>
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Adventure Energy Gauge & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <EnergyGauge compact />

          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition-all min-w-[40px] min-h-[40px] flex items-center justify-center ${
              !soundMuted
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title={soundMuted ? 'Sound Off (Click to unmute)' : 'Sound On (Click to mute)'}
            aria-label="Toggle game audio"
          >
            {!soundMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <PWAInstallButton variant="secondary" compact className="hidden sm:flex" />

          {/* Conspicuous Language Selector Badge (Globe 🌐 + Flag + Name) */}
          {onOpenLanguageModal && (
            <button
              onClick={() => {
                soundManager.playPop();
                onOpenLanguageModal();
              }}
              className="group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white border-2 border-indigo-200/80 shadow-md hover:shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[44px] min-w-[44px]"
              title={`${t('settings_select_language', currentLang)} — ${currentLangInfo.nativeName} (${currentLangInfo.name})`}
              aria-label={`Change language. Current language: ${currentLangInfo.name}`}
            >
              <div className="w-6 h-6 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30">
                <Globe className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform duration-300" />
              </div>
              <span className="text-base sm:text-lg leading-none drop-shadow-xs select-none" role="img" aria-hidden="true">
                {currentLangInfo.flag}
              </span>
              <span className="font-fredoka font-black text-xs text-white tracking-tight hidden sm:inline">
                {currentLangInfo.nativeName}
              </span>
              <span className="font-fredoka font-black text-[11px] text-white uppercase tracking-wider sm:hidden">
                {currentLangInfo.code}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden md:inline-block shadow-xs" title="Multilingual Ready" />
            </button>
          )}

          {onOpenSettings && (
            <button
              onClick={() => {
                soundManager.playPop();
                onOpenSettings();
              }}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all min-w-[40px] min-h-[40px] flex items-center justify-center active:scale-95 cursor-pointer"
              title="Game & Accessibility Settings"
              aria-label="Open Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {onOpenDevModal && (
            <button
              onClick={() => {
                soundManager.playPop();
                onOpenDevModal();
              }}
              className={`p-2 rounded-xl border transition-all min-w-[40px] min-h-[40px] flex items-center justify-center active:scale-95 ${
                progressManager.isDevModeActive()
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm animate-pulse'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
              title="Developer Testing Mode (Passcode Protected)"
              aria-label="Open Developer Testing Mode"
            >
              <Wrench className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              setActiveTab('specs');
              soundManager.playCelebration();
            }}
            className="hidden sm:flex px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 font-fredoka shadow-xs"
          >
            Asset Guide
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Nav Bar */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2 border-t border-slate-100 overflow-x-auto no-scrollbar bg-slate-50/80">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              soundManager.playPop();
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors whitespace-nowrap font-fredoka shrink-0 ${
              activeTab === item.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};

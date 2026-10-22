import React from 'react';
import { Volume2, VolumeX, Zap, Settings } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';
import { EnergyGauge } from '../home/EnergyGauge';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  soundMuted: boolean;
  setSoundMuted: (muted: boolean) => void;
  energy?: number;
  maxEnergy?: number;
  onOpenSpecsModal?: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundMuted,
  setSoundMuted,
  energy,
  maxEnergy = 5,
  onOpenSpecsModal,
  onOpenSettings
}) => {
  const navItems = [
    { id: 'home', label: '🏠 Home' },
    { id: 'map', label: 'Adventure Map' },
    { id: 'engine', label: 'Math Engine' },
    { id: 'intro', label: 'Story Intro' },
    { id: 'team', label: 'Trio & Roster' },
    { id: 'expressions', label: '5 Expressions' },
    { id: 'counting', label: 'Counting Lab' },
    { id: 'uikit', label: 'UI Kit' },
    { id: 'specs', label: 'Asset Specs' },
    { id: 'story', label: 'Story World' }
  ];

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setSoundMuted(muted);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single text element wordmark */}
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
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 font-fredoka">
            Little Math Adventures
          </span>
        </div>

        {/* Zone 2: 4–6 clean single-line text navigation links */}
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
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
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

          {onOpenSettings && (
            <button
              onClick={() => {
                soundManager.playPop();
                onOpenSettings();
              }}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all min-w-[40px] min-h-[40px] flex items-center justify-center active:scale-95"
              title="Game & Accessibility Settings"
              aria-label="Open Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              setActiveTab('specs');
              soundManager.playCelebration();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 font-fredoka shadow-xs"
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

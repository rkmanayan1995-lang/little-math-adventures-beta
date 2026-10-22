import React, { useState, useEffect } from 'react';
import { CharacterArtSvg } from '../characters/CharacterArtSvg';
import { ExpressionType } from '../../types/creativeFoundation';
import { PlayerProgress } from '../../types/progress';
import { EnergyGauge } from './EnergyGauge';
import { ProgressModal } from './ProgressModal';
import { SettingsModal } from './SettingsModal';
import { soundManager } from '../../utils/soundEffects';
import { progressManager } from '../../utils/progressManager';
import {
  Play,
  Star,
  Settings,
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Trophy,
  Zap,
  Heart,
  ChevronRight,
  Compass
} from 'lucide-react';

interface HomeScreenProps {
  progress: PlayerProgress;
  onPlayAdventure: () => void;
  onReplayStory: () => void;
  onSelectDestination?: (destId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  onPlayAdventure,
  onReplayStory,
  onSelectDestination
}) => {
  // Character expression states on home screen
  const [andyExpr, setAndyExpr] = useState<ExpressionType>('happy');
  const [sanchoExpr, setSanchoExpr] = useState<ExpressionType>('happy');
  const [osiExpr, setOsiExpr] = useState<ExpressionType>('happy');

  // Interactive greeting speech bubble
  const [activeSpeech, setActiveSpeech] = useState<{
    speaker: 'team' | 'andy' | 'sancho' | 'osi';
    name: string;
    text: string;
  }>({
    speaker: 'team',
    name: 'The Math Explorers',
    text: '“Come on in, Little Math Explorer! ✨ Ready to play and learn?”'
  });

  // Modals state
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Derive current destination and resume state label dynamically
  const currentDestination =
    progress.destinations.find((d) => d.id === progress.activeLevelId) ||
    progress.destinations.find((d) => d.number === progress.highestAccessibleLevel) ||
    progress.destinations[0];

  const resumeSubtext = progress.resumeState
    ? `Resume Level ${progress.resumeState.levelNumber} · Question ${progress.resumeState.questionIndex + 1}`
    : `Continue Level ${currentDestination.number} · ${currentDestination.title}`;

  // Resume Web Audio context on any interaction
  const handleInteraction = () => {
    soundManager.resumeContext();
  };

  // Tap Andy
  const handleTapAndy = () => {
    handleInteraction();
    soundManager.playPop();
    soundManager.playStarSparkle();
    setAndyExpr('celebration');
    progressManager.unlockBadge('math_trio_friend');
    setActiveSpeech({
      speaker: 'andy',
      name: 'Andy',
      text: '“Hi friend! I’m Andy! I love finding shiny numbers and counting stars with you!”'
    });
    soundManager.speak(
      "Hi friend! I'm Andy! I love finding shiny numbers and counting stars with you!",
      'andy'
    );
    setTimeout(() => setAndyExpr('happy'), 3500);
  };

  // Tap Sancho
  const handleTapSancho = () => {
    handleInteraction();
    soundManager.playPop();
    setSanchoExpr('thinking');
    progressManager.unlockBadge('math_trio_friend');
    setActiveSpeech({
      speaker: 'sancho',
      name: 'Sancho',
      text: '“Hello! I’m Sancho! My backpack has plenty of room for all our fun math puzzles!”'
    });
    soundManager.speak(
      "Hello! I'm Sancho! My backpack has plenty of room for all our fun math puzzles!",
      'sancho'
    );
    setTimeout(() => setSanchoExpr('happy'), 3500);
  };

  // Tap Osi
  const handleTapOsi = () => {
    handleInteraction();
    setOsiExpr('celebration');
    progressManager.unlockBadge('math_trio_friend');
    // Authentic friendly dog bark sound effect
    soundManager.playBark(2);
    setActiveSpeech({
      speaker: 'osi',
      name: 'Osi (Puppy)',
      text: '“*Woof woof!* Tail wag! High paw, little explorer! Ready to run and count!”'
    });
    setTimeout(() => setOsiExpr('happy'), 2500);
  };

  // Play Adventure action
  const handlePlayClick = () => {
    handleInteraction();
    // Consume 1 energy if available, or if empty provide friendly auto refill
    if (progress.energy > 0) {
      progressManager.consumeEnergy(1);
    } else {
      progressManager.refillEnergy(1);
    }
    soundManager.playCelebration();
    onPlayAdventure();
  };

  // Refill energy handler
  const handleRefillEnergy = () => {
    progressManager.refillEnergy();
  };

  // Update settings handler
  const handleUpdateSettings = (partial: any) => {
    progressManager.updateSettings(partial);
  };

  // Reset game progress (preserves parent screen-time limits)
  const handleResetProgress = () => {
    progressManager.resetGameProgress();
  };

  return (
    <div
      onClick={handleInteraction}
      className="relative min-h-[660px] sm:min-h-[720px] w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border-2 border-amber-200/80 shadow-2xl bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 flex flex-col justify-between select-none"
    >
      {/* Layer 1: Whimsical Toddler Landscape Artwork (Clean SVG background) */}
      <svg
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="homeSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="60%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>
          <linearGradient id="homeHillFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>
          <linearGradient id="homeHillClose" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FDE047" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect width="1000" height="700" fill="url(#homeSky)" />

        {/* Friendly Morning Sun */}
        <circle cx="160" cy="120" r="110" fill="url(#sunGlow)" />
        <circle cx="160" cy="120" r="48" fill="#FDE047" />

        {/* Soft Fluffy Clouds */}
        <g opacity="0.85">
          <ellipse cx="280" cy="90" rx="60" ry="24" fill="#FFFFFF" />
          <ellipse cx="320" cy="80" rx="40" ry="28" fill="#FFFFFF" />
          <ellipse cx="780" cy="110" rx="75" ry="28" fill="#FFFFFF" />
          <ellipse cx="830" cy="100" rx="50" ry="32" fill="#FFFFFF" />
          <ellipse cx="560" cy="70" rx="45" ry="18" fill="#FFFFFF" opacity="0.6" />
        </g>

        {/* Distant Rainbow Arc */}
        <path
          d="M 50 380 A 450 350 0 0 1 950 380"
          stroke="#F472B6"
          strokeWidth="12"
          fill="none"
          opacity="0.25"
        />
        <path
          d="M 60 380 A 440 340 0 0 1 940 380"
          stroke="#FBBF24"
          strokeWidth="12"
          fill="none"
          opacity="0.25"
        />
        <path
          d="M 70 380 A 430 330 0 0 1 930 380"
          stroke="#60A5FA"
          strokeWidth="12"
          fill="none"
          opacity="0.25"
        />

        {/* Distant Rolling Hills */}
        <path
          d="M 0 460 Q 250 380 500 440 T 1000 420 L 1000 700 L 0 700 Z"
          fill="url(#homeHillFar)"
          opacity="0.75"
        />

        {/* Foreground Meadow Mound */}
        <path
          d="M 0 510 Q 320 440 680 490 T 1000 480 L 1000 700 L 0 700 Z"
          fill="url(#homeHillClose)"
        />

        {/* Playful Garden Daisies */}
        <g transform="translate(100, 540)">
          <circle cx="12" cy="12" r="5" fill="#FEF08A" />
          <circle cx="12" cy="4" r="4" fill="#FFFFFF" />
          <circle cx="20" cy="12" r="4" fill="#FFFFFF" />
          <circle cx="12" cy="20" r="4" fill="#FFFFFF" />
          <circle cx="4" cy="12" r="4" fill="#FFFFFF" />
        </g>
        <g transform="translate(860, 520)">
          <circle cx="12" cy="12" r="5" fill="#FEF08A" />
          <circle cx="12" cy="4" r="4" fill="#FFFFFF" />
          <circle cx="20" cy="12" r="4" fill="#FFFFFF" />
          <circle cx="12" cy="20" r="4" fill="#FFFFFF" />
          <circle cx="4" cy="12" r="4" fill="#FFFFFF" />
        </g>
      </svg>

      {/* Layer 2: Top Bar Controls (Energy Gauge, Progress, Settings) */}
      <div className="relative z-20 px-4 sm:px-6 pt-4 sm:pt-6 flex items-center justify-between gap-3">
        {/* Welcome Tag */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-200 shadow-sm">
          <div className="w-6 h-6 rounded-xl bg-gradient-to-tr from-pink-500 via-amber-400 to-blue-500 flex items-center justify-center text-white text-xs font-black font-fredoka shadow-xs">
            M
          </div>
          <span className="text-xs sm:text-sm font-black text-slate-900 font-fredoka">
            Little Math Adventures
          </span>
        </div>

        {/* Right Top HUD Controls */}
        <div className="flex items-center gap-2">
          {/* Adventure Energy Gauge Indicator */}
          <EnergyGauge />

          {/* Quick Progress Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              setShowProgressModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/90 hover:bg-white border-2 border-amber-300 text-amber-900 font-fredoka text-xs font-black shadow-md hover:scale-105 active:scale-95 transition-all"
            title="View Explorer Progress & Stars"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span className="hidden sm:inline">Progress</span>
            <span className="bg-amber-100 text-amber-950 px-1.5 py-0.5 rounded-full text-[11px]">
              {progress.totalStars}★
            </span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              setShowSettingsModal(true);
            }}
            className="w-10 h-10 rounded-2xl bg-white/90 hover:bg-white border-2 border-slate-300 text-slate-700 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
            title="Game Settings (Sound, Voice & Controls)"
            aria-label="Open Game Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Layer 3: Central Hero Stage: Andy, Sancho, and Osi Together */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2 sm:py-4">
        {/* Interactive Speech Bubble */}
        <div
          onClick={handleInteraction}
          className="relative max-w-lg mb-2 sm:mb-4 px-5 py-3 rounded-2xl bg-white/95 backdrop-blur-md border-3 border-amber-300 shadow-xl text-center cursor-pointer transition-all hover:scale-102"
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-amber-900 font-fredoka mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{activeSpeech.name}</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-900 font-fredoka leading-snug">
            {activeSpeech.text}
          </p>
          <span className="text-[10px] text-slate-400 font-sans block mt-1">
            Tap Andy, Sancho, or Osi to hear them speak!
          </span>

          {/* Speech Bubble Arrow pointing down to characters */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-3 border-b-3 border-amber-300 rotate-45" />
        </div>

        {/* Trio Together Stage */}
        <div className="relative w-full max-w-2xl flex items-end justify-center gap-2 sm:gap-6 mt-1 sm:mt-2">
          {/* Sancho (Left - Boy with neat hair, glasses, cozy blue hoodie) */}
          <div
            onClick={handleTapSancho}
            className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:-translate-y-2 active:scale-95 shrink-0"
            title="Tap Sancho to say hello!"
          >
            <div className="w-28 sm:w-40 h-36 sm:h-52 relative">
              <CharacterArtSvg characterId="sancho" expression={sanchoExpr} />
              {/* Highlight Aura */}
              <div className="absolute -bottom-2 inset-x-4 h-3 bg-blue-900/10 rounded-full blur-xs group-hover:bg-blue-500/20" />
            </div>
            <div className="mt-1 px-3 py-1 rounded-full bg-blue-100/90 border border-blue-200 text-blue-900 font-fredoka text-xs font-black shadow-xs group-hover:bg-blue-200">
              Sancho (6)
            </div>
          </div>

          {/* Osi (Center Front - Adorable Shih Tzu puppy with blue bandana and spectacles) */}
          <div
            onClick={handleTapOsi}
            className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:-translate-y-2 active:scale-95 z-20 -mx-3 sm:-mx-2 shrink-0 mb-1"
            title="Tap Osi for playful barks!"
          >
            <div className="w-22 sm:w-28 h-24 sm:h-32 relative">
              <CharacterArtSvg characterId="osi" expression={osiExpr} />
              {/* Highlight Aura */}
              <div className="absolute -bottom-1 inset-x-2 h-2.5 bg-amber-950/15 rounded-full blur-xs group-hover:bg-amber-500/30" />
            </div>
            <div className="mt-1 px-2.5 py-0.5 rounded-full bg-amber-100/95 border border-amber-300 text-amber-900 font-fredoka text-[11px] font-black shadow-xs group-hover:bg-amber-200 flex items-center gap-1">
              <span>Osi Pup</span>
              <span className="text-[10px]">🐾</span>
            </div>
          </div>

          {/* Andy (Right - Curious girl with bouncy curls, star clip, bubblegum pink outfit) */}
          <div
            onClick={handleTapAndy}
            className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:-translate-y-2 active:scale-95 shrink-0"
            title="Tap Andy to say hello!"
          >
            <div className="w-28 sm:w-40 h-36 sm:h-52 relative">
              <CharacterArtSvg characterId="andy" expression={andyExpr} />
              {/* Highlight Aura */}
              <div className="absolute -bottom-2 inset-x-4 h-3 bg-pink-900/10 rounded-full blur-xs group-hover:bg-pink-500/20" />
            </div>
            <div className="mt-1 px-3 py-1 rounded-full bg-pink-100/90 border border-pink-200 text-pink-900 font-fredoka text-xs font-black shadow-xs group-hover:bg-pink-200">
              Andy (5)
            </div>
          </div>
        </div>
      </div>

      {/* Layer 4: Big Chunky Toddler Action Deck */}
      <div className="relative z-20 bg-white/90 backdrop-blur-md border-t-2 border-amber-200/90 px-4 sm:px-8 py-5 sm:py-6 rounded-b-3xl shadow-lg">
        <div className="max-w-2xl mx-auto flex flex-col gap-3.5">
          {/* Main Giant Play Button */}
          <button
            onClick={handlePlayClick}
            className="w-full py-4 sm:py-5 px-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-fredoka font-black text-xl sm:text-2xl tracking-wide shadow-xl shadow-emerald-700/25 border-b-6 border-emerald-800 active:border-b-2 active:translate-y-1 transition-all flex items-center justify-center gap-3 sm:gap-4 group cursor-pointer"
            aria-label="Play Math Adventure"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <Play className="w-7 h-7 fill-white text-white translate-x-0.5" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="leading-tight drop-shadow-xs">PLAY ADVENTURE</span>
              <span className="text-xs font-bold text-emerald-100/90 font-sans tracking-normal">
                {resumeSubtext}
              </span>
            </div>
            <Sparkles className="w-6 h-6 text-yellow-300 ml-auto group-hover:rotate-12 transition-transform" />
          </button>

          {/* Secondary Action Row: Progress, Replay Story, Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {/* Progress Button */}
            <button
              onClick={() => {
                soundManager.playPop();
                setShowProgressModal(true);
              }}
              className="py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-950 font-fredoka font-black text-sm shadow-sm hover:border-amber-400 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-600 fill-amber-400" />
              <span>My Progress</span>
            </button>

            {/* Replay Story Option */}
            <button
              onClick={() => {
                soundManager.playPop();
                onReplayStory();
              }}
              className="py-3 px-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 text-purple-950 font-fredoka font-black text-sm shadow-sm hover:border-purple-400 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Replay Story</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => {
                soundManager.playPop();
                setShowSettingsModal(true);
              }}
              className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-800 font-fredoka font-black text-sm shadow-sm hover:border-slate-400 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Badges Modal */}
      {showProgressModal && (
        <ProgressModal
          isOpen={true}
          onClose={() => setShowProgressModal(false)}
          progress={progress}
          onSelectDestination={onSelectDestination}
          onPlayAdventure={handlePlayClick}
        />
      )}

      {/* Settings & Voice Direction Modal */}
      {showSettingsModal && (
        <SettingsModal
          isOpen={true}
          onClose={() => setShowSettingsModal(false)}
          settings={progress.settings}
          onUpdateSettings={handleUpdateSettings}
          onResetProgress={handleResetProgress}
          onReplayIntro={onReplayStory}
        />
      )}
    </div>
  );
};

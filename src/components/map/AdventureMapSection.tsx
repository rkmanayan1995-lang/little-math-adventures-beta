import React, { useState } from 'react';
import { MapDestination } from '../../types/creativeFoundation';
import { CharacterArtSvg } from '../characters/CharacterArtSvg';
import { soundManager } from '../../utils/soundEffects';
import { progressManager, LevelAccessResult } from '../../utils/progressManager';
import { LevelQuestModal } from './LevelQuestModal';
import { EnergyGauge } from '../home/EnergyGauge';
import {
  Star,
  Lock,
  Unlock,
  Play,
  MapPin,
  CheckCircle2,
  Sparkles,
  Compass,
  Home,
  Info,
  AlertCircle,
  Trophy,
  ChevronRight,
  List,
  Map as MapIcon,
  Volume2,
  Wrench
} from 'lucide-react';

interface AdventureMapSectionProps {
  onReplayIntro?: () => void;
  onReturnHome?: () => void;
  destinations?: MapDestination[];
  onUpdateDestination?: (destId: string, status: 'locked' | 'unlocked' | 'completed', stars: number) => void;
  energy?: number;
  onConsumeEnergy?: () => boolean;
}

export const AdventureMapSection: React.FC<AdventureMapSectionProps> = ({
  onReplayIntro,
  onReturnHome,
  destinations: propDestinations,
  onUpdateDestination,
  energy,
  onConsumeEnergy
}) => {
  // Always obtain destinations from central progress manager if not provided
  const destinations = propDestinations || progressManager.getProgress().destinations;

  // Selected level for inspection deck (defaults to Level 1 or current unlocked level)
  const initialSelected =
    destinations.find((d) => d.status === 'unlocked')?.id ||
    destinations.find((d) => d.status === 'completed')?.id ||
    'dest_01';
  const [selectedDestId, setSelectedDestId] = useState<string>(initialSelected);

  // Rejection alert message when player attempts to access a locked level
  const [lockRejectionNotice, setLockRejectionNotice] = useState<string | null>(null);

  // Active quest modal state
  const [activeQuestDest, setActiveQuestDest] = useState<MapDestination | null>(null);

  // Mobile layout view mode: 'map' (interactive winding canvas) or 'trail' (vertical step-by-step list)
  const [viewMode, setViewMode] = useState<'map' | 'trail'>('map');

  // Currently inspected destination
  const activeDest = destinations.find((d) => d.id === selectedDestId) || destinations[0];

  // Current adventure position (first available unlocked level, or latest completed)
  const currentTeamDestination =
    destinations.find((d) => d.status === 'unlocked') ||
    destinations.filter((d) => d.status === 'completed').slice(-1)[0] ||
    destinations[0];

  /**
   * Handle selecting a level marker.
   * Central level access check is invoked!
   * If locked: marker is selected to show description, but locked rejection notice is displayed
   * with toddler-friendly guidance on what needs to be completed first.
   */
  const handleSelectNode = (dest: MapDestination) => {
    setSelectedDestId(dest.id);

    // Call central progression level-access function
    const access = progressManager.canAccessLevel(dest.id);

    if (access.allowed) {
      soundManager.playPop();
      setLockRejectionNotice(null);
    } else {
      soundManager.playLockSound(false);
      setLockRejectionNotice(access.reason || `Level ${dest.number} is locked!`);
      // Gentle voice prompt for preschoolers
      soundManager.speak(`Level ${dest.number} is locked! Complete earlier levels first!`, 'sancho');
    }
  };

  /**
   * Handle tapping "Play Level Quest"
   * Central level-access function strictly verifies permission before launching!
   */
  const handlePlayLevel = (dest: MapDestination) => {
    // CENTRAL LEVEL-ACCESS FUNCTION ENFORCEMENT
    const access = progressManager.canAccessLevel(dest.id);

    if (!access.allowed) {
      soundManager.playLockSound(false);
      setLockRejectionNotice(access.reason || `Level ${dest.number} is locked.`);
      soundManager.speak(
        access.reason || `Complete Level ${dest.number - 1} first to unlock this adventure!`,
        'sancho'
      );
      return;
    }

    // Level is accessible (unlocked or replaying completed)
    setLockRejectionNotice(null);

    // Consume energy if available
    if (onConsumeEnergy) {
      onConsumeEnergy();
    } else {
      progressManager.consumeEnergy(1);
    }

    soundManager.playCelebration();
    soundManager.speak(`Let's explore ${dest.title}!`, 'andy');

    // Launch level quest modal
    setActiveQuestDest(dest);
  };

  return (
    <div className="space-y-6">
      {/* Interactive Quest Modal */}
      {activeQuestDest && (
        <LevelQuestModal
          isOpen={true}
          destination={activeQuestDest}
          allDestinations={destinations}
          onClose={() => setActiveQuestDest(null)}
          onLevelCompleted={(destId, stars) => {
            if (onUpdateDestination) {
              onUpdateDestination(destId, 'completed', stars);
            }
          }}
          onStartNextLevel={(nextDest) => {
            const access = progressManager.canAccessLevel(nextDest.id);
            if (access.allowed) {
              setSelectedDestId(nextDest.id);
              setActiveQuestDest(nextDest);
            } else {
              soundManager.playLockSound(false);
              setLockRejectionNotice(access.reason || `Level ${nextDest.number} is locked.`);
            }
          }}
        />
      )}

      {/* Top Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-2">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>10-LEVEL ADVENTURE WORLD</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-fredoka tracking-tight">
            Interactive Adventure Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Follow the winding trail from Sunny Meadow all the way to Math Master Island! Level 1 is ready, and each completed level unlocks the next adventure!
          </p>
        </div>

        {/* Action Controls & View Mode */}
        <div className="flex flex-wrap items-center gap-2 self-start">
          <EnergyGauge compact />

          {onReturnHome && (
            <button
              onClick={() => {
                soundManager.playPop();
                onReturnHome();
              }}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition-all font-fredoka flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <Home className="w-3.5 h-3.5 text-slate-600" />
              <span>Home Screen</span>
            </button>
          )}

          {onReplayIntro && (
            <button
              onClick={() => {
                soundManager.playPop();
                onReplayIntro();
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 transition-all font-fredoka flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-900" />
              <span>Story Intro</span>
            </button>
          )}

          {/* Map vs Vertical Trail toggle for mobile toddlers */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setViewMode('map');
                soundManager.playPop();
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all font-fredoka flex items-center gap-1 ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Winding Map</span>
            </button>
            <button
              onClick={() => {
                setViewMode('trail');
                soundManager.playPop();
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all font-fredoka flex items-center gap-1 ${
                viewMode === 'trail' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Vertical Trail</span>
            </button>
          </div>
        </div>
      </div>

      {/* Developer QA Mode Active Indicator Banner */}
      {progressManager.isDevModeActive() && progressManager.getDevConfig().unlockAllLevels && (
        <div className="bg-amber-100 border-2 border-amber-400 text-amber-950 p-3.5 rounded-2xl text-xs font-bold font-fredoka flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Developer QA Mode: All 10 levels are unlocked for inspection and testing. Child save progress and stars remain preserved.</span>
          </div>
          <span className="text-[10px] bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 font-black">
            QA Unlocked
          </span>
        </div>
      )}

      {/* Adventure Team Banner & Quick Station */}
      <div className="bg-gradient-to-r from-amber-100 via-orange-50 to-emerald-50 border-2 border-amber-300/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Mini Trio Avatar Stack */}
          <div className="flex -space-x-3 shrink-0">
            <div
              onClick={() => {
                soundManager.playPop();
                soundManager.speak("Let's go team!", 'andy');
              }}
              className="w-10 h-10 rounded-full border-2 border-white bg-pink-100 flex items-center justify-center cursor-pointer shadow-xs hover:scale-110 transition-transform"
              title="Andy"
            >
              <span className="text-lg">👧🏽</span>
            </div>
            <div
              onClick={() => {
                soundManager.playPop();
                soundManager.speak("I've got the map ready!", 'sancho');
              }}
              className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center cursor-pointer shadow-xs hover:scale-110 transition-transform"
              title="Sancho"
            >
              <span className="text-lg">👦🏾</span>
            </div>
            <div
              onClick={() => {
                soundManager.playBark(1);
              }}
              className="w-10 h-10 rounded-full border-2 border-white bg-amber-100 flex items-center justify-center cursor-pointer shadow-xs hover:scale-110 transition-transform"
              title="Osi"
            >
              <span className="text-lg">🐶</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-950 font-fredoka">
                Adventure Team: Andy, Sancho, and Osi
              </span>
              <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                Active at Level {currentTeamDestination.number}
              </span>
            </div>
            <p className="text-xs text-amber-900/80 mt-0.5">
              Current destination: <strong>{currentTeamDestination.title}</strong> · Tap any marker to preview!
            </p>
          </div>
        </div>

        {/* Total Progress Milestone */}
        <div className="flex items-center gap-3 shrink-0 text-xs font-bold text-slate-700 bg-white/80 px-3.5 py-1.5 rounded-xl border border-amber-200">
          <div className="flex items-center gap-1 text-amber-600">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>
              {destinations.reduce((s, d) => s + d.starsEarned, 0)} / 30 Stars
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1 text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {destinations.filter((d) => d.status === 'completed').length} / 10 Completed
            </span>
          </div>
        </div>
      </div>

      {/* Rejection Alert Banner (shown when tapping a locked level) */}
      {lockRejectionNotice && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-rose-950 animate-in fade-in duration-200 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-bold text-rose-900 block font-fredoka">
              🔒 Level Access Rejected by Central Progression Function:
            </strong>
            <span className="text-rose-800">{lockRejectionNotice}</span>
          </div>
          <button
            onClick={() => setLockRejectionNotice(null)}
            className="text-xs font-bold text-rose-700 hover:text-rose-950 p-1 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* VIEW MODE 1: Interactive Winding Canvas Map */}
      {viewMode === 'map' && (
        <div className="relative bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-300 shadow-2xl">
          {/* Scrollable container with vertical scroll for tablets/narrow screens */}
          <div className="relative w-full overflow-y-auto max-h-[620px] sm:max-h-[720px] lg:max-h-none">
            <div className="relative w-full min-w-[720px] aspect-[1000/1100]">
              {/* Layer 1: Soft 3D-inspired cartoon background scenery */}
              <svg
                className="absolute inset-0 w-full h-full object-cover"
                viewBox="0 0 1000 1100"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  {/* Gradients */}
                  <linearGradient id="mapSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#312E81" /> {/* Deep indigo space at peak */}
                    <stop offset="25%" stopColor="#4338CA" /> {/* Twilight mountain */}
                    <stop offset="50%" stopColor="#93C5FD" /> {/* Sky blue */}
                    <stop offset="75%" stopColor="#BAE6FD" /> {/* Candy / Lake */}
                    <stop offset="100%" stopColor="#FEF08A" /> {/* Sunny meadow horizon */}
                  </linearGradient>

                  <linearGradient id="meadowGrass" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#86EFAC" />
                    <stop offset="100%" stopColor="#15803D" />
                  </linearGradient>

                  <linearGradient id="forestGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#065F46" />
                  </linearGradient>

                  <linearGradient id="candyHills" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F472B6" />
                    <stop offset="100%" stopColor="#BE185D" />
                  </linearGradient>

                  <linearGradient id="mountainStone" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#A5B4FC" />
                    <stop offset="100%" stopColor="#4338CA" />
                  </linearGradient>

                  <linearGradient id="spaceAtmosphere" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1E1B4B" />
                    <stop offset="100%" stopColor="#312E81" />
                  </linearGradient>
                </defs>

                {/* Sky Base */}
                <rect width="1000" height="1100" fill="url(#mapSkyGrad)" />

                {/* Stars in Space / Summit (Upper region) */}
                <g fill="#FEF08A" opacity="0.8">
                  <circle cx="120" cy="80" r="3" />
                  <circle cx="280" cy="140" r="2.5" />
                  <circle cx="420" cy="60" r="3" />
                  <circle cx="680" cy="90" r="3" />
                  <circle cx="850" cy="70" r="2" />
                  <circle cx="780" cy="190" r="3" />
                  <circle cx="180" cy="220" r="2.5" />
                  <circle cx="560" cy="150" r="2" />
                </g>

                {/* Floating Math Master Island at the very top (Level 10) */}
                <g transform="translate(500, 75)">
                  {/* Golden Halo */}
                  <ellipse cx="0" cy="10" rx="95" ry="32" fill="#FDE047" opacity="0.3" />
                  {/* Floating Rock base */}
                  <path d="M -70 10 Q 0 45 70 10 Q 50 35 0 48 Q -50 35 -70 10 Z" fill="#854D0E" />
                  <ellipse cx="0" cy="10" rx="72" ry="24" fill="#FACC15" />
                  <ellipse cx="0" cy="8" rx="66" ry="20" fill="#FEF08A" />
                  {/* Golden Crown Icon art */}
                  <text x="0" y="5" fontSize="24" textAnchor="middle" dominantBaseline="middle">👑</text>
                  <text x="0" y="-18" fontSize="11" fontWeight="bold" fill="#713F12" textAnchor="middle" fontFamily="Fredoka">MATH MASTER ISLAND</text>
                </g>

                {/* Crystal Castle Silhouette (Level 9, top-right) */}
                <g transform="translate(840, 140)">
                  <polygon points="-30,30 -20,-10 -10,30" fill="#C084FC" />
                  <polygon points="10,30 20,-10 30,30" fill="#C084FC" />
                  <polygon points="-10,30 0,-25 10,30" fill="#E879F9" />
                  <rect x="-25" y="30" width="50" height="35" rx="4" fill="#A855F7" />
                  <text x="0" y="50" fontSize="16" textAnchor="middle">🏰</text>
                </g>

                {/* Rocket Station (Level 8, mid-upper right) */}
                <g transform="translate(640, 240)">
                  <rect x="-35" y="25" width="70" height="15" rx="4" fill="#475569" />
                  <text x="0" y="10" fontSize="26" textAnchor="middle">🚀</text>
                </g>

                {/* Puzzle Mountain (Level 7, mid-upper left) */}
                <path d="M 120 400 L 280 260 L 440 400 Z" fill="url(#mountainStone)" opacity="0.85" />
                <path d="M 220 380 L 320 280 L 400 380 Z" fill="#C7D2FE" opacity="0.6" />

                {/* Starry Lake (Level 6, mid-left) */}
                <g transform="translate(220, 480)">
                  <ellipse cx="0" cy="0" rx="100" ry="45" fill="#0284C7" opacity="0.75" />
                  <ellipse cx="0" cy="0" rx="85" ry="35" fill="#38BDF8" opacity="0.85" />
                  <text x="-40" y="5" fontSize="16">🪷</text>
                  <text x="35" y="-5" fontSize="14">✨</text>
                </g>

                {/* Shape Hills (Level 5, mid-center) */}
                <g transform="translate(540, 560)">
                  <ellipse cx="0" cy="15" rx="110" ry="50" fill="#8B5CF6" opacity="0.6" />
                  <polygon points="-40,15 -10,-25 20,15" fill="#A78BFA" opacity="0.8" />
                  <rect x="25" y="-15" width="30" height="30" rx="4" fill="#C4B5FD" opacity="0.8" />
                </g>

                {/* Candy Valley (Level 4, mid-right) */}
                <g transform="translate(820, 640)">
                  <ellipse cx="0" cy="15" rx="90" ry="45" fill="url(#candyHills)" opacity="0.7" />
                  <text x="-25" y="-5" fontSize="20">🍭</text>
                  <text x="20" y="5" fontSize="18">🍬</text>
                </g>

                {/* Sparkling River & Bridge (Level 3, mid-lower) */}
                <path
                  d="M 50 860 C 250 820 480 840 700 780 C 850 740 950 750 1000 720 L 1000 820 C 900 850 750 840 600 880 C 400 920 200 900 0 960 Z"
                  fill="#0284C7"
                  opacity="0.75"
                />
                {/* Wooden bridge art across river */}
                <g transform="translate(720, 800) rotate(-12)">
                  <rect x="-40" y="-12" width="80" height="24" rx="4" fill="#B45309" stroke="#78350F" strokeWidth="2" />
                  <line x1="-30" y1="-12" x2="-30" y2="12" stroke="#78350F" strokeWidth="2" />
                  <line x1="-10" y1="-12" x2="-10" y2="12" stroke="#78350F" strokeWidth="2" />
                  <line x1="10" y1="-12" x2="10" y2="12" stroke="#78350F" strokeWidth="2" />
                  <line x1="30" y1="-12" x2="30" y2="12" stroke="#78350F" strokeWidth="2" />
                </g>

                {/* Counting Forest (Level 2, lower-mid) */}
                <g transform="translate(420, 880)">
                  <ellipse cx="0" cy="20" rx="100" ry="45" fill="url(#forestGreen)" opacity="0.8" />
                  <text x="-35" y="0" fontSize="22">🍄</text>
                  <text x="25" y="-5" fontSize="18">🌲</text>
                </g>

                {/* Sunny Meadow (Level 1, bottom-left) */}
                <g transform="translate(180, 970)">
                  <ellipse cx="0" cy="20" rx="120" ry="55" fill="url(#meadowGrass)" />
                  <text x="-40" y="-10" fontSize="24">🍎</text>
                  <text x="35" y="5" fontSize="20">🌼</text>
                </g>

                {/* Soft Rolling Ground Base */}
                <path d="M 0 950 Q 250 900 500 940 Q 750 980 1000 920 L 1000 1100 L 0 1100 Z" fill="#15803D" opacity="0.5" />

                {/* THE WINDING PATH CONNECTING ALL 10 LEVELS */}
                {/* Thick background border / trail */}
                <path
                  d="M 180 970 C 280 950 340 920 420 880 C 530 840 620 840 720 800 C 820 760 860 700 820 640 C 780 580 660 600 540 560 C 400 520 300 530 220 480 C 140 420 220 360 320 310 C 440 260 540 280 640 240 C 740 200 800 180 840 150 C 870 120 700 90 500 80"
                  fill="none"
                  stroke="#FEF3C7"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
                {/* Stepping stone dashed inner trail */}
                <path
                  d="M 180 970 C 280 950 340 920 420 880 C 530 840 620 840 720 800 C 820 760 860 700 820 640 C 780 580 660 600 540 560 C 400 520 300 530 220 480 C 140 420 220 360 320 310 C 440 260 540 280 640 240 C 740 200 800 180 840 150 C 870 120 700 90 500 80"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="14 12"
                />
              </svg>

              {/* Layer 2: Interactive DOM Markers for All 10 Destinations */}
              <div className="absolute inset-0 pointer-events-auto">
                {destinations.map((dest) => {
                  const isSelected = selectedDestId === dest.id;
                  const isCompleted = dest.status === 'completed';
                  const isUnlocked = dest.status === 'unlocked';
                  const access = progressManager.canAccessLevel(dest.id);
                  const isQaExempt = progressManager.isDevModeActive() && dest.status === 'locked' && access.allowed;
                  const isLocked = dest.status === 'locked' && !isQaExempt;
                  const isTeamHere = currentTeamDestination.id === dest.id;

                  return (
                    <div
                      key={dest.id}
                      style={{ left: `${dest.xPercent}%`, top: `${dest.yPercent}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20 select-none"
                      onClick={() => handleSelectNode(dest)}
                    >
                      {/* Interactive Marker Pin Button */}
                      <button
                        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 transform font-fredoka font-black text-xl sm:text-2xl shadow-xl active:scale-90 ${
                          isSelected
                            ? 'ring-4 ring-amber-300 scale-125 z-30 shadow-2xl'
                            : 'hover:scale-110'
                        } ${
                          isCompleted
                            ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-3 border-emerald-200'
                            : isUnlocked
                            ? 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-slate-950 border-3 border-amber-200 animate-pulse'
                            : isQaExempt
                            ? 'bg-gradient-to-br from-indigo-700 via-indigo-600 to-amber-600 text-white border-3 border-amber-400 shadow-amber-400/30'
                            : 'bg-slate-700/90 text-slate-400 border-2 border-slate-500'
                        }`}
                        aria-label={`Level ${dest.number}: ${dest.title} (${dest.status}${isQaExempt ? ' - QA Unlocked' : ''})`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
                        ) : isUnlocked ? (
                          <span>{dest.number}</span>
                        ) : isQaExempt ? (
                          <div className="flex flex-col items-center justify-center leading-none">
                            <span>{dest.number}</span>
                            <span className="text-[9px] uppercase tracking-wider text-amber-300 font-sans font-black">QA</span>
                          </div>
                        ) : (
                          <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400" />
                        )}

                        {/* Stars Earned pill badge for Unlocked/Completed */}
                        {!isLocked && (
                          <div className="absolute -top-3 -right-2 flex items-center gap-0.5 bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded-full text-[10px] font-bold shadow-md border border-amber-400/50">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{dest.starsEarned}</span>
                          </div>
                        )}
                      </button>

                      {/* Text Label Beneath Marker */}
                      <div
                        className={`mt-2 px-2.5 py-1 rounded-xl text-xs font-black font-fredoka text-center whitespace-nowrap shadow-md transition-all ${
                          isSelected
                            ? 'bg-white text-slate-900 ring-2 ring-amber-400 scale-105'
                            : isCompleted
                            ? 'bg-emerald-900/90 text-emerald-100'
                            : isUnlocked
                            ? 'bg-amber-100 text-amber-950 border border-amber-300'
                            : isQaExempt
                            ? 'bg-indigo-950 text-amber-300 border border-amber-400/60'
                            : 'bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <span>{dest.number}. {dest.title}</span>
                      </div>

                      {/* Active Adventure Team Tag */}
                      {isTeamHere && (
                        <div className="absolute -bottom-7 flex items-center gap-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider font-fredoka shadow-lg border border-amber-200 animate-bounce">
                          <MapPin className="w-3 h-3" />
                          <span>Team Here</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: Vertical Toddler Step Trail (Touch-Friendly List) */}
      {viewMode === 'trail' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black font-fredoka text-slate-900">
              10-Level Step Trail
            </h3>
            <span className="text-xs font-bold text-slate-500">
              Tap any level to inspect or play!
            </span>
          </div>

          <div className="space-y-3">
            {destinations.map((dest) => {
              const isSelected = selectedDestId === dest.id;
              const isCompleted = dest.status === 'completed';
              const isUnlocked = dest.status === 'unlocked';
              const access = progressManager.canAccessLevel(dest.id);
              const isQaExempt = progressManager.isDevModeActive() && dest.status === 'locked' && access.allowed;
              const isLocked = dest.status === 'locked' && !isQaExempt;

              return (
                <div
                  key={dest.id}
                  onClick={() => handleSelectNode(dest)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50/70 shadow-sm ring-2 ring-amber-300/60'
                      : isCompleted
                      ? 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-300'
                      : isUnlocked
                      ? 'border-amber-200 bg-white hover:border-amber-300'
                      : isQaExempt
                      ? 'border-amber-400/80 bg-indigo-50/60 hover:border-amber-500'
                      : 'border-slate-200 bg-slate-50 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg font-fredoka shrink-0 shadow-xs ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isUnlocked
                          ? 'bg-amber-400 text-slate-950'
                          : isQaExempt
                          ? 'bg-gradient-to-br from-indigo-700 to-amber-600 text-white'
                          : 'bg-slate-300 text-slate-600'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : isUnlocked ? (
                        dest.number
                      ) : isQaExempt ? (
                        <div className="flex flex-col items-center justify-center leading-none">
                          <span className="text-sm font-bold">{dest.number}</span>
                          <span className="text-[8px] uppercase font-sans text-amber-300 font-black">QA</span>
                        </div>
                      ) : (
                        <Lock className="w-5 h-5 text-slate-600" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black font-fredoka text-slate-900">
                          Level {dest.number}: {dest.title}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isUnlocked
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {dest.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {dest.learningGoal}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {!isLocked && (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= dest.starsEarned
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* UNCLUTTERED SELECTED LEVEL INSPECTION & PLAY PANEL */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-extrabold text-white font-fredoka"
                style={{ backgroundColor: activeDest.accentColor || '#10B981' }}
              >
                Level {activeDest.number} of 10
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-bold text-slate-600">
                {activeDest.theme}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  activeDest.status === 'completed'
                    ? 'text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full'
                    : activeDest.status === 'unlocked'
                    ? 'text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full'
                    : progressManager.isDevModeActive() && progressManager.canAccessLevel(activeDest.id).allowed
                    ? 'text-indigo-900 bg-amber-200/90 border border-amber-400 px-2.5 py-0.5 rounded-full'
                    : 'text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full'
                }`}
              >
                {(() => {
                  const access = progressManager.canAccessLevel(activeDest.id);
                  const isQaExempt = progressManager.isDevModeActive() && activeDest.status === 'locked' && access.allowed;
                  if (isQaExempt) return 'QA Unlocked (Test Mode)';
                  if (activeDest.status === 'completed') return 'Completed (Replay Anytime)';
                  if (activeDest.status === 'unlocked') return 'Available to Play';
                  return 'Locked Level';
                })()}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 font-fredoka">
              {activeDest.title}
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              {activeDest.learningGoal}
            </p>
          </div>

          {/* Action Deck: Big Play Button */}
          <div className="flex items-center gap-3">
            {(() => {
              const access = progressManager.canAccessLevel(activeDest.id);
              const isPlayable = access.allowed;
              const isQaExempt = progressManager.isDevModeActive() && activeDest.status === 'locked' && isPlayable;

              if (!isPlayable) {
                return (
                  <button
                    onClick={() => handlePlayLevel(activeDest)}
                    className="px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-2xl text-sm font-extrabold flex items-center gap-2.5 font-fredoka transition-all active:scale-95 shadow-sm"
                  >
                    <Lock className="w-5 h-5 text-slate-600" />
                    <span>Level Locked</span>
                  </button>
                );
              }

              return (
                <button
                  onClick={() => handlePlayLevel(activeDest)}
                  className={`px-7 py-4 text-white rounded-2xl text-base font-black flex items-center gap-2.5 font-fredoka shadow-lg transition-all hover:scale-105 active:scale-95 ${
                    isQaExempt
                      ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-indigo-600 shadow-amber-600/30'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-emerald-600/30'
                  }`}
                >
                  {isQaExempt ? (
                    <>
                      <Wrench className="w-5 h-5 text-amber-200" />
                      <span>QA Test Level Quest</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-white" />
                      <span>
                        {activeDest.status === 'completed' ? 'Replay Level Quest' : 'Play Level Quest!'}
                      </span>
                    </>
                  )}
                </button>
              );
            })()}
          </div>
        </div>

        {/* 3 Detail Metric Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-500 block mb-1">Preschool Math Topic:</span>
            <span className="text-sm font-extrabold text-slate-900 font-fredoka">
              {activeDest.mathTopic}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-500 block mb-1">Stars Collected:</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-5 h-5 ${
                    starIdx <= activeDest.starsEarned
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-slate-300'
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-slate-700 ml-1 font-fredoka">
                {activeDest.starsEarned} / {activeDest.totalStars}
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-500 block mb-1">Adventure Companions:</span>
            <span className="text-xs font-bold text-slate-800">
              Andy, Sancho (Boy), and Osi (Shih Tzu)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

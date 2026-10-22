import React from 'react';
import { PlayerProgress } from '../../types/progress';
import { soundManager } from '../../utils/soundEffects';
import { progressManager } from '../../utils/progressManager';
import {
  Star,
  Trophy,
  Award,
  Zap,
  MapPin,
  CheckCircle2,
  Lock,
  Sparkles,
  X,
  Compass,
  ArrowRight
} from 'lucide-react';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: PlayerProgress;
  onSelectDestination?: (destId: string) => void;
  onPlayAdventure: () => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  progress,
  onSelectDestination,
  onPlayAdventure
}) => {
  if (!isOpen) return null;

  const totalPossibleStars = progress.destinations.length * 3;
  const completedDestinations = progress.destinations.filter((d) => d.status === 'completed').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 px-6 py-4 flex items-center justify-between border-b-2 border-amber-400 text-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center text-amber-600">
              <Trophy className="w-6 h-6 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-fredoka tracking-tight text-slate-950">
                Explorer Progress & Badges
              </h2>
              <p className="text-xs font-bold text-amber-950/80">
                Track your preschool math journey and unlocked stars
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="w-10 h-10 rounded-2xl bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-xs"
            aria-label="Close Progress Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            {/* Total Stars */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3.5 text-center flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mb-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
              <span className="text-2xl font-black text-amber-950 font-fredoka">
                {progress.totalStars} <span className="text-xs font-normal text-amber-700">/ {totalPossibleStars}</span>
              </span>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider font-fredoka">
                Stars Collected
              </span>
            </div>

            {/* Destinations */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3.5 text-center flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mb-1">
                <Compass className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-2xl font-black text-emerald-950 font-fredoka">
                {completedDestinations} <span className="text-xs font-normal text-emerald-700">/ {progress.destinations.length}</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider font-fredoka">
                Completed
              </span>
            </div>

            {/* Energy */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3.5 text-center flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                <Zap className="w-5 h-5 fill-blue-500 text-blue-600" />
              </div>
              <span className="text-2xl font-black text-blue-950 font-fredoka">
                {progress.energy} <span className="text-xs font-normal text-blue-700">/ {progress.maxEnergy}</span>
              </span>
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider font-fredoka">
                Adventure Energy
              </span>
            </div>
          </div>

          {/* Destination Trail Progress */}
          <div>
            <h3 className="text-sm font-black text-slate-800 font-fredoka uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Adventure Map Destinations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {progress.destinations.map((dest) => {
                const isCompleted = dest.status === 'completed';
                const isUnlocked = dest.status === 'unlocked';
                const isLocked = dest.status === 'locked';

                return (
                  <div
                    key={dest.id}
                    onClick={() => {
                      const access = progressManager.canAccessLevel(dest.id);
                      if (access.allowed && onSelectDestination) {
                        soundManager.playPop();
                        onSelectDestination(dest.id);
                        onClose();
                      } else {
                        soundManager.playLockSound(false);
                        soundManager.speak(access.reason || `Level ${dest.number} is locked!`, 'sancho');
                      }
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                      isCompleted
                        ? 'bg-emerald-50/60 border-emerald-300 cursor-pointer'
                        : isUnlocked
                        ? 'bg-amber-50/70 border-amber-300 shadow-xs cursor-pointer hover:border-amber-400'
                        : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm font-fredoka text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: dest.accentColor || '#3B82F6' }}
                      >
                        {dest.number}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-extrabold text-slate-900 font-fredoka truncate">
                          {dest.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {dest.mathTopic}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {isLocked ? (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3].map((starIdx) => (
                            <Star
                              key={starIdx}
                              className={`w-4 h-4 ${
                                starIdx <= dest.starsEarned
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explorer Badges */}
          <div>
            <h3 className="text-sm font-black text-slate-800 font-fredoka uppercase tracking-wider mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Magical Badges</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {progress.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                    badge.unlocked
                      ? 'bg-yellow-50/70 border-yellow-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      badge.unlocked
                        ? 'bg-gradient-to-tr from-yellow-400 to-amber-300 text-amber-950 shadow-xs'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {badge.unlocked ? (
                      <Sparkles className="w-5 h-5" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 font-fredoka flex items-center gap-1.5">
                      <span>{badge.title}</span>
                      {badge.unlocked && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                          Unlocked!
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-snug">
                      {badge.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium">
            Saved on this device · Always kept ready for you
          </div>
          <button
            onClick={() => {
              soundManager.playCelebration();
              onClose();
              onPlayAdventure();
            }}
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black font-fredoka text-sm shadow-md flex items-center gap-2 active:scale-95 transition-all"
          >
            <span>Play Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

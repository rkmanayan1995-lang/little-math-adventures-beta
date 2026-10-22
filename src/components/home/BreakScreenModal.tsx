import React, { useState, useEffect } from 'react';
import { CharacterArtSvg } from '../characters/CharacterArtSvg';
import { progressManager } from '../../utils/progressManager';
import { soundManager } from '../../utils/soundEffects';
import {
  Sun,
  Sparkles,
  Heart,
  Clock,
  ShieldAlert,
  Star,
  Compass,
  Lock,
  Wrench
} from 'lucide-react';
import { ParentSettingsModal } from './ParentSettingsModal';

interface BreakScreenModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onOpenDevModal?: () => void;
}

export const BreakScreenModal: React.FC<BreakScreenModalProps> = ({
  isOpen,
  onOpenDevModal
}) => {
  const [showParentModal, setShowParentModal] = useState(false);
  const [countdown, setCountdown] = useState<{ formatted: string; hours: number; minutes: number }>(() =>
    progressManager.getTimeUntilReplenishment()
  );
  const [hourlyInfo, setHourlyInfo] = useState(() =>
    progressManager.getHourlyReplenishmentInfo()
  );

  // Update replenishment countdown and hourly progress every second
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      progressManager.checkReplenishment();
      setCountdown(progressManager.getTimeUntilReplenishment());
      setHourlyInfo(progressManager.getHourlyReplenishmentInfo());
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const progress = progressManager.getProgress();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="break-title"
    >
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#FFFDF5] via-amber-50/70 to-emerald-50/80 rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col p-6 sm:p-8 text-center select-none">
        {/* Soft Sun Glow Header */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 mx-auto flex items-center justify-center text-amber-900 shadow-md border-3 border-amber-200 animate-pulse">
          <Sun className="w-9 h-9 sm:w-11 sm:h-11" />
        </div>

        {/* Peaceful Rest Illustration: Andy, Sancho, and Osi resting cheerfully */}
        <div className="my-5 bg-white/80 rounded-2xl p-4 border border-amber-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-2 font-fredoka">
            Andy, Sancho, and Osi Resting Cheerful & Happy
          </span>
          <div className="flex items-end justify-center gap-4 sm:gap-6 py-2">
            {/* Sancho resting */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-24 sm:w-22 sm:h-26">
                <CharacterArtSvg characterId="sancho" expression="happy" className="w-full h-full" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 font-fredoka mt-1">Sancho</span>
            </div>

            {/* Andy in center */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-28 sm:w-26 sm:h-30">
                <CharacterArtSvg characterId="andy" expression="happy" className="w-full h-full" />
              </div>
              <span className="text-xs font-black text-amber-950 font-fredoka mt-1">Andy</span>
            </div>

            {/* Osi puppy resting */}
            <div className="flex flex-col items-center">
              <div className="w-18 h-20 sm:w-20 sm:h-22">
                <CharacterArtSvg characterId="osi" expression="happy" className="w-full h-full" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 font-fredoka mt-1">Osi 🐶</span>
            </div>
          </div>
        </div>

        {/* Exact Required Break Message */}
        <div className="space-y-3">
          <h2 id="break-title" className="text-xl sm:text-2xl font-black font-fredoka text-slate-900 tracking-tight leading-snug">
            Time for a Healthy Rest!
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed bg-amber-100/60 p-4 rounded-2xl border border-amber-200/80">
            “Wonderful learning, little explorer! It&apos;s time for Andy, Sancho, and Osi to take a break with you. Let&apos;s stretch, move, play, or explore away from the screen. Your adventure will be ready when it&apos;s time to play again!”
          </p>
        </div>

        {/* Progress Preservation Guarantee & Replenishment Countdown */}
        <div className="mt-5 grid grid-cols-2 gap-3 text-left">
          <div className="bg-white/90 p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-fredoka">
              Progress Preserved
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="text-xs font-black text-slate-800 font-fredoka">
                {progress.totalStars} Stars Safe
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Level {progress.highestAccessibleLevel} ready on return
            </span>
          </div>

          <div className="bg-emerald-50/90 p-3 rounded-2xl border border-emerald-200 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block font-fredoka">
              Hourly Replenishment
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-black text-emerald-950 font-fredoka">
                +{hourlyInfo.hourlyIncrementMinutes}m in {hourlyInfo.formattedNextHour}
              </span>
            </div>
            <span className="text-[10px] text-emerald-700 block mt-0.5">
              Staggered hourly · Full in {countdown.formatted}
            </span>
          </div>
        </div>

        {/* Grown-Ups & Developer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Screen-time limit active for this session
          </span>
          <div className="flex items-center gap-2">
            {onOpenDevModal && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  onOpenDevModal();
                }}
                className="px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-100/90 hover:bg-amber-200 text-amber-950 font-bold text-xs flex items-center gap-1 font-fredoka transition-all active:scale-95"
                title="Developer QA Testing Tools"
              >
                <Wrench className="w-3.5 h-3.5 text-amber-700" />
                <span>Dev QA</span>
              </button>
            )}
            <button
              onClick={() => {
                soundManager.playPop();
                setShowParentModal(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 font-fredoka transition-all active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span>Parents Only</span>
            </button>
          </div>
        </div>
      </div>

      {/* Parent Settings Modal (with math confirmation challenge) */}
      {showParentModal && (
        <ParentSettingsModal
          isOpen={true}
          onClose={() => setShowParentModal(false)}
        />
      )}
    </div>
  );
};

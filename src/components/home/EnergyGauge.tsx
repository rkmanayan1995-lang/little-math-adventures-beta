import React, { useState, useEffect } from 'react';
import { Sun, Star, Clock, Info, Lock, Sparkles, Heart } from 'lucide-react';
import { progressManager } from '../../utils/progressManager';
import { soundManager } from '../../utils/soundEffects';
import { ParentSettingsModal } from './ParentSettingsModal';

interface EnergyGaugeProps {
  compact?: boolean;
  className?: string;
}

export const EnergyGauge: React.FC<EnergyGaugeProps> = ({
  compact = false,
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showParentModal, setShowParentModal] = useState(false);
  const [remaining, setRemaining] = useState(() => progressManager.getRemainingScreenTime());

  // Listen to progressManager changes
  useEffect(() => {
    const unsubscribe = progressManager.subscribe(() => {
      setRemaining(progressManager.getRemainingScreenTime());
    });
    return unsubscribe;
  }, []);

  const progress = progressManager.getProgress();
  const gauge = progress.energyGauge;
  const isExhausted = gauge.isExhausted;

  if (compact) {
    return (
      <>
        <button
          onClick={() => {
            soundManager.playPop();
            setShowTooltip(!showTooltip);
          }}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all font-fredoka text-xs font-bold shadow-2xs active:scale-95 ${
            isExhausted
              ? 'bg-amber-100/90 border-amber-300 text-amber-950'
              : 'bg-emerald-50/90 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
          } ${className}`}
          title="Adventure Energy Gauge (Healthy Playtime Limits)"
          aria-label={`Adventure Energy: ${remaining.formatted} remaining`}
        >
          <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>{remaining.formatted} left</span>
          <div className="w-10 h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300/60 ml-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isExhausted
                  ? 'bg-slate-400'
                  : remaining.percentage <= 20
                  ? 'bg-amber-400'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${remaining.percentage}%` }}
            />
          </div>
        </button>

        {showTooltip && (
          <EnergyInfoPopover
            onClose={() => setShowTooltip(false)}
            onOpenParentSettings={() => {
              setShowTooltip(false);
              setShowParentModal(true);
            }}
          />
        )}

        {showParentModal && (
          <ParentSettingsModal
            isOpen={true}
            onClose={() => setShowParentModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={() => {
          soundManager.playPop();
          setShowTooltip(!showTooltip);
        }}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-amber-300 shadow-md hover:border-amber-400 transition-all cursor-pointer select-none group"
        role="button"
        tabIndex={0}
        aria-label={`Adventure Energy Gauge: ${remaining.formatted} playtime remaining`}
      >
        {/* Soft Sun/Star Icon */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-300 to-yellow-200 flex items-center justify-center text-amber-900 shadow-2xs group-hover:scale-105 transition-transform">
          <Sun className="w-5 h-5 fill-amber-400 text-amber-600" />
        </div>

        {/* Meter Info */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1 text-[11px] font-black tracking-wider text-amber-900 uppercase font-fredoka">
            <span>Adventure Energy</span>
            <Info className="w-3 h-3 text-amber-600" />
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            {/* Visual Progress Bar */}
            <div className="w-20 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isExhausted
                    ? 'bg-slate-300'
                    : remaining.percentage <= 20
                    ? 'bg-amber-400'
                    : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                }`}
                style={{ width: `${remaining.percentage}%` }}
              />
            </div>
            <span className="text-xs font-black text-slate-800 font-fredoka">
              {remaining.formatted} left
            </span>
          </div>
        </div>
      </div>

      {showTooltip && (
        <EnergyInfoPopover
          onClose={() => setShowTooltip(false)}
          onOpenParentSettings={() => {
            setShowTooltip(false);
            setShowParentModal(true);
          }}
        />
      )}

      {showParentModal && (
        <ParentSettingsModal
          isOpen={true}
          onClose={() => setShowParentModal(false)}
        />
      )}
    </div>
  );
};

interface EnergyInfoPopoverProps {
  onClose: () => void;
  onOpenParentSettings: () => void;
}

const EnergyInfoPopover: React.FC<EnergyInfoPopoverProps> = ({
  onClose,
  onOpenParentSettings
}) => {
  const progress = progressManager.getProgress();
  const remaining = progressManager.getRemainingScreenTime();
  const replenishment = progressManager.getTimeUntilReplenishment();
  const hourlyInfo = progressManager.getHourlyReplenishmentInfo();
  const isExhausted = progress.energyGauge.isExhausted;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-5 border-3 border-amber-300 shadow-2xl space-y-3 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500 fill-amber-400" />
            <h4 className="text-sm font-black font-fredoka text-slate-900">
              Adventure Energy Gauge
            </h4>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Adventure Energy measures healthy playtime to keep our math adventures balanced, fun, and restful. It is not a test of ability or learning skill!
        </p>

        <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 space-y-1.5 text-xs">
          <div className="flex justify-between font-bold text-amber-950">
            <span>Remaining Playtime:</span>
            <span>{remaining.formatted}</span>
          </div>
          <div className="flex justify-between text-[11px] text-amber-900/80">
            <span>Configured Session:</span>
            <span>{progress.screenTimeSettings.allowanceMinutes} minutes</span>
          </div>
          {isExhausted && (
            <div className="space-y-0.5 pt-1.5 border-t border-amber-200/60 text-[11px] text-emerald-800 font-bold">
              <div className="flex justify-between">
                <span>Next Hourly Recovery:</span>
                <span>+{hourlyInfo.hourlyIncrementMinutes}m in {hourlyInfo.formattedNextHour}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium text-[10px]">
                <span>Full Allowance (12h):</span>
                <span>{replenishment.formatted}</span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-1 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">
            Parent-controlled limit
          </span>
          <button
            onClick={onOpenParentSettings}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 font-fredoka active:scale-95"
          >
            <Lock className="w-3 h-3 text-slate-500" />
            <span>Parent Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

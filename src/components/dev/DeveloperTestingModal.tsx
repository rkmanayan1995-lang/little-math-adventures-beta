import React, { useState, useEffect } from 'react';
import {
  Wrench,
  ShieldAlert,
  Clock,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  FastForward,
  RotateCcw,
  Zap,
  Eye,
  Sliders,
  X
} from 'lucide-react';
import { progressManager } from '../../utils/progressManager';
import { soundManager } from '../../utils/soundEffects';
import { BetaTestingCard } from '../beta/BetaTestingCard';

interface DeveloperTestingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChecklistModal?: () => void;
}

export const DeveloperTestingModal: React.FC<DeveloperTestingModalProps> = ({
  isOpen,
  onClose,
  onOpenChecklistModal
}) => {
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [devConfig, setDevConfig] = useState(() => progressManager.getDevConfig());
  const [feedback, setFeedback] = useState<string | null>(null);

  // Synchronize state with progressManager
  useEffect(() => {
    const unsubscribe = progressManager.subscribe(() => {
      setDevConfig(progressManager.getDevConfig());
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const success = progressManager.enableDevMode(passcode);
    if (success) {
      soundManager.playCelebration();
      setPasscode('');
      setFeedback('Authorized: Developer QA Testing Mode Enabled!');
      setTimeout(() => setFeedback(null), 2500);
    } else {
      soundManager.playPop();
      setAuthError('Invalid developer passcode. Use authorized QA credentials.');
    }
  };

  const handleToggleBypass = (val: boolean) => {
    progressManager.setDevConfig({ bypassScreenTime: val });
    soundManager.playPop();
  };

  const handleToggleUnlockLevels = (val: boolean) => {
    progressManager.setDevConfig({ unlockAllLevels: val });
    soundManager.playPop();
  };

  const handleToggleInfiniteAllowance = (val: boolean) => {
    progressManager.setDevConfig({ infiniteAllowance: val });
    soundManager.playPop();
  };

  const handleDeactivate = () => {
    progressManager.disableDevMode();
    soundManager.playPop();
    setFeedback('Developer Mode Deactivated. Strict Child Rules Restored.');
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1000);
  };

  const handleSimulateWarning = () => {
    progressManager.devSimulateLowTimeWarning();
    soundManager.playPop();
    setFeedback('Simulated: 2-Minute Low-Time Warning Triggered');
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleSimulateExhaustion = () => {
    progressManager.devSimulateExhaustion();
    soundManager.playPop();
    setFeedback('Simulated: Screen-Time Exhausted (Break Screen Active)');
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleAdvance1Hour = () => {
    progressManager.devAdvanceClock(1);
    soundManager.playCelebration();
    setFeedback('Clock Advanced +1 Hour (Hourly Replenishment Awarded)');
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleAdvance6Hours = () => {
    progressManager.devAdvanceClock(6);
    soundManager.playCelebration();
    setFeedback('Clock Advanced +6 Hours (Halfway Replenishment Awarded)');
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleAdvance12Hours = () => {
    progressManager.devAdvanceClock(12);
    soundManager.playCelebration();
    setFeedback('Clock Advanced +12 Hours (Full Replenishment Completed)');
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleReplenishNow = () => {
    progressManager.devReplenishNow();
    soundManager.playCelebration();
    setFeedback('Energy Gauge Restored to 100% Full Allowance');
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dev-modal-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 px-6 py-4 flex items-center justify-between text-white border-b-2 border-slate-700 select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                Quality Assurance &amp; Debugging
              </span>
              <h2 id="dev-modal-title" className="text-lg font-black font-fredoka flex items-center gap-2">
                <span>Developer Testing Mode</span>
                {devConfig.enabled && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-sans uppercase font-extrabold tracking-wider">
                    Active
                  </span>
                )}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold transition-colors"
            aria-label="Close Developer Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Status feedback message */}
          {feedback && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs rounded-2xl text-center font-fredoka animate-in fade-in flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {!devConfig.enabled ? (
            /* Passcode Authorization Screen */
            <div className="space-y-4 py-2">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 space-y-1.5 leading-relaxed">
                <div className="flex items-center gap-1.5 font-black text-slate-900 font-fredoka text-sm">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Authorized Personnel Only</span>
                </div>
                <p>
                  Developer Testing Mode grants authorized developers and QA engineers unlimited screen time, level unlock overrides, and replenishment simulation tools.
                </p>
                <p className="text-[11px] text-slate-500">
                  Standard child players are strictly protected by standard limits. Enter developer credentials to proceed.
                </p>
              </div>

              <form onSubmit={handleAuthorize} className="space-y-3">
                <div>
                  <label className="text-xs font-black font-fredoka text-slate-800 block mb-1">
                    Enter Developer Passcode:
                  </label>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="e.g. LMA-DEV-2026 or devqa"
                    className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-300 rounded-2xl font-mono text-sm text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-hidden transition-all"
                    autoFocus
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    QA Passcodes: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">LMA-DEV-2026</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">devqa</code>
                  </span>
                </div>

                {authError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs font-fredoka shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4 text-amber-400" />
                  <span>Authorize &amp; Enable Testing Mode</span>
                </button>
              </form>
            </div>
          ) : (
            /* Active Developer Testing Controls */
            <div className="space-y-5">
              {/* Active Warning Banner */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-amber-950">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-black font-fredoka text-amber-900 block">
                    Developer QA Mode Is Currently Active
                  </span>
                  <p className="text-[11px] leading-relaxed text-amber-900/90">
                    Normal screen-time lockouts and progression gates are bypassed for your session. Deactivate when finished to restore strict child protection rules.
                  </p>
                </div>
              </div>

              {/* Toggles Section */}
              <div className="space-y-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 font-fredoka block">
                  Testing Exemptions &amp; Overrides
                </span>

                {/* Toggle 1: Screen-Time Exemption */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <span className="text-xs font-black font-fredoka text-slate-900 block">
                      Bypass Screen-Time Restrictions
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Never block level access even if timer is exhausted
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={devConfig.bypassScreenTime}
                    onChange={(e) => handleToggleBypass(e.target.checked)}
                    className="w-6 h-6 accent-amber-500 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Toggle 2: Infinite Allowance */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <span className="text-xs font-black font-fredoka text-slate-900 block">
                      Infinite Testing Allowance
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Prevent timer depletion ticks during gameplay testing
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={devConfig.infiniteAllowance}
                    onChange={(e) => handleToggleInfiniteAllowance(e.target.checked)}
                    className="w-6 h-6 accent-amber-500 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Toggle 3: QA Level Inspection */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div>
                    <span className="text-xs font-black font-fredoka text-slate-900 block">
                      QA Level Inspection (Unlock All 10 Levels)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Test any map destination without altering child progress
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={devConfig.unlockAllLevels}
                    onChange={(e) => handleToggleUnlockLevels(e.target.checked)}
                    className="w-6 h-6 accent-amber-500 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Simulation Tools */}
              <div className="space-y-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 font-fredoka block">
                  Simulated Conditions &amp; Time Leaps
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleAdvance1Hour}
                    className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition-all active:scale-95 shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs font-fredoka text-slate-800">
                      <FastForward className="w-3.5 h-3.5 text-blue-600" />
                      <span>+1 Hour</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Award 1 hourly recovery increment
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAdvance6Hours}
                    className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition-all active:scale-95 shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs font-fredoka text-slate-800">
                      <FastForward className="w-3.5 h-3.5 text-indigo-600" />
                      <span>+6 Hours</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Advance halfway through recovery
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAdvance12Hours}
                    className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition-all active:scale-95 shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs font-fredoka text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>+12 Hours</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Complete full recovery schedule
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReplenishNow}
                    className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition-all active:scale-95 shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs font-fredoka text-slate-800">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Instant Full Refill</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Restore 100% full allowance
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulateWarning}
                    className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition-all active:scale-95 shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs font-fredoka text-slate-800">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>2-Min Warning</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Test gentle low-time toast
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulateExhaustion}
                    className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-left transition-all active:scale-95 shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 font-black text-xs font-fredoka text-slate-800">
                      <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                      <span>Trigger Exhaustion</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Test cheerful Break Screen
                    </span>
                  </button>
                </div>
              </div>

              {/* Public Beta Link & Tester Management */}
              <div className="pt-2">
                <BetaTestingCard onOpenChecklistModal={onOpenChecklistModal} />
              </div>

              {/* Deactivate Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDeactivate}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-xs font-fredoka shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Deactivate Dev Mode &amp; Restore Strict Child Rules</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const DeveloperActiveBadge: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const [isActive, setIsActive] = useState(() => progressManager.isDevModeActive());

  useEffect(() => {
    const unsubscribe = progressManager.subscribe(() => {
      setIsActive(progressManager.isDevModeActive());
    });
    return unsubscribe;
  }, []);

  if (!isActive) return null;

  return (
    <button
      onClick={() => {
        soundManager.playPop();
        onOpenModal();
      }}
      className="fixed bottom-3 right-3 z-50 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-amber-300 border-2 border-amber-400 rounded-full font-fredoka text-xs font-black shadow-xl flex items-center gap-1.5 backdrop-blur-md transition-transform active:scale-95 animate-pulse"
      title="Developer Testing Mode is Active (Click to configure)"
    >
      <Wrench className="w-3.5 h-3.5 text-amber-400" />
      <span>Dev QA Active</span>
    </button>
  );
};

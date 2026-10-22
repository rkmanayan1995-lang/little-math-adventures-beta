import React, { useState } from 'react';
import {
  progressManager,
  SCREEN_TIME_PRESETS
} from '../../utils/progressManager';
import { ParentSecurityGate, ParentChallenge } from '../../utils/parentSecurity';
import { soundManager } from '../../utils/soundEffects';
import { ScreenTimePresetId } from '../../types/progress';
import {
  X,
  Lock,
  Unlock,
  ShieldCheck,
  Clock,
  Sparkles,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ParentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParentSettingsModal: React.FC<ParentSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [challenge, setChallenge] = useState<ParentChallenge>(() =>
    ParentSecurityGate.generateChallenge()
  );
  const [parentInput, setParentInput] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [gateError, setGateError] = useState<string | null>(null);

  const currentProgress = progressManager.getProgress();
  const screenSettings = currentProgress.screenTimeSettings;

  // Active form state for unlocked settings
  const [selectedPreset, setSelectedPreset] = useState<ScreenTimePresetId>(
    screenSettings.presetId
  );
  const [customMinutes, setCustomMinutes] = useState<number>(
    screenSettings.allowanceMinutes
  );
  const [limitsEnabled, setLimitsEnabled] = useState<boolean>(
    screenSettings.enabled
  );
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = ParentSecurityGate.verifyAnswer(parentInput, challenge);
    if (isCorrect) {
      soundManager.playCelebration();
      setIsUnlocked(true);
      setGateError(null);
    } else {
      soundManager.playLockSound(false);
      setGateError('Incorrect answer. Please solve the math problem to confirm you are a parent.');
      setChallenge(ParentSecurityGate.generateChallenge());
      setParentInput('');
    }
  };

  const handleSelectPreset = (presetKey: ScreenTimePresetId) => {
    setSelectedPreset(presetKey);
    if (presetKey !== 'custom') {
      setCustomMinutes(SCREEN_TIME_PRESETS[presetKey].minutes);
    }
    soundManager.playPop();
  };

  const handleSaveSettings = () => {
    const allowance =
      selectedPreset === 'custom'
        ? Math.max(5, Math.min(120, customMinutes))
        : SCREEN_TIME_PRESETS[selectedPreset].minutes;

    progressManager.updateScreenTimeSettings(
      {
        enabled: limitsEnabled,
        presetId: selectedPreset,
        allowanceMinutes: allowance
      },
      true
    );

    soundManager.playCelebration();
    setFeedbackNotice('Settings saved successfully!');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleManualReplenish = () => {
    progressManager.parentResetEnergyGauge(true);
    soundManager.playCelebration();
    setFeedbackNotice('Energy gauge replenished to full allowance!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="parent-settings-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-indigo-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 px-6 py-4 flex items-center justify-between text-white border-b-2 border-indigo-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              {isUnlocked ? (
                <Unlock className="w-5 h-5 text-emerald-300" />
              ) : (
                <Lock className="w-5 h-5 text-amber-300" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-200 block">
                Parental Controls
              </span>
              <h2 id="parent-settings-title" className="text-lg font-black font-fredoka">
                Healthy Screen-Time Limits
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all active:scale-95"
            aria-label="Close parent settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!isUnlocked ? (
            /* Adult Math Challenge Security Step */
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 mx-auto flex items-center justify-center text-indigo-700 mb-2">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black font-fredoka text-slate-900">
                  Parent Confirmation Required
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
                  To protect screen-time limits from curious little fingers, please solve this math problem:
                </p>
              </div>

              <form onSubmit={handleVerifyGate} className="space-y-4 max-w-xs mx-auto">
                <div className="p-4 bg-slate-50 border-2 border-indigo-200 rounded-2xl">
                  <span className="text-2xl font-black font-fredoka text-indigo-950 block">
                    {challenge.questionText}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {challenge.hintText}
                  </span>
                </div>

                <input
                  type="number"
                  inputMode="numeric"
                  value={parentInput}
                  onChange={(e) => setParentInput(e.target.value)}
                  placeholder="Enter answer"
                  className="w-full text-center text-xl font-bold font-fredoka py-2.5 px-4 rounded-xl border-2 border-slate-300 focus:border-indigo-600 focus:outline-hidden"
                  autoFocus
                />

                {gateError && (
                  <p className="text-xs font-bold text-rose-600 animate-in fade-in">
                    {gateError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-sm font-fredoka shadow-md transition-all active:scale-95"
                >
                  Verify & Open Controls
                </button>
              </form>
            </div>
          ) : (
            /* Unlocked Parent Configuration Panel */
            <div className="space-y-5">
              {/* Essential Parent Disclaimers & Explanations */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 space-y-1.5 text-xs text-amber-950">
                <div className="flex items-center gap-1.5 font-bold font-fredoka text-amber-900">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Important Parent Notes:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-900/90 leading-relaxed">
                  <li>
                    <strong>Game-Level Limit:</strong> This feature limits play within Little Math Adventures only; it is not a system-wide device control.
                  </li>
                  <li>
                    <strong>Staggered 12-Hour Schedule:</strong> Playtime replenishes in 12 equal hourly increments (1/12th of the allowance restored each completed hour) up to the full configured limit.
                  </li>
                  <li>
                    <strong>Offline Prototype:</strong> Timers and local storage can be reset on unmanaged hardware.
                  </li>
                </ul>
              </div>

              {/* Limit Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-xs font-black font-fredoka text-slate-900 block">
                    Enable Healthy Screen-Time Limits
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Gently pauses play when daily allowance runs out
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={limitsEnabled}
                  onChange={(e) => setLimitsEnabled(e.target.checked)}
                  className="w-6 h-6 accent-indigo-600 rounded-lg cursor-pointer"
                />
              </div>

              {/* Allowance Presets */}
              <div className="space-y-2">
                <label className="text-xs font-black font-fredoka text-slate-800 block">
                  Select Playtime Allowance:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(SCREEN_TIME_PRESETS) as ScreenTimePresetId[]).map((key) => {
                    const preset = SCREEN_TIME_PRESETS[key];
                    const isSelected = selectedPreset === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectPreset(key)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black font-fredoka text-slate-900">
                            {preset.label}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                          {preset.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Minutes Input (if custom selected) */}
              {selectedPreset === 'custom' && (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950 font-fredoka">
                      Custom Duration:
                    </span>
                    <span className="text-sm font-black text-indigo-900 font-fredoka">
                      {customMinutes} minutes
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(parseInt(e.target.value, 10))}
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-indigo-800">
                    <span>5 min</span>
                    <span>30 min</span>
                    <span>60 min</span>
                  </div>
                </div>
              )}

              {/* Feedback Notice */}
              {feedbackNotice && (
                <div className="p-3 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl text-center font-fredoka animate-in fade-in">
                  ✓ {feedbackNotice}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs font-fredoka shadow-md transition-all active:scale-95"
                >
                  Save Screen-Time Settings
                </button>

                <button
                  type="button"
                  onClick={handleManualReplenish}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-black text-xs font-fredoka shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  title="Reset energy gauge to full allowance immediately"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replenish Energy Now</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

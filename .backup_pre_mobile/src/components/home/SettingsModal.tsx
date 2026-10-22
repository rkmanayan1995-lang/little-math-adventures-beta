import React, { useState } from 'react';
import { PlayerSettings } from '../../types/progress';
import { soundManager } from '../../utils/soundEffects';
import { ParentSettingsModal } from './ParentSettingsModal';
import {
  Settings,
  Volume2,
  VolumeX,
  Music,
  Mic,
  RotateCcw,
  Sparkles,
  X,
  Check,
  AlertTriangle,
  Lock,
  Wind,
  Type,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PlayerSettings;
  onUpdateSettings: (settings: Partial<PlayerSettings>) => void;
  onResetProgress: () => void;
  onReplayIntro?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetProgress,
  onReplayIntro
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showParentModal, setShowParentModal] = useState(false);
  const [pitch, setPitch] = useState<number>(settings.voicePitch || 1.38);
  const [rate, setRate] = useState<number>(settings.voiceRate || 0.86);

  if (!isOpen) return null;

  // Sound Effects Toggle (Master Audio)
  const handleToggleSound = () => {
    const nextMuted = !settings.soundMuted;
    soundManager.setMuted(nextMuted);
    onUpdateSettings({ soundMuted: nextMuted });
    if (!nextMuted) {
      soundManager.playPop();
    }
  };

  // Background Music Toggle
  const handleToggleBgm = () => {
    const nextBgm = !settings.bgmEnabled;
    onUpdateSettings({ bgmEnabled: nextBgm });
    if (nextBgm && !settings.soundMuted) {
      soundManager.startIntroBgm();
    } else {
      soundManager.stopIntroBgm();
    }
    soundManager.playPop();
  };

  // Reduced Motion Toggle
  const handleToggleReducedMotion = () => {
    const nextMotion = !settings.reducedMotion;
    onUpdateSettings({ reducedMotion: nextMotion });
    soundManager.playPop();
  };

  // Text Size Toggle
  const handleSelectTextSize = (size: 'standard' | 'large') => {
    onUpdateSettings({ textSize: size });
    soundManager.playPop();
  };

  // Voice Settings Handlers
  const handlePitchChange = (newPitch: number) => {
    setPitch(newPitch);
    onUpdateSettings({ voicePitch: newPitch });
    soundManager.updateVoiceSettings('narrator', { pitch: newPitch });
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    onUpdateSettings({ voiceRate: newRate });
    soundManager.updateVoiceSettings('narrator', { rate: newRate });
  };

  const handleTestVoice = () => {
    soundManager.speak(
      "Hello little explorer! Let's count some magical numbers today!",
      'narrator',
      { customPitch: pitch, customRate: rate }
    );
  };

  // Replay Story Introduction
  const handleReplayIntroClick = () => {
    soundManager.playCelebration();
    onClose();
    if (onReplayIntro) {
      onReplayIntro();
    }
  };

  // Reset Game Progress Confirmation
  const confirmReset = () => {
    soundManager.playPop();
    onResetProgress();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 id="settings-modal-title" className="text-xl font-black font-fredoka tracking-tight text-white">
                  Game Settings & Accessibility
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  Sound, visual comfort, story replay, and parent limits
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.playPop();
                onClose();
              }}
              className="w-11 h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 min-w-[44px] min-h-[44px]"
              aria-label="Close Settings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Settings Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
            {/* 1. Audio & Music Controls */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider font-fredoka">
                Audio & Music Settings
              </h3>

              {/* Sound Effects Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      !settings.soundMuted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {!settings.soundMuted ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 font-fredoka">
                      Game Sound Effects: {!settings.soundMuted ? 'On' : 'Off'}
                    </div>
                    <div className="text-xs text-slate-500">Pops, chimes, dog barks, and sparkles</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleSound}
                  aria-pressed={!settings.soundMuted}
                  aria-label={`Toggle Sound Effects. Currently ${!settings.soundMuted ? 'On' : 'Off'}`}
                  className={`w-16 h-10 rounded-full transition-colors relative p-1 min-h-[40px] ${
                    !settings.soundMuted ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full bg-white shadow-md transform transition-transform ${
                      !settings.soundMuted ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Background Music Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      settings.bgmEnabled ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 font-fredoka">
                      Background Music: {settings.bgmEnabled ? 'On' : 'Off'}
                    </div>
                    <div className="text-xs text-slate-500">Soft whimsy melody behind story & map</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleBgm}
                  aria-pressed={settings.bgmEnabled}
                  aria-label={`Toggle Background Music. Currently ${settings.bgmEnabled ? 'On' : 'Off'}`}
                  className={`w-16 h-10 rounded-full transition-colors relative p-1 min-h-[40px] ${
                    settings.bgmEnabled ? 'bg-purple-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full bg-white shadow-md transform transition-transform ${
                      settings.bgmEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 2. Visual & Accessibility Comfort */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider font-fredoka">
                Visual Comfort & Accessibility
              </h3>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      settings.reducedMotion ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 font-fredoka">
                      Reduced Motion: {settings.reducedMotion ? 'On' : 'Off'}
                    </div>
                    <div className="text-xs text-slate-500">
                      Disables bouncing, spinning, and zoom animations for calm viewing
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleReducedMotion}
                  aria-pressed={settings.reducedMotion}
                  aria-label={`Toggle Reduced Motion. Currently ${settings.reducedMotion ? 'On' : 'Off'}`}
                  className={`w-16 h-10 rounded-full transition-colors relative p-1 min-h-[40px] ${
                    settings.reducedMotion ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full bg-white shadow-md transform transition-transform ${
                      settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Text Size (Standard vs Large Text) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Type className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900 font-fredoka">
                      Text Size & Legibility
                    </div>
                    <div className="text-xs text-slate-500">
                      Enlarge text across instructions and questions without overlapping buttons
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectTextSize('standard')}
                    className={`py-2.5 px-3 rounded-xl border-2 font-fredoka text-xs font-black flex items-center justify-center gap-1.5 min-h-[44px] transition-all ${
                      settings.textSize === 'standard'
                        ? 'bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {settings.textSize === 'standard' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    <span>Standard Text</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTextSize('large')}
                    className={`py-2.5 px-3 rounded-xl border-2 font-fredoka text-sm font-black flex items-center justify-center gap-1.5 min-h-[44px] transition-all ${
                      settings.textSize === 'large'
                        ? 'bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {settings.textSize === 'large' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    <span>Large Text</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Replay Story Introduction */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider font-fredoka">
                Story Exploration
              </h3>
              <button
                type="button"
                onClick={handleReplayIntroClick}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-100 via-pink-100 to-amber-50 border-2 border-amber-300 hover:border-amber-400 text-slate-900 font-fredoka font-black text-sm flex items-center justify-between transition-all active:scale-98 shadow-xs min-h-[48px]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span>Replay Story Introduction</span>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-white/70 px-2.5 py-1 rounded-xl">
                  5 Scenes
                </span>
              </button>
            </div>

            {/* 4. Parent-Controlled Playtime Limits */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider font-fredoka">
                Parental Controls
              </h3>
              <button
                type="button"
                onClick={() => {
                  soundManager.playPop();
                  setShowParentModal(true);
                }}
                className="w-full p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 hover:border-indigo-300 text-indigo-950 font-fredoka font-black text-sm flex items-center justify-between transition-all active:scale-98 shadow-xs min-h-[48px]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="leading-tight">Adventure Energy & Screen-Time Limits</div>
                    <div className="text-[11px] text-indigo-700 font-normal">
                      Configurable session allowance & manual replenishment
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-800 bg-white/80 px-2.5 py-1 rounded-xl shrink-0">
                  Parents Only
                </span>
              </button>
            </div>

            {/* 5. Voiceover Pacing & Fine-Tuning */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider font-fredoka">
                  Voice Pacing & Tone
                </h3>
                <button
                  type="button"
                  onClick={handleTestVoice}
                  className="text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1 font-fredoka transition-colors min-h-[36px]"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Test Voice</span>
                </button>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-4">
                {/* Pitch Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-amber-950 mb-1.5 font-fredoka">
                    <span>Voice Pitch (Toddler Style):</span>
                    <span>{pitch.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="1.6"
                    step="0.05"
                    value={pitch}
                    onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-8"
                    aria-label="Voice Pitch"
                  />
                </div>

                {/* Rate Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-amber-950 mb-1.5 font-fredoka">
                    <span>Speaking Speed (Preschool Pacing):</span>
                    <span>{rate.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.1"
                    step="0.05"
                    value={rate}
                    onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-8"
                    aria-label="Speaking Speed"
                  />
                </div>
              </div>
            </div>

            {/* 6. Reset Game Progress with Explicit Confirmation */}
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider font-fredoka mb-2">
                Reset Adventure Progress
              </h3>

              {!showResetConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full py-3 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold font-fredoka flex items-center justify-center gap-2 transition-colors min-h-[44px]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Adventure Progress (Start Fresh)</span>
                </button>
              ) : (
                <div className="p-4 bg-rose-100/80 border-2 border-rose-300 rounded-2xl space-y-3 animate-in fade-in">
                  <div className="flex items-start gap-2.5 text-rose-950 text-xs font-bold">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="block font-black text-rose-900 font-fredoka text-sm">
                        Confirm Resetting Adventure Progress?
                      </span>
                      <p className="text-[11px] text-rose-800 font-normal leading-relaxed">
                        This will reset completed levels and stars so your child can play from Level 1 again.
                        <strong> Note: Parent-controlled screen-time limits will stay active.</strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="button"
                      onClick={confirmReset}
                      className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black font-fredoka shadow-xs transition-colors min-h-[44px]"
                    >
                      Yes, Reset My Adventure
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold font-fredoka transition-colors min-h-[44px]"
                    >
                      Keep Playing
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
            <button
              type="button"
              onClick={() => {
                soundManager.playPop();
                onClose();
              }}
              className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black font-fredoka text-sm shadow-md transition-all active:scale-95 min-h-[44px]"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Parent Settings Modal (with Adult Math Challenge Gate) */}
      {showParentModal && (
        <ParentSettingsModal
          isOpen={true}
          onClose={() => setShowParentModal(false)}
        />
      )}
    </>
  );
};

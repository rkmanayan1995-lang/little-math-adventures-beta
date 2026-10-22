import React, { useState } from 'react';
import { soundManager } from '../../utils/soundEffects';
import {
  Volume2,
  VolumeX,
  Lightbulb,
  Home,
  RotateCcw,
  Pause,
  Play,
  Lock,
  Unlock,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CharacterArtSvg } from '../characters/CharacterArtSvg';

export const UiKitSection: React.FC = () => {
  const [starCount, setStarCount] = useState<number>(3);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [progressVal, setProgressVal] = useState<number>(60);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hintActive, setHintActive] = useState<boolean>(false);

  const handleStarSelect = (count: number) => {
    setStarCount(count);
    if (count > 0) {
      soundManager.playStarSparkle();
    } else {
      soundManager.playPop();
    }
  };

  const handleToggleLock = () => {
    const nextLocked = !isLocked;
    setIsLocked(nextLocked);
    soundManager.playLockSound(!nextLocked);
    if (!nextLocked) {
      soundManager.playStarSparkle();
    }
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setSoundEnabled(!muted);
  };

  const handleTriggerHint = () => {
    setHintActive(!hintActive);
    soundManager.playPop();
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>REAL INTERFACE SYSTEM</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-fredoka tracking-tight">
          Preschool UI Kit & Interface Elements
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Tactile, chunky, pressable components designed for developing fine motor skills. Every element uses real DOM/SVG physics, zero baked text, and high color contrast.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Chunky 3D Action Buttons */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-lg text-slate-900 font-fredoka">
              Chunky 3D Action Buttons
            </h3>
            <span className="text-[11px] font-mono text-slate-400">ui_btn_[type]</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Buttons feature an extrusion bevel shadow (5–8px) and compress downward on press (`active:translate-y-1`), giving instant physical feedback.
          </p>

          <div className="space-y-4">
            {/* Primary Emerald Play Button */}
            <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Primary Action Button:</span>
                <span className="text-[11px] text-slate-500">Green extrusion · White text</span>
              </div>
              <button
                onClick={() => {
                  soundManager.playCelebration();
                }}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 active:translate-y-1 active:shadow-none text-white font-extrabold text-sm rounded-2xl shadow-[0_5px_0_#047857] transition-all font-fredoka flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>LET&apos;S PLAY!</span>
              </button>
            </div>

            {/* Amber Clay Button */}
            <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Secondary Challenge Button:</span>
                <span className="text-[11px] text-slate-500">Warm amber · Soft bevel</span>
              </div>
              <button
                onClick={() => {
                  soundManager.playPop();
                }}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 active:translate-y-1 active:shadow-none text-slate-900 font-extrabold text-sm rounded-2xl shadow-[0_4px_0_#B45309] transition-all font-fredoka flex items-center gap-2"
              >
                <span>COUNT WITH ANDY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Blue Round Circular Icon Buttons */}
            <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Round Floating Controls:</span>
                <span className="text-[11px] text-slate-500">Audio · Hint · Replay</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleSound}
                  className={`p-3 rounded-2xl shadow-[0_4px_0_#1D4ED8] active:translate-y-1 active:shadow-none transition-all ${
                    soundEnabled ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600 shadow-[0_4px_0_#94A3B8]'
                  }`}
                  title="Toggle Sound"
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>

                <button
                  onClick={handleTriggerHint}
                  className={`p-3 rounded-2xl shadow-[0_4px_0_#7E22CE] active:translate-y-1 active:shadow-none transition-all ${
                    hintActive ? 'bg-purple-600 text-amber-300 ring-2 ring-amber-300' : 'bg-purple-500 text-white'
                  }`}
                  title="Hint"
                >
                  <Lightbulb className="w-5 h-5" />
                </button>

                <button
                  onClick={() => soundManager.playPop()}
                  className="p-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-2xl shadow-[0_4px_0_#CBD5E1] active:translate-y-1 active:shadow-none transition-all"
                  title="Replay"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Beveled 3D Star Reward System */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-lg text-slate-900 font-fredoka">
              Level Star Reward System
            </h3>
            <span className="text-[11px] font-mono text-slate-400">ui_reward_star</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Preschoolers earn 1, 2, or 3 chunky golden stars for completing math challenges. Stars pop in with an energetic scale bounce and audio chime.
          </p>

          <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-200/60 flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3].map((starIdx) => {
                const isEarned = starIdx <= starCount;
                return (
                  <button
                    key={starIdx}
                    onClick={() => handleStarSelect(starIdx)}
                    className="group relative cursor-pointer focus:outline-none"
                  >
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-3xl transition-all duration-300 transform ${
                        isEarned
                          ? 'scale-110 drop-shadow-xl animate-bounce'
                          : 'scale-95 opacity-40 hover:opacity-60'
                      }`}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                          <radialGradient id={`starGrad_${starIdx}`} cx="35%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="#FEF08A" />
                            <stop offset="60%" stopColor="#FACC15" />
                            <stop offset="100%" stopColor="#D97706" />
                          </radialGradient>
                        </defs>
                        <path
                          d="M50 8 L62 34 L92 37 L69 57 L76 86 L50 71 L24 86 L31 57 L8 37 L38 34 Z"
                          fill={isEarned ? `url(#starGrad_${starIdx})` : '#CBD5E1'}
                          stroke={isEarned ? '#B45309' : '#94A3B8'}
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />
                        {isEarned && (
                          <circle cx="50" cy="50" r="14" fill="#FFFFFF" opacity="0.3" />
                        )}
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Test Star States:</span>
              {[0, 1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => handleStarSelect(num)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold font-fredoka transition-all ${
                    starCount === num ? 'bg-amber-400 text-slate-900 shadow-sm' : 'bg-white text-slate-600 border'
                  }`}
                >
                  {num} {num === 1 ? 'Star' : 'Stars'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Chunky Padlocks (Unlock & Progression) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-lg text-slate-900 font-fredoka">
              Lock & Progression Mechanism
            </h3>
            <span className="text-[11px] font-mono text-slate-400">ui_lock_[state]</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Friendly rounded locks clearly signal future adventures. Unlocking triggers a satisfying metallic click and hoop rotation.
          </p>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-around gap-6">
            <div className="flex flex-col items-center">
              <div
                onClick={handleToggleLock}
                className={`w-24 h-24 p-4 rounded-3xl cursor-pointer transition-all duration-300 flex items-center justify-center ${
                  isLocked
                    ? 'bg-slate-200 text-slate-600 hover:scale-105'
                    : 'bg-emerald-100 text-emerald-700 ring-4 ring-emerald-300/50 scale-105 shadow-md'
                }`}
              >
                {isLocked ? (
                  <Lock className="w-12 h-12 text-slate-600" />
                ) : (
                  <Unlock className="w-12 h-12 text-emerald-600 animate-pulse" />
                )}
              </div>
              <span className="mt-3 text-xs font-bold text-slate-800 font-fredoka">
                {isLocked ? 'Locked (Next Destination)' : 'Unlocked & Ready to Play!'}
              </span>
              <button
                onClick={handleToggleLock}
                className="mt-2 text-[11px] text-blue-600 hover:underline font-semibold"
              >
                Click to {isLocked ? 'Unlock' : 'Lock'}
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 max-w-xs">
              <p>
                <strong className="text-slate-900">Cognitive clarity:</strong> Locked levels stay visible on the map with a soft desaturated tone to spark natural preschool curiosity.
              </p>
              <p>
                <strong className="text-slate-900">Unlock animation:</strong> Shackle swings 45° upward accompanied by star sparkles.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Progress Indicators & Stepping Stones */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-lg text-slate-900 font-fredoka">
              Progress Indicators & Stepping Stones
            </h3>
            <span className="text-[11px] font-mono text-slate-400">ui_progress_bar</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Visual milestone tracker with Osi Shih Tzu running along the path as challenges are completed.
          </p>

          <div className="p-6 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-6">
            {/* Mascot Progress Track */}
            <div className="relative pt-6">
              {/* Osi Pin moving along bar */}
              <div
                className="absolute top-0 -translate-x-1/2 transition-all duration-300 pointer-events-none"
                style={{ left: `${progressVal}%` }}
              >
                <div className="w-10 h-10">
                  <CharacterArtSvg characterId="osi" expression="happy" />
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-5 bg-white border-2 border-slate-200 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressVal}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 mt-2 font-fredoka">
                <span>Start</span>
                <span>Challenge Progress ({progressVal}%)</span>
                <span>Destination Goal!</span>
              </div>
            </div>

            {/* Stepper Buttons to test progress */}
            <div className="flex items-center justify-center gap-2">
              {[20, 40, 60, 80, 100].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setProgressVal(val);
                    soundManager.playPop();
                    if (val === 100) soundManager.playCelebration();
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold font-fredoka transition-all ${
                    progressVal === val ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 border'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

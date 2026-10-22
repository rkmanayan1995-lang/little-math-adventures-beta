import React, { useState, useEffect, useRef } from 'react';
import { CharacterArtSvg } from '../characters/CharacterArtSvg';
import { CountingObjectArt } from '../counting/CountingObjectsArtSvg';
import { soundManager } from '../../utils/soundEffects';
import { VoiceDirectionModal } from './VoiceDirectionModal';
import {
  Volume2,
  VolumeX,
  FastForward,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Mic,
  MicOff,
  Eye,
  EyeOff,
  Music,
  Sliders
} from 'lucide-react';

interface GameIntroductionProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface DialogueLine {
  speaker: 'narrator' | 'andy' | 'sancho' | 'osi';
  name: string;
  avatarId?: 'andy' | 'sancho' | 'osi';
  text: string;
}

interface SceneData {
  id: number;
  title: string;
  durationMs: number;
  dialogue: DialogueLine[];
  narratorOnlyDialogue: DialogueLine[];
}

const SCENES: SceneData[] = [
  {
    id: 1,
    title: 'A Little World Full of Wonder',
    durationMs: 9500,
    dialogue: [
      {
        speaker: 'narrator',
        name: 'Little Explorer Guide',
        text: '“Hello, little explorer! ✨ Can you see that magical world ahead? It’s filled with exciting numbers, fun puzzles, and amazing adventures waiting to be discovered. Are you ready to explore and learn something wonderful today?”'
      }
    ],
    narratorOnlyDialogue: [
      {
        speaker: 'narrator',
        name: 'Childlike Storyteller',
        text: '“Hello, little explorer! ✨ Can you see that magical world ahead? It’s filled with exciting numbers, fun puzzles, and amazing adventures waiting to be discovered. Are you ready to explore and learn something wonderful today?”'
      }
    ]
  },
  {
    id: 2,
    title: 'Meet Your New Friends',
    durationMs: 9000,
    dialogue: [
      {
        speaker: 'andy',
        name: 'Andy',
        avatarId: 'andy',
        text: '“Hi, friend! I\'m Andy! I\'m so happy you\'re here!”'
      },
      {
        speaker: 'sancho',
        name: 'Sancho',
        avatarId: 'sancho',
        text: '“We have some math puzzles, but we could use a clever helper!”'
      },
      {
        speaker: 'osi',
        name: 'Osi',
        avatarId: 'osi',
        text: '“Woof, woof! Will you help us?”'
      }
    ],
    narratorOnlyDialogue: [
      {
        speaker: 'narrator',
        name: 'Childlike Storyteller',
        text: '“Look over there! Meet your new adventure friends! Andy peeks from behind a friendly tree with a cheerful wave, Sancho is holding a colorful math puzzle, and sweet puppy Osi trots in wagging his tail! They are so happy you are here!”'
      }
    ]
  },
  {
    id: 3,
    title: 'The Big Little Adventure',
    durationMs: 9500,
    dialogue: [
      {
        speaker: 'andy',
        name: 'Andy',
        avatarId: 'andy',
        text: '“Oh! We need to count these apples!”'
      },
      {
        speaker: 'sancho',
        name: 'Sancho',
        avatarId: 'sancho',
        text: '“And there are more puzzles waiting over there!”'
      },
      {
        speaker: 'narrator',
        name: 'Storyteller',
        text: '“With your help, we can count, add, take away, and discover amazing things together. Every little answer helps us move one step further!”'
      }
    ],
    narratorOnlyDialogue: [
      {
        speaker: 'narrator',
        name: 'Childlike Storyteller',
        text: '“Oh look! Shiny red apples are rolling right onto our path! Andy counts them, Sancho is thinking carefully, and little Osi nudges an apple your way! With your help, we can count, add, take away, and discover amazing things together! Every little answer helps us move one step further!”'
      }
    ]
  },
  {
    id: 4,
    title: 'The Invitation',
    durationMs: 8500,
    dialogue: [
      {
        speaker: 'andy',
        name: 'Andy',
        avatarId: 'andy',
        text: '“Will you come explore with us?”'
      },
      {
        speaker: 'sancho',
        name: 'Sancho',
        avatarId: 'sancho',
        text: '“Let\'s figure it out together!”'
      },
      {
        speaker: 'osi',
        name: 'Osi',
        avatarId: 'osi',
        text: '“Come on, come on! Let\'s go!”'
      },
      {
        speaker: 'narrator',
        name: 'Storyteller',
        text: '“Your friends are waiting, little explorer. Let\'s jump into our world and make math an adventure!”'
      }
    ],
    narratorOnlyDialogue: [
      {
        speaker: 'narrator',
        name: 'Childlike Storyteller',
        text: '“See that glowing magical path with numbered stepping stones? Andy, Sancho, and Osi are calling your name! Will you come explore with us? Your friends are waiting, little explorer! Let’s jump into our world and make math an adventure!”'
      }
    ]
  },
  {
    id: 5,
    title: 'Enter Math World',
    durationMs: 8000,
    dialogue: [
      {
        speaker: 'narrator',
        name: 'Storyteller',
        text: '“Ready, Little Explorer? Andy, Sancho, and Osi need your help!”'
      }
    ],
    narratorOnlyDialogue: [
      {
        speaker: 'narrator',
        name: 'Childlike Storyteller',
        text: '“Ready, little explorer? Level one is glowing softly in the number meadow! Andy, Sancho, and Osi need your clever help! Let’s start our adventure together!”'
      }
    ]
  }
];

export const GameIntroduction: React.FC<GameIntroductionProps> = ({ onComplete, onSkip }) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [soundMuted, setSoundMuted] = useState<boolean>(soundManager.getMuted());
  const [narrationTtsEnabled, setNarrationTtsEnabled] = useState<boolean>(true);
  const [narrationMode, setNarrationMode] = useState<'fullNarrator' | 'ensemble'>('fullNarrator');
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [sceneProgress, setSceneProgress] = useState<number>(0);
  const [activeDialogueIdx, setActiveDialogueIdx] = useState<number>(0);
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(-1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  // Helper to retrieve active lines according to selected narration mode
  const getActiveDialogueList = (sceneIdx: number): DialogueLine[] => {
    const targetScene = SCENES[sceneIdx];
    if (!targetScene) return [];
    return narrationMode === 'fullNarrator'
      ? targetScene.narratorOnlyDialogue
      : targetScene.dialogue;
  };

  // Manage continuous soft whimsical background music
  useEffect(() => {
    if (isPlaying && !soundMuted && bgmEnabled) {
      soundManager.startIntroBgm();
    } else {
      soundManager.stopIntroBgm();
    }
    return () => {
      soundManager.stopIntroBgm();
    };
  }, [isPlaying, soundMuted, bgmEnabled]);

  // Check prefers-reduced-motion on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true);
    }
  }, []);

  const scene = SCENES[currentSceneIdx];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnimRef = useRef<number | null>(null);
  const sceneAudioTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Stop any running timers or animations
  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressAnimRef.current) {
      cancelAnimationFrame(progressAnimRef.current);
      progressAnimRef.current = null;
    }
    sceneAudioTimersRef.current.forEach((t) => clearTimeout(t));
    sceneAudioTimersRef.current = [];
  };

  // Smooth, enticing magical transition using background music theme
  const transitionToScene = (nextIdx: number) => {
    clearTimers();
    soundManager.stopSpeech();
    soundManager.playMagicalTransitionTheme();
    setIsTransitioning(true);

    timerRef.current = setTimeout(() => {
      setCurrentSceneIdx(nextIdx);
      timerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 250);
    }, 450);
  };

  // Play audio cues specific to each scene entry
  const playSceneAudio = (sceneIdx: number) => {
    if (sceneIdx === 0) {
      soundManager.playStarWhoosh();
    } else if (sceneIdx === 1) {
      soundManager.playGentleChime();
    } else if (sceneIdx === 2) {
      soundManager.playCountNote(1);
      const t1 = setTimeout(() => soundManager.playCountNote(2), 1200);
      const t2 = setTimeout(() => soundManager.playCountNote(3), 2400);
      sceneAudioTimersRef.current.push(t1, t2);
    } else if (sceneIdx === 3) {
      soundManager.playGentleChime();
    } else if (sceneIdx === 4) {
      soundManager.playCelebration();
    }
  };

  // Play a specific dialogue line with guaranteed NO-CUT completion and synchronized word events
  const playLine = (sceneIdx: number, lineIdx: number) => {
    clearTimers();
    setCurrentWordIdx(-1);

    const lines = getActiveDialogueList(sceneIdx);
    if (!lines || lines.length === 0) return;

    const line = lines[lineIdx];
    if (!line) return;

    const words = line.text.trim().split(/\s+/);
    const cleanText = line.text.replace(/["“”✨]/g, '').trim();

    // Precalculate character offsets of words in cleanText for robust boundary sync
    const cleanWords = cleanText.split(/\s+/);
    const wordSpans: { start: number; end: number }[] = [];
    let searchPos = 0;
    for (const w of cleanWords) {
      const idx = cleanText.indexOf(w, searchPos);
      if (idx !== -1) {
        wordSpans.push({ start: idx, end: idx + w.length });
        searchPos = idx + w.length;
      }
    }

    // Synchronize progress bar
    const totalLinesInScene = lines.length;
    const baseProgress = (lineIdx / totalLinesInScene) * 100;
    setSceneProgress(baseProgress);

    // If Voice narration is enabled and sound is unmuted, speak with real onWord and onEnd events
    if (narrationTtsEnabled && !soundMuted && isPlaying) {
      soundManager.speak(cleanText, line.speaker, {
        onWord: (charIndex) => {
          const matchIdx = wordSpans.findIndex(
            (span) => charIndex >= span.start && charIndex <= span.end + 1
          );
          if (matchIdx !== -1) {
            setCurrentWordIdx(Math.min(matchIdx, words.length - 1));
          }
        },
        onEnd: () => {
          setCurrentWordIdx(words.length);
          setSceneProgress(((lineIdx + 1) / totalLinesInScene) * 100);

          // Breathe pause between speakers to prevent abrupt cutting
          timerRef.current = setTimeout(() => {
            if (lineIdx + 1 < lines.length) {
              setActiveDialogueIdx(lineIdx + 1);
              playLine(sceneIdx, lineIdx + 1);
            } else {
              // Finished all dialogue in this scene - trigger magical transition theme to next scene
              if (sceneIdx < SCENES.length - 1) {
                timerRef.current = setTimeout(() => {
                  transitionToScene(sceneIdx + 1);
                }, 1000);
              }
            }
          }, 500);
        }
      });
    } else if (isPlaying) {
      // Fallback timer when TTS is muted: paced at natural reading speed
      const readDuration = Math.max(3000, words.length * 400 + 1200);
      let startTime = Date.now();

      const animateProgress = () => {
        const elapsed = Date.now() - startTime;
        const linePercent = Math.min(1, elapsed / readDuration);
        const wordIdx = Math.floor(linePercent * words.length);
        setCurrentWordIdx(wordIdx);
        setSceneProgress(baseProgress + (linePercent / totalLinesInScene) * 100);

        if (linePercent < 1) {
          progressAnimRef.current = requestAnimationFrame(animateProgress);
        } else {
          timerRef.current = setTimeout(() => {
            if (lineIdx + 1 < lines.length) {
              setActiveDialogueIdx(lineIdx + 1);
              playLine(sceneIdx, lineIdx + 1);
            } else if (sceneIdx < SCENES.length - 1) {
              transitionToScene(sceneIdx + 1);
            }
          }, 600);
        }
      };

      progressAnimRef.current = requestAnimationFrame(animateProgress);
    }
  };

  // Trigger whenever currentSceneIdx changes, isPlaying toggles, or narrationMode changes
  useEffect(() => {
    setActiveDialogueIdx(0);
    playSceneAudio(currentSceneIdx);

    if (isPlaying) {
      playLine(currentSceneIdx, 0);
    } else {
      clearTimers();
      soundManager.stopSpeech();
    }

    return () => {
      clearTimers();
      soundManager.stopSpeech();
    };
  }, [currentSceneIdx, isPlaying, narrationTtsEnabled, soundMuted, narrationMode]);

  const handleNext = () => {
    soundManager.playPop();
    if (currentSceneIdx < SCENES.length - 1) {
      transitionToScene(currentSceneIdx + 1);
    } else {
      soundManager.playCelebration();
      onComplete();
    }
  };

  const handlePrevious = () => {
    soundManager.playPop();
    if (currentSceneIdx > 0) {
      transitionToScene(currentSceneIdx - 1);
    }
  };

  const handleTogglePlay = () => {
    soundManager.playPop();
    if (isPlaying) {
      soundManager.stopSpeech();
    }
    setIsPlaying(!isPlaying);
  };

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setSoundMuted(muted);
    if (muted) {
      soundManager.stopSpeech();
    }
  };

  const handleToggleTts = () => {
    soundManager.playPop();
    const next = !narrationTtsEnabled;
    setNarrationTtsEnabled(next);
    if (!next) {
      soundManager.stopSpeech();
    } else {
      const activeList = getActiveDialogueList(currentSceneIdx);
      const line = activeList[activeDialogueIdx] || activeList[0];
      if (line) {
        soundManager.speak(line.text.replace(/["“”✨]/g, ''), line.speaker);
      }
    }
  };

  return (
    <div
      onClick={() => soundManager.resumeContext()}
      className="relative min-h-[640px] sm:min-h-[700px] w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border border-slate-300 shadow-2xl bg-slate-900 flex flex-col justify-between select-none"
    >
      {/* Top Overlay Controls Bar */}
      <div className="relative z-30 p-4 sm:p-6 flex items-center justify-between gap-4 bg-gradient-to-b from-black/70 via-black/30 to-transparent">
        {/* Scene Indicator Pills */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold font-fredoka">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Scene {scene.id} of 5</span>
          </div>

          <div className="flex items-center gap-1.5">
            {SCENES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  soundManager.playPop();
                  transitionToScene(idx);
                }}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentSceneIdx
                    ? 'w-8 bg-amber-400'
                    : idx < currentSceneIdx
                    ? 'w-2.5 bg-white/80'
                    : 'w-2.5 bg-white/30'
                }`}
                title={`Jump to Scene ${s.id}: ${s.title}`}
                aria-label={`Jump to Scene ${s.id}`}
              />
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Voice Direction & Script Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              setIsVoiceModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold font-fredoka flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 hover:brightness-105 shadow-sm transition-all"
            title="Open Voiceover & Character Voice Direction Script & Audition Lab"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-950" />
            <span className="hidden sm:inline">Voice Script & Cast</span>
          </button>

          {/* Whimsical BGM Music Toggle */}
          <button
            onClick={() => {
              soundManager.playPop();
              setBgmEnabled(!bgmEnabled);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-fredoka flex items-center gap-1.5 transition-all ${
              bgmEnabled && !soundMuted
                ? 'bg-purple-500/80 text-white shadow-sm'
                : 'bg-white/20 text-white/70 hover:bg-white/30'
            }`}
            title={bgmEnabled ? 'Magical Background Music: ON' : 'Magical Background Music: OFF'}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Music</span>
          </button>

          {/* TTS Narration Toggle */}
          <button
            onClick={handleToggleTts}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-fredoka flex items-center gap-1.5 transition-all ${
              narrationTtsEnabled
                ? 'bg-amber-400 text-slate-900 shadow-sm'
                : 'bg-white/20 text-white/80 hover:bg-white/30'
            }`}
            title={narrationTtsEnabled ? 'Voice Narration is ON' : 'Voice Narration is OFF'}
          >
            {narrationTtsEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Voice Narration</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Toggle Sound"
          >
            {!soundMuted ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Reduced Motion Toggle */}
          <button
            onClick={() => {
              setReducedMotion(!reducedMotion);
              soundManager.playPop();
            }}
            className={`p-2 rounded-xl text-xs font-bold transition-colors ${
              reducedMotion ? 'bg-amber-400 text-slate-900' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            title={reducedMotion ? 'Reduced Motion: ON' : 'Reduced Motion: OFF'}
            aria-label="Toggle Reduced Motion"
          >
            {reducedMotion ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Skip Intro Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              onSkip();
            }}
            className="px-4 py-2 bg-white/25 hover:bg-white/35 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 font-fredoka backdrop-blur-md border border-white/20"
          >
            <span>Skip Intro</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Scene Viewport Stage */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Magical Enticing Crossfade Transition Overlay */}
        <div
          className={`absolute inset-0 z-30 transition-all duration-500 pointer-events-none flex flex-col items-center justify-center bg-radial from-amber-100/70 via-white/85 to-purple-100/60 backdrop-blur-xs ${
            isTransitioning ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-3xl shadow-xl ring-4 ring-amber-300">
              ✨
            </div>
            <span className="font-fredoka font-black text-amber-950 text-sm tracking-wide bg-white/80 px-4 py-1 rounded-full shadow-sm">
              Discovering Next Adventure...
            </span>
          </div>
        </div>
        {/* ========================================================= */}
        {/* SCENE 1: A LITTLE WORLD FULL OF WONDER                     */}
        {/* Glowing star travels through clouds toward magical meadow */}
        {/* ========================================================= */}
        {currentSceneIdx === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Background Sky & Meadows */}
            <svg className="w-full h-full object-cover" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="s1Sky" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#818CF8" />
                  <stop offset="50%" stopColor="#BAE6FD" />
                  <stop offset="100%" stopColor="#FEF08A" />
                </linearGradient>
                <linearGradient id="s1Meadow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#86EFAC" />
                  <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>
                <radialGradient id="starAura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FEF08A" stopOpacity="1" />
                  <stop offset="60%" stopColor="#FACC15" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="1000" height="600" fill="url(#s1Sky)" />

              {/* Rolling Hills & Distant Mountains */}
              <path d="M0 380 Q300 280 600 370 Q850 300 1000 360 L1000 600 L0 600 Z" fill="#93C5FD" opacity="0.5" />
              <path d="M0 420 Q260 340 520 420 Q780 360 1000 400 L1000 600 L0 600 Z" fill="url(#s1Meadow)" />

              {/* Winding Yellow Cobblestone Path */}
              <path
                d="M 120 600 Q 320 480 480 440 T 820 410"
                fill="none"
                stroke="#FEF3C7"
                strokeWidth="50"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path
                d="M 120 600 Q 320 480 480 440 T 820 410"
                fill="none"
                stroke="#FDE68A"
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray="25 15"
              />

              {/* Giant Floating Colorful Numbers in the meadow */}
              <g className={reducedMotion ? '' : 'animate-bounce'} style={{ animationDuration: '3s' }}>
                <text x="240" y="440" fontSize="72" fontWeight="bold" fill="#EC4899" fontFamily="Fredoka, cursive" stroke="#FFFFFF" strokeWidth="4">1</text>
                <text x="480" y="410" fontSize="84" fontWeight="bold" fill="#3B82F6" fontFamily="Fredoka, cursive" stroke="#FFFFFF" strokeWidth="4">2</text>
                <text x="720" y="380" fontSize="96" fontWeight="bold" fill="#10B981" fontFamily="Fredoka, cursive" stroke="#FFFFFF" strokeWidth="4">3</text>
              </g>

              {/* Soft Fluffy Clouds */}
              <g opacity="0.85">
                <ellipse cx="200" cy="140" rx="100" ry="38" fill="#FFFFFF" />
                <ellipse cx="260" cy="120" rx="70" ry="42" fill="#FFFFFF" />
                <ellipse cx="760" cy="160" rx="130" ry="44" fill="#FFFFFF" />
                <ellipse cx="830" cy="140" rx="80" ry="46" fill="#FFFFFF" />
              </g>

              {/* Glowing Traveling Star */}
              <g
                className={reducedMotion ? '' : 'transition-all duration-3000 ease-out'}
                style={{
                  transform: reducedMotion ? 'translate(450px, 220px)' : `translate(${180 + sceneProgress * 4.5}px, ${100 + Math.sin((sceneProgress / 100) * Math.PI) * 120}px)`
                }}
              >
                <circle cx="0" cy="0" r="50" fill="url(#starAura)" />
                <polygon
                  points="0,-25 8,-8 25,-6 12,8 16,25 0,16 -16,25 -12,8 -25,-6 -8,-8"
                  fill="#FFFBEB"
                  stroke="#F59E0B"
                  strokeWidth="3"
                />
                <circle cx="-5" cy="-2" r="2.5" fill="#451A03" />
                <circle cx="5" cy="-2" r="2.5" fill="#451A03" />
                <path d="M-3 4 Q0 7 3 4" stroke="#451A03" strokeWidth="1.8" fill="none" />
              </g>
            </svg>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 2: MEET YOUR NEW FRIENDS                             */}
        {/* Andy peeks from tree & waves, Sancho holds puzzle, Osi trots */}
        {/* ========================================================= */}
        {currentSceneIdx === 1 && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-b from-sky-400/90 via-sky-300/80 to-emerald-200">
            {/* Scenic Background Meadow & Tree */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600">
              {/* Meadow Ground */}
              <ellipse cx="500" cy="620" rx="600" ry="240" fill="#4ADE80" />
              <ellipse cx="500" cy="650" rx="550" ry="200" fill="#22C55E" />

              {/* Friendly Tree on Left where Andy peeks */}
              <rect x="140" y="240" width="40" height="260" rx="12" fill="#78350F" />
              <circle cx="160" cy="220" r="100" fill="#15803D" />
              <circle cx="120" cy="240" r="75" fill="#16A34A" />
              <circle cx="210" cy="230" r="80" fill="#4ADE80" opacity="0.8" />
            </svg>

            {/* Character Actors Layout */}
            <div className="relative z-10 w-full max-w-4xl flex items-end justify-around pb-6 h-full">
              {/* Andy peeking from behind tree and waving happily */}
              <div
                className={`flex flex-col items-center transition-all duration-700 ${
                  reducedMotion ? '' : 'translate-y-0 animate-fadeIn'
                }`}
              >
                <div className="relative w-44 h-64 sm:w-52 sm:h-72">
                  <CharacterArtSvg characterId="andy" expression="happy" />
                </div>
                <div className="mt-2 px-3 py-1 bg-pink-100 border border-pink-300 text-pink-900 rounded-full font-bold text-xs font-fredoka shadow-md">
                  Andy peeks and waves!
                </div>
              </div>

              {/* Sancho holding number puzzle and smiling */}
              <div
                className={`flex flex-col items-center transition-all duration-700 delay-200 ${
                  reducedMotion ? '' : 'translate-y-0 animate-fadeIn'
                }`}
              >
                <div className="relative w-48 h-70 sm:w-56 sm:h-80">
                  <CharacterArtSvg characterId="sancho" expression="encouraging" />
                </div>
                <div className="mt-2 px-3 py-1 bg-blue-100 border border-blue-300 text-blue-900 rounded-full font-bold text-xs font-fredoka shadow-md">
                  Sancho with Math Puzzle!
                </div>
              </div>

              {/* Osi trotting into view with wagging tail */}
              <div
                className={`flex flex-col items-center transition-all duration-700 delay-400 ${
                  reducedMotion ? '' : 'translate-x-0 animate-fadeIn'
                }`}
              >
                <div className="relative w-36 h-44 sm:w-44 sm:h-52">
                  <CharacterArtSvg characterId="osi" expression="celebration" />
                </div>
                <div className="mt-2 px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full font-bold text-xs font-fredoka shadow-md">
                  Osi trots in, tail wagging!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 3: THE BIG LITTLE ADVENTURE                          */}
        {/* Apples roll onto path, Andy counts, Sancho thinks, Osi nudges */}
        {/* ========================================================= */}
        {currentSceneIdx === 2 && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-b from-amber-200/90 via-sky-200/70 to-emerald-300">
            {/* Meadow Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600">
              <path d="M0 380 Q400 320 1000 390 L1000 600 L0 600 Z" fill="#86EFAC" />
              <path d="M 0 540 Q 500 420 1000 500" stroke="#FEF3C7" strokeWidth="120" fill="none" opacity="0.9" />
            </svg>

            <div className="relative z-10 w-full max-w-4xl flex flex-col justify-end h-full pb-4">
              {/* Rolling Apples along path */}
              <div className="flex items-center justify-center gap-6 sm:gap-12 mb-6">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`flex flex-col items-center cursor-pointer transition-all duration-500 transform ${
                      reducedMotion ? '' : 'hover:scale-110 active:scale-95'
                    }`}
                  >
                    <div className="mb-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 font-extrabold text-xs font-fredoka shadow-sm">
                      Apple {num}
                    </div>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/80 rounded-2xl p-2 border border-slate-200 shadow-md">
                      <CountingObjectArt type="apple" size={64} highlighted={true} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Characters Acting Out Scene */}
              <div className="flex items-end justify-around">
                {/* Andy counting */}
                <div className="flex flex-col items-center">
                  <div className="w-40 h-56 sm:w-48 sm:h-64">
                    <CharacterArtSvg characterId="andy" expression="encouraging" />
                  </div>
                </div>

                {/* Sancho thinking */}
                <div className="flex flex-col items-center">
                  <div className="w-44 h-64 sm:w-52 sm:h-72">
                    <CharacterArtSvg characterId="sancho" expression="thinking" />
                  </div>
                </div>

                {/* Osi nudging apple */}
                <div className="flex flex-col items-center">
                  <div className="w-36 h-40 sm:w-40 sm:h-48">
                    <CharacterArtSvg characterId="osi" expression="happy" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 4: THE INVITATION                                   */}
        {/* Friends gesture toward glowing path with stepping stones  */}
        {/* ========================================================= */}
        {currentSceneIdx === 3 && (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-b from-purple-300/80 via-sky-200 to-amber-100">
            {/* Glowing Path with Numbered Stepping Stones */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600">
              <defs>
                <linearGradient id="glowTrail" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="50%" stopColor="#67E8F9" />
                  <stop offset="100%" stopColor="#F472B6" />
                </linearGradient>
              </defs>
              <ellipse cx="500" cy="620" rx="600" ry="240" fill="#86EFAC" />

              {/* Glowing Pathway */}
              <path
                d="M 100 520 Q 350 400 650 420 T 950 320"
                stroke="url(#glowTrail)"
                strokeWidth="70"
                strokeLinecap="round"
                fill="none"
                opacity="0.85"
              />

              {/* Stepping Stones 1, 2, 3, 4, 5 */}
              <g className={reducedMotion ? '' : 'animate-pulse'}>
                {[
                  { x: 180, y: 500, n: '1', c: '#F472B6' },
                  { x: 340, y: 440, n: '2', c: '#3B82F6' },
                  { x: 500, y: 420, n: '3', c: '#10B981' },
                  { x: 670, y: 410, n: '4', c: '#F59E0B' },
                  { x: 840, y: 350, n: '5', c: '#8B5CF6' }
                ].map((s, idx) => (
                  <g key={idx} transform={`translate(${s.x}, ${s.y})`}>
                    <ellipse cx="0" cy="5" rx="36" ry="20" fill="#000000" opacity="0.15" />
                    <ellipse cx="0" cy="0" rx="34" ry="18" fill="#FFFFFF" stroke={s.c} strokeWidth="4" />
                    <text x="0" y="6" fontSize="22" fontWeight="bold" textAnchor="middle" fill={s.c} fontFamily="Fredoka, cursive">
                      {s.n}
                    </text>
                  </g>
                ))}
              </g>
            </svg>

            {/* Trio gesturing toward the viewer and stepping stones */}
            <div className="relative z-10 w-full max-w-4xl flex items-end justify-around pb-4 h-full">
              <div className="w-40 h-56 sm:w-48 sm:h-64">
                <CharacterArtSvg characterId="andy" expression="celebration" />
              </div>
              <div className="w-44 h-64 sm:w-52 sm:h-72">
                <CharacterArtSvg characterId="sancho" expression="encouraging" />
              </div>
              <div className="w-36 h-40 sm:w-40 sm:h-48">
                <CharacterArtSvg characterId="osi" expression="celebration" />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCENE 5: ENTER MATH WORLD                                 */}
        {/* Transition to adventure map with Level 1 glowing softly   */}
        {/* ========================================================= */}
        {currentSceneIdx === 4 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900 text-center">
            {/* Glowing Map Preview Stage */}
            <div className="relative max-w-lg w-full bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6">
              {/* Soft Pulsing Level 1 Icon */}
              <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full bg-emerald-400/30 ${reducedMotion ? '' : 'animate-ping'}`} />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-amber-300">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-fredoka">
                    1
                  </span>
                </div>
                <div className="absolute -bottom-2 px-3 py-0.5 bg-amber-400 text-slate-900 font-extrabold text-[11px] rounded-full font-fredoka shadow-sm">
                  Number Meadow
                </div>
              </div>

              {/* Character Trio Badge Lockup */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-14">
                  <CharacterArtSvg characterId="sancho" expression="happy" />
                </div>
                <div className="w-11 h-13">
                  <CharacterArtSvg characterId="andy" expression="happy" />
                </div>
                <div className="w-10 h-10">
                  <CharacterArtSvg characterId="osi" expression="happy" />
                </div>
              </div>

              {/* Big Welcome Headlines */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-4xl font-black text-white font-fredoka tracking-tight">
                  Ready, Little Explorer?
                </h2>
                <p className="text-amber-200 text-sm sm:text-base font-medium">
                  Andy, Sancho, and Osi need your help!
                </p>
              </div>

              {/* Primary Chunky Call-to-Action: LET'S PLAY! */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    soundManager.playCelebration();
                    onComplete();
                  }}
                  className="w-full sm:w-auto px-10 py-4 bg-emerald-500 hover:bg-emerald-400 active:translate-y-1 active:shadow-none text-white font-black text-lg sm:text-xl rounded-2xl shadow-[0_6px_0_#047857] transition-all font-fredoka flex items-center justify-center gap-3 mx-auto"
                >
                  <Play className="w-6 h-6 fill-white" />
                  <span>LET&apos;S PLAY!</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Captions & Playback Control Deck */}
      <div className="relative z-30 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/75 to-transparent text-white space-y-4">
        {/* Narration Mode Selector & Full Narration Quick Trigger */}
        <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-2 px-1">
          <div className="flex items-center gap-1.5 p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/15">
            <button
              onClick={() => {
                soundManager.playPop();
                setNarrationMode('fullNarrator');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-fredoka transition-all flex items-center gap-1.5 ${
                narrationMode === 'fullNarrator'
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-900" />
              <span>Full Childlike Storyteller</span>
            </button>

            <button
              onClick={() => {
                soundManager.playPop();
                setNarrationMode('ensemble');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-fredoka transition-all flex items-center gap-1.5 ${
                narrationMode === 'ensemble'
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <span>Character Ensemble</span>
            </button>
          </div>

          <button
            onClick={() => {
              soundManager.resumeContext();
              soundManager.playCelebration();
              setNarrationMode('fullNarrator');
              setNarrationTtsEnabled(true);
              setSoundMuted(false);
              setIsPlaying(true);
              transitionToScene(0);
            }}
            className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl font-fredoka flex items-center gap-1.5 shadow-sm transition-all"
            title="Start complete 5-scene continuous childlike narration"
          >
            <Play className="w-3 h-3 fill-slate-950" />
            <span>Play Full 5-Scene Narration</span>
          </button>
        </div>

        {/* High-Legibility Captions Area with Speaker Badge */}
        {(() => {
          const activeList = getActiveDialogueList(currentSceneIdx);
          const currentLine = activeList[activeDialogueIdx] || activeList[0];

          return (
            <div className="max-w-3xl mx-auto bg-white/95 text-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-lg flex items-start gap-3 sm:gap-4 transition-all">
              {/* Speaker Avatar / Badge */}
              <div className="shrink-0 flex flex-col items-center">
                {currentLine?.avatarId ? (
                  <div className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-100 rounded-xl p-1 flex items-center justify-center border border-slate-200">
                    <CharacterArtSvg
                      characterId={currentLine.avatarId}
                      expression="happy"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-black font-fredoka text-lg shadow-sm border border-amber-300">
                    ✨
                  </div>
                )}
                <span className="text-[10px] font-bold text-slate-500 font-fredoka mt-1 uppercase text-center leading-tight">
                  {currentLine?.name}
                </span>
              </div>

              {/* Dialogue Text & Word-by-Word Voiceover Sync */}
              <div className="flex-1 flex flex-col justify-between">
                <p className="text-base sm:text-lg font-bold leading-snug font-fredoka flex flex-wrap gap-x-1.5 gap-y-1 items-baseline">
                  {currentLine?.text.trim().split(/\s+/).map((word, wIdx) => {
                    const isCurrent = wIdx === currentWordIdx;
                    const isPast = currentWordIdx >= 0 && wIdx < currentWordIdx;
                    return (
                      <span
                        key={wIdx}
                        className={`transition-all duration-150 rounded-md px-1 py-0.5 ${
                          isCurrent
                            ? 'bg-amber-300 text-slate-950 font-black shadow-sm scale-105 ring-2 ring-amber-400'
                            : isPast
                            ? 'text-slate-900'
                            : 'text-slate-600'
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </p>
                <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      playLine(currentSceneIdx, activeDialogueIdx);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl font-fredoka transition-all shadow-xs"
                    title={`Hear ${currentLine?.name} voice`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Hear {currentLine?.name}&apos;s Voice</span>
                  </button>

                  {currentLine?.speaker === 'osi' && (
                    <button
                      onClick={() => soundManager.playBark(2)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold rounded-xl font-fredoka transition-all shadow-xs"
                      title="Play Shih Tzu Dog Bark"
                    >
                      <span>🐶 Dog Bark</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      soundManager.playMagicalTransitionTheme();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold rounded-xl font-fredoka transition-all shadow-xs"
                    title="Play Magical Background Music Transition Theme"
                  >
                    <Music className="w-3.5 h-3.5 text-purple-700" />
                    <span>Magical Music Theme</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playPop();
                      setIsVoiceModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-[11px] text-amber-900 font-bold font-fredoka bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300 transition-colors shadow-xs"
                    title="Click to view Voiceover & Character Voice Direction Suite"
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>
                      {currentLine?.speaker === 'narrator'
                        ? 'Narrator: Toddler Storyteller (Pitch 1.38x • Rate 0.86x)'
                        : currentLine?.speaker === 'andy'
                        ? 'Andy: Curious Girl Voice (Pitch 1.45x)'
                        : currentLine?.speaker === 'sancho'
                        ? 'Sancho: Thoughtful Boy Voice (Pitch 1.14x)'
                        : 'Osi: Shih Tzu Puppy Bark + Voice'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Scene Timeline Progress Bar */}
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentSceneIdx === 0}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white transition-colors"
            title="Previous Scene"
            aria-label="Previous Scene"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause Intro' : 'Play Intro'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-900" />}
          </button>

          {/* Progress track */}
          <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-100"
              style={{ width: `${sceneProgress}%` }}
            />
          </div>

          <button
            onClick={handleNext}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors flex items-center gap-1 font-bold text-xs font-fredoka"
            title={currentSceneIdx === SCENES.length - 1 ? 'Go to Map' : 'Next Scene'}
            aria-label="Next Scene"
          >
            <span>{currentSceneIdx === SCENES.length - 1 ? "Let's Play" : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Direction & Script Modal */}
      {isVoiceModalOpen && (
        <VoiceDirectionModal
          isOpen={true}
          onClose={() => setIsVoiceModalOpen(false)}
        />
      )}
    </div>
  );
};

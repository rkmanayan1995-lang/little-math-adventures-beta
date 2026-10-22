import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Sparkles,
  Music,
  X,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Check,
  Heart,
  BookOpen,
  Copy,
  Radio,
  VolumeX
} from 'lucide-react';
import { CharacterArtSvg } from '../characters/CharacterArtSvg';
import { soundManager, VoiceSettings } from '../../utils/soundEffects';

interface VoiceDirectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FULL_NARRATION_SECTIONS = [
  {
    sceneNum: 1,
    sceneTitle: 'Scene 1: A Little World Full of Wonder',
    text: '“Hello, little explorer! ✨ Can you see that magical world ahead? It’s filled with exciting numbers, fun puzzles, and amazing adventures waiting to be discovered. Are you ready to explore and learn something wonderful today?”',
    direction: 'Curious wonder, bright welcoming invitation, gentle upward inflection on questions.',
    timing: '0:00 – 0:10',
  },
  {
    sceneNum: 2,
    sceneTitle: 'Scene 2: Meet Your New Friends',
    text: '“Look over there! Meet your new adventure friends! Andy peeks from behind a friendly tree with a cheerful wave, Sancho is holding a colorful math puzzle, and sweet puppy Osi trots in wagging his tail! They are so happy you are here!”',
    direction: 'Excited introductions, playful warmth, smiling animated delivery, distinct character warmth.',
    timing: '0:10 – 0:20',
  },
  {
    sceneNum: 3,
    sceneTitle: 'Scene 3: The Big Little Adventure',
    text: '“Oh look! Shiny red apples are rolling right onto our path! Andy counts them, Sancho is thinking carefully, and little Osi nudges an apple your way! With your help, we can count, add, take away, and discover amazing things together! Every little answer helps us move one step further!”',
    direction: 'Storytelling rhythm, clear articulation of math verbs (count, add, take away), encouraging tone.',
    timing: '0:20 – 0:31',
  },
  {
    sceneNum: 4,
    sceneTitle: 'Scene 4: The Invitation',
    text: '“See that glowing magical path with numbered stepping stones? Andy, Sancho, and Osi are calling your name! Will you come explore with us? Your friends are waiting, little explorer! Let’s jump into our world and make math an adventure!”',
    direction: 'Ecstatic, inviting, high toddler excitement with wide-eyed enthusiasm.',
    timing: '0:31 – 0:41',
  },
  {
    sceneNum: 5,
    sceneTitle: 'Scene 5: Enter Math World',
    text: '“Ready, little explorer? Level one is glowing softly in the number meadow! Andy, Sancho, and Osi need your clever help! Let’s start our adventure together!”',
    direction: 'Triumphant call-to-action, energetic send-off into gameplay.',
    timing: '0:41 – 0:48',
  },
];

export const VoiceDirectionModal: React.FC<VoiceDirectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'fullNarration' | 'audition' | 'direction' | 'script'>('fullNarration');
  const [activeSpeaker, setActiveSpeaker] = useState<'narrator' | 'andy' | 'sancho' | 'osi'>('narrator');

  // Local audition slider states
  const [customPitch, setCustomPitch] = useState<number>(1.38);
  const [customRate, setCustomRate] = useState<number>(0.86);
  const [testText, setTestText] = useState<string>(
    '“Hello, little explorer! ✨ Can you see that magical world ahead? It’s filled with exciting numbers, fun puzzles, and amazing adventures!”'
  );
  const [isAuditionSpeaking, setIsAuditionSpeaking] = useState<boolean>(false);
  const [isBgmActive, setIsBgmActive] = useState<boolean>(soundManager.getIsBgmPlaying());

  // Continuous Full Narration States
  const [isPlayingFullNarration, setIsPlayingFullNarration] = useState<boolean>(false);
  const [currentFullSectionIdx, setCurrentFullSectionIdx] = useState<number>(0);
  const [copiedTranscript, setCopiedTranscript] = useState<boolean>(false);
  const fullNarrationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (fullNarrationTimeoutRef.current) {
        clearTimeout(fullNarrationTimeoutRef.current);
        fullNarrationTimeoutRef.current = null;
      }
      setIsPlayingFullNarration(false);
      soundManager.stopSpeech();
    }
    return () => {
      if (fullNarrationTimeoutRef.current) {
        clearTimeout(fullNarrationTimeoutRef.current);
      }
      soundManager.stopSpeech();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sampleLines: Record<'narrator' | 'andy' | 'sancho' | 'osi', string> = {
    narrator:
      '“Hello, little explorer! ✨ Can you see that magical world ahead? It’s filled with exciting numbers, fun puzzles, and amazing adventures waiting to be discovered. Are you ready to explore and learn something wonderful today?”',
    andy: '“Hi, friend! I\'m Andy! I\'m so happy you\'re here! Will you come explore with us?”',
    sancho: '“We have some math puzzles, but we could use a clever helper! Let\'s figure it out together!”',
    osi: '“Woof, woof! Will you help us? Come on, come on! Let\'s go!”',
  };

  const handleAudition = (speaker: 'narrator' | 'andy' | 'sancho' | 'osi', textOverride?: string) => {
    setActiveSpeaker(speaker);
    setIsAuditionSpeaking(true);
    soundManager.speak(textOverride || sampleLines[speaker], speaker, {
      customPitch,
      customRate,
      onEnd: () => {
        setIsAuditionSpeaking(false);
      },
    });
  };

  const handleSpeakerChange = (spk: 'narrator' | 'andy' | 'sancho' | 'osi') => {
    setActiveSpeaker(spk);
    const settings: VoiceSettings = soundManager.getVoiceSettings(spk);
    setCustomPitch(settings.pitch);
    setCustomRate(settings.rate);
    setTestText(sampleLines[spk]);
  };

  const handleToggleBgm = () => {
    if (soundManager.getIsBgmPlaying()) {
      soundManager.stopIntroBgm();
      setIsBgmActive(false);
    } else {
      soundManager.startIntroBgm();
      setIsBgmActive(true);
    }
  };

  // Continuous Full Storybook Narration Routine
  const playFullNarrationFrom = (sectionIdx: number) => {
    if (sectionIdx >= FULL_NARRATION_SECTIONS.length) {
      setIsPlayingFullNarration(false);
      setCurrentFullSectionIdx(0);
      soundManager.playCelebration();
      return;
    }

    setCurrentFullSectionIdx(sectionIdx);
    setIsPlayingFullNarration(true);

    const section = FULL_NARRATION_SECTIONS[sectionIdx];
    const cleanText = section.text.replace(/["“”✨]/g, '');

    soundManager.speak(cleanText, 'narrator', {
      customPitch,
      customRate,
      onEnd: () => {
        // Preschool breath pause between scenes (700ms)
        fullNarrationTimeoutRef.current = setTimeout(() => {
          playFullNarrationFrom(sectionIdx + 1);
        }, 700);
      },
    });
  };

  const stopFullNarration = () => {
    if (fullNarrationTimeoutRef.current) {
      clearTimeout(fullNarrationTimeoutRef.current);
      fullNarrationTimeoutRef.current = null;
    }
    soundManager.stopSpeech();
    setIsPlayingFullNarration(false);
  };

  const copyFullTranscript = () => {
    const fullText = FULL_NARRATION_SECTIONS.map(
      (s) => `${s.sceneTitle}\n${s.text}\n[Direction: ${s.direction}]`
    ).join('\n\n');

    navigator.clipboard.writeText(fullText);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 sm:py-5 bg-gradient-to-r from-amber-500 via-pink-500 to-indigo-600 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner ring-1 ring-white/30">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black font-fredoka tracking-tight leading-tight">
                  Narrator & Voice Direction Suite
                </h2>
                <span className="hidden sm:inline px-2.5 py-0.5 rounded-full bg-amber-300 text-slate-900 font-extrabold text-[11px] font-fredoka">
                  Toddler Storyteller (Pitch 1.38x)
                </span>
              </div>
              <p className="text-amber-100 text-xs sm:text-sm font-medium">
                Little Math Adventures • “Come On In, Little Math Explorer!” (Ages 3–7)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopFullNarration();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Close voice studio"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 gap-2 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              stopFullNarration();
              setActiveTab('fullNarration');
            }}
            className={`py-3 px-3 sm:px-4 font-fredoka font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'fullNarration'
                ? 'border-amber-500 text-amber-800 bg-white font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>Full Story Narration</span>
          </button>

          <button
            onClick={() => {
              stopFullNarration();
              setActiveTab('audition');
            }}
            className={`py-3 px-3 sm:px-4 font-fredoka font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'audition'
                ? 'border-amber-500 text-amber-800 bg-white font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-500" />
            <span>Cast & Audition Lab</span>
          </button>

          <button
            onClick={() => {
              stopFullNarration();
              setActiveTab('direction');
            }}
            className={`py-3 px-3 sm:px-4 font-fredoka font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'direction'
                ? 'border-pink-500 text-pink-700 bg-white font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-pink-500" />
            <span>Master Voice Direction</span>
          </button>

          <button
            onClick={() => {
              stopFullNarration();
              setActiveTab('script');
            }}
            className={`py-3 px-3 sm:px-4 font-fredoka font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'script'
                ? 'border-indigo-500 text-indigo-700 bg-white font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>5-Scene Dialogue Script</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB: FULL STORY NARRATION */}
          {activeTab === 'fullNarration' && (
            <div className="space-y-6">
              {/* Full Narration Hero Box */}
              <div className="bg-gradient-to-br from-amber-50 via-amber-100/60 to-purple-50 rounded-2xl p-5 sm:p-6 border border-amber-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md ring-4 ring-amber-300">
                      ✨
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-black font-fredoka text-amber-950">
                          Complete Childlike Storyteller Narration
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-900 text-[10px] font-extrabold font-fredoka">
                          Ages 3–7
                        </span>
                      </div>
                      <p className="text-xs text-amber-900/80 font-medium">
                        Youthful, high-pitched toddler voice (pitch 1.38x, rate 0.86x) reciting the complete 5-scene adventure with celestial chimes and ducked music.
                      </p>
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleBgm}
                      className={`px-3 py-2 rounded-xl text-xs font-bold font-fredoka flex items-center gap-1.5 transition-all ${
                        isBgmActive
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                      title="Toggle soft whimsical background music"
                    >
                      <Music className="w-3.5 h-3.5" />
                      <span>{isBgmActive ? 'Music: Playing' : 'Start Music'}</span>
                    </button>

                    {!isPlayingFullNarration ? (
                      <button
                        onClick={() => playFullNarrationFrom(0)}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:translate-y-0.5 text-white font-black text-sm rounded-xl font-fredoka shadow-md flex items-center gap-2 transition-all"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Play Full Narration</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopFullNarration}
                        className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 active:translate-y-0.5 text-white font-black text-sm rounded-xl font-fredoka shadow-md flex items-center gap-2 transition-all animate-pulse"
                      >
                        <Pause className="w-4 h-4 fill-white" />
                        <span>Stop Narration</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Animated Waveform & Active Section Tracker */}
                {isPlayingFullNarration && (
                  <div className="bg-white/90 backdrop-blur-md rounded-xl p-3 border border-amber-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-bold font-fredoka text-emerald-800">
                        Speaking: {FULL_NARRATION_SECTIONS[currentFullSectionIdx]?.sceneTitle}
                      </span>
                    </div>

                    {/* Cute equalizer bars */}
                    <div className="flex items-center gap-1 h-5">
                      {[12, 20, 8, 16, 22, 14, 18, 10, 16, 24, 12].map((height, i) => (
                        <div
                          key={i}
                          className="w-1 bg-amber-500 rounded-full animate-bounce"
                          style={{
                            height: `${height}px`,
                            animationDuration: `${0.3 + (i % 4) * 0.15}s`,
                            animationDelay: `${i * 0.05}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Vocal Calibration Quick-Adjust */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full space-y-1">
                  <div className="flex justify-between text-xs font-bold font-fredoka text-slate-700">
                    <span>Childlike Pitch: {customPitch.toFixed(2)}x</span>
                    <span className="text-amber-700">Recommended 1.38x (Natural Toddler Wonder)</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="1.7"
                    step="0.02"
                    value={customPitch}
                    onChange={(e) => setCustomPitch(parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="flex-1 w-full space-y-1">
                  <div className="flex justify-between text-xs font-bold font-fredoka text-slate-700">
                    <span>Narration Tempo: {customRate.toFixed(2)}x</span>
                    <span className="text-indigo-700">Recommended 0.86x (Gentle Preschool Pacing)</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.1"
                    step="0.02"
                    value={customRate}
                    onChange={(e) => setCustomRate(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <button
                  onClick={copyFullTranscript}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold font-fredoka text-slate-700 flex items-center gap-1.5 shrink-0 transition-colors"
                  title="Copy full narrated transcript to clipboard"
                >
                  {copiedTranscript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTranscript ? 'Transcript Copied!' : 'Copy Script'}</span>
                </button>
              </div>

              {/* 5-Scene Narration Card Deck */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-fredoka">
                    Full Narration Transcript (Scenes 1 through 5)
                  </h4>
                  <span className="text-xs text-slate-400 font-medium font-fredoka">
                    Total Duration: ~42 seconds
                  </span>
                </div>

                {FULL_NARRATION_SECTIONS.map((sec, idx) => {
                  const isActive = isPlayingFullNarration && currentFullSectionIdx === idx;
                  return (
                    <div
                      key={sec.sceneNum}
                      className={`p-4 rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? 'border-amber-400 bg-amber-50 shadow-md ring-2 ring-amber-300/60 scale-[1.01]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full font-fredoka font-black text-xs flex items-center justify-center ${
                              isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {sec.sceneNum}
                          </span>
                          <span className="font-fredoka font-black text-sm text-slate-900">
                            {sec.sceneTitle}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 font-fredoka">
                            {sec.timing}
                          </span>
                        </div>

                        <button
                          onClick={() => playFullNarrationFrom(idx)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold font-fredoka flex items-center gap-1 transition-all ${
                            isActive
                              ? 'bg-amber-300 text-slate-900 font-black'
                              : 'bg-slate-100 hover:bg-amber-100 text-slate-700'
                          }`}
                        >
                          <Play className="w-3 h-3" />
                          <span>{isActive ? 'Speaking...' : 'Play Scene'}</span>
                        </button>
                      </div>

                      <p
                        className={`text-sm sm:text-base font-bold font-fredoka leading-relaxed ${
                          isActive ? 'text-amber-950' : 'text-slate-800'
                        }`}
                      >
                        {sec.text}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-extrabold text-amber-800 font-fredoka text-[11px] uppercase">
                          Voice Direction:
                        </span>
                        <span className="italic text-[11px] text-slate-600">{sec.direction}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: LIVE AUDITION STUDIO */}
          {activeTab === 'audition' && (
            <div className="space-y-6">
              {/* Character Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    id: 'narrator' as const,
                    name: 'Narrator',
                    badge: 'Toddler Storyteller',
                    avatar: null,
                  },
                  {
                    id: 'andy' as const,
                    name: 'Andy',
                    badge: 'Curious Girl (5yo)',
                    avatar: 'andy' as const,
                  },
                  {
                    id: 'sancho' as const,
                    name: 'Sancho',
                    badge: 'Thoughtful Boy (6yo)',
                    avatar: 'sancho' as const,
                  },
                  {
                    id: 'osi' as const,
                    name: 'Osi',
                    badge: 'Puppy Bark + Voice',
                    avatar: 'osi' as const,
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSpeakerChange(item.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${
                      activeSpeaker === item.id
                        ? 'border-amber-400 bg-amber-50/80 shadow-md ring-2 ring-amber-200'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="w-14 h-16 flex items-center justify-center mb-1">
                      {item.avatar ? (
                        <CharacterArtSvg characterId={item.avatar} expression="happy" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-2xl shadow-sm">
                          ✨
                        </div>
                      )}
                    </div>
                    <span className="font-fredoka font-black text-slate-900 text-sm">{item.name}</span>
                    <span className="text-[11px] font-bold text-slate-500 mt-0.5">{item.badge}</span>
                  </button>
                ))}
              </div>

              {/* Character Audition Controller */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold font-fredoka px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900">
                      Active Cast: {activeSpeaker.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {activeSpeaker === 'narrator'
                        ? 'High-pitched toddler guide with gentle wonder'
                        : activeSpeaker === 'andy'
                        ? 'Curious 5yo girl with bright upbeat intonation'
                        : activeSpeaker === 'sancho'
                        ? 'Thoughtful 6yo boy with warm grounded tone'
                        : 'Playful Shih Tzu pup with dual-formant bark'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* BGM Toggle */}
                    <button
                      onClick={handleToggleBgm}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-fredoka flex items-center gap-1.5 transition-all ${
                        isBgmActive
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Music className="w-3.5 h-3.5" />
                      <span>{isBgmActive ? 'Magical Music: Playing' : 'Start Magical Music'}</span>
                    </button>

                    {activeSpeaker === 'osi' && (
                      <button
                        onClick={() => soundManager.playBark(2)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold font-fredoka bg-amber-200 hover:bg-amber-300 text-amber-950 flex items-center gap-1.5"
                      >
                        <span>🐶 Test Puppy Bark</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Spoken Text Box */}
                <div>
                  <label className="block text-xs font-bold font-fredoka text-slate-700 mb-1">
                    Audition Dialogue Text:
                  </label>
                  <textarea
                    rows={3}
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-fredoka focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                {/* Pitch and Speed Tuning Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold font-fredoka text-slate-700">
                      <span>Vocal Pitch: {customPitch.toFixed(2)}x</span>
                      <span className="text-amber-700 font-extrabold">
                        {customPitch >= 1.3 ? 'Toddler Child Range' : 'Standard Child Range'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="1.8"
                      step="0.02"
                      value={customPitch}
                      onChange={(e) => setCustomPitch(parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>0.8x (Deeper)</span>
                      <span>1.35x–1.45x (Toddler Child Sweet Spot)</span>
                      <span>1.8x (Ultra-high)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold font-fredoka text-slate-700">
                      <span>Pacing / Tempo: {customRate.toFixed(2)}x</span>
                      <span className="text-indigo-700 font-extrabold">
                        {customRate < 0.95 ? 'Gentle Preschool Pause' : 'Normal Pacing'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="1.3"
                      step="0.02"
                      value={customRate}
                      onChange={(e) => setCustomRate(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>0.7x (Very Slow)</span>
                      <span>0.86x (Preschool Clarity)</span>
                      <span>1.3x (Fast)</span>
                    </div>
                  </div>
                </div>

                {/* Primary Audition Action Button */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      const defaults = soundManager.getVoiceSettings(activeSpeaker);
                      setCustomPitch(defaults.pitch);
                      setCustomRate(defaults.rate);
                    }}
                    className="text-xs font-bold font-fredoka text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Defaults</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundManager.updateVoiceSettings(activeSpeaker, {
                          pitch: customPitch,
                          rate: customRate,
                        });
                        handleAudition(activeSpeaker, testText);
                      }}
                      disabled={isAuditionSpeaking}
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 active:translate-y-0.5 text-slate-900 font-black text-sm rounded-xl font-fredoka shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      <Volume2 className="w-4 h-4 text-slate-950" />
                      <span>{isAuditionSpeaking ? 'Speaking Line...' : `Audition ${activeSpeaker.toUpperCase()}`}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MASTER VOICE DIRECTION SPEC */}
          {activeTab === 'direction' && (
            <div className="space-y-6 text-slate-700">
              <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl space-y-2">
                <h3 className="text-base font-black font-fredoka text-amber-950">
                  Master Voice Direction (Preschool Ages 3–7)
                </h3>
                <p className="text-sm font-medium text-amber-900 leading-relaxed">
                  Replace the existing voiceover with a{' '}
                  <strong className="underline">high-pitched, youthful, toddler-like animated voice</strong>, reminiscent of
                  an enthusiastic four-year-old child. The voice sounds sweet, curious, innocent, lively, and genuinely excited
                  to welcome young children into a magical world.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold font-fredoka text-amber-600 uppercase">Core Vocal Qualities</span>
                  <ul className="text-xs space-y-1.5 font-medium">
                    <li>• <strong>Pitch:</strong> High, light, and youthful (1.35x–1.48x range).</li>
                    <li>• <strong>Emotion:</strong> Curious, excited, warm, playful, and reassuring.</li>
                    <li>• <strong>Pacing:</strong> Moderately slow (0.86x–0.92x), with clear articulation and small pauses.</li>
                    <li>• <strong>No Squeaks:</strong> Natural childlike performance without artificial robotic chipmunk artifacts.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <span className="text-xs font-bold font-fredoka text-indigo-600 uppercase">Music & Acoustic Environment</span>
                  <ul className="text-xs space-y-1.5 font-medium">
                    <li>• <strong>Music Bed:</strong> Soft, whimsical, magical background music kept below dialogue.</li>
                    <li>• <strong>Auto-Ducking:</strong> Background music automatically lowers by 60% during dialogue.</li>
                    <li>• <strong>Acoustics:</strong> Clean studio recording, consistent gain, warm lowpass warmth.</li>
                    <li>• <strong>Sync:</strong> Zero audio cutting; guaranteed onEnd events for complete sentences.</li>
                  </ul>
                </div>
              </div>

              {/* Character Casting Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-black font-fredoka text-slate-900">
                  Character Voice Casting Breakdown
                </h4>
                <div className="space-y-3">
                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-black font-fredoka shrink-0">
                      N
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-fredoka text-slate-900 text-sm">NARRATOR — The Little Explorer’s Guide</strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">Toddler Storyteller</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        A bright, high-pitched, childlike voice with a warm, friendly tone. Sounds like a playful young storyteller inviting children into a magical adventure. Starts with wonder, builds excitement, and finishes warmly.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-pink-50/60 rounded-xl border border-pink-200 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center font-black font-fredoka shrink-0">
                      A
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-fredoka text-slate-900 text-sm">ANDY — The Brave, Cheerful Explorer</strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-200 text-pink-900">Curious 5yo Girl</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Youthful, high-pitched girl’s voice with a sweet, bright, expressive quality. Curious, kind, confident, and encouraging. Smiling vocal delivery with gentle enthusiasm.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-black font-fredoka shrink-0">
                      S
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-fredoka text-slate-900 text-sm">SANCHO — The Clever, Thoughtful Friend</strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900">Thoughtful 6yo Boy</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        A youthful boy’s voice, slightly lower than Andy’s (~1.14x pitch) but still unmistakably young. Warm, reassuring, thoughtful, patient, with moments of excitement when solving a riddle.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-300 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-black font-fredoka shrink-0">
                      O
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-fredoka text-slate-900 text-sm">OSI — The Playful Dog Scout</strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">Shih Tzu Puppy</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        High-energy, joyful puppy. Perky Shih Tzu puppy barks (“Woof! Woof!”) followed by an enthusiastic, puppy dialogue delivery with wagging-tail energy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: COMPLETE 5-SCENE SCRIPT */}
          {activeTab === 'script' && (
            <div className="space-y-5">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-medium">
                <strong>Project Run-Time:</strong> Approx. 35–45 seconds. Synchronized with Web Audio, word highlights, and character reactions.
              </div>

              {/* Scene 1 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-fredoka font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <strong className="font-fredoka text-slate-900 text-sm">
                      SCENE 1 — A Little World Full of Wonder
                    </strong>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">Duration: ~9.5s</span>
                </div>
                <p className="text-xs text-slate-500 italic">
                  Visual: A glowing star travels through soft clouds toward a magical meadow with a winding path and large, colorful numbers.
                </p>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-fredoka text-amber-900">NARRATOR (Toddler Voice):</span>
                    <button
                      onClick={() => handleAudition('narrator', sampleLines.narrator)}
                      className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 text-[11px] font-bold rounded-lg font-fredoka flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" /> Play Line
                    </button>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-fredoka font-bold">
                    “Hello, little explorer! ✨ Can you see that magical world ahead? It’s filled with exciting numbers, fun puzzles, and amazing adventures waiting to be discovered. Are you ready to explore and learn something wonderful today?”
                  </p>
                </div>
              </div>

              {/* Scene 2 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-fredoka font-black text-xs flex items-center justify-center">
                      2
                    </span>
                    <strong className="font-fredoka text-slate-900 text-sm">
                      SCENE 2 — Meet Your New Friends
                    </strong>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">Duration: ~9.0s</span>
                </div>
                <p className="text-xs text-slate-500 italic">
                  Visual: Andy peeks from behind a tree and waves. Sancho holds a number puzzle. Osi trots into view, wagging his tail.
                </p>
                <div className="space-y-2">
                  <div className="p-2.5 bg-pink-50 rounded-xl border border-pink-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black font-fredoka text-pink-900 block">ANDY:</span>
                      <p className="text-xs text-slate-800 font-fredoka font-bold">
                        “Hi, friend! I'm Andy! I'm so happy you're here!”
                      </p>
                    </div>
                    <button
                      onClick={() => handleAudition('andy', '“Hi, friend! I\'m Andy! I\'m so happy you\'re here!”')}
                      className="px-2.5 py-1 bg-pink-200 hover:bg-pink-300 text-pink-950 text-[11px] font-bold rounded-lg font-fredoka shrink-0"
                    >
                      Play
                    </button>
                  </div>

                  <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black font-fredoka text-blue-900 block">SANCHO:</span>
                      <p className="text-xs text-slate-800 font-fredoka font-bold">
                        “We have some math puzzles, but we could use a clever helper!”
                      </p>
                    </div>
                    <button
                      onClick={() => handleAudition('sancho', '“We have some math puzzles, but we could use a clever helper!”')}
                      className="px-2.5 py-1 bg-blue-200 hover:bg-blue-300 text-blue-950 text-[11px] font-bold rounded-lg font-fredoka shrink-0"
                    >
                      Play
                    </button>
                  </div>

                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black font-fredoka text-amber-900 block">OSI:</span>
                      <p className="text-xs text-slate-800 font-fredoka font-bold">
                        “Woof, woof! Will you help us?”
                      </p>
                    </div>
                    <button
                      onClick={() => handleAudition('osi', '“Woof, woof! Will you help us?”')}
                      className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 text-[11px] font-bold rounded-lg font-fredoka shrink-0"
                    >
                      Play
                    </button>
                  </div>
                </div>
              </div>

              {/* Scene 3 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-fredoka font-black text-xs flex items-center justify-center">
                      3
                    </span>
                    <strong className="font-fredoka text-slate-900 text-sm">
                      SCENE 3 — The Big Little Adventure
                    </strong>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">Duration: ~9.5s</span>
                </div>
                <p className="text-xs text-slate-500 italic">
                  Visual: Apples roll onto the path. Andy counts them, Sancho thinks about the answer, and Osi nudges an apple toward the viewer.
                </p>
                <div className="space-y-2">
                  <div className="p-2 bg-pink-50 rounded-lg text-xs font-fredoka">
                    <span className="font-black text-pink-900">Andy: </span>
                    <span>“Oh! We need to count these apples!”</span>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg text-xs font-fredoka">
                    <span className="font-black text-blue-900">Sancho: </span>
                    <span>“And there are more puzzles waiting over there!”</span>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg text-xs font-fredoka">
                    <span className="font-black text-amber-900">Narrator: </span>
                    <span>“With your help, we can count, add, take away, and discover amazing things together. Every little answer helps us move one step further!”</span>
                  </div>
                </div>
              </div>

              {/* Scene 4 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-fredoka font-black text-xs flex items-center justify-center">
                      4
                    </span>
                    <strong className="font-fredoka text-slate-900 text-sm">
                      SCENE 4 — The Invitation
                    </strong>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">Duration: ~8.5s</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-pink-50 rounded-lg text-xs font-fredoka">
                    <span className="font-black text-pink-900">Andy: </span>
                    <span>“Will you come explore with us?”</span>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg text-xs font-fredoka">
                    <span className="font-black text-blue-900">Sancho: </span>
                    <span>“Let's figure it out together!”</span>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg text-xs font-fredoka">
                    <span className="font-black text-amber-900">Osi: </span>
                    <span>“Come on, come on! Let's go!”</span>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg text-xs font-fredoka">
                    <span className="font-black text-amber-900">Narrator: </span>
                    <span>“Your friends are waiting, little explorer. Let's jump into our world and make math an adventure!”</span>
                  </div>
                </div>
              </div>

              {/* Scene 5 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-fredoka font-black text-xs flex items-center justify-center">
                      5
                    </span>
                    <strong className="font-fredoka text-slate-900 text-sm">
                      SCENE 5 — Enter Math World
                    </strong>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">Duration: ~8.0s</span>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-lg text-xs font-fredoka">
                  <span className="font-black text-slate-900">Narrator: </span>
                  <span>“Ready, Little Explorer? Andy, Sancho, and Osi need your help!”</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Childlike Toddler Voiceover Active • Pitch: {customPitch.toFixed(2)}x</span>
          </div>
          <button
            onClick={() => {
              stopFullNarration();
              onClose();
            }}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl font-fredoka transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

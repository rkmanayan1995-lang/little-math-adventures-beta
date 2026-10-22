import React, { useState } from 'react';
import { CHARACTERS } from '../../data/foundationData';
import { CharacterId, ExpressionType } from '../../types/creativeFoundation';
import { CharacterArtSvg } from './CharacterArtSvg';
import { soundManager } from '../../utils/soundEffects';
import { Sparkles, HelpCircle, Heart, Trophy, Smile, Volume2 } from 'lucide-react';

const EXPRESSION_META: Record<
  ExpressionType,
  {
    title: string;
    description: string;
    icon: React.ReactNode;
    gameplayTrigger: string;
    visualCues: {
      andy: string;
      sancho: string;
      osi: string;
    };
  }
> = {
  idle: {
    title: 'Idle / Resting',
    description: 'Calm, gentle stance while awaiting player action without causing cognitive pressure.',
    icon: <Smile className="w-4 h-4 text-slate-500" />,
    gameplayTrigger: 'Player viewing question or exploring map without interaction for >3 seconds.',
    visualCues: {
      andy: 'Relaxed arms by side, gentle resting smile, neutral head posture.',
      sancho: 'Hands in hoodie pocket / relaxed at sides, glasses level, friendly gaze.',
      osi: 'Sitting upright, gentle panting smile, ears perked naturally.'
    }
  },
  happy: {
    title: 'Happy / Delighted',
    description: 'Joyful reaction to small successes, correct counting taps, and discovery.',
    icon: <Heart className="w-4 h-4 text-pink-500" />,
    gameplayTrigger: 'Tapping a counting object, selecting a matching shape, or advancing a step.',
    visualCues: {
      andy: 'Sparkling curved eyes, rosy blushed cheeks, joyful smile.',
      sancho: 'Wide smile, glasses reflection highlight, upbeat head nod.',
      osi: 'Tail wagging, happy open mouth with pink tongue, bright puppy eyes.'
    }
  },
  thinking: {
    title: 'Thinking / Curious',
    description: 'Pondering pose that models thoughtful reflection without anxiety or penalty.',
    icon: <HelpCircle className="w-4 h-4 text-purple-500" />,
    gameplayTrigger: 'A new math riddle or comparison challenge appears on screen.',
    visualCues: {
      andy: 'One finger to cheek, tilted curious brow, small purple thought bubble.',
      sancho: 'Hand thoughtfully adjusting round glasses, analytical raised eyebrow.',
      osi: 'Adorably cocked head to the side, paw resting on chin, bone thought icon.'
    }
  },
  encouraging: {
    title: 'Encouraging / Friendly',
    description: 'Warm reassurance when the child needs a second try or gentle prompt.',
    icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
    gameplayTrigger: 'Child pauses or selects a non-matching item; warm "Let us try again together!".',
    visualCues: {
      andy: 'Gentle nod, open inviting hands, supportive "You got this!" gaze.',
      sancho: 'Thumbs-up gesture with warm supportive smile behind round glasses.',
      osi: 'High-paw raised toward the screen, cheerful encouraging tail swish.'
    }
  },
  celebration: {
    title: 'Celebration / Victory',
    description: 'Big celebratory energy with floating stars and high fives upon level completion.',
    icon: <Trophy className="w-4 h-4 text-amber-500" />,
    gameplayTrigger: 'Level completed, 3 stars earned, or puzzle solved.',
    visualCues: {
      andy: 'Both arms thrown in the air, star clip gleaming, burst of colorful confetti.',
      sancho: 'Hands raised high, big happy cheer, energetic celebratory bounce.',
      osi: 'Joyful spin, tail wagging at top speed, playful bark with confetti stars.'
    }
  }
};

export const CharacterExpressions: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>('andy');
  const [selectedExpression, setSelectedExpression] = useState<ExpressionType>('happy');

  const char = CHARACTERS.find((c) => c.id === selectedCharacter) || CHARACTERS[0];
  const meta = EXPRESSION_META[selectedExpression];

  const handleExpressionClick = (expr: ExpressionType) => {
    setSelectedExpression(expr);
    soundManager.playPop();
    if (expr === 'celebration') {
      soundManager.playCelebration();
    } else if (expr === 'happy') {
      soundManager.playStarSparkle();
    }
  };

  return (
    <div className="space-y-10">
      {/* Header and Switchers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-fredoka tracking-tight">
            5 Core Expression System
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Engineered emotional states: Idle, Happy, Thinking, Encouraging, and Celebration for all three characters.
          </p>
        </div>

        {/* Character selector */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl gap-1 self-start">
          {CHARACTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCharacter(c.id);
                soundManager.playPop();
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all font-fredoka ${
                selectedCharacter === c.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c.name} ({c.species})
            </button>
          ))}
        </div>
      </div>

      {/* 5-Expression Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {(['idle', 'happy', 'thinking', 'encouraging', 'celebration'] as ExpressionType[]).map((expr) => {
          const itemMeta = EXPRESSION_META[expr];
          const isSelected = selectedExpression === expr;

          return (
            <button
              key={expr}
              onClick={() => handleExpressionClick(expr)}
              className={`text-left p-4 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-50/60 border-amber-400 shadow-md ring-2 ring-amber-300/50'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-xl bg-slate-100 text-slate-700">
                    {itemMeta.icon}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    {expr}
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 font-fredoka">
                  {itemMeta.title}
                </h3>
              </div>

              {/* Character Art Preview */}
              <div className="my-3 py-2 flex items-center justify-center bg-slate-50/80 rounded-2xl h-44 overflow-hidden relative">
                <div className="w-32 h-40">
                  <CharacterArtSvg characterId={selectedCharacter} expression={expr} />
                </div>
                {isSelected && (
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-bold rounded-md font-fredoka">
                    Active
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {itemMeta.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Inspection Card for Selected Expression */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Selected Expression: {meta.title}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">Character: {char.name}</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 font-fredoka">
              {char.name} — &ldquo;{meta.title}&rdquo;
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {meta.description}
            </p>
          </div>

          {/* Sound Catchphrase Trigger */}
          <button
            onClick={() => {
              soundManager.playPop();
              if (selectedExpression === 'celebration') soundManager.playCelebration();
              else soundManager.playStarSparkle();
            }}
            className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
          >
            <Volume2 className="w-4 h-4" />
            <span>Play Emotional Voice & Chime</span>
          </button>
        </div>

        {/* 3-Column Comparative View for All 3 Characters in this Expression */}
        <div className="mt-8">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            Team Comparison in &ldquo;{meta.title}&rdquo; State
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CHARACTERS.map((c) => (
              <div
                key={c.id}
                className={`p-5 rounded-2xl border transition-all ${
                  c.id === selectedCharacter
                    ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-200'
                    : 'bg-slate-50/70 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 font-fredoka text-base">
                      {c.name}
                    </span>
                    <span className="text-xs text-slate-500">({c.species})</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {c.id === 'sancho' ? 'Boy (Tall)' : c.id === 'andy' ? 'Girl' : 'Shih Tzu'}
                  </span>
                </div>

                <div className="flex justify-center items-center h-48 bg-white rounded-xl border border-slate-100 p-2 my-2">
                  <div className="w-36 h-44">
                    <CharacterArtSvg characterId={c.id} expression={selectedExpression} />
                  </div>
                </div>

                {/* Specific Visual Cues for this Character */}
                <div className="mt-3 text-xs space-y-2">
                  <p className="text-slate-700 leading-relaxed">
                    <strong className="font-semibold text-slate-900">Visual Cues: </strong>
                    {meta.visualCues[c.id]}
                  </p>
                  <p className="text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-200/60 italic">
                    &ldquo;{c.catchphrases[selectedExpression]}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pedagogical Guidance */}
        <div className="mt-6 p-4 bg-purple-50/80 border border-purple-200/80 rounded-2xl flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-purple-950 leading-relaxed">
            <strong className="font-semibold">Preschool Emotional Safety:</strong> Notice that there is no &ldquo;Sad&rdquo; or &ldquo;Defeat&rdquo; expression. The game strictly uses &ldquo;Encouraging&rdquo; to turn mistakes into playful learning moments without shame.
          </div>
        </div>
      </div>
    </div>
  );
};

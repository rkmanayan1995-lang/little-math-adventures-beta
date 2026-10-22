import React, { useState } from 'react';
import { CHARACTERS } from '../../data/foundationData';
import { CharacterId, ExpressionType } from '../../types/creativeFoundation';
import { CharacterArtSvg } from './CharacterArtSvg';
import { soundManager } from '../../utils/soundEffects';
import { Volume2, Sparkles, Heart, CheckCircle2, ShieldAlert } from 'lucide-react';

interface CharacterRosterProps {
  onSelectExpressionTab?: () => void;
}

export const CharacterRoster: React.FC<CharacterRosterProps> = ({ onSelectExpressionTab }) => {
  const [activeCharId, setActiveCharId] = useState<CharacterId>('andy');
  const [currentExpression, setCurrentExpression] = useState<ExpressionType>('happy');
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);

  const selectedChar = CHARACTERS.find((c) => c.id === activeCharId) || CHARACTERS[0];

  const handleSpeak = (charId: CharacterId, expr: ExpressionType) => {
    const char = CHARACTERS.find((c) => c.id === charId);
    if (!char) return;
    soundManager.playPop();
    setSpeechBubble(`"${char.catchphrases[expr]}"`);
    setTimeout(() => {
      setSpeechBubble(null);
    }, 4500);
  };

  return (
    <div className="space-y-10">
      {/* Complete Team Key Lockup Showcase */}
      <section className="bg-gradient-to-b from-sky-50 via-amber-50/30 to-pink-50/40 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden">
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300/60 rounded-full text-xs font-bold text-amber-900 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>THE COMPLETE ADVENTURE TRIO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-fredoka">
              Meet Andy, Sancho, and Osi
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
              Always pictured together as a bonded team. They welcome every preschooler as their fourth adventurer to explore numbers, solve puzzles, and celebrate triumphs together.
            </p>
          </div>

          {/* Golden Rule Notice for Sancho */}
          <div className="flex items-start gap-3 p-4 bg-blue-50/80 border border-blue-200 rounded-2xl mb-8">
            <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-blue-900 leading-relaxed">
              <strong className="font-semibold text-blue-950">Canon Character Invariants:</strong> Sancho is a boy, taller than Andy, wearing round glasses and a blue hoodie. Sancho is NOT a dog. Osi is the Shih Tzu dog. All three must always be included when presenting the full team.
            </div>
          </div>

          {/* Interactive Trio Stage */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-md">
            {/* Height & Proportion Baseline Grid */}
            <div className="flex flex-col sm:flex-row items-end justify-center gap-6 sm:gap-12 min-h-[380px] pb-4 border-b border-dashed border-slate-200 relative">
              {/* Height Reference Markers */}
              <div className="absolute left-2 top-4 hidden md:flex flex-col gap-8 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-1 border-b border-slate-200 pb-0.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Sancho (118cm / ~1.12x)</span>
                </div>
                <div className="flex items-center gap-1 border-b border-slate-200 pb-0.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>Andy (105cm / 1.00x)</span>
                </div>
                <div className="flex items-center gap-1 border-b border-slate-200 pb-0.5">
                  <span className="w-2 h-2 rounded-full bg-amber-700" />
                  <span>Osi (28cm / ~0.27x)</span>
                </div>
              </div>

              {/* Sancho (Taller Boy) */}
              <div
                onClick={() => {
                  setActiveCharId('sancho');
                  handleSpeak('sancho', currentExpression);
                }}
                className={`group flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  activeCharId === 'sancho' ? 'scale-105' : 'hover:scale-102 opacity-95'
                }`}
              >
                <div className="relative w-44 h-64 sm:w-52 sm:h-72">
                  <CharacterArtSvg characterId="sancho" expression={currentExpression} />
                </div>
                <div className="mt-3 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-900 rounded-full font-bold text-xs font-fredoka shadow-sm">
                    <span>Sancho (Boy)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Round Glasses · Blue Hoodie</p>
                </div>
              </div>

              {/* Andy (Curious Girl) */}
              <div
                onClick={() => {
                  setActiveCharId('andy');
                  handleSpeak('andy', currentExpression);
                }}
                className={`group flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  activeCharId === 'andy' ? 'scale-105' : 'hover:scale-102 opacity-95'
                }`}
              >
                <div className="relative w-40 h-60 sm:w-48 sm:h-68">
                  <CharacterArtSvg characterId="andy" expression={currentExpression} />
                </div>
                <div className="mt-3 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 text-pink-900 rounded-full font-bold text-xs font-fredoka shadow-sm">
                    <span>Andy (Girl)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Curly Hair · Star Hair Clip</p>
                </div>
              </div>

              {/* Osi (Shih Tzu Dog) */}
              <div
                onClick={() => {
                  setActiveCharId('osi');
                  handleSpeak('osi', currentExpression);
                }}
                className={`group flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  activeCharId === 'osi' ? 'scale-105' : 'hover:scale-102 opacity-95'
                }`}
              >
                <div className="relative w-32 h-40 sm:w-36 sm:h-44">
                  <CharacterArtSvg characterId="osi" expression={currentExpression} />
                </div>
                <div className="mt-3 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-bold text-xs font-fredoka shadow-sm">
                    <span>Osi (Shih Tzu Dog)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Blue Glasses · Paw Bandana</p>
                </div>
              </div>
            </div>

            {/* Expression Synchronizer Toolbar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Live Team Expression:</span>
                <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1">
                  {(['idle', 'happy', 'thinking', 'encouraging', 'celebration'] as ExpressionType[]).map((expr) => (
                    <button
                      key={expr}
                      onClick={() => {
                        setCurrentExpression(expr);
                        soundManager.playPop();
                        if (expr === 'celebration') soundManager.playCelebration();
                      }}
                      className={`px-3 py-1 text-xs font-bold capitalize rounded-lg transition-colors font-fredoka ${
                        currentExpression === expr
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {expr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speech Bubble / Voice Preview */}
              {speechBubble ? (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-amber-900 text-xs sm:text-sm font-medium animate-fadeIn">
                  <Volume2 className="w-4 h-4 text-amber-600 shrink-0 animate-bounce" />
                  <span>{speechBubble}</span>
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">
                  Tap any character above to hear their voice and catchphrase!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Individual Character Detail Specifications */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-fredoka">
              Individual Character Specifications & Roles
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Inspect full visual traits, math roles, and accessories designed for high preschool recognition.
            </p>
          </div>

          {/* Character Switcher Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1">
            {CHARACTERS.map((char) => (
              <button
                key={char.id}
                onClick={() => {
                  setActiveCharId(char.id);
                  soundManager.playPop();
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all font-fredoka flex items-center gap-1.5 ${
                  activeCharId === char.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{char.name}</span>
                <span className="text-[10px] opacity-75">({char.species})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Character Detail Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Character Visual Avatar */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100/60 rounded-2xl border border-slate-100">
            <div className="w-52 h-64 sm:w-60 sm:h-72">
              <CharacterArtSvg characterId={selectedChar.id} expression={currentExpression} />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => handleSpeak(selectedChar.id, currentExpression)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Voice Line</span>
              </button>
              {onSelectExpressionTab && (
                <button
                  onClick={onSelectExpressionTab}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  View 5 Expressions →
                </button>
              )}
            </div>
          </div>

          {/* Character Details & Trait Inventory */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedChar.colorTheme.badgeBg}`}>
                  {selectedChar.role}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">Age: {selectedChar.age}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">{selectedChar.heightRelative}</span>
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900 font-fredoka">
                {selectedChar.name}
              </h4>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {selectedChar.personality}
              </p>
            </div>

            {/* Visual Traits Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">Hair / Fur:</span>
                <p className="text-slate-600 leading-normal">{selectedChar.visualTraits.hairOrFur}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">Eyes & Glasses:</span>
                <p className="text-slate-600 leading-normal">{selectedChar.visualTraits.eyesAndGlasses}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">Clothing & Shoes:</span>
                <p className="text-slate-600 leading-normal">
                  {selectedChar.visualTraits.clothing} · {selectedChar.visualTraits.footwear}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-800 block mb-1">Backpack & Signature Item:</span>
                <p className="text-slate-600 leading-normal">
                  {selectedChar.visualTraits.backpack} · {selectedChar.visualTraits.signatureAccessory}
                </p>
              </div>
            </div>

            {/* Math Learning Role */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Preschool Math Pedagogical Role:</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {selectedChar.mathRole}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { COUNTING_OBJECTS } from '../../data/foundationData';
import { CountingObjectArt } from './CountingObjectsArtSvg';
import { CharacterArtSvg } from '../characters/CharacterArtSvg';
import { soundManager } from '../../utils/soundEffects';
import { Plus, Minus, RotateCcw, Sparkles, Volume2, CheckCircle } from 'lucide-react';

export const CountingObjectsLab: React.FC = () => {
  const [selectedObjectType, setSelectedObjectType] = useState<'apple' | 'star' | 'frog' | 'ball' | 'flower'>('apple');
  const [itemsCount, setItemsCount] = useState<number>(4);
  const [tappedIndices, setTappedIndices] = useState<number[]>([0, 1, 2, 3]);

  const currentObjMeta = COUNTING_OBJECTS.find((o) => o.id === selectedObjectType) || COUNTING_OBJECTS[0];

  const handleAddItem = () => {
    if (itemsCount < 10) {
      const nextCount = itemsCount + 1;
      setItemsCount(nextCount);
      setTappedIndices([...tappedIndices, nextCount - 1]);
      soundManager.playCountNote(nextCount);
      if (nextCount === 5 || nextCount === 10) {
        soundManager.playCelebration();
      }
    }
  };

  const handleRemoveItem = () => {
    if (itemsCount > 1) {
      const nextCount = itemsCount - 1;
      setItemsCount(nextCount);
      setTappedIndices(tappedIndices.filter((idx) => idx < nextCount));
      soundManager.playPop();
    }
  };

  const handleReset = () => {
    setItemsCount(3);
    setTappedIndices([0, 1, 2]);
    soundManager.playPop();
  };

  const handleTapItem = (index: number) => {
    soundManager.playCountNote(index + 1);
    if (!tappedIndices.includes(index)) {
      setTappedIndices([...tappedIndices, index]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-700 bg-pink-100 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>SOFT 3D COUNTING OBJECTS LAB</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-fredoka tracking-tight">
            Reusable Math Counting Objects
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Designed for preschool tactile manipulation, one-to-one correspondence, and pattern matching. Polished soft 3D clay aesthetic with large friendly tap targets.
          </p>
        </div>

        {/* Object Type Switcher */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl gap-1 self-start flex-wrap">
          {COUNTING_OBJECTS.map((obj) => (
            <button
              key={obj.id}
              onClick={() => {
                setSelectedObjectType(obj.id as 'apple' | 'star' | 'frog' | 'ball' | 'flower');
                soundManager.playPop();
              }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all font-fredoka flex items-center gap-1.5 ${
                selectedObjectType === obj.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{obj.name.split(' ')[1] || obj.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5-Object Showcase Shelf */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {COUNTING_OBJECTS.map((obj) => {
          const isSelected = selectedObjectType === obj.id;
          return (
            <div
              key={obj.id}
              onClick={() => {
                setSelectedObjectType(obj.id as 'apple' | 'star' | 'frog' | 'ball' | 'flower');
                soundManager.playPop();
              }}
              className={`p-4 rounded-3xl border text-center cursor-pointer transition-all ${
                isSelected
                  ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-300 shadow-md scale-102'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex justify-center items-center h-20 mb-2">
                <CountingObjectArt
                  type={obj.id as 'apple' | 'star' | 'frog' | 'ball' | 'flower'}
                  size={56}
                  highlighted={isSelected}
                />
              </div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 font-fredoka">
                {obj.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 capitalize font-medium">
                Category: {obj.category}
              </p>
            </div>
          );
        })}
      </div>

      {/* Interactive Counting Playground Stage */}
      <div className="bg-gradient-to-b from-sky-50 via-emerald-50/30 to-amber-50/40 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200/60">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-fredoka flex items-center gap-2">
              <span>Interactive One-to-One Counting Arena</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                Count: {itemsCount}
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Tap any item to hear its pentatonic chime and count number out loud!
            </p>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRemoveItem}
              disabled={itemsCount <= 1}
              className="p-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 rounded-xl transition-all shadow-sm active:translate-y-0.5"
              aria-label="Remove item"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-12 text-center text-xl font-extrabold text-slate-900 font-fredoka tabular-nums">
              {itemsCount}
            </span>

            <button
              onClick={handleAddItem}
              disabled={itemsCount >= 10}
              className="p-2.5 bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-40 rounded-xl transition-all shadow-sm active:translate-y-0.5"
              aria-label="Add item"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl transition-all shadow-sm ml-2"
              title="Reset count"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Counting Meadow Stage with Items Grid */}
        <div className="min-h-[260px] bg-white/90 rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-inner flex flex-wrap items-center justify-center gap-6 sm:gap-8 relative">
          {Array.from({ length: itemsCount }).map((_, idx) => {
            const isTapped = tappedIndices.includes(idx);
            return (
              <div
                key={idx}
                onClick={() => handleTapItem(idx)}
                className="flex flex-col items-center group cursor-pointer transition-all duration-200 transform hover:scale-110 active:scale-95"
              >
                {/* Number Badge Pill on top */}
                <div
                  className={`mb-2 px-2.5 py-0.5 rounded-full text-xs font-black font-fredoka transition-all ${
                    isTapped
                      ? 'bg-amber-400 text-slate-900 shadow-sm scale-105'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {idx + 1}
                </div>

                {/* Counting Object Visual */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-1 bg-gradient-to-b from-slate-50 to-slate-100/60 rounded-2xl border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                  <CountingObjectArt
                    type={selectedObjectType}
                    size={64}
                    highlighted={isTapped}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Team Feedback Reaction Banner */}
        <div className="mt-6 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-14 shrink-0">
              <CharacterArtSvg
                characterId="andy"
                expression={itemsCount >= 5 ? 'celebration' : 'happy'}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-pink-700 font-fredoka">Andy & Sancho:</span>
                <span className="text-xs text-slate-500 font-medium">
                  {itemsCount >= 5 ? 'Awesome math milestone!' : 'Keep counting together!'}
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-0.5">
                {itemsCount === 1 && 'Look, we have 1 shiny item! Can you add one more?'}
                {itemsCount > 1 && itemsCount < 5 && `Great job! We have counted ${itemsCount} items together!`}
                {itemsCount === 5 && 'High Five! That makes a complete set of 5!'}
                {itemsCount > 5 && itemsCount < 10 && `Super counting! We are up to ${itemsCount}!`}
                {itemsCount === 10 && 'Ten out of ten! A perfect ten! Osi is doing a happy spin!'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playCelebration();
            }}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl text-xs font-bold font-fredoka flex items-center gap-1.5 shadow-sm whitespace-nowrap active:translate-y-0.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-900" />
            <span>Celebrate Count!</span>
          </button>
        </div>
      </div>

      {/* Object Design Specifications Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h4 className="font-extrabold text-base text-slate-900 font-fredoka mb-3">
          Preschool Object Design Specifications
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">Touch Target & Ergonomics:</span>
            <p className="text-slate-600 leading-relaxed">
              Minimum interactive bounding container is 64x64px (actual touch target 56px minimum per WCAG preschool guidelines). Generous 16px padding between adjacent items prevents accidental double-taps by developing fine motor skills.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">3D Shading & Volume Technique:</span>
            <p className="text-slate-600 leading-relaxed">
              Soft 45-degree top-left light source with soft white specular highlight and subtle dark warm rim bounce. Zero aggressive black outlines; contours use rich saturated tones (e.g. ruby red #B91C1C for apples, deep emerald #047857 for frogs).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

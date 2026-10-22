import React from 'react';
import { Sparkles, Compass, Heart, BookOpen, Users, Award } from 'lucide-react';
import { CharacterArtSvg } from '../characters/CharacterArtSvg';
import { soundManager } from '../../utils/soundEffects';

export const StoryWorldSection: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Narrative Hero Banner */}
      <section className="bg-gradient-to-r from-amber-100/70 via-rose-50 to-sky-100/70 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 border border-amber-300 rounded-full text-xs font-bold text-amber-900 mb-3 shadow-xs font-fredoka">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>NARRATIVE & STORY FOUNDATION</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-fredoka tracking-tight">
            The Magical Number World
          </h2>
          <p className="mt-3 text-slate-700 text-sm sm:text-base leading-relaxed">
            In a vibrant, gentle world where numbers grow on trees and river stepping stones sing when counted, three inseparable best friends — <strong>Andy</strong>, <strong>Sancho</strong>, and <strong>Osi</strong> — embark on cheerful everyday learning quests. They don&apos;t just ask children to solve math problems; they invite the child to become their beloved fourth adventurer and solve the mysteries together as equal partners.
          </p>
        </div>

        {/* Mini Trio Silhouette Accent */}
        <div className="mt-6 flex items-end gap-4 p-4 bg-white/70 backdrop-blur-xs rounded-2xl border border-white/60 w-fit">
          <div className="w-16 h-20">
            <CharacterArtSvg characterId="sancho" expression="happy" />
          </div>
          <div className="w-14 h-18">
            <CharacterArtSvg characterId="andy" expression="happy" />
          </div>
          <div className="w-12 h-14">
            <CharacterArtSvg characterId="osi" expression="happy" />
          </div>
          <div className="text-xs text-slate-700 font-medium pl-2 border-l border-slate-200">
            <span className="font-bold text-slate-900 block font-fredoka">Always Together:</span>
            Sancho (Boy) · Andy (Girl) · Osi (Shih Tzu Dog)
          </div>
        </div>
      </section>

      {/* Story Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900 font-fredoka">
            The 4th Adventurer Invitation
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The narrative never talks down to the preschooler. Dialogue uses &ldquo;Let&apos;s find out together!&rdquo; and &ldquo;We need your keen eyes!&rdquo;. The player is not being tested; they are a hero helping their friends journey across the map.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900 font-fredoka">
            Progression Unlocks The World
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every successfully completed level opens the pathway to the next destination. Bridges raise, gates sparkle open, and new landscapes emerge from the mist, connecting math proficiency with exciting world exploration.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900 font-fredoka">
            Zero Defeat, Pure Encouragement
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Mistakes never result in red crosses, buzzers, or sad faces. When a choice is incorrect, Andy tilts her head curiously and Sancho kindly suggests, &ldquo;Let&apos;s recount together!&rdquo; preserving intrinsic curiosity and confidence.
          </p>
        </div>
      </div>

      {/* Target Audience & Pedagogical Framework */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xl text-slate-900 font-fredoka">
              Pedagogical Age Alignment (Ages 3–7)
            </h3>
            <p className="text-xs text-slate-500">
              Developmentally sequenced math milestones embedded into the character dynamic.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 block font-fredoka text-sm">
              Level 1: Ages 3–4 (Subitizing & 1-to-5)
            </span>
            <p className="text-slate-600 leading-relaxed">
              Focuses on physical touch counting, matching identical fruit objects, and hearing Osi bark counts (1, 2, 3) to reinforce phonological rhythm.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 block font-fredoka text-sm">
              Level 2: Ages 5 (Numbers 6–10 & Patterns)
            </span>
            <p className="text-slate-600 leading-relaxed">
              Andy guides visual pattern spotting (Star, Apple, Star, Apple). Comparing sets (&ldquo;Which basket has more?&rdquo;) and ordering sizes (small, medium, big).
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 block font-fredoka text-sm">
              Level 3: Ages 6–7 (Early Operations & Shapes)
            </span>
            <p className="text-slate-600 leading-relaxed">
              Sancho introduces early combination (+1, +2) and geometric properties (sides, corners) through hands-on toy building blocks and puzzle keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { CharacterId, ExpressionType } from '../../types/creativeFoundation';

interface CharacterArtSvgProps {
  characterId: CharacterId;
  expression?: ExpressionType;
  className?: string;
  showBackpack?: boolean;
  scale?: number;
}

export const CharacterArtSvg: React.FC<CharacterArtSvgProps> = ({
  characterId,
  expression = 'idle',
  className = 'w-full h-full',
  scale = 1
}) => {
  if (characterId === 'andy') {
    return <AndySvg expression={expression} className={className} scale={scale} />;
  }
  if (characterId === 'sancho') {
    return <SanchoSvg expression={expression} className={className} scale={scale} />;
  }
  return <OsiSvg expression={expression} className={className} scale={scale} />;
};

/**
 * ANDY: Curious girl, voluminous curly brown hair, pink outfit,
 * denim shorts, pink sneakers, purple backpack, star hair clip.
 */
export const AndySvg: React.FC<{ expression: ExpressionType; className?: string; scale?: number }> = ({
  expression,
  className = '',
  scale = 1
}) => {
  // Expression variations
  const isHappy = expression === 'happy';
  const isThinking = expression === 'thinking';
  const isEncouraging = expression === 'encouraging';
  const isCelebration = expression === 'celebration';

  return (
    <svg
      viewBox="0 0 240 320"
      className={`${className} overflow-visible`}
      style={{ transform: `scale(${scale})` }}
      aria-label={`Andy - ${expression} expression`}
    >
      <defs>
        {/* Soft 3D Lighting Gradients */}
        <linearGradient id="andySkin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>
        <radialGradient id="andyHairGrad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="60%" stopColor="#54240A" />
          <stop offset="100%" stopColor="#3C1805" />
        </radialGradient>
        <linearGradient id="andyPinkShirt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>
        <linearGradient id="andyDenimShorts" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="andyBackpack" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
        <radialGradient id="starGold" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="60%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#EAB308" />
        </radialGradient>
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#3F1B06" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Ground Contact Shadow */}
      <ellipse cx="120" cy="305" rx="55" ry="10" fill="#E2E8F0" opacity="0.6" />

      {/* Purple Backpack (peek behind shoulders) */}
      <g id="andy-backpack" filter="url(#softShadow)">
        <rect x="70" y="140" width="100" height="85" rx="28" fill="url(#andyBackpack)" />
        <rect x="85" y="155" width="70" height="50" rx="16" fill="#9333EA" opacity="0.8" />
        {/* Zipper pull */}
        <circle cx="120" cy="180" r="4" fill="#FACC15" />
      </g>

      {/* Legs & Pink Sneakers */}
      <g id="andy-legs">
        {/* Legs with denim shorts cuffs */}
        <rect x="94" y="225" width="16" height="55" rx="8" fill="url(#andySkin)" />
        <rect x="130" y="225" width="16" height="55" rx="8" fill="url(#andySkin)" />
        
        {/* Pink Sneakers with white rubber toe and sole */}
        {/* Left Shoe */}
        <g transform="translate(86, 275)">
          <path d="M4 18 C4 8 12 6 24 6 C28 6 32 10 32 18 L32 24 L4 24 Z" fill="#F472B6" />
          <rect x="2" y="22" width="32" height="6" rx="3" fill="#FFFFFF" />
          <circle cx="10" cy="14" r="2" fill="#FFFFFF" />
          <circle cx="16" cy="14" r="2" fill="#FFFFFF" />
        </g>
        {/* Right Shoe */}
        <g transform="translate(122, 275)">
          <path d="M4 18 C4 8 12 6 24 6 C28 6 32 10 32 18 L32 24 L4 24 Z" fill="#F472B6" />
          <rect x="2" y="22" width="32" height="6" rx="3" fill="#FFFFFF" />
          <circle cx="10" cy="14" r="2" fill="#FFFFFF" />
          <circle cx="16" cy="14" r="2" fill="#FFFFFF" />
        </g>
      </g>

      {/* Denim Shorts */}
      <g id="andy-shorts">
        <path d="M86 195 L154 195 L158 232 L128 232 L120 205 L112 232 L82 232 Z" fill="url(#andyDenimShorts)" />
        {/* Stitching */}
        <path d="M90 226 L110 226 M130 226 L150 226" stroke="#93C5FD" strokeWidth="2" strokeDasharray="3 2" />
      </g>

      {/* Pink Outfit Top */}
      <g id="andy-top" filter="url(#softShadow)">
        <path d="M84 140 C95 136 145 136 156 140 L164 200 C155 204 85 204 76 200 Z" fill="url(#andyPinkShirt)" />
        {/* Purple Backpack Straps */}
        <path d="M96 140 L94 200" stroke="#7E22CE" strokeWidth="8" strokeLinecap="round" />
        <path d="M144 140 L146 200" stroke="#7E22CE" strokeWidth="8" strokeLinecap="round" />
        {/* Collar */}
        <path d="M106 140 C112 148 128 148 134 140 Z" fill="#FBCFE8" />
      </g>

      {/* Arms & Hands (Expression-dependent) */}
      <g id="andy-arms">
        {isCelebration ? (
          // Arms reaching up in joyful celebration
          <>
            <path d="M82 150 C65 135 60 100 70 85" stroke="url(#andySkin)" strokeWidth="14" strokeLinecap="round" fill="none" />
            <circle cx="70" cy="85" r="9" fill="url(#andySkin)" />
            <path d="M158 150 C175 135 180 100 170 85" stroke="url(#andySkin)" strokeWidth="14" strokeLinecap="round" fill="none" />
            <circle cx="170" cy="85" r="9" fill="url(#andySkin)" />
          </>
        ) : isThinking ? (
          // One arm on hip, one finger to cheek
          <>
            <path d="M84 152 C68 165 72 195 86 195" stroke="url(#andySkin)" strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="86" cy="195" r="8" fill="url(#andySkin)" />
            <path d="M156 152 C170 160 165 140 148 126" stroke="url(#andySkin)" strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="146" cy="122" r="8" fill="url(#andySkin)" />
          </>
        ) : isEncouraging ? (
          // Thumbs up gesture / open friendly hand
          <>
            <path d="M84 152 C70 168 76 190 88 190" stroke="url(#andySkin)" strokeWidth="13" strokeLinecap="round" fill="none" />
            <path d="M156 152 C178 160 182 145 182 135" stroke="url(#andySkin)" strokeWidth="13" strokeLinecap="round" fill="none" />
            {/* Friendly gesture */}
            <circle cx="182" cy="135" r="9" fill="url(#andySkin)" />
            <circle cx="185" cy="128" r="4" fill="url(#andySkin)" />
          </>
        ) : (
          // Idle / Happy relaxed arms
          <>
            <path d="M84 150 C72 165 70 185 74 195" stroke="url(#andySkin)" strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="74" cy="195" r="8" fill="url(#andySkin)" />
            <path d="M156 150 C168 165 170 185 166 195" stroke="url(#andySkin)" strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="166" cy="195" r="8" fill="url(#andySkin)" />
          </>
        )}
      </g>

      {/* Voluminous Curly Brown Hair - Back Clumps */}
      <g id="andy-hair-back">
        {/* Large bouncy curls behind head */}
        <circle cx="68" cy="85" r="32" fill="url(#andyHairGrad)" />
        <circle cx="56" cy="115" r="30" fill="url(#andyHairGrad)" />
        <circle cx="70" cy="142" r="28" fill="url(#andyHairGrad)" />
        <circle cx="172" cy="85" r="32" fill="url(#andyHairGrad)" />
        <circle cx="184" cy="115" r="30" fill="url(#andyHairGrad)" />
        <circle cx="170" cy="142" r="28" fill="url(#andyHairGrad)" />
        <circle cx="120" cy="55" r="36" fill="url(#andyHairGrad)" />
      </g>

      {/* Andy Head & Face */}
      <g id="andy-head" filter="url(#softShadow)">
        <circle cx="120" cy="106" r="42" fill="url(#andySkin)" />
        {/* Soft rosy cheeks */}
        <ellipse cx="98" cy="116" rx="8" ry="5" fill="#F472B6" opacity="0.45" />
        <ellipse cx="142" cy="116" rx="8" ry="5" fill="#F472B6" opacity="0.45" />

        {/* Eyes & Eyebrows based on Expression */}
        {isHappy || isCelebration ? (
          // Joyful curved squinting eyes
          <>
            <path d="M96 106 Q104 98 112 106" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M128 106 Q136 98 144 106" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Sparkles on eyes */}
            <circle cx="112" cy="100" r="1.5" fill="#FDE047" />
            <circle cx="128" cy="100" r="1.5" fill="#FDE047" />
          </>
        ) : isThinking ? (
          // One eyebrow raised, pupils looking up-right
          <>
            <path d="M94 96 Q102 96 110 99" stroke="#54240A" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M128 94 Q136 90 144 94" stroke="#54240A" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            {/* Curious eyes */}
            <circle cx="104" cy="106" r="5" fill="#451A03" />
            <circle cx="106" cy="104" r="1.8" fill="#FFFFFF" />
            <circle cx="138" cy="106" r="5" fill="#451A03" />
            <circle cx="140" cy="104" r="1.8" fill="#FFFFFF" />
          </>
        ) : (
          // Big friendly hazel eyes (Idle / Encouraging)
          <>
            <path d="M95 97 Q103 94 111 97" stroke="#54240A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M129 97 Q137 94 145 97" stroke="#54240A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Eye whites + Hazel iris + pupil + reflection */}
            <circle cx="104" cy="106" r="7" fill="#FFFFFF" />
            <circle cx="104" cy="106" r="5" fill="#78350F" />
            <circle cx="104" cy="106" r="3.5" fill="#1C1917" />
            <circle cx="102" cy="104" r="1.8" fill="#FFFFFF" />

            <circle cx="136" cy="106" r="7" fill="#FFFFFF" />
            <circle cx="136" cy="106" r="5" fill="#78350F" />
            <circle cx="136" cy="106" r="3.5" fill="#1C1917" />
            <circle cx="134" cy="104" r="1.8" fill="#FFFFFF" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="120" cy="112" rx="3.5" ry="2.5" fill="#EA580C" opacity="0.4" />

        {/* Mouth depending on Expression */}
        {isCelebration ? (
          // Huge joyful open mouth with tongue
          <g transform="translate(120, 122)">
            <path d="M-12 0 Q0 18 12 0 Z" fill="#991B1B" />
            <path d="M-6 8 Q0 16 6 8 Z" fill="#F472B6" />
          </g>
        ) : isHappy || isEncouraging ? (
          // Warm broad smile
          <path d="M110 120 Q120 130 130 120" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" fill="none" />
        ) : isThinking ? (
          // Small thoughtful puckered mouth
          <circle cx="123" cy="122" r="3" fill="#991B1B" />
        ) : (
          // Gentle resting smile
          <path d="M112 121 Q120 126 128 121" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}
      </g>

      {/* Voluminous Curly Brown Hair - Front Bangs & Side Curls */}
      <g id="andy-hair-front">
        <circle cx="95" cy="74" r="22" fill="url(#andyHairGrad)" />
        <circle cx="120" cy="68" r="24" fill="url(#andyHairGrad)" />
        <circle cx="145" cy="74" r="22" fill="url(#andyHairGrad)" />
        <circle cx="78" cy="92" r="18" fill="url(#andyHairGrad)" />
        <circle cx="162" cy="92" r="18" fill="url(#andyHairGrad)" />
        {/* Soft curly strands */}
        <path d="M84 76 Q95 86 98 100" stroke="#92400E" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M142 76 Q135 88 138 98" stroke="#92400E" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>

      {/* Signature Yellow Star Hair Clip (pinned above right ear) */}
      <g id="andy-star-clip" transform="translate(148, 70)" filter="url(#softShadow)">
        <polygon
          points="15,0 19,9 29,10 21,17 24,27 15,21 6,27 9,17 1,10 11,9"
          fill="url(#starGold)"
        />
        <circle cx="15" cy="14" r="3" fill="#FFFBEB" />
      </g>

      {/* Celebration Sparkles / Thinking Bubbles */}
      {isCelebration && (
        <g id="celebration-particles">
          <circle cx="50" cy="60" r="4" fill="#FACC15" />
          <circle cx="190" cy="50" r="5" fill="#EC4899" />
          <polygon points="55,100 58,108 66,108 60,113 62,120 55,116 48,120 50,113 44,108 52,108" fill="#60A5FA" transform="scale(0.7)" />
          <polygon points="260,130 263,138 271,138 265,143 267,150 260,146 253,150 255,143 249,138 257,138" fill="#FACC15" transform="scale(0.7)" />
        </g>
      )}
      {isThinking && (
        <g id="thinking-bubble">
          <circle cx="168" cy="46" r="4" fill="#C084FC" opacity="0.7" />
          <circle cx="180" cy="36" r="7" fill="#C084FC" opacity="0.8" />
          <circle cx="198" cy="22" r="14" fill="#F3E8FF" stroke="#A855F7" strokeWidth="2" />
          <text x="198" y="27" fontSize="15" fontWeight="bold" textAnchor="middle" fill="#7E22CE">?</text>
        </g>
      )}
    </svg>
  );
};

/**
 * SANCHO: Boy taller than Andy, curly dark-brown hair, round glasses,
 * blue hoodie, khaki shorts, blue sneakers, backpack. Sancho is a BOY!
 */
export const SanchoSvg: React.FC<{ expression: ExpressionType; className?: string; scale?: number }> = ({
  expression,
  className = '',
  scale = 1
}) => {
  const isHappy = expression === 'happy';
  const isThinking = expression === 'thinking';
  const isEncouraging = expression === 'encouraging';
  const isCelebration = expression === 'celebration';

  return (
    <svg
      viewBox="0 0 240 350"
      className={`${className} overflow-visible`}
      style={{ transform: `scale(${scale})` }}
      aria-label={`Sancho (Boy) - ${expression} expression`}
    >
      <defs>
        <linearGradient id="sanchoSkin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <radialGradient id="sanchoHairGrad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#451A03" />
          <stop offset="70%" stopColor="#2E1002" />
          <stop offset="100%" stopColor="#1C0A00" />
        </radialGradient>
        <linearGradient id="sanchoBlueHoodie" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="sanchoKhakiShorts" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="sanchoBackpack" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* Ground Contact Shadow */}
      <ellipse cx="120" cy="335" rx="60" ry="10" fill="#E2E8F0" opacity="0.6" />

      {/* Navy Backpack (taller silhouette) */}
      <g id="sancho-backpack">
        <rect x="68" y="125" width="104" height="95" rx="26" fill="url(#sanchoBackpack)" />
        <rect x="80" y="140" width="80" height="55" rx="16" fill="#1E40AF" opacity="0.7" />
      </g>

      {/* Legs & Blue Sneakers (Taller than Andy) */}
      <g id="sancho-legs">
        <rect x="94" y="240" width="16" height="68" rx="8" fill="url(#sanchoSkin)" />
        <rect x="130" y="240" width="16" height="68" rx="8" fill="url(#sanchoSkin)" />

        {/* Blue Sneakers */}
        <g transform="translate(86, 305)">
          <path d="M4 18 C4 8 12 6 24 6 C28 6 32 10 32 18 L32 24 L4 24 Z" fill="#2563EB" />
          <rect x="2" y="22" width="32" height="6" rx="3" fill="#FFFFFF" />
          <path d="M12 10 L16 16 M18 10 L14 16" stroke="#93C5FD" strokeWidth="1.5" />
        </g>
        <g transform="translate(122, 305)">
          <path d="M4 18 C4 8 12 6 24 6 C28 6 32 10 32 18 L32 24 L4 24 Z" fill="#2563EB" />
          <rect x="2" y="22" width="32" height="6" rx="3" fill="#FFFFFF" />
          <path d="M12 10 L16 16 M18 10 L14 16" stroke="#93C5FD" strokeWidth="1.5" />
        </g>
      </g>

      {/* Khaki Shorts */}
      <g id="sancho-shorts">
        <path d="M84 205 L156 205 L160 248 L128 248 L120 220 L112 248 L80 248 Z" fill="url(#sanchoKhakiShorts)" />
        {/* Pockets */}
        <rect x="88" y="215" width="18" height="20" rx="4" fill="#92400E" opacity="0.4" />
        <rect x="134" y="215" width="18" height="20" rx="4" fill="#92400E" opacity="0.4" />
      </g>

      {/* Blue Hoodie (Boy fit) */}
      <g id="sancho-hoodie">
        <path d="M82 135 C94 130 146 130 158 135 L166 210 C154 214 86 214 74 210 Z" fill="url(#sanchoBlueHoodie)" />
        {/* Kangaroo Pocket */}
        <path d="M96 175 L144 175 L148 200 L92 200 Z" fill="#1D4ED8" rx="6" />
        {/* Drawstrings */}
        <path d="M112 140 L112 162" stroke="#FEF3C7" strokeWidth="3" strokeLinecap="round" />
        <path d="M128 140 L128 162" stroke="#FEF3C7" strokeWidth="3" strokeLinecap="round" />
        {/* Hood Rim */}
        <path d="M100 135 C110 144 130 144 140 135 Z" fill="#1E40AF" />
      </g>

      {/* Arms & Hands (Expression-dependent) */}
      <g id="sancho-arms">
        {isCelebration ? (
          <>
            <path d="M80 145 C60 130 55 90 68 75" stroke="url(#sanchoSkin)" strokeWidth="14" strokeLinecap="round" fill="none" />
            <circle cx="68" cy="75" r="9" fill="url(#sanchoSkin)" />
            <path d="M160 145 C180 130 185 90 172 75" stroke="url(#sanchoSkin)" strokeWidth="14" strokeLinecap="round" fill="none" />
            <circle cx="172" cy="75" r="9" fill="url(#sanchoSkin)" />
          </>
        ) : isThinking ? (
          <>
            {/* Hand adjusting round glasses / chin */}
            <path d="M80 145 C65 160 68 190 78 195" stroke="url(#sanchoSkin)" strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="78" cy="195" r="8" fill="url(#sanchoSkin)" />
            <path d="M160 145 C176 150 168 120 150 105" stroke="url(#sanchoSkin)" strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="150" cy="103" r="8" fill="url(#sanchoSkin)" />
          </>
        ) : isEncouraging ? (
          <>
            {/* Holding thumbs up */}
            <path d="M80 145 C65 160 70 190 82 195" stroke="url(#sanchoSkin)" strokeWidth="13" strokeLinecap="round" fill="none" />
            <path d="M160 145 C180 155 184 140 182 130" stroke="url(#sanchoSkin)" strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="182" cy="130" r="9" fill="url(#sanchoSkin)" />
            <rect x="180" y="118" width="6" height="12" rx="3" fill="url(#sanchoSkin)" />
          </>
        ) : (
          <>
            <path d="M80 145 C68 160 66 185 70 200" stroke="url(#sanchoSkin)" strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="70" cy="200" r="8" fill="url(#sanchoSkin)" />
            <path d="M160 145 C172 160 174 185 170 200" stroke="url(#sanchoSkin)" strokeWidth="13" strokeLinecap="round" fill="none" />
            <circle cx="170" cy="200" r="8" fill="url(#sanchoSkin)" />
          </>
        )}
      </g>

      {/* Curly Dark-Brown Hair - Back */}
      <g id="sancho-hair-back">
        <circle cx="80" cy="75" r="26" fill="url(#sanchoHairGrad)" />
        <circle cx="160" cy="75" r="26" fill="url(#sanchoHairGrad)" />
        <circle cx="120" cy="50" r="32" fill="url(#sanchoHairGrad)" />
      </g>

      {/* Sancho Head & Face */}
      <g id="sancho-head">
        <circle cx="120" cy="98" r="40" fill="url(#sanchoSkin)" />
        {/* Soft blush */}
        <circle cx="98" cy="108" r="6" fill="#F59E0B" opacity="0.3" />
        <circle cx="142" cy="108" r="6" fill="#F59E0B" opacity="0.3" />

        {/* Sancho Round Glasses (Charming signature accessory) */}
        <g id="sancho-glasses">
          {/* Left Lens */}
          <circle cx="102" cy="98" r="16" fill="#EFF6FF" opacity="0.5" stroke="#1E293B" strokeWidth="4" />
          {/* Right Lens */}
          <circle cx="138" cy="98" r="16" fill="#EFF6FF" opacity="0.5" stroke="#1E293B" strokeWidth="4" />
          {/* Bridge */}
          <path d="M118 98 Q120 95 122 98" stroke="#1E293B" strokeWidth="4" fill="none" />
          {/* Temples */}
          <path d="M86 98 L78 95 M154 98 L162 95" stroke="#1E293B" strokeWidth="3" />
          {/* Lens Glare */}
          <path d="M94 92 L100 86" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M130 92 L136 86" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Eyes behind glasses */}
        {isHappy || isCelebration ? (
          <>
            <path d="M96 98 Q102 92 108 98" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M132 98 Q138 92 144 98" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="102" cy="98" r="5" fill="#1C1917" />
            <circle cx="100" cy="96" r="1.8" fill="#FFFFFF" />
            <circle cx="138" cy="98" r="5" fill="#1C1917" />
            <circle cx="136" cy="96" r="1.8" fill="#FFFFFF" />
          </>
        )}

        {/* Eyebrows over glasses */}
        <path d="M92 78 Q102 75 110 79" stroke="#2E1002" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M130 79 Q138 75 148 78" stroke="#2E1002" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Nose */}
        <path d="M118 106 Q120 110 122 106" stroke="#B45309" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Mouth */}
        {isCelebration ? (
          <path d="M110 118 Q120 130 130 118 Z" fill="#991B1B" />
        ) : isHappy || isEncouraging ? (
          <path d="M112 116 Q120 124 128 116" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" fill="none" />
        ) : isThinking ? (
          <line x1="114" y1="118" x2="126" y2="116" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          <path d="M114 117 Q120 122 126 117" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}
      </g>

      {/* Curly Dark-Brown Hair - Front Tufts */}
      <g id="sancho-hair-front">
        <circle cx="100" cy="65" r="18" fill="url(#sanchoHairGrad)" />
        <circle cx="120" cy="60" r="19" fill="url(#sanchoHairGrad)" />
        <circle cx="140" cy="65" r="18" fill="url(#sanchoHairGrad)" />
        <circle cx="85" cy="74" r="14" fill="url(#sanchoHairGrad)" />
        <circle cx="155" cy="74" r="14" fill="url(#sanchoHairGrad)" />
      </g>

      {isCelebration && (
        <g id="sancho-celebration">
          <circle cx="50" cy="50" r="4" fill="#3B82F6" />
          <circle cx="190" cy="40" r="5" fill="#F59E0B" />
          <circle cx="60" cy="110" r="3" fill="#10B981" />
        </g>
      )}
    </svg>
  );
};

/**
 * OSI: Small Shih Tzu dog with all-brown fur, blue glasses,
 * blue bandana with white paw print, small backpack.
 */
export const OsiSvg: React.FC<{ expression: ExpressionType; className?: string; scale?: number }> = ({
  expression,
  className = '',
  scale = 1
}) => {
  const isHappy = expression === 'happy';
  const isThinking = expression === 'thinking';
  const isEncouraging = expression === 'encouraging';
  const isCelebration = expression === 'celebration';

  return (
    <svg
      viewBox="0 0 200 200"
      className={`${className} overflow-visible`}
      style={{ transform: `scale(${scale})` }}
      aria-label={`Osi (Shih Tzu Dog) - ${expression} expression`}
    >
      <defs>
        {/* All-brown fur gradients */}
        <radialGradient id="osiBrownFur" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#A16207" />
          <stop offset="50%" stopColor="#854D0E" />
          <stop offset="100%" stopColor="#713F12" />
        </radialGradient>
        <radialGradient id="osiMuzzleFur" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#A16207" />
        </radialGradient>
        <linearGradient id="osiBandana" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>

      {/* Ground Contact Shadow */}
      <ellipse cx="100" cy="188" rx="48" ry="8" fill="#E2E8F0" opacity="0.6" />

      {/* Tiny Doggy Backpack on Back */}
      <g id="osi-backpack">
        <rect x="125" y="115" width="30" height="26" rx="8" fill="#1E3A8A" />
        <rect x="130" y="120" width="20" height="16" rx="4" fill="#3B82F6" />
      </g>

      {/* Shih Tzu Body with all-brown fluffy fur */}
      <g id="osi-body">
        <ellipse cx="100" cy="145" rx="42" ry="32" fill="url(#osiBrownFur)" />
        {/* Soft Fluffy Fur Tuft */}
        <circle cx="85" cy="148" r="16" fill="url(#osiBrownFur)" />
        <circle cx="115" cy="148" r="16" fill="url(#osiBrownFur)" />
      </g>

      {/* Wagging Shih Tzu Tail */}
      <g id="osi-tail" transform={isCelebration ? 'rotate(-25 150 140)' : 'rotate(0 150 140)'}>
        <path d="M138 140 C155 130 168 115 160 100 C152 90 142 105 145 125" fill="url(#osiBrownFur)" />
        <circle cx="158" cy="100" r="10" fill="url(#osiBrownFur)" />
      </g>

      {/* Paws */}
      <g id="osi-paws">
        {/* Back Paws */}
        <ellipse cx="75" cy="176" rx="14" ry="9" fill="url(#osiBrownFur)" />
        <ellipse cx="125" cy="176" rx="14" ry="9" fill="url(#osiBrownFur)" />
        {/* Front Paws */}
        {isEncouraging ? (
          // One paw raised for a high-five
          <>
            <ellipse cx="88" cy="176" rx="13" ry="9" fill="url(#osiBrownFur)" />
            <g transform="translate(112, 145)">
              <ellipse cx="8" cy="8" rx="12" ry="10" fill="url(#osiBrownFur)" />
              {/* Mocha paw pads */}
              <circle cx="8" cy="7" r="4" fill="#451A03" />
              <circle cx="4" cy="12" r="2" fill="#451A03" />
              <circle cx="8" cy="13" r="2" fill="#451A03" />
              <circle cx="12" cy="12" r="2" fill="#451A03" />
            </g>
          </>
        ) : (
          <>
            <ellipse cx="88" cy="176" rx="13" ry="9" fill="url(#osiBrownFur)" />
            <ellipse cx="112" cy="176" rx="13" ry="9" fill="url(#osiBrownFur)" />
          </>
        )}
      </g>

      {/* Blue Bandana with Crisp White Paw Print Badge */}
      <g id="osi-bandana">
        <path d="M68 118 C80 122 120 122 132 118 L100 152 Z" fill="url(#osiBandana)" />
        {/* White Paw Print Emblem */}
        <g id="paw-emblem" transform="translate(100, 132) scale(0.7)">
          <ellipse cx="0" cy="3" rx="6" ry="5" fill="#FFFFFF" />
          <circle cx="-5" cy="-5" r="2.5" fill="#FFFFFF" />
          <circle cx="0" cy="-7" r="2.5" fill="#FFFFFF" />
          <circle cx="5" cy="-5" r="2.5" fill="#FFFFFF" />
        </g>
      </g>

      {/* Fluffy Shih Tzu Ears (All-Brown Fur) */}
      <g id="osi-ears">
        {/* Left Ear */}
        <path d="M62 60 C42 70 40 105 58 115 C65 110 68 85 68 65 Z" fill="url(#osiBrownFur)" />
        {/* Right Ear */}
        <path d="M138 60 C158 70 160 105 142 115 C135 110 132 85 132 65 Z" fill="url(#osiBrownFur)" />
      </g>

      {/* Shih Tzu Head (All-Brown Fur) */}
      <g id="osi-head">
        <circle cx="100" cy="76" r="38" fill="url(#osiBrownFur)" />
        {/* Fluffy Cheeks */}
        <circle cx="72" cy="84" r="16" fill="url(#osiBrownFur)" />
        <circle cx="128" cy="84" r="16" fill="url(#osiBrownFur)" />
        {/* Forehead fluff */}
        <circle cx="100" cy="46" r="14" fill="url(#osiBrownFur)" />

        {/* Lighter brown muzzle */}
        <ellipse cx="100" cy="86" rx="20" ry="15" fill="url(#osiMuzzleFur)" />

        {/* Osi's Signature Blue Glasses */}
        <g id="osi-glasses">
          <circle cx="86" cy="74" r="14" fill="#EFF6FF" opacity="0.4" stroke="#2563EB" strokeWidth="3.5" />
          <circle cx="114" cy="74" r="14" fill="#EFF6FF" opacity="0.4" stroke="#2563EB" strokeWidth="3.5" />
          <path d="M99 74 L101 74" stroke="#2563EB" strokeWidth="4" />
          <path d="M72 74 L68 70 M128 74 L132 70" stroke="#2563EB" strokeWidth="3" />
        </g>

        {/* Shiny Puppy Eyes */}
        {isHappy || isCelebration ? (
          <>
            <path d="M81 74 Q86 68 91 74" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M109 74 Q114 68 119 74" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="86" cy="74" r="4.5" fill="#1C1917" />
            <circle cx="84.5" cy="72.5" r="1.6" fill="#FFFFFF" />
            <circle cx="114" cy="74" r="4.5" fill="#1C1917" />
            <circle cx="112.5" cy="72.5" r="1.6" fill="#FFFFFF" />
          </>
        )}

        {/* Shih Tzu Cute Black Button Nose */}
        <ellipse cx="100" cy="83" rx="5" ry="3.5" fill="#18181B" />
        <circle cx="98.5" cy="82" r="1" fill="#FFFFFF" />

        {/* Mouth / Tongue */}
        {isCelebration || isHappy ? (
          // Happy open mouth with pink panting tongue
          <g transform="translate(100, 89)">
            <path d="M-6 0 Q0 8 6 0" stroke="#18181B" strokeWidth="2" fill="none" />
            <path d="M-3 2 C-3 10 3 10 3 2 Z" fill="#F472B6" />
          </g>
        ) : isThinking ? (
          <path d="M96 89 Q100 87 104 89" stroke="#18181B" strokeWidth="2" strokeLinecap="round" fill="none" />
        ) : (
          // Gentle puppy smile
          <path d="M94 88 Q100 93 106 88" stroke="#18181B" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}
      </g>

      {/* Thinking Cloud / Celebration Sparkles */}
      {isThinking && (
        <g id="osi-thinking">
          <circle cx="140" cy="40" r="3" fill="#60A5FA" />
          <circle cx="150" cy="30" r="6" fill="#93C5FD" />
          <circle cx="166" cy="18" r="12" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2" />
          <text x="166" y="23" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#1D4ED8">🦴</text>
        </g>
      )}
      {isCelebration && (
        <g id="osi-celebration">
          <circle cx="45" cy="40" r="3" fill="#F59E0B" />
          <circle cx="155" cy="35" r="4" fill="#3B82F6" />
          <circle cx="100" cy="20" r="4" fill="#EC4899" />
        </g>
      )}
    </svg>
  );
};

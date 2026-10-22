import React from 'react';

interface CountingObjectArtProps {
  type: 'apple' | 'star' | 'frog' | 'ball' | 'flower';
  className?: string;
  size?: number;
  highlighted?: boolean;
}

export const CountingObjectArt: React.FC<CountingObjectArtProps> = ({
  type,
  className = 'w-16 h-16',
  size = 64,
  highlighted = false
}) => {
  switch (type) {
    case 'apple':
      return <AppleSvg className={className} size={size} highlighted={highlighted} />;
    case 'star':
      return <StarSvg className={className} size={size} highlighted={highlighted} />;
    case 'frog':
      return <FrogSvg className={className} size={size} highlighted={highlighted} />;
    case 'ball':
      return <BallSvg className={className} size={size} highlighted={highlighted} />;
    case 'flower':
      return <FlowerSvg className={className} size={size} highlighted={highlighted} />;
    default:
      return null;
  }
};

/**
 * 🍎 Sweet Ruby Apple - soft 3D rounded apple with glossy shine and lime leaf
 */
export const AppleSvg: React.FC<{ className?: string; size?: number; highlighted?: boolean }> = ({
  className = '',
  size = 64,
  highlighted = false
}) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={`${className} transition-transform ${highlighted ? 'scale-110 drop-shadow-lg' : ''}`}
    aria-label="Ruby Apple"
  >
    <defs>
      <radialGradient id="appleBody" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="55%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#B91C1C" />
      </radialGradient>
      <linearGradient id="appleLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="100%" stopColor="#22C55E" />
      </linearGradient>
    </defs>
    {/* Contact Shadow */}
    <ellipse cx="50" cy="92" rx="28" ry="5" fill="#000000" opacity="0.12" />

    {/* Brown stem */}
    <path d="M50 28 C52 14 62 10 65 8" stroke="#78350F" strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Soft green leaf */}
    <path d="M54 22 C68 14 78 20 72 30 C62 34 56 26 54 22 Z" fill="url(#appleLeaf)" />

    {/* Apple Body (rounded indent at top and bottom) */}
    <path
      d="M50 28 C30 22 14 36 16 62 C18 84 38 90 50 86 C62 90 82 84 84 62 C86 36 70 22 50 28 Z"
      fill="url(#appleBody)"
    />

    {/* Glossy Soft-3D Highlight */}
    <ellipse cx="34" cy="44" rx="9" ry="16" transform="rotate(-25 34 44)" fill="#FFFFFF" opacity="0.45" />
    <circle cx="28" cy="62" r="4" fill="#FFFFFF" opacity="0.3" />
  </svg>
);

/**
 * ⭐ Golden Glow Star - friendly soft 3D star with warm smile
 */
export const StarSvg: React.FC<{ className?: string; size?: number; highlighted?: boolean }> = ({
  className = '',
  size = 64,
  highlighted = false
}) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={`${className} transition-transform ${highlighted ? 'scale-110 drop-shadow-xl animate-pulse' : ''}`}
    aria-label="Golden Star"
  >
    <defs>
      <radialGradient id="starShine" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#D97706" />
      </radialGradient>
      <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Contact Shadow */}
    <ellipse cx="50" cy="94" rx="26" ry="4" fill="#000000" opacity="0.1" />

    {/* Ambient Glow Aura */}
    <circle cx="50" cy="48" r="42" fill="#FEF08A" opacity="0.35" filter="url(#starGlow)" />

    {/* Beveled Rounded Star */}
    <path
      d="M50 8 L62 34 L92 37 L69 57 L76 86 L50 71 L24 86 L31 57 L8 37 L38 34 Z"
      fill="url(#starShine)"
      stroke="#B45309"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Inner Soft Facet Highlight */}
    <path d="M50 8 L62 34 L50 52 L38 34 Z" fill="#FFFFFF" opacity="0.3" />

    {/* Friendly Cartoon Eyes & Smile */}
    <circle cx="44" cy="48" r="3" fill="#451A03" />
    <circle cx="56" cy="48" r="3" fill="#451A03" />
    <circle cx="43" cy="46.5" r="1" fill="#FFFFFF" />
    <circle cx="55" cy="46.5" r="1" fill="#FFFFFF" />
    <path d="M46 54 Q50 58 54 54" stroke="#451A03" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Rosy blush */}
    <circle cx="40" cy="52" r="2.5" fill="#F43F5E" opacity="0.4" />
    <circle cx="60" cy="52" r="2.5" fill="#F43F5E" opacity="0.4" />
  </svg>
);

/**
 * 🐸 Bouncy Meadow Frog - emerald green with cute spots
 */
export const FrogSvg: React.FC<{ className?: string; size?: number; highlighted?: boolean }> = ({
  className = '',
  size = 64,
  highlighted = false
}) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={`${className} transition-transform ${highlighted ? 'scale-110 drop-shadow-lg' : ''}`}
    aria-label="Meadow Frog"
  >
    <defs>
      <radialGradient id="frogSkin" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="60%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#047857" />
      </radialGradient>
      <radialGradient id="frogBelly" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#FDE68A" />
      </radialGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="50" cy="90" rx="32" ry="6" fill="#000000" opacity="0.12" />

    {/* Back Jumping Legs */}
    <ellipse cx="22" cy="74" rx="14" ry="10" transform="rotate(-20 22 74)" fill="url(#frogSkin)" />
    <ellipse cx="78" cy="74" rx="14" ry="10" transform="rotate(20 78 74)" fill="url(#frogSkin)" />
    <ellipse cx="14" cy="85" rx="8" ry="4" fill="#047857" />
    <ellipse cx="86" cy="85" rx="8" ry="4" fill="#047857" />

    {/* Frog Body */}
    <ellipse cx="50" cy="65" rx="28" ry="24" fill="url(#frogSkin)" />
    {/* Light peach belly */}
    <ellipse cx="50" cy="70" rx="18" ry="14" fill="url(#frogBelly)" />
    <circle cx="44" cy="74" r="2" fill="#F59E0B" opacity="0.5" />
    <circle cx="54" cy="70" r="2.5" fill="#F59E0B" opacity="0.5" />

    {/* Eye Pods on Top */}
    <circle cx="36" cy="38" r="14" fill="url(#frogSkin)" />
    <circle cx="64" cy="38" r="14" fill="url(#frogSkin)" />
    {/* White eye balls */}
    <circle cx="36" cy="38" r="9" fill="#FFFFFF" />
    <circle cx="64" cy="38" r="9" fill="#FFFFFF" />
    {/* Pupils */}
    <circle cx="37" cy="38" r="5" fill="#064E3B" />
    <circle cx="63" cy="38" r="5" fill="#064E3B" />
    <circle cx="35" cy="36" r="1.8" fill="#FFFFFF" />
    <circle cx="61" cy="36" r="1.8" fill="#FFFFFF" />

    {/* Happy Wide Smile */}
    <path d="M38 56 Q50 66 62 56" stroke="#064E3B" strokeWidth="3" strokeLinecap="round" fill="none" />
    <circle cx="34" cy="58" r="3" fill="#F472B6" opacity="0.5" />
    <circle cx="66" cy="58" r="3" fill="#F472B6" opacity="0.5" />
  </svg>
);

/**
 * ⚽ Playful Polka Ball - soft beach ball with pastel curved segments
 */
export const BallSvg: React.FC<{ className?: string; size?: number; highlighted?: boolean }> = ({
  className = '',
  size = 64,
  highlighted = false
}) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={`${className} transition-transform ${highlighted ? 'scale-110 drop-shadow-lg' : ''}`}
    aria-label="Playful Ball"
  >
    <defs>
      <radialGradient id="ballShade" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
        <stop offset="60%" stopColor="#000000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
      </radialGradient>
      <clipPath id="ballClip">
        <circle cx="50" cy="50" r="38" />
      </clipPath>
    </defs>
    {/* Contact Shadow */}
    <ellipse cx="50" cy="92" rx="30" ry="5" fill="#000000" opacity="0.12" />

    {/* Clipped Ball Sphere with 3 Curved Pastel Segments */}
    <g clipPath="url(#ballClip)">
      <circle cx="50" cy="50" r="38" fill="#60A5FA" />
      {/* Peach segment */}
      <path d="M50 12 C68 25 72 75 50 88 C32 75 28 25 50 12 Z" fill="#FBBF24" />
      {/* Pink segment */}
      <path d="M50 12 C78 20 90 60 76 80 L50 50 Z" fill="#F472B6" />
      {/* Mint segment */}
      <path d="M50 12 C22 20 10 60 24 80 L50 50 Z" fill="#34D399" />
      {/* Center cap */}
      <circle cx="50" cy="20" r="7" fill="#FFFFFF" />

      {/* 3D Shading overlay */}
      <circle cx="50" cy="50" r="38" fill="url(#ballShade)" />
    </g>

    {/* Specular Highlight */}
    <ellipse cx="40" cy="32" rx="10" ry="6" transform="rotate(-30 40 32)" fill="#FFFFFF" opacity="0.6" />
  </svg>
);

/**
 * 🌸 Sunny Meadow Blossom - gentle pink daisy with smiley center
 */
export const FlowerSvg: React.FC<{ className?: string; size?: number; highlighted?: boolean }> = ({
  className = '',
  size = 64,
  highlighted = false
}) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={`${className} transition-transform ${highlighted ? 'scale-110 drop-shadow-lg' : ''}`}
    aria-label="Meadow Blossom"
  >
    <defs>
      <linearGradient id="petalPink" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBCFE8" />
        <stop offset="100%" stopColor="#F472B6" />
      </linearGradient>
      <radialGradient id="flowerCenter" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="80%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </radialGradient>
    </defs>
    {/* Shadow */}
    <ellipse cx="50" cy="92" rx="26" ry="4" fill="#000000" opacity="0.1" />

    {/* 5 Rounded Petals */}
    <g id="petals">
      {/* Petal 1 (Top) */}
      <circle cx="50" cy="28" r="16" fill="url(#petalPink)" />
      {/* Petal 2 (Top Right) */}
      <circle cx="71" cy="43" r="16" fill="url(#petalPink)" />
      {/* Petal 3 (Bottom Right) */}
      <circle cx="63" cy="68" r="16" fill="url(#petalPink)" />
      {/* Petal 4 (Bottom Left) */}
      <circle cx="37" cy="68" r="16" fill="url(#petalPink)" />
      {/* Petal 5 (Top Left) */}
      <circle cx="29" cy="43" r="16" fill="url(#petalPink)" />
    </g>

    {/* Golden Center Core */}
    <circle cx="50" cy="50" r="18" fill="url(#flowerCenter)" stroke="#B45309" strokeWidth="1.5" />

    {/* Soft Cartoon Smile */}
    <circle cx="45" cy="48" r="2.2" fill="#78350F" />
    <circle cx="55" cy="48" r="2.2" fill="#78350F" />
    <circle cx="44.2" cy="47" r="0.8" fill="#FFFFFF" />
    <circle cx="54.2" cy="47" r="0.8" fill="#FFFFFF" />
    <path d="M47 54 Q50 58 53 54" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <circle cx="41" cy="52" r="2" fill="#F43F5E" opacity="0.4" />
    <circle cx="59" cy="52" r="2" fill="#F43F5E" opacity="0.4" />
  </svg>
);

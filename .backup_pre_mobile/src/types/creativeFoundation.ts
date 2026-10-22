/**
 * Creative Foundation Data Types for Little Math Adventures
 * Targeted at Preschool children (Ages 3–7)
 */

export type CharacterId = 'andy' | 'sancho' | 'osi';

export type ExpressionType = 'idle' | 'happy' | 'thinking' | 'encouraging' | 'celebration';

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  role: string;
  age?: number | string;
  species: 'Human' | 'Dog';
  heightCm: number;
  heightRelative: string;
  colorTheme: {
    primary: string;
    secondary: string;
    accent: string;
    bgGlow: string;
    badgeBg: string;
  };
  visualTraits: {
    hairOrFur: string;
    eyesAndGlasses: string;
    clothing: string;
    footwear: string;
    backpack: string;
    signatureAccessory: string;
  };
  personality: string;
  mathRole: string;
  catchphrases: Record<ExpressionType, string>;
}

export interface CountingObject {
  id: string;
  name: string;
  category: 'fruit' | 'celestial' | 'nature' | 'toy';
  color: string;
  soundPitch: number;
  description: string;
  mathUsage: string;
}

export interface MapDestination {
  id: string;
  number: number;
  title: string;
  theme: string;
  mathTopic: string;
  learningGoal: string;
  status: 'completed' | 'unlocked' | 'locked';
  starsEarned: number;
  totalStars: number;
  xPercent: number; // For map positioning
  yPercent: number;
  accentColor: string;
}

export interface AssetItem {
  id: string;
  name: string;
  category: 'character' | 'expression' | 'map_background' | 'destination' | 'counting_object' | 'ui_element';
  fileName: string;
  format: 'SVG' | 'WebP' | 'Vector';
  dimensions: string;
  variants: string[];
  description: string;
  specNotes: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: string;
  usage: string;
  contrastRatio: string;
}

import { MapDestination } from './creativeFoundation';
import { SupportedLanguage } from './localization';

export interface PlayerSettings {
  soundMuted: boolean;
  bgmEnabled: boolean;
  voicePitch: number; // 0.8 to 1.6
  voiceRate: number;  // 0.7 to 1.2
  preferredSpeaker: 'narrator' | 'andy' | 'sancho' | 'osi';
  highContrastMode: boolean;
  reducedMotion: boolean;         // Reduced motion preference for toddlers sensitive to motion
  textSize: 'standard' | 'large'; // Standard or large text accessibility setting
  language?: SupportedLanguage;   // Multilingual interface preference (defaults to 'en')
}

export interface PlayerBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LevelCompletionRecord {
  levelNumber: number;
  completed: boolean;
  completedAt: string;
  bestScore: number;          // e.g. 10 of 10
  starsEarned: number;        // 1 to 3 stars
  firstTryCount: number;      // questions answered correctly on 1st attempt
  questionsCompleted: number; // must be exactly 10 for complete status
  timesCompleted: number;     // number of completions to avoid duplicate bonuses
}

export interface ResumeState {
  levelNumber: number;
  destId: string;
  questionIndex: number;      // 0 to 9
  savedAt: number;
}

export type ScreenTimePresetId = 'short' | 'standard' | 'extended' | 'custom';

export interface ScreenTimeSettings {
  enabled: boolean;                      // Whether healthy screen-time limits are active
  allowanceMinutes: number;              // Active playtime allowance per cycle (e.g. 10, 15, 20, 30)
  presetId: ScreenTimePresetId;          // Active preset identifier
  warningMinutes: number;                // Warning threshold (default 2 minutes)
}

export interface EnergyGaugeState {
  remainingSeconds: number;              // Remaining permitted gameplay seconds
  totalAllowanceSeconds: number;         // Total seconds in allowance cycle
  isExhausted: boolean;                  // True when allowance has run out
  exhaustedAtTimestamp: number | null;   // Timestamp when timer hit 0
  nextReplenishTimestamp: number | null; // Exactly 12 hours after exhaustion
  lastActiveTimestamp: number;           // Tracks active delta elapsed time
  hasShownLowWarning: boolean;           // Tracks if 2-minute gentle reminder was given
  lastReplenishedHour?: number;          // Tracks count of completed 1-hour increments (0..12) already credited
}

export interface PlayerProgress {
  version: number;
  hasPlayedIntro: boolean;
  energy: number;
  maxEnergy: number;
  lastEnergyRefillTimestamp: number;
  destinations: MapDestination[];
  unlockedNumbers: number[];
  highestAccessibleLevel: number;
  completedLevels: Record<number, LevelCompletionRecord>;
  resumeState?: ResumeState | null;
  totalStars: number;
  badges: PlayerBadge[];
  activeLevelId: string;
  settings: PlayerSettings;
  screenTimeSettings: ScreenTimeSettings;
  energyGauge: EnergyGaugeState;
  launchCount: number;
  isChampion: boolean;
}

export interface DevTestingConfig {
  enabled: boolean;               // Master developer testing mode active flag
  bypassScreenTime: boolean;      // Exempts session from screen-time lockouts
  unlockAllLevels: boolean;       // Unlocks all 10 adventure levels for QA inspection
  infiniteAllowance: boolean;     // Prevents timer tick deductions during gameplay testing
}

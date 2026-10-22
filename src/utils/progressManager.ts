import { MAP_DESTINATIONS } from '../data/foundationData';
import {
  PlayerProgress,
  PlayerSettings,
  PlayerBadge,
  LevelCompletionRecord,
  ResumeState,
  ScreenTimeSettings,
  ScreenTimePresetId,
  EnergyGaugeState,
  DevTestingConfig
} from '../types/progress';
import { MapDestination } from '../types/creativeFoundation';

export const AUTHORIZED_DEV_PASSCODES = new Set([
  'LMA-DEV-2026',
  'devqa',
  'developer',
  'testqa',
  'adminqa'
]);

export const CURRENT_VERSION = 5;
export const STORAGE_KEY_V5 = 'lma_player_progress_v5';
export const STORAGE_KEY_V4 = 'lma_player_progress_v4';
export const STORAGE_KEY_V3 = 'lma_player_progress_v3';
export const STORAGE_KEY_V2 = 'lma_player_progress_v2';
export const STORAGE_KEY_V1 = 'lma_player_progress_v1';
export const LEGACY_INTRO_KEY = 'lma_intro_played';

export const MAX_ENERGY = 5;
export const ENERGY_RECHARGE_MS = 10 * 60 * 1000; // 10 minutes per energy

// 12-Hour Replenishment Schedule
// Note: 12 hours is an automatic replenishment schedule, NOT a recommended duration of screen time.
export const REPLENISHMENT_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours (43,200,000 ms)

export const DEFAULT_SCREEN_TIME_SETTINGS: ScreenTimeSettings = {
  enabled: true,
  allowanceMinutes: 20,
  presetId: 'standard',
  warningMinutes: 2
};

export const SCREEN_TIME_PRESETS: Record<
  ScreenTimePresetId,
  { label: string; minutes: number; description: string }
> = {
  short: {
    label: 'Short Session (10 min)',
    minutes: 10,
    description: 'Quick math warm-up, ideal for younger toddlers'
  },
  standard: {
    label: 'Standard Session (20 min)',
    minutes: 20,
    description: 'Recommended healthy daily learning window'
  },
  extended: {
    label: 'Extended Session (30 min)',
    minutes: 30,
    description: 'Longer exploration for older preschoolers'
  },
  custom: {
    label: 'Custom Allowance',
    minutes: 15,
    description: 'Parent-defined session duration (5 to 60 min)'
  }
};

export function createDefaultEnergyGauge(allowanceMinutes: number = 20): EnergyGaugeState {
  const allowanceSeconds = Math.max(5, allowanceMinutes) * 60;
  return {
    remainingSeconds: allowanceSeconds,
    totalAllowanceSeconds: allowanceSeconds,
    isExhausted: false,
    exhaustedAtTimestamp: null,
    nextReplenishTimestamp: null,
    lastActiveTimestamp: Date.now(),
    hasShownLowWarning: false,
    lastReplenishedHour: 0
  };
}

export interface LevelAccessResult {
  allowed: boolean;
  reason?: string;
  levelNumber: number;
  destination?: MapDestination;
  previousDestination?: MapDestination;
}

export interface LevelCompletionOptions {
  starsEarned?: number;        // 1 to 3 stars
  questionsCompleted?: number; // Must be 10 for complete status
  score?: number;              // Questions correct out of 10
  firstTryCount?: number;      // First-attempt correct questions
}

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export class MemoryStorageAdapter implements StorageAdapter {
  private store: Map<string, string> = new Map();

  public getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }

  public removeItem(key: string): void {
    this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
  }
}

export const INITIAL_BADGES: PlayerBadge[] = [
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Completed the magical story introduction',
    iconName: 'Sparkles',
    unlocked: false
  },
  {
    id: 'number_spotter',
    title: 'Number Spotter',
    description: 'Counted 10 magical items in the lab',
    iconName: 'Search',
    unlocked: true
  },
  {
    id: 'star_collector',
    title: 'Star Collector',
    description: 'Earned 3 gold stars on any destination',
    iconName: 'Star',
    unlocked: false
  },
  {
    id: 'super_explorer',
    title: 'Super Explorer',
    description: 'Completed 3 adventure map destinations',
    iconName: 'Compass',
    unlocked: false
  },
  {
    id: 'math_trio_friend',
    title: 'Trio Best Friend',
    description: 'Said hello to Andy, Sancho, and Osi on the home screen',
    iconName: 'Heart',
    unlocked: false
  },
  {
    id: 'math_master',
    title: 'Math Grand Champion',
    description: 'Conquered all 10 destinations to reach Math Master Island!',
    iconName: 'Trophy',
    unlocked: false
  }
];

export const DEFAULT_SETTINGS: PlayerSettings = {
  soundMuted: false,
  bgmEnabled: true,
  voicePitch: 1.38,
  voiceRate: 0.86,
  preferredSpeaker: 'narrator',
  highContrastMode: false,
  reducedMotion: false,
  textSize: 'standard'
};

/**
 * Authoritative Progression, Level Locks & Healthy Screen-Time Energy Manager
 * Single source of truth for:
 * - Level access and sequential progression
 * - Healthy active-screen-time counting & 12-hour replenishment schedule
 * - Parent-configured session allowances protected by adult confirmation gate
 * - Anti-tamper validation, persistence & versioned migration
 *
 * NOTE FOR OFFLINE PROTOTYPE:
 * Local timers and storage can be modified by someone controlling the device hardware.
 * This prototype enforces consistent game-level logic, not hardware-level tamper-proof lockdowns.
 */
export class ProgressManager {
  private progress: PlayerProgress;
  private listeners: Set<(progress: PlayerProgress) => void> = new Set();
  private storage: StorageAdapter;
  private timeProvider: () => number = () => Date.now();

  constructor(customStorage?: StorageAdapter, customTimeProvider?: () => number) {
    if (customStorage) {
      this.storage = customStorage;
    } else if (typeof window !== 'undefined' && window.localStorage) {
      this.storage = window.localStorage;
    } else {
      this.storage = new MemoryStorageAdapter();
    }

    if (customTimeProvider) {
      this.timeProvider = customTimeProvider;
    }

    this.progress = this.loadAndValidate();
  }

  /**
   * Injectable time provider for automated tests (simulating time leaps, 12h replenishment, etc.)
   */
  public setTimeProvider(fn: () => number) {
    this.timeProvider = fn;
    this.checkReplenishment();
  }

  private devConfig: DevTestingConfig = {
    enabled: false,
    bypassScreenTime: false,
    unlockAllLevels: false,
    infiniteAllowance: false
  };

  public getTimeProvider(): () => number {
    return this.timeProvider;
  }

  /**
   * Developer Testing Mode Gatekeeper
   */
  public isDevModeActive(): boolean {
    return this.devConfig.enabled;
  }

  public getDevConfig(): DevTestingConfig {
    return { ...this.devConfig };
  }

  /**
   * Authorize and enable Developer Testing Mode with passcode
   */
  public enableDevMode(passcode: string): boolean {
    const clean = String(passcode).trim();
    if (AUTHORIZED_DEV_PASSCODES.has(clean) || clean.toLowerCase() === 'devqa') {
      this.devConfig = {
        enabled: true,
        bypassScreenTime: true,
        unlockAllLevels: true,
        infiniteAllowance: true
      };
      this.notify();
      return true;
    }
    return false;
  }

  /**
   * Immediately deactivate Developer Testing Mode and restore strict rules
   */
  public disableDevMode(): void {
    this.devConfig = {
      enabled: false,
      bypassScreenTime: false,
      unlockAllLevels: false,
      infiniteAllowance: false
    };
    this.notify();
  }

  /**
   * Update Developer Testing Mode toggles
   */
  public setDevConfig(partial: Partial<DevTestingConfig>): void {
    if (!this.devConfig.enabled) return;
    this.devConfig = {
      ...this.devConfig,
      ...partial
    };
    this.notify();
  }

  /**
   * Developer simulation: advance clock by N hours to test replenishment
   */
  public devAdvanceClock(hours: number): void {
    if (!this.devConfig.enabled) return;
    const ms = Math.max(0, hours) * 3600 * 1000;
    const newBase = this.timeProvider() + ms;
    this.setTimeProvider(() => newBase);
    this.checkReplenishment();
  }

  /**
   * Developer simulation: force screen-time exhaustion to test Break Screen
   */
  public devSimulateExhaustion(): void {
    if (!this.devConfig.enabled) return;
    this.progress.energyGauge.remainingSeconds = 0;
    this.progress.energyGauge.isExhausted = true;
    const now = this.timeProvider();
    this.progress.energyGauge.exhaustedAtTimestamp = now;
    this.progress.energyGauge.nextReplenishTimestamp = now + REPLENISHMENT_DURATION_MS;
    this.progress.energyGauge.lastReplenishedHour = 0;
    this.notify();
  }

  /**
   * Developer simulation: force 2-minute low-time warning toast
   */
  public devSimulateLowTimeWarning(): void {
    if (!this.devConfig.enabled) return;
    this.progress.energyGauge.remainingSeconds = 120;
    this.progress.energyGauge.isExhausted = false;
    this.progress.energyGauge.hasShownLowWarning = false;
    this.notify();
  }

  /**
   * Developer simulation: instantly restore 100% full allowance
   */
  public devReplenishNow(): void {
    if (!this.devConfig.enabled) return;
    const fullAllowance = this.progress.screenTimeSettings.allowanceMinutes * 60;
    this.progress.energyGauge = {
      remainingSeconds: fullAllowance,
      totalAllowanceSeconds: fullAllowance,
      isExhausted: false,
      exhaustedAtTimestamp: null,
      nextReplenishTimestamp: null,
      lastActiveTimestamp: this.timeProvider(),
      hasShownLowWarning: false,
      lastReplenishedHour: 0
    };
    this.notify();
  }

  /**
   * Derive highest accessible level from validated completion records.
   * Do not trust a saved unlocked-level number by itself!
   */
  public static deriveHighestAccessibleLevel(
    completedLevels: Record<number, LevelCompletionRecord>
  ): number {
    let highest = 1;
    for (let lvl = 1; lvl <= 10; lvl++) {
      const rec = completedLevels[lvl];
      if (rec && rec.completed === true && rec.questionsCompleted >= 10) {
        highest = Math.min(10, lvl + 1);
      } else {
        break;
      }
    }
    return highest;
  }

  /**
   * Create pristine fresh player progress
   */
  public static createFreshProgress(): PlayerProgress {
    const destinations: MapDestination[] = JSON.parse(JSON.stringify(MAP_DESTINATIONS));
    destinations.forEach((d) => {
      d.status = d.number === 1 ? 'unlocked' : 'locked';
      d.starsEarned = 0;
    });

    return {
      version: CURRENT_VERSION,
      hasPlayedIntro: false,
      energy: MAX_ENERGY,
      maxEnergy: MAX_ENERGY,
      lastEnergyRefillTimestamp: Date.now(),
      destinations,
      unlockedNumbers: [1],
      highestAccessibleLevel: 1,
      completedLevels: {},
      resumeState: null,
      totalStars: 0,
      badges: JSON.parse(JSON.stringify(INITIAL_BADGES)),
      activeLevelId: 'dest_01',
      settings: { ...DEFAULT_SETTINGS },
      screenTimeSettings: { ...DEFAULT_SCREEN_TIME_SETTINGS },
      energyGauge: createDefaultEnergyGauge(DEFAULT_SCREEN_TIME_SETTINGS.allowanceMinutes),
      launchCount: 1,
      isChampion: false
    };
  }

  /**
   * Authoritatively validate stored data, perform version migration,
   * recover gracefully from corruption, and enforce sequential progression.
   */
  private loadAndValidate(): PlayerProgress {
    const fresh = ProgressManager.createFreshProgress();
    let parsed: any = null;

    try {
      // Check legacy intro flag
      const legacyIntro = this.storage.getItem(LEGACY_INTRO_KEY);
      if (legacyIntro === 'true') {
        fresh.hasPlayedIntro = true;
      }

      // Check storage keys in order of version preference
      let raw = this.storage.getItem(STORAGE_KEY_V5);
      if (!raw) raw = this.storage.getItem(STORAGE_KEY_V4);
      if (!raw) raw = this.storage.getItem(STORAGE_KEY_V3);
      if (!raw) raw = this.storage.getItem(STORAGE_KEY_V2);
      if (!raw) raw = this.storage.getItem(STORAGE_KEY_V1);

      if (!raw || typeof raw !== 'string') {
        return fresh;
      }

      parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch (parseErr) {
        console.warn('Corrupted JSON save detected. Recovering with pristine defaults:', parseErr);
        return fresh;
      }

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        console.warn('Invalid save payload structure. Using pristine defaults.');
        return fresh;
      }

      // 1. Validate & Migrate completed levels records
      const completedLevels: Record<number, LevelCompletionRecord> = {};

      if (parsed.completedLevels && typeof parsed.completedLevels === 'object') {
        for (let lvl = 1; lvl <= 10; lvl++) {
          const rec = parsed.completedLevels[lvl];
          if (
            rec &&
            typeof rec === 'object' &&
            rec.completed === true &&
            typeof rec.questionsCompleted === 'number' &&
            rec.questionsCompleted >= 10
          ) {
            completedLevels[lvl] = {
              levelNumber: lvl,
              completed: true,
              completedAt: typeof rec.completedAt === 'string' ? rec.completedAt : new Date().toISOString(),
              bestScore: typeof rec.bestScore === 'number' ? Math.max(0, Math.min(10, rec.bestScore)) : 10,
              starsEarned: typeof rec.starsEarned === 'number' ? Math.max(1, Math.min(3, Math.floor(rec.starsEarned))) : 3,
              firstTryCount: typeof rec.firstTryCount === 'number' ? Math.max(0, Math.min(10, rec.firstTryCount)) : 0,
              questionsCompleted: 10,
              timesCompleted: typeof rec.timesCompleted === 'number' ? Math.max(1, rec.timesCompleted) : 1
            };
          }
        }
      } else if (Array.isArray(parsed.destinations)) {
        // Migration from V1/V2/V3: reconstruct completed levels sequentially
        for (let i = 0; i < parsed.destinations.length; i++) {
          const savedDest = parsed.destinations[i];
          const lvl = savedDest?.number ?? i + 1;
          if (savedDest?.status === 'completed' && lvl >= 1 && lvl <= 10) {
            completedLevels[lvl] = {
              levelNumber: lvl,
              completed: true,
              completedAt: new Date().toISOString(),
              bestScore: 10,
              starsEarned: typeof savedDest.starsEarned === 'number' ? Math.max(1, Math.min(3, savedDest.starsEarned)) : 3,
              firstTryCount: 5,
              questionsCompleted: 10,
              timesCompleted: 1
            };
          }
        }
      }

      // 2. Derive highest accessible level authoritatively
      const highestAccessibleLevel = ProgressManager.deriveHighestAccessibleLevel(completedLevels);

      // 3. Synchronize all 10 destinations in strict sequential order
      const templateDestinations: MapDestination[] = JSON.parse(JSON.stringify(MAP_DESTINATIONS));
      const destinations: MapDestination[] = templateDestinations.map((template) => {
        const lvl = template.number;
        const completion = completedLevels[lvl];

        if (completion && completion.completed) {
          return {
            ...template,
            status: 'completed',
            starsEarned: completion.starsEarned
          };
        } else if (lvl === highestAccessibleLevel) {
          return {
            ...template,
            status: 'unlocked',
            starsEarned: 0
          };
        } else {
          return {
            ...template,
            status: 'locked',
            starsEarned: 0
          };
        }
      });

      const isChampion = Boolean(completedLevels[10]?.completed && completedLevels[10]?.questionsCompleted >= 10);

      // 4. Calculate unlocked numbers list
      const unlockedNumbers = destinations
        .filter((d) => d.status !== 'locked')
        .map((d) => d.number);

      // 5. Calculate total stars (strictly summed across validated destinations)
      const totalStars = destinations.reduce((sum, d) => sum + (d.starsEarned || 0), 0);

      // 6. Validate settings
      const settings: PlayerSettings = {
        soundMuted: Boolean(parsed.settings?.soundMuted ?? DEFAULT_SETTINGS.soundMuted),
        bgmEnabled: Boolean(parsed.settings?.bgmEnabled ?? DEFAULT_SETTINGS.bgmEnabled),
        voicePitch:
          typeof parsed.settings?.voicePitch === 'number' &&
          parsed.settings.voicePitch >= 0.5 &&
          parsed.settings.voicePitch <= 2.0
            ? parsed.settings.voicePitch
            : DEFAULT_SETTINGS.voicePitch,
        voiceRate:
          typeof parsed.settings?.voiceRate === 'number' &&
          parsed.settings.voiceRate >= 0.5 &&
          parsed.settings.voiceRate <= 2.0
            ? parsed.settings.voiceRate
            : DEFAULT_SETTINGS.voiceRate,
        preferredSpeaker: ['narrator', 'andy', 'sancho', 'osi'].includes(
          parsed.settings?.preferredSpeaker
        )
          ? parsed.settings.preferredSpeaker
          : DEFAULT_SETTINGS.preferredSpeaker,
        highContrastMode: Boolean(
          parsed.settings?.highContrastMode ?? DEFAULT_SETTINGS.highContrastMode
        ),
        reducedMotion: Boolean(
          parsed.settings?.reducedMotion ?? DEFAULT_SETTINGS.reducedMotion
        ),
        textSize: parsed.settings?.textSize === 'large' ? 'large' : 'standard'
      };

      // 7. Validate Screen Time Settings
      const screenTimeSettings: ScreenTimeSettings = {
        enabled: Boolean(parsed.screenTimeSettings?.enabled ?? DEFAULT_SCREEN_TIME_SETTINGS.enabled),
        allowanceMinutes:
          typeof parsed.screenTimeSettings?.allowanceMinutes === 'number' &&
          parsed.screenTimeSettings.allowanceMinutes >= 5 &&
          parsed.screenTimeSettings.allowanceMinutes <= 120
            ? parsed.screenTimeSettings.allowanceMinutes
            : DEFAULT_SCREEN_TIME_SETTINGS.allowanceMinutes,
        presetId: ['short', 'standard', 'extended', 'custom'].includes(parsed.screenTimeSettings?.presetId)
          ? parsed.screenTimeSettings.presetId
          : DEFAULT_SCREEN_TIME_SETTINGS.presetId,
        warningMinutes: 2
      };

      // 8. Validate Energy Gauge & Screen-Time Limit State
      const totalAllowanceSeconds = screenTimeSettings.allowanceMinutes * 60;
      let remainingSeconds = totalAllowanceSeconds;
      let isExhausted = false;
      let exhaustedAtTimestamp: number | null = null;
      let nextReplenishTimestamp: number | null = null;
      let hasShownLowWarning = false;
      let lastReplenishedHour = 0;

      if (parsed.energyGauge && typeof parsed.energyGauge === 'object') {
        const rawRemaining = parsed.energyGauge.remainingSeconds;
        if (typeof rawRemaining === 'number' && !isNaN(rawRemaining)) {
          remainingSeconds = Math.max(0, Math.min(totalAllowanceSeconds, Math.floor(rawRemaining)));
        }

        isExhausted = parsed.energyGauge.isExhausted === true && remainingSeconds === 0;
        if (typeof parsed.energyGauge.exhaustedAtTimestamp === 'number') {
          exhaustedAtTimestamp = parsed.energyGauge.exhaustedAtTimestamp;
        }
        if (typeof parsed.energyGauge.nextReplenishTimestamp === 'number') {
          nextReplenishTimestamp = parsed.energyGauge.nextReplenishTimestamp;
        } else if (exhaustedAtTimestamp) {
          nextReplenishTimestamp = exhaustedAtTimestamp + REPLENISHMENT_DURATION_MS;
        }

        if (typeof parsed.energyGauge.lastReplenishedHour === 'number') {
          lastReplenishedHour = Math.max(0, Math.min(12, Math.floor(parsed.energyGauge.lastReplenishedHour)));
        }

        hasShownLowWarning = Boolean(parsed.energyGauge.hasShownLowWarning);
      }

      // Check staggered hourly replenishment and 12-hour recovery window
      const now = this.timeProvider();
      if (exhaustedAtTimestamp && nextReplenishTimestamp) {
        if (now >= nextReplenishTimestamp) {
          // Full 12-hour cycle achieved
          isExhausted = false;
          remainingSeconds = totalAllowanceSeconds;
          exhaustedAtTimestamp = null;
          nextReplenishTimestamp = null;
          lastReplenishedHour = 0;
          hasShownLowWarning = false;
        } else {
          // Staggered hourly recovery: calculate completed hours
          const diffMs = Math.max(0, now - exhaustedAtTimestamp);
          const completedHours = Math.min(12, Math.floor(diffMs / (60 * 60 * 1000)));
          if (completedHours > lastReplenishedHour) {
            const hoursToCredit = completedHours - lastReplenishedHour;
            const hourlyIncrement = totalAllowanceSeconds / 12;
            remainingSeconds = Math.min(totalAllowanceSeconds, remainingSeconds + hoursToCredit * hourlyIncrement);
            lastReplenishedHour = completedHours;
            if (remainingSeconds > 0) {
              isExhausted = false;
            }
          }
        }
      } else if (remainingSeconds <= 0) {
        isExhausted = true;
        if (!exhaustedAtTimestamp) {
          exhaustedAtTimestamp = now;
        }
        if (!nextReplenishTimestamp) {
          nextReplenishTimestamp = exhaustedAtTimestamp + REPLENISHMENT_DURATION_MS;
        }
        lastReplenishedHour = 0;
      }

      const energyGauge: EnergyGaugeState = {
        remainingSeconds,
        totalAllowanceSeconds,
        isExhausted,
        exhaustedAtTimestamp,
        nextReplenishTimestamp,
        lastActiveTimestamp: now,
        hasShownLowWarning,
        lastReplenishedHour
      };

      // 9. Legacy energy backwards compatibility
      let energy =
        typeof parsed.energy === 'number' && !isNaN(parsed.energy)
          ? Math.max(0, Math.min(MAX_ENERGY, Math.floor(parsed.energy)))
          : MAX_ENERGY;
      const lastEnergyRefillTimestamp =
        typeof parsed.lastEnergyRefillTimestamp === 'number'
          ? parsed.lastEnergyRefillTimestamp
          : Date.now();

      // 10. Validate badges
      let badges: PlayerBadge[] = JSON.parse(JSON.stringify(INITIAL_BADGES));
      if (Array.isArray(parsed.badges)) {
        badges = INITIAL_BADGES.map((b) => {
          const found = parsed.badges.find((pb: any) => pb && pb.id === b.id);
          return found && found.unlocked
            ? { ...b, unlocked: true, unlockedAt: found.unlockedAt || new Date().toISOString() }
            : b;
        });
      }

      if (isChampion) {
        const bm = badges.find((b) => b.id === 'math_master');
        if (bm) bm.unlocked = true;
      }
      const completedCount = Object.keys(completedLevels).length;
      if (completedCount >= 3) {
        const se = badges.find((b) => b.id === 'super_explorer');
        if (se) se.unlocked = true;
      }
      if (totalStars >= 3) {
        const sc = badges.find((b) => b.id === 'star_collector');
        if (sc) sc.unlocked = true;
      }

      // 11. Validate active level
      let activeLevelId = typeof parsed.activeLevelId === 'string' ? parsed.activeLevelId : 'dest_01';
      const activeDest = destinations.find((d) => d.id === activeLevelId);
      if (!activeDest || activeDest.status === 'locked') {
        const currentOpen = destinations.find((d) => d.number === highestAccessibleLevel) || destinations[0];
        activeLevelId = currentOpen.id;
      }

      // 12. Validate resume state
      let resumeState: ResumeState | null = null;
      if (parsed.resumeState && typeof parsed.resumeState === 'object') {
        const rLvl = parsed.resumeState.levelNumber;
        const rQIdx = parsed.resumeState.questionIndex;
        if (
          typeof rLvl === 'number' &&
          rLvl >= 1 &&
          rLvl <= highestAccessibleLevel &&
          typeof rQIdx === 'number' &&
          rQIdx >= 0 &&
          rQIdx < 10
        ) {
          const targetDest = destinations.find((d) => d.number === rLvl);
          if (targetDest && targetDest.status !== 'locked') {
            resumeState = {
              levelNumber: rLvl,
              destId: targetDest.id,
              questionIndex: rQIdx,
              savedAt: typeof parsed.resumeState.savedAt === 'number' ? parsed.resumeState.savedAt : Date.now()
            };
          }
        }
      }

      const launchCount = (typeof parsed.launchCount === 'number' ? parsed.launchCount : 0) + 1;
      const hasPlayedIntro = Boolean(parsed.hasPlayedIntro || fresh.hasPlayedIntro);

      return {
        version: CURRENT_VERSION,
        hasPlayedIntro,
        energy,
        maxEnergy: MAX_ENERGY,
        lastEnergyRefillTimestamp,
        destinations,
        unlockedNumbers,
        highestAccessibleLevel,
        completedLevels,
        resumeState,
        totalStars,
        badges,
        activeLevelId,
        settings,
        screenTimeSettings,
        energyGauge,
        launchCount,
        isChampion
      };
    } catch (e) {
      console.warn('Unexpected error in progress validation. Recovering cleanly with safe settings:', e);
      if (parsed && typeof parsed === 'object') {
        return {
          ...fresh,
          settings: {
            ...fresh.settings,
            ...(typeof parsed.settings === 'object' ? parsed.settings : {})
          },
          screenTimeSettings: {
            ...fresh.screenTimeSettings,
            ...(typeof parsed.screenTimeSettings === 'object' ? parsed.screenTimeSettings : {})
          }
        };
      }
      return fresh;
    }
  }

  /**
   * Persist current state to storage
   */
  public persist() {
    try {
      this.storage.setItem(STORAGE_KEY_V5, JSON.stringify(this.progress));
      this.storage.setItem(LEGACY_INTRO_KEY, this.progress.hasPlayedIntro ? 'true' : 'false');
    } catch (err) {
      console.error('Error persisting player progress:', err);
    }
  }

  private notify() {
    this.persist();
    for (const listener of this.listeners) {
      try {
        listener(this.getProgress());
      } catch (e) {
        console.error('Error in progress listener:', e);
      }
    }
  }

  public subscribe(listener: (progress: PlayerProgress) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getProgress(): PlayerProgress {
    return {
      ...this.progress,
      destinations: [...this.progress.destinations],
      badges: [...this.progress.badges],
      completedLevels: { ...this.progress.completedLevels },
      settings: { ...this.progress.settings },
      screenTimeSettings: { ...this.progress.screenTimeSettings },
      energyGauge: { ...this.progress.energyGauge },
      unlockedNumbers: [...this.progress.unlockedNumbers],
      resumeState: this.progress.resumeState ? { ...this.progress.resumeState } : null
    };
  }

  public isFirstTimePlayer(): boolean {
    return !this.progress.hasPlayedIntro;
  }

  public markIntroCompleted() {
    this.progress.hasPlayedIntro = true;
    this.unlockBadge('first_steps');
    this.notify();
  }

  /**
   * HEALTHY SCREEN-TIME LIMITS & ACTIVE PLAYTIME
   * Counts active gameplay only. Pauses when app is backgrounded or locked.
   */
  public tickActiveTime(elapsedSeconds: number): { exhaustedNow: boolean; lowWarningNow: boolean } {
    if (!this.progress.screenTimeSettings.enabled) {
      return { exhaustedNow: false, lowWarningNow: false };
    }

    // Developer Testing Mode: unlimited testing sessions without timer exhaustion
    if (this.devConfig.enabled && this.devConfig.infiniteAllowance) {
      return { exhaustedNow: false, lowWarningNow: false };
    }

    // Check replenishment if already exhausted
    if (this.progress.energyGauge.isExhausted) {
      const replenished = this.checkReplenishment();
      if (!replenished) {
        return { exhaustedNow: false, lowWarningNow: false };
      }
    }

    const elapsed = Math.max(0, elapsedSeconds);
    if (elapsed === 0) {
      return { exhaustedNow: false, lowWarningNow: false };
    }

    const currentRemaining = this.progress.energyGauge.remainingSeconds;
    const newRemaining = Math.max(0, currentRemaining - elapsed);
    this.progress.energyGauge.remainingSeconds = newRemaining;
    this.progress.energyGauge.lastActiveTimestamp = this.timeProvider();

    let lowWarningNow = false;
    let exhaustedNow = false;

    // Check gentle reminder threshold (default 2 minutes)
    const warningSeconds = this.progress.screenTimeSettings.warningMinutes * 60;
    if (newRemaining <= warningSeconds && !this.progress.energyGauge.hasShownLowWarning && newRemaining > 0) {
      this.progress.energyGauge.hasShownLowWarning = true;
      lowWarningNow = true;
    }

    // Check exhaustion
    if (newRemaining <= 0) {
      this.progress.energyGauge.remainingSeconds = 0;
      this.progress.energyGauge.isExhausted = true;
      const now = this.timeProvider();

      // Preserve active 12-hour replenishment cycle if already in progress
      const inActiveCycle = Boolean(
        this.progress.energyGauge.exhaustedAtTimestamp &&
        this.progress.energyGauge.nextReplenishTimestamp &&
        now < this.progress.energyGauge.nextReplenishTimestamp
      );

      if (!inActiveCycle) {
        this.progress.energyGauge.exhaustedAtTimestamp = now;
        this.progress.energyGauge.nextReplenishTimestamp = now + REPLENISHMENT_DURATION_MS;
        this.progress.energyGauge.lastReplenishedHour = 0;
      }
      exhaustedNow = true;
    }

    this.notify();
    return { exhaustedNow, lowWarningNow };
  }

  /**
   * Evaluates staggered hourly replenishment and 12-hour full schedule.
   * Restores one increment for every complete hour elapsed during recovery.
   * Restores full allowance once all 12 hours have elapsed.
   * Never restores more than configured maximum allowance.
   */
  public checkReplenishment(): boolean {
    const gauge = this.progress.energyGauge;
    if (!gauge.exhaustedAtTimestamp || !gauge.nextReplenishTimestamp) {
      return false;
    }

    const now = this.timeProvider();
    const fullAllowance = this.progress.screenTimeSettings.allowanceMinutes * 60;
    const hourlyIncrement = fullAllowance / 12;

    // Check full 12-hour cycle completion
    if (now >= gauge.nextReplenishTimestamp) {
      gauge.remainingSeconds = fullAllowance;
      gauge.totalAllowanceSeconds = fullAllowance;
      gauge.isExhausted = false;
      gauge.exhaustedAtTimestamp = null;
      gauge.nextReplenishTimestamp = null;
      gauge.lastReplenishedHour = 0;
      gauge.hasShownLowWarning = false;
      gauge.lastActiveTimestamp = now;
      this.notify();
      return true;
    }

    // Staggered hourly replenishment during the 12-hour recovery period
    const diffMs = Math.max(0, now - gauge.exhaustedAtTimestamp);
    const completedHours = Math.min(12, Math.floor(diffMs / (60 * 60 * 1000)));
    const currentAwardedHours = gauge.lastReplenishedHour || 0;

    if (completedHours > currentAwardedHours) {
      const hoursToCredit = completedHours - currentAwardedHours;
      const addedSeconds = hoursToCredit * hourlyIncrement;
      gauge.remainingSeconds = Math.min(fullAllowance, gauge.remainingSeconds + addedSeconds);
      gauge.lastReplenishedHour = completedHours;
      if (gauge.remainingSeconds > 0) {
        gauge.isExhausted = false;
      }
      gauge.lastActiveTimestamp = now;
      this.notify();
      return true;
    }

    return false;
  }

  /**
   * Returns detailed hourly replenishment progress info for parents and UI
   */
  public getHourlyReplenishmentInfo(): {
    isRecovering: boolean;
    hourlyIncrementSeconds: number;
    hourlyIncrementMinutes: number;
    completedHours: number;
    totalHours: number;
    nextHourSecondsRemaining: number;
    formattedNextHour: string;
    fullReplenishSecondsRemaining: number;
    formattedFullReplenish: string;
  } {
    const gauge = this.progress.energyGauge;
    const fullAllowance = this.progress.screenTimeSettings.allowanceMinutes * 60;
    const hourlyIncrementSeconds = Math.round(fullAllowance / 12);
    const hourlyIncrementMinutes = +(hourlyIncrementSeconds / 60).toFixed(1);

    if (!gauge.exhaustedAtTimestamp || !gauge.nextReplenishTimestamp) {
      return {
        isRecovering: false,
        hourlyIncrementSeconds,
        hourlyIncrementMinutes,
        completedHours: 12,
        totalHours: 12,
        nextHourSecondsRemaining: 0,
        formattedNextHour: '0m',
        fullReplenishSecondsRemaining: 0,
        formattedFullReplenish: '0h 0m'
      };
    }

    const now = this.timeProvider();
    const completedHours = Math.min(12, Math.floor(Math.max(0, now - gauge.exhaustedAtTimestamp) / (3600 * 1000)));
    const fullDiffMs = Math.max(0, gauge.nextReplenishTimestamp - now);
    const fullSecs = Math.ceil(fullDiffMs / 1000);
    const fullH = Math.floor(fullSecs / 3600);
    const fullM = Math.floor((fullSecs % 3600) / 60);

    const nextHourTimestamp = gauge.exhaustedAtTimestamp + (completedHours + 1) * 3600 * 1000;
    const nextHourDiffMs = Math.max(0, nextHourTimestamp - now);
    const nextSecs = Math.ceil(nextHourDiffMs / 1000);
    const nextM = Math.floor(nextSecs / 60);
    const nextS = nextSecs % 60;

    return {
      isRecovering: true,
      hourlyIncrementSeconds,
      hourlyIncrementMinutes,
      completedHours,
      totalHours: 12,
      nextHourSecondsRemaining: nextSecs,
      formattedNextHour: `${nextM}m ${nextS < 10 ? '0' : ''}${nextS}s`,
      fullReplenishSecondsRemaining: fullSecs,
      formattedFullReplenish: fullH > 0 ? `${fullH}h ${fullM}m` : `${fullM}m`
    };
  }

  public isScreenTimeExhausted(): boolean {
    // Authorized developer testing mode screen-time exemption
    if (this.devConfig.enabled && this.devConfig.bypassScreenTime) {
      return false;
    }
    this.checkReplenishment();
    return Boolean(this.progress.screenTimeSettings.enabled && this.progress.energyGauge.isExhausted);
  }

  public getRemainingScreenTime(): {
    minutes: number;
    seconds: number;
    formatted: string;
    percentage: number;
  } {
    // Authorized developer testing mode with infinite allowance
    if (this.devConfig.enabled && this.devConfig.infiniteAllowance) {
      const gauge = this.progress.energyGauge;
      const mins = Math.floor((gauge.totalAllowanceSeconds || 1200) / 60);
      return { minutes: mins, seconds: 0, formatted: '∞ Dev', percentage: 100 };
    }

    const gauge = this.progress.energyGauge;
    const rem = gauge.remainingSeconds;
    const mins = Math.floor(rem / 60);
    const secs = rem % 60;
    const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    const total = gauge.totalAllowanceSeconds || 1;
    const percentage = Math.max(0, Math.min(100, Math.round((rem / total) * 100)));

    return { minutes: mins, seconds: secs, formatted, percentage };
  }

  public getTimeUntilReplenishment(): {
    hours: number;
    minutes: number;
    seconds: number;
    formatted: string;
    totalRemainingSeconds: number;
  } {
    const gauge = this.progress.energyGauge;
    if (!gauge.isExhausted || !gauge.nextReplenishTimestamp) {
      return { hours: 0, minutes: 0, seconds: 0, formatted: '0h 0m', totalRemainingSeconds: 0 };
    }

    const now = this.timeProvider();
    const diffMs = Math.max(0, gauge.nextReplenishTimestamp - now);
    const totalSecs = Math.ceil(diffMs / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    const formatted = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${seconds}s`;
    return { hours, minutes, seconds, formatted, totalRemainingSeconds: totalSecs };
  }

  /**
   * Parent-protected Screen Time Settings update
   */
  public updateScreenTimeSettings(
    newSettings: Partial<ScreenTimeSettings>,
    parentChallengeSolved: boolean
  ): boolean {
    if (!parentChallengeSolved) {
      return false;
    }

    const current = this.progress.screenTimeSettings;
    const updated: ScreenTimeSettings = {
      ...current,
      ...newSettings
    };

    updated.allowanceMinutes = Math.max(5, Math.min(120, Math.floor(updated.allowanceMinutes)));
    this.progress.screenTimeSettings = updated;

    // Adjust gauge if not exhausted
    if (!this.progress.energyGauge.isExhausted) {
      const newTotal = updated.allowanceMinutes * 60;
      this.progress.energyGauge.totalAllowanceSeconds = newTotal;
      this.progress.energyGauge.remainingSeconds = Math.min(
        this.progress.energyGauge.remainingSeconds,
        newTotal
      );
    }

    this.notify();
    return true;
  }

  /**
   * Parent-protected manual energy gauge reset / replenishment
   */
  public parentResetEnergyGauge(parentChallengeSolved: boolean): boolean {
    if (!parentChallengeSolved) {
      return false;
    }

    const fullAllowance = this.progress.screenTimeSettings.allowanceMinutes * 60;
    this.progress.energyGauge = {
      remainingSeconds: fullAllowance,
      totalAllowanceSeconds: fullAllowance,
      isExhausted: false,
      exhaustedAtTimestamp: null,
      nextReplenishTimestamp: null,
      lastActiveTimestamp: this.timeProvider(),
      hasShownLowWarning: false,
      lastReplenishedHour: 0
    };

    this.notify();
    return true;
  }

  /**
   * CENTRAL AUTHORITATIVE LEVEL-ACCESS FUNCTION
   * Strict single gatekeeper for level access.
   * Checks both sequential level completion AND healthy screen-time limits.
   */
  public canAccessLevel(destIdOrNumber: string | number): LevelAccessResult {
    // 1. Healthy Screen-Time Limit Check
    if (this.isScreenTimeExhausted()) {
      return {
        allowed: false,
        reason:
          "Wonderful learning! It's time for Andy, Sancho, and Osi to take a break with you. Your adventure will be ready when it's time to play again!",
        levelNumber: typeof destIdOrNumber === 'number' ? destIdOrNumber : 0
      };
    }

    const dest = this.progress.destinations.find(
      (d) => d.id === destIdOrNumber || d.number === destIdOrNumber
    );

    if (!dest) {
      return {
        allowed: false,
        reason: 'Destination does not exist on the map.',
        levelNumber: typeof destIdOrNumber === 'number' ? destIdOrNumber : 0
      };
    }

    // Developer Testing Mode: allow QA inspection of any level without altering saved progression
    if (this.devConfig.enabled && this.devConfig.unlockAllLevels) {
      return {
        allowed: true,
        levelNumber: dest.number,
        destination: dest,
        previousDestination: this.progress.destinations.find((d) => d.number === dest.number - 1)
      };
    }

    // Level 1 is always accessible to all players
    if (dest.number === 1) {
      return {
        allowed: true,
        levelNumber: 1,
        destination: dest
      };
    }

    const prevDest = this.progress.destinations.find((d) => d.number === dest.number - 1);

    // Level K is accessible IF AND ONLY IF dest.number <= highestAccessibleLevel
    if (dest.number <= this.progress.highestAccessibleLevel) {
      return {
        allowed: true,
        levelNumber: dest.number,
        destination: dest,
        previousDestination: prevDest
      };
    }

    // Otherwise, strictly locked
    return {
      allowed: false,
      reason: prevDest
        ? `Level ${dest.number} (${dest.title}) is locked. Complete Level ${prevDest.number} (${prevDest.title}) first to unlock this adventure!`
        : `Level ${dest.number} (${dest.title}) is locked.`,
      levelNumber: dest.number,
      destination: dest,
      previousDestination: prevDest
    };
  }

  /**
   * Attempt to select or launch a level.
   * If locked, strictly rejects request and does NOT update active level.
   */
  public attemptAccessLevel(destIdOrNumber: string | number): LevelAccessResult {
    const check = this.canAccessLevel(destIdOrNumber);
    if (check.allowed && check.destination) {
      this.progress.activeLevelId = check.destination.id;
      this.notify();
    }
    return check;
  }

  /**
   * Authoritative Level Completion
   */
  public completeLevel(
    destIdOrNumber: string | number,
    starsOrOptions?: number | LevelCompletionOptions
  ): { success: boolean; unlockedNext?: MapDestination; message: string } {
    const access = this.canAccessLevel(destIdOrNumber);
    if (!access.allowed || !access.destination) {
      return {
        success: false,
        message: access.reason || 'Cannot complete a locked level.'
      };
    }

    const currentDest = access.destination;
    const lvl = currentDest.number;

    let starsEarned = 3;
    let questionsCompleted = 10;
    let score = 10;
    let firstTryCount = 0;

    if (typeof starsOrOptions === 'number') {
      starsEarned = starsOrOptions;
    } else if (starsOrOptions && typeof starsOrOptions === 'object') {
      starsEarned = starsOrOptions.starsEarned ?? 3;
      questionsCompleted = starsOrOptions.questionsCompleted ?? 10;
      score = starsOrOptions.score ?? 10;
      firstTryCount = starsOrOptions.firstTryCount ?? 0;
    }

    if (questionsCompleted < 10) {
      return {
        success: false,
        message: `Level ${lvl} is incomplete. All 10 questions must be completed to unlock the next level.`
      };
    }

    starsEarned = Math.max(1, Math.min(3, Math.floor(starsEarned)));
    score = Math.max(0, Math.min(10, Math.floor(score)));
    firstTryCount = Math.max(0, Math.min(10, Math.floor(firstTryCount)));

    const existingRecord = this.progress.completedLevels[lvl];
    const isReplay = Boolean(existingRecord && existingRecord.completed);

    const record: LevelCompletionRecord = {
      levelNumber: lvl,
      completed: true,
      completedAt: new Date().toISOString(),
      bestScore: isReplay ? Math.max(existingRecord.bestScore, score) : score,
      starsEarned: isReplay ? Math.max(existingRecord.starsEarned, starsEarned) : starsEarned,
      firstTryCount: isReplay ? Math.max(existingRecord.firstTryCount, firstTryCount) : firstTryCount,
      questionsCompleted: 10,
      timesCompleted: isReplay ? (existingRecord.timesCompleted || 1) + 1 : 1
    };

    this.progress.completedLevels[lvl] = record;
    this.progress.resumeState = null;

    const newHighest = ProgressManager.deriveHighestAccessibleLevel(this.progress.completedLevels);
    this.progress.highestAccessibleLevel = newHighest;

    this.progress.destinations = this.progress.destinations.map((d) => {
      const comp = this.progress.completedLevels[d.number];
      if (comp && comp.completed) {
        return {
          ...d,
          status: 'completed',
          starsEarned: comp.starsEarned
        };
      } else if (d.number <= newHighest) {
        return {
          ...d,
          status: 'unlocked',
          starsEarned: 0
        };
      } else {
        return {
          ...d,
          status: 'locked',
          starsEarned: 0
        };
      }
    });

    this.progress.unlockedNumbers = this.progress.destinations
      .filter((d) => d.status !== 'locked')
      .map((d) => d.number);

    const nextDestination = this.progress.destinations.find((d) => d.number === lvl + 1);
    const unlockedNext: MapDestination | undefined =
      !isReplay && nextDestination && nextDestination.number <= newHighest
        ? nextDestination
        : undefined;

    this.progress.totalStars = this.progress.destinations.reduce((acc, d) => acc + d.starsEarned, 0);

    if (record.starsEarned === 3) {
      this.unlockBadge('star_collector');
    }
    const completedCount = Object.keys(this.progress.completedLevels).length;
    if (completedCount >= 3) {
      this.unlockBadge('super_explorer');
    }

    if (lvl === 10) {
      this.progress.isChampion = true;
      this.unlockBadge('math_master');
    }

    this.notify();

    let completionMessage = `Great replay! Level ${lvl} completed with ${record.starsEarned} stars preserved.`;
    if (lvl === 10) {
      completionMessage = '🌟 Congratulations! You have conquered Level 10 and are now an official Math Adventure Champion!';
    } else if (unlockedNext) {
      completionMessage = `Hooray! Level ${lvl} completed! You unlocked Level ${unlockedNext.number}: ${unlockedNext.title}!`;
    }

    return {
      success: true,
      unlockedNext,
      message: completionMessage
    };
  }

  public saveResumeState(destIdOrNumber: string | number, questionIndex: number): boolean {
    const access = this.canAccessLevel(destIdOrNumber);
    if (!access.allowed || !access.destination) {
      return false;
    }

    const qIdx = Math.max(0, Math.min(9, Math.floor(questionIndex)));
    this.progress.resumeState = {
      levelNumber: access.destination.number,
      destId: access.destination.id,
      questionIndex: qIdx,
      savedAt: Date.now()
    };

    this.notify();
    return true;
  }

  public clearResumeState() {
    if (this.progress.resumeState) {
      this.progress.resumeState = null;
      this.notify();
    }
  }

  public getResumeState(): ResumeState | null {
    if (!this.progress.resumeState) return null;
    const access = this.canAccessLevel(this.progress.resumeState.destId);
    if (!access.allowed) {
      this.progress.resumeState = null;
      return null;
    }
    return { ...this.progress.resumeState };
  }

  public updateDestination(
    destId: string,
    status: 'locked' | 'unlocked' | 'completed',
    stars: number
  ) {
    if (status === 'completed') {
      this.completeLevel(destId, { starsEarned: stars, questionsCompleted: 10 });
      return;
    }

    const target = this.progress.destinations.find((d) => d.id === destId);
    if (!target) return;

    if (status === 'unlocked' && target.number > this.progress.highestAccessibleLevel) {
      return;
    }

    this.progress.destinations = this.progress.destinations.map((d) => {
      if (d.id === destId) {
        return {
          ...d,
          status,
          starsEarned: Math.max(0, Math.min(3, stars))
        };
      }
      return d;
    });

    this.progress.totalStars = this.progress.destinations.reduce((acc, d) => acc + d.starsEarned, 0);
    this.notify();
  }

  public consumeEnergy(amount: number = 1): boolean {
    if (this.progress.energy < amount) {
      return false;
    }
    this.progress.energy = Math.max(0, this.progress.energy - amount);
    this.progress.lastEnergyRefillTimestamp = Date.now();
    this.notify();
    return true;
  }

  public refillEnergy(amount?: number) {
    if (amount !== undefined) {
      this.progress.energy = Math.min(MAX_ENERGY, this.progress.energy + amount);
    } else {
      this.progress.energy = MAX_ENERGY;
    }
    this.progress.lastEnergyRefillTimestamp = Date.now();
    this.notify();
  }

  public setActiveLevel(destId: string) {
    const check = this.canAccessLevel(destId);
    if (check.allowed && check.destination) {
      this.progress.activeLevelId = check.destination.id;
      this.notify();
    }
  }

  public unlockBadge(badgeId: string) {
    let changed = false;
    this.progress.badges = this.progress.badges.map((b) => {
      if (b.id === badgeId && !b.unlocked) {
        changed = true;
        return { ...b, unlocked: true, unlockedAt: new Date().toISOString() };
      }
      return b;
    });
    if (changed) {
      this.notify();
    }
  }

  public updateSettings(partial: Partial<PlayerSettings>) {
    this.progress.settings = {
      ...this.progress.settings,
      ...partial
    };
    this.notify();
  }

  /**
   * Reset Game Progress (Child / Gameplay Adventure Reset)
   * Resets:
   * - Level completion records (Level 1 unlocked, 2-10 locked)
   * - Stars earned (resets to 0)
   * - Badges (resets to initial unlocked states)
   * - Resume state (cleared)
   * - Intro completion (resets so child can replay opening story)
   *
   * CRITICAL REQUIREMENT:
   * DOES NOT reset or disable parent-controlled screen-time limits or energy gauge!
   * Preserves accessibility preferences and sound settings!
   */
  public resetGameProgress() {
    const templateDestinations: MapDestination[] = JSON.parse(JSON.stringify(MAP_DESTINATIONS));
    const destinations: MapDestination[] = templateDestinations.map((d, index) => ({
      ...d,
      status: index === 0 ? 'unlocked' : 'locked',
      starsEarned: 0
    }));

    this.progress = {
      ...this.progress,
      hasPlayedIntro: false,
      energy: MAX_ENERGY,
      destinations,
      unlockedNumbers: [1],
      highestAccessibleLevel: 1,
      completedLevels: {},
      resumeState: null,
      totalStars: 0,
      badges: JSON.parse(JSON.stringify(INITIAL_BADGES)),
      activeLevelId: 'dest_01',
      isChampion: false
      // screenTimeSettings: PRESERVED
      // energyGauge: PRESERVED
      // settings: PRESERVED
    };

    this.notify();
  }

  public resetProgress() {
    this.resetGameProgress();
  }

  public resetAll() {
    this.progress = ProgressManager.createFreshProgress();
    this.storage.removeItem(STORAGE_KEY_V5);
    this.storage.removeItem(STORAGE_KEY_V4);
    this.storage.removeItem(STORAGE_KEY_V3);
    this.storage.removeItem(STORAGE_KEY_V2);
    this.storage.removeItem(STORAGE_KEY_V1);
    this.storage.removeItem(LEGACY_INTRO_KEY);
    this.notify();
  }
}

export const progressManager = new ProgressManager();

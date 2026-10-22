/**
 * Beta Testing Configuration, URL Verification & Tester Feedback Storage
 */

export const VERIFIED_PUBLIC_BETA_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_PUBLIC_BETA_URL) ||
  'https://ais-pre-4boxwfrc4u6ffzkbqmdxjv-683728827707.asia-northeast1.run.app';

export const BETA_VERSION = 'v1.0.0-beta';
export const BETA_STORAGE_KEY_FEEDBACK = 'lma_beta_tester_feedback';
export const BETA_STORAGE_KEY_CHECKLIST = 'lma_beta_tester_checklist';

export interface BetaChecklistItem {
  id: string;
  title: string;
  description: string;
}

export const BETA_TESTING_CHECKLIST: BetaChecklistItem[] = [
  {
    id: 'chk_1_open_url',
    title: '1. Shared URL Access',
    description: 'The game opens directly from the public HTTPS link without needing developer login or special permissions.'
  },
  {
    id: 'chk_2_intro_voices',
    title: '2. Story & Character Voices',
    description: 'The 5-scene introduction plays smoothly and audio voice narration for Andy, Sancho, and Osi speaks clearly.'
  },
  {
    id: 'chk_3_character_art',
    title: '3. Character Visuals',
    description: 'Andy (girl), Sancho (boy), and Osi (Shih Tzu puppy) illustrations, expressions, and badges render cleanly.'
  },
  {
    id: 'chk_4_map_locks',
    title: '4. Adventure Map & Level Locks',
    description: 'The ten-level adventure map renders properly; Level 1 is unlocked while Levels 2–10 start securely locked.'
  },
  {
    id: 'chk_5_math_gameplay',
    title: '5. Math Questions & Feedback',
    description: 'All 10 questions per level provide exactly 3 distinct choices, instant visual feedback, gentle hints, and positive celebration.'
  },
  {
    id: 'chk_6_level_progression',
    title: '6. Progression & Star Rewards',
    description: 'Scoring 8+ correct answers completes the level, awards 1–3 stars, and sequentially unlocks the next level.'
  },
  {
    id: 'chk_7_multi_device',
    title: '7. Responsive Mobile & Desktop Layout',
    description: 'Touch controls, safe area insets, winding canvas map, and vertical trail view respond cleanly across phones, tablets, and computers.'
  },
  {
    id: 'chk_8_energy_gauge',
    title: '8. Screen-Time & Adventure Energy',
    description: 'The Adventure Energy Gauge accurately reflects healthy session time, gives a 2-minute reminder, and honors parent-configured limits.'
  },
  {
    id: 'chk_9_persistence',
    title: '9. Save Persistence on Refresh',
    description: 'Refreshing or reopening the browser preserves completed levels, earned stars, and audio/accessibility settings.'
  },
  {
    id: 'chk_10_copy_link',
    title: '10. Copy Beta Link Functionality',
    description: 'The Copy Beta Link button copies the real verified public URL to the clipboard with clear visual confirmation.'
  }
];

export interface BetaFeedbackSubmission {
  id: string;
  timestamp: string;
  deviceBrowser: string;
  issueDescription: string;
  stepsToReproduce?: string;
  suggestions?: string;
  testedChecklistCount: number;
}

/**
 * Safely copies text to the clipboard with legacy fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // 1. Modern navigator.clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }

  // 2. Legacy textarea execCommand fallback
  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      textarea.setAttribute('readonly', '');
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (err) {
      console.warn('Fallback clipboard copy failed:', err);
    }
  }

  return false;
}

/**
 * Native Web Share API trigger
 */
export async function shareBetaLink(url: string = VERIFIED_PUBLIC_BETA_URL): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: 'Little Math Adventures (Playable Beta)',
        text: 'Help Andy, Sancho, and Osi test their preschool math adventure!',
        url
      });
      return true;
    } catch (err: any) {
      // User cancelled or share failed
      if (err?.name !== 'AbortError') {
        console.warn('Share API error:', err);
      }
    }
  }
  return false;
}

/**
 * Load saved checklist item check states
 */
export function loadChecklistProgress(): Record<string, boolean> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(BETA_STORAGE_KEY_CHECKLIST);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save checklist progress locally
 */
export function saveChecklistProgress(progress: Record<string, boolean>): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(BETA_STORAGE_KEY_CHECKLIST, JSON.stringify(progress));
  } catch (err) {
    console.warn('Could not save beta checklist state:', err);
  }
}

/**
 * Save anonymous feedback entry locally
 */
export function saveBetaFeedback(feedback: Omit<BetaFeedbackSubmission, 'id' | 'timestamp'>): BetaFeedbackSubmission {
  const submission: BetaFeedbackSubmission = {
    ...feedback,
    id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString()
  };

  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(BETA_STORAGE_KEY_FEEDBACK);
      const existing: BetaFeedbackSubmission[] = raw ? JSON.parse(raw) : [];
      existing.unshift(submission);
      localStorage.setItem(BETA_STORAGE_KEY_FEEDBACK, JSON.stringify(existing.slice(0, 20)));
    } catch (err) {
      console.warn('Could not save beta feedback locally:', err);
    }
  }

  return submission;
}

/**
 * Get all stored local feedback
 */
export function getSavedBetaFeedback(): BetaFeedbackSubmission[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BETA_STORAGE_KEY_FEEDBACK);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

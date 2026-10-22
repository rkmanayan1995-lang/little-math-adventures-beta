/**
 * Web Audio API Sound Synthesizer & Speech Narration Engine
 * for Little Math Adventures (Ages 3–7)
 *
 * Implements:
 * - Natural, high-pitched toddler animated voiceover without artificial squeaks
 * - Distinct vocal identities for Narrator, Andy (girl), Sancho (boy), and Osi (Shih Tzu puppy)
 * - Soft, whimsical, continuous magical background music with dynamic speech ducking
 * - Synchronized speech boundary tracking without cutting
 * - Realistic dual-formant Shih Tzu puppy bark
 */

export interface VoiceSettings {
  pitch: number;
  rate: number;
  volume: number;
  voiceName?: string;
}

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  // Continuous background music state
  private isBgmPlaying: boolean = false;
  private bgmMasterGain: GainNode | null = null;
  private bgmLoopTimer: number | null = null;
  private currentChordIdx: number = 0;

  // Speech synthesis reference guards to prevent Chromium garbage collection cuts
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private speechHeartbeatTimer: number | null = null;

  // Custom voice tuning overrides (defaults tuned to Master Voice Direction)
  private voiceConfigs: Record<'narrator' | 'andy' | 'sancho' | 'osi', VoiceSettings> = {
    // Narrator: enthusiastic 4-year-old toddler storyteller, high & light, gentle wonder
    narrator: {
      pitch: 1.38,
      rate: 0.86,
      volume: 1.0,
    },
    // Andy: brave, cheerful 5-year-old girl, bright, expressive, sunny
    andy: {
      pitch: 1.45,
      rate: 0.94,
      volume: 1.0,
    },
    // Sancho: clever, thoughtful 6-year-old boy, slightly lower pitch, calm & warm
    sancho: {
      pitch: 1.14,
      rate: 0.88,
      volume: 1.0,
    },
    // Osi: playful Shih Tzu puppy, high-spirited, energetic puppy cadence
    osi: {
      pitch: 1.55,
      rate: 1.02,
      volume: 1.0,
    },
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public async resumeContext(): Promise<void> {
    if (!this.ctx) {
      this.initContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        // Ignored if user hasn't interacted yet
      }
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopIntroBgm();
      this.stopSpeech();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getVoiceSettings(speaker: 'narrator' | 'andy' | 'sancho' | 'osi'): VoiceSettings {
    return { ...this.voiceConfigs[speaker] };
  }

  public updateVoiceSettings(
    speaker: 'narrator' | 'andy' | 'sancho' | 'osi',
    settings: Partial<VoiceSettings>
  ) {
    this.voiceConfigs[speaker] = {
      ...this.voiceConfigs[speaker],
      ...settings,
    };
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.cachedVoices.length > 0) return this.cachedVoices;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
    }
    return this.cachedVoices;
  }

  /**
   * Soft bubbly pop for button taps
   */
  public playPop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Musical note for counting items (1 through 10) in a warm pentatonic scale
   */
  public playCountNote(step: number) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const freq = scale[(Math.max(1, step) - 1) % scale.length];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const now = this.ctx.currentTime;

    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  /**
   * Pleasant melodic chime for interactive counting
   */
  public playChime(step: number = 1) {
    this.playCountNote(step);
  }

  /**
   * Twinkly sparkle for star collection or unlocking
   */
  public playStarSparkle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [587.33, 739.99, 880.0, 1174.66];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const delay = idx * 0.06;
      const startTime = this.ctx.currentTime + delay;

      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  /**
   * Joyful celebration fanfare for team victory
   */
  public playCelebration() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const chords = [
      { freq: 440, delay: 0 },
      { freq: 554.37, delay: 0.08 },
      { freq: 659.25, delay: 0.16 },
      { freq: 880, delay: 0.26 },
    ];

    chords.forEach(({ freq, delay }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const startTime = this.ctx.currentTime + delay;

      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.46);
    });
  }

  /**
   * Metallic soft lock/unlock click
   */
  public playLockSound(unlocked: boolean) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(unlocked ? 480 : 300, now);
    if (unlocked) {
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.1);
    }

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  /**
   * Realistic Shih Tzu dog bark synthesizer using dual vocal tract formants
   * Creates a distinct, cute, high-pitched "Arf! Arf!" puppy bark.
   */
  public playBark(count: number = 2) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < count; i++) {
      const startTime = now + i * 0.16;

      // 1. Fundamental pitch sweep (Canine vocal cord: 780Hz -> 360Hz)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(780, startTime);
      osc.frequency.exponentialRampToValueAtTime(360, startTime + 0.11);

      // 2. Dual bandpass formant filters (simulates puppy snout & oral cavity)
      const formant1 = this.ctx.createBiquadFilter();
      formant1.type = 'bandpass';
      formant1.frequency.setValueAtTime(560, startTime);
      formant1.Q.setValueAtTime(3.5, startTime);

      const formant2 = this.ctx.createBiquadFilter();
      formant2.type = 'bandpass';
      formant2.frequency.setValueAtTime(1250, startTime);
      formant2.Q.setValueAtTime(4.0, startTime);

      // 3. Puppy breath rasp burst
      const noiseLength = Math.floor(this.ctx.sampleRate * 0.08);
      const noiseBuffer = this.ctx.createBuffer(1, noiseLength, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let j = 0; j < noiseLength; j++) {
        data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (this.ctx.sampleRate * 0.02));
      }
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(950, startTime);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, startTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

      // Mix & Envelope
      oscGain.gain.setValueAtTime(0.001, startTime);
      oscGain.gain.linearRampToValueAtTime(0.28, startTime + 0.02);
      oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.13);

      osc.connect(formant1);
      osc.connect(formant2);
      formant1.connect(oscGain);
      formant2.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.14);
      noiseSource.start(startTime);
      noiseSource.stop(startTime + 0.09);
    }
  }

  /**
   * Magical traveling star whoosh
   */
  public playStarWhoosh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.4);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.46);
  }

  /**
   * Gentle harp-like transition chime
   */
  public playGentleChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [392, 523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const t = this.ctx.currentTime + idx * 0.05;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.36);
    });
  }

  /**
   * Playful toddler vocal chime accompaniment
   */
  public playToddlerChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const giggleNotes = [523.25, 659.25, 783.99, 1046.5];
    giggleNotes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const t = now + idx * 0.055;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.08, t + 0.04);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.13);
    });
  }

  /**
   * Enchanting magical sparkle glockenspiel chime (ecstatic fairy shimmer)
   */
  public playMagicalSparkle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const sparkleNotes = [783.99, 987.77, 1174.66, 1318.51, 1567.98, 1975.53];
    sparkleNotes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;
      const t = now + idx * 0.06;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.015, t + 0.15);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.46);
    });
  }

  /**
   * Short, smooth, magical background music transition theme
   */
  public playMagicalTransitionTheme() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Sub-bass pad
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(87.31, now);
    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.linearRampToValueAtTime(0.12, now + 0.4);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
    bassOsc.connect(bassGain);
    bassGain.connect(this.ctx.destination);
    bassOsc.start(now);
    bassOsc.stop(now + 2.9);

    // Harp arpeggio
    const harpNotes = [174.61, 220.0, 261.63, 329.63, 392.0, 523.25, 659.25];
    harpNotes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const t = now + 0.12 + idx * 0.11;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 1.25);
    });

    // Celesta chimes on top
    const bellNotes = [783.99, 987.77, 1174.66, 1567.98];
    bellNotes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const t = now + 0.45 + idx * 0.14;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.01, t + 0.1);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.11, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 1.55);
    });
  }

  /**
   * CONTINUOUS SOFT MAGICAL BACKGROUND MUSIC (BGM)
   * Plays a warm, whimsical, music-box & celesta preschool progression below spoken dialogue.
   * Features dynamic audio ducking during speech to keep voices crisp.
   */
  public startIntroBgm() {
    if (this.isMuted || this.isBgmPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    if (this.bgmLoopTimer) {
      clearInterval(this.bgmLoopTimer);
      this.bgmLoopTimer = null;
    }

    this.isBgmPlaying = true;
    this.currentChordIdx = 0;

    // Master BGM gain node with warm lowpass filter (2400 Hz) to eliminate harsh highs
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, this.ctx.currentTime);

    this.bgmMasterGain = this.ctx.createGain();
    this.bgmMasterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.bgmMasterGain.gain.linearRampToValueAtTime(0.042, this.ctx.currentTime + 1.2);

    filter.connect(this.bgmMasterGain);
    this.bgmMasterGain.connect(this.ctx.destination);

    // Warm, comforting chord cycles (Fmaj9 -> Cmaj7 -> Dm7 -> Bbmaj7)
    const chordCycles = [
      { bass: 87.31, notes: [174.61, 261.63, 329.63, 392.0] }, // F
      { bass: 65.41, notes: [130.81, 196.0, 246.94, 329.63] }, // C
      { bass: 73.42, notes: [146.83, 220.0, 261.63, 349.23] }, // Dm
      { bass: 58.27, notes: [116.54, 174.61, 233.08, 293.66] }, // Bb
    ];

    const playNextChord = () => {
      if (!this.isBgmPlaying || !this.ctx || !filter) return;

      const chord = chordCycles[this.currentChordIdx % chordCycles.length];
      this.currentChordIdx++;
      const now = this.ctx.currentTime;

      // Soft bass pad
      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bOsc.type = 'triangle';
      bOsc.frequency.setValueAtTime(chord.bass, now);
      bGain.gain.setValueAtTime(0.001, now);
      bGain.gain.linearRampToValueAtTime(0.06, now + 0.5);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 3.4);
      bOsc.connect(bGain);
      bGain.connect(filter);
      bOsc.start(now);
      bOsc.stop(now + 3.5);

      // Delicate harp / music-box arpeggio notes
      chord.notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        const t = now + 0.15 + idx * 0.28;
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.05, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
        osc.connect(g);
        g.connect(filter);
        osc.start(t);
        osc.stop(t + 1.45);
      });

      // Ethereal music box chime bell note on 2nd and 4th beats
      const chimeFreq = chord.notes[2] * 2;
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chimeOsc.type = 'sine';
      const chimeTime = now + 1.1;
      chimeOsc.frequency.setValueAtTime(chimeFreq, chimeTime);
      chimeGain.gain.setValueAtTime(0.001, chimeTime);
      chimeGain.gain.linearRampToValueAtTime(0.035, chimeTime + 0.03);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, chimeTime + 1.2);
      chimeOsc.connect(chimeGain);
      chimeGain.connect(filter);
      chimeOsc.start(chimeTime);
      chimeOsc.stop(chimeTime + 1.25);
    };

    playNextChord();
    this.bgmLoopTimer = window.setInterval(playNextChord, 3500);
  }

  /**
   * Duck BGM volume when spoken dialogue is active
   */
  public duckBgm(duck: boolean) {
    if (!this.bgmMasterGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.bgmMasterGain.gain.cancelScheduledValues(now);
    const target = duck ? 0.016 : 0.042;
    this.bgmMasterGain.gain.linearRampToValueAtTime(target, now + 0.35);
  }

  public stopIntroBgm() {
    this.isBgmPlaying = false;
    if (this.bgmLoopTimer) {
      clearInterval(this.bgmLoopTimer);
      this.bgmLoopTimer = null;
    }
    if (this.bgmMasterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.bgmMasterGain.gain.linearRampToValueAtTime(0.001, now + 0.4);
      setTimeout(() => {
        this.bgmMasterGain = null;
      }, 450);
    }
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  /**
   * Highly optimized, child-friendly Speech Synthesis Narration Engine
   * Conforms to the Master Voice Direction:
   * - High-pitched, youthful, toddler-like animated voice without artificial squeaks
   * - Distinct vocal personas for Narrator, Andy, Sancho, and Osi
   * - Continuous audio ducking
   * - Precise word boundary syncing without premature voice clipping
   */
  private cleanupSpeech() {
    if (this.speechHeartbeatTimer) {
      clearInterval(this.speechHeartbeatTimer);
      this.speechHeartbeatTimer = null;
    }
    this.activeUtterance = null;
    if (typeof window !== 'undefined') {
      try {
        (window as unknown as { __activeUtterance?: SpeechSynthesisUtterance | null }).__activeUtterance = null;
      } catch {
        // Ignored
      }
    }
  }

  public speak(
    text: string,
    speaker: 'narrator' | 'andy' | 'sancho' | 'osi' = 'narrator',
    options?: {
      onWord?: (charIndex: number, word: string) => void;
      onEnd?: () => void;
      customPitch?: number;
      customRate?: number;
    }
  ) {
    if (this.isMuted) {
      if (options?.onEnd) {
        setTimeout(options.onEnd, 2200);
      }
      return;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options?.onEnd) {
        setTimeout(options.onEnd, 2800);
      }
      return;
    }

    // Stop and cleanup previous speech
    this.cleanupSpeech();
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    this.duckBgm(true);

    const utterance = new SpeechSynthesisUtterance(text);
    this.activeUtterance = utterance;
    if (typeof window !== 'undefined') {
      try {
        (window as unknown as { __activeUtterance?: SpeechSynthesisUtterance | null }).__activeUtterance = utterance;
      } catch {
        // Ignored
      }
    }

    const config = this.voiceConfigs[speaker];

    // Character musical accompaniments
    if (speaker === 'narrator') {
      this.playMagicalSparkle();
    } else if (speaker === 'andy') {
      this.playToddlerChime();
    } else if (speaker === 'sancho') {
      this.playCountNote(3);
    } else if (speaker === 'osi') {
      this.playBark(2);
    }

    // Apply pitch and rate (using custom overrides if provided)
    utterance.pitch = options?.customPitch ?? config.pitch;
    utterance.rate = options?.customRate ?? config.rate;
    utterance.volume = config.volume;

    // Intelligent voice selection from system voices
    const voices = this.getAvailableVoices();

    if (speaker === 'sancho') {
      // Sancho: distinct 6-year-old boy vocal identity
      const boyVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Daniel') ||
              v.name.includes('Oliver') ||
              v.name.includes('Alex') ||
              v.name.includes('George') ||
              v.name.includes('Male') ||
              v.name.includes('Guy'))
        ) ||
        voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('male')) ||
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            !v.name.includes('Samantha') &&
            !v.name.includes('Victoria') &&
            !v.name.includes('Karen')
        );

      if (boyVoice) {
        utterance.voice = boyVoice;
      }
    } else if (speaker === 'andy') {
      // Andy: cheerful, bright 5-year-old girl voice
      const girlVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Victoria') ||
              v.name.includes('Tessa') ||
              v.name.includes('Fiona') ||
              v.name.includes('Samantha') ||
              v.name.includes('Natural'))
        ) ||
        voices.find((v) => v.lang.startsWith('en') && v.name.includes('Female')) ||
        voices[0];

      if (girlVoice) {
        utterance.voice = girlVoice;
      }
    } else if (speaker === 'osi') {
      // Osi: playful puppy voice
      const puppyVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Karen') ||
              v.name.includes('Samantha') ||
              v.name.includes('Zira') ||
              v.name.includes('Victoria'))
        ) || voices[0];

      if (puppyVoice) {
        utterance.voice = puppyVoice;
      }
    } else {
      // Narrator: sweet, high, enthusiastic 4-year-old child storyteller
      // Prefer highest quality natural / neural / clear voices
      const toddlerVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google US English') ||
              v.name.includes('Samantha') ||
              v.name.includes('Victoria') ||
              v.name.includes('Tessa') ||
              v.name.includes('Karen'))
        ) ||
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            !v.name.includes('Alex') &&
            !v.name.includes('Fred') &&
            !v.name.includes('Bad')
        ) ||
        voices[0];

      if (toddlerVoice) {
        utterance.voice = toddlerVoice;
      }
    }

    // Word boundary syncing for highlighting text
    if (options?.onWord) {
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const charIndex = event.charIndex;
          const word = text.slice(charIndex).split(/\s+/)[0] || '';
          options.onWord?.(charIndex, word);
        }
      };
    }

    // Smooth completion callback with duck restore and cleanup
    utterance.onend = () => {
      this.cleanupSpeech();
      this.duckBgm(false);
      if (options?.onEnd) {
        options.onEnd();
      }
    };

    utterance.onerror = (e) => {
      // Ignore normal interruptions / cancellations when scene moves or user toggles
      if (e.error === 'interrupted' || e.error === 'canceled') {
        this.cleanupSpeech();
        this.duckBgm(false);
        return;
      }
      console.warn('SpeechSynthesis error:', e);
      this.cleanupSpeech();
      this.duckBgm(false);
      if (options?.onEnd) {
        options.onEnd();
      }
    };

    // Chromium watchdog heartbeat to prevent Chrome from prematurely pausing speech > 10s
    this.speechHeartbeatTimer = window.setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
    }, 8000);

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeech() {
    this.cleanupSpeech();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.duckBgm(false);
  }
}

export const soundManager = new SoundEffectsManager();

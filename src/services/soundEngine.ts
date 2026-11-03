// ============================================================================
// Procedural Ambient Music & Interactive UI Audio Engine (Web Audio API)
// Zero external media downloads - 100% synthesized procedurally
// ============================================================================

type AudioStateListener = (isPlaying: boolean) => void;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMusicPlaying = false;
  private isMuted = false;
  private musicIntervalId: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<AudioStateListener> = new Set();
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  constructor() {
    // Check saved state from localStorage
    if (typeof window !== 'undefined') {
      try {
        const savedMute = localStorage.getItem('pramuditha_audio_muted');
        if (savedMute !== null) {
          this.isMuted = savedMute === 'true';
        }
      } catch {
        // Storage access might be restricted in some sandboxes
      }
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return null;

      try {
        this.ctx = new AudioCtxClass();

        // Master gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Music bus with smooth low-pass filter for ambient warmth
        const musicFilter = this.ctx.createBiquadFilter();
        musicFilter.type = 'lowpass';
        musicFilter.frequency.setValueAtTime(950, this.ctx.currentTime);
        musicFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);
        musicFilter.connect(this.masterGain);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        this.musicGain.connect(musicFilter);

        // SFX bus
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      } catch (err) {
        console.warn('Web Audio initialization failed:', err);
        return null;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  // ==========================================
  // PROCEDURAL AMBIENT CHORD SEQUENCE
  // ==========================================
  // Ambient chord progressions (in Hz):
  // Chord 1: Dm9 (D3, F3, A3, C4, E4)
  // Chord 2: BbMaj7 (Bb2, D3, F3, A3, D4)
  // Chord 3: Fmaj7 (F2, C3, E3, A3, C4)
  // Chord 4: C6/9 (C3, E3, G3, A3, D4)
  private readonly chordProgressions: number[][] = [
    [146.83, 174.61, 220.00, 261.63, 329.63], // Dm9
    [116.54, 146.83, 174.61, 220.00, 293.66], // BbMaj7
    [87.31, 130.81, 164.81, 220.00, 261.63],  // Fmaj7
    [130.81, 164.81, 196.00, 220.00, 293.66]  // C6/9
  ];

  private currentChordIndex = 0;

  private playAmbientChord() {
    const ctx = this.initContext();
    if (!ctx || !this.musicGain || !this.isMusicPlaying || this.isMuted) return;

    const chord = this.chordProgressions[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chordProgressions.length;
    const now = ctx.currentTime;
    const chordDuration = 5.5; // slow, dreamy ambient swell

    chord.forEach((freq, i) => {
      // Stagger note onsets slightly for a natural strum / harp feel
      const noteDelay = i * 0.12;
      const startTime = now + noteDelay;

      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      // Alternate between warm triangle and mellow sine waves
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Subtle slow frequency vibrato for rich analog texture
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      vibrato.frequency.setValueAtTime(3.5, startTime);
      vibratoGain.gain.setValueAtTime(1.5, startTime);
      vibrato.connect(osc.frequency);
      vibrato.start(startTime);
      vibrato.stop(startTime + chordDuration);

      // Attack - Sustain - Release Envelope
      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.08 / (i + 1), startTime + 1.2);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + chordDuration);

      osc.connect(noteGain);
      noteGain.connect(this.musicGain!);

      osc.start(startTime);
      osc.stop(startTime + chordDuration + 0.1);

      // Cleanup
      setTimeout(() => {
        try {
          osc.disconnect();
          noteGain.disconnect();
          vibrato.disconnect();
          vibratoGain.disconnect();
        } catch {
          // Nodes already collected
        }
      }, (chordDuration + 1) * 1000);
    });
  }

  public startMusic() {
    const ctx = this.initContext();
    if (!ctx) return;

    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
    }

    this.isMusicPlaying = true;
    this.notify();

    // Play first chord immediately
    this.playAmbientChord();

    // Loop next chords at intervals
    this.musicIntervalId = setInterval(() => {
      if (this.isMusicPlaying && !this.isMuted) {
        this.playAmbientChord();
      }
    }, 5000);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
    this.notify();
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.isMusicPlaying;
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  // ==========================================
  // PROCEDURAL UI SOUND EFFECTS
  // ==========================================

  public playClickSound() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(820, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio playback interrupted
    }
  }

  public playHoverSound() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.04);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Audio playback interrupted
    }
  }

  public playTransitionSound() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.sfxGain) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(330, now);
      osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.22); // E4 -> C5

      osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.sfxGain);

      osc1.start(now);
      osc2.start(now + 0.08);
      osc1.stop(now + 0.36);
      osc2.stop(now + 0.36);
    } catch {
      // Audio playback interrupted
    }
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isMusicPlaying));
  }
}

export const soundEngine = new SoundEngine();

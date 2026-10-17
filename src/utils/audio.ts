/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameItemType, AnimalType, FruitType } from '../types/game';

// Web Audio API Synthesizer for instant, offline, delightful sound effects
class SoundController {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private voiceEnabled: boolean = true;
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.unlockAudio();
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('touchstart', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
    }
  }

  public unlockAudio() {
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => {
        this.isUnlocked = true;
      }).catch(() => {});
    } else {
      this.isUnlocked = true;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
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
    return this.ctx;
  }

  public setSoundEnabled(val: boolean) {
    this.soundEnabled = val;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setVoiceEnabled(val: boolean) {
    this.voiceEnabled = val;
  }

  public isVoiceEnabled(): boolean {
    return this.voiceEnabled;
  }

  /**
   * Main method to play sound when students click ANY object (fruit or animal).
   * Generates a cheerful, multi-layered tactile pop + musical xylophone tone
   * tailored to the item and its count position.
   */
  public playObjectClick(itemType: GameItemType, countNumber?: number) {
    if (!this.soundEnabled) return;
    this.unlockAudio();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const count = countNumber ?? 1;

    // Frequencies (diatonic and joyful pentatonic scale)
    const frequencies = [
      261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, // C4 to B4 (1-7)
      523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, // C5 to B5 (8-14)
      1046.50, 1174.66, 1318.51, 1396.91, 1567.98, 1760.00   // C6 to A6 (15-20)
    ];

    const baseFreq = frequencies[Math.min(Math.max(count - 1, 0), frequencies.length - 1)];
    const now = ctx.currentTime;

    // Layer 1: Xylophone/Marimba fundamental (warm sine tone)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, now);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.35, now + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Layer 2: Character-specific tactile chirp or harmonic pop
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    switch (itemType) {
      case 'frog':
        // Playful springy boing
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(baseFreq * 0.8, now);
        osc2.frequency.linearRampToValueAtTime(baseFreq * 1.5, now + 0.08);
        osc2.frequency.linearRampToValueAtTime(baseFreq * 1.1, now + 0.18);
        gain2.gain.setValueAtTime(0.25, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        break;

      case 'bunny':
      case 'kitten':
      case 'chick':
        // Cute high-pitched chime
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(baseFreq * 2, now);
        osc2.frequency.exponentialRampToValueAtTime(baseFreq * 2.5, now + 0.09);
        gain2.gain.setValueAtTime(0.2, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        break;

      case 'puppy':
      case 'lion':
      case 'panda':
        // Warm round bell harmonic
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(baseFreq * 1.5, now);
        gain2.gain.setValueAtTime(0.2, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        break;

      default:
        // Fruits: crisp, juicy pop
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(baseFreq * 1.8, now);
        osc2.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 0.08);
        gain2.gain.setValueAtTime(0.22, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        break;
    }

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.35);
  }

  // Plays a bright, musical marimba/xylophone pitch corresponding to count index (1..20)
  public playCountNote(count: number) {
    if (!this.soundEnabled) return;
    this.unlockAudio();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const frequencies = [
      261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88,
      523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77,
      1046.50, 1174.66, 1318.51, 1396.91, 1567.98, 1760.00
    ];

    const freq = frequencies[Math.min(Math.max(count - 1, 0), frequencies.length - 1)];
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Crisp playful bubble pop
  public playPop() {
    if (!this.soundEnabled) return;
    this.unlockAudio();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Cute munch / crunch sound when feeding animals
  public playMunch() {
    if (!this.soundEnabled) return;
    this.unlockAudio();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Cheerful chime on correct answer
  public playSuccess() {
    if (!this.soundEnabled) return;
    this.unlockAudio();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = now + i * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  // Grand victory fanfare for completing a game round
  public playCelebration() {
    if (!this.soundEnabled) return;
    this.unlockAudio();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const chords = [
      { notes: [523.25, 659.25, 783.99], time: 0 },
      { notes: [587.33, 739.99, 880.00], time: 0.15 },
      { notes: [659.25, 783.99, 1046.50], time: 0.3 },
      { notes: [783.99, 987.77, 1318.51], time: 0.48 },
      { notes: [1046.50, 1318.51, 1567.98], time: 0.7 }
    ];

    const now = ctx.currentTime;

    chords.forEach((chord) => {
      chord.notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const startTime = now + chord.time;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    });
  }

  // Gentle, reassuring boing if child selects wrong option (encouraging!)
  public playGentleBoing() {
    if (!this.soundEnabled) return;
    this.unlockAudio();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(260, now + 0.15);
    osc.frequency.linearRampToValueAtTime(280, now + 0.3);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Web Speech API for voice counting and cheerful cheering
  public speak(text: string, lang: 'en' | 'id' = 'en') {
    if (!this.voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'id' ? 'id-ID' : 'en-US';
      utterance.rate = 0.95; // friendly speed for young children
      utterance.pitch = 1.25; // friendly, warm pitch
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis fallback silently
    }
  }
}

export const soundFx = new SoundController();

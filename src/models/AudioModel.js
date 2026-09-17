// AudioModel.js: Procedural Web Audio synthesis and acoustic resonance engine. Interfaces with AudioController and AcousticView.

import { AUDIO_CONFIG } from "../config/constants.js";

const BUFFER_SAMPLE_RATE = 44100;

class AudioModel {
  constructor() {
    this.audioContext = null;
    this.ambientSource = null;
    this.ambientFilter = null;
    this.ambientGain = null;
    this.lfoOsc = null;
    this.lfoGain = null;
    this.ambientStopTimer = null;
    this.isAmbientPlaying = false;
    this.subscribers = new Set();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    const snapshot = this.getSnapshot();
    for (const callback of this.subscribers) {
      callback(snapshot);
    }
  }

  ensureAudioContext() {
    if (!this.audioContext && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  generatePinkNoiseBuffer(durationSeconds) {
    const ctx = this.ensureAudioContext();
    if (!ctx) return null;
    const bufferSize = Math.floor(ctx.sampleRate * durationSeconds);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = (Math.random() * 2) - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  toggleAmbientFizz() {
    const ctx = this.ensureAudioContext();
    if (!ctx) return false;

    if (this.ambientStopTimer) {
      clearTimeout(this.ambientStopTimer);
      this.ambientStopTimer = null;
    }

    if (this.isAmbientPlaying) {
      if (this.ambientGain) {
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, ctx.currentTime);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.6);
        this.ambientStopTimer = setTimeout(() => {
          if (this.ambientSource) {
            try { this.ambientSource.stop(); } catch (_) {}
            this.ambientSource.disconnect();
            this.ambientSource = null;
          }
          if (this.lfoOsc) {
            try { this.lfoOsc.stop(); } catch (_) {}
            this.lfoOsc.disconnect();
            this.lfoOsc = null;
          }
          this.ambientStopTimer = null;
        }, 650);
      }
      this.isAmbientPlaying = false;
      this.notify();
      return false;
    }

    if (this.ambientSource) {
      try { this.ambientSource.stop(); } catch (_) {}
      this.ambientSource.disconnect();
      this.ambientSource = null;
    }
    if (this.lfoOsc) {
      try { this.lfoOsc.stop(); } catch (_) {}
      this.lfoOsc.disconnect();
      this.lfoOsc = null;
    }

    const pinkBuffer = this.generatePinkNoiseBuffer(AUDIO_CONFIG.noiseDuration);
    if (!pinkBuffer) return false;

    this.ambientSource = ctx.createBufferSource();
    this.ambientSource.buffer = pinkBuffer;
    this.ambientSource.loop = true;

    this.ambientFilter = ctx.createBiquadFilter();
    this.ambientFilter.type = "bandpass";
    this.ambientFilter.frequency.setValueAtTime(AUDIO_CONFIG.ambientFilterFreq, ctx.currentTime);
    this.ambientFilter.Q.setValueAtTime(AUDIO_CONFIG.ambientFilterQ, ctx.currentTime);

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.00001, ctx.currentTime);
    this.ambientGain.gain.exponentialRampToValueAtTime(AUDIO_CONFIG.ambientGain, ctx.currentTime + 0.8);

    this.lfoOsc = ctx.createOscillator();
    this.lfoGain = ctx.createGain();
    this.lfoOsc.frequency.setValueAtTime(AUDIO_CONFIG.ambientLfoFreq, ctx.currentTime);
    this.lfoGain.gain.setValueAtTime(AUDIO_CONFIG.ambientGain * 0.25, ctx.currentTime);

    this.lfoOsc.connect(this.lfoGain);
    this.lfoGain.connect(this.ambientGain.gain);

    this.ambientSource.connect(this.ambientFilter);
    this.ambientFilter.connect(this.ambientGain);
    this.ambientGain.connect(ctx.destination);

    this.ambientSource.start();
    this.lfoOsc.start();
    this.isAmbientPlaying = true;
    this.notify();
    return true;
  }

  playCanSnap() {
    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    const tabOsc = ctx.createOscillator();
    const tabGain = ctx.createGain();
    tabOsc.type = "triangle";
    tabOsc.frequency.setValueAtTime(AUDIO_CONFIG.snapStartFreq, t);
    tabOsc.frequency.exponentialRampToValueAtTime(AUDIO_CONFIG.snapEndFreq, t + 0.05);
    tabGain.gain.setValueAtTime(0.22, t);
    tabGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    tabOsc.connect(tabGain);
    tabGain.connect(ctx.destination);
    tabOsc.start(t);
    tabOsc.stop(t + 0.07);

    const gasBuffer = this.generatePinkNoiseBuffer(0.55);
    if (gasBuffer) {
      const gasSource = ctx.createBufferSource();
      gasSource.buffer = gasBuffer;
      const gasFilter = ctx.createBiquadFilter();
      gasFilter.type = "bandpass";
      gasFilter.frequency.setValueAtTime(AUDIO_CONFIG.gasReleaseFreq, t + 0.03);
      gasFilter.frequency.exponentialRampToValueAtTime(1400, t + 0.45);
      gasFilter.Q.setValueAtTime(1.4, t);

      const gasGain = ctx.createGain();
      gasGain.gain.setValueAtTime(0.0001, t);
      gasGain.gain.setValueAtTime(0.18, t + 0.04);
      gasGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

      gasSource.connect(gasFilter);
      gasFilter.connect(gasGain);
      gasGain.connect(ctx.destination);
      gasSource.start(t + 0.03);
      gasSource.stop(t + 0.52);
    }

    const fizzBuffer = this.generatePinkNoiseBuffer(1.1);
    if (fizzBuffer) {
      const fizzSource = ctx.createBufferSource();
      fizzSource.buffer = fizzBuffer;
      const fizzFilter = ctx.createBiquadFilter();
      fizzFilter.type = "bandpass";
      fizzFilter.frequency.setValueAtTime(AUDIO_CONFIG.fizzResonanceFreq, t + 0.12);
      fizzFilter.Q.setValueAtTime(1.1, t);

      const fizzGain = ctx.createGain();
      fizzGain.gain.setValueAtTime(0.0001, t);
      fizzGain.gain.setValueAtTime(0.06, t + 0.16);
      fizzGain.gain.exponentialRampToValueAtTime(0.00001, t + 1.15);

      fizzSource.connect(fizzFilter);
      fizzFilter.connect(fizzGain);
      fizzGain.connect(ctx.destination);
      fizzSource.start(t + 0.12);
      fizzSource.stop(t + 1.2);
    }
  }

  getSnapshot() {
    return {
      isAmbientPlaying: this.isAmbientPlaying,
      isInitialized: Boolean(this.audioContext)
    };
  }
}

export { AudioModel };

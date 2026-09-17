// AudioModel.js: Procedural Web Audio synthesis and acoustic resonance engine. Interfaces with AudioController and AcousticView.

import { AUDIO_CONFIG } from "../config/constants.js";

const BUFFER_SAMPLE_RATE = 44100;

class AudioModel {
  constructor() {
    this.audioContext = null;
    this.ambientSource = null;
    this.ambientFilter = null;
    this.ambientGain = null;
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

  generateNoiseBuffer(durationSeconds) {
    const ctx = this.ensureAudioContext();
    if (!ctx) return null;
    const bufferSize = Math.floor(ctx.sampleRate * durationSeconds);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2) - 1;
    }
    return buffer;
  }

  toggleAmbientFizz() {
    const ctx = this.ensureAudioContext();
    if (!ctx) return false;

    if (this.isAmbientPlaying) {
      if (this.ambientGain) {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.4);
        setTimeout(() => {
          if (this.ambientSource) {
            try { this.ambientSource.stop(); } catch (_) {}
            this.ambientSource.disconnect();
            this.ambientSource = null;
          }
        }, 450);
      }
      this.isAmbientPlaying = false;
      this.notify();
      return false;
    }

    const noiseBuffer = this.generateNoiseBuffer(AUDIO_CONFIG.noiseDuration);
    if (!noiseBuffer) return false;

    this.ambientSource = ctx.createBufferSource();
    this.ambientSource.buffer = noiseBuffer;
    this.ambientSource.loop = true;

    this.ambientFilter = ctx.createBiquadFilter();
    this.ambientFilter.type = "bandpass";
    this.ambientFilter.frequency.value = AUDIO_CONFIG.ambientFilterFreq;
    this.ambientFilter.Q.value = AUDIO_CONFIG.ambientFilterQ;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.00001, ctx.currentTime);
    this.ambientGain.gain.exponentialRampToValueAtTime(AUDIO_CONFIG.ambientGain, ctx.currentTime + 0.5);

    this.ambientSource.connect(this.ambientFilter);
    this.ambientFilter.connect(this.ambientGain);
    this.ambientGain.connect(ctx.destination);

    this.ambientSource.start();
    this.isAmbientPlaying = true;
    this.notify();
    return true;
  }

  playCanSnap() {
    const ctx = this.ensureAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(AUDIO_CONFIG.snapStartFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(AUDIO_CONFIG.snapEndFreq, ctx.currentTime + 0.06);

    oscGain.gain.setValueAtTime(0.12, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.09);

    const noiseBuffer = this.generateNoiseBuffer(0.35);
    if (!noiseBuffer) return;

    const burstSource = ctx.createBufferSource();
    burstSource.buffer = noiseBuffer;

    const burstFilter = ctx.createBiquadFilter();
    burstFilter.type = "highpass";
    burstFilter.frequency.value = AUDIO_CONFIG.burstFilterFreq;

    const burstGain = ctx.createGain();
    burstGain.gain.setValueAtTime(0.08, ctx.currentTime);
    burstGain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.35);

    burstSource.connect(burstFilter);
    burstFilter.connect(burstGain);
    burstGain.connect(ctx.destination);

    burstSource.start();
    burstSource.stop(ctx.currentTime + 0.36);
  }

  getSnapshot() {
    return {
      isAmbientPlaying: this.isAmbientPlaying,
      isInitialized: Boolean(this.audioContext)
    };
  }
}

export { AudioModel };

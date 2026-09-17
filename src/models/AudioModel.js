// AudioModel.js: Real-world acoustic playback and effervescence audio engine. Interfaces with AudioController and AcousticView.

import { AUDIO_CONFIG } from "../config/constants.js";

const FADE_DURATION_MS = 500;

class AudioModel {
  constructor() {
    this.audioContext = null;
    this.canOpenBuffer = null;
    this.sodaFizzBuffer = null;
    this.canOpenRawData = null;
    this.sodaFizzRawData = null;
    this.canOpenPromise = null;
    this.sodaFizzPromise = null;
    this.ambientSource = null;
    this.ambientGain = null;
    this.ambientStopTimer = null;
    this.isAmbientPlaying = false;
    this.subscribers = new Set();
    this.preloadAssets();
  }

  preloadAssets() {
    if (typeof window === "undefined") return;
    fetch(AUDIO_CONFIG.canOpenPath)
      .then((res) => res.arrayBuffer())
      .then((data) => {
        this.canOpenRawData = data;
      })
      .catch(() => {});
    fetch(AUDIO_CONFIG.sodaFizzPath)
      .then((res) => res.arrayBuffer())
      .then((data) => {
        this.sodaFizzRawData = data;
      })
      .catch(() => {});
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

  async loadBuffer(url, rawData) {
    const ctx = this.ensureAudioContext();
    if (!ctx) return null;
    try {
      const data = rawData ? rawData.slice(0) : await fetch(url).then((res) => res.arrayBuffer());
      return await ctx.decodeAudioData(data);
    } catch (_) {
      return null;
    }
  }

  async getCanOpenBuffer() {
    if (this.canOpenBuffer) return this.canOpenBuffer;
    if (!this.canOpenPromise) {
      this.canOpenPromise = this.loadBuffer(AUDIO_CONFIG.canOpenPath, this.canOpenRawData)
        .then((buf) => {
          this.canOpenBuffer = buf;
          return buf;
        });
    }
    return this.canOpenPromise;
  }

  async getSodaFizzBuffer() {
    if (this.sodaFizzBuffer) return this.sodaFizzBuffer;
    if (!this.sodaFizzPromise) {
      this.sodaFizzPromise = this.loadBuffer(AUDIO_CONFIG.sodaFizzPath, this.sodaFizzRawData)
        .then((buf) => {
          this.sodaFizzBuffer = buf;
          return buf;
        });
    }
    return this.sodaFizzPromise;
  }

  async playCanSnap() {
    const ctx = this.ensureAudioContext();
    if (!ctx) return;
    const buffer = await this.getCanOpenBuffer();
    if (!buffer) return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(AUDIO_CONFIG.canOpenGain, ctx.currentTime);
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start(ctx.currentTime);
  }

  async toggleAmbientFizz() {
    const ctx = this.ensureAudioContext();
    if (!ctx) return false;

    if (this.ambientStopTimer) {
      clearTimeout(this.ambientStopTimer);
      this.ambientStopTimer = null;
    }

    if (this.isAmbientPlaying) {
      if (this.ambientGain) {
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, ctx.currentTime);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
        this.ambientStopTimer = setTimeout(() => {
          if (this.ambientSource) {
            try { this.ambientSource.stop(); } catch (_) {}
            this.ambientSource.disconnect();
            this.ambientSource = null;
          }
          this.ambientStopTimer = null;
        }, FADE_DURATION_MS + 50);
      }
      this.isAmbientPlaying = false;
      this.notify();
      return false;
    }

    const buffer = await this.getSodaFizzBuffer();
    if (!buffer) return false;

    if (this.ambientSource) {
      try { this.ambientSource.stop(); } catch (_) {}
      this.ambientSource.disconnect();
      this.ambientSource = null;
    }

    this.ambientSource = ctx.createBufferSource();
    this.ambientSource.buffer = buffer;
    this.ambientSource.loop = true;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.00001, ctx.currentTime);
    this.ambientGain.gain.exponentialRampToValueAtTime(AUDIO_CONFIG.fizzGain, ctx.currentTime + 0.6);

    this.ambientSource.connect(this.ambientGain);
    this.ambientGain.connect(ctx.destination);

    this.ambientSource.start();
    this.isAmbientPlaying = true;
    this.notify();
    return true;
  }

  getSnapshot() {
    return {
      isAmbientPlaying: this.isAmbientPlaying,
      isInitialized: Boolean(this.audioContext)
    };
  }
}

export { AudioModel };

// AcousticView.js: Procedural visualizer and acoustic sensory interface view. Interfaces with AudioModel and AudioController.

import { SELECTORS } from "../config/constants.js";

const PULSE_INTERVAL_MS = 280;

class AcousticView {
  constructor() {
    this.statusBadge = document.querySelector(SELECTORS.resonanceStatus);
    this.waveformBars = document.querySelectorAll(SELECTORS.waveformBars);
    this.ambientBtn = document.querySelector(SELECTORS.toggleAmbientHissBtn);
    this.headerSoundBtn = document.querySelector(SELECTORS.soundSynthesizerBtn);
    this.sampleBtn = document.querySelector(SELECTORS.triggerSampleBtn);
    this.animationTimer = null;
    this.wavePhase = 0;
  }

  bindToggleAmbient(callback) {
    if (this.ambientBtn) {
      this.ambientBtn.addEventListener("click", callback);
    }
    if (this.headerSoundBtn) {
      this.headerSoundBtn.addEventListener("click", callback);
    }
  }

  bindPlaySample(callback) {
    if (this.sampleBtn) {
      this.sampleBtn.addEventListener("click", callback);
    }
  }

  render(snapshot) {
    const isPlaying = snapshot.isAmbientPlaying;
    if (this.statusBadge) {
      this.statusBadge.textContent = isPlaying ? "LIVE RESONANCE: 1,800 HZ ACTIVE" : "CHAMBER MUTED · READY";
      if (isPlaying) {
        this.statusBadge.classList.remove("text-ink-subtle");
        this.statusBadge.classList.add("text-emerald-700");
      } else {
        this.statusBadge.classList.remove("text-emerald-700");
        this.statusBadge.classList.add("text-ink-subtle");
      }
    }

    if (this.ambientBtn) {
      this.ambientBtn.textContent = isPlaying ? "Pause Ambient Resonance" : "Listen to the Micro-Fizz";
    }

    if (this.headerSoundBtn) {
      const dot = this.headerSoundBtn.querySelector(".rounded-full");
      const label = this.headerSoundBtn.querySelector("span:last-child");
      if (dot) {
        if (isPlaying) {
          dot.classList.add("animate-ping", "bg-emerald-600");
          dot.classList.remove("bg-ink-muted");
        } else {
          dot.classList.remove("animate-ping", "bg-emerald-600");
          dot.classList.add("bg-ink-muted");
        }
      }
      if (label) {
        label.textContent = isPlaying ? "SOUND ON" : "SOUND OFF";
      }
    }

    if (isPlaying) {
      this.startWaveformAnimation();
    } else {
      this.stopWaveformAnimation();
    }
  }

  startWaveformAnimation() {
    if (this.animationTimer) return;
    this.animationTimer = setInterval(() => {
      this.wavePhase += 0.4;
      const count = this.waveformBars.length || 1;
      this.waveformBars.forEach((bar, idx) => {
        const sineWave = Math.sin(this.wavePhase + (idx / count) * Math.PI * 2);
        const jitter = (Math.random() * 8) - 4;
        const height = Math.max(8, Math.min(52, Math.floor(26 + (sineWave * 18) + jitter)));
        bar.style.height = `${height}px`;
      });
    }, PULSE_INTERVAL_MS);
  }

  stopWaveformAnimation() {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
    }
    this.waveformBars.forEach(bar => {
      bar.style.height = "16px";
    });
  }
}

export { AcousticView };

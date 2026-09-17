// NavigationProgressView.js: Telemetry progress and viewport staging view coordinator. Interfaces with ScrollModel and ScrollController.

import { SELECTORS } from "../config/constants.js";

const MIN_PROGRESS_PERCENT = 0.5;

class NavigationProgressView {
  constructor() {
    this.progressBar = document.querySelector(SELECTORS.telemetryProgressBar);
    this.masterTrack = document.querySelector(SELECTORS.masterTrack);
    this.hTrack = document.querySelector(SELECTORS.hTrack);
    this.hStepIndicator = document.querySelector(SELECTORS.hStepIndicator);
    this.hPrevBtn = document.querySelector(SELECTORS.hPrevBtn);
    this.hNextBtn = document.querySelector(SELECTORS.hNextBtn);
    this.navJumps = document.querySelectorAll(SELECTORS.navJumps);
    this.headerNavLinks = document.querySelectorAll(SELECTORS.navHeaderLinks);
  }

  bindNavJump(callback) {
    this.navJumps.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const target = e.currentTarget.getAttribute("data-target-sec");
        if (target !== null) {
          const sectionIndex = parseInt(target, 10);
          callback(sectionIndex);
          const targetSection = document.querySelector(`.v-section[data-sec-index="${sectionIndex}"]`);
          if (targetSection && window.innerWidth < 768) {
            targetSection.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });
  }

  bindHorizontalControls(onPrev, onNext) {
    if (this.hPrevBtn) {
      this.hPrevBtn.addEventListener("click", onPrev);
    }
    if (this.hNextBtn) {
      this.hNextBtn.addEventListener("click", onNext);
    }
  }

  render(snapshot) {
    this.renderProgressBar(snapshot.progressRatio);
    this.renderMasterTrack(snapshot.verticalSection, snapshot.isMobile);
    this.renderHorizontalTrack(snapshot.horizontalPanel, snapshot.isMobile);
    this.renderNavIndicators(snapshot.verticalSection);
  }

  renderProgressBar(progressRatio) {
    if (!this.progressBar) return;
    const pct = Math.max(MIN_PROGRESS_PERCENT, progressRatio * 100);
    this.progressBar.style.width = `${pct}%`;
  }

  renderMasterTrack(verticalSection, isMobile) {
    if (!this.masterTrack) return;
    if (isMobile) {
      this.masterTrack.style.transform = "none";
    } else {
      this.masterTrack.style.transform = `translateY(-${verticalSection * 100}%)`;
    }
  }

  renderHorizontalTrack(horizontalPanel, isMobile) {
    if (!this.hTrack) return;
    if (isMobile) {
      this.hTrack.style.transform = "none";
    } else {
      this.hTrack.style.transform = `translateX(-${horizontalPanel * 100}vw)`;
    }

    if (this.hStepIndicator) {
      const stepNumber = String(horizontalPanel + 1).padStart(2, "0");
      this.hStepIndicator.textContent = `STEP ${stepNumber} / 04`;
    }

    if (this.hPrevBtn) {
      if (horizontalPanel === 0) {
        this.hPrevBtn.classList.add("opacity-30", "pointer-events-none");
      } else {
        this.hPrevBtn.classList.remove("opacity-30", "pointer-events-none");
      }
    }

    if (this.hNextBtn) {
      if (horizontalPanel >= 3) {
        this.hNextBtn.classList.add("opacity-30", "pointer-events-none");
      } else {
        this.hNextBtn.classList.remove("opacity-30", "pointer-events-none");
      }
    }
  }

  renderNavIndicators(verticalSection) {
    this.headerNavLinks.forEach(btn => {
      const target = btn.getAttribute("data-target-sec");
      if (target === String(verticalSection)) {
        btn.classList.add("text-ink", "font-semibold");
        btn.classList.remove("text-ink-subtle");
      } else {
        btn.classList.remove("text-ink", "font-semibold");
        btn.classList.add("text-ink-subtle");
      }
    });
  }
}

export { NavigationProgressView };

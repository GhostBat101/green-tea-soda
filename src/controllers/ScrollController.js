// ScrollController.js: Viewport gesture, wheel throttling, and staged scrolljack coordinator. Interfaces with ScrollModel and NavigationProgressView.

import { SCROLL_CONFIG } from "../config/constants.js";

const HORIZONTAL_SECTION_INDEX = 2;

class ScrollController {
  constructor(scrollModel, navigationView) {
    this.scrollModel = scrollModel;
    this.navigationView = navigationView;
    this.init();
  }

  init() {
    this.scrollModel.subscribe((snapshot) => this.navigationView.render(snapshot));
    this.navigationView.bindNavJump((index) => this.scrollModel.setVerticalSection(index));
    this.navigationView.bindHorizontalControls(
      () => {
        if (this.scrollModel.currentHorizontalPanel > 0) {
          this.scrollModel.prevHorizontal();
        } else {
          this.scrollModel.prevVertical();
        }
      },
      () => {
        if (this.scrollModel.currentHorizontalPanel < 3) {
          this.scrollModel.nextHorizontal();
        } else {
          this.scrollModel.nextVertical();
        }
      }
    );

    window.addEventListener("wheel", (e) => this.handleWheel(e), { passive: false });
    window.addEventListener("keydown", (e) => this.handleKeydown(e));
    window.addEventListener("resize", () => this.handleResize());
    window.addEventListener("scroll", () => this.handleScroll(), { passive: true });

    this.navigationView.render(this.scrollModel.getSnapshot());
  }

  handleWheel(e) {
    if (this.scrollModel.isMobile) return;
    const deltaY = e.deltaY;
    const deltaX = e.deltaX;
    const absY = Math.abs(deltaY);
    const absX = Math.abs(deltaX);

    if (absY < SCROLL_CONFIG.wheelThresholdPx && absX < SCROLL_CONFIG.wheelThresholdPx) return;
    e.preventDefault();

    const now = Date.now();
    if (!this.scrollModel.canScroll(now)) return;

    const currentVSec = this.scrollModel.currentVerticalSection;
    const currentHPanel = this.scrollModel.currentHorizontalPanel;

    if (currentVSec === HORIZONTAL_SECTION_INDEX) {
      if (absX > absY && absX >= SCROLL_CONFIG.wheelThresholdPx) {
        if (deltaX > 0 && currentHPanel < 3) {
          this.scrollModel.nextHorizontal();
          this.scrollModel.markScrollTime(now);
          return;
        } else if (deltaX < 0 && currentHPanel > 0) {
          this.scrollModel.prevHorizontal();
          this.scrollModel.markScrollTime(now);
          return;
        } else if (deltaX > 0 && currentHPanel >= 3) {
          this.scrollModel.nextVertical();
          this.scrollModel.markScrollTime(now);
          return;
        } else if (deltaX < 0 && currentHPanel <= 0) {
          this.scrollModel.prevVertical();
          this.scrollModel.markScrollTime(now);
          return;
        }
      }

      if (deltaY > 0) {
        if (currentHPanel < 3) {
          this.scrollModel.nextHorizontal();
          this.scrollModel.markScrollTime(now);
          return;
        } else {
          this.scrollModel.nextVertical();
          this.scrollModel.markScrollTime(now);
          return;
        }
      } else if (deltaY < 0) {
        if (currentHPanel > 0) {
          this.scrollModel.prevHorizontal();
          this.scrollModel.markScrollTime(now);
          return;
        } else {
          this.scrollModel.prevVertical();
          this.scrollModel.markScrollTime(now);
          return;
        }
      }
    }

    if (deltaY > 0) {
      const moved = this.scrollModel.nextVertical();
      if (moved) this.scrollModel.markScrollTime(now);
    } else if (deltaY < 0) {
      const moved = this.scrollModel.prevVertical();
      if (moved) this.scrollModel.markScrollTime(now);
    }
  }

  handleKeydown(e) {
    if (this.scrollModel.isMobile) return;
    const now = Date.now();
    if (!this.scrollModel.canScroll(now)) return;

    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      if (this.scrollModel.currentVerticalSection === HORIZONTAL_SECTION_INDEX && this.scrollModel.currentHorizontalPanel < 3) {
        this.scrollModel.nextHorizontal();
      } else {
        this.scrollModel.nextVertical();
      }
      this.scrollModel.markScrollTime(now);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      if (this.scrollModel.currentVerticalSection === HORIZONTAL_SECTION_INDEX && this.scrollModel.currentHorizontalPanel > 0) {
        this.scrollModel.prevHorizontal();
      } else {
        this.scrollModel.prevVertical();
      }
      this.scrollModel.markScrollTime(now);
    } else if (e.key === "ArrowRight") {
      if (this.scrollModel.currentVerticalSection === HORIZONTAL_SECTION_INDEX) {
        e.preventDefault();
        this.scrollModel.nextHorizontal();
        this.scrollModel.markScrollTime(now);
      }
    } else if (e.key === "ArrowLeft") {
      if (this.scrollModel.currentVerticalSection === HORIZONTAL_SECTION_INDEX) {
        e.preventDefault();
        this.scrollModel.prevHorizontal();
        this.scrollModel.markScrollTime(now);
      }
    }
  }

  handleResize() {
    this.scrollModel.setViewportWidth(window.innerWidth);
    this.scrollModel.calculateProgress();
    this.scrollModel.notify();
  }

  handleScroll() {
    if (!this.scrollModel.isMobile) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const totalScrollable = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    const ratio = Math.max(0, Math.min(1, scrollY / totalScrollable));
    this.scrollModel.setNativeMobileScrollProgress(ratio);
  }
}

export { ScrollController };

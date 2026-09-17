// ScrollModel.js: Viewport navigation and narrative progression state manager. Interfaces with ScrollController and NavigationProgressView.

import { SCROLL_CONFIG, SECTIONS } from "../config/constants.js";

const TOTAL_VERTICAL_SECTIONS = SECTIONS.length;
const TOTAL_HORIZONTAL_PANELS = 4;

class ScrollModel {
  constructor() {
    this.currentVerticalSection = 0;
    this.currentHorizontalPanel = 0;
    this.isMobile = typeof window !== "undefined" ? window.innerWidth < SCROLL_CONFIG.mobileBreakpointPx : false;
    this.lastScrollTime = 0;
    this.progressRatio = 0;
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

  setViewportWidth(width) {
    const nextIsMobile = width < SCROLL_CONFIG.mobileBreakpointPx;
    if (this.isMobile !== nextIsMobile) {
      this.isMobile = nextIsMobile;
      this.notify();
    }
  }

  canScroll(now) {
    return (now - this.lastScrollTime) >= SCROLL_CONFIG.wheelThrottleMs;
  }

  markScrollTime(now) {
    this.lastScrollTime = now;
  }

  setVerticalSection(index) {
    const bounded = Math.max(0, Math.min(index, TOTAL_VERTICAL_SECTIONS - 1));
    if (this.currentVerticalSection !== bounded) {
      this.currentVerticalSection = bounded;
      this.calculateProgress();
      this.notify();
    }
  }

  setHorizontalPanel(index) {
    const bounded = Math.max(0, Math.min(index, TOTAL_HORIZONTAL_PANELS - 1));
    if (this.currentHorizontalPanel !== bounded) {
      this.currentHorizontalPanel = bounded;
      this.calculateProgress();
      this.notify();
    }
  }

  nextVertical() {
    if (this.currentVerticalSection < TOTAL_VERTICAL_SECTIONS - 1) {
      this.setVerticalSection(this.currentVerticalSection + 1);
      return true;
    }
    return false;
  }

  prevVertical() {
    if (this.currentVerticalSection > 0) {
      this.setVerticalSection(this.currentVerticalSection - 1);
      return true;
    }
    return false;
  }

  nextHorizontal() {
    if (this.currentHorizontalPanel < TOTAL_HORIZONTAL_PANELS - 1) {
      this.setHorizontalPanel(this.currentHorizontalPanel + 1);
      return true;
    }
    return false;
  }

  prevHorizontal() {
    if (this.currentHorizontalPanel > 0) {
      this.setHorizontalPanel(this.currentHorizontalPanel - 1);
      return true;
    }
    return false;
  }

  calculateProgress() {
    if (this.isMobile && typeof window !== "undefined") {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const totalScrollable = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      this.progressRatio = Math.max(0, Math.min(1, scrollY / totalScrollable));
    } else {
      const baseRatio = this.currentVerticalSection / (TOTAL_VERTICAL_SECTIONS - 1);
      if (this.currentVerticalSection === 2) {
        const subRatio = this.currentHorizontalPanel / (TOTAL_HORIZONTAL_PANELS - 1);
        const sectionSlice = 1 / (TOTAL_VERTICAL_SECTIONS - 1);
        this.progressRatio = Math.max(0, Math.min(1, (2 * sectionSlice) + (subRatio * sectionSlice * 0.8)));
      } else {
        this.progressRatio = Math.max(0, Math.min(1, baseRatio));
      }
    }
  }

  setNativeMobileScrollProgress(ratio) {
    this.progressRatio = Math.max(0, Math.min(1, ratio));
    this.notify();
  }

  getSnapshot() {
    return {
      verticalSection: this.currentVerticalSection,
      horizontalPanel: this.currentHorizontalPanel,
      isMobile: this.isMobile,
      progressRatio: this.progressRatio,
      totalVerticalSections: TOTAL_VERTICAL_SECTIONS,
      totalHorizontalPanels: TOTAL_HORIZONTAL_PANELS
    };
  }
}

export { ScrollModel };

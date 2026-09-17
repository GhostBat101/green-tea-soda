// HeroTiltView.js: 3D perspective tilt physics and parallax plinth view. Interfaces with AppController and Hero section.

import { SELECTORS } from "../config/constants.js";

const MAX_TILT_DEGREES = 10;
const PARALLAX_SCALE = 1.02;

class HeroTiltView {
  constructor() {
    this.card = document.querySelector(SELECTORS.heroTiltCard);
    this.img = document.querySelector(SELECTORS.specimenImg);
    this.init();
  }

  init() {
    if (!this.card) return;

    this.card.addEventListener("mousemove", (e) => {
      const rect = this.card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xRatio = (x / rect.width) * 2 - 1;
      const yRatio = (y / rect.height) * 2 - 1;
      const rotX = -yRatio * MAX_TILT_DEGREES;
      const rotY = xRatio * MAX_TILT_DEGREES;

      this.card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      if (this.img) {
        this.img.style.transform = `scale(${PARALLAX_SCALE}) translate(${(rotY * 0.5).toFixed(1)}px, ${(-rotX * 0.5).toFixed(1)}px)`;
      }
    });

    this.card.addEventListener("mouseleave", () => {
      this.card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      if (this.img) {
        this.img.style.transform = "scale(1) translate(0px, 0px)";
      }
    });
  }
}

export { HeroTiltView };

// BubbleCanvasView.js: Ambient background micro-bubbles generative canvas effect. Interfaces with requestAnimationFrame and master viewport.

import { SELECTORS } from "../config/constants.js";

const BUBBLE_COUNT = 32;

class BubbleCanvasView {
  constructor() {
    this.canvas = document.querySelector(SELECTORS.bubbleCanvas);
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.bubbles = [];
    this.animationId = null;
    this.width = 0;
    this.height = 0;
    this.init();
  }

  init() {
    if (!this.canvas || !this.ctx) return;
    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.spawnBubbles();
    this.startLoop();
  }

  resize() {
    if (!this.canvas || !this.ctx) return;
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  spawnBubbles() {
    this.bubbles = [];
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      this.bubbles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: (Math.random() * 2) + 0.8,
        speedY: (Math.random() * 0.45) + 0.15,
        speedX: (Math.random() * 0.2) - 0.1,
        alpha: (Math.random() * 0.25) + 0.08
      });
    }
  }

  startLoop() {
    const loop = () => {
      this.render();
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }

  stopLoop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  render() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.bubbles.length; i++) {
      const b = this.bubbles[i];
      b.y -= b.speedY;
      b.x += b.speedX;

      if (b.y < -10) {
        b.y = this.height + 10;
        b.x = Math.random() * this.width;
      }
      if (b.x < 0) b.x = this.width;
      if (b.x > this.width) b.x = 0;

      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(28, 54, 32, ${b.alpha})`;
      this.ctx.fill();
    }
  }
}

export { BubbleCanvasView };

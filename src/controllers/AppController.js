// AppController.js: Application lifecycle orchestrator and MVC bootstrapper. Interfaces with all models, views, and controllers.

import { SELECTORS } from "../config/constants.js";
import { CartModel } from "../models/CartModel.js";
import { ScrollModel } from "../models/ScrollModel.js";
import { AudioModel } from "../models/AudioModel.js";
import { CartDrawerView } from "../views/CartDrawerView.js";
import { AcousticView } from "../views/AcousticView.js";
import { BubbleCanvasView } from "../views/BubbleCanvasView.js";
import { NavigationProgressView } from "../views/NavigationProgressView.js";
import { ScrollController } from "./ScrollController.js";

const MAX_TILT_DEGREES = 10;
const PARALLAX_SCALE = 1.02;

class AppController {
  constructor() {
    this.cartModel = new CartModel();
    this.scrollModel = new ScrollModel();
    this.audioModel = new AudioModel();

    this.cartView = new CartDrawerView();
    this.acousticView = new AcousticView();
    this.bubbleView = new BubbleCanvasView();
    this.navigationView = new NavigationProgressView();

    this.scrollController = new ScrollController(this.scrollModel, this.navigationView);

    this.initCart();
    this.initAudio();
    this.initTilt();
    this.initOrderQuantities();
  }

  initCart() {
    this.cartModel.subscribe((snapshot) => this.cartView.render(snapshot));
    this.cartView.bindQuantityChange((id, delta) => this.cartModel.updateQuantity(id, delta));
    this.cartView.bindRemoveItem((id) => this.cartModel.removeItem(id));
    this.cartView.render(this.cartModel.getSnapshot());

    const add12Btn = document.querySelector(SELECTORS.add12Btn);
    const add24Btn = document.querySelector(SELECTORS.add24Btn);
    const qty12Input = document.querySelector(SELECTORS.qty12Input);
    const qty24Input = document.querySelector(SELECTORS.qty24Input);

    if (add12Btn) {
      add12Btn.addEventListener("click", () => {
        const qty = qty12Input ? parseInt(qty12Input.value, 10) || 1 : 1;
        this.cartModel.addItem("batch-12", qty);
        this.cartView.open();
      });
    }

    if (add24Btn) {
      add24Btn.addEventListener("click", () => {
        const qty = qty24Input ? parseInt(qty24Input.value, 10) || 1 : 1;
        this.cartModel.addItem("case-24", qty);
        this.cartView.open();
      });
    }
  }

  initOrderQuantities() {
    this.bindStepper(SELECTORS.qty12Minus, SELECTORS.qty12Plus, SELECTORS.qty12Input);
    this.bindStepper(SELECTORS.qty24Minus, SELECTORS.qty24Plus, SELECTORS.qty24Input);
  }

  bindStepper(minusSel, plusSel, inputSel) {
    const minus = document.querySelector(minusSel);
    const plus = document.querySelector(plusSel);
    const input = document.querySelector(inputSel);
    if (!input) return;

    if (minus) {
      minus.addEventListener("click", () => {
        const val = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
        input.value = val;
      });
    }

    if (plus) {
      plus.addEventListener("click", () => {
        const val = Math.min(99, (parseInt(input.value, 10) || 1) + 1);
        input.value = val;
      });
    }
  }

  initAudio() {
    this.audioModel.subscribe((snapshot) => this.acousticView.render(snapshot));
    this.acousticView.bindToggleAmbient(() => this.audioModel.toggleAmbientFizz());
    this.acousticView.bindPlaySample(() => this.audioModel.playCanSnap());
    this.acousticView.render(this.audioModel.getSnapshot());
  }

  initTilt() {
    const card = document.querySelector(SELECTORS.heroTiltCard);
    const img = document.querySelector(SELECTORS.specimenImg);
    if (!card) return;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xRatio = (x / rect.width) * 2 - 1;
      const yRatio = (y / rect.height) * 2 - 1;
      const rotX = -yRatio * MAX_TILT_DEGREES;
      const rotY = xRatio * MAX_TILT_DEGREES;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      if (img) {
        img.style.transform = `scale(${PARALLAX_SCALE}) translate(${(rotY * 0.5).toFixed(1)}px, ${(-rotX * 0.5).toFixed(1)}px)`;
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      if (img) {
        img.style.transform = "scale(1) translate(0px, 0px)";
      }
    });
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => new AppController());
  } else {
    new AppController();
  }
}

export { AppController };

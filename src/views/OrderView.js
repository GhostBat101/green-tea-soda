// OrderView.js: Product tier allocation controls and stepper interaction view. Interfaces with CartModel and AppController.

import { SELECTORS } from "../config/constants.js";

const MIN_ORDER_QTY = 1;
const MAX_ORDER_QTY = 99;

class OrderView {
  constructor() {
    this.add12Btn = document.querySelector(SELECTORS.add12Btn);
    this.add24Btn = document.querySelector(SELECTORS.add24Btn);
    this.qty12Input = document.querySelector(SELECTORS.qty12Input);
    this.qty24Input = document.querySelector(SELECTORS.qty24Input);
    this.qty12Minus = document.querySelector(SELECTORS.qty12Minus);
    this.qty12Plus = document.querySelector(SELECTORS.qty12Plus);
    this.qty24Minus = document.querySelector(SELECTORS.qty24Minus);
    this.qty24Plus = document.querySelector(SELECTORS.qty24Plus);
    this.onAddCallback = null;
    this.initSteppers();
  }

  initSteppers() {
    this.wireStepper(this.qty12Minus, this.qty12Plus, this.qty12Input);
    this.wireStepper(this.qty24Minus, this.qty24Plus, this.qty24Input);
  }

  wireStepper(minusBtn, plusBtn, inputEl) {
    if (!inputEl) return;
    if (minusBtn) {
      minusBtn.addEventListener("click", () => {
        const val = Math.max(MIN_ORDER_QTY, (parseInt(inputEl.value, 10) || 1) - 1);
        inputEl.value = val;
      });
    }
    if (plusBtn) {
      plusBtn.addEventListener("click", () => {
        const val = Math.min(MAX_ORDER_QTY, (parseInt(inputEl.value, 10) || 1) + 1);
        inputEl.value = val;
      });
    }
  }

  bindAddAllocation(callback) {
    this.onAddCallback = callback;
    if (this.add12Btn) {
      this.add12Btn.addEventListener("click", () => {
        const qty = this.qty12Input ? parseInt(this.qty12Input.value, 10) || 1 : 1;
        if (this.onAddCallback) this.onAddCallback("batch-12", qty);
      });
    }
    if (this.add24Btn) {
      this.add24Btn.addEventListener("click", () => {
        const qty = this.qty24Input ? parseInt(this.qty24Input.value, 10) || 1 : 1;
        if (this.onAddCallback) this.onAddCallback("case-24", qty);
      });
    }
  }
}

export { OrderView };

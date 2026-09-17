// CartModel.js: Reactive shopping cart state and calculation engine. Interfaces with ProductModel and CartDrawerView.

import { PRODUCTS } from "../config/constants.js";

const DEFAULT_SHIPPING_FEE = 8;
const FREE_SHIPPING_THRESHOLD = 68;

class CartModel {
  constructor() {
    this.items = {
      "batch-12": {
        ...PRODUCTS.batch12,
        quantity: 1
      },
      "case-24": {
        ...PRODUCTS.case24,
        quantity: 1
      }
    };
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

  addItem(productId, amount = 1) {
    if (amount <= 0) return;
    if (this.items[productId]) {
      this.items[productId].quantity += amount;
    } else {
      const match = Object.values(PRODUCTS).find(p => p.id === productId);
      if (!match) return;
      this.items[productId] = {
        ...match,
        quantity: amount
      };
    }
    this.notify();
  }

  updateQuantity(productId, amount) {
    if (!this.items[productId]) return;
    const nextQty = Math.max(0, this.items[productId].quantity + amount);
    if (nextQty === 0) {
      delete this.items[productId];
    } else {
      this.items[productId].quantity = nextQty;
    }
    this.notify();
  }

  removeItem(productId) {
    if (this.items[productId]) {
      delete this.items[productId];
      this.notify();
    }
  }

  getItemCount() {
    return Object.values(this.items).reduce((acc, item) => acc + item.quantity, 0);
  }

  getSubtotal() {
    return Object.values(this.items).reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  }

  getShippingFee() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    const has24Case = Boolean(this.items["case-24"] && this.items["case-24"].quantity > 0);
    if (has24Case || subtotal >= FREE_SHIPPING_THRESHOLD) {
      return 0;
    }
    return DEFAULT_SHIPPING_FEE;
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal + this.getShippingFee();
  }

  getSnapshot() {
    return {
      items: Object.values(this.items).map(item => ({ ...item })),
      itemCount: this.getItemCount(),
      subtotal: this.getSubtotal(),
      shipping: this.getShippingFee(),
      total: this.getTotal()
    };
  }
}

export { CartModel };

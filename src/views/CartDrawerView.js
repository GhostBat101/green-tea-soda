// CartDrawerView.js: Slide-out cart drawer and dynamic order reconciliation view. Interfaces with CartModel and CartController.

import { SELECTORS } from "../config/constants.js";

class CartDrawerView {
  constructor() {
    this.drawer = document.querySelector(SELECTORS.cartDrawer);
    this.backdrop = document.querySelector(SELECTORS.drawerBackdrop);
    this.closeBtn = document.querySelector(SELECTORS.drawerCloseBtn);
    this.trigger = document.querySelector(SELECTORS.cartDrawerTrigger);
    this.countBadge = document.querySelector(SELECTORS.cartCountBadge);
    this.itemsContainer = document.querySelector(SELECTORS.drawerItemsContainer);
    this.subtotalEl = document.querySelector(SELECTORS.drawerSubtotal);
    this.shippingEl = document.querySelector(SELECTORS.drawerShipping);
    this.totalEl = document.querySelector(SELECTORS.drawerTotal);
    this.checkoutBtn = document.querySelector(SELECTORS.proceedCheckoutBtn);
    this.isOpen = false;
    this.onQuantityChangeCallback = null;
    this.onRemoveCallback = null;
    this.initEventListeners();
  }

  initEventListeners() {
    if (this.trigger) {
      this.trigger.addEventListener("click", () => this.open());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }
    if (this.backdrop) {
      this.backdrop.addEventListener("click", () => this.close());
    }
    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener("click", () => {
        const originalText = this.checkoutBtn.textContent;
        this.checkoutBtn.textContent = "ALLOCATION CONFIRMED · BATCH 001";
        this.checkoutBtn.classList.add("bg-accent");
        setTimeout(() => {
          this.checkoutBtn.textContent = originalText;
          this.checkoutBtn.classList.remove("bg-accent");
        }, 2000);
      });
    }
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });
  }

  bindQuantityChange(callback) {
    this.onQuantityChangeCallback = callback;
  }

  bindRemoveItem(callback) {
    this.onRemoveCallback = callback;
  }

  open() {
    if (!this.drawer || !this.backdrop) return;
    this.isOpen = true;
    this.drawer.classList.remove("translate-y-full", "md:translate-x-full");
    this.drawer.classList.add("translate-y-0", "md:translate-x-0");
    this.backdrop.classList.remove("opacity-0", "pointer-events-none");
    this.backdrop.classList.add("opacity-100");
  }

  close() {
    if (!this.drawer || !this.backdrop) return;
    this.isOpen = false;
    this.drawer.classList.remove("translate-y-0", "md:translate-x-0");
    this.drawer.classList.add("translate-y-full", "md:translate-x-full");
    this.backdrop.classList.remove("opacity-100");
    this.backdrop.classList.add("opacity-0", "pointer-events-none");
  }

  render(snapshot) {
    if (this.countBadge) {
      this.countBadge.textContent = `(${snapshot.itemCount})`;
    }
    if (this.subtotalEl) {
      this.subtotalEl.textContent = `$${snapshot.subtotal.toFixed(2)}`;
    }
    if (this.shippingEl) {
      this.shippingEl.textContent = snapshot.shipping === 0 ? "FREE" : `$${snapshot.shipping.toFixed(2)}`;
    }
    if (this.totalEl) {
      this.totalEl.textContent = `$${snapshot.total.toFixed(2)}`;
    }
    if (this.itemsContainer) {
      this.renderItems(snapshot.items);
    }
  }

  renderItems(items) {
    if (!this.itemsContainer) return;
    if (items.length === 0) {
      this.itemsContainer.innerHTML = `
        <div class="py-12 text-center text-ink-subtle font-mono text-xs">
          Your allocation batch is empty.
        </div>
      `;
      return;
    }

    this.itemsContainer.innerHTML = items.map(item => `
      <div class="flex items-center justify-between py-4 border-b border-lichen/60" data-item-id="${item.id}">
        <div class="space-y-1">
          <h4 class="font-normal text-ink text-sm">${item.title}</h4>
          <p class="font-mono text-[11px] text-ink-subtle">${item.unitSize} · $${item.unitPrice} each</p>
        </div>
        <div class="flex items-center space-x-3">
          <div class="flex items-center border border-lichen rounded-lg overflow-hidden bg-white/70">
            <button class="cart-qty-btn px-2.5 py-1 text-xs text-ink hover:bg-celadon transition-colors" data-action="dec" data-id="${item.id}">-</button>
            <span class="px-2 font-mono text-xs font-medium text-ink min-w-[1.5rem] text-center">${item.quantity}</span>
            <button class="cart-qty-btn px-2.5 py-1 text-xs text-ink hover:bg-celadon transition-colors" data-action="inc" data-id="${item.id}">+</button>
          </div>
          <button class="cart-remove-btn text-ink-subtle hover:text-ink transition-colors p-1" data-id="${item.id}" aria-label="Remove item">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>
    `).join("");

    const buttons = this.itemsContainer.querySelectorAll(".cart-qty-btn");
    for (const btn of buttons) {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        const action = e.currentTarget.getAttribute("data-action");
        const delta = action === "inc" ? 1 : -1;
        if (this.onQuantityChangeCallback) {
          this.onQuantityChangeCallback(id, delta);
        }
      });
    }

    const removeBtns = this.itemsContainer.querySelectorAll(".cart-remove-btn");
    for (const btn of removeBtns) {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        if (this.onRemoveCallback) {
          this.onRemoveCallback(id);
        }
      });
    }
  }
}

export { CartDrawerView };

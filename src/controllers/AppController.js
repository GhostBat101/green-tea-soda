// AppController.js: Application lifecycle orchestrator and MVC bootstrapper. Interfaces with all models, views, and controllers.

import { CartModel } from "../models/CartModel.js";
import { ScrollModel } from "../models/ScrollModel.js";
import { AudioModel } from "../models/AudioModel.js";
import { CartDrawerView } from "../views/CartDrawerView.js";
import { AcousticView } from "../views/AcousticView.js";
import { BubbleCanvasView } from "../views/BubbleCanvasView.js";
import { NavigationProgressView } from "../views/NavigationProgressView.js";
import { HeroTiltView } from "../views/HeroTiltView.js";
import { OrderView } from "../views/OrderView.js";
import { ScrollController } from "./ScrollController.js";

class AppController {
  constructor() {
    this.cartModel = new CartModel();
    this.scrollModel = new ScrollModel();
    this.audioModel = new AudioModel();

    this.cartView = new CartDrawerView();
    this.acousticView = new AcousticView();
    this.bubbleView = new BubbleCanvasView();
    this.navigationView = new NavigationProgressView();
    this.heroTiltView = new HeroTiltView();
    this.orderView = new OrderView();

    this.scrollController = new ScrollController(this.scrollModel, this.navigationView);

    this.initCart();
    this.initAudio();
    this.initOrder();
  }

  initCart() {
    this.cartModel.subscribe((snapshot) => this.cartView.render(snapshot));
    this.cartView.bindQuantityChange((id, delta) => this.cartModel.updateQuantity(id, delta));
    this.cartView.bindRemoveItem((id) => this.cartModel.removeItem(id));
    this.cartView.render(this.cartModel.getSnapshot());
  }

  initAudio() {
    this.audioModel.subscribe((snapshot) => this.acousticView.render(snapshot));
    this.acousticView.bindToggleAmbient(() => this.audioModel.toggleAmbientFizz());
    this.acousticView.bindPlaySample(() => this.audioModel.playCanSnap());
    this.acousticView.render(this.audioModel.getSnapshot());
  }

  initOrder() {
    this.orderView.bindAddAllocation((productId, qty) => {
      this.cartModel.addItem(productId, qty);
      this.cartView.open();
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


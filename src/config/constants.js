// constants.js: Canonical system configuration and selectors. Interfaces with all models, views, and controllers.

const SELECTORS = {
  masterTrack: "#master-track",
  telemetryProgressBar: "#telemetry-progress-bar",
  navHeaderLinks: "header nav .nav-header-link",
  navJumps: ".nav-jump",
  soundSynthesizerBtn: "#sound-synthesizer-btn",
  cartDrawerTrigger: "#cart-drawer-trigger",
  cartCountBadge: "#cart-count",
  cartDrawer: "#cart-drawer",
  drawerBackdrop: "#drawer-backdrop",
  drawerCloseBtn: "#drawer-close-btn",
  drawerItemsContainer: "#drawer-items-container",
  drawerSubtotal: "#drawer-subtotal",
  drawerShipping: "#drawer-shipping",
  drawerTotal: "#drawer-total",
  proceedCheckoutBtn: "#proceed-checkout-btn",
  heroTiltCard: "#hero-tilt-card",
  specimenImg: "#specimen-img",
  hTrack: "#h-track",
  hPrevBtn: "#h-prev-btn",
  hNextBtn: "#h-next-btn",
  hStepIndicator: "#h-step-indicator",
  triggerSampleBtn: "#trigger-sample-btn",
  toggleAmbientHissBtn: "#toggle-ambient-hiss-btn",
  resonanceStatus: "#resonance-status",
  waveformBars: ".waveform-bar",
  bubbleCanvas: "#bubble-canvas",
  qty12Input: "#qty-12",
  qty24Input: "#qty-24",
  qty12Minus: "#qty-12-minus",
  qty12Plus: "#qty-12-plus",
  qty24Minus: "#qty-24-minus",
  qty24Plus: "#qty-24-plus",
  add12Btn: "#add-12-btn",
  add24Btn: "#add-24-btn"
};

const SECTIONS = [
  { index: 0, id: "drink", label: "The Drink" },
  { index: 1, id: "inside", label: "What's Inside" },
  { index: 2, id: "process", label: "How It's Made" },
  { index: 3, id: "acoustic", label: "Why It Matters" },
  { index: 4, id: "proof", label: "The Proof" },
  { index: 5, id: "order", label: "Order" },
  { index: 6, id: "colophon", label: "Colophon" }
];

const PRODUCTS = {
  batch12: {
    id: "batch-12",
    title: "12-Can Tasting Batch",
    unitPrice: 38,
    unitSize: "12 x 330ml",
    subtext: "Batch 001 · First Harvest Uji"
  },
  case24: {
    id: "case-24",
    title: "24-Can Cellar Case",
    unitPrice: 68,
    unitSize: "24 x 330ml",
    subtext: "Batch 001 · Complimentary Cold Shipping"
  }
};

const AUDIO_CONFIG = {
  ambientFilterFreq: 3200,
  ambientFilterQ: 2.0,
  ambientGain: 0.025,
  snapStartFreq: 700,
  snapEndFreq: 110,
  burstFilterFreq: 2700,
  noiseDuration: 2.0
};

const SCROLL_CONFIG = {
  wheelThrottleMs: 750,
  wheelThresholdPx: 25,
  transitionDurationMs: 950,
  mobileBreakpointPx: 768
};

export {
  SELECTORS,
  SECTIONS,
  PRODUCTS,
  AUDIO_CONFIG,
  SCROLL_CONFIG
};

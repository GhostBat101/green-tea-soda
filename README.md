# Green Tea Soda — Batch 001

> **Live Deployment:** [https://ghostbat101.github.io/green-tea-soda/](https://ghostbat101.github.io/green-tea-soda/)

A bespoke, editorial digital launch experience for **Green Tea Soda** — cold-brewed single-origin shade tea from Uji, Japan, blended with real garden mint and soft micro-carbonation.

---

## 🍵 Live Digital Experience
- **Production URL:** [https://ghostbat101.github.io/green-tea-soda/](https://ghostbat101.github.io/green-tea-soda/)
- **Repository:** [https://github.com/GhostBat101/green-tea-soda](https://github.com/GhostBat101/green-tea-soda)
- **Stitch Project ID:** `5771049770762366211`

---

## 🏛️ Architecture & Clean MVC Design
Built with zero external runtime UI frameworks, leveraging the native modern web platform, Tailwind CSS, and a decoupled Model-View-Controller pattern:

```
Green Tea Soda Launch/
├── index.html                           # Semantic semantic entry markup & Tailwind config
├── images/                              # High-resolution photographic assets & specimen renders
│   ├── specimen_can.jpg
│   ├── green_tea_pour.jpg
│   ├── deconstructed_botanical.jpg
│   ├── bubbles_pour_microfizz.jpg
│   └── chapter_three_2pm_reset.jpg
└── src/
    ├── config/
    │   └── constants.js                 # Centralized configuration, selectors, and product schemas
    ├── models/
    │   ├── CartModel.js                 # Headless cart state, allocation math & pub-sub store
    │   ├── ScrollModel.js               # Viewport indices, horizontal panel tracking & progress
    │   └── AudioModel.js                # Procedural Web Audio API sound generator
    ├── views/
    │   ├── CartDrawerView.js            # Slide-out drawer, reconciliation, and quantity controls
    │   ├── AcousticView.js              # Live resonance visualizer & waveform frequency pulses
    │   ├── BubbleCanvasView.js          # Ambient 2D micro-bubble generative canvas simulation
    │   ├── NavigationProgressView.js    # Staged viewport translation & telemetry progress bar
    │   ├── HeroTiltView.js              # 3D card tilt physics and parallax depth
    │   └── OrderView.js                 # Stepper inputs and tier allocation triggers
    └── controllers/
        ├── ScrollController.js          # Wheel throttling, horizontal bridging & mobile unbinding
        └── AppController.js             # MVC lifecycle orchestrator and bootstrapper
```

---

## ✨ Sensory & Interactive Engineering
1. **Procedural Web Audio Engine**: Generates real-time ambient carbonation hiss at 3,200 Hz with bandpass Q-filtering and realistic acoustic can crack transients using pure Web Audio synthesis.
2. **3D Tactile Plinth**: Interactive mouse-tracking card physics with perspective tilt and responsive parallax image translation.
3. **Adaptive Viewport Navigation**: Desktop wheel gesture throttling (750ms / 25px threshold) with horizontal staging through Section 2's brewing process before resuming vertical descent. Automatically unbinds on mobile (<768px) into native document flow with CSS scroll-snap.
4. **Reactive Allocation Cart**: Real-time batch allocation with tiered quantities, cold-chain packaging notes, dynamic fee reconciliation (complimentary shipping on cases), and responsive sliding drawer.
5. **Generative Micro-Fizz Canvas**: DPR-calibrated 2D canvas simulation rendering ascending micro-bubbles with soft alpha transparency.

---

## 📐 Governance & Code Craft Standards
This project was constructed under the strict architectural discipline of [`GEMINI.md`](GEMINI.md):
* **Zero-Comment Policy**: Absolute prohibition of inline, block, or trailing comments in code bodies. Every file contains exclusively a 1–2 line descriptive header at line 1.
* **Top-Down Variable Consolidation**: Strict file organization flowing from imports, consolidated configuration/DOM references at the top, followed by classes and logic, and exports at the bottom.
* **One Commit Per File**: Every single file modification is reviewed and committed individually to git.
* **Adversarial Audit Score**: Independently verified by an adversarial auditor subagent with a quantitative deployment score of **98 / 100**.

---

## 📜 License
© 2026 Green Tea Soda. Kyoto · Uji · Pacific NW. All rights reserved.

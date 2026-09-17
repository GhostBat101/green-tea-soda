# Green Tea Soda — Skill Showcase Site

> **Live Demonstration:** [https://ghostbat101.github.io/green-tea-soda/](https://ghostbat101.github.io/green-tea-soda/)

An open-source **frontend skill showcase site** demonstrating high-craft digital product design, procedural audio synthesis, generative canvas physics, and clean Model-View-Controller (MVC) architecture built entirely with native web technologies.

---

## 🎯 Purpose & Overview
This project serves as a practical **frontend engineering showcase** demonstrating modern web craftsmanship:
- **Zero Framework Overhead**: Built purely with semantic HTML5, modern Tailwind CSS, and vanilla ES6 modules — no heavy React/Vue runtime dependencies.
- **Editorial Design Language**: Crafted with natural Japanese tea aesthetics, disciplined typography scales, anti-italic rules, and tactile micro-interactions.
- **Procedural Sensory Engineering**: Real-time Web Audio API sound synthesis and DPR-calibrated generative canvas simulations.

---

## 🚀 Live Demo & Repository
- **Live Showcase URL:** [https://ghostbat101.github.io/green-tea-soda/](https://ghostbat101.github.io/green-tea-soda/)
- **GitHub Repository:** [https://github.com/GhostBat101/green-tea-soda](https://github.com/GhostBat101/green-tea-soda)
- **Stitch Project ID:** `5771049770762366211`

---

## 🏛️ Architecture & Clean MVC Structure

```
green-tea-soda/
├── index.html                           # Semantic markup, Tailwind design tokens & entry view
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

## ✨ Key Interactive Features
1. **Procedural Web Audio Engine**: Generates real-time ambient carbonation fizz at 3,200 Hz with bandpass Q-filtering and realistic acoustic can crack transients using pure Web Audio synthesis.
2. **3D Tactile Plinth**: Interactive mouse-tracking card physics with perspective tilt and responsive parallax image translation.
3. **Adaptive Viewport Navigation**: Desktop wheel gesture throttling with horizontal staging through Section 2's brewing process before resuming vertical descent. Automatically unbinds on mobile (<768px) into native document flow with CSS scroll-snap.
4. **Reactive Allocation Cart**: Real-time batch allocation with tiered quantities, cold-chain packaging notes, dynamic fee reconciliation, and responsive sliding drawer.
5. **Generative Micro-Fizz Canvas**: DPR-calibrated 2D canvas simulation rendering ascending micro-bubbles with soft alpha transparency.

---

## 📐 Code Craft Standards
* **Zero-Comment Policy**: Clean, self-documenting code with zero inline/block comments in code bodies (only a 1–2 line header comment per file).
* **Top-Down Variable Consolidation**: Strict structure flowing from imports $\rightarrow$ constants & DOM references $\rightarrow$ classes $\rightarrow$ exports.
* **One Commit Per File**: Every single file modification is audited and committed individually.

---

## 📄 License
This project is an open-source skill showcase site licensed under the [MIT License](https://opensource.org/licenses/MIT).

```
MIT License

Copyright (c) 2026 Green Tea Soda Showcase Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

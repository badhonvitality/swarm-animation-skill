---
name: swarm-animation
description: Reusable AI agent skill for React swarm animations, autonomous cursor behavior, mouse tracking, particle physics, Canvas rendering and interactive agent cursor systems.
triggers:
  - swarm animation
  - multi-agent cursor
  - flocking cursors
  - boids simulation react
  - collaborative canvas simulation
  - autonomous cursor
  - figma cursor animation
  - particle swarm react
  - mouse following cursors
---

# Swarm Animation Skill

## 1. Purpose & Capabilities

The **swarm-animation** skill enables AI coding agents and frontend engineers to implement, configure, and orchestrate high-performance multi-agent cursor simulations in React. Autonomous agent cursors exhibit realistic flocking behavior, orbit user inputs or Lissajous focal trajectories, deflect organically around the user pointer, and collaboratively draft and typeset canvas documents in real time.

### Core Capabilities:
- **Autonomous Multi-Agent Cursors**: 9 collaborative Figma-style SVG cursor shapes (`arrow`, `dup`, `pen`, `pen-add`, `pen-close`, `cross`, `ibeam`, `ew`, `ns`), velocity heading rotation, and click-depression scaling.
- **Boids Flocking & Physics**: Newtonian mechanics with harmonic orbital breathing, alternating tangential swirl, curl-noise perturbations, and 90px neighbor velocity alignment.
- **Elastic Mouse Deflection**: 48px repulsion circle with momentum transfer, $1.6\times$ restitution coefficient, and $260\text{px/s}$ outward impulse.
- **Hybrid 3-Layer Canvas**: Offscreen Canvas 2D context for subpixel text metrics, SVG for vector drafting, and DOM for styled elements.
- **Collaborative Task Engine**: ES6 generator coroutines executing path drawing, rectangle drafting, character-by-character typing with blinking carets, guide dragging, and Option-drag element duplication.

---

## 2. When to Use This Skill

- Building multi-agent collaborative landing pages, developer tools, or AI orchestrator interfaces.
- Creating interactive cursor particles that follow the mouse, swarm, or execute simulated work.
- Implementing procedural canvas construction animations (pen tool drafting, text typing, card resizing).
- Designing interactive Figma-style rulers, guides, and dimension overlays.
- Creating playful or high-engagement interactive landing pages with multi-agent presence.

## 3. When NOT to Use This Skill

- Standard static websites that do not require particle physics or multi-agent simulations.
- 3D WebGL / Three.js environments (this skill is tailored for 2D Canvas + SVG + DOM).
- Simple CSS hover effects or basic single-cursor replacements.

---

## 4. Prerequisites

- **Framework**: React 18+ (compatible with React 19).
- **Tooling**: Vite, Next.js, or any modern ES module bundler.
- **Fonts**: `Inter` and `JetBrains Mono` (preconnected in HTML or loaded via web font loader).
- **Environment**: Browser DOM with HTML5 Canvas 2D support and `requestAnimationFrame`.

---

## 5. Reference Documentation

For deep technical specifications, consult the modular documentation in `references/`:
- **Animation System**: [references/animation-system.md](references/animation-system.md) – Lifecycle, frame scheduling, generator state machine, performance rules.
- **Mouse & Agent Control**: [references/mouse-control.md](references/mouse-control.md) – Coordinate spaces, Lissajous targeting, elastic collision deflection, multi-agent scaling.
- **Physics Engine**: [references/physics-engine.md](references/physics-engine.md) – Vector math, tangential swirl, Boids alignment, speed and force limits.
- **React Architecture**: [references/react-architecture.md](references/react-architecture.md) – Component hierarchy, hybrid rendering, fine-grained version memoization.
- **Design System**: [references/design-system.md](references/design-system.md) – Color palette, typography scale, cursor vectors, technical overlays.
- **Implementation Guide**: [references/implementation-guide.md](references/implementation-guide.md) – Step-by-step developer integration, custom tasks, common pitfalls.

---

## 6. Architecture & Code Reuse Instructions

> [!IMPORTANT]
> **Reuse Existing Implementation**: When implementing or extending the Swarm animation, **inspect and reuse the existing project implementations** before creating replacements. Use the modules in `src/physics/SwarmEngine.js`, `src/physics/Particle.js`, `src/physics/Vector2D.js`, `src/components/SwarmCanvas.jsx`, and `src/components/Cursor.jsx`.

### Primary Component & Hook Import Map:
```javascript
import { SwarmEngine, CANVAS_WIDTH } from './physics/SwarmEngine.js';
import { Particle, AGENT_NAMES, AGENT_COLORS } from './physics/Particle.js';
import { Vector2D } from './physics/Vector2D.js';
import { MainCanvas, StickyNavCanvas, OverlayLayer } from './components/SwarmCanvas.jsx';
import { Cursor, CursorsLayer } from './components/Cursor.jsx';
import { Rulers, IntroLogo } from './components/Controls.jsx';
import { useMousePosition } from './hooks/useMousePosition.js';
import { useAnimationLoop } from './hooks/useAnimationLoop.js';
```

---

## 7. Implementation Workflow

```
1. PREPARE ENVIRONMENT
   ├── Load Inter & JetBrains Mono web fonts
   └── Configure 1280px coordinate space & responsive scaling (s = min(1, clientWidth / 1280))

2. INITIALIZE ENGINE
   ├── Instantiate new SwarmEngine() after font load readiness promise
   ├── Attach useMousePosition() to bind pointermove & pointerdown
   └── Bind window resize, scroll, and wheel event handlers

3. RUN ANIMATION LOOP
   ├── Schedule requestAnimationFrame via useAnimationLoop
   ├── Clamp delta time (dt ≤ 0.05s) to prevent tunneling
   └── Call engine.step(dt) and trigger React render tick

4. RENDER LAYERS
   ├── StickyNavCanvas (Pinned top header)
   ├── MainCanvas (Non-sticky document elements)
   ├── IntroLogo (Centered SVG fading out on scroll start)
   ├── OverlayLayer (Dynamic guides, handles, polyline, badges)
   ├── CursorsLayer (Active agent cursors)
   └── Rulers (Top & Left coordinate rulers)
```

---

## 8. Performance & Optimization Rules

1. **Granular Version Memoization**:
   Wrap element renderers in `React.memo` comparing `prevProps.v === nextProps.v`. Always pass `v={el.v}` as a prop. Only elements whose version number has been bumped (`el.v++`) will re-render.
2. **Decoupled Simulation**:
   Do not store individual particle coordinates in React state. Update particles in mutable engine arrays and drive React updates via a single tick counter.
3. **Hardware Acceleration**:
   Always apply `will-change: transform` to `.cursor` and translate via `translate(Xpx, Ypx)` and `scale()`.
4. **Delta-Time Clamping**:
   Always clamp `dt = Math.min((now - last) / 1000, 0.05)` to eliminate instability caused by inactive background tabs.

---

## 9. Accessibility & Mobile Considerations

- **Reduced Motion Support**: If `prefers-reduced-motion` is detected, limit worker spawning to $N_{\min}=6$ and reduce maximum cursor speed by 50%.
- **Mobile Touch Ergonomics**: Bind `pointerdown` alongside `pointermove` to instantly capture touch gestures without requiring a drag.
- **Aria Hidden**: Decorative cursors, ruler overlays, and intro logo elements must declare `aria-hidden="true"` so assistive technologies focus on semantic document content.

---

## 10. Validation & Testing Checklist

- [ ] Web fonts loaded before engine initialization.
- [ ] Viewport transforms correctly with scale $s = \min(1, \text{clientWidth} / 1280)$.
- [ ] Cursors orbit focal point smoothly without jitter.
- [ ] Mouse entering viewport pushes cursors away with 48px elastic boundary.
- [ ] Scrolling activates `engine.start()` and hides the intro logo.
- [ ] Cursors claim tasks from dependency graph and transition to appropriate shapes.
- [ ] Text types out character-by-character with realistic pauses.
- [ ] Duplicate tasks show red bounding boxes and numeric gap measurement badges.
- [ ] Completing all tasks returns all cursors to flocking follow mode.
- [ ] Build succeeds with `npm run build` with zero errors.

# Reverse Engineering Report: Swarm Animation Website

## 1. Executive Summary

This report documents the reverse engineering of the production web application located in the source directory. The original website is a real-time collaborative multi-agent simulation titled **"Swarm: orchestrate thousands of agents"**. 

In the application, autonomous cursor particles (styled like Figma / collaborative design tool cursors with famous computer scientist names and custom colors) swarm organically around the user's cursor or hover in an orbital Lissajous figure. When the user scrolls or starts the experience, these agents claim tasks from a directed dependency graph and collaboratively construct the entire web page in real-time. They draw vector paths with a pen tool, drag out cards and window mockups with crosshair cursors, pull dynamic guides out of animated rulers, type headlines and body text character-by-character with realistic cadence, duplicate UI elements using Option-drag with red delta measurement overlays, and double-click to edit duplicated text blocks.

---

## 2. Source Bundle & Asset Analysis

### 2.1 File Inventory
The source distribution consists of:
- `index.html` (735 bytes): Entry HTML file. Contains font preload links (`Inter` and `JetBrains Mono` from Google Fonts), viewport meta tag, title `"Swarm: orchestrate thousands of agents"`, `<div id="root"></div>`, module script link to `./assets/index-BcWSe1v5.js`, and stylesheet link to `./assets/index-DaDOAYTB.css`.
- `assets/index-BcWSe1v5.js` (184,731 bytes): Production JavaScript bundle compiled with Vite and minified via esbuild/terser.
- `assets/index-DaDOAYTB.css` (2,332 bytes): Minified CSS stylesheet containing custom properties, layout styles, cursor styling, and ruler animations.
- No external raster images, videos, audio, or 3D models are present; all visuals are procedurally generated using SVGs, DOM elements, and an offscreen HTML5 2D Canvas for text measurement.

### 2.2 Source Map Investigation
A thorough inspection of `assets/index-BcWSe1v5.js` for source mapping directives (`//# sourceMappingURL=...` or `/*# sourceMappingURL=...`) confirmed that **no source maps were published or included** in the production distribution. 

### 2.3 Deobfuscation & Decomposition
Beautifying and parsing `assets/index-BcWSe1v5.js` revealed:
- **Total Lines**: ~11,700 lines of formatted JavaScript.
- **Framework & Libraries**:
  - **React 18.3.1** and **React-DOM 18.3.1** (Production runtime, scheduler, fiber reconciler spanning lines 1–9025).
  - **Vite** module loader runtime (`modulepreload` polyfill at lines 1–32).
  - **JSX Runtime** (`jsx`, `jsxs`, `Fragment`).
- **Application Code**:
  - Spans lines 9026–11699 (~2,670 lines of unminified code).
  - Implements a single unified simulation engine class (`yp`), 18 specialized helper and rendering functions, custom typography tokens, a complete document layout specification, and a root React component (`_p`).

---

## 3. Architecture & Rendering Engine

### 3.1 Hybrid DOM + SVG + Canvas Architecture
The application employs an innovative hybrid rendering model:
1. **Offscreen Canvas (`Jt`)**: An offscreen `HTMLCanvasElement` 2D context (`document.createElement('canvas').getContext('2d')`) is utilized strictly for sub-pixel text measurement, font metrics calculation, and multi-line text wrapping cache (`fu`).
2. **Main Canvas Container (`xp` / `.canvas`)**: A single scalable viewport container sized at fixed coordinate width $W = 1280\text{px}$ and variable height $H = 4060\text{px}$. The canvas container is scaled to fit mobile and desktop viewports via CSS transform:
   $$\text{transform: translateX}(left\text{px}) \text{ scale}(s)$$
   where $s = \min(1, \text{clientWidth} / 1280)$ and $left = (\text{clientWidth} - 1280 \cdot s) / 2$.
3. **Memoized Element Renderers**:
   - `vp` (`.el-text`): DOM text elements supporting custom fonts (`Inter`, `JetBrains Mono`), letter spacing, selection highlights (`.text-sel`), caret blinking (`.caret`), and token syntax highlighting (`mp`) for YAML configuration.
   - `gp` (`.el-rect`): DOM rectangle elements supporting styled fills, corner radii, and drag-to-create size animations (`draw.w`, `draw.h`).
   - `wp` (`.paths`): An SVG surface rendering vector paths, stroke dashed logo assemblies, polyline connections, and animated fill transitions.
4. **Sticky Navigation Bar (`kp` / `.nav-sticky`)**: A sticky header with independent backdrop and top-pinned canvas projection, accounting for ruler offsets.
5. **Dynamic Overlays (`Sp` / `.overlay`)**: Top-level SVG and HTML overlay rendering:
   - Magnetic guide lines with red flash bloom (`drop-shadow`).
   - Pen tool drafting lines with active vertex control points.
   - Blue bounding boxes with 7×7px drag handles and size badges (`width × height`).
   - Distance measurement lines with numeric dimension badges.
   - Dashed projection lines connecting selected elements to rulers.
6. **Agent Cursors (`Ep` / `.cursors`)**: Hardware-accelerated cursor layer rendering each agent with SVG pointer icons, dynamic rotation matching velocity, and scale dip on click/press.
7. **Figma-Style Rulers (`Cp` / `.ruler`)**: Top and left edge rulers that dynamically slide down/right when guides are drawn or dragged, featuring adaptive tick intervals (100px, 200px, 500px), coordinate labels, selection projection bands, and guide markers.

---

## 4. Recovered Component & Function Catalog

| Original Symbol | Classified Role | Recovered Component / Module | Description |
|---|---|---|---|
| `op` | Offset Map | `CURSOR_OFFSETS` | Translation hot-spot offsets for each of the 9 cursor shapes. |
| `pi` | SVG Path Data | `CURSOR_ARROW_PATH` | Path geometry for the standard Figma-style cursor arrow. |
| `sp` | Component | `CursorIcon` (`Cursor.jsx`) | Renders SVG geometry for cursor shapes: `arrow`, `dup`, `pen`, `pen-add`, `pen-close`, `cross`, `ibeam`, `ew`, `ns`. |
| `up` | Component | `Cursor` (`Cursor.jsx`) | Container for an individual cursor with position translation, heading rotation, and press scaling. |
| `Jt` | Canvas Context | `textMeasureContext` | Offscreen Canvas 2D context used for layout text metrics. |
| `br` | Pure Function | `measureText` | Measures multi-line text dimensions and line breaks with memoization. |
| `Kt`, `ue`, `In`, `Z` | Constants | `LAYOUT_METRICS` | Layout coordinate constants: Width 1280, Margin 80, Right 1200, Content Left 116. |
| `O` | Palette | `COLOR_PALETTE` | Color constants: `ink`, `muted`, `line`, `accent`, `card`, `code`. |
| `R` | Design Tokens | `TYPOGRAPHY` | Typographic specifications for headers, body, code, buttons, and badges. |
| `zc` | Vector Data | `LOGO_PATHS` | Swarm geometric logo path data and polygon anchor coordinates. |
| `ap` | Factory Function | `buildDocumentLayout` | Generates document elements, structural rule lines, and task dependency graph. |
| `du`, `pu` | Arrays | `AGENT_NAMES`, `AGENT_COLORS` | 32 pioneer computer scientist names and 12 collaborative cursor colors. |
| `yp` | Class | `SwarmEngine` (`SwarmEngine.js`) | Core simulation engine managing physics, boids flocking, task queuing, and generators. |
| `mp` | Helper | `SyntaxHighlighter` | Syntax highlighter tokenizing YAML code into colored span elements. |
| `vp` | Component | `TextElement` (`SwarmCanvas.jsx`) | Memoized DOM renderer for animated text blocks and typing carets. |
| `gp` | Component | `RectElement` (`SwarmCanvas.jsx`) | Memoized DOM renderer for cards, buttons, code window, and container rectangles. |
| `wp` | Component | `PathElement` (`SwarmCanvas.jsx`) | Memoized SVG path renderer with stroke dashoffset drawing animations. |
| `jc` | Component | `CanvasSurface` (`SwarmCanvas.jsx`) | Combines rects, paths SVG, and text elements on the canvas plane. |
| `xp` | Component | `MainCanvas` (`SwarmCanvas.jsx`) | Renders all non-sticky document elements with viewport transform. |
| `kp` | Component | `StickyNavCanvas` (`SwarmCanvas.jsx`) | Renders sticky navigation header and backdrop. |
| `Sp` | Component | `OverlayLayer` (`SwarmCanvas.jsx`) | Dynamic SVG/HTML overlay for selection boxes, handles, guides, and measurements. |
| `Ep` | Component | `CursorsLayer` (`Cursor.jsx`) | Renders all active agent cursors. |
| `Cp` | Component | `Rulers` (`Controls.jsx`) | Figma-style coordinate rulers on top and left margins. |
| `_p` | Component | `App` (`App.jsx`) | Root application component coordinating hooks, events, fonts, and render tree. |

---

## 5. CSS & Asset Recovery

The minified CSS file `assets/index-DaDOAYTB.css` was fully analyzed and decoded:
- **Design Tokens**:
  - `--paper`: `#F8F9FA` (canvas background ivory)
  - `--ink`: `#121417` (dominant dark typography and accents)
- **Selection & Accent Colors**:
  - Selection blue: `#0D99FF` / `#0D99FF47`
  - Drag highlight red: `#F24822` / `#F24E1E`
- **Typography**:
  - Primary UI: `Inter, system-ui, sans-serif`
  - Code & Badges: `"JetBrains Mono", ui-monospace, monospace`
  - Font features: `"cv11", "ss01"` for clean geometric letterforms.
- **Keyframe Animations**:
  - `@keyframes blink { 50% { opacity: 0; } }` for the terminal/text insertion caret.
- **Hardware Acceleration**:
  - `.cursor` uses `will-change: transform`.
  - `.intro-logo` uses hardware-accelerated transform and opacity transitions.

---

## 6. Conclusion

The application logic has been completely recovered without loss of functionality. In Phase 2 and Phase 3, this logic is modularized into clean, modern ES6+ React components with full separation of concerns, robust Vector2D physics classes, custom React hooks, and strict type safety.


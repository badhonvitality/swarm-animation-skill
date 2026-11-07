# React Architecture Reference

## 1. Component Hierarchy

The application architecture isolates the simulation loop, viewport responsive calculation, and rendering pipeline into modular, decoupled React layers:

```
<App>
  ├── useMousePosition(engine)
  ├── useAnimationLoop(dt => engine.step(dt))
  │
  ├── <div className="page" style={{ height: engine.height * scale }}>
  │     ├── <StickyNavCanvas engine={engine} />
  │     │     ├── <div className="nav-backdrop" />
  │     │     └── <div className="nav-canvas">
  │     │           └── <CanvasSurface elements={stickyElements} />
  │     ├── <MainCanvas engine={engine} />
  │     │     └── <div className="canvas">
  │     │           └── <CanvasSurface elements={nonStickyElements} />
  │     ├── <IntroLogo started={engine.started} />
  │     ├── <OverlayLayer engine={engine} />
  │     └── <CursorsLayer engine={engine} />
  │           └── <Cursor key={c.id} cursor={c} X={...} Y={...} />
  │
  └── <Rulers engine={engine} />
        ├── <div className="ruler ruler-top" />
        ├── <div className="ruler ruler-left" />
        └── <div className="ruler-corner" />
```

---

## 2. Hybrid Rendering Pipeline

### 2.1 The Three-Layer Surface
Rather than rendering thousands of DOM nodes or redrawing a massive canvas bitmap on every frame, the architecture splits the canvas into 3 high-performance layers:
1. **DOM Elements (`.el-text`, `.el-rect`)**:
   - High-quality native text with browser sub-pixel antialiasing and OpenType features (`font-feature-settings: "cv11", "ss01"`).
   - Rectangles with CSS border radius, shadows, and smooth background transitions.
2. **SVG Vector Paths (`.paths`, `.overlay`)**:
   - Responsive vector lines, connectors, and complex logos with zero rasterization artifacts.
   - Vector effects (`vector-effect="non-scaling-stroke"`).
3. **Offscreen Canvas (`HTMLCanvasElement`)**:
   - Never inserted into the DOM.
   - Used purely as a high-speed layout metric solver for measuring multiline word wrapping and exact line breaks without causing DOM layout reflows (forced synchronous layouts).

---

## 3. Viewport Scaling & Mobile Ergonomics

### 3.1 Fixed Canvas Width (1280px Coordinate Space)
All layout specifications, element bounds, coordinates, and task triggers are authored against a fixed 1280px coordinate plane:
$$\text{scale} = \min\left(1, \ \frac{\text{clientWidth}}{1280}\right)$$
$$\text{left} = \frac{\text{clientWidth} - 1280 \cdot \text{scale}}{2}$$

### 3.2 Hardware-Accelerated CSS Transform
The container scales effortlessly across phone, tablet, and ultra-wide displays:
```jsx
<div
  className="canvas"
  style={{
    width: 1280,
    height: engine.height,
    transform: `translateX(${left}px) scale(${scale})`,
    transformOrigin: '0 0',
  }}
>
```
On mobile phones ($390\text{px}$ width), $\text{scale} \approx 0.304$. The entire page scales proportionally with zero layout distortion, while cursors, text, and selection handles remain pixel-crisp.

---

## 4. State Synchronization & Frame Decoupling

### 4.1 Internal Simulation vs. React Reconciliation
- **Simulation Engine**: `SwarmEngine` is a mutable, high-performance ES6 class managing particles, generators, and vectors directly in memory without React state overhead.
- **Render Trigger**: `useAnimationLoop` steps the engine forward by delta time `dt`, then triggers a lightweight counter state bump:
  ```javascript
  useAnimationLoop((dt) => {
    if (!engine) return;
    engine.step(dt);
    setTick((t) => t + 1); // Lightweight signal telling React to re-render
  }, Boolean(engine));
  ```

### 4.2 Fine-Grained Version Memoization
To prevent re-rendering hundreds of static elements on every frame, elements carry an integer version `v`:
- When an agent types a character or draws a path point, only that specific element's version is incremented: `el.v++`.
- Components are wrapped in `React.memo` with a custom comparator:
  ```javascript
  export const TextElement = React.memo(
    ({ el, v }) => { ... },
    (prevProps, nextProps) => prevProps.v === nextProps.v
  );
  ```
  Only modified elements re-evaluate their render function. All unchanged text, rectangles, and paths skip DOM reconciliation entirely.

---

## 5. Memory Management & Event Listener Teardown

To avoid memory leaks in single-page applications or route changes, every event listener and animation frame must be cleaned up on component unmount:

```javascript
useEffect(() => {
  if (!engine) return;

  const handleResize = () => updateDimensions();
  const handleScroll = () => engine.setScroll(window.scrollY);
  const handleWheel = () => { if (window.scrollY > 0) engine.start(); };

  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('wheel', handleWheel, { passive: true });

  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('wheel', handleWheel);
  };
}, [engine]);
```


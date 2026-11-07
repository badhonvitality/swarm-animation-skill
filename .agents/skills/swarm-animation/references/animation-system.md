# Animation System Reference

## 1. Overview

The Swarm animation system coordinates high-performance, real-time multi-agent particle simulations in React. It orchestrates autonomous cursor agents that dynamically construct web pages, draw vector paths, typeset text, duplicate elements, and interact with user inputs at a consistent 60 frames per second.

---

## 2. Animation Lifecycle

The animation lifecycle follows a deterministic multi-stage progression:

```
[Font Preloading] ──► [Engine Init] ──► [Idle Orbiting (Lissajous / Mouse)]
                                                      │
                                                      ▼
[Completion & Flocking Return] ◄── [Task Execution] ◄── [Scroll Trigger / Start]
```

### 2.1 Initialization & Font Preloading
To guarantee text measurements match between the offscreen canvas layout engine and rendered DOM nodes, initialization is gated behind web font readiness:
```javascript
const fontsToLoad = [
  '400 16px Inter',
  '500 16px Inter',
  '600 16px Inter',
  '400 16px "JetBrains Mono"',
  '500 16px "JetBrains Mono"',
];
const fallbackTimeout = new Promise((resolve) => setTimeout(resolve, 2500));
const fontPromises = document.fonts?.load
  ? Promise.all(fontsToLoad.map((f) => document.fonts.load(f)))
  : Promise.resolve();

Promise.race([fontPromises, fallbackTimeout]).then(() => {
  setEngine(new SwarmEngine());
});
```

### 2.2 Activation Trigger
The swarm begins in `"idle"` mode:
- 18 pioneer cursors orbit in a circle with subtle harmonic hover offsets.
- When `window.scrollY > 4` or a user wheel event occurs, `engine.start()` is triggered.
- `engine.started` transitions to `true`, hiding the intro logo (`.intro-logo.gone`) and making agents available to claim construction tasks.

### 2.3 Task Graph Scheduling & Dynamic Frontier
The document canvas is vertically triggered:
- The animation `frontier` marks the maximum vertical boundary that has scrolled into view:
  $$\text{frontier} = \max(\text{frontier}, \text{viewBottom})$$
- Tasks with $y_{\text{trigger}} \le \text{frontier}$ whose dependencies (`deps`) are all `"done"` transition from `"wait"` to available.
- Available tasks are claimed by available agents using a proximity-weighted visibility score:
  - Visible on screen: $\text{Score} = 0 + \text{coordOffset} \times 0.6 + |\Delta y| \times 0.4$
  - Above viewport: $\text{Score} = 10^6 + (y_{\text{top}} - y_{\text{task}}) \times 0.6 + |\Delta y| \times 0.4$
  - Below viewport: $\text{Score} = 2 \times 10^6 + y_{\text{task}} \times 0.6 + |\Delta y| \times 0.4$

### 2.4 Completion & Return to Swarm
When all 237 tasks reach state `"done"`:
- Agents transition their shape to `"arrow"`, clear overlays, and toggle `follow = true`.
- Once all agents are following, `engine.flocking = true` activates, reuniting all cursors in an organic school-of-fish flock orbiting the user cursor or viewport center.

---

## 3. Frame Scheduling & Loop Architecture

### 3.1 requestAnimationFrame Driver
The animation loop is executed through the custom hook `useAnimationLoop`:
```javascript
export function useAnimationLoop(onStep, enabled = true) {
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  useEffect(() => {
    if (!enabled) return;
    let animId = 0;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      // Clamp delta time to 50ms to prevent huge physics jumps on tab backgrounding
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      if (onStepRef.current) {
        onStepRef.current(dt, currentTime);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [enabled]);
}
```

### 3.2 Dynamic Tempo Modulation
The simulation step speed ($\text{tempo}$) adapts dynamically to user scroll speed and task workload:
$$\text{tempo} = \text{clamp}\left(2.1 + \frac{\text{vel}}{900} + \frac{N_{\text{tasksReady}}}{N_{\text{cursors}}} \times 0.5, \ 2.1, \ 4.5\right)$$
- If the user scrolls rapidly, scroll velocity ($\text{vel}$) increases, raising tempo up to $4.5\times$ to complete tasks before they fall behind the viewport.
- As scrolling ceases, velocity decays exponentially: $\text{vel} \leftarrow \text{vel} \cdot e^{-1.2 \cdot \Delta t}$.

---

## 4. Generator Coroutine State Machine

Each agent task is executed as an ES6 generator coroutine that yields control back to the engine every animation frame:

### 4.1 Trajectory Motion (`moveTo`)
Interpolates agent coordinate from start to target with natural curve bending and easing:
```javascript
*moveTo(cursor, target, options = {}) {
  const getTarget = typeof target === 'function' ? target : () => target;
  const startX = cursor.x;
  const startY = cursor.y;
  const initialTarget = getTarget();
  const distance = Math.hypot(initialTarget.x - startX, initialTarget.y - startY);

  if (distance < 0.5) {
    cursor.x = initialTarget.x;
    cursor.y = initialTarget.y;
    options.onStep?.();
    return;
  }

  const duration = clamp(0.12 + Math.sqrt(distance) * 0.021, 0.14, 0.9) / (options.speed ?? 1);
  const bend = (options.bend ?? (Math.random() < 0.5 ? -1 : 1) * randomRange(0.04, 0.14)) * Math.min(distance, 600);

  let elapsed = 0;
  while (elapsed < duration) {
    elapsed += (yield) * this.tempo;
    const progress = Math.min(1, elapsed / duration);
    const eased = options.drag || progress < 0.15 ? easeInOutCubic(progress) : easeOutCubic(progress);
    const currentTarget = getTarget();
    const dx = currentTarget.x - startX;
    const dy = currentTarget.y - startY;
    const segLen = Math.hypot(dx, dy) || 1;
    const perpOffset = Math.sin(Math.PI * eased) * bend;

    cursor.x = startX + dx * eased + (-dy / segLen) * perpOffset;
    cursor.y = startY + dy * eased + (dx / segLen) * perpOffset;
    options.onStep?.();
  }

  const finalTarget = getTarget();
  cursor.x = finalTarget.x;
  cursor.y = finalTarget.y;
  options.onStep?.();
}
```

### 4.2 Realistic Keystroke Typing (`type`)
Appends text character-by-character with variable timing:
```javascript
*type(element, fullText, clearFirst = false) {
  for (let i = 0; i < fullText.length; i++) {
    if (i === 0 && clearFirst) element.shown = '';
    element.shown += fullText[i];
    element.selAll = false;
    element.v++;

    let delay = randomRange(0.012, 0.04);
    if (fullText[i] === ' ') delay += randomRange(0, 0.03);
    if (fullText[i] === '\n') delay += 0.1;
    if (Math.random() < 0.025) delay += randomRange(0.08, 0.2); // thinking pause

    yield* this.wait(delay);
  }
}
```

---

## 5. Rendering Performance Rules

1. **Granular Version Memoization**:
   Never re-render the entire document when one text block or rectangle changes. Each element maintains an integer version `el.v`. Elements are wrapped in `React.memo` with custom prop comparator:
   ```javascript
   export const TextElement = React.memo(
     Component,
     (prevProps, nextProps) => prevProps.v === nextProps.v
   );
   ```
2. **Sub-Pixel Hardware Transforms**:
   Cursors update position via CSS `transform: translate(Xpx, Ypx)` and declare `will-change: transform`.
3. **Delta Time Clamping**:
   Always cap `dt` at `0.05s` (50ms) to avoid physics explosion when tabs are inactive.


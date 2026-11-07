# Mouse & Agent Cursor Control Reference

## 1. Overview

This document details how interactive agent cursors are represented, positioned, animated, and governed in relation to user pointer movements and autonomous task trajectories.

---

## 2. Cursor Representation & Geometry

### 2.1 The Agent Particle Model
Each agent cursor is instantiated as an autonomous `Particle` with the following physical and visual parameters:
```javascript
export class Particle {
  constructor(id, x, y, home = null) {
    this.id = id;
    this.x = x;                           // World canvas coordinate X
    this.y = y;                           // World canvas coordinate Y
    this.vx = 0;                          // Velocity vector X
    this.vy = 0;                          // Velocity vector Y
    this.angle = 0;                       // Heading rotation in degrees
    this.name = AGENT_NAMES[id % 32];     // Pioneer legend name (e.g., Ada, Linus, Alan)
    this.color = AGENT_COLORS[id % 12];   // Collaborative color
    this.shape = "arrow";                 // Active cursor shape
    this.press = 0;                       // Click depression scale (0..1)
    this.task = null;                     // Currently assigned task or null
    this.gen = null;                      // Generator coroutine executing task
    this.ov = null;                       // Function returning dynamic overlay shapes
    this.sticky = false;                  // Pinned to sticky navigation bar
    this.follow = false;                  // Flocking follow mode active
  }
}
```

### 2.2 Hotspot Offsets & Rotational Anchors
Each of the 9 cursor shapes has a distinct operational tip/hotspot coordinate defined in `CURSOR_OFFSETS`:

| Shape | Offset $[x_o, y_o]$ | Semantic Meaning |
|---|---|---|
| `arrow` | `[5, 3.5]` | Default pointer navigation and clicking |
| `dup` | `[5, 3.5]` | Option-drag component cloning |
| `pen` | `[3, 3]` | Vector vertex placement |
| `pen-add` | `[3, 3]` | Vector vertex insertion with `+` glyph |
| `pen-close` | `[3, 3]` | Vector path closing with `○` glyph |
| `cross` | `[12, 12]` | Centered crosshair for dragging bounds |
| `ibeam` | `[12, 12]` | Text insertion caret |
| `ew` | `[12, 12]` | Horizontal guide dragging |
| `ns` | `[12, 12]` | Vertical guide dragging |

The rendered SVG container shifts by $[-x_o, -y_o]$ and anchors rotation and scale to $[x_o, y_o]$:
```jsx
<div className="cursor" style={{ transform: `translate(${X}px, ${Y}px)` }}>
  <svg
    width={28}
    height={28}
    viewBox="0 0 28 28"
    style={{
      transform: `translate(${-ox}px, ${-oy}px) rotate(${cursor.angle}deg) scale(${1 - cursor.press * 0.12})`,
      transformOrigin: `${ox}px ${oy}px`,
    }}
  >
    <CursorIcon shape={cursor.shape} color={cursor.color} />
  </svg>
</div>
```

---

## 3. Coordinate Systems & Viewport Mapping

The simulation separates screen viewport space from world canvas coordinate space:

### 3.1 Viewport to Canvas Space
Screen coordinates $(x_{\text{client}}, y_{\text{client}})$ from mouse/touch events are transformed into 1280px canvas coordinates:
```javascript
fromViewport(screenX, screenY) {
  return {
    x: (screenX - this.vp.left) / this.vp.s,
    y: (this.vp.scrollY + screenY) / this.vp.s,
  };
}
```
Where:
- $s = \min(1, \text{clientWidth} / 1280)$: Responsive zoom ratio.
- $\text{left} = (\text{clientWidth} - 1280 \cdot s) / 2$: Centering horizontal gutter.
- $\text{scrollY}$: Current window scroll offset.

### 3.2 Canvas to Screen Space
When rendering cursors in the DOM:
$$X_{\text{screen}} = \text{left} + x_{\text{canvas}} \cdot s$$
$$Y_{\text{screen}} = (y_{\text{canvas}} + y_{\text{stickyOffset}}) \cdot s$$

---

## 4. Autonomous Target Acquisition & Motion

### 4.1 Idle Lissajous Swarm Focal Point
When no mouse is inside the browser window, the swarm orbits an autonomous Lissajous curve:
$$\begin{aligned}
x_T &= V_w \cdot (0.5 + 0.28 \cdot \sin(0.37 \cdot t)) \\
y_T &= V_h \cdot (0.5 + 0.25 \cdot \sin(0.53 \cdot t + 1))
\end{aligned}$$
This gives the cursors a lifelike, breathing presence without user input.

### 4.2 Smooth Trajectory Tracking (`moveTo`)
When an agent moves towards a task target, sudden linear jumps are prevented by applying:
1. **Dynamic Travel Duration**:
   $$T = \frac{\text{clamp}(0.12 + 0.021 \cdot \sqrt{\text{distance}}, \ 0.14, \ 0.9)}{\text{speed}}$$
2. **Curvature / Parabolic Bend**:
   A perpendicular displacement vector is added along the midpoint of the travel vector:
   $$\mathbf{p}_{\perp} = \sin(\pi \cdot t_{\text{eased}}) \cdot \text{bend} \cdot \min(\text{distance}, 600) \cdot \left(-\frac{d_y}{D}, \frac{d_x}{D}\right)$$
3. **Cubic Easing**:
   - Travel mode: $\text{easeOutCubic}(t) = 1 - (1 - t)^3$.
   - Dragging mode: $\text{easeInOutCubic}(t) = t < 0.5 \ ? \ 4t^3 : 1 - \frac{(-2t + 2)^3}{2}$.

---

## 5. Mouse Interaction & Elastic Collision Deflection

When the user moves the mouse into the swarm, the swarm reacts organically like fish dodging a physical obstacle:

### 5.1 Repulsion Circle ($R = 48\text{px}$)
For each cursor $\mathbf{p}_i$ within $48\text{px}$ of mouse position $\mathbf{p}_{\text{mouse}}$:
1. Clamp distance to circumference: $\mathbf{p}_i \leftarrow \mathbf{p}_{\text{mouse}} + \hat{\mathbf{u}} \cdot 48$.
2. Calculate relative velocity along the collision normal:
   $$v_{\text{rel}} = (\mathbf{v}_i - \mathbf{v}_{\text{mouse}}) \cdot \hat{\mathbf{u}}$$
3. If moving toward the mouse ($v_{\text{rel}} < 0$), apply an elastic bounce with coefficient of restitution $k = 1.6$:
   $$\mathbf{v}_i \leftarrow \mathbf{v}_i - 1.6 \cdot v_{\text{rel}} \cdot \hat{\mathbf{u}} + 260 \cdot \hat{\mathbf{u}}$$
4. Target velocity tracking with smoothing:
   $$\mathbf{v}_{\text{mouse}} \leftarrow \mathbf{v}_{\text{mouse}} + \left(\frac{\Delta \mathbf{p}_{\text{mouse}}}{\Delta t} - \mathbf{v}_{\text{mouse}}\right) \cdot \min(1, 18 \cdot \Delta t)$$

---

## 6. Multi-Agent Worker Lifecycle & Scaling

1. **Initial Crew**: Starts with 18 cursors arranged in a circle; the first 6 cursors have `home` coordinates near the viewport center.
2. **Dynamic Workload Scaling**:
   $$N_{\text{target}} = \text{clamp}\left(6 + \left\lfloor\frac{\text{vel}}{50}\right\rfloor + \left\lfloor\frac{N_{\text{tasksReady}}}{3}\right\rfloor, \ 6, \ 48\right)$$
   If active workers $< N_{\text{target}}$ and unassigned tasks remain, additional workers spawn smoothly from offscreen margins (either $-40\text{px}$ or $V_w + 40\text{px}$).
3. **Natural Worker Retirement**:
   If a worker has been idle for $> 2.5\text{s}$ and total active workers $> 6$, the worker executes `leave()`, traveling offscreen before self-terminating and incrementing `retiredWorkers`.
4. **Dynamic CTA Tally**:
   The CTA section dynamically counts:
   $$\text{Tally} = N_{\text{activeWorkersWorked}} + N_{\text{retiredWorkers}}$$
   Displaying: `"This page was built by 44 agents while you scrolled."`

---

## 7. Recovered vs. Proposed Extensions

- **Original Recovered Functionality**:
  - 32 Computer Scientist names and 12 Figma-inspired cursor colors.
  - 9 cursor SVG shapes with hot-spot origin offsets.
  - 48px elastic collision radius with 1.6 restitution.
  - Velocity heading rotation with $\Delta\theta \times \min(1, 8\Delta t)$.
- **Recommended Extensions**:
  - `pointerdown` binding alongside `pointermove` to instantly wake up mouse interaction on touch/tablet devices.
  - Optional custom persona registration API for branded agent names/avatars.


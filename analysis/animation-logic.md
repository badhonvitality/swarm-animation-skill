# Swarm Animation & Physics Logic Analysis

## 1. Introduction

The Swarm animation engine simulates a collaborative swarm of intelligent AI agents acting as interactive cursors inside a design canvas. This document details the mathematical algorithms, physics systems, flocking mechanics, and procedural task execution routines recovered during reverse engineering.

---

## 2. Agent Dynamics & Flocking Physics

### 2.1 Agent State
Each agent cursor in the swarm is represented by a particle with the following state vectors and attributes:
- $\mathbf{p} = (x, y)$: Current canvas coordinate position.
- $\mathbf{v} = (v_x, v_y)$: Current velocity vector.
- $\theta$: Current heading angle in degrees (rotated smoothly to face the direction of travel).
- $v_{\max} \in [300, 750]\text{px/s}$ (standard) or $[1000, 1500]\text{px/s}$ (fast scout, 25% chance).
- $F_{\max} \in [700, 1800]\text{px/s}^2$ or $[3500, 6000]\text{px/s}^2$.
- $r_{\text{orbit}} \in [70, 170]\text{px}$: Individual orbital radius offset.
- $\omega_{\text{spin}} \in [0.8, 1.8]$ or $[2.2, 3.4]$: Orbital rotation speed.
- $c_{\text{curl}} \in [-1, 1]$: Tangential curl bias.
- $\phi \in [0, 2\pi]$: Initial orbital phase offset.

### 2.2 Swarm Target Determination
When not tracking a task, the swarm orbits a dynamic focal target point $\mathbf{T}_{\text{flock}}$:
1. **Mouse Tracking Mode**: If the user's cursor is inside the window, $\mathbf{T}_{\text{flock}}$ is mapped directly from screen viewport coordinates to canvas space:
   $$\mathbf{T}_{\text{flock}} = \left( \frac{x_{\text{mouse}} - \text{left}}{s}, \frac{y_{\text{mouse}} + \text{scrollY}}{s} \right)$$
2. **Autonomous Lissajous Mode**: If no mouse interaction is detected, $\mathbf{T}_{\text{flock}}$ oscillates in a natural figure-8 Lissajous pattern:
   $$\begin{aligned}
   x_T &= V_w \cdot (0.5 + 0.28 \cdot \sin(0.37 \cdot t)) \\
   y_T &= V_h \cdot (0.5 + 0.25 \cdot \sin(0.53 \cdot t + 1))
   \end{aligned}$$
   where $V_w, V_h$ are viewport width and height, and $t$ is simulation elapsed time.

### 2.3 Steering & Orbital Mechanics
For each agent cursor relative to the target $\mathbf{d} = \mathbf{p} - \mathbf{T}_{\text{flock}}$, with distance $D = \|\mathbf{d}\|$ and unit direction $(\hat{u}_x, \hat{u}_y) = \mathbf{d} / D$:
1. **Dynamic Swarm Radius ($R_{\text{swarm}}$)**:
   $$R_{\text{base}} = 135 \cdot (1 + 0.18 \cdot \sin(0.55 \cdot t))$$
   $$R_i = R_{\text{base}} \cdot (1 + 0.3 \cdot \sin(3\psi + 0.7 \cdot t)) + (r_{\text{orbit}} - 120) \cdot 0.55$$
   where $\psi = \text{atan2}(d_y, d_x)$.
2. **Tangential & Radial Forces**:
   - Direction switcher: $A = \tanh(3 \cdot \cos(0.11 \cdot t))$.
   - Tangential force magnitude: $F_{\text{tan}} = 300 \cdot (0.7 + 0.2 \cdot \omega_{\text{spin}}) \cdot A$.
   - Radial restoring force: $F_{\text{rad}} = \text{clamp}(4 \cdot (R_i - D), -2600, 1400)$.
   - Perpendicular curl force: $F_{\text{curl}} = -400 \cdot c_{\text{curl}} \cdot S_{\text{curl}}$, where $S_{\text{curl}} = \text{clamp}((D - R_i) / 600, 0, 1)$.
   
   The combined candidate acceleration $\mathbf{a}_{\text{target}}$ is:
   $$\begin{aligned}
   a_x &= -\hat{u}_y \cdot F_{\text{tan}} + \hat{u}_x \cdot F_{\text{rad}} - \hat{u}_y \cdot F_{\text{curl}} \\
   a_y &= \hat{u}_x \cdot F_{\text{tan}} + \hat{u}_y \cdot F_{\text{rad}} + \hat{u}_x \cdot F_{\text{curl}}
   \end{aligned}$$

### 2.4 Boids Velocity Alignment
To prevent clumping and create fluid school-of-fish motion, agents within a neighborhood radius of $R_{\text{align}} = 90\text{px}$ compute an alignment force based on neighbors' velocities:
$$\mathbf{v}_{\text{align}} = \frac{\sum_{j} \mathbf{v}_j \cdot (1 - \|\mathbf{p}_j - \mathbf{p}_i\| / 90)}{\sum_{j} (1 - \|\mathbf{p}_j - \mathbf{p}_i\| / 90)}$$
$$\mathbf{a}_{\text{steer}} = 0.7 \cdot \mathbf{a}_{\text{target}} + 0.3 \cdot \mathbf{v}_{\text{align}}$$

### 2.5 Distance-Adaptive Speed Boost
When far away from the swarm center ($D > 180\text{px}$), speed and steering force are scaled up dynamically:
$$\text{SpeedBoost} = 1.3 + \min(3.2, (D - 180) / 90)$$
$$\text{ForceBoost} = 1.4 + \min(5.0, (D - 180) / 50)$$

### 2.6 Elastic Mouse Collision & Deflection
When the user's cursor approaches an agent, a collision boundary of radius $R_{\text{collide}} = 48\text{px}$ enforces immediate elastic repulsion:
1. If $D < 48\text{px}$, the agent is pushed to the boundary: $\mathbf{p} \leftarrow \mathbf{p}_{\text{mouse}} + \hat{\mathbf{u}} \cdot 48$.
2. Relative velocity along the collision normal is calculated: $v_{\text{rel}} = (\mathbf{v} - \mathbf{v}_{\text{target}}) \cdot \hat{\mathbf{u}}$.
3. If moving toward the mouse ($v_{\text{rel}} < 0$), an elastic bounce with restitution coefficient $k_{\text{restitution}} = 1.6$ and an outward push of $260\text{px/s}$ is applied:
   $$\mathbf{v} \leftarrow \mathbf{v} - 1.6 \cdot v_{\text{rel}} \cdot \hat{\mathbf{u}} + 260 \cdot \hat{\mathbf{u}}$$

### 2.7 Natural Heading Rotation
The visual angle $\theta$ of the cursor arrow rotates towards its instantaneous velocity vector:
$$\theta_{\text{target}} = \text{atan2}(v_y, v_x) \cdot \frac{180^\circ}{\pi} + 128^\circ$$
$$\Delta\theta = (((\theta_{\text{target}} - \theta + 540^\circ) \bmod 360^\circ) - 180^\circ)$$
$$\theta \leftarrow \theta + \Delta\theta \cdot \min(1, 8 \cdot \Delta t)$$

---

## 3. Collaborative Task Execution & Generator Coroutines

### 3.1 Task Dependency Graph
The document is partitioned into 11 sections. Every element has an associated construction task with a vertical trigger threshold $y_{\text{trigger}}$ and dependency list `deps`:
- Tasks remain in state `"wait"` until all `deps` are `"done"` and $y_{\text{trigger}} \le \text{frontier}$.
- The animation `frontier` advances automatically as the user scrolls:
  $$\text{frontier} \leftarrow \max(\text{frontier}, \text{viewBottom})$$
- When idle workers are available, they query `engine.available()` and claim the nearest task prioritized by viewport visibility:
  - Visible on screen: Priority 0
  - Above viewport: Priority 1 (distance penalty)
  - Below viewport: Priority 2 (distance penalty)

### 3.2 Generator Coroutines
Each task type is driven by an ES6 generator coroutine that yields every animation frame:

```
[Available Task]
       │
       ▼
 [Claim Task] ──► Set cursor.task, switch cursor shape
       │
       ├──► path  ──► drawPath()  [Pen Tool: place vertices, click, close, fill]
       ├──► rect  ──► drawRect()  [Crosshair: drag bounds, apply styles]
       ├──► text  ──► drawText()  [I-Beam: type characters, animate caret, snap]
       ├──► guide ──► dragGuide() [Rulers slide out, EW/NS cursor drags guide]
       ├──► dup   ──► duplicate() [Option-drag copy, show red spacing metric]
       └──► edit  ──► editText()  [Double-click, select all, retype text]
       │
       ▼
 [Task Done]  ──► Update element state, release overlays, revert to arrow
```

### 3.3 Trajectory Interpolation & Curve Bending
During `moveTo(cursor, target, options)`:
- Duration: $T_{\text{move}} = \text{clamp}(0.12 + 0.021 \cdot \sqrt{\text{dist}}, 0.14, 0.9) / \text{speed}$.
- Perpendicular curvature: a parabolic curve bend is added using sine:
  $$\text{offset}_{\perp} = \sin(\pi \cdot t_{\text{norm}}) \cdot \text{bend} \cdot \min(\text{dist}, 600)$$
- Easing: uses `easeInOutCubic` when dragging, or `easeOutCubic` when traveling.

### 3.4 Realistic Text Typing Cadence
During `type(element, text)`:
- Characters are appended to `element.shown` one by one.
- Base delay between keystrokes: $\Delta t_{\text{key}} \in [0.012, 0.04]\text{s}$.
- Space delay bonus: $+[0, 0.03]\text{s}$.
- Newline delay bonus: $+0.10\text{s}$.
- Thinking pause (2.5% chance): $+[0.08, 0.20]\text{s}$.

### 3.5 Dynamic Guide Snapping & Flash Effect
When a text element is configured with a guide snap:
- The agent drags the text box towards the guide line.
- Once within the 9px snap threshold, the text snaps to the guide axis ($dx=0$ or $dy=0$).
- The guide triggers a red highlight bloom (`flash = 1`), smoothly decaying via $e^{-1.5 \cdot \Delta t}$.

---

## 4. Ruler Animation & Coordinate Projections

1. **Ruler Triggering**: When any agent executes `dragGuide`, `rulers.want` is incremented.
2. **Smooth Slide Transition**: 
   $$t_{\text{target}} = (\text{now} - \text{lastNeed} < 0.7) \ ? \ 1 : 0$$
   $$\text{ruler}_t \leftarrow \text{ruler}_t + (t_{\text{target}} - \text{ruler}_t) \cdot \min(1, 10 \cdot \Delta t)$$
3. **Adaptive Grid Ticks**: 
   - Scale factor $s > 0.6$: 100px major intervals, 50px minor ticks.
   - Scale factor $0.3 < s \le 0.6$: 200px major intervals, 100px minor ticks.
   - Scale factor $s \le 0.3$: 500px major intervals, 250px minor ticks.
4. **Coordinate Overlays**:
   - Projected selection bands are cast onto the top and left rulers in semi-transparent blue (`rgba(13, 153, 255, 0.22)`).
   - Numeric coordinate labels display exact element offsets and dimensions.


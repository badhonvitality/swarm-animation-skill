# Mouse & Agent Cursor Control

## 1. Overview

Mouse control in Swarm operates in dual modes: **Interactive Input** (tracking and reacting to user gestures) and **Autonomous Output** (agents steering, pointing, clicking, and drawing).

---

## 2. Pointer Tracking & Viewport Translation

Mouse positions are captured via the `useMousePosition` hook on the `window` object:
- `pointermove`: Updates position during mouse movement and active touch drags.
- `pointerdown`: Immediately captures initial finger press on mobile/tablet screens.
- `pointerleave`: Sets target to `null` when cursor exits the document.

### Canvas Coordinate Transformation
Screen coordinates $(x_s, y_s)$ are converted into virtual 1280px canvas coordinates:
$$x_c = \frac{x_s - \text{left}}{\text{scale}}, \quad y_c = \frac{\text{scrollY} + y_s}{\text{scale}}$$

---

## 3. Autonomous Lissajous Orbit (Idle State)

When user input is absent ($p_{\text{mouse}} = \text{null}$), the swarm's focal point follows a smooth Lissajous pattern:
$$\begin{aligned}
x_T &= V_w \cdot (0.5 + 0.28 \cdot \sin(0.37 \cdot t)) \\
y_T &= V_h \cdot (0.5 + 0.25 \cdot \sin(0.53 \cdot t + 1))
\end{aligned}$$
This gives the agent flock lifelike autonomy, preventing rigid stillness.

---

## 4. Elastic Mouse Repulsion Boundary (48px)

When the user moves their cursor towards an agent, an elastic repulsion boundary is enforced:
1. **Collision Radius**: $R_{\text{collide}} = 48\text{px}$.
2. **Positional Clamping**: If distance $D < 48\text{px}$, particle position is clamped to the boundary:
   $$\mathbf{p}_i = \mathbf{p}_{\text{mouse}} + \hat{\mathbf{u}} \cdot 48$$
3. **Restitution & Impulse**: If relative velocity along normal $v_{\text{rel}} < 0$, an elastic reflection ($k=1.6$) and outward impulse ($260\text{px/s}$) are applied:
   $$\mathbf{v}_i \leftarrow \mathbf{v}_i - 1.6 \cdot v_{\text{rel}} \cdot \hat{\mathbf{u}} + 260 \cdot \hat{\mathbf{u}}$$

---

## 5. Velocity-Aligned Heading Orientation

Cursors visually rotate to face their movement direction:
$$\theta_{\text{target}} = \text{atan2}(v_y, v_x) \cdot \frac{180^\circ}{\pi} + 128^\circ$$
Angular differences are normalized to $[-180^\circ, 180^\circ]$ to prevent 360-degree flip artifacts:
$$\theta \leftarrow \theta + \Delta\theta \cdot \min(1, 8 \cdot \Delta t)$$

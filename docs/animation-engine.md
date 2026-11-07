# Swarm Animation Engine

## 1. Overview

The Swarm animation engine is responsible for continuous physical simulation, Boids flocking behavior, task dependency scheduling, and collaborative document construction. It executes inside `SwarmEngine.js` and is updated every animation frame via `requestAnimationFrame`.

---

## 2. Mathematical Physics & Flocking Formulas

### 2.1 Dynamic Orbit Radius
The target orbit radius $R_i$ expands and contracts rhythmically while varying for each individual agent:
$$R_{\text{base}} = 135 \cdot \text{scale} \cdot (1 + 0.18 \sin(0.55 t))$$
$$R_i = R_{\text{base}} \cdot (1 + 0.3 \sin(3\psi + 0.7 t)) + (r_{\text{orbit}} - 120) \cdot 0.55 \cdot \text{scale}$$
Where:
- $\psi = \text{atan2}(d_y, d_x)$: Polar angle of the agent relative to target center.
- $r_{\text{orbit}} \in [70, 170]$: Particle-specific orbital deviation.

### 2.2 Tangential Swirl & Alternating Direction
$$\mathbf{F}_{\text{tan}} = 300 \cdot (0.7 + 0.2 \cdot \omega_{\text{spin}}) \cdot \tanh(3 \cos(0.11 t)) \cdot [-\hat{u}_y, \hat{u}_x]^T$$
The hyperbolic tangent term $\tanh(3 \cos(0.11 t))$ smoothly reverses rotation direction every ~28 seconds.

### 2.3 Radial Restoring Spring
$$\mathbf{F}_{\text{rad}} = \text{clamp}(4(R_i - D), -2600, 1400) \cdot [\hat{u}_x, \hat{u}_y]^T$$
Pulls distant agents inward with up to $-2600\text{px/s}^2$ and repels encroaching agents with $+1400\text{px/s}^2$.

### 2.4 Curl Noise Perturbation
$$\mathbf{F}_{\text{curl}} = -400 \cdot c_{\text{curl}} \cdot \text{clamp}\left(\frac{D - R_i}{600}, 0, 1\right) \cdot [-\hat{u}_y, \hat{u}_x]^T$$
Introduces fluid, non-uniform vortices into the flock.

### 2.5 Boids Velocity Alignment (90px Radius)
$$\mathbf{v}_{\text{align}} = \frac{\sum_{j \ne i} \mathbf{v}_j (1 - d_{ij}/90)}{\sum_{j \ne i} (1 - d_{ij}/90)}$$
$$\mathbf{a}_{\text{final}} = 0.7 \mathbf{a}_{\text{target}} + 0.3 \mathbf{v}_{\text{align}}$$

---

## 3. Collaborative Task State Machine

The document construction process is modeled as a Directed Acyclic Graph (DAG) with 237 tasks:

```
[Wait] ──(Dependencies Met + Scrolled into View)──► [Active] ──(Generator Done)──► [Done]
```

### 3.1 Task Generator Coroutines
- **`drawPath` / `drawLogo`**: Moves to first anchor point, switches to `"pen-add"` / `"pen"`, places vertices with click depressions, closes path with `"pen-close"`, and triggers animated fill.
- **`drawRect`**: Switches to crosshair `"cross"`, drags out width and height bounds live, and applies styled background and border radius upon release.
- **`drawText`**: Switches to `"ibeam"`, creates caret indicator, types text with stochastic character delays ($12\text{ms}$–$40\text{ms}$), space pauses, and thinking pauses.
- **`dragGuide`**: Signals rulers to slide out, grabs guide marker from ruler bar with `"ew"`/`"ns"` cursor, and drops guide at target coordinate.
- **`duplicate`**: Selects original component with dimension badge, presses Option key (cursor switches to `"dup"`), drags clone to target offset while displaying live red spacing distance indicators.
- **`editText`**: Double-clicks existing text to highlight all (`.text-sel`), switches to `"ibeam"`, and re-types new copy.


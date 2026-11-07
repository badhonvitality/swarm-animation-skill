# Physics Engine Reference

## 1. Overview

The Swarm physics engine provides continuous mathematical simulation for multi-agent particle systems. It integrates classical Newtonian mechanics, Reynolds Boids flocking rules, harmonic orbital attractors, and curl-noise perturbations to simulate fluid, school-of-fish behavior.

---

## 2. Vector Mathematics & Mechanics

All physical state calculations rely on 2D vector algebra:

### 2.1 State Representation
For each particle $i$:
- Position vector: $\mathbf{p} = [x, y]^T$
- Velocity vector: $\mathbf{v} = [v_x, v_y]^T$
- Acceleration vector: $\mathbf{a} = [a_x, a_y]^T$

### 2.2 Numerical Integration (Euler Step)
State variables are integrated forward each frame over delta time $\Delta t$:
$$\mathbf{v}(t + \Delta t) = \mathbf{v}(t) + \mathbf{a}(t) \cdot \Delta t$$
$$\mathbf{p}(t + \Delta t) = \mathbf{p}(t) + \mathbf{v}(t + \Delta t) \cdot \Delta t$$

---

## 3. Flocking & Steering Forces

When agents are in follow/flocking mode, their accelerations are calculated through 4 additive force components:

```
                  ┌──────────────────────┐
                  │ Target Point (Mouse) │
                  └──────────┬───────────┘
                             │
       ┌─────────────────────┼─────────────────────┐
       ▼                     ▼                     ▼
[Tangential Force]   [Radial Restoring]    [Curl Perturbation]
(Orbital Swirl)      (Spring to Radius)    (Perpendicular Noise)
       │                     │                     │
       └─────────────────────┼─────────────────────┘
                             ▼
                 [Boids Velocity Alignment]
                 (Neighbor Cohesion, 90px)
                             │
                             ▼
                 [Steering Force Clamping]
```

### 3.1 Dynamic Swarm Radius
The target orbital radius $R_i$ breathes harmonically over time and varies by individual orbit characteristics:
$$R_{\text{base}} = 135 \cdot \text{scale} \cdot (1 + 0.18 \cdot \sin(0.55 \cdot t))$$
$$R_i = R_{\text{base}} \cdot (1 + 0.3 \cdot \sin(3\psi + 0.7 \cdot t)) + (r_{\text{orbit}} - 120) \cdot 0.55 \cdot \text{scale}$$
Where:
- $\psi = \text{atan2}(d_y, d_x)$: Polar angle of cursor relative to target center.
- $r_{\text{orbit}} \in [70, 170]$: Particle-specific orbital offset.

### 3.2 Tangential Swirl Force
A force perpendicular to the radial direction drives the swarm to orbit the center:
$$F_{\text{tan}} = 300 \cdot (0.7 + 0.2 \cdot \omega_{\text{spin}}) \cdot A$$
Where:
- $A = \tanh(3 \cdot \cos(0.11 \cdot t))$: Smoothly alternates rotation direction between clockwise and counter-clockwise every ~28 seconds.
- $\omega_{\text{spin}} \in [0.8, 1.8]$: Individual rotational speed multiplier.

### 3.3 Radial Restoring Force
An elastic spring force pulls particles back toward their target orbital radius $R_i$:
$$F_{\text{rad}} = \text{clamp}(4 \cdot (R_i - D), \ -2600, \ 1400)$$
- If the particle is outside the orbit ($D > R_i$), a strong attractive force (up to $-2600\text{px/s}^2$) pulls it inward.
- If too close ($D < R_i$), a repulsive push (up to $+1400\text{px/s}^2$) expands the swarm.

### 3.4 Curl Noise Perturbation
To prevent rigid mechanical circular motion, a curl force introduces organic fluid eddies:
$$S_{\text{curl}} = \text{clamp}\left(\frac{D - R_i}{600}, \ 0, \ 1\right)$$
$$F_{\text{curl}} = -400 \cdot c_{\text{curl}} \cdot S_{\text{curl}}$$
Where $c_{\text{curl}} \in [-1, 1]$ is a random curl sign assigned to each particle.

### 3.5 Combined Target Acceleration Vector
The candidate acceleration before neighbor alignment is:
$$\begin{aligned}
a_x &= -\hat{u}_y \cdot F_{\text{tan}} + \hat{u}_x \cdot F_{\text{rad}} - \hat{u}_y \cdot F_{\text{curl}} \\
a_y &= \hat{u}_x \cdot F_{\text{tan}} + \hat{u}_y \cdot F_{\text{rad}} + \hat{u}_x \cdot F_{\text{curl}}
\end{aligned}$$
Where $(\hat{u}_x, \hat{u}_y) = \mathbf{d} / \|\mathbf{d}\|$ is the unit vector from focal target to particle.

---

## 4. Boids Velocity Alignment (Neighbor Cohesion)

To produce school-of-fish alignment, each agent inspects neighboring cursors within an alignment radius of $R_{\text{align}} = 90\text{px}$:

$$\mathbf{v}_{\text{avg}} = \frac{\sum_{j \ne i} \mathbf{v}_j \cdot \left(1 - \frac{\|\mathbf{p}_j - \mathbf{p}_i\|}{90}\right)}{\sum_{j \ne i} \left(1 - \frac{\|\mathbf{p}_j - \mathbf{p}_i\|}{90}\right)}$$

The final acceleration is blended with neighbor velocity:
$$\mathbf{a} \leftarrow 0.7 \cdot \mathbf{a} + 0.3 \cdot \mathbf{v}_{\text{avg}}$$

---

## 5. Speed & Force Limits with Distance Boosting

When an agent falls far behind the focal target, speed and force limits scale up dynamically to ensure prompt rejoining without lagging behind fast mouse gestures:

### 5.1 Distance from Focal Horizon
$$D_{\text{horizon}} = \max(0, \|\mathbf{p} - \mathbf{T}\| - 180 \cdot \text{scale})$$

### 5.2 Dynamic Velocity Cap
$$v_{\max} = v_{\text{base}} \cdot \left(1.3 + \min\left(3.2, \ \frac{D_{\text{horizon}}}{90}\right)\right)$$
If $\|\mathbf{a}\| > v_{\max}$: $\mathbf{a} \leftarrow \mathbf{a} \cdot \frac{v_{\max}}{\|\mathbf{a}\|}$.

### 5.3 Dynamic Steering Force Cap
$$\mathbf{F}_{\text{steer}} = (\mathbf{a} - \mathbf{v}) \cdot 6$$
$$F_{\max} = F_{\text{base}} \cdot \left(1.4 + \min\left(5.0, \ \frac{D_{\text{horizon}}}{50}\right)\right)$$
If $\|\mathbf{F}_{\text{steer}}\| > F_{\max}$: $\mathbf{F}_{\text{steer}} \leftarrow \mathbf{F}_{\text{steer}} \cdot \frac{F_{\max}}{\|\mathbf{F}_{\text{steer}}\|}$.

---

## 6. Physics Implementation Checklist

- [x] Limit $\Delta t$ to maximum $0.05\text{s}$ to prevent tunneling or destabilization.
- [x] Maintain separation between position $(x, y)$ and velocity $(v_x, v_y)$.
- [x] Apply smooth exponential damping to rotational heading angle $\theta$.
- [x] Calculate elastic collisions using relative normal velocity $((\mathbf{v}_i - \mathbf{v}_{\text{mouse}}) \cdot \hat{\mathbf{n}})$.
- [x] Release temporary forces and resets `press` to 0 via linear decay: `press = max(0, press - dt * 6)`.


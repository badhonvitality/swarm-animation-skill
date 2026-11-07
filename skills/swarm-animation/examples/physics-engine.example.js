/**
 * Example: SwarmPhysicsSimulation
 *
 * Standalone demonstration of Vector2D mathematics, Boids flocking rules,
 * harmonic breathing orbital radius, and elastic mouse collision repulsion.
 */

export class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(v) { this.x += v.x; this.y += v.y; return this; }
  sub(v) { this.x -= v.x; this.y -= v.y; return this; }
  mult(s) { this.x *= s; this.y *= s; return this; }
  mag() { return Math.hypot(this.x, this.y); }
  heading() { return Math.atan2(this.y, this.x); }
  dist(v) { return Math.hypot(this.x - v.x, this.y - v.y); }
}

export function updateSwarmPhysics(particles, target, mouse, dt, time) {
  const baseRadius = 135 * (1 + 0.18 * Math.sin(time * 0.55));
  const dirSwitch = Math.tanh(Math.cos(time * 0.11) * 3);
  const accelerations = [];

  // 1. Compute orbital steering forces per particle
  for (const p of particles) {
    const dx = p.x - target.x;
    const dy = p.y - target.y;
    const dist = Math.hypot(dx, dy) || 0.01;
    const ux = dx / dist;
    const uy = dy / dist;
    const angle = Math.atan2(dy, dx);

    const orbitRadius = baseRadius * (1 + 0.3 * Math.sin(3 * angle + time * 0.7));
    const tanForce = 300 * (0.7 + (p.spin || 1) * 0.2) * dirSwitch;
    const radialForce = Math.max(-2600, Math.min(1400, (orbitRadius - dist) * 4));

    accelerations.push({
      ax: -uy * tanForce + ux * radialForce,
      ay: ux * tanForce + uy * radialForce,
    });
  }

  // 2. Blend with neighbor alignment (Boids cohesion, 90px)
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    let avgVx = 0, avgVy = 0, totalWeight = 0;

    for (let j = 0; j < particles.length; j++) {
      if (i === j) continue;
      const n = particles[j];
      const d = Math.hypot(n.x - p.x, n.y - p.y);
      if (d < 90) {
        const weight = 1 - d / 90;
        avgVx += n.vx * weight;
        avgVy += n.vy * weight;
        totalWeight += weight;
      }
    }

    let { ax, ay } = accelerations[i];
    if (totalWeight > 0) {
      ax = ax * 0.7 + (avgVx / totalWeight) * 0.3;
      ay = ay * 0.7 + (avgVy / totalWeight) * 0.3;
    }

    // Apply steering integration
    p.vx += (ax - p.vx) * 6 * dt;
    p.vy += (ay - p.vy) * 6 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }

  // 3. Elastic collision bounce against mouse pointer (48px radius)
  if (mouse) {
    for (const p of particles) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy) || 0.01;
      if (dist < 48) {
        const nx = dx / dist;
        const ny = dy / dist;
        p.x = mouse.x + nx * 48;
        p.y = mouse.y + ny * 48;

        const relVel = p.vx * nx + p.vy * ny;
        if (relVel < 0) {
          p.vx -= nx * relVel * 1.6;
          p.vy -= ny * relVel * 1.6;
        }
        p.vx += nx * 260;
        p.vy += ny * 260;
      }
    }
  }

  // 4. Update heading rotation towards velocity vector
  for (const p of particles) {
    if (Math.hypot(p.vx, p.vy) > 30) {
      const targetAngle = (((Math.atan2(p.vy, p.vx) * 180) / Math.PI + 128 - p.angle + 540) % 360) - 180;
      p.angle += targetAngle * Math.min(1, dt * 8);
    }
  }
}


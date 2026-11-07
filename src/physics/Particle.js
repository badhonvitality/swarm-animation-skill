import { Vector2D } from './Vector2D.js';

/**
 * Pioneer computer scientist names used for swarm agents.
 */
export const AGENT_NAMES = [
  "Ada",
  "Linus",
  "Grace",
  "Alan",
  "Margaret",
  "Ken",
  "Barbara",
  "Dennis",
  "Radia",
  "Guido",
  "Frances",
  "Bjarne",
  "Hedy",
  "Tim",
  "Katherine",
  "Edsger",
  "Joan",
  "Donald",
  "Sophie",
  "Niklaus",
  "Anita",
  "Brian",
  "Mary",
  "Rob",
  "Ida",
  "Yukihiro",
  "Shafi",
  "Leslie",
  "Jean",
  "Vint",
  "Lynn",
  "Bram",
];

/**
 * Collaborative cursor colors.
 */
export const AGENT_COLORS = [
  "#F24E1E",
  "#A259FF",
  "#1ABCFE",
  "#0ACF83",
  "#FF7262",
  "#FFC700",
  "#9747FF",
  "#E8467C",
  "#14AE5C",
  "#0D99FF",
  "#FF8A00",
  "#00B5CE",
];

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Particle representing an interactive swarm cursor/agent.
 */
export class Particle {
  constructor(id, x, y, home = null) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.home = home;
    this.name = AGENT_NAMES[id % AGENT_NAMES.length];
    this.color = AGENT_COLORS[id % AGENT_COLORS.length];
    this.shape = "arrow";
    this.press = 0;
    this.task = null;
    this.gen = null;
    this.ov = null;
    this.idleFor = 0;
    this.leaving = false;
    this.worked = false;
    this.sticky = false;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;

    const isFast = Math.random() < 0.25;
    if (isFast) {
      this.speed = randomRange(1000, 1500);
      this.force = randomRange(3500, 6000);
      this.spin = randomRange(2.2, 3.4);
    } else {
      this.speed = randomRange(300, 750);
      this.force = randomRange(700, 1800);
      this.spin = randomRange(0.8, 1.8);
    }

    this.curl = randomRange(-1, 1);
    this.ph = randomRange(0, Math.PI * 2);
    this.orbit = randomRange(70, 170);
    this.follow = false;
  }

  getPosition() {
    return new Vector2D(this.x, this.y);
  }

  getVelocity() {
    return new Vector2D(this.vx, this.vy);
  }

  applyForce(fx, fy) {
    this.vx += fx;
    this.vy += fy;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
}


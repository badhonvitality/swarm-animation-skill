import React from 'react';

export interface ViewportState {
  scrollY: number;
  vh: number;
  vw: number;
  s: number;
  left: number;
}

export interface Vector2DLike {
  x: number;
  y: number;
}

export declare class Vector2D {
  x: number;
  y: number;
  constructor(x?: number, y?: number);
  set(x: number, y: number): this;
  clone(): Vector2D;
  add(v: Vector2DLike): this;
  sub(v: Vector2DLike): this;
  mult(s: number): this;
  div(s: number): this;
  mag(): number;
  magSq(): number;
  heading(): number;
  normalize(): this;
  limit(max: number): this;
  dist(v: Vector2DLike): number;
  dot(v: Vector2DLike): number;
  static add(v1: Vector2DLike, v2: Vector2DLike): Vector2D;
  static sub(v1: Vector2DLike, v2: Vector2DLike): Vector2D;
  static mult(v: Vector2DLike, s: number): Vector2D;
  static dist(v1: Vector2DLike, v2: Vector2DLike): number;
  static fromAngle(theta: number, length?: number): Vector2D;
  static lerp(v1: Vector2DLike, v2: Vector2DLike, t: number): Vector2D;
  static clamp(val: number, min: number, max: number): number;
}

export declare class Particle {
  id: number;
  x: number;
  y: number;
  home: Vector2DLike | null;
  name: string;
  color: string;
  shape: string;
  press: number;
  task: any | null;
  gen: Generator | null;
  ov: (() => any[]) | null;
  idleFor: number;
  leaving: boolean;
  worked: boolean;
  sticky: boolean;
  vx: number;
  vy: number;
  angle: number;
  speed: number;
  force: number;
  spin: number;
  curl: number;
  ph: number;
  orbit: number;
  follow: boolean;
  constructor(id: number, x: number, y: number, home?: Vector2DLike | null);
  getPosition(): Vector2D;
  getVelocity(): Vector2D;
  applyForce(fx: number, fy: number): void;
  update(dt: number): void;
}

export declare class SwarmEngine {
  els: Map<string, any>;
  list: any[];
  tasks: any[];
  byTask: Map<string, any>;
  groups: Map<string, any>;
  cursors: Particle[];
  vp: ViewportState;
  started: boolean;
  frontier: number;
  vel: number;
  tempo: number;
  time: number;
  height: number;
  mouse: Vector2DLike | null;
  retiredWorkers: number;
  flocking: boolean;
  constructor();
  makeCursor(x: number, y: number, home?: Vector2DLike | null): Particle;
  isSticky(task: any): boolean;
  fromViewport(x: number, y: number): Vector2DLike;
  start(): void;
  setScroll(scrollY: number): void;
  step(dt: number): void;
}

export declare const CANVAS_WIDTH: number;
export declare const MARGIN: number;
export declare const RIGHT_EDGE: number;
export declare const COLOR_PALETTE: {
  ink: string;
  muted: string;
  line: string;
  accent: string;
  card: string;
  code: string;
};
export declare const SELECTION_COLOR: string;
export declare const GUIDE_COLOR: string;
export declare const TYPOGRAPHY: Record<string, any>;
export declare const LOGO_PATHS: Array<{ d: string; anchors: number[][] }>;
export declare const CURSOR_OFFSETS: Record<string, [number, number]>;
export declare const CURSOR_ARROW_PATH: string;
export declare const AGENT_NAMES: string[];
export declare const AGENT_COLORS: string[];

export declare function measureText(text: string, style: any, size: number, maxWidth?: number): { w: number; h: number; lines: number[] };
export declare function getFontFamily(style: any): string;
export declare function getLineHeight(style: any, size?: number): number;
export declare function buildDocumentLayout(getWorkerCount: () => number): { els: any[]; tasks: any[]; groups: any[]; height: number };

export declare const SwarmCanvas: React.FC<{ engine: SwarmEngine }>;
export declare const MainCanvas: React.FC<{ engine: SwarmEngine }>;
export declare const StickyNavCanvas: React.FC<{ engine: SwarmEngine }>;
export declare const OverlayLayer: React.FC<{ engine: SwarmEngine }>;
export declare const TextElement: React.FC<{ el: any; v?: number }>;
export declare const RectElement: React.FC<{ el: any; v?: number }>;
export declare const PathElement: React.FC<{ el: any; v?: number }>;
export declare const CanvasSurface: React.FC<{ elements: any[]; height: number }>;
export declare const SyntaxHighlighter: React.FC<{ text: string }>;

export declare const Cursor: React.FC<{ cursor: Particle; X: number; Y: number }>;
export declare const CursorIcon: React.FC<{ shape: string; color: string }>;
export declare const CursorsLayer: React.FC<{ engine: SwarmEngine }>;

export declare const Rulers: React.FC<{ engine: SwarmEngine }>;
export declare const IntroLogo: React.FC<{ started: boolean }>;

export declare function useMousePosition(engine?: SwarmEngine | null): Vector2DLike | null;
export declare function useAnimationLoop(onStep: (dt: number, currentTime: number) => void, enabled?: boolean): void;
export declare const SwarmApp: React.FC;


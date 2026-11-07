/**
 * Swarm Animation Skill - Library Entrypoint
 *
 * Exports all physics engines, vector classes, particle models,
 * React components, and custom animation hooks.
 */

export {
  SwarmEngine,
  CANVAS_WIDTH,
  MARGIN,
  RIGHT_EDGE,
  COLOR_PALETTE,
  SELECTION_COLOR,
  GUIDE_COLOR,
  TYPOGRAPHY,
  LOGO_PATHS,
  CURSOR_OFFSETS,
  CURSOR_ARROW_PATH,
  measureText,
  getFontFamily,
  getLineHeight,
  buildDocumentLayout,
} from './physics/SwarmEngine.js';

export { Vector2D } from './physics/Vector2D.js';
export { Particle, AGENT_NAMES, AGENT_COLORS } from './physics/Particle.js';

export {
  SwarmCanvas,
  MainCanvas,
  StickyNavCanvas,
  OverlayLayer,
  TextElement,
  RectElement,
  PathElement,
  CanvasSurface,
  SyntaxHighlighter,
} from './components/SwarmCanvas.jsx';

export {
  Cursor,
  CursorIcon,
  CursorsLayer,
} from './components/Cursor.jsx';

export {
  Rulers,
  IntroLogo,
} from './components/Controls.jsx';

export { useMousePosition } from './hooks/useMousePosition.js';
export { useAnimationLoop } from './hooks/useAnimationLoop.js';
export { App as SwarmApp } from './App.jsx';

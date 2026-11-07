import React from 'react';
import {
  RULER_THICKNESS,
  GUIDE_COLOR,
  LOGO_PATHS,
  COLOR_PALETTE,
} from '../physics/SwarmEngine.js';

/**
 * Centered introductory logo displayed prior to user scroll or start.
 */
export function IntroLogo({ started }) {
  return (
    <div
      className={`intro-logo${started ? ' gone' : ''}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 140" width={60} height={70}>
        {LOGO_PATHS.map((pathSpec, idx) => (
          <path key={idx} d={pathSpec.d} fill={COLOR_PALETTE.line} />
        ))}
      </svg>
    </div>
  );
}

/**
 * Figma-style coordinate rulers displayed along the top and left margins.
 */
export function Rulers({ engine }) {
  const rulerProgress = engine.rulers.t;
  if (rulerProgress <= 0.001) return null;

  const {
    s: scale,
    left,
    vw: viewportWidth,
    vh: viewportHeight,
    scrollY,
  } = engine.vp;

  const step = scale > 0.6 ? 100 : scale > 0.3 ? 200 : 500;
  const topSvgChildren = [];
  const leftSvgChildren = [];

  // Top ruler tick marks & coordinate text
  const startX = Math.floor(-left / scale / step) * step;
  for (let c = startX; left + c * scale < viewportWidth; c += step / 2) {
    const xPos = left + c * scale;
    const isMajor = c % step === 0;

    topSvgChildren.push(
      <line
        key={'t' + c}
        x1={xPos}
        x2={xPos}
        y1={isMajor ? 13 : 16}
        y2={RULER_THICKNESS}
        stroke="#5E5E5E"
      />,
    );

    if (isMajor) {
      topSvgChildren.push(
        <text
          key={'l' + c}
          x={xPos + 3}
          y={11}
          className="rtext"
        >
          {c}
        </text>,
      );
    }
  }

  // Left ruler tick marks & coordinate text
  const startY = Math.floor(scrollY / scale / step) * step;
  for (let c = startY; c * scale - scrollY < viewportHeight; c += step / 2) {
    const yPos = c * scale - scrollY;
    const isMajor = c % step === 0;

    leftSvgChildren.push(
      <line
        key={'t' + c}
        y1={yPos}
        y2={yPos}
        x1={isMajor ? 13 : 16}
        x2={RULER_THICKNESS}
        stroke="#5E5E5E"
      />,
    );

    if (isMajor) {
      leftSvgChildren.push(
        <text
          key={'l' + c}
          x={11}
          y={yPos - 3}
          className="rtext"
          transform={`rotate(-90 11 ${yPos - 3})`}
        >
          {c}
        </text>,
      );
    }
  }

  // Active cursor selection projections on rulers
  for (const cursor of engine.cursors) {
    if (cursor.ov) {
      for (const item of cursor.ov()) {
        if (item.t !== 'box' || !item.handles) continue;

        const x1 = left + item.b.x * scale;
        const x2 = left + (item.b.x + item.b.w) * scale;
        const y1 = item.b.y * scale - scrollY;
        const y2 = (item.b.y + item.b.h) * scale - scrollY;

        topSvgChildren.unshift(
          <rect
            key={'s' + cursor.id}
            x={x1}
            y={0}
            width={x2 - x1}
            height={RULER_THICKNESS}
            fill="rgba(13,153,255,0.22)"
          />,
        );

        topSvgChildren.push(
          <text
            key={'sa' + cursor.id}
            x={x1 + 3}
            y={11}
            className="rtext rsel"
          >
            {Math.round(item.b.x)}
          </text>,
        );

        leftSvgChildren.unshift(
          <rect
            key={'s' + cursor.id}
            y={y1}
            x={0}
            height={y2 - y1}
            width={RULER_THICKNESS}
            fill="rgba(13,153,255,0.22)"
          />,
        );
      }
    }
  }

  // Active dragged guide projections on rulers
  for (const el of engine.list) {
    if (el.kind === 'guide' && el.dragging) {
      if (el.axis === 'x') {
        const xPos = left + el.cur * scale;
        topSvgChildren.push(
          <line
            key={'g' + el.id}
            x1={xPos}
            x2={xPos}
            y1={0}
            y2={RULER_THICKNESS}
            stroke={GUIDE_COLOR}
          />,
        );
        topSvgChildren.push(
          <text
            key={'gl' + el.id}
            x={xPos + 4}
            y={11}
            className="rtext"
            fill={GUIDE_COLOR}
          >
            {Math.round(el.cur)}
          </text>,
        );
      } else {
        const yPos = el.cur * scale - scrollY;
        leftSvgChildren.push(
          <line
            key={'g' + el.id}
            y1={yPos}
            y2={yPos}
            x1={0}
            x2={RULER_THICKNESS}
            stroke={GUIDE_COLOR}
          />,
        );
      }
    }
  }

  return (
    <>
      <div
        className="ruler ruler-top"
        style={{
          transform: `translateY(${(rulerProgress - 1) * 100}%)`,
        }}
      >
        <svg width={viewportWidth} height={RULER_THICKNESS}>
          {topSvgChildren}
        </svg>
      </div>

      <div
        className="ruler ruler-left"
        style={{
          transform: `translateX(${(rulerProgress - 1) * 100}%)`,
        }}
      >
        <svg width={RULER_THICKNESS} height={viewportHeight}>
          {leftSvgChildren}
        </svg>
      </div>

      <div
        className="ruler-corner"
        style={{ opacity: rulerProgress }}
      />
    </>
  );
}

export default Rulers;


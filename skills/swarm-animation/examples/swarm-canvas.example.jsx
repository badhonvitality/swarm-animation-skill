import React from 'react';

/**
 * Example: SwarmCanvas
 *
 * Demonstrates the 3-layer hybrid rendering architecture:
 * 1. DOM Elements (Text with typing caret, Rectangles with drag handles)
 * 2. SVG Paths (Drafting lines, logo assemblies, connections)
 * 3. Dynamic Overlays (Measurement badges, guides, selection boxes)
 */

export const TextElement = React.memo(
  function TextElement({ el }) {
    if (!el.vis) return null;
    return (
      <div
        className="el-text"
        style={{
          position: 'absolute',
          left: el.x + (el.dx || 0),
          top: el.y + (el.dy || 0),
          width: el.w,
          fontSize: el.size,
          fontFamily: 'Inter, sans-serif',
          color: el.st?.color || '#121417',
        }}
      >
        {el.shown}
        {el.editing && <span className="caret" />}
      </div>
    );
  },
  (prev, next) => prev.v === next.v,
);

export const RectElement = React.memo(
  function RectElement({ el }) {
    if (!el.vis) return null;
    const w = el.draw?.w ?? el.w;
    const h = el.draw?.h ?? el.h;
    return (
      <div
        className="el-rect"
        style={{
          position: 'absolute',
          left: el.x + (el.dx || 0),
          top: el.y + (el.dy || 0),
          width: w,
          height: h,
          background: el.styled ? el.fill : '#D9D9D9',
          borderRadius: el.styled ? el.r : 0,
        }}
      />
    );
  },
  (prev, next) => prev.v === next.v,
);

export function SwarmCanvas({ elements, width = 1280, height = 800, scale = 1, left = 0 }) {
  return (
    <div
      className="canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        transform: `translateX(${left}px) scale(${scale})`,
        transformOrigin: '0 0',
      }}
    >
      {elements.map((el) =>
        el.kind === 'rect' ? <RectElement key={el.id} el={el} v={el.v} /> : null,
      )}
      <svg className="paths" width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
        {elements.map((el) =>
          el.kind === 'path' && el.vis ? (
            <path
              key={el.id}
              d={el.d || el.pts?.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ')}
              stroke={el.stroke || '#D7DADE'}
              strokeWidth={el.sw || 1}
              fill={el.fill || 'none'}
            />
          ) : null,
        )}
      </svg>
      {elements.map((el) =>
        el.kind === 'text' ? <TextElement key={el.id} el={el} v={el.v} /> : null,
      )}
    </div>
  );
}

export default SwarmCanvas;


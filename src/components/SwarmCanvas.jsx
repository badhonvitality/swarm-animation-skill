import React from 'react';
import {
  CANVAS_WIDTH,
  SELECTION_COLOR,
  GUIDE_COLOR,
  RULER_THICKNESS,
  NAV_MARGIN_TOP,
  NAV_HEIGHT,
  getFontFamily,
  getLineHeight,
} from '../physics/SwarmEngine.js';

/**
 * Tokenizes YAML code lines into syntax-highlighted React spans.
 */
export function SyntaxHighlighter({ text }) {
  if (text.trimStart().startsWith('#')) {
    return <span style={{ color: '#6B7078' }}>{text}</span>;
  }

  const parts = [];
  const regex = /([A-Za-z_]+)(?=:)|([{}:,])|([^{}:,A-Za-z_]+|[A-Za-z_]+)/g;
  let match;
  let keyIndex = 0;
  let isFirstKey = true;

  while ((match = regex.exec(text)) !== null) {
    if (match[1]) {
      parts.push(
        <span
          key={keyIndex++}
          style={{ color: isFirstKey ? '#8FC9D6' : '#AEB6EE' }}
        >
          {match[1]}
        </span>,
      );
      isFirstKey = false;
    } else if (match[2]) {
      parts.push(
        <span key={keyIndex++} style={{ color: '#81868D' }}>
          {match[2]}
        </span>,
      );
    } else {
      parts.push(match[3]);
    }
  }

  return parts;
}

/**
 * Memoized renderer for text elements.
 */
export const TextElement = React.memo(
  function TextElement({ el }) {
    if (!el.vis) return null;

    const style = el.st;
    let content;
    if (el.selAll) {
      content = <span className="text-sel">{el.shown}</span>;
    } else if (style.code) {
      content = <SyntaxHighlighter text={el.shown} />;
    } else {
      content = el.shown;
    }

    return (
      <div
        className="el-text"
        style={{
          left: el.x + el.dx,
          top: el.y + el.dy,
          width: el.w,
          whiteSpace: el.w != null && !style.pre ? 'pre-wrap' : 'pre',
          fontFamily: getFontFamily(style),
          fontSize: el.size,
          fontWeight: style.weight,
          lineHeight: `${getLineHeight(style, el.size)}px`,
          letterSpacing: `${style.ls ?? 0}em`,
          color: style.color,
          textAlign: el.align,
        }}
      >
        {content}
        {el.editing && !el.selAll && (
          <span
            className="caret"
            style={{ height: el.size * 1.15 }}
          />
        )}
      </div>
    );
  },
  (prev, next) => prev.v === next.v,
);

/**
 * Memoized renderer for rectangular elements (cards, buttons, window mockups).
 */
export const RectElement = React.memo(
  function RectElement({ el }) {
    if (!el.vis) return null;

    const w = el.draw?.w ?? el.w;
    const h = el.draw?.h ?? el.h;

    return (
      <div
        className="el-rect"
        style={{
          left: el.x + el.dx,
          top: el.y + el.dy,
          width: w,
          height: h,
          background: el.styled ? el.fill : '#D9D9D9',
          borderRadius: el.styled ? el.r : 0,
          boxShadow:
            el.styled && el.stroke ? `inset 0 0 0 1px ${el.stroke}` : 'none',
        }}
      />
    );
  },
  (prev, next) => prev.v === next.v,
);

/**
 * Memoized renderer for SVG path elements.
 */
export const PathElement = React.memo(
  function PathElement({ el }) {
    if (!el.vis || el.placed === 0) return null;

    if (el.d && el.tf) {
      const progress = Math.min(1, (el.placed - 1) / el.pts.length);
      return (
        <path
          d={el.d}
          transform={`translate(${el.tf.x} ${el.tf.y}) scale(${el.tf.s})`}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - progress}
          stroke={el.stroke}
          strokeWidth={1.2 / el.tf.s}
          fill={el.fill}
          fillOpacity={el.fillOn ? 1 : 0}
          style={{
            transition: 'fill-opacity 220ms ease, stroke-dashoffset 120ms linear',
          }}
        />
      );
    }

    const pathData =
      el.pts
        .slice(0, el.placed)
        .map((p, idx) => `${idx ? 'L' : 'M'}${p.x} ${p.y}`)
        .join(' ') + (el.shut ? ' Z' : '');

    return (
      <path
        d={pathData}
        stroke={el.stroke}
        strokeWidth={el.sw}
        fill={el.fill ?? 'none'}
        fillOpacity={el.fillOn ? 1 : 0}
        style={{ transition: 'fill-opacity 220ms ease' }}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
    );
  },
  (prev, next) => prev.v === next.v,
);

/**
 * Canvas plane surface combining rects, paths SVG, and text elements.
 */
export function CanvasSurface({ elements, height }) {
  return (
    <>
      {elements.map((el) =>
        el.kind === 'rect' ? <RectElement key={el.id} el={el} v={el.v} /> : null,
      )}
      <svg className="paths" width={CANVAS_WIDTH} height={height}>
        {elements.map((el) =>
          el.kind === 'path' ? <PathElement key={el.id} el={el} v={el.v} /> : null,
        )}
      </svg>
      {elements.map((el) =>
        el.kind === 'text' ? <TextElement key={el.id} el={el} v={el.v} /> : null,
      )}
    </>
  );
}

/**
 * Main Canvas rendering non-sticky document layout elements.
 */
export function MainCanvas({ engine }) {
  const { s: scale, left } = engine.vp;
  const nonStickyElements = engine.list.filter((el) => !el.sticky);

  return (
    <div
      className="canvas"
      style={{
        width: CANVAS_WIDTH,
        height: engine.height,
        transform: `translateX(${left}px) scale(${scale})`,
      }}
    >
      <CanvasSurface elements={nonStickyElements} height={engine.height} />
    </div>
  );
}

/**
 * Sticky Navigation bar canvas pinned to top.
 */
export function StickyNavCanvas({ engine }) {
  const { s: scale, left } = engine.vp;
  const stickyElements = engine.list.filter((el) => el.sticky);
  const anyVisible = stickyElements.some((el) => el.vis);

  return (
    <div
      className="nav-sticky"
      style={{
        marginTop: NAV_MARGIN_TOP * scale,
        height: NAV_HEIGHT * scale,
        top: RULER_THICKNESS * engine.rulers.t,
      }}
    >
      {anyVisible && <div className="nav-backdrop" />}
      <div
        className="nav-canvas"
        style={{
          width: CANVAS_WIDTH,
          transform: `translateX(${left}px) scale(${scale}) translateY(${-NAV_MARGIN_TOP}px)`,
        }}
      >
        <CanvasSurface
          elements={stickyElements}
          height={NAV_MARGIN_TOP + NAV_HEIGHT + 30}
        />
      </div>
    </div>
  );
}

/**
 * Overlay layer displaying active selections, guides, handles, and measurements.
 */
export function OverlayLayer({ engine }) {
  const { s: scale, left, vw: viewportWidth, scrollY } = engine.vp;
  const toScreenX = (x) => left + x * scale;
  const toScreenY = (y) => y * scale;
  const totalHeight = engine.height * scale;

  const svgElements = [];
  const badgeElements = [];
  let keyIndex = 0;

  // Render guides and pen tool drafting paths
  for (const el of engine.list) {
    if (el.kind === 'guide' && el.vis && el.op > 0) {
      const dropShadow =
        el.flash > 0
          ? `drop-shadow(0 0 ${2 + el.flash * 3}px ${GUIDE_COLOR})`
          : undefined;
      const strokeWidth = 1 + el.flash;

      if (el.axis === 'x') {
        svgElements.push(
          <line
            key={keyIndex++}
            x1={toScreenX(el.cur)}
            x2={toScreenX(el.cur)}
            y1={0}
            y2={totalHeight}
            stroke={GUIDE_COLOR}
            strokeWidth={strokeWidth}
            opacity={el.op}
            style={{ filter: dropShadow }}
          />,
        );
      } else {
        svgElements.push(
          <line
            key={keyIndex++}
            x1={0}
            x2={viewportWidth}
            y1={toScreenY(el.cur)}
            y2={toScreenY(el.cur)}
            stroke={GUIDE_COLOR}
            strokeWidth={strokeWidth}
            opacity={el.op}
            style={{ filter: dropShadow }}
          />,
        );
      }
    }

    if (el.kind === 'path' && el.edit) {
      const stickyOffset = el.sticky ? engine.stick : 0;
      const screenPts = el.pts
        .slice(0, el.placed)
        .map((p) => ({ x: toScreenX(p.x), y: toScreenY(p.y + stickyOffset) }));
      const ownerCursor =
        el.owner != null ? engine.cursors.find((c) => c.id === el.owner) : null;
      const fullPolylinePts = [
        ...screenPts,
        ...(ownerCursor
          ? [
              {
                x: toScreenX(ownerCursor.x),
                y: toScreenY(ownerCursor.y + stickyOffset),
              },
            ]
          : []),
      ];

      svgElements.push(
        <polyline
          key={keyIndex++}
          points={
            fullPolylinePts.map((p) => `${p.x},${p.y}`).join(' ') +
            (el.shut ? ` ${screenPts[0].x},${screenPts[0].y}` : '')
          }
          fill="none"
          stroke={SELECTION_COLOR}
          strokeWidth={1.5}
        />,
      );

      screenPts.forEach((p) => {
        svgElements.push(
          <circle
            key={keyIndex++}
            cx={p.x}
            cy={p.y}
            r={3.6}
            fill="#fff"
            stroke={SELECTION_COLOR}
            strokeWidth={1.5}
          />,
        );
      });
    }
  }

  // Render cursor active task overlays (selection boxes, badges, drag outlines)
  const rulerProgress = engine.rulers.t;
  for (const cursor of engine.cursors) {
    if (!cursor.ov) continue;
    const toCursorY = (y) => (y + (cursor.sticky ? engine.stick : 0)) * scale;

    for (const item of cursor.ov()) {
      if (item.t === 'box') {
        const boxX = toScreenX(item.b.x);
        const boxY = toCursorY(item.b.y);
        const boxW = item.b.w * scale;
        const boxH = item.b.h * scale;
        const strokeColor = item.color === 'red' ? GUIDE_COLOR : SELECTION_COLOR;

        svgElements.push(
          <rect
            key={keyIndex++}
            x={boxX}
            y={boxY}
            width={boxW}
            height={boxH}
            fill="none"
            stroke={strokeColor}
            strokeWidth={1}
          />,
        );

        if (item.underline && item.underline.w > 0) {
          svgElements.push(
            <line
              key={keyIndex++}
              x1={toScreenX(item.underline.x)}
              x2={toScreenX(item.underline.x + item.underline.w)}
              y1={toCursorY(item.underline.y)}
              y2={toCursorY(item.underline.y)}
              stroke={SELECTION_COLOR}
              strokeWidth={1.5}
            />,
          );
        }

        if (item.rulerLines && rulerProgress > 0.05) {
          svgElements.push(
            <g
              key={keyIndex++}
              stroke={SELECTION_COLOR}
              strokeWidth={1}
              strokeDasharray="2 2"
              opacity={rulerProgress}
            >
              <line
                x1={RULER_THICKNESS}
                x2={boxX}
                y1={boxY + boxH / 2}
                y2={boxY + boxH / 2}
              />
              <line
                x1={boxX + boxW / 2}
                x2={boxX + boxW / 2}
                y1={scrollY + RULER_THICKNESS}
                y2={boxY}
              />
            </g>,
          );
        }

        if (item.handles) {
          const cornerPoints = [
            [boxX, boxY],
            [boxX + boxW, boxY],
            [boxX, boxY + boxH],
            [boxX + boxW, boxY + boxH],
          ];
          for (const [hx, hy] of cornerPoints) {
            svgElements.push(
              <rect
                key={keyIndex++}
                x={hx - 3.5}
                y={hy - 3.5}
                width={7}
                height={7}
                fill="#fff"
                stroke={SELECTION_COLOR}
                strokeWidth={1}
              />,
            );
          }
        }

        if (item.badge && boxW > 0) {
          badgeElements.push(
            <div
              key={keyIndex++}
              className="badge"
              style={{
                left: boxX + boxW / 2,
                top: boxY + boxH + 8,
                background: strokeColor,
              }}
            >
              {item.badge}
            </div>,
          );
        }
      } else if (item.t === 'measure') {
        const ptA = { x: toScreenX(item.a.x), y: toCursorY(item.a.y) };
        const ptB = { x: toScreenX(item.b.x), y: toCursorY(item.b.y) };

        svgElements.push(
          <line
            key={keyIndex++}
            x1={ptA.x}
            y1={ptA.y}
            x2={ptB.x}
            y2={ptB.y}
            stroke={GUIDE_COLOR}
            strokeWidth={1}
          />,
        );

        const isHorizontal = ptA.y === ptB.y;
        badgeElements.push(
          <div
            key={keyIndex++}
            className="badge"
            style={{
              left: isHorizontal ? (ptA.x + ptB.x) / 2 : ptA.x + 18,
              top: isHorizontal ? ptA.y + 8 : (ptA.y + ptB.y) / 2 - 9,
              background: GUIDE_COLOR,
            }}
          >
            {item.label}
          </div>,
        );
      }
    }
  }

  return (
    <div className="overlay" style={{ height: totalHeight }}>
      <svg width={viewportWidth} height={totalHeight}>
        {svgElements}
      </svg>
      {badgeElements}
    </div>
  );
}

/**
 * Combined SwarmCanvas component.
 */
export function SwarmCanvas({ engine }) {
  return (
    <>
      <StickyNavCanvas engine={engine} />
      <MainCanvas engine={engine} />
      <OverlayLayer engine={engine} />
    </>
  );
}

export default SwarmCanvas;

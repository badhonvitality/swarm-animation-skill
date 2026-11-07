import React from 'react';

/**
 * Example: AgentCursor
 *
 * Demonstrates the 9 collaborative cursor shapes, tip hotspot offsets,
 * natural velocity heading rotation, and click-depression scaling.
 */

export const CURSOR_OFFSETS = {
  arrow: [5, 3.5],
  dup: [5, 3.5],
  pen: [3, 3],
  'pen-add': [3, 3],
  'pen-close': [3, 3],
  cross: [12, 12],
  ibeam: [12, 12],
  ew: [12, 12],
  ns: [12, 12],
};

const ARROW_PATH =
  'M4.6 3.9 C4.2 3.1 4.9 2.4 5.7 2.8 L20.6 9.4 C21.5 9.8 21.4 11.1 20.4 11.3 L13.9 12.9 C13.4 13 13 13.4 12.9 13.9 L11.3 20.4 C11.1 21.4 9.8 21.5 9.4 20.6 Z';

export function AgentCursorIcon({ shape = 'arrow', color = '#0D99FF' }) {
  const strokeProps = { stroke: '#fff', strokeWidth: 1.5, strokeLinejoin: 'round' };

  switch (shape) {
    case 'arrow':
      return <path d={ARROW_PATH} fill={color} {...strokeProps} />;
    case 'cross':
      return (
        <g strokeLinecap="round">
          <path d="M12 3.5 V20.5 M3.5 12 H20.5" stroke="#fff" strokeWidth={3.6} />
          <path d="M12 3.5 V20.5 M3.5 12 H20.5" stroke={color} strokeWidth={1.5} />
        </g>
      );
    case 'ibeam': {
      const p = 'M8.5 4.5 H10.5 Q12 4.5 12 6 Q12 4.5 13.5 4.5 H15.5 M12 6 V18 M8.5 19.5 H10.5 Q12 19.5 12 18 Q12 19.5 13.5 19.5 H15.5';
      return (
        <g fill="none" strokeLinecap="round">
          <path d={p} stroke="#fff" strokeWidth={3.6} />
          <path d={p} stroke={color} strokeWidth={1.5} />
        </g>
      );
    }
    default:
      return <path d={ARROW_PATH} fill={color} {...strokeProps} />;
  }
}

export function AgentCursor({ x, y, angle = 0, press = 0, shape = 'arrow', color = '#0D99FF', name }) {
  const [ox, oy] = CURSOR_OFFSETS[shape] || [5, 3.5];
  const scale = 1 - press * 0.12;

  return (
    <div
      className="cursor"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        transform: `translate(${x}px, ${y}px)`,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    >
      <svg
        width={28}
        height={28}
        viewBox="0 0 28 28"
        style={{
          transform: `translate(${-ox}px, ${-oy}px) rotate(${angle}deg) scale(${scale})`,
          transformOrigin: `${ox}px ${oy}px`,
        }}
      >
        <AgentCursorIcon shape={shape} color={color} />
      </svg>
      {name && (
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 14,
            background: color,
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 6px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </div>
      )}
    </div>
  );
}

export default AgentCursor;


import { useEffect, useState, useCallback } from 'react';

/**
 * Example: useMouseTracking
 *
 * Standalone custom hook tracking pointer/mouse/touch coordinates
 * and mapping screen space coordinates into virtual canvas space.
 *
 * @param {object} viewport Viewport scaling parameters { s: scale, left: gutterX, scrollY: windowScrollY }
 * @returns {{ mouse: { x: number, y: number } | null, canvasMouse: { x: number, y: number } | null }}
 */
export function useMouseTracking(viewport = { s: 1, left: 0, scrollY: 0 }) {
  const [screenPos, setScreenPos] = useState(null);

  const handlePointer = useCallback((e) => {
    setScreenPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleLeave = useCallback(() => {
    setScreenPos(null);
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointer, { passive: true });
    window.addEventListener('pointerdown', handlePointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', handleLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('pointerdown', handlePointer);
      document.documentElement.removeEventListener('pointerleave', handleLeave);
    };
  }, [handlePointer, handleLeave]);

  const canvasMouse = screenPos
    ? {
        x: (screenPos.x - (viewport.left || 0)) / (viewport.s || 1),
        y: ((viewport.scrollY || 0) + screenPos.y) / (viewport.s || 1),
      }
    : null;

  return {
    mouse: screenPos,
    canvasMouse,
  };
}

export default useMouseTracking;


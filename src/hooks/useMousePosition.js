import { useEffect, useState } from 'react';

/**
 * Hook to track mouse / pointer position across the window.
 *
 * @param {object} [engine] Optional SwarmEngine instance to sync with directly.
 * @returns {{ x: number, y: number } | null} Current mouse coordinates or null if outside.
 */
export function useMousePosition(engine) {
  const [mousePosition, setMousePosition] = useState(null);

  useEffect(() => {
    const handlePointerMove = (e) => {
      const pos = { x: e.clientX, y: e.clientY };
      setMousePosition(pos);
      if (engine) {
        engine.mouse = pos;
      }
    };

    const handlePointerLeave = () => {
      setMousePosition(null);
      if (engine) {
        engine.mouse = null;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      if (engine) {
        engine.mouse = null;
      }
    };
  }, [engine]);

  return mousePosition;
}


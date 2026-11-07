import { useEffect, useRef } from 'react';

/**
 * Hook to run an optimized requestAnimationFrame animation loop.
 *
 * @param {Function} onStep Callback invoked each frame with delta time in seconds.
 * @param {boolean} [enabled=true] Whether the animation loop is running.
 */
export function useAnimationLoop(onStep, enabled = true) {
  const onStepRef = useRef(onStep);
  onStepRef.current = onStep;

  useEffect(() => {
    if (!enabled) return;

    let animId = 0;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      if (onStepRef.current) {
        onStepRef.current(dt, currentTime);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [enabled]);
}


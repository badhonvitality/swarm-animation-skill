import React, { useEffect, useState } from 'react';
import { CANVAS_WIDTH, SwarmEngine } from './physics/SwarmEngine.js';
import { MainCanvas, StickyNavCanvas, OverlayLayer } from './components/SwarmCanvas.jsx';
import { CursorsLayer } from './components/Cursor.jsx';
import { Rulers, IntroLogo } from './components/Controls.jsx';
import { useMousePosition } from './hooks/useMousePosition.js';
import { useAnimationLoop } from './hooks/useAnimationLoop.js';

export function App() {
  const [engine, setEngine] = useState(null);
  const [, setTick] = useState(0);

  // Initialize engine after preloading fonts
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const fontsToLoad = [
      '400 16px Inter',
      '500 16px Inter',
      '600 16px Inter',
      '400 16px "JetBrains Mono"',
      '500 16px "JetBrains Mono"',
    ];

    const fallbackTimeout = new Promise((resolve) => setTimeout(resolve, 2500));
    const fontPromises =
      document.fonts && document.fonts.load
        ? Promise.all(fontsToLoad.map((f) => document.fonts.load(f)))
        : Promise.resolve();

    Promise.race([fontPromises, fallbackTimeout]).then(() => {
      setEngine(new SwarmEngine());
    });
  }, []);

  // Sync mouse position with engine
  useMousePosition(engine);

  // Viewport resize and scroll event synchronization
  useEffect(() => {
    if (!engine) return;

    const updateDimensions = () => {
      const clientW = document.documentElement.clientWidth;
      const scale = Math.min(1, clientW / CANVAS_WIDTH);
      engine.vp.vw = clientW;
      engine.vp.vh = window.innerHeight;
      engine.vp.s = scale;
      engine.vp.left = (clientW - CANVAS_WIDTH * scale) / 2;
    };

    window.swarm = engine;

    const handleScroll = () => engine.setScroll(window.scrollY);
    const handleWheel = () => {
      if (window.scrollY > 0) {
        engine.start();
      }
    };

    updateDimensions();
    handleScroll();

    window.addEventListener('resize', updateDimensions);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [engine]);

  // Main animation step loop
  useAnimationLoop((dt) => {
    if (!engine) return;
    engine.step(dt);
    setTick((t) => t + 1);
  }, Boolean(engine));

  if (!engine) {
    return null;
  }

  return (
    <>
      <div
        className="page"
        style={{ height: engine.height * engine.vp.s }}
      >
        <StickyNavCanvas engine={engine} />
        <MainCanvas engine={engine} />
        <IntroLogo started={engine.started} />
        <OverlayLayer engine={engine} />
        <CursorsLayer engine={engine} />
      </div>
      <Rulers engine={engine} />
    </>
  );
}

export default App;


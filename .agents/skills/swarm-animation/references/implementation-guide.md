# Swarm Implementation & Integration Guide

## 1. Overview

This guide explains how an AI coding agent or engineer can integrate the Swarm animation system into an existing or new React application.

---

## 2. Quick-Start Integration

### Step 1: Copy Core Modules
Copy the following modules from this skill into your React project:
- `src/physics/Vector2D.js`
- `src/physics/Particle.js`
- `src/physics/SwarmEngine.js`
- `src/hooks/useMousePosition.js`
- `src/hooks/useAnimationLoop.js`
- `src/components/Cursor.jsx`
- `src/components/SwarmCanvas.jsx`
- `src/components/Controls.jsx`
- `src/styles/global.css`

### Step 2: Install Fonts in `index.html`
Add Google Fonts links to `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

### Step 3: Mount in Root Component
```jsx
import React, { useEffect, useState } from 'react';
import { CANVAS_WIDTH, SwarmEngine } from './physics/SwarmEngine.js';
import { MainCanvas, StickyNavCanvas, OverlayLayer } from './components/SwarmCanvas.jsx';
import { CursorsLayer } from './components/Cursor.jsx';
import { Rulers, IntroLogo } from './components/Controls.jsx';
import { useMousePosition } from './hooks/useMousePosition.js';
import { useAnimationLoop } from './hooks/useAnimationLoop.js';
import './styles/global.css';

export function SwarmApp() {
  const [engine, setEngine] = useState(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    // Wait for fonts or timeout after 2.5s
    const fonts = ['400 16px Inter', '600 16px Inter', '400 16px "JetBrains Mono"'];
    Promise.race([
      Promise.all(fonts.map(f => document.fonts?.load(f))),
      new Promise(res => setTimeout(res, 2500))
    ]).then(() => {
      setEngine(new SwarmEngine());
    });
  }, []);

  useMousePosition(engine);

  useEffect(() => {
    if (!engine) return;
    const updateSize = () => {
      const clientW = document.documentElement.clientWidth;
      const s = Math.min(1, clientW / CANVAS_WIDTH);
      engine.vp.vw = clientW;
      engine.vp.vh = window.innerHeight;
      engine.vp.s = s;
      engine.vp.left = (clientW - CANVAS_WIDTH * s) / 2;
    };
    const onScroll = () => engine.setScroll(window.scrollY);
    const onWheel = () => { if (window.scrollY > 0) engine.start(); };

    updateSize();
    window.addEventListener('resize', updateSize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
    };
  }, [engine]);

  useAnimationLoop((dt) => {
    if (!engine) return;
    engine.step(dt);
    setTick(t => t + 1);
  }, Boolean(engine));

  if (!engine) return null;

  return (
    <>
      <div className="page" style={{ height: engine.height * engine.vp.s }}>
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
```

---

## 3. Customizing Swarm Behavior

### 3.1 Customizing Agent Count
In `SwarmEngine.js`:
- Change `INITIAL_CURSORS = 18` for default initial count.
- Change `MIN_CURSORS = 6` for minimum idle workers.
- Change `MAX_WORKING_CURSORS = 48` for maximum worker pool during intense scrolling.

### 3.2 Customizing Agent Names & Colors
In `Particle.js`:
- Modify `AGENT_NAMES` array to use custom agent identities or team member names.
- Modify `AGENT_COLORS` array to match your brand palette.

### 3.3 Adding Custom Document Sections & Tasks
In `buildDocumentLayout(getWorkerCount)`:
- Add a new section divider: `addSectionRules("my-section", topY, bottomY)`.
- Add an animated heading:
  ```javascript
  addText("my-title", CONTENT_LEFT, topY + 50, "My Heading", TYPOGRAPHY.h2, {
    w: 520,
    grow: true,
  });
  ```
- Add a card container:
  ```javascript
  const card = addRect("my-card", CONTENT_LEFT, topY + 120, 380, 200, {
    r: 12,
    fill: COLOR_PALETTE.card,
    stroke: COLOR_PALETTE.line,
  });
  ```

---

## 4. Common Pitfalls & Solutions

### Pitfall 1: Elements Not Rendering While Tasks Progress
- **Cause**: Passing `el` to `React.memo` components without passing `v={el.v}`.
- **Solution**: Ensure `<TextElement el={el} v={el.v} />` passes `v={el.v}` and the memo comparator checks `prevProps.v === nextProps.v`.

### Pitfall 2: Text Wrapping Differs from Canvas Measurement
- **Cause**: Offscreen canvas measured text using a fallback font before web fonts finished loading.
- **Solution**: Gate `new SwarmEngine()` behind `document.fonts.load()` with a fallback timeout of 2.5s.

### Pitfall 3: Cursors Freeze on Inactive Browser Tabs
- **Cause**: `performance.now()` reports large elapsed time intervals when tabs are backgrounded.
- **Solution**: Clamp `dt` to maximum 50ms: `const dt = Math.min((now - last) / 1000, 0.05);`.


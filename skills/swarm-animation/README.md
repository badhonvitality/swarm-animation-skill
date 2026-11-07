# Swarm Animation Skill

A reusable AI Agent Skill for multi-agent cursor animations, Boids flocking physics, collaborative canvas drafting, and interactive mouse-following particle simulations in React.

---

## Supported Agent Environments

This skill is designed for autonomous coding agents across modern IDEs and agent platforms:
- **Google Antigravity IDE** (Native Skill specification)
- **Claude Code / Anthropic Agent**
- **Cursor IDE**
- **OpenAI Codex / GitHub Copilot Agent**
- **Windsurf Cascade**

---

## Installation & Setup

### Option 1: Using within this Workspace
The skill is pre-configured and immediately discoverable in:
```
.agents/skills/swarm-animation/
```
Or within the React application repository:
```
swarm-react/.agents/skills/swarm-animation/
```

### Option 2: Copying to Another Project
To use this skill in another React project:
1. Copy `.agents/skills/swarm-animation/` into your project's `.agents/skills/` directory.
2. Copy the source components and physics modules from `swarm-react/src/` into your React application's `src/` directory.
3. Install required React dependencies:
   ```bash
   npm install react react-dom
   ```

---

## Activation & Usage

Agents can activate this skill when asked to:
- "Add a swarm animation to this website"
- "Create multi-agent collaborative cursors in React"
- "Implement a Boids flocking particle simulation following the mouse"
- "Build interactive Figma-like cursors with custom shapes, names, and colors"
- "Animate procedural website construction with pen drawing and text typing"

### Example Prompt for an Agent:
> "Use the swarm-animation skill to integrate an autonomous multi-agent cursor flock on our landing page hero section."

---

## Directory Structure

```
swarm-animation/
├── SKILL.md                          # Primary agent skill instructions and guidelines
├── README.md                         # Installation, activation, and usage guide
├── references/
│   ├── animation-system.md           # Lifecycle, scheduling, coroutines, and performance
│   ├── mouse-control.md              # Pointer tracking, collision circles, and smoothing
│   ├── physics-engine.md             # Vector math, Boids alignment, and forces
│   ├── react-architecture.md         # Component tree, hybrid canvas, and memoization
│   ├── design-system.md              # Palette, typography scale, and SVG cursors
│   └── implementation-guide.md       # Step-by-step developer integration instructions
├── examples/
│   ├── swarm-canvas.example.jsx      # Standalone 3-layer canvas component
│   ├── agent-cursor.example.jsx      # Standalone cursor with 9 shapes and rotation
│   ├── mouse-tracking.example.js     # Responsive mouse and touch tracking hook
│   └── physics-engine.example.js     # Standalone Vector2D and Boids physics module
└── assets/
    ├── design-reference.png          # Real screenshot of rendered application
    └── architecture.svg              # Vector system architecture diagram
```

---

## Verifying the Build

The skill is validated against the production React implementation in `swarm-react`:
```bash
cd swarm-react
npm run build
```
Build verification confirms zero errors, cleanly generating bundles with matching original assets.


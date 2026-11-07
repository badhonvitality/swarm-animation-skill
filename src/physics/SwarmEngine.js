import { Particle } from './Particle.js';

export const CANVAS_WIDTH = 1280;
export const MARGIN = 80;
export const RIGHT_EDGE = 1200;
export const NEG_INF = -10000;
export const POS_INF = 10000;
export const CONTENT_LEFT = MARGIN + 36; // 116

export const COLOR_PALETTE = {
  ink: "#121417",
  muted: "#62666D",
  line: "#D7DADE",
  accent: "#4C5BD4",
  card: "#FFFFFF",
  code: "#131518",
};

export const SELECTION_COLOR = "#0D99FF";
export const GUIDE_COLOR = "#F24822";

export const RULER_THICKNESS = 20;
export const NAV_MARGIN_TOP = 24;
export const NAV_HEIGHT = 64;

export const INITIAL_CURSORS = 18;
export const MIN_CURSORS = 6;
export const MAX_FLOCKING_CURSORS = 36;
export const MAX_WORKING_CURSORS = 48;

export const CURSOR_OFFSETS = {
  arrow: [5, 3.5],
  dup: [5, 3.5],
  pen: [3, 3],
  "pen-add": [3, 3],
  "pen-close": [3, 3],
  cross: [12, 12],
  ibeam: [12, 12],
  ew: [12, 12],
  ns: [12, 12],
};

export const CURSOR_ARROW_PATH =
  "M4.6 3.9 C4.2 3.1 4.9 2.4 5.7 2.8 L20.6 9.4 C21.5 9.8 21.4 11.1 20.4 11.3 L13.9 12.9 C13.4 13 13 13.4 12.9 13.9 L11.3 20.4 C11.1 21.4 9.8 21.5 9.4 20.6 Z";

export const he = (size, weight, lh, color = COLOR_PALETTE.ink, ls = 0) => ({
  font: "sans",
  size,
  weight,
  lh,
  color,
  ls,
});

export const lt = (size, color = COLOR_PALETTE.muted, weight = 400, r = {}) => ({
  font: "mono",
  size,
  weight,
  lh: 1.45,
  color,
  ...r,
});

export const TYPOGRAPHY = {
  h1: he(64, 600, 1.02, COLOR_PALETTE.ink, -0.035),
  h2: he(40, 600, 1.08, COLOR_PALETTE.ink, -0.03),
  h3: he(21, 600, 1.25, COLOR_PALETTE.ink, -0.012),
  lead: he(19, 400, 1.5, COLOR_PALETTE.muted, -0.005),
  body: he(15.5, 400, 1.55, COLOR_PALETTE.muted),
  item: he(14.5, 450, 1.4, COLOR_PALETTE.ink),
  nav: he(14, 500, 1.4, COLOR_PALETTE.ink),
  btn: he(14.5, 600, 1.4, "#FFFFFF"),
  btnDark: he(14.5, 600, 1.4, COLOR_PALETTE.ink),
  logo: he(19, 650, 1.3, "#43474E", -0.025),
  brand: he(18, 650, 1.3, COLOR_PALETTE.ink, -0.02),
  stat: he(52, 600, 1, COLOR_PALETTE.ink, -0.04),
  price: he(44, 600, 1.05, COLOR_PALETTE.ink, -0.035),
  code: lt(13.5, "#E0E2E5", 400, { lh: 1.7, code: true, pre: true }),
  codeDim: lt(12, "#81868D"),
  nodeName: lt(13, COLOR_PALETTE.ink, 500),
  nodeWhite: lt(14, "#FFFFFF", 500),
  small: lt(12, COLOR_PALETTE.muted),
};

export const LOGO_PATHS = [
  {
    d: "M0 61V70V95.5L16.16 87.6891C17.8793 86.8582 18.3949 84.6538 17.2227 83.1464L0 61Z",
    anchors: [
      [0, 61],
      [0, 95.5],
      [16.2, 87.7],
      [17.2, 83.1],
    ],
  },
  {
    d: "M120 79V70V45L103.54 52.3455C101.748 53.1452 101.194 55.4216 102.417 56.9557L120 79Z",
    anchors: [
      [120, 79],
      [120, 45],
      [103.5, 52.3],
      [102.4, 57],
    ],
  },
  {
    d: "M120 35V5C120 2.23858 117.761 0 115 0H35H20C8.95431 0 0 8.95432 0 20V50.9252L74.5897 101.343C76.2237 102.447 75.442 105 73.4697 105H0V135C0 137.761 2.23858 140 5 140H35H85H100C111.046 140 120 131.046 120 120V89.0748L45.4103 38.657C43.7763 37.5525 44.558 35 46.5303 35H120Z",
    anchors: [
      [120, 35],
      [120, 5],
      [115, 0],
      [20, 0],
      [5.9, 5.9],
      [0, 20],
      [0, 50.9],
      [74.6, 101.3],
      [73.5, 105],
      [0, 105],
      [0, 135],
      [5, 140],
      [100, 140],
      [114.1, 134.1],
      [120, 120],
      [120, 89.1],
      [45.4, 38.7],
      [46.5, 35],
    ],
  },
];

let measureCanvasContext = null;
if (typeof document !== "undefined") {
  measureCanvasContext = document.createElement("canvas").getContext("2d");
}

const measureCache = new Map();

export const getFontFamily = (style) =>
  style.font === "mono"
    ? '"JetBrains Mono", ui-monospace, monospace'
    : "Inter, system-ui, sans-serif";

export const getLineHeight = (style, size = style.size) =>
  Math.round(size * style.lh);

export function measureText(text, style, size, maxWidth) {
  const key = `${text}|${style.font}|${style.weight}|${size}|${style.ls ?? 0}|${maxWidth ?? -1}`;
  const cached = measureCache.get(key);
  if (cached) return cached;

  if (measureCanvasContext) {
    measureCanvasContext.font = `${style.weight} ${size}px ${getFontFamily(style)}`;
    measureCanvasContext.letterSpacing = `${(style.ls ?? 0) * size}px`;
  }

  const lines = [];
  for (const paragraph of text.split("\n")) {
    if (maxWidth == null || style.pre) {
      lines.push(
        measureCanvasContext
          ? measureCanvasContext.measureText(paragraph).width
          : paragraph.length * size * 0.6,
      );
      continue;
    }
    const words = paragraph.split(" ");
    let currentLine = "";
    for (const word of words) {
      const candidate = currentLine ? currentLine + " " + word : word;
      if (
        currentLine &&
        measureCanvasContext &&
        measureCanvasContext.measureText(candidate).width > maxWidth
      ) {
        lines.push(measureCanvasContext.measureText(currentLine).width);
        currentLine = word;
      } else {
        currentLine = candidate;
      }
    }
    lines.push(
      measureCanvasContext
        ? measureCanvasContext.measureText(currentLine).width
        : currentLine.length * size * 0.6,
    );
  }

  const width = maxWidth ?? Math.max(0, ...lines);
  const result = {
    w: Math.ceil(width),
    h: lines.length * getLineHeight(style, size),
    lines,
  };
  measureCache.set(key, result);
  return result;
}

const randomRange = (min, max) => min + Math.random() * (max - min);
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const bumpVersion = (el) => {
  el.v++;
};

/**
 * Builds the complete document elements, layout guides, and task dependency graph.
 */
export function buildDocumentLayout(getWorkerCount) {
  const elements = [];
  const tasks = [];
  const groups = [];
  const elementsById = new Map();
  let defaultDependencies = [];

  const addElement = (el) => {
    elements.push(el);
    elementsById.set(el.id, el);
    return el;
  };

  const addTask = (id, y, spec, deps = defaultDependencies) => {
    tasks.push({ id, y, spec, deps });
    return id;
  };

  function addPath(id, pts, options = {}) {
    addElement({
      kind: "path",
      id,
      v: 0,
      vis: false,
      dx: 0,
      dy: 0,
      pts,
      closed: !!options.closed,
      stroke: options.stroke ?? COLOR_PALETTE.line,
      sw: options.sw ?? 1,
      fill: options.fill,
      d: options.d,
      tf: options.tf,
      add: options.add ?? true,
      placed: 0,
      shut: false,
      edit: false,
      owner: null,
      fillOn: false,
      sticky: false,
    });
    return addTask(
      "p:" + id,
      Math.min(...pts.map((p) => p.y)),
      { type: "path", el: id },
      options.deps ?? [],
    );
  }

  function addRect(id, x, y, w, h, options = {}) {
    addElement({
      kind: "rect",
      id,
      v: 0,
      vis: false,
      dx: 0,
      dy: 0,
      x,
      y,
      w,
      h,
      r: options.r ?? 0,
      fill: options.fill ?? COLOR_PALETTE.card,
      stroke: options.stroke,
      draw: null,
      styled: false,
      sticky: false,
    });
    return addTask(
      "r:" + id,
      y,
      { type: "rect", el: id },
      options.deps ?? [],
    );
  }

  function addText(id, x, y, text, style, options = {}) {
    const finalContent = style.upper ? text.toUpperCase() : text;
    addElement({
      kind: "text",
      id,
      v: 0,
      vis: false,
      dx: 0,
      dy: 0,
      x,
      y,
      w: options.w,
      align: options.align ?? "left",
      text: finalContent,
      shown: "",
      st: style,
      size: style.size,
      editing: false,
      selAll: false,
      dyn: options.dyn,
      sticky: false,
    });
    return addTask(
      "t:" + id,
      y,
      { type: "text", el: id, snap: options.snap, grow: options.grow },
      options.deps ?? [],
    );
  }

  function addGuide(id, axis, pos, triggerY) {
    addElement({
      kind: "guide",
      id,
      v: 0,
      vis: false,
      dx: 0,
      dy: 0,
      axis,
      pos,
      cur: pos,
      op: 1,
      flash: 0,
      dragging: false,
      sticky: false,
    });
    return addTask("g:" + id, triggerY, { type: "guide", el: id }, []);
  }

  function addComponentGroup(groupId, baseIds, copies) {
    const group = { id: groupId, ids: baseIds, copies: [] };
    const baseTaskIds = tasks
      .filter((t) => "el" in t.spec && baseIds.includes(t.spec.el))
      .map((t) => t.id);
    const copyTaskIds = [];

    copies.forEach((copySpec, index) => {
      const copyElementIds = [];
      let editIndex = 0;

      for (const baseId of baseIds) {
        const baseEl = elementsById.get(baseId);
        const copyId = `${baseId}~${index + 1}`;
        copyElementIds.push(copyId);

        if (baseEl.kind === "text") {
          const editedText = copySpec.edits[editIndex];
          const finalText = baseEl.st.upper
            ? editedText?.toUpperCase()
            : editedText;
          addElement({
            ...baseEl,
            id: copyId,
            x: baseEl.x + copySpec.dx,
            y: baseEl.y + copySpec.dy,
            text: finalText ?? baseEl.text,
          });
          editIndex++;
        } else if (baseEl.kind === "rect") {
          addElement({
            ...baseEl,
            id: copyId,
            x: baseEl.x + copySpec.dx,
            y: baseEl.y + copySpec.dy,
          });
        }
      }

      group.copies.push({ dx: copySpec.dx, dy: copySpec.dy, ids: copyElementIds });
      const minY = Math.min(
        ...copyElementIds.map((id) => elementsById.get(id).y),
      );
      copyTaskIds.push(
        addTask(
          `d:${groupId}:${index}`,
          minY,
          { type: "dup", group: groupId, k: index },
          baseTaskIds,
        ),
      );
    });

    group.copies.forEach((copy) => {
      copy.ids.forEach((copyId, elIdx) => {
        const copyEl = elementsById.get(copyId);
        const originalEl = elementsById.get(baseIds[elIdx]);
        if (
          copyEl.kind === "text" &&
          originalEl.kind === "text" &&
          copyEl.text !== originalEl.text
        ) {
          addTask(
            "e:" + copyId,
            copyEl.y,
            { type: "edit", el: copyId },
            copyTaskIds,
          );
        }
      });
    });

    groups.push(group);
  }

  function addSectionRules(sectionName, topY, botY, reverseHorizontal = false) {
    defaultDependencies = [];
    const hRange = reverseHorizontal ? [POS_INF, NEG_INF] : [NEG_INF, POS_INF];
    addPath("rule-" + sectionName, [
      { x: hRange[0], y: botY },
      { x: hRange[1], y: botY },
    ]);
    addPath("left-" + sectionName, [
      { x: MARGIN, y: topY },
      { x: MARGIN, y: botY },
    ]);
    addPath("right-" + sectionName, [
      { x: RIGHT_EDGE, y: botY },
      { x: RIGHT_EDGE, y: topY },
    ]);
  }

  const addVLine = (id, x, y1, y2, deps) =>
    addPath(
      id,
      [
        { x, y: y1 },
        { x, y: y2 },
      ],
      { deps },
    );

  const addHLine = (id, y, x1 = NEG_INF, x2 = POS_INF, deps) =>
    addPath(
      id,
      [
        { x: x1, y },
        { x: x2, y },
      ],
      { deps },
    );

  const measureW = (text, style) => measureText(text, style, style.size).w;

  const addLogoMark = (prefix, x, y, size) => {
    const tf = { x, y, s: size / 140 };
    LOGO_PATHS.forEach((pathSpec, idx) => {
      addPath(
        `${prefix}${idx}`,
        pathSpec.anchors.map(([ax, ay]) => ({
          x: x + ax * tf.s,
          y: y + ay * tf.s,
        })),
        {
          closed: true,
          stroke: COLOR_PALETTE.ink,
          fill: COLOR_PALETTE.ink,
          add: false,
          d: pathSpec.d,
          tf,
        },
      );
    });
  };

  defaultDependencies = [];
  const navStartIndex = elements.length;

  addPath(
    "rule-top",
    [
      { x: NEG_INF, y: 24 },
      { x: POS_INF, y: 24 },
    ],
    { add: false },
  );

  // 1. Navigation (Sticky)
  addSectionRules("nav", 24, 88, true);
  addLogoMark("mark", MARGIN + 24, 45, 22);
  addText("brand", MARGIN + 52, 44, "Swarm", TYPOGRAPHY.brand);
  addText("nav0", 540, 46, "Product", TYPOGRAPHY.nav);
  addComponentGroup(
    "nav",
    ["nav0"],
    [
      { dx: 96, dy: 0, edits: ["Agents"] },
      { dx: 192, dy: 0, edits: ["Docs"] },
      { dx: 288, dy: 0, edits: ["Pricing"] },
    ],
  );
  addVLine("nav-div", RIGHT_EDGE - 176, 24, 88);
  addRect("nav-btn", RIGHT_EDGE - 156, 36, 136, 40, {
    r: 8,
    fill: COLOR_PALETTE.ink,
  });
  addText("nav-btn-t", RIGHT_EDGE - 156, 46, "Get access", TYPOGRAPHY.btn, {
    w: 136,
    align: "center",
    deps: ["r:nav-btn"],
  });

  elements.slice(navStartIndex).forEach((el) => {
    el.sticky = true;
  });

  // 2. Hero Section
  addSectionRules("hero", 88, 660);
  addVLine("hero-div", 740, 88, 660);
  addGuide("g-hero", "x", CONTENT_LEFT, 120);
  addGuide("g-hero-r", "x", 776, 120);

  addText(
    "h-title",
    CONTENT_LEFT,
    192,
    "Run a thousand\nagents as one.",
    TYPOGRAPHY.h1,
    { w: 580, snap: "g-hero", grow: true },
  );
  addText(
    "h-lead",
    CONTENT_LEFT,
    356,
    "Swarm schedules, routes and supervises AI agents across your stack, and runs their work in parallel.",
    TYPOGRAPHY.lead,
    { w: 500, snap: "g-hero" },
  );
  addRect("h-btn1", CONTENT_LEFT, 488, 184, 48, {
    r: 8,
    fill: COLOR_PALETTE.ink,
  });
  addText("h-btn1-t", CONTENT_LEFT, 501, "Start building", TYPOGRAPHY.btn, {
    w: 184,
    align: "center",
    deps: ["r:h-btn1"],
  });
  addRect("h-btn2", CONTENT_LEFT + 196, 488, 156, 48, {
    r: 8,
    fill: COLOR_PALETTE.card,
    stroke: COLOR_PALETTE.line,
  });
  addText("h-btn2-t", CONTENT_LEFT + 196, 501, "Read the docs", TYPOGRAPHY.btnDark, {
    w: 156,
    align: "center",
    deps: ["r:h-btn2"],
  });

  addRect("g-disp", 776, 162, 388, 64, { r: 10, fill: COLOR_PALETTE.ink });
  addText("g-disp-t", 800, 172, "swarm.dispatch(task)", TYPOGRAPHY.nodeWhite, {
    deps: ["r:g-disp"],
  });
  addText(
    "g-disp-s",
    800,
    194,
    "orchestrator · 18 tasks queued",
    lt(12, "#8F949B"),
    { deps: ["r:g-disp"] },
  );

  const gStem = addPath(
    "g-stem",
    [
      { x: 970, y: 226 },
      { x: 970, y: 258 },
    ],
    { stroke: "#9DA2A9", deps: ["r:g-disp"] },
  );
  addPath(
    "g-bus",
    [
      { x: 866, y: 290 },
      { x: 866, y: 258 },
      { x: 1074, y: 258 },
      { x: 1074, y: 290 },
    ],
    { stroke: "#9DA2A9", deps: [gStem] },
  );

  addRect("w0", 776, 290, 180, 64, {
    r: 10,
    fill: COLOR_PALETTE.card,
    stroke: COLOR_PALETTE.line,
  });
  addText("w0-n", 796, 301, "agent/research", TYPOGRAPHY.nodeName, {
    deps: ["r:w0"],
  });
  addText("w0-s", 796, 323, "● 12 replicas", lt(12, COLOR_PALETTE.accent), {
    deps: ["r:w0"],
  });

  addComponentGroup(
    "workers",
    ["w0", "w0-n", "w0-s"],
    [
      { dx: 208, dy: 0, edits: ["agent/writer", "● 4 replicas"] },
      { dx: 0, dy: 104, edits: ["agent/review", "● 2 replicas"] },
      { dx: 208, dy: 104, edits: ["agent/deploy", "○ waiting"] },
    ],
  );

  addPath(
    "g-l1",
    [
      { x: 866, y: 354 },
      { x: 866, y: 394 },
    ],
    { stroke: "#9DA2A9", deps: ["d:workers:2"] },
  );
  addPath(
    "g-l2",
    [
      { x: 1074, y: 354 },
      { x: 1074, y: 394 },
    ],
    { stroke: "#9DA2A9", deps: ["d:workers:2"] },
  );

  addRect("g-track", 776, 540, 388, 6, { r: 3, fill: "#E1E3E6" });
  addRect("g-fill", 776, 540, 252, 6, {
    r: 3,
    fill: COLOR_PALETTE.accent,
    deps: ["r:g-track"],
  });
  addText(
    "g-stat",
    776,
    562,
    "4 agents · 18 tasks in flight · 0 conflicts",
    TYPOGRAPHY.small,
    { snap: "g-hero-r" },
  );

  // 3. Logos Section
  addSectionRules("logos", 660, 772, true);
  addText("l-label", CONTENT_LEFT, 699, "Used by teams at", TYPOGRAPHY.small, {
    w: 230,
  });
  for (let s = 0; s < 5; s++) {
    addVLine("l-div" + s, 360 + s * 168, 660, 772);
  }
  addText("logo0", 388, 703, "Northwind", TYPOGRAPHY.logo);
  addComponentGroup(
    "logos",
    ["logo0"],
    ["Halcyon", "Parallax", "Meridian", "Kestrel"].map((name, idx) => ({
      dx: 168 * (idx + 1),
      dy: 0,
      edits: [name],
    })),
  );

  // 4. Feature Heading Section
  addSectionRules("fhead", 772, 960);
  addGuide("g-feat", "x", CONTENT_LEFT, 790);
  addGuide("g-feat-r", "x", 760, 790);

  addText(
    "f-title",
    CONTENT_LEFT,
    834,
    "Built for running agents\nin production.",
    TYPOGRAPHY.h2,
    { w: 580, snap: "g-feat", grow: true },
  );
  addText(
    "f-lead",
    760,
    840,
    "Routing, memory, supervision, fan-out, tracing and guardrails all come with the orchestrator.",
    TYPOGRAPHY.body,
    { w: 380, snap: "g-feat-r" },
  );

  // 5. Feature Grid Section
  addSectionRules("fgrid", 960, 1440, true);
  addHLine("f-mid", 1200);
  addVLine("f-v1", 453, 960, 1440);
  addVLine("f-v2", 826, 960, 1440);

  addGuide("g-cell", "x", MARGIN + 36, 975);
  addGuide("g-cell-y", "y", 1000, 975);

  addText("fc-title", MARGIN + 36, 1000, "Smart routing", TYPOGRAPHY.h3, {
    snap: "g-cell-y",
  });
  addText(
    "fc-body",
    MARGIN + 36,
    1036,
    "Send every task to the agent best equipped for it, based on skills, cost and live load.",
    TYPOGRAPHY.body,
    { w: 296, snap: "g-cell" },
  );

  addComponentGroup(
    "features",
    ["fc-title", "fc-body"],
    [
      {
        dx: 373,
        dy: 0,
        edits: [
          "Shared memory",
          "Agents read and write one consistent context, so nobody does the same work twice.",
        ],
      },
      {
        dx: 746,
        dy: 0,
        edits: [
          "Supervisors",
          "Retry, escalate or hand off automatically when an agent gets stuck or drifts.",
        ],
      },
      {
        dx: 0,
        dy: 240,
        edits: [
          "Fan-out, fan-in",
          "Split big jobs across hundreds of workers and merge the results deterministically.",
        ],
      },
      {
        dx: 373,
        dy: 240,
        edits: [
          "Live traces",
          "Watch every decision as it happens, with replays down to a single tool call.",
        ],
      },
      {
        dx: 746,
        dy: 240,
        edits: [
          "Guardrails",
          "Budgets, approvals and policies that every agent in the swarm respects by default.",
        ],
      },
    ],
  );

  // 6. Code Section
  addSectionRules("code", 1440, 1920);
  addVLine("c-div", 600, 1440, 1920);
  addGuide("g-code", "x", CONTENT_LEFT, 1460);
  addGuide("g-code-y", "y", 1772, 1600);

  addText(
    "c-title",
    CONTENT_LEFT,
    1522,
    "One file describes\nthe whole swarm.",
    TYPOGRAPHY.h2,
    { w: 440, snap: "g-code", grow: true },
  );
  addText(
    "c-body",
    CONTENT_LEFT,
    1630,
    "One declarative file sets your agents, how work is routed between them, and what they’re allowed to spend. Review it in a pull request like any other code.",
    TYPOGRAPHY.body,
    { w: 400, snap: "g-code" },
  );
  addText(
    "c-link",
    CONTENT_LEFT,
    1772,
    "Read the spec",
    lt(13, COLOR_PALETTE.ink, 500),
    { snap: "g-code-y" },
  );

  const codeWin = addRect("c-win", 640, 1488, 520, 384, {
    r: 12,
    fill: COLOR_PALETTE.code,
  });
  for (let s = 0; s < 3; s++) {
    addRect("c-dot" + s, 664 + s * 18, 1507, 10, 10, {
      r: 5,
      fill: "#30343A",
      deps: [codeWin],
    });
  }
  addText(
    "c-file",
    1136 - measureW("swarm.yaml", TYPOGRAPHY.codeDim),
    1503,
    "swarm.yaml",
    TYPOGRAPHY.codeDim,
    { deps: [codeWin] },
  );
  addPath(
    "c-sep",
    [
      { x: 640, y: 1536 },
      { x: 1160, y: 1536 },
    ],
    { stroke: "#25282D", deps: [codeWin] },
  );

  const codeLines = [
    "# swarm.yaml",
    "swarm: launch-week",
    "agents:",
    "  research: { model: fast, replicas: 12 }",
    "  writer:   { model: smart, replicas: 4 }",
    "  reviewer: { model: smart, replicas: 2 }",
    "routing:",
    "  strategy: skills-first",
    "  fallback: reviewer",
    "budget:",
    "  max_spend: $40/day",
    "  on_exceed: pause",
  ];
  codeLines.forEach((line, idx) => {
    addText("c-ln" + idx, 664, 1556 + idx * 23, line, TYPOGRAPHY.code, {
      deps: [codeWin],
    });
  });

  // 7. Stats Section
  addSectionRules("stats", 1920, 2120, true);
  for (const s of [360, 640, 920]) {
    addVLine("s-div" + s, s, 1920, 2120);
  }
  addGuide("g-stats", "y", 1960, 1930);
  addGuide("g-stats-x", "x", MARGIN + 36, 1930);

  addText("st-n", MARGIN + 36, 1960, "10k+", TYPOGRAPHY.stat, {
    snap: "g-stats",
  });
  addText("st-l", MARGIN + 36, 2028, "agents in a single swarm", TYPOGRAPHY.body, {
    w: 220,
    snap: "g-stats-x",
  });
  addComponentGroup(
    "stats",
    ["st-n", "st-l"],
    [
      { dx: 280, dy: 0, edits: ["38ms", "median agent-to-agent handoff"] },
      {
        dx: 560,
        dy: 0,
        edits: ["99.99%", "orchestrator uptime, last 12 months"],
      },
      { dx: 840, dy: 0, edits: ["0", "tasks dropped last quarter"] },
    ],
  );

  // 8. Steps Section
  addSectionRules("steps", 2120, 2640);
  addGuide("g-steps", "x", CONTENT_LEFT, 2140);
  addGuide("g-steps-c", "x", MARGIN + 36, 2330);

  addText(
    "p-title",
    CONTENT_LEFT,
    2194,
    "How a task moves\nthrough Swarm.",
    TYPOGRAPHY.h2,
    { w: 640, snap: "g-steps", grow: true },
  );

  const pMid = addHLine("p-mid", 2320);
  addVLine("p-v1", 453, 2320, 2640, [pMid]);
  addVLine("p-v2", 826, 2320, 2640, [pMid]);

  addText("ps-t", MARGIN + 36, 2364, "Define", he(26, 600, 1.2, COLOR_PALETTE.ink, -0.02), {
    snap: "g-steps-c",
  });
  addText(
    "ps-b",
    MARGIN + 36,
    2404,
    "Declare agents, skills and budgets in one file, versioned right next to your code.",
    TYPOGRAPHY.body,
    { w: 296, snap: "g-steps-c" },
  );
  addComponentGroup(
    "steps",
    ["ps-t", "ps-b"],
    [
      {
        dx: 373,
        dy: 0,
        edits: [
          "Dispatch",
          "Swarm fans tasks out to the best agents and keeps every handoff ordered and observable.",
        ],
      },
      {
        dx: 746,
        dy: 0,
        edits: [
          "Converge",
          "Results stream back, get checked by supervisors, and land as one coherent change.",
        ],
      },
    ],
  );

  // 9. Pricing Section
  addSectionRules("pricing", 2640, 3280, true);
  addGuide("g-price", "x", CONTENT_LEFT, 2660);
  addGuide("g-price-r", "x", 760, 2660);
  addGuide("g-plan", "x", 144, 2860);

  addText(
    "$-title",
    CONTENT_LEFT,
    2714,
    "Priced by the size\nof your swarm.",
    TYPOGRAPHY.h2,
    { w: 520, snap: "g-price", grow: true },
  );
  addText(
    "$-lead",
    760,
    2730,
    "Every plan includes the full orchestrator. You only pay more when your swarm gets bigger.",
    TYPOGRAPHY.body,
    { w: 380, snap: "g-price-r" },
  );

  const planBase = [
    addRect("pc", 116, 2850, 330, 398, {
      r: 14,
      fill: COLOR_PALETTE.card,
      stroke: COLOR_PALETTE.line,
    }),
  ];
  addText("pc-name", 144, 2878, "Hive", he(16, 600, 1.3), {
    deps: planBase,
    snap: "g-plan",
  });
  addText("pc-price", 144, 2912, "$0", TYPOGRAPHY.price, {
    deps: planBase,
    snap: "g-plan",
  });
  addText("pc-per", 144, 2966, "free forever", TYPOGRAPHY.small, {
    deps: planBase,
  });
  addText(
    "pc-desc",
    144,
    3000,
    "For tinkering with your first swarm on a weekend.",
    TYPOGRAPHY.body,
    { w: 274, deps: planBase, snap: "g-plan" },
  );
  addRect("pc-rule", 144, 3070, 274, 1, {
    fill: COLOR_PALETTE.line,
    deps: planBase,
  });
  addText("pc-f1", 144, 3088, "✓  Up to 10 agents", TYPOGRAPHY.item, {
    deps: planBase,
  });
  addText("pc-f2", 144, 3116, "✓  Community support", TYPOGRAPHY.item, {
    deps: planBase,
  });
  addText("pc-f3", 144, 3144, "✓  7-day trace history", TYPOGRAPHY.item, {
    deps: planBase,
  });
  addRect("pc-btn", 144, 3176, 274, 44, {
    r: 8,
    fill: COLOR_PALETTE.ink,
    deps: planBase,
  });
  addText("pc-btn-t", 144, 3187, "Start free", TYPOGRAPHY.btn, {
    w: 274,
    align: "center",
    deps: ["r:pc-btn"],
  });

  addComponentGroup(
    "plans",
    [
      "pc",
      "pc-name",
      "pc-price",
      "pc-per",
      "pc-desc",
      "pc-rule",
      "pc-f1",
      "pc-f2",
      "pc-f3",
      "pc-btn",
      "pc-btn-t",
    ],
    [
      {
        dx: 355,
        dy: 0,
        edits: [
          "Colony",
          "$49",
          "per month, billed monthly",
          "For teams running agents in production, every day.",
          "✓  Up to 500 agents",
          "✓  Shared memory + supervisors",
          "✓  30-day trace history",
          "Get Colony",
        ],
      },
      {
        dx: 710,
        dy: 0,
        edits: [
          "Swarm",
          "Let’s talk",
          "annual contract",
          "For fleets that never sleep and never stop shipping.",
          "✓  Unlimited agents",
          "✓  SSO, audit logs, VPC",
          "✓  Dedicated orchestrator",
          "Contact sales",
        ],
      },
    ],
  );

  // 10. CTA Section
  addSectionRules("cta", 3280, 3690);
  addVLine("cta-div", 800, 3280, 3690);
  addGuide("g-cta", "x", CONTENT_LEFT, 3300);
  addGuide("g-cta-r", "x", 840, 3300);

  addText(
    "x-title",
    CONTENT_LEFT,
    3352,
    "Let the swarm\nbuild it.",
    TYPOGRAPHY.h1,
    { w: 560, snap: "g-cta", grow: true },
  );
  addText(
    "x-lead",
    CONTENT_LEFT,
    3506,
    "Start with ten agents for free. Scale to ten thousand when you’re ready.",
    TYPOGRAPHY.lead,
    { w: 460, snap: "g-cta" },
  );
  addRect("x-btn", CONTENT_LEFT, 3596, 184, 48, {
    r: 8,
    fill: COLOR_PALETTE.ink,
  });
  addText("x-btn-t", CONTENT_LEFT, 3609, "Start building", TYPOGRAPHY.btn, {
    w: 184,
    align: "center",
    deps: ["r:x-btn"],
  });

  addText("x-count", 840, 3352, "", lt(13, COLOR_PALETTE.accent, 500), {
    w: 320,
    snap: "g-cta-r",
    dyn: () => `This page was built by ${getWorkerCount()} agents while you scrolled.`,
  });
  addText(
    "x-note",
    840,
    3414,
    "Every line, guide and word above was placed by a cursor working alongside the others.",
    TYPOGRAPHY.body,
    { w: 320, snap: "g-cta-r" },
  );

  // 11. Footer Section
  addSectionRules("footer", 3690, 3970, true);
  addGuide("g-foot", "x", 560, 3700);
  addLogoMark("fmark", MARGIN + 36, 3735, 22);
  addText("f-brand", MARGIN + 62, 3734, "Swarm", TYPOGRAPHY.brand);
  addText("f-copy", MARGIN + 36, 3916, "© 2026 Swarm Labs, Inc.", TYPOGRAPHY.small);

  addText("fc-h", 560, 3738, "Product", he(14.5, 600, 1.4, COLOR_PALETTE.ink), {
    snap: "g-foot",
  });
  addText("fc-1", 560, 3772, "Agents", TYPOGRAPHY.item, { snap: "g-foot" });
  addText("fc-2", 560, 3802, "Routing", TYPOGRAPHY.item);
  addText("fc-3", 560, 3832, "Pricing", TYPOGRAPHY.item);

  addComponentGroup(
    "fcols",
    ["fc-h", "fc-1", "fc-2", "fc-3"],
    [
      { dx: 200, dy: 0, edits: ["Company", "About", "Careers", "Blog"] },
      {
        dx: 400,
        dy: 0,
        edits: ["Developers", "Docs", "API reference", "Status"],
      },
    ],
  );

  return { els: elements, tasks, groups, height: 4060 };
}

/**
 * Core Swarm Simulation Engine.
 */
export class SwarmEngine {
  constructor() {
    this.els = new Map();
    this.list = [];
    this.tasks = [];
    this.byTask = new Map();
    this.groups = new Map();
    this.cursors = [];
    this.vp = { scrollY: 0, vh: 800, vw: 1280, s: 1, left: 0 };
    this.started = false;
    this.frontier = 0;
    this.vel = 0;
    this.tempo = 1;
    this.time = 0;
    this.rulers = { want: 0, t: 0, lastNeed: -10 };
    this.lastScroll = 0;
    this.nextId = 0;
    this.spawnCooldown = 0;
    this.flocking = false;
    this.lastT = null;
    this.tv = { x: 0, y: 0 };
    this.mouse = null;
    this.guideDeps = new Map();
    this.retiredWorkers = 0;

    const layout = buildDocumentLayout(
      () => this.cursors.filter((c) => c.worked).length + this.retiredWorkers,
    );
    this.height = layout.height;

    for (const el of layout.els) {
      this.els.set(el.id, el);
      this.list.push(el);
    }

    for (const task of layout.tasks) {
      const taskState = { ...task, state: "wait", doneAt: 0 };
      this.tasks.push(taskState);
      this.byTask.set(task.id, taskState);

      if (task.spec.type === "text" && task.spec.snap) {
        const list = this.guideDeps.get(task.spec.snap) ?? [];
        list.push(taskState);
        this.guideDeps.set(task.spec.snap, list);
      }
    }

    for (const group of layout.groups) {
      this.groups.set(group.id, group);
    }

    for (let i = 0; i < INITIAL_CURSORS; i++) {
      const angle = (i / INITIAL_CURSORS) * Math.PI * 2;
      const cursor = this.makeCursor(
        CANVAS_WIDTH / 2 + Math.cos(angle) * 160,
        400 + Math.sin(angle) * 160,
        i < MIN_CURSORS ? { x: 0, y: 0 } : null,
      );
      cursor.follow = true;
      this.cursors.push(cursor);
    }
  }

  makeCursor(x, y, home = null) {
    return new Particle(this.nextId++, x, y, home);
  }

  get viewTop() {
    return this.vp.scrollY / this.vp.s;
  }

  get viewBot() {
    return (this.vp.scrollY + this.vp.vh) / this.vp.s;
  }

  get stick() {
    return Math.max(
      0,
      this.viewTop + (RULER_THICKNESS * this.rulers.t) / this.vp.s - NAV_MARGIN_TOP,
    );
  }

  isSticky(task) {
    const spec = task.spec;
    const elId = spec.type === "dup" ? this.groups.get(spec.group).ids[0] : spec.el;
    const el = this.els.get(elId);
    return Boolean(el && el.sticky);
  }

  fromViewport(x, y) {
    return {
      x: (x - this.vp.left) / this.vp.s,
      y: (this.vp.scrollY + y) / this.vp.s,
    };
  }

  start() {
    if (!this.started) {
      this.started = true;
      for (const cursor of this.cursors) {
        cursor.follow = false;
        cursor.gen = null;
        cursor.angle = ((((cursor.angle + 180) % 360) + 360) % 360) - 180;
      }
    }
  }

  bounds(el) {
    if (el.kind === "text") {
      const metrics = measureText(el.shown || " ", el.st, el.size, el.w);
      return {
        x: el.x + el.dx,
        y: el.y + el.dy,
        w: el.w ?? Math.max(metrics.w, 2),
        h: Math.max(metrics.h, getLineHeight(el.st, el.size)),
      };
    }
    if (el.kind === "rect") {
      return {
        x: el.x + el.dx,
        y: el.y + el.dy,
        w: el.draw?.w ?? el.w,
        h: el.draw?.h ?? el.h,
      };
    }
    if (el.kind === "path") {
      const xs = el.pts.map((p) => p.x);
      const ys = el.pts.map((p) => p.y);
      return {
        x: Math.min(...xs),
        y: Math.min(...ys),
        w: Math.max(...xs) - Math.min(...xs),
        h: Math.max(...ys) - Math.min(...ys),
      };
    }
    return { x: el.pos, y: 0, w: 0, h: 0 };
  }

  unionBounds(elementIds) {
    const boundsList = elementIds.map((id) => this.bounds(this.els.get(id)));
    const minX = Math.min(...boundsList.map((b) => b.x));
    const minY = Math.min(...boundsList.map((b) => b.y));
    return {
      x: minX,
      y: minY,
      w: Math.max(...boundsList.map((b) => b.x + b.w)) - minX,
      h: Math.max(...boundsList.map((b) => b.y + b.h)) - minY,
    };
  }

  textUnderline(el) {
    const metrics = measureText(el.shown || " ", el.st, el.size, el.w);
    const b = this.bounds(el);
    const lineW = metrics.lines[0] ?? 0;
    return {
      x: el.align === "center" && el.w ? b.x + (el.w - lineW) / 2 : b.x,
      y: b.y + getLineHeight(el.st, el.size) * 0.5 + el.size * 0.42,
      w: lineW,
      h: 0,
    };
  }

  selection(el, options = {}) {
    const b = this.bounds(el);
    return {
      t: "box",
      b,
      handles: true,
      badge: `${Math.round(b.w)} × ${Math.round(b.h)}`,
      rulerLines: true,
      underline: el.kind === "text" ? this.textUnderline(el) : undefined,
      ...options,
    };
  }

  setScroll(scrollY) {
    this.vp.scrollY = scrollY;
    if (scrollY > 4) {
      this.start();
    }
  }

  step(dt) {
    dt = Math.min(dt, 0.05);
    this.time += dt;

    const scale = this.vp.s;
    const scrollDelta =
      Math.abs(this.vp.scrollY - this.lastScroll) / scale / Math.max(dt, 0.001);
    this.lastScroll = this.vp.scrollY;

    this.vel = Math.max(
      this.vel * Math.exp(-dt * 1.2),
      this.vel * 0.7 + scrollDelta * 0.3,
    );

    if (this.started) {
      this.frontier = Math.max(this.frontier, this.viewBot);
    }

    const availableTasks = this.started ? this.available() : [];
    const busyWorkers = this.cursors.filter((c) => c.task).length;

    this.tempo = clamp(
      2.1 +
        this.vel / 900 +
        (availableTasks.length / Math.max(1, this.cursors.length)) * 0.5,
      2.1,
      4.5,
    );

    if (this.rulers.want > 0) {
      this.rulers.lastNeed = this.time;
    }
    const rulerTarget = this.time - this.rulers.lastNeed < 0.7 ? 1 : 0;
    this.rulers.t += (rulerTarget - this.rulers.t) * Math.min(1, dt * 10);
    if (Math.abs(rulerTarget - this.rulers.t) < 0.002) {
      this.rulers.t = rulerTarget;
    }

    for (const el of this.list) {
      if (el.kind !== "guide" || !el.vis) continue;
      if (el.flash > 0) {
        el.flash = Math.max(0, el.flash - dt * 1.5);
        bumpVersion(el);
      }
      const deps = this.guideDeps.get(el.id) ?? [];
      if (!el.dragging && deps.every((d) => d.state === "done")) {
        const latestDone = Math.max(...deps.map((d) => d.doneAt));
        if (this.time - latestDone > 1.2 && el.op > 0) {
          el.op = Math.max(0, el.op - dt * 1.2);
          bumpVersion(el);
        }
      }
    }

    if (
      !this.flocking &&
      this.started &&
      this.tasks.every((t) => t.state !== "wait")
    ) {
      for (const cursor of this.cursors) {
        if (!cursor.task && !cursor.follow) {
          cursor.follow = true;
          cursor.gen = null;
          cursor.leaving = false;
          cursor.ov = null;
          cursor.shape = "arrow";
        }
      }
      if (this.cursors.every((c) => c.follow)) {
        this.flocking = true;
      }
    }

    if (this.flocking) {
      this.flock(dt);
      return;
    }

    if (!this.started) {
      const center = this.fromViewport(this.vp.vw / 2, this.vp.vh / 2);
      if (this.follow(dt, this.cursors, center, 0.7)) {
        this.start();
      }
      return;
    }

    if (this.cursors.some((c) => c.follow)) {
      this.follow(
        dt,
        this.cursors.filter((c) => c.follow),
      );
    }

    this.spawnCooldown -= dt;
    const targetWorkerCount = clamp(
      MIN_CURSORS +
        Math.floor(this.vel / 50) +
        Math.floor(availableTasks.length / 3),
      MIN_CURSORS,
      MAX_WORKING_CURSORS,
    );

    const activeCount = this.cursors.filter((c) => !c.leaving).length;
    if (
      this.started &&
      activeCount < targetWorkerCount &&
      availableTasks.length > activeCount - busyWorkers &&
      this.spawnCooldown <= 0
    ) {
      const fromLeft = Math.random() < 0.5;
      const spawnPt = this.fromViewport(
        fromLeft ? -40 : this.vp.vw + 40,
        randomRange(0.2, 0.8) * this.vp.vh,
      );
      this.cursors.push(this.makeCursor(spawnPt.x, spawnPt.y));
      this.spawnCooldown = 0.035;
    }

    for (const cursor of this.cursors) {
      if (cursor.task || cursor.leaving || cursor.follow || !this.started) {
        continue;
      }
      const task = this.pick(cursor, availableTasks);
      if (task) {
        availableTasks.splice(availableTasks.indexOf(task), 1);
        task.state = "active";
        cursor.task = task;
        cursor.worked = true;
        if (this.isSticky(task)) {
          cursor.sticky = true;
          cursor.y -= this.stick;
        }
        cursor.idleFor = 0;
        cursor.gen = this.run(cursor, task);
      }
    }

    for (const cursor of [...this.cursors]) {
      if (cursor.follow) continue;

      cursor.press = Math.max(0, cursor.press - dt * 6);
      if (cursor.angle !== 0) {
        cursor.angle =
          Math.abs(cursor.angle) < 0.5
            ? 0
            : cursor.angle * (1 - Math.min(1, dt * 10));
      }

      if (!cursor.task) {
        cursor.idleFor += dt;
        if (
          !cursor.leaving &&
          this.started &&
          cursor.idleFor > 2.5 &&
          this.cursors.filter((c) => !c.leaving).length > MIN_CURSORS &&
          !cursor.home
        ) {
          cursor.leaving = true;
          cursor.gen = this.leave(cursor);
        }
        if (!cursor.gen) {
          cursor.gen = this.idle(cursor);
        }
      }

      if (cursor.gen) {
        const stepResult = cursor.gen.next(dt);
        if (stepResult.done) {
          if (cursor.task) {
            cursor.task.state = "done";
            cursor.task.doneAt = this.time;
            cursor.task = null;
            cursor.ov = null;
            if (cursor.sticky) {
              cursor.sticky = false;
              cursor.y += this.stick;
            }
            cursor.shape = "arrow";
          }
          cursor.gen = null;
          if (cursor.leaving) {
            if (cursor.worked) {
              this.retiredWorkers++;
            }
            const idx = this.cursors.indexOf(cursor);
            if (idx !== -1) {
              this.cursors.splice(idx, 1);
            }
          }
        }
      }
    }
  }

  flockTarget() {
    if (this.mouse) {
      return this.fromViewport(this.mouse.x, this.mouse.y);
    }
    const t = this.time;
    return this.fromViewport(
      this.vp.vw * (0.5 + 0.28 * Math.sin(t * 0.37)),
      this.vp.vh * (0.5 + 0.25 * Math.sin(t * 0.53 + 1)),
    );
  }

  flock(dt) {
    this.spawnCooldown -= dt;
    if (this.cursors.length < MAX_FLOCKING_CURSORS && this.spawnCooldown <= 0) {
      const fromLeft = Math.random() < 0.5;
      const spawnPt = this.fromViewport(
        fromLeft ? -30 : this.vp.vw + 30,
        randomRange(0.1, 0.9) * this.vp.vh,
      );
      const newCursor = this.makeCursor(spawnPt.x, spawnPt.y);
      newCursor.follow = true;
      this.cursors.push(newCursor);
      this.spawnCooldown = 0.04;
    }
    this.follow(dt, this.cursors);
  }

  follow(dt, cursors, target = null, radiusScale = 1) {
    const mousePt = this.mouse
      ? this.fromViewport(this.mouse.x, this.mouse.y)
      : null;
    const focalTarget = target ?? this.flockTarget();
    const t = this.time;

    if (mousePt && this.lastT && dt > 0) {
      const smoothing = Math.min(1, dt * 18);
      this.tv.x += ((mousePt.x - this.lastT.x) / dt - this.tv.x) * smoothing;
      this.tv.y += ((mousePt.y - this.lastT.y) / dt - this.tv.y) * smoothing;
    }
    this.lastT = mousePt;

    const baseRadius = 135 * radiusScale * (1 + 0.18 * Math.sin(t * 0.55));
    const directionSwitch = Math.tanh(Math.cos(t * 0.11) * 3);
    const candidateAccelerations = [];

    for (const cursor of cursors) {
      const dx = cursor.x - focalTarget.x;
      const dy = cursor.y - focalTarget.y;
      const dist = Math.hypot(dx, dy) || 0.01;
      const ux = dx / dist;
      const uy = dy / dist;
      const angle = Math.atan2(dy, dx);
      const orbitOffset = (cursor.orbit - 120) * 0.55 * radiusScale;
      const individualRadius =
        baseRadius * (1 + 0.3 * Math.sin(3 * angle + t * 0.7)) + orbitOffset;
      const tanForce = 300 * (0.7 + cursor.spin * 0.2) * directionSwitch;
      const radialForce = clamp((individualRadius - dist) * 4, -2600, 1400);
      const curlIntensity = Math.min(1, Math.max(0, (dist - individualRadius) / 600));

      candidateAccelerations.push([
        -uy * tanForce + ux * radialForce - uy * cursor.curl * 400 * curlIntensity,
        ux * tanForce + uy * radialForce + ux * cursor.curl * 400 * curlIntensity,
      ]);
    }

    for (let i = 0; i < cursors.length; i++) {
      const cursor = cursors[i];
      let avgVx = 0;
      let avgVy = 0;
      let totalWeight = 0;

      for (let j = 0; j < cursors.length; j++) {
        if (i === j) continue;
        const neighbor = cursors[j];
        const d = Math.hypot(neighbor.x - cursor.x, neighbor.y - cursor.y);
        if (d > 90) continue;
        const weight = 1 - d / 90;
        avgVx += neighbor.vx * weight;
        avgVy += neighbor.vy * weight;
        totalWeight += weight;
      }

      let [ax, ay] = candidateAccelerations[i];
      if (totalWeight > 0) {
        ax = ax * 0.7 + (avgVx / totalWeight) * 0.3;
        ay = ay * 0.7 + (avgVy / totalWeight) * 0.3;
      }

      const distToFocal = Math.max(
        0,
        Math.hypot(cursor.x - focalTarget.x, cursor.y - focalTarget.y) -
          180 * radiusScale,
      );
      const maxSpeed = cursor.speed * (1.3 + Math.min(3.2, distToFocal / 90));
      const accelMag = Math.hypot(ax, ay);
      if (accelMag > maxSpeed) {
        ax *= maxSpeed / accelMag;
        ay *= maxSpeed / accelMag;
      }

      let steerX = (ax - cursor.vx) * 6;
      let steerY = (ay - cursor.vy) * 6;
      const maxForce = cursor.force * (1.4 + Math.min(5, distToFocal / 50));
      const steerMag = Math.hypot(steerX, steerY);
      if (steerMag > maxForce) {
        steerX *= maxForce / steerMag;
        steerY *= maxForce / steerMag;
      }

      cursor.vx += steerX * dt;
      cursor.vy += steerY * dt;
      cursor.x += cursor.vx * dt;
      cursor.y += cursor.vy * dt;
    }

    const collisionRadius = 48;
    let collidedWithMouse = false;
    if (mousePt) {
      for (const cursor of cursors) {
        const dx = cursor.x - mousePt.x;
        const dy = cursor.y - mousePt.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        if (dist >= collisionRadius) continue;

        collidedWithMouse = true;
        const nx = dx / dist;
        const ny = dy / dist;
        cursor.x = mousePt.x + nx * collisionRadius;
        cursor.y = mousePt.y + ny * collisionRadius;

        const relVel =
          (cursor.vx - this.tv.x) * nx + (cursor.vy - this.tv.y) * ny;
        if (relVel < 0) {
          cursor.vx -= nx * relVel * 1.6;
          cursor.vy -= ny * relVel * 1.6;
        }
        cursor.vx += nx * 260;
        cursor.vy += ny * 260;
      }
    }

    for (const cursor of cursors) {
      if (Math.hypot(cursor.vx, cursor.vy) < 30) continue;
      const targetAngle =
        (((Math.atan2(cursor.vy, cursor.vx) * 180) / Math.PI +
          128 -
          cursor.angle +
          540) %
          360) -
        180;
      cursor.angle += targetAngle * Math.min(1, dt * 8);
      cursor.press = Math.max(0, cursor.press - dt * 6);
    }

    return collidedWithMouse;
  }

  available() {
    const ready = [];
    for (const task of this.tasks) {
      if (task.state !== "wait" || task.y > this.frontier) continue;
      const allDepsMet = task.deps.every((depId) => {
        const depTask = this.byTask.get(depId);
        return depTask?.state === "done";
      });
      if (allDepsMet) {
        ready.push(task);
      }
    }
    return ready;
  }

  pick(cursor, availableTasks) {
    let bestTask = null;
    let minScore = Infinity;
    const viewTopBoundary = this.viewTop - 40;
    const viewBotBoundary = this.viewBot;

    for (const task of availableTasks) {
      const priorityCategory =
        task.y >= viewTopBoundary && task.y <= viewBotBoundary
          ? 0
          : task.y < viewTopBoundary
            ? 1
            : 2;
      const score =
        priorityCategory * 1e6 +
        (priorityCategory === 1 ? viewTopBoundary - task.y : task.y) * 0.6 +
        Math.abs(task.y - cursor.y) * 0.4;

      if (score < minScore) {
        minScore = score;
        bestTask = task;
      }
    }
    return bestTask;
  }

  *wait(duration) {
    let elapsed = 0;
    while (elapsed < duration) {
      elapsed += (yield) * this.tempo;
    }
  }

  *moveTo(cursor, target, options = {}) {
    const getTarget = typeof target === "function" ? target : () => target;
    const startX = cursor.x;
    const startY = cursor.y;
    const initialTarget = getTarget();
    const distance = Math.hypot(initialTarget.x - startX, initialTarget.y - startY);

    if (distance < 0.5) {
      cursor.x = initialTarget.x;
      cursor.y = initialTarget.y;
      options.onStep?.();
      return;
    }

    const travelDuration =
      clamp(0.12 + Math.sqrt(distance) * 0.021, 0.14, 0.9) /
      (options.speed ?? 1);
    const bendAmount =
      (options.bend ?? (Math.random() < 0.5 ? -1 : 1) * randomRange(0.04, 0.14)) *
      Math.min(distance, 600);

    let elapsed = 0;
    while (elapsed < travelDuration) {
      elapsed += (yield) * this.tempo;
      const progress = Math.min(1, elapsed / travelDuration);
      const eased =
        options.drag || progress < 0.15
          ? easeInOutCubic(progress)
          : easeOutCubic(progress);
      const currentTarget = getTarget();
      const dx = currentTarget.x - startX;
      const dy = currentTarget.y - startY;
      const segLen = Math.hypot(dx, dy) || 1;
      const perpOffset = Math.sin(Math.PI * eased) * bendAmount;

      cursor.x = startX + dx * eased + (-dy / segLen) * perpOffset;
      cursor.y = startY + dy * eased + (dx / segLen) * perpOffset;
      options.onStep?.();
    }

    const finalTarget = getTarget();
    cursor.x = finalTarget.x;
    cursor.y = finalTarget.y;
    options.onStep?.();
  }

  *click(cursor) {
    cursor.press = 1;
    yield* this.wait(0.07);
  }

  *type(element, fullText, clearFirst = false) {
    for (let i = 0; i < fullText.length; i++) {
      if (i === 0 && clearFirst) {
        element.shown = "";
      }
      element.shown += fullText[i];
      element.selAll = false;
      bumpVersion(element);

      let delay = randomRange(0.012, 0.04);
      if (fullText[i] === " ") delay += randomRange(0, 0.03);
      if (fullText[i] === "\n") delay += 0.1;
      if (Math.random() < 0.025) delay += randomRange(0.08, 0.2);

      yield* this.wait(delay);
    }
  }

  *idle(cursor) {
    if (!this.started && cursor.home) {
      const home = cursor.home;
      const phase = randomRange(0, 6);
      while (!this.started) {
        const t = this.time;
        cursor.x = home.x + Math.sin(t * 1.3 + phase) * 3;
        cursor.y = home.y + Math.cos(t * 1.7 + phase) * 2.5;
        yield;
      }
    }

    while (true) {
      const top = this.viewTop;
      const bot = this.viewBot;
      const target = {
        x: randomRange(220, 1060),
        y: randomRange(top + (bot - top) * 0.2, top + (bot - top) * 0.8),
      };
      yield* this.moveTo(cursor, target, { speed: 0.35 });

      let pause = randomRange(0.4, 1.4);
      while (
        pause > 0 &&
        ((pause -= yield),
        !(cursor.y < this.viewTop || cursor.y > this.viewBot))
      );
    }
  }

  *leave(cursor) {
    const exitRight = cursor.x > CANVAS_WIDTH / 2;
    yield* this.moveTo(
      cursor,
      () =>
        this.fromViewport(
          exitRight ? this.vp.vw + 60 : -60,
          (cursor.y - this.viewTop) * this.vp.s,
        ),
      { speed: 0.8 },
    );
  }

  run(cursor, task) {
    const spec = task.spec;
    switch (spec.type) {
      case "path":
        return this.drawPath(cursor, this.els.get(spec.el));
      case "rect":
        return this.drawRect(cursor, this.els.get(spec.el));
      case "text":
        return this.drawText(
          cursor,
          this.els.get(spec.el),
          spec.snap ? this.els.get(spec.snap) : null,
          Boolean(spec.grow),
        );
      case "guide":
        return this.dragGuide(cursor, this.els.get(spec.el));
      case "dup":
        return this.duplicate(cursor, this.groups.get(spec.group), spec.k);
      case "edit":
        return this.editText(cursor, this.els.get(spec.el));
    }
  }

  anchor(point) {
    if (point.x <= NEG_INF) {
      return () => ({ x: this.fromViewport(6, 0).x, y: point.y });
    }
    if (point.x >= POS_INF) {
      return () => ({ x: this.fromViewport(this.vp.vw - 6, 0).x, y: point.y });
    }
    return point;
  }

  *drawPath(cursor, el) {
    if (el.d) {
      return yield* this.drawLogo(cursor, el);
    }

    cursor.shape = el.add ? "pen-add" : "pen";
    yield* this.moveTo(cursor, this.anchor(el.pts[0]));
    yield* this.click(cursor);

    el.vis = true;
    el.edit = true;
    el.placed = 1;
    el.owner = cursor.id;
    bumpVersion(el);
    cursor.shape = "pen";

    for (let i = 1; i < el.pts.length; i++) {
      yield* this.moveTo(cursor, this.anchor(el.pts[i]), {
        bend: randomRange(-0.03, 0.03),
      });
      yield* this.click(cursor);
      el.placed = i + 1;
      bumpVersion(el);
      yield* this.wait(randomRange(0.04, 0.12));
    }

    if (el.closed) {
      cursor.shape = "pen-close";
      yield* this.moveTo(cursor, el.pts[0], { bend: randomRange(-0.03, 0.03) });
      yield* this.click(cursor);
      el.shut = true;
      bumpVersion(el);
    }

    el.owner = null;
    bumpVersion(el);
    cursor.shape = "pen";

    yield* this.moveTo(
      cursor,
      { x: cursor.x + randomRange(14, 30), y: cursor.y + randomRange(10, 24) },
      { speed: 1.4 },
    );
    yield* this.wait(0.3);

    el.edit = false;
    if (el.fill) {
      el.fillOn = true;
    }
    bumpVersion(el);
  }

  *drawLogo(cursor, el) {
    cursor.shape = "pen";
    yield* this.moveTo(cursor, this.anchor(el.pts[0]));
    el.vis = true;
    el.placed = 1;
    bumpVersion(el);

    for (let i = 1; i <= el.pts.length; i++) {
      yield* this.moveTo(cursor, el.pts[i % el.pts.length], { speed: 1.6 });
      el.placed = i + 1;
      bumpVersion(el);
    }

    el.shut = true;
    el.fillOn = true;
    bumpVersion(el);

    yield* this.moveTo(
      cursor,
      { x: cursor.x + randomRange(14, 30), y: cursor.y + randomRange(10, 24) },
      { speed: 1.4 },
    );
  }

  *drawRect(cursor, el) {
    cursor.shape = "cross";
    yield* this.moveTo(cursor, { x: el.x, y: el.y });
    cursor.press = 1;
    el.vis = true;
    el.draw = { w: 0, h: 0 };
    bumpVersion(el);

    cursor.ov = () => [this.selection(el)];
    yield* this.moveTo(
      cursor,
      { x: el.x + el.w, y: el.y + el.h },
      {
        speed: 0.75,
        drag: true,
        bend: 0,
        onStep: () => {
          el.draw = {
            w: Math.max(0, cursor.x - el.x),
            h: Math.max(0, cursor.y - el.y),
          };
          bumpVersion(el);
        },
      },
    );

    el.draw = null;
    bumpVersion(el);
    cursor.shape = "arrow";
    yield* this.wait(randomRange(0.18, 0.3));

    el.styled = true;
    bumpVersion(el);
    yield* this.wait(0.35);
    cursor.ov = null;
  }

  *drawText(cursor, el, snapGuide, grow) {
    if (el.dyn) {
      el.text = el.dyn();
    }
    if (snapGuide) {
      if (snapGuide.axis === "x") {
        el.dx = randomRange(28, 64);
        el.dy = randomRange(-8, 8);
      } else {
        el.dx = randomRange(-8, 8);
        el.dy = randomRange(18, 34) * (Math.random() < 0.5 ? -1 : 1);
      }
    }
    if (grow) {
      el.size = 18;
    }

    const startX = el.x + el.dx;
    const startY = el.y + el.dy;

    cursor.shape = "cross";
    yield* this.moveTo(cursor, { x: startX, y: startY });

    if (el.w == null) {
      yield* this.click(cursor);
      el.vis = true;
      el.editing = true;
      bumpVersion(el);
    } else {
      cursor.press = 1;
      const ghostRect = {
        kind: "rect",
        id: "",
        v: 0,
        vis: true,
        dx: 0,
        dy: 0,
        x: startX,
        y: startY,
        w: 0,
        h: 0,
        r: 0,
        fill: "",
        draw: null,
        styled: true,
      };
      const textH = getLineHeight(el.st, el.size);
      cursor.ov = () => [this.selection(ghostRect)];

      yield* this.moveTo(
        cursor,
        { x: startX + el.w, y: startY + textH },
        {
          speed: 0.9,
          drag: true,
          bend: 0,
          onStep: () => {
            ghostRect.w = Math.max(0, cursor.x - startX);
            ghostRect.h = Math.max(0, cursor.y - startY);
          },
        },
      );
      el.vis = true;
      el.editing = true;
      bumpVersion(el);
    }

    cursor.shape = "ibeam";
    cursor.ov = () => [{ t: "box", b: this.bounds(el) }];

    yield* this.moveTo(
      cursor,
      { x: cursor.x + randomRange(-30, 10), y: cursor.y + randomRange(10, 30) },
      { speed: 1.5 },
    );
    yield* this.type(el, el.text);
    yield* this.wait(0.12);

    el.editing = false;
    bumpVersion(el);
    cursor.shape = "arrow";
    cursor.ov = () => [this.selection(el)];

    if (grow) {
      const sizeSteps = [24, 32, 40, 48, 56, 64, 72].filter(
        (sz) => sz < el.st.size,
      );
      for (const sz of [...sizeSteps, el.st.size]) {
        yield* this.wait(0.06);
        el.size = sz;
        bumpVersion(el);
      }
      yield* this.wait(0.15);
    }

    if (snapGuide) {
      const guideTask = this.byTask.get("g:" + snapGuide.id);
      while (guideTask.state !== "done") {
        yield;
      }

      const b = this.bounds(el);
      const grabPoint = {
        x: b.x + Math.min(b.w * 0.4, 60) + randomRange(-6, 6),
        y: b.y + Math.min(b.h * 0.5, 22),
      };

      yield* this.moveTo(cursor, grabPoint);
      cursor.press = 1;

      const origin = { x: grabPoint.x - el.dx, y: grabPoint.y - el.dy };
      const overshoot = {
        x: origin.x + (snapGuide.axis === "x" ? -randomRange(2, 5) : randomRange(-6, 6)),
        y: origin.y + (snapGuide.axis === "y" ? -randomRange(2, 5) : randomRange(-3, 3)),
      };

      const snapCheck = () => {
        let offsetX = cursor.x - origin.x;
        let offsetY = cursor.y - origin.y;
        if (snapGuide.axis === "x" && Math.abs(offsetX) < 9) {
          if (offsetX !== 0 && el.dx !== 0) {
            snapGuide.flash = 1;
          }
          offsetX = 0;
        }
        if (snapGuide.axis === "y" && Math.abs(offsetY) < 9) {
          if (offsetY !== 0 && el.dy !== 0) {
            snapGuide.flash = 1;
          }
          offsetY = 0;
        }
        el.dx = offsetX;
        el.dy = offsetY;
        bumpVersion(el);
        bumpVersion(snapGuide);
      };

      yield* this.moveTo(cursor, overshoot, {
        speed: 0.6,
        drag: true,
        onStep: snapCheck,
      });
      yield* this.wait(0.1);
      yield* this.moveTo(cursor, origin, { speed: 2, onStep: snapCheck });

      el.dx = 0;
      el.dy = 0;
      bumpVersion(el);
      yield* this.wait(0.25);
    } else {
      yield* this.wait(0.2);
    }

    cursor.ov = null;
  }

  *dragGuide(cursor, el) {
    this.rulers.want++;
    try {
      const jitter = randomRange(-0.15, 0.15);
      const rulerStart = () =>
        el.axis === "x"
          ? this.fromViewport(10, this.vp.vh * (0.45 + jitter))
          : this.fromViewport(
              this.vp.left + (el.pos > 0 ? 400 : 300) * this.vp.s + jitter * 200,
              10,
            );

      cursor.shape = "arrow";
      yield* this.moveTo(cursor, rulerStart);
      while (this.rulers.t < 0.95) {
        yield;
      }

      yield* this.moveTo(cursor, rulerStart, { speed: 3 });
      cursor.press = 1;
      cursor.shape = el.axis === "x" ? "ew" : "ns";
      el.vis = true;
      el.dragging = true;
      el.op = 1;

      const updateGuide = () => {
        el.cur = el.axis === "x" ? cursor.x : cursor.y;
        bumpVersion(el);
      };
      updateGuide();

      const targetPosition = () => {
        const pt = rulerStart();
        return el.axis === "x"
          ? { x: el.pos, y: pt.y + 40 }
          : { x: pt.x + 30, y: el.pos };
      };

      yield* this.moveTo(cursor, targetPosition, {
        speed: 0.55,
        drag: true,
        onStep: updateGuide,
      });

      el.cur = el.pos;
      el.dragging = false;
      bumpVersion(el);
      cursor.shape = "arrow";
      yield* this.wait(0.25);
    } finally {
      this.rulers.want--;
    }
  }

  *duplicate(cursor, group, copyIndex) {
    const copyTarget = group.copies[copyIndex];
    const availableSources = [
      { dx: 0, dy: 0, ids: group.ids },
      ...group.copies.filter((_, idx) => {
        const task = this.byTask.get(`d:${group.id}:${idx}`);
        return task?.state === "done";
      }),
    ];

    let nearestSource = availableSources[0];
    for (const src of availableSources) {
      if (
        Math.hypot(src.dx - copyTarget.dx, src.dy - copyTarget.dy) <
        Math.hypot(nearestSource.dx - copyTarget.dx, nearestSource.dy - copyTarget.dy)
      ) {
        nearestSource = src;
      }
    }

    const sourceBounds = this.unionBounds(nearestSource.ids);
    cursor.shape = "arrow";

    const grabPt = {
      x: sourceBounds.x + Math.min(sourceBounds.w * 0.45, 70) + randomRange(-8, 8),
      y: sourceBounds.y + Math.min(sourceBounds.h * 0.45, 30) + randomRange(-4, 4),
    };

    yield* this.moveTo(cursor, grabPt);
    yield* this.click(cursor);

    cursor.ov = () => [
      {
        t: "box",
        b: sourceBounds,
        handles: true,
        badge: `${Math.round(sourceBounds.w)} × ${Math.round(sourceBounds.h)}`,
      },
    ];

    yield* this.wait(randomRange(0.15, 0.3));
    cursor.shape = "dup";
    yield* this.wait(0.12);
    cursor.press = 1;

    const initialOffsetDeltaX = nearestSource.dx - copyTarget.dx;
    const initialOffsetDeltaY = nearestSource.dy - copyTarget.dy;

    copyTarget.ids.forEach((id, idx) => {
      const copyEl = this.els.get(id);
      const originalEl = this.els.get(group.ids[idx]);
      copyEl.vis = true;
      copyEl.dx = initialOffsetDeltaX;
      copyEl.dy = initialOffsetDeltaY;
      if (copyEl.kind === "text" && originalEl.kind === "text") {
        copyEl.shown = originalEl.text;
      }
      if (copyEl.kind === "rect") {
        copyEl.styled = true;
      }
      bumpVersion(copyEl);
    });

    const destinationPt = {
      x: grabPt.x - initialOffsetDeltaX,
      y: grabPt.y - initialOffsetDeltaY,
    };

    cursor.ov = () => {
      const currentBounds = this.unionBounds(copyTarget.ids);
      const overlays = [
        { t: "box", b: sourceBounds, color: "red" },
        { t: "box", b: currentBounds, color: "red" },
      ];
      const measurement = this.spacing(sourceBounds, currentBounds);
      if (measurement) {
        overlays.push(measurement);
      }
      return overlays;
    };

    yield* this.moveTo(cursor, destinationPt, {
      speed: 0.6,
      drag: true,
      onStep: () => {
        copyTarget.ids.forEach((id) => {
          const el = this.els.get(id);
          el.dx = cursor.x - destinationPt.x;
          el.dy = cursor.y - destinationPt.y;
          bumpVersion(el);
        });
      },
    });

    yield* this.wait(0.1);
    cursor.shape = "arrow";

    cursor.ov = () => {
      const finalBounds = this.unionBounds(copyTarget.ids);
      return [
        {
          t: "box",
          b: finalBounds,
          handles: true,
          badge: `${Math.round(finalBounds.w)} × ${Math.round(finalBounds.h)}`,
        },
      ];
    };

    yield* this.wait(0.35);
  }

  spacing(b1, b2) {
    const overlapY = Math.min(b1.y + b1.h, b2.y + b2.h) - Math.max(b1.y, b2.y);
    const overlapX = Math.min(b1.x + b1.w, b2.x + b2.w) - Math.max(b1.x, b2.x);

    if (overlapY > 0) {
      const midY = Math.max(b1.y, b2.y) + overlapY / 2;
      const [leftBox, rightBox] = b1.x < b2.x ? [b1, b2] : [b2, b1];
      const gapX = rightBox.x - (leftBox.x + leftBox.w);
      if (gapX > 0) {
        return {
          t: "measure",
          a: { x: leftBox.x + leftBox.w, y: midY },
          b: { x: rightBox.x, y: midY },
          label: String(Math.round(gapX)),
        };
      }
    } else if (overlapX > 0) {
      const midX = Math.max(b1.x, b2.x) + overlapX / 2;
      const [topBox, bottomBox] = b1.y < b2.y ? [b1, b2] : [b2, b1];
      const gapY = bottomBox.y - (topBox.y + topBox.h);
      if (gapY > 0) {
        return {
          t: "measure",
          a: { x: midX, y: topBox.y + topBox.h },
          b: { x: midX, y: bottomBox.y },
          label: String(Math.round(gapY)),
        };
      }
    }
    return null;
  }

  *editText(cursor, el) {
    cursor.shape = "arrow";
    const b = this.bounds(el);
    const metrics = measureText(el.shown, el.st, el.size, el.w);
    const firstLineWidth = metrics.lines[0] ?? b.w;
    const targetX =
      el.align === "center" && el.w
        ? b.x + (el.w - firstLineWidth) / 2
        : b.x;

    yield* this.moveTo(cursor, {
      x: targetX + Math.min(firstLineWidth * 0.5, 50) + randomRange(-5, 5),
      y: b.y + getLineHeight(el.st, el.size) * 0.55,
    });

    yield* this.click(cursor);
    yield* this.wait(0.08);
    yield* this.click(cursor);

    el.editing = true;
    el.selAll = true;
    bumpVersion(el);

    cursor.shape = "ibeam";
    cursor.ov = () => [{ t: "box", b: this.bounds(el) }];

    yield* this.wait(randomRange(0.2, 0.35));
    yield* this.type(el, el.text, true);
    yield* this.wait(0.12);

    el.editing = false;
    bumpVersion(el);
    cursor.shape = "arrow";
    cursor.ov = () => [this.selection(el)];
    yield* this.wait(0.3);
  }
}


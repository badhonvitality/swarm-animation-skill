# Design System Reference

## 1. Overview

The visual language of the Swarm simulation draws inspiration from modern collaborative design environments (Figma, Linear). It utilizes an editorial parchment canvas, crisp geometric typography, high-contrast collaborative agent cursors, and technical UI overlays (rulers, dimension badges, and magnetic guides).

---

## 2. Color Palette & Tokens

### 2.1 CSS Variables & Canvas Tones
```css
:root {
  --paper: #F8F9FA;  /* Clean ivory parchment background */
  --ink: #121417;    /* Dominant dark text & high-contrast surfaces */
}
```

### 2.2 Functional Palette (`COLOR_PALETTE`)
| Token | Hex Value | Semantic Usage |
|---|---|---|
| `ink` | `#121417` | Headings, primary CTA buttons, dark cards |
| `muted` | `#62666D` | Subtitles, body copy, secondary metadata |
| `line` | `#D7DADE` | Structural grid lines, card borders, dividers |
| `accent` | `#4C5BD4` | Active status pills, progress fill, worker replicas |
| `card` | `#FFFFFF` | Feature cards, button backgrounds |
| `code` | `#131518` | Terminal window background |
| `selection` | `#0D99FF` | Selection bounding boxes, drag handles, text highlight |
| `guide` | `#F24822` | Magnetic alignment guides, distance measurements |

### 2.3 Agent Cursor Colors (`AGENT_COLORS`)
Collaborative cursor colors assigned via `id % 12`:
1. `#F24E1E` (Vibrant Red-Orange)
2. `#A259FF` (Purple)
3. `#1ABCFE` (Cyan)
4. `#0ACF83` (Emerald Green)
5. `#FF7262` (Coral)
6. `#FFC700` (Yellow-Gold)
7. `#9747FF` (Indigo)
8. `#E8467C` (Magenta)
9. `#14AE5C` (Forest Green)
10. `#0D99FF` (Electric Blue)
11. `#FF8A00` (Amber Orange)
12. `#00B5CE` (Teal)

---

## 3. Typography Scale & Fonts

The typography combines **Inter** for clean editorial readability and **JetBrains Mono** for technical code and system readouts.

### 3.1 Font Stack
- Primary Sans: `Inter, system-ui, sans-serif`
  - Font features: `font-feature-settings: "cv11", "ss01"` (disambiguated numbers and lower-case shapes)
- Monospace: `"JetBrains Mono", ui-monospace, monospace`

### 3.2 Typographic Hierarchy (`TYPOGRAPHY`)
| Token | Font Family | Size | Weight | Line Height | Letter Spacing | Color |
|---|---|---|---|---|---|---|
| `h1` | Sans | 64px | 600 | 1.02 | -0.035em | `#121417` |
| `h2` | Sans | 40px | 600 | 1.08 | -0.030em | `#121417` |
| `h3` | Sans | 21px | 600 | 1.25 | -0.012em | `#121417` |
| `lead` | Sans | 19px | 400 | 1.50 | -0.005em | `#62666D` |
| `body` | Sans | 15.5px | 400 | 1.55 | 0 | `#62666D` |
| `item` | Sans | 14.5px | 450 | 1.40 | 0 | `#121417` |
| `nav` | Sans | 14px | 500 | 1.40 | 0 | `#121417` |
| `btn` | Sans | 14.5px | 600 | 1.40 | 0 | `#FFFFFF` |
| `btnDark` | Sans | 14.5px | 600 | 1.40 | 0 | `#121417` |
| `logo` | Sans | 19px | 650 | 1.30 | -0.025em | `#43474E` |
| `brand` | Sans | 18px | 650 | 1.30 | -0.020em | `#121417` |
| `stat` | Sans | 52px | 600 | 1.00 | -0.040em | `#121417` |
| `price` | Sans | 44px | 600 | 1.05 | -0.035em | `#121417` |
| `code` | Mono | 13.5px | 400 | 1.70 | 0 | `#E0E2E5` |
| `codeDim` | Mono | 12px | 400 | 1.45 | 0 | `#81868D` |
| `nodeName` | Mono | 13px | 500 | 1.45 | 0 | `#121417` |
| `nodeWhite`| Mono | 14px | 500 | 1.45 | 0 | `#FFFFFF` |
| `small` | Mono | 12px | 400 | 1.45 | 0 | `#62666D` |

---

## 4. Cursor Shapes & Vector Geometry

### 4.1 Arrow Path (`CURSOR_ARROW_PATH`)
```
M4.6 3.9 C4.2 3.1 4.9 2.4 5.7 2.8 L20.6 9.4 C21.5 9.8 21.4 11.1 20.4 11.3 L13.9 12.9 C13.4 13 13 13.4 12.9 13.9 L11.3 20.4 C11.1 21.4 9.8 21.5 9.4 20.6 Z
```
- Rendered with white 1.5px outline stroke: `stroke: #fff, strokeWidth: 1.5, strokeLinejoin: "round"`.
- Container drops realistic subtle shadow: `filter: drop-shadow(0 1px 1.5px rgba(0,0,0,0.28))`.

### 4.2 Interactive States
- **Hover/Move**: Cursor angle matches velocity vector $\theta$.
- **Click/Press**: Scale dips dynamically: $\text{scale} = 1 - \text{press} \times 0.12$.
- **Shape Change**: Switches to pen, cross, or I-beam based on current task.

---

## 5. Technical Overlays & Rulers

### 5.1 Rulers
- Fixed height/width: 20px (`RULER_THICKNESS = 20`).
- Background: `#2C2C2C` with dark border `#3A3A3A`.
- Slide transition:
  - Top ruler: `transform: translateY((rulerProgress - 1) * 100%)`.
  - Left ruler: `transform: translateX((rulerProgress - 1) * 100%)`.
- Dynamic Ticks: Major tick at 100px (or 200/500px on zoom), minor tick at half step.
- Font: `500 9px Inter` with color `#8C8C8C`.

### 5.2 Selection Bounding Boxes & Badges
- Outline: 1px solid `#0D99FF` (or `#F24822` during duplicate dragging).
- Drag Handles: 4 corner 7×7px white squares with 1px blue border:
  `<rect x={x - 3.5} y={y - 3.5} width={7} height={7} fill="#fff" stroke="#0D99FF" strokeWidth={1} />`.
- Dimension Badges (`.badge`): Centered below element, background `#0D99FF`, font `600 11px/16px Inter`, tabular figures, text formatted as `${width} × ${height}`.
- Distance Badges: Formatted as `${distance}` in red `#F24822`.


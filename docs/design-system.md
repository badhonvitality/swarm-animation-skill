# Design System & Visual Assets

## 1. Overview

Swarm uses an editorial design language inspired by Figma and modern engineering tools. It features warm ivory surfaces, dark high-contrast typography, collaborative cursor avatars, and technical drawing overlays.

---

## 2. Color System

### 2.1 CSS Variables
- `--paper`: `#F8F9FA` (Warm canvas ivory background)
- `--ink`: `#121417` (Deep slate ink for titles and dark surfaces)

### 2.2 Semantic Colors
- `line`: `#D7DADE` (Layout rules, card borders, grid lines)
- `muted`: `#62666D` (Body text, captions, secondary details)
- `accent`: `#4C5BD4` (Replica tags, active progress track fill)
- `selection`: `#0D99FF` (Bounding boxes, drag handles, text highlights)
- `guide`: `#F24822` (Magnetic guide lines, distance metrics)
- `code`: `#131518` (Code window background)

### 2.3 Agent Cursor Colors
A palette of 12 vibrant collaborative colors:
`#F24E1E`, `#A259FF`, `#1ABCFE`, `#0ACF83`, `#FF7262`, `#FFC700`, `#9747FF`, `#E8467C`, `#14AE5C`, `#0D99FF`, `#FF8A00`, `#00B5CE`.

---

## 3. Typography Tokens

- **Primary Font**: `Inter, system-ui, sans-serif` (with `font-feature-settings: "cv11", "ss01"`)
- **Monospace Font**: `"JetBrains Mono", ui-monospace, monospace`

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `h1` | 64px | 600 | 1.02 | Hero & CTA Titles |
| `h2` | 40px | 600 | 1.08 | Section Headings |
| `h3` | 21px | 600 | 1.25 | Card Titles |
| `lead`| 19px | 400 | 1.50 | Subtitles & Hero Leads |
| `body`| 15.5px| 400 | 1.55 | Body Paragraphs |
| `btn` | 14.5px| 600 | 1.40 | Primary Buttons |
| `code`| 13.5px| 400 | 1.70 | YAML Configuration Block |
| `stat`| 52px | 600 | 1.00 | Key Numbers (10k+, 38ms) |

---

## 4. Cursor Shapes

The system implements 9 vector cursor shapes rendered in SVG with white 1.5px outlines and drop shadows:
- `arrow`: Standard navigation pointer
- `dup`: Duplicate pointer with white shadow cursor
- `pen`: Vector drawing pen
- `pen-add`: Vector drawing pen with `+` vertex badge
- `pen-close`: Vector drawing pen with `○` close path badge
- `cross`: Crosshair for dragging rectangle bounds
- `ibeam`: Text placement I-beam
- `ew`: Horizontal guide drag handle
- `ns`: Vertical guide drag handle

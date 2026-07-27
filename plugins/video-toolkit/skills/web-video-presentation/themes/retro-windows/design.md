# Retro Windows — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/retro-windows/
**Tone:** Nostalgic, retro, geeky, playful, functional
**Formality:** Low

## Overview

Retro Windows is a Windows 95/98 desktop-OS aesthetic rendered as a WVP theme. Every slide or content region reads as a window — beveled chrome, navy gradient title bar, MS Sans Serif body type, with panels, group boxes, and controls arranged as if they were software UI from 1995. The conceit is total: headlines carry the application-title voice (navy, weight 700, fixed pixel sizes), and panels behave like native Win9x chrome (raised or sunken via bevel borders).

## Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Desktop background | `#606060` | `--shell` | Gray surround behind windows |
| Window chrome | `#D4D0C8` | `--surface` | Window body, buttons, raised panels |
| Medium gray | `#C0C0C0` | `--surface-2` | Table headers, scrollbar tracks, nav dots |
| Darker gray | `#A0A0A0` | `--surface-3` | Nested surfaces, inactive gradients |
| White (content well) | `#FFFFFF` | `--surface-alt` | Sunken panels, table cells, inputs |
| Body text (dark) | `#222222` | `--text` | Paragraph text, list items |
| Secondary text | `#555555` | `--text-2` | Captions, hints, status context |
| Muted text | `#888888` | `--text-mute` | Fine print, decorative metadata |
| Text on white (headline) | `#000080` | `--text-on-alt` | Headlines in `.surface-alt` contexts |
| Accent (navy) | `#000080` | `--accent` | Title bars, progress fills, chart primary |
| Accent soft | `rgba(0,0,128,0.08)` | `--accent-soft` | Subtle highlight fills |
| Rule (shadow gray) | `#808080` | `--rule` | Bevel dark border, hr-top line |
| Rule on white | `#C0C0C0` | `--rule-on-alt` | Light gray rule on white surfaces |

### Status Colors (Retro accent palette)

| Name | Hex | CSS Variable | Semantic Meaning |
|------|-----|-------------|-----------------|
| Green — OK | `#008000` | `--accent-2` | Success, growth, READY, LIVE |
| Red — Warning | `#800000` | `--accent-3` | Error, danger, critical status |
| Yellow — Moderate | `#808000` | `--accent-4` | Caution, moderate risk, attention |
| Cyan — Tertiary | `#008080` | `--accent-5` | Tertiary chart data, secondary status |

**Rule:** The status palette has fixed semantic meanings. Green is only for OK/success. Red is only for warnings/errors. Yellow is only for moderate/caution. Cyan is only for tertiary data. Do not use them for arbitrary decoration.

**Rule:** Never introduce modern saturated colors (purple, orange, magenta). The palette is limited to Win9x system grays, navy, and the four retro accents.

## Typography

### Font Families

- **Display (Latin, system):** MS Sans Serif -> Segoe UI -> Tahoma -> Geneva -> Verdana -> sans-serif. The system body face for all standard text. This is the default font family for body, labels, headlines inside windows, buttons, tables, lists. The aesthetic depends on the "software UI" system-font register.
- **Display (pixel accent):** Press Start 2P (cursive). An 8-bit pixel display face. Reserved for the `.display` hero-headline class and splash/closing moments. Use once or twice per deck; never for body text.
- **Terminal (CRT mono):** VT323 (monospace). A chunky CRT terminal face. Reserved for `.meta` footnotes, navigation hints, marquee text, and "terminal output" regions.
- **Display (Chinese):** Noto Sans SC (sans-serif). 700 weight for headlines, 400 for body.
- **Mono:** VT323 -> Courier New -> monospace. For code-like metadata regions.

### Key Technique

Retro Windows uses fixed pixel font sizes exclusively (not `rem`/`em`/`clamp`). The OS-UI illusion depends on integer pixel sizes at 96 DPI — sub-pixel rendered sizes break the register. MS Sans Serif at 16px is the default working text; headlines inside windows use 22px navy weight 700 (the "application-title" voice). The `.display` class uses Press Start 2P for pixel-font hero moments.

### Type Scale

| Token | Size | Family | Weight | Use |
|-------|------|--------|--------|-----|
| `--t-display` | 32px | Press Start 2P | 400 | `.display` hero headline (pixel font) |
| `--t-h1` | 22px | MS Sans Serif | 700 | Primary headline inside a window |
| `--t-h2` | 18px | MS Sans Serif | 700 | Section heading |
| `--t-h3` | 14px | MS Sans Serif | 700 | Subsection heading |
| `--t-body` | 16px | MS Sans Serif | 400 | Default body text |
| `--t-caption` | 14px | MS Sans Serif | 400 | Body small, list items, button labels |
| `--t-micro` | 12px | MS Sans Serif | 400 | Fine print, status hints, slide counter |

### Signature Treatments

- Every headline inside a window body is navy (`--accent`) weight 700. Navy is the application-title voice; black headlines read as wrong-era.
- Status text uses the assigned status color (green/red/yellow/cyan) at weight 700. A green status word at default weight reads as incidental.
- The `.display` class (Press Start 2P) is center-aligned, navy, uppercase. Use it once or twice per deck — on a splash slide and a closing slide.
- Italic is not used. Underline is not used decoratively. Emphasis is achieved by weight (400 -> 700) and color switching (default -> navy or default -> status color).
- Window title text (if present) is always uppercase and styled as a filename with extension (e.g., `METRICS.LOG`, `AGENDA.TXT`, `PROPOSAL.EXE`).

## Bevel Illusion Depth System

Retro Windows uses **two-tone asymmetric borders** plus **inset box-shadows** to simulate the Win95 bevel depth. There is no blurred `box-shadow`, no `drop-shadow`, no rgba shadow tints. Every depth cue is bevel-based.

### Raised State
2px solid white on top + left, 2px solid black on right + bottom, plus `inset 1px 1px 0 white, inset -1px -1px 0 #404040`. Reads as a button or panel sitting up off the surface. Used on windows, raised panels, buttons, nav dots, `.card`.

### Sunken State
2px solid `#404040` on top + left, 2px solid white on right + bottom. Reads as a recessed input or content well. Used on group-boxes, sunken panels, text inputs, progress-bar tracks, checkboxes, scrollbar tracks.

### Active/Pressed State
Inverts the bevel — a pressed button swaps the highlight/shadow border directions. Used on `:active` state of `.btn-retro`.

### Depth Helpers
- `.bevel-raised` — reusable raised bevel utility
- `.bevel-sunken` — reusable sunken bevel utility
- `.card` — raised-bevel panel container (MUST class)
- `.panel-raised` — raised bevel panel (extension)
- `.panel-sunken` — sunken bevel panel with white interior (extension)
- `.group-box` — sunken bevel with notched title (extension)

**Rule:** No element uses both bevel and rounded corners. Border-radius is 0 on every structural element.

## CRT Scanline Overlay

A fixed, full-viewport overlay at z-index 9999 with a repeating-linear-gradient that produces 3px-period horizontal lines at 3% black opacity. Apply via the `.crt-overlay` class on a dedicated `<div>` element. The overlay imitates the horizontal phosphor lines of a CRT monitor. It is pointer-events: none and sits above all content.

```html
<div class="crt-overlay"></div>
```

The overlay is optional but recommended — it adds the CRT-texture that ties the deck to its retro-monitor metaphor. On projected displays, consider toggling it off as it can read as image noise.

## Decorative Vocabulary

### Window Chrome
The signature framing element. A beveled-raised rectangle (`win-window`) with a navy gradient title bar (`title-bar`) containing a left icon lockup (single-letter mnemonic) + filename and a right three-button cluster (`_`, `[]`, `X`). The body below contains the slide's content composition. Every slide or major content region should be framed by window chrome.

### Group Box
A sunken-bevel container (`group-box`) with a notch-mounted title (`group-box-title`) at the upper-left. The title sits in a background-painted notch that masks the border behind it — analogous to `<fieldset><legend>`.

### Raised Panel
A beveled-raised gray panel (`panel-raised`) for tool palettes, button strips, status footers.

### Sunken Panel
A beveled-sunken white panel (`panel-sunken`) for text inputs, KPI displays, read-only data. White interior is the "this is content, not chrome" signal.

### Button
A beveled-raised gray button (`btn-retro`) with 6px x 24px padding, 14px MS Sans Serif. Active state inverts the bevel. Buttons appear in clusters (OK / Cancel / Help).

### Progress Bar
A sunken white well (`progress-bar`) containing a solid navy fill div (`progress-fill`). Fill width represents the value. No gradient, no animation beyond width transition.

### Chevron List
A custom-bullet list (`retro-list`) where each item is prefixed with a navy `>` character via `::before`. Never use native browser list markers.

### Checkbox
A 16px sunken-bevel white square (`check-box`) containing a literal lowercase `x` character when checked. Bevel is inverted relative to buttons (black on top/left, white on bottom/right).

### Table
A pixel-flat data table (`retro-table`) with gray headers (--surface-2), white cells, light-gray border lines, and a barely-different zebra fill on alternate rows.

### Tree View
An Explorer-style hierarchical list (`tree-item`) with expand markers (+/-), folder/file emoji glyphs, and the label text. 24px indentation per nesting level.

### Marquee
A sunken white well (`marquee-container`) containing horizontally scrolling text (`marquee-text`) in VT323 terminal font. Animation runs 14s linear infinite.

### Beveled Separator
Horizontal (`.divider`): stacked 1px dark-on-top + 1px white-on-bottom lines. Vertical: 2px dark-gray with 1px white left border.

## Animation

Retro Windows is crisp and functional — "utility speed, not cinematic grace." Durations:
- Base reveal: 300ms
- Quick / pressed state: 150ms
- Slow reveal: 500ms

Easing is `cubic-bezier(0.25, 0.1, 0.25, 1)` (standard ease) for most reveals. No spring/overshoot — Win95 UI had no elastic transitions.

The progress-bar fill uses a 300ms width transition. The marquee scroll is 14s linear infinite. All other transitions are 300ms or instant.

## Anti-Patterns

- Don't round any corner. Border-radius: 0 on every structural element.
- Don't use blurred `box-shadow` or `drop-shadow`. All depth is bevel-based.
- Don't introduce modern brand colors (saturated purples, oranges, magentas).
- Don't use color on borders. Border two-tones are white + black or dark-gray + white only.
- Don't use `rem`/`em`/`clamp` for body type. Fixed integer pixel sizes preserve the OS-UI illusion.
- Don't use Press Start 2P or VT323 for body text. They are nostalgic accents — reserved for one or two moments per deck.
- Don't use lowercase window titles. If using filenames, they are uppercase with extensions (`METRICS.LOG`, `AGENDA.TXT`).
- Don't leave a window without its three-button cluster (`_`, `[]`, `X`).
- Don't introduce hover-state visual changes on buttons. Active-state bevel inversion is the only state change.
- Don't compose sparse slides with one centered headline. Pack with panels, group boxes, status footers.
- Don't use green for arbitrary decoration — it carries the semantic meaning "OK / success / live."
- Don't combine bevel-based depth with modern border or background techniques on the same element.

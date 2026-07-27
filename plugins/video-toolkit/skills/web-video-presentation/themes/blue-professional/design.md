# Blue Professional — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/blue-professional/
**Tone:** Professional, modern, calm, trustworthy
**Formality:** Medium-high

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Canvas | `#FDFAE7` | `--surface` | Default step background (warm cream) |
| Primary text | `#111111` | `--text` | Headlines (near-black) |
| Body text | `#6B6B6B` | `--text-2` | Body paragraphs — muted gray |
| Tertiary text | `#9A9A9A` | `--text-mute` | Slide meta, stat context lines |
| Accent | `#1E2BFA` | `--accent` | Cobalt — eyebrows, metrics, CTAs, chart fills |
| Card bg | `rgba(30,43,250,0.04)` | `--surface-2` | Cobalt at 4% — universal card fill |
| Border | `rgba(30,43,250,0.20)` | `--rule` | Cobalt at 20% — soft card border |
| Accent light | `rgba(30,43,250,0.08)` | `--accent-soft` | Tag pill bg, bar tracks, highlight blocks |
| Positive | `#059669` | — | Inline change indicator (green text, no fill) |
| Negative | `#DC2626` | — | Inline change indicator (red text, no fill) |

**Rule:** One accent, three text grays. Cobalt does all emphasis. No secondary accent color. No drop shadows except CTA hover.

## Typography

- **Display / Chrome (Latin):** Space Grotesk, weights 500-700. For h1-h4 headings, all metric/stat numerals, CTAs, tag pills, slide counters, step circles, agenda numbers, bar percentages. Negative letter-spacing (-0.02em) on all headlines.
- **Display (Chinese):** Noto Serif SC, weight 700. Use `.display-cn` for Chinese headlines.
- **Body (Latin):** Inter, weight 400. Paragraphs, list bodies, metric descriptions. Line-height 1.6 in muted gray (`#6B6B6B`).
- **Body (Chinese):** Noto Sans SC, weight 400 for body; Noto Serif SC for editorial register.
- **h4 Eyebrow:** Space Grosket weight 600, cobalt, uppercase, 0.08em tracking. Non-negotiable.

**Key technique:** Cobalt numerals on every numerical callout. Near-black headlines. Muted gray body. The three-tier text hierarchy (black / cobalt / gray) is the system's voice.

## Decoration Vocabulary

### Tinted Cards
Cards use a 4% cobalt tint (`rgba(30,43,250,0.04)`) with 1.5px cobalt-at-20% borders and 10-14px rounded corners. No drop shadows — depth is implied by border + tint, not by offset.

### Pill-Shaped Chrome
- **Tag pill:** Soft cobalt tint bg, cobalt text, 100px border-radius, 0.35rem/0.9rem padding.
- **CTA button:** Solid cobalt pill with cream text, 100px border-radius, 0.9rem/2.2rem padding. Hover lifts -2px with soft cobalt shadow (the only shadow in the system).
- **Nav buttons:** 44px circular, 1.5px cobalt-at-20% border, cream fill. Hover inverts.

### Accent Elements
- **Accent line:** 60x4px horizontal cobalt rule, 2px radius.
- **Accent dot:** 8px cobalt circle.
- **Step circle:** 56px solid cobalt circle with cream numeral.
- **Bar track + fill:** 28px track in soft cobalt tint, solid cobalt fill, 6px radius.
- **Progress bar:** 3px solid cobalt strip at bottom edge.

### Slide Header
Every content slide carries an h4 eyebrow (cobalt, uppercase, 0.08em) on the left and a tag pill on the right. This rhythm is structural.

## Animation

- Slide transition: 500ms ease, opacity + translateX 40px.
- Bar fill animation: 0.8s ease from 0 to data value.
- CTA hover: 200ms transform + shadow.
- Progress bar: 400ms ease width change.
- Nav button hover: 200ms background/color swap.

## Anti-Patterns

- Don't introduce a second accent color. Cobalt is the only accent.
- Don't set headlines in cobalt. Headlines are near-black (`#111111`). Cobalt is for accent moments only.
- Don't use drop shadows on cards or content. Zero box-shadows except the single CTA hover.
- Don't use opaque cobalt borders on cards. Borders are always cobalt at 20% opacity.
- Don't substitute fonts. Space Grotesk + Inter is the pairing.
- Don't use square corners (0px radius) anywhere. Minimum 10px radius on content containers.
- Don't omit the slide-header (h4 eyebrow + tag pill) on content slides.
- Don't use uppercase body text. Uppercase is reserved for h4 eyebrows and cite lines.

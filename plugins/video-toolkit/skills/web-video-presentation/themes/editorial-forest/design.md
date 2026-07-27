# Editorial Forest — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/editorial-forest/
**Tone:** Editorial, quiet, considered, warm, intentional
**Formality:** Medium

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Forest green | `#2E4A2A` | `--accent` / `--text-2` | Surface, headline color, border, tile fill |
| Green deep | `#243A21` | `--surface-alt` | Text on pink surfaces, darker green tile |
| Green lite | `#3A5A36` | `--surface-5` | Secondary tile fill |
| Dusty pink | `#E89CB1` | `--accent-pink` | Surface, accent, stat figures, monogram border |
| Oat cream | `#EFE7D4` | `--surface` | Default slide background |
| Cream 2 | `#E6DCC4` | `--surface-2` | Tile fill on cream surface |
| Ink | `#1A1A17` | `--text` | Body text on cream — warm near-black |

**Rule:** No shadows. No rgba for surface colors. 2px hairline rules separate stacked sections.

## Typography

- **Display / Headline / Body:** Source Serif 4 with optical-size axis (opsz 8..60). Weight 500 for display, 400 for body. Negative letter-spacing (-0.01 to -0.03em) on display.
- **Chrome only:** JetBrains Mono at weight 500, uppercase with 0.08–0.18em letter-spacing. Never sentence case.
- **Weights:** 500 for display, 400 for body, 600 for names in attribution. Weight 700 is not used.
- **CJK:** LXGW WenKai for display (literary kaiti matching Source Serif 4 register), Noto Serif SC for body, Noto Sans Mono CJK SC for mono chrome.

## Decoration Vocabulary

- **Topbar:** Every slide carries a mono label + monogram/counter row at the top — the system's spine.
- **Footline:** Abs-pos mono caption row at bottom on cover, data, and summary slides.
- **Monogram circle:** 130px outlined circle with 2px pink border, JetBrains Mono monogram at 28px. Identity stamp on cover/summary.
- **Topic tile:** 6px radius region with mono ordinal, serif title, optional body, mono foot. Fills rotate: green, pink, green-lite, cream-2-with-border.
- **Step tile:** 8px radius card with 2.5px border, mono ordinal, serif title (68px), body, mono marker row separated by top rule.
- **KPI block:** Mono tag + 220px serif figure + serif description. Separated by 2px pink rule on green surfaces.
- **Bar chart:** 56px-wide rectangles with 3px top radius, filled in pink/cream/green.
- **2px hairline rules:** Universal separator language — never 1px or 3px+.

## Animation Guidance

- Slide transition: handled by deck-stage.js. Fixed 1920×1080 canvas.
- Navigation via deck-stage keyboard controls.
- No hover states.
- No media queries — fixed 1920×1080.

## Anti-Patterns

- No box-shadows on any element. Elevation is color-block + rule.
- No third typeface. Only Source Serif 4 and JetBrains Mono.
- No italic or underline. Emphasis through size and color.
- No mono in sentence case or without letter-spacing.
- No fourth chromatic family (yellow, blue, lavender).
- No heavy borders (4px+) or thin hairlines (1px). 2px or 2.5px only.
- No rgba transparency for surface colors — solid ink-on-paper.
- No serif body at weight 500 — body is 400.
- No omitting the topbar — it is load-bearing.

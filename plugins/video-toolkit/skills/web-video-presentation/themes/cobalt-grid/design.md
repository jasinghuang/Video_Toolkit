# Cobalt Grid — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/cobalt-grid/
**Tone:** Editorial, design-research, studious, modernist, tech-print, monochrome
**Formality:** High

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Cream paper | `#F0EBDE` | `--surface` | Universal slide background and QR-block fill |
| Paper 2 | `#E6E0CE` | `--surface-2` | Deeper cream for subtle region differentiation (rare) |
| Electric cobalt | `#1F2BE0` | `--text` / `--accent` / `--rule` | *Only* ink color — headlines, body, borders, chrome, grid, decoration |
| Ink soft | `#5560E5` | `--text-2` | Lighter cobalt for secondary marks (rare) |
| Grid | `rgba(31,43,224,0.10)` | `--accent-soft` | 10% cobalt — permanent graph-paper grid |
| Ink faint | `rgba(31,43,224,0.18)` | `--accent-glow` | 18% cobalt — row dividers in dense lists |

**Rule:** Strictly two-color. Cream + cobalt. No accent colors. Cobalt-on-cream is the only text relationship. Adding a red, green, or yellow highlight breaks the risograph identity.

## Typography

- **Display / Headline:** Newsreader at weight 400 only. Negative letter-spacing (-0.005 to -0.015em). No bolding — hierarchy through size.
- **Body / Labels:** Hanken Grotesk at weight 400 (body) and 600 (labels). Labels are uppercase with 0.16+em letter-spacing.
- **Chrome:** DM Mono at weight 400 with 0.04–0.06em letter-spacing. Page numbers, tags, ticks, vertical-stack labels.
- **CJK:** Noto Serif SC appended after Newsreader and Hanken stacks. Mono chrome stays Latin/digit-only.
- **Italic:** Newsreader italic (300/400/500) available for inline `<em>` and manifesto emphasis.

## Decoration Vocabulary

- **Graph-paper grid:** Permanent ::before pseudo on every stage at 10% cobalt. 28–44px cell size via clamp. Cannot be disabled.
- **Top/bottom hairlines:** 1.5px cobalt rules inset from edges, framing every slide.
- **Page number:** DM Mono bottom-right, above the bottom hairline with clear vertical space.
- **Pixel-glitch column:** Stair-stepped vertical SVG scanline column, decorative only, z-index 3. Anchored to right edge (or left on colophon).
- **QR-block patch:** 8×8 grid of cobalt/paper cells, paper-filled background with paper-color box-shadow outset. 58–100px square.
- **Pixel-stack bar chart:** Column-reverse stacks of small grid-unit cells — cobalt on / cobalt-10% off — echoing the glitch decoration.
- **Ledger table:** 5-column rows (num-tag / name / description / mood-tag / delta-tag) separated by 1px faint-cobalt dividers.
- **Vertical-stack label column:** `writing-mode: vertical-rl` DM Mono label column, right edge.

## Animation Guidance

- Slide transition: 280ms opacity fade.
- Navigation: arrow keys, space, Home/End, touch swipe.
- Nav hint: DM Mono bottom-left at 40% opacity.

## Anti-Patterns

- No second ink color. The system is strictly two-color.
- No Newsreader at weight 600/700. 400-only is a signature.
- No disabling or hiding the graph-paper grid.
- No suppressing the top/bottom hairlines.
- No rounded corners anywhere. Zero.
- No drop shadows, elevated cards, or gradients.
- No Hanken caps without 0.16em+ tracking.
- No QR-block without its paper-fill and paper-color outset.
- No crowding the manifesto, quote, or colophon layouts.

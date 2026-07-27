# Creative Mode — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/creative-mode/
**Tone:** Creative, confident, playful, design-led, graphic
**Formality:** Medium

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Cream | `#EFE9D9` | `--surface` | Universal slide background |
| Cream 2 | `#E4DCC4` | `--surface-2` | Table background fill |
| Ink | `#0F0F0F` | `--text` / `--rule` | All borders, body text, chrome |
| Forest green | `#1F8A4C` | `--accent` | Primary accent. Full-slide closing background |
| Hot pink | `#F06CA8` | `--accent-pink` | High-energy accent: stat cells, step cards, stamp |
| Burnt orange | `#E85A1F` | `--accent-orange` | Hard shadow color, stat cells, bars |
| Sunshine yellow | `#F5C518` | `--accent-yellow` | Decorative circles, badges, bar chart |

**Rule:** Four accent colors used as flat fills. Each slide uses 2–3 of the 4 — never all simultaneously. Green background reserved for the closing slide only (full-bleed impact).

## Typography

- **Display / Headline / Step numbers:** Archivo Black, weight 400 (face is intrinsically heavy). Uppercase ONLY, line-height 0.92, letter-spacing -0.01em. Never lowercase.
- **Body:** Space Grotesk, weight 400 at 24–28px. Left-aligned only — never centered.
- **Mono / Labels / Chrome:** JetBrains Mono, weight 400, uppercase with 0.06–0.14em letter-spacing. Topbar at 0.08em, slide-meta at 0.06em, kicker at 0.14em.
- **CJK:** Noto Serif SC weight 900 for display (no direct Archivo Black equivalent), weight 400 for body. Mono chrome stays Latin/digit-only.
- **Fixed 1920×1080 canvas** — font sizes in pixels.

## Decoration Vocabulary

- **4px solid ink borders:** Universal on all structural elements — stat cells, step cards, table, diagram panels.
- **Hard offset shadows:** `24px 24px 0 orange, 24px 24px 0 4px ink` for hero blocks; `18px 18px 0 ink` for diagram stacked blocks.
- **Topbar:** JetBrains Mono chrome at top:48px (left text + pill badge on right).
- **Slide-meta:** Footer chrome at bottom:40px (label + slide number with ink dot divider).
- **Kicker block:** Inverted JetBrains Mono label — black bg, cream text, 0.14em tracking.
- **Marker block:** Archivo Black featured label at 46px, pink fill, 4px ink border.
- **Stamp:** Rotated -6deg, pink fill, cream border, circular inner border.
- **Badge:** Rotated -4deg, yellow fill, 4px ink border.
- **Step arrow:** CSS triangle (border-left: 24px ink) between step cards.

## Animation Guidance

- Slide navigation via deck-stage.js (arrow keys, space).
- No hover states defined.
- Fixed 1920×1080 canvas — no mobile breakpoints.

## Anti-Patterns

- No rounded card corners (except the topbar pill: 999px).
- No gradients, blurred drop shadows, or glow effects.
- No Archivo Black in sentence case. Uppercase is non-negotiable.
- No letter-spacing on Archivo Black (except the built-in -0.01em).
- No fifth accent color. The four-color palette is the constraint.
- No pure white (#FFFFFF) as background. Cream is the canvas.
- No Space Grotesk for labels — that role belongs to JetBrains Mono.
- No centering body text.
- No softening stamp (-4deg) or badge (-6deg) rotation angles.

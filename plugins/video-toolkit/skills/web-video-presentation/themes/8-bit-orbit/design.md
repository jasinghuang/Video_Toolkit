# 8-Bit Orbit — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/8-bit-orbit/
**Tone:** Retro-tech, playful, cyberpunk, energetic
**Formality:** Low

## Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Dark void | `#0A0E27` | `--surface` | Default step background (deep navy void) |
| Deep navy | `#0F1B3D` | `--surface-2` | Card/panel surface, shadow color |
| Neon cyan | `#5EDCF4` | `--accent` | Primary glow — headlines, buttons, chart bars |
| Neon pink | `#F0A6CA` | `--pink` | Warm accent — colored grid surface, buttons |
| Neon yellow | `#F4D03F` | `--yellow` | High-key alert — shadow halos, badges, rules |
| Soft lavender | `#E2D5F2` | `--surface-alt-3` | Calm pastel surface variant |
| Text on dark | `#5EDCF4` | `--text` | Cyan headlines on dark void |
| Text on alt | `#0F1B3D` | `--text-on-alt` | Navy text on colored surfaces |

**Rule:** Neons are reserved for headlines, stats, label fills, and rules — never for body text.

## Typography

- **Display (Latin):** Tektur, weight 900 (hero) or 700 (headlines), positive letter-spacing (+0.04em on hero). Use `.display`.
- **Display (Chinese):** Noto Sans SC, weight 900, letter-spacing 0.
- **Body:** Chakra Petch, weight 400, line-height >= 1.7. Use `.body`.
- **Chrome (HUD labels):** Space Mono, uppercase, 0.08-0.2em tracking. Use `.label` with navy bg + neon text pill.

**Key signatures:**
- Pixel-hero text gets two-layer text-shadow: `4px 4px 0 yellow, 8px 8px 0 navy`.
- Stat numerals get small shadow: `3px 3px 0 navy`.
- Every Space Mono element is uppercase with wide tracking.

## Surface System

- **Dark void (`--surface`, default):** Navy ground with etched 40px cyan grid. Use for most content slides.
- **Colored surfaces:** Apply `.surface-alt` (cyan), `.surface-alt-2` (pink), or `.surface-alt-3` (lavender) for warm / calm reprieves with navy grid lines and navy text.

## Decorative Vocabulary

- **Pixel corner brackets:** L-shaped brackets at top-left + bottom-right replace rounded corners.
- **Label pill:** `.label` = navy rectangle with neon Space Mono text — universal section eyebrow.
- **Stat block:** Cyan-tinted tile (8% cyan fill) with cyan corner brackets.
- **Accent rule:** `.accent-rule` = 60x4 yellow rule with 4px navy offset shadow.

## Animation

Arcade-snappy:
- Base reveal: 400ms
- Slide transition: 800ms
- Easing: `--ease-enter` for crisp enters, `--ease-slide` for page turns

## Anti-Patterns

- Don't round any corner. The pixel aesthetic depends on square edges.
- Don't blur any shadow. Every shadow is hard-edged at zero blur.
- Don't place neon text on neon surfaces — switch to navy text on colored grounds.
- Don't introduce a fourth neon. The trio (cyan, pink, yellow) is curated.
- Don't use uppercase on Chakra Petch body text.

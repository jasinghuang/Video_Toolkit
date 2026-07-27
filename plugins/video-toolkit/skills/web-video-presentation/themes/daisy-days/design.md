# Daisy Days — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/daisy-days/
**Tone:** Cheerful, playful, warm, friendly
**Formality:** Low

## Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Warm cream | `#F5F0E6` | `--surface` | Default step background |
| White | `#FFFFFF` | `--surface-2` | Card fill |
| Dark charcoal | `#2D2D2D` | `--text`, `--rule` | Text color + 3px outlines |
| Butter yellow | `#FDE68A` | `--accent` | Primary accent, badge fill |
| Turquoise | `#7ECDC0` | `--turquoise` | Colored surface variant |
| Soft pink | `#F7C8D4` | `--soft-pink` | Colored surface variant |
| Mint | `#A8E6CF` | `--mint` | Colored surface variant |
| Lavender | `#D4A5E8` | `--lavender` | Colored surface variant |
| Peach | `#FFCBA4` | `--peach` | Colored surface variant |
| Coral | `#F8635F` | `--coral` | Point accent |
| Sky blue | `#A8D8F0` | `--sky` | Colored surface variant |

**Rule:** Every card, badge, and decorative element gets a 3px solid dark charcoal outline. Hard offset shadows use the same charcoal. Colored surfaces get text-shadow for headines.

## Typography

- **Display (Latin):** Fredoka One, weight 400. Chunky rounded letterforms. Use `.display`.
- **Display (Chinese):** Noto Sans SC at weight 700 or ZCOOL KuaiLe for a rounded feel.
- **Body:** Quicksand, weight 500. Use `.body`.
- **Tags/badges:** Fredoka One, same as display, for consistency.

**Key signatures:**
- All Fredoka One text uses positive letter-spacing (+0.02em) — never negative.
- Rounded outlines and offset shadows are part of the type identity.
- Colored-surface headlines get a `text-shadow` for depth.

## Surface System

- **Cream (`--surface`, default):** Warm cream base for title and content slides.
- **Colored surfaces:** Apply `.surface-turquoise`, `.surface-pink`, `.surface-butter`, `.surface-mint`, `.surface-lavender`, or `.surface-peach` as a step root class for full-surface color backgrounds. Always use dark charcoal text on colored surfaces.

## Decorative Vocabulary

- **Hard offset shadows:** 6px solid dark charcoal box-shadow on cards, step circles, and chart containers. Sweet and playful, not brutalist.
- **3px outlines:** Every card, badge, circle, and decorative shape has a 3px charcoal border.
- **Rounded corners:** 16-20px radius on cards, 50px on pill badges, 50% on circular elements. The roundedness is the system's warmth.
- **SVG decorations:** Hand-drawn daisies, stars, suns, clouds, and rainbows positioned absolutely as background decoration. Place them in `.deco` containers.

## Animation

Bouncy and cheerful:
- Base reveal: 400ms
- Slide transition: 600ms
- Easing: `--ease-bounce` for energetic entrances, `--ease-smooth` for transitions

## Anti-Patterns

- Don't remove the 3px outlines — they are the system's defining visual signature.
- Don't use sharp corners (border-radius: 0). Roundedness is the system's warmth.
- Don't use dark or saturated surface colors — the palette is pastel and light.
- Don't use monospace for body text. Quicksand is friendly; keep mono for metadata only.
- Don't use uppercase display — Fredoka One is designed for mixed case.
- Don't use negative letter-spacing — Fredoka One uses +0.02em positive tracking.

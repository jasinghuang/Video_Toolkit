# Biennale Yellow — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/biennale-yellow/
**Tone:** Editorial, atmospheric, warm, contemplative
**Formality:** High

## Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Warm parchment | `#E9E5DB` | `--surface` | Default step background |
| Deeper parchment | `#DCD6C4` | `--surface-2` | Card / inset surface |
| Solar yellow | `#F1EE2E` | `--surface-alt` | Alternate full-slide yellow surface |
| Indigo navy | `#1B2566` | `--text` | Only text color — every word in indigo |
| Solar yellow | `#F1EE2E` | `--accent` | Yellow accent — blooms, decorative blocks |
| Peach ember | `#E26B4A` | `--ember` | Warm corner-edge accent |

**Rule:** Indigo navy is the only text color. Yellow is for atmospheric blooms and accent panels, never for text.

## Typography

- **Display (Latin):** Instrument Serif, weight 400, large scale (clamp 72-200px), negative letter-spacing. Use `.display`.
- **Display italic:** Instrument Serif italic, weight 400. Use `.display-italic` for statement quotes.
- **Display (Chinese):** Noto Serif SC, weight 700.
- **Body:** Archivo, weight 400. Use `.body`.
- **Chrome:** Archivo, weight 600, uppercase, 0.18-0.22em tracking. Use `.label`.
- **Mono data:** JetBrains Mono, weight 400. Use `.mono-tab`.

**Key signatures:**
- Instrument Serif at extreme scale (up to 400px for numerals) with tight leading (0.84-0.86).
- Italic quote body as the signature statement treatment.
- Every chrome element is uppercase Archivo with 0.18em+ tracking.

## Surface System

- **Parchment (`--surface`, default):** Warm paper ground with optional sun-glow radial blooms. Default for all slides.
- **Solar yellow (`--surface-alt`):** Apply `.surface-alt` for full-yellow panels (programme spread left column). Yellow always carries indigo text.

## Decorative Vocabulary

- **Sun-glow overlay:** Yellow radial gradient bloom (`.glow-yellow`) layered behind content for atmospheric depth.
- **Block grid:** Decorative yellow transparent blocks on cover and colophon slides.
- **Hairline rules:** All structural dividers are 1px solid indigo. No thicker rules exist.
- **Jumbo numeral:** Instrument Serif at extreme scale (`.numeral-jumbo`) for chapter dividers.

## Animation

Slow and contemplative like a museum pace:
- Base reveal: 800ms
- Slow / dramatic: 1200ms
- Cinematic entrance: 1400ms

Easing is `--ease-quart` for smooth deceleration. No spring or overshoot.

## Anti-Patterns

- Don't use yellow as text color — it's atmospheric fill only.
- Don't use thick rules (>1px). Hairline indigo is the only rule weight.
- Don't add drop shadows, rounded corners, or bordered cards.
- Don't use bold weights on Instrument Serif — it's weight 400 everywhere.
- Don't add a third accent color beyond solar yellow and peach ember.
- Don't introduce a second typeface beyond the three (Instrument Serif, Archivo, JetBrains Mono).

# Pin & Paper — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/pin-and-paper/
**Tone:** Crafted, handmade, warm, literary, intimate
**Formality:** Medium

## Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Yellow paper | `#EFE56A` | `--surface` | Default step background (legal-pad) |
| Light yellow | `#F5ECA0` | `--surface-2` | Card variant surface |
| Warm cream | `#F8F1D6` | `--surface-paper` | Note card / panel surface |
| Ink blue | `#1F3A8A` | `--text`, `--accent` | Primary text, rules, shadow color |
| Soft ink | `#2D4FB8` | `--text-2` | Secondary text |
| Rust red | `#C2342B` | `--red` | Stamp accent — use sparingly |
| Kraft | `#C9A66B` | `--kraft` | Paper accent — very sparing |

**Rule:** Ink blue is the primary chromatic identity. Yellow provides the ground. Red is for stamps only — one per deck maximum.

## Typography

- **Display (Latin):** Space Grotesk, weight 700, negative tracking (-0.03 to -0.04em). Use `.display`.
- **Display (Chinese):** Noto Sans SC, weight 700, slight negative tracking.
- **Body:** Space Grotesk, weight 400. Use `.body`.
- **Script/Caveat:** Caveat, weight 600. Use `.scribble` for handwritten-style annotations. The script is the system's personality — use for personal notes, annotations, and emphasis.
- **Chrome:** DM Mono, weight 500, uppercase, 0.12-0.18em tracking. Use `.label`, `.chrome-mono`.

**Key signature:** Handwritten Caveat annotations (`.scribble`) paired with Space Grotesk heavy headlines create the "field notebook" voice.

## Surface System

- **Yellow paper (`--surface`, default):** Yellow legal-pad ground with paper-grain texture overlay. Default for all content slides.
- **Cream paper (`--surface-paper`):** Use for note cards and panels. Ink border + hard offset shadow.
- **Ink (`--surface-ink`):** Apply class `.surface-ink` for full-ink-blue dramatic section dividers with yellow text.

## Decorative Vocabulary

- **Safety-pin SVG illustrations:** Hand-drawn closed and open safety pins (use as inline SVG). They "pin" cards to the page — the system's most recognizable decorative signature. Place at card top edges via `.pin-top`.
- **Paper-grain texture:** Fractal-noise SVG overlay at 35% opacity, multiply blend mode. Applied automatically to every slide.
- **Hard offset shadows:** Cards use `5px 6px 0 ink-blue` offset shadow — crafty, not polished.
- **Dashed rules:** Dividers use 1.5px dashed ink-blue lines — reminiscent of torn notebook paper.
- **Red stamp:** `.stamp` — rotated red-bordered mono label for urgent or emphatic callouts.
- **Chrome bar:** Mono uppercase header (`.chrome-mono`) at top of every content slide.

## Animation

Warm and unhurried:
- Base reveal: 600ms
- Slow reveal: 900ms
- Easing: `--ease-smooth` for gentle reveals

## Anti-Patterns

- Don't use pure white or pure black surfaces. Start from yellow or cream.
- Don't remove the paper-grain texture — it's the system's foundational atmosphere.
- Don't use sans-serif for annotations. Caveat script is the handwritten voice.
- Don't use rounded corners on ink surfaces or chrome elements.
- Don't use glossy or digital-native effects. The system is analog.
- Don't use the red stamp on more than one element per deck.
- Don't use gradients — the system's depth comes from offset shadows and paper grain.

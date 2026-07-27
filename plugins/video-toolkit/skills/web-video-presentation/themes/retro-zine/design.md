# Retro Zine — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/retro-zine/
**Tone:** Crafted, lo-fi, underground, warm-retro, editorial
**Formality:** Medium-low

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Surface (khaki) | `#C8B99A` | `--surface` | Default step background — warm paper |
| Surface dark | `#B8A98A` | `--surface-2` | Darker khaki for layered regions |
| Green accent | `#008F4D` | `--accent` | Forest green — headlines, stamps, ribbon bars, drop caps |
| Black | `#1A1A1A` | `--text` | Body text, all borders |
| White-cream | `#F4EFE6` | `--text-on-alt` | Card fill, text on green/black surfaces |

**Rule:** No pure white (#FFFFFF). No gray. The khaki + green + black + cream is the entire palette. Green = emphasis, black = structure.

## Typography

- **Display (Latin):** Bebas Neue, weight 400, always uppercase with 0.02–0.04em tracking. Never lowercase.
- **Display (Chinese):** Noto Serif SC, weight 700. Tracked display headlines drop to 0 letter-spacing on CJK.
- **Body:** Space Grotesk, weight 400 at 13–18px. Deliberately small for zine column density.
- **Hand-script:** Caveat, weight 600 for attributions and decorative notes. Human voice — no Chinese equivalent, keep in Latin.
- **Mono:** JetBrains Mono for labels and metadata at 11–14px, uppercase.

## Decoration Vocabulary

- **Grain overlay:** Fixed SVG fractal-noise overlay at 7% opacity over every slide. Required — removing it breaks the printed-paper register.
- **3px black borders:** On every structural element (cards, grids, collage pieces).
- **Card-offset:** White-cream card with green ::before slab offset 12px down-right.
- **Stamp/Stamp-alt:** Elements rotated -8deg or +6deg to read as hand-pressed ink stamps.
- **Ribbon bar:** Solid green color block with cream text.
- **Drop cap:** Green Bebas Neue initial at 48–80px, floated left.
- **Inline highlight:** Black-on-khaki marker swipe.
- **Divider stub:** 60–80px × 4px horizontal rule in cream or green.

## Animation Guidance

- Slide transition: 600ms opacity + translateY(20px) for paper-shuffle feel.
- Navigation: arrow keys, space, click (left/right halves), touch swipe.
- Progress bar: 4px green bar flush along bottom edge.

## Anti-Patterns

- No rounded corners anywhere. Border-radius is 0.
- No blurred drop shadows. Depth is paper-on-paper offset and rotation.
- No uppercase Caveat — Bebas is the uppercase voice.
- Do not introduce a third brand color.
- Body text never exceeds 18px.
- Do not use pure white.
- Green and black are not interchangeable — green = emphasis, black = structure.

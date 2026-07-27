# Editorial Tri-Tone — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/editorial-tri-tone/
**Tone:** Editorial, warm, intentional, moody, literary
**Formality:** Medium-high

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Blush pink | `#F2B6C6` | `--pink` / `--accent` | Accent on dark surfaces, stat figure color, quote mark glow |
| Golden butter | `#F2D86A` | `--butter` / `--surface` | Light surface background, card background |
| Deep burgundy | `#7A1F35` | `--burgundy` / `--surface-alt` | Primary dark surface, all text color |
| Ink aliases | `#7A1F35` | `--navy, --forest, --ink` | All resolve to burgundy — context aliases only |

**Rule:** Three hex values, eleven CSS variable names. Every alias is a semantic rename — no variation. No neutrals, no grays, no white.

## Typography

- **Display:** Bricolage Grotesque (variable with optical-size axis). Weights 500–800 with negative tracking (-0.02 to -0.06em). The em rule: `<em>` triggers Instrument Serif italic.
- **Serif accent:** Instrument Serif, weight 400, italic cut. For chapter numerals, quote marks, years, signatures, stat unit symbols only. Never used for running text.
- **Body:** Bricolage Grotesque at weight 400 for paragraph text, 500–600 for emphasized labels.
- **Mono:** JetBrains Mono, uppercase with 0.10–0.18em tracking. For labels, section markers, footnotes.
- **Section markers:** `§ NN — Title` convention in JetBrains Mono.

## Decoration Vocabulary

- **Pills:** 999px border-radius, universal tag component at three sizes (cover: 44px font, standard: 22–24px, closer: 22px).
- **Value cards:** 28px radius, alternation pattern — odd = dark (burgundy/butter), even = light (butter/burgundy).
- **RGBA dividers on dark surfaces:** `rgba(246,237,220,0.25)` — whispered separators, never solid color.
- **Footer chrome:** JetBrains Mono uppercase at 16px, 0.75 opacity, with dot-row progress indicator (8px circles, 30%/100% opacity).
- **Timeline ribbon:** Burgundy pill with butter text, JetBrains Mono, 999px radius.
- **Swatch circles:** 36px circles in palette colors.

## Animation Guidance

- Slide transition: 600ms, handled by deck-stage component.
- No hover states defined.
- Fixed 1920×1080 canvas — all measurements in pixels.

## Anti-Patterns

- No fourth color. The tri-tone constraint is the premise.
- No Instruments Serif at small sizes or in body paragraphs — accent face only.
- No breaking the em rule — use Instrument Serif italic for inline emphasis.
- No letter-spacing on Bricolage Grotesque at display sizes (only negative tracking).
- No solid-color dividers on dark surfaces — use rgba only.
- No box shadows anywhere.
- No Bricolage weight 800 except in the wordmark.

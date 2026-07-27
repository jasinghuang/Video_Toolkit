# Bold Poster — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/bold-poster/
**Tone:** Bold, editorial, loud, confident
**Formality:** Medium

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Canvas | `#FFFFFF` | `--surface` | Default step background (white paper) |
| Ink | `#1C1410` | `--text` | Deep brown-black — headlines, body, borders |
| Red accent | `#D8000F` | `--accent` | Saturated tomato red — numerals, labels, bullets, CTA |
| Light | `#F5F2EF` | `--surface-2` | Warm off-white — alternating panel striping |
| Dark panel | `#1C1410` | `--surface-alt-2` | Full-bleed dark surface (roadmap slides) |
| Red panel | `#D8000F` | `--surface-alt` | Full-bleed red surface (statement slides) |

**Rule:** Four-color palette only. Never introduce a fifth color. All emphasis is achieved by red.

## Typography

- **Display (Latin):** Shrikhand, weight 400 (only weight available). For every display moment, section header, stat figure, card title, quote. Routinely rotated -6 to +2 degrees. Always weight 400.
- **Display (Chinese):** Noto Serif SC, weight 900. Heavy Mincho carries the poster register.
- **Body (Latin):** Libre Baskerville, weight 400. Literary serif at 11-16px, line-height 1.75. The editorial body voice.
- **Body (Chinese):** Noto Serif SC, weight 400.
- **Chrome (Latin):** Space Grotesk, weight 600. Uppercase labels at 9-12px with 2-3px tracking. For section eyebrows, bullet bodies, slide counter, footer links.
- **Chrome (Chinese):** Noto Sans SC, weight 500.

**Key technique:** The three-face stack (Shrikhand / Libre Baskerville / Space Grotesk) is non-negotiable. Roles do not overlap. Red Shrikhand numerals are the data voice.

## Decoration Vocabulary

### Heavy Ink Borders
- 3px solid ink: outer tabular grid borders, pillar separators.
- 1.5px solid ink: inner cell borders.
- 4px solid red: editorial leftbar cards.
- 2px solid red: footer link underlines.
- 5px solid red: progress bar at bottom edge.

### Red Leftbar Card
A 4px solid red left rule with 18px padding-left. No outline, no fill — the card is defined by the red rule alone.

### Double-Border Tabular Grid
3px ink outer border + 1.5px ink inner cell borders touching at intersections. Produces a printed-newsprint quality.

### Stacked Text Shadow
Three-step decreasing-opacity ink shadow on red display text on red panels:
```
text-shadow: 2px 2px 0 rgba(28,20,16,0.25), 4px 4px 0 rgba(28,20,16,0.2), 6px 6px 0 rgba(28,20,16,0.15);
```
This is the only shadow in the system.

### Hero Title Stack
Multi-line Shrikhand composition where each line is a different size. At least one line rotated, at least one in red. The system's signature opener.

### Surface Variations
- White: default content surfaces.
- Red panels: full-bleed for statement/quote (white text + stacked text-shadow).
- Dark panels: full-bleed for roadmap (white text, red accents).
- Off-white: alternating pillar columns.

### Bullet Markers
Red em-dash (--) or round-bullet (.) glyphs at absolute left. Default disc bullets do not exist.

## Animation

- Slide transition: 550ms cubic-bezier(0.22, 1, 0.36, 1) with opacity + translateY 30px + scale 0.98 to 1.
- Progress bar: 500ms cubic-bezier ease.
- Footer links: text color swaps from dark to red on hover (300ms).
- No other animations — the system relies on print-poster static confidence.

## Anti-Patterns

- Don't introduce a second accent color. Red is the only accent.
- Don't round any corner on cards, panels, cells, or callouts. Square corners are non-negotiable (4px hint-pill is the only exception).
- Don't add drop shadows or blurred shadows. The only shadow is the stacked text-shadow on red display text.
- Don't substitute fonts. Shrikhand + Libre Baskerville + Space Grotesk is the trio.
- Don't use Shrikhand for body or Libre Baskerville for labels.
- Don't omit the tilt on hero-class red Shrikhand elements. Rotation is the system's signature movement.
- Don't render headlines in red on white surfaces (except for stat-big, close-big, hero-title-red).
- Don't tighten Libre Baskerville line-height below 1.5.

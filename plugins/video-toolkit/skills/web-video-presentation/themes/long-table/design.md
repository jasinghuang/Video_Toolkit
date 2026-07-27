# Long Table — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/long-table/
**Tone:** Warm, intimate, modern, friendly, hospitality
**Formality:** Medium

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Paper | `#FAF1E2` | `--surface` | Default step background (buttery cream paper) |
| Paper dark | `#F2E5CF` | `--surface-2` | Slightly darker cream |
| Ink | `#B53D2A` | `--text` | THE ONLY COLOR — warm rust terracotta |
| Ink deep | `#8E2D1F` | — | Deeper rust for emphasis (sparingly used) |
| Ink @ 78% | `rgba(181,61,42,0.78)` | `--text-2` | De-emphasized metadata |
| Ink @ 50% | `rgba(181,61,42,0.50)` | — | Paper-texture overlay dots |
| Ink @ 32% | `rgba(181,61,42,0.32)` | `--rule-32` | Internal dividers (solid and dashed) |

**Rule:** Single-ink system. Every visible mark is the same rust terracotta on cream paper. Opacity variants are the only chromatic variation. Zero second colors.

## Typography

- **Display (Latin):** Bricolage Grotesque, weights 700-800, variable opsz. UPPERCASE ONLY with negative letter-spacing (-0.005em to -0.012em). For covers, headlines, card titles, course names, quote bodies, info values.
- **Display (Chinese):** Noto Serif SC, weight 700.
- **Body (Latin):** Fraunces, weight 400-600, variable opsz. ITALIC BY DEFAULT. For every paragraph, metadata, pill, page number, edition label. Roman only for info-keys and card descriptions.
- **Body (Chinese):** Noto Serif SC, weight 400.
- **Hero numeral (Latin):** Fraunces 400 italic, up to 480px. The system's signature hero anchor.
- **Hero numeral (Chinese):** Noto Serif SC 400, using Chinese ordinal/season characters.

**Key technique:** The default-italic Fraunces body is the system's most distinctive typographic move. Bricolage uppercase with negative tracking is the display voice. The two never swap roles.

## Decoration Vocabulary

### 1.5px Structural Borders
Cards, pills, edition badges, rect-tags, topbar dividers. All single-weight ink outlines. No fills.

### Internal Dividers
- 1px solid at 32% opacity: above card content (between card-top metadata and title).
- 1px dashed at 32% opacity: below card content (between body and bottom meta-row).

### Paper Texture Overlay
4px-tile radial-dot pattern at 10% opacity: `radial-gradient(circle at 1px 1px, rgba(181,61,42,0.5) 0.5px, transparent 1px)` on 4px background. Applied to every slide. Essential to the printed-paper feel.

### Pill Button
999px border-radius outlined rounded-rectangle, 1.5px ink border, italic Fraunces text. The system's CTA/action element.

### Edition Badge
Approximately 38px circular outline holding a single italic Fraunces digit. Always paired with an italic "EDITION N." Fraunces label.

### Rect Tag
Sharp-cornered outlined rectangular tag, italic Fraunces text. Used for metadata, not actions.

### Outlined Card
1.5px ink border, no fill, card-top metadata row (separated by 1px solid 32% divider), Bricolage card title, Fraunces body, bottom meta-row (separated by 1px dashed 32% divider).

### Ledger Row
Multi-column grid with 1px 32% solid border-bottom. Calendar/schedule/index pattern.

### Course Row
64px / 1fr / auto grid with 1px 32% solid border-bottom. Menu/programme pattern.

### Topbar with Divider
Bricolage headline on left, italic Fraunces label on right, 1.5px solid ink horizontal rule beneath.

### Page Number
Italic Fraunces at bottom-right of every slide. The system's spine.

## Animation

- Slide transition: 280ms opacity fade — simple and fast.
- No entrance animations or staggered reveals.
- The system relies on printed-object stillness.

## Anti-Patterns

- Don't introduce a second ink color. The system is single-ink — adding any second hue shatters the printed-program register.
- Don't fill any shape. Cards, pills, badges, rect-tags are outline-only.
- Don't use box-shadow, gradient, blur, or filter. The system is flat printed paper.
- Don't omit the paper-texture overlay. A flat cream background reads as digital, not paper.
- Don't run Bricolage in sentence case. Bricolage is always uppercase with negative tracking.
- Don't render Fraunces in roman by default. Italic is the body voice.
- Don't use thicker borders (2px+). The 1.5px structural border is the commitment.
- Don't use a medium border-radius (4px, 8px, 12px). The system uses 999px, 50%, or 0.
- Don't pair the edition badge without the label. The badge-and-label unit is one element.

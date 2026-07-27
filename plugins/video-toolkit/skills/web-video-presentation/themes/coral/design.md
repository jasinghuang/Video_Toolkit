# Coral — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/coral/
**Tone:** Bold, warm, graphic, magazine
**Formality:** Medium

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Coral | `#E85D5D` | `--surface-alt` | Signature fire — full-region surface + accent |
| Coral dark | `#D44A4A` | — | Gradient stop, chart comparison series |
| Cream | `#F5F0E8` | `--surface` | Warm paper — default slide background |
| Cream dark | `#E8E0D4` | — | Subtle region differentiation |
| Black | `#1A1A1A` | `--text` | Near-black ink — headlines, borders, decorative elements |
| Gray | `#6B6B6B` | `--text-2` | Body paragraph text |
| White | `#FFFFFF` | `--surface-2` | Card fills, sidebar fills |
| Light gray | `#B0B0B0` | — | Tertiary text |

**Rule:** Three-surface system (coral / cream / black) meeting at hard edges. No second accent color. No gradients across region boundaries.

## Typography

- **Display (Latin):** Bebas Neue, weight 400 (only weight). Uppercase ONLY with at least 1px letter-spacing. For every headline, stat, column title, meta figure, decorative numeral.
- **Display (Chinese):** ZCOOL XiaoWei, weight 400.
- **Body (Latin):** Inter, weights 300-700. 300 for pull-quote bodies, 400 for paragraphs, 600 for meta labels, 700 for section eyebrows (uppercase, 3-4px tracking, coral).
- **Body (Chinese):** Yozai, weight 400.
- **Section eyebrow:** Inter 700, uppercase, 4px tracking, coral color.

**Key technique:** Bebas uppercase + tracking is the display identity. Inter mixed-weight handles every non-display moment. Pull-quote bodies use Inter 300 as a "voice break" from Bebas.

## Decoration Vocabulary

### 45 Degree Diagonal Hatch
A 6%-opacity black diagonal repeating pattern on coral regions. The signature atmospheric texture. Variants: -45 degrees at 30/60px stride, 90 degree vertical at 60/62px stride.

### Hard Color Regions
Slides split into solid coral / cream / black regions meeting at hard edges. No gradient transitions. Common splits: 32%/68% top/bottom, 40%/60% left/right, 1fr/1fr equal.

### Decorative Typography
- **Background numeral:** Oversized Bebas digit at 12% opacity inside coral regions.
- **Giant mark:** Oversized Bebas character (e.g., quote mark) at 35% opacity inside coral regions.

### Accent Borders
- 5px coral top: cards (column-card).
- 4px coral left: sidebar items.
- 4px black horizontal: timeline line.
- 3px black at 15% opacity: title rule under hero titles.
- 2px translucent: nav dots and arrows.

### Card Pattern
White fill, 5px coral top border, no other borders, no radius, no shadow. Contains a 48px solid coral icon square (1-character Bebas glyph in white), a Bebas title, Inter body, and a coral Bebas stat figure at bottom.

### Info Bar
Cream band spanning region width. Bebas bar-title on left, uppercase Inter bar-meta on right.

### Timeline
4px solid ink horizontal line with ::after repeating-linear-gradient overlay creating a dashed effect. 20px coral circular points with 4px cream halos distributed along the line.

## Animation

- Slide transition: 0.6s opacity + visibility.
- Nav dot hover: 0.3s background transition.
- Nav arrow hover: 0.3s background/border transition to coral.
- No entrance animations or staggered reveals — the system relies on flat poster confidence.

## Anti-Patterns

- Don't render Bebas Neue in sentence case. Uppercase only — that's the entire identity.
- Don't render Bebas without letter-spacing. Untracked Bebas reads as untreated.
- Don't introduce a fourth surface color. Coral / ink / cream are the system.
- Don't render headlines in gray. Headlines are ink, cream, or coral.
- Don't add drop shadows, elevated cards, or rounded surfaces. The system is flat.
- Don't round any rectangular element. Sharp rectangles everywhere.
- Don't pair Bebas with a different sans body face. Bebas + Inter is fixed.
- Don't render Inter labels in sentence case. Small Inter is always uppercase with tracking.
- Don't soften region boundaries with gradients. Region edges are hard color meetings.

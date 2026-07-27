# Mat — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/mat/
**Tone:** Warm-modern, considered, tactile, mid-century
**Formality:** Medium

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Dark forest green | `#232E26` | `--surface` | Default step background — dominant environment |
| Alt green | `#2E3D30` | `--surface-2` | Slightly lighter green for recessed surfaces |
| Warm cream | `#EDE6D0` | `--surface-alt` | Light slide background, info-card fill |
| Cream ink | `#F0E8D2` | `--text` | Primary text on dark — warm cream |
| Secondary cream | `rgba(240,232,210,0.58)` | `--text-2` | Muted lead copy on dark |
| Dark ink | `#1E2820` | `--text-on-alt` | Primary text on cream — dark forest green |
| **Accent** | `#C07030` | `--accent` | Burnt-orange — the single accent |
| Border | `rgba(240,232,210,0.12)` | `--rule` | 1px hairline on dark |
| Border light | `rgba(30,40,32,0.14)` | `--rule-on-alt` | 1px hairline on cream |
| Wood glow | `#7A4E24` | `--wood` | Atmospheric radial glow color |

**Rule:** One accent only (burnt-orange). Orange never appears as a background fill or headline color — it is inline-only (kicker, bullet, `<em>` emphasis). Cream type floats on dark field with no cards, panels, or frames.

## Typography

- **Display (Latin):** Bricolage Grotesque, weights 600-800. ALWAYS MIXED CASE (never uppercase!). For display, h1, h2, h3, stat numerals, quote text. Negative letter-spacing (-0.01em to -0.03em).
- **Display (Chinese):** Noto Serif SC, weight 700.
- **Body (Latin):** DM Sans, weight 400. For every paragraph, lead, caption, bullet item. Neutral and readable — lets the display type lead.
- **Body (Chinese):** Noto Sans SC, weight 400.
- **Chrome (Latin):** DM Mono, weight 400. Uppercase with 0.12em tracking. For labels, kickers, chrome tags, footers, bullet em-dashes.
- **Chrome (Chinese):** Noto Sans SC, weight 500 with 0.05em tracking.
- **Display emphasis:** The `<em>` tag is repurposed as orange inline emphasis (font-style: normal, color: var(--c-accent)).

**Key technique:** The case contrast between Bricolage (mixed case display) and DM Mono (uppercase labels) is the system's typographic rhythm. Italics do not exist. The `<em>` tag is used as an orange color switch, not italic.

## Decoration Vocabulary

### Atmospheric Wood-Brown Glow
A radial gradient in the bottom-right corner of every dark slide via `::before`:
```
radial-gradient(ellipse at 70% 80%, rgba(122,78,36,0.28) 0%, rgba(80,50,20,0.14) 40%, transparent 70%)
```
Covers 55% width by 70% height anchored to bottom-right. Non-optional on dark surfaces.

### 1px Hairline Rules
The only structural dividers. Chrome bands, foot bands, stat cell dividers, compare panel splits, chart baselines. Never thicker, never colored.

### Kicker
DM Mono uppercase in warm orange with 0.12em tracking, placed above a headline as an eyebrow label. The most consistent appearance of orange.

### Bullet Em-Dash
Em-dash prefix in DM Mono colored warm orange, prepended via CSS grid (1.4em / 1fr). The only list marker in the system.

### Info-Card
A cream inset rectangle on the dark field — the signature component. No border, no shadow, no rounded corners. The tonal jump between cream and forest green defines the edge. Carries an h3 heading and body block.

### Stat Cell
Large Bricolage numerical value above a one-line DM Sans label in muted cream. Cells separated by 1px right border (last cell has none). The `<em>` inside the numeral renders in warm orange for unit suffixes (e.g., in "4.7k").

### Quote Mark
Oversized Bricolage opening quotation glyph at 8vw in warm orange. Sits above the quote text.

### Compare Panels
Side-by-side panels separated by a 1px vertical column (not a CSS border). The "after" label gets warm orange accent.

### Image Placeholder
Void rectangle with 1px hairline border, 6% cream background, centered DM Mono label. Color intentionally close to the background.

### Chrome Bands
Slide-chrome (top) and foot (bottom): flex space-between rows of DM Mono labels separated by 1px hairline rules. Suppressed on cover, quote, and end slides.

## Animation

- Slide transition: 0s (instant). The deck is static by design.
- No entrance animations or staggered reveals.
- The system reads as an inert printed catalog.

## Anti-Patterns

- Don't uppercase any Bricolage display, h1, h2, or h3 text. Display is always mixed case.
- Don't introduce a second accent color. Orange is the only accent and cannot share.
- Don't add drop shadows, blur shadows, or elevation effects. Depth is the atmospheric glow only.
- Don't round any corner on a structural element. All strict rectangles.
- Don't fill a slide with three columns of bullets or stack five vertical regions. Medium-sparse density.
- Don't use orange as a background fill. Orange is inline-only.
- Don't use a serif face anywhere. No serif in this system.
- Don't add a border around the info-card. The tonal jump defines the edge.
- Don't use italic letterforms. The `<em>` tag is repurposed as orange color switch (font-style: normal).
- Don't increase border weights above 1px. Hairlines only.

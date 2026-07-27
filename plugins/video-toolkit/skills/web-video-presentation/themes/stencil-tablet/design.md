# Stencil & Tablet — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/stencil-tablet/
**Tone:** Poster-loud, archival, earthy, tactile, considered, graphic, bold
**Formality:** Medium-high

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Primary surface | `#E2DCC9` | `--surface` | Default step background (bone) |
| Alternate surface | `#000000` | `--surface-alt` | Use `.surface-alt` on step root for black variant |
| Primary text | `#0A0A0A` | `--text` | Headlines on bone (ink) |
| Secondary text | `#3A3A3A` | `--text-2` | Body on bone |
| Muted text | `#6A6A6A` | `--text-mute` | Captions on bone |
| Text on black | `#E2DCC9` | `--text-on-alt` | Headlines on `.surface-alt` (bone on black) |
| Text 2 on black | `#B5AF9A` | `--text-2-on-alt` | Body on black |
| Accent (primary) | `#EE7A2E` | `--accent` | Orange — section dividers, marks, stat values |
| Accent sienna | `#A06A3C` | `--accent-sienna` | Warm brown — process steps, principle cards |
| Accent magenta | `#C73B7A` | `--accent-magenta` | Loud pink — covers, quotes, matrix "no" pills |
| Accent teal | `#2D7E73` | `--accent-teal` | Deep green — process cards, matrix "yes" pills |
| Accent blue | `#3F73B7` | `--accent-blue` | Mid blue — fifth-step process cards |
| Accent mustard | `#D8A93B` | `--accent-mustard` | Yellow — action bars, stat cards, matrix "partial" |
| Accent olive | `#6F7A2E` | `--accent-olive` | Muted green — least-used, for variety |
| Paper | `#F4EFE0` | `--paper` | Lighter cream — matrix tables, chart frames, timeline bars |

**Rule:** Never use pure white. Text on dark fills is always bone (`#E2DCC9`), never white. The bone-on-black inversion is the system's only color inversion and white would clash.

### Matrix Pill Color Conventions

Inside comparison matrices, status pills follow a fixed semantic convention:

- **Teal** (`--accent-teal`) fill with bone text = yes / affirmative
- **Mustard** (`--accent-mustard`) fill with ink text = partial / qualified
- **Magenta** (`--accent-magenta`) fill with bone text = no / negative
- **Paper** (`--paper`) fill with ink text and 1.5px ink border = note / annotation

Outside the matrix, accents are interchangeable — color is decorative there, not semantic.

## Typography

Stencil & Tablet runs **four families** with strict role separation:

- **Display (Latin):** Stardos Stencil, weight 700, uppercase, negative letter-spacing, ink color. Use `.display` for English headlines. The stencil ink-break glyphs are the system's identity. Line-height runs tight at 0.82 at display scale. **Every headline is uppercase.**
- **Display (Chinese):** Noto Serif SC, weight 900. Use `.display-cn` for Chinese headlines. CJK strokes hold visual parity with Stardos Stencil at large scale only at weight 900.
- **Condensed / Chrome:** Barlow Condensed, weights 600-900, uppercase, generous tracking (0.04-0.14em). Used for `.label` (800), `.meta` (600), `.stat-label` (700), `.tag` (700), all chrome, pills, legends, and footers.
- **Body:** Inter, weight 400, sentence case. Use `.body` for paragraph text and `.body-sm` for captions. Inter is the system's "quiet voice."
- **Quote mark (one purpose only):** Bowlby One, weight 700, used exclusively for the opening quote glyph inside quote panels (via `.quote::before`).

**Key technique:** Scale is the primary expressive tool. Cover hero runs at 220px. Numerals inside tablets at 220px. Section dividers at 540px — over half the canvas in a single character height. Statement headlines at 120px. Stat numerals at 160px. The system's identity depends on running type at sizes that would be impossible on most decks.

**Cross-rail rule:** Stardos Stencil is for headlines and numerals only — never body. Barlow Condensed is for chrome/metadata/pills only — never headlines. Inter is for body only — never headlines or chrome. Bowlby One is for the quote mark only — never elsewhere.

### Stat-Value Pattern

Use `.stat-value` for large numbers (Stardos Stencil 700 uppercase), `.stat-label` for the description (Barlow Condensed 700 uppercase). Append a `.stat-suffix` element for units (% , x, K, M) in Barlow Condensed 800 at 40px, vertical-align top.

## Dual-Surface Rhythm

Stencil & Tablet alternates between bone (`--surface`, default) and black (`--surface-alt`). Apply `.surface-alt` to a step's root `<div>` to switch:

```tsx
// Bone step (default — no class needed)
<div className="scene-pad stack">
  <h1 className="display">The Pattern</h1>
</div>

// Black step
<div className="scene-pad stack surface-alt">
  <h1 className="display">The Contrast</h1>
</div>
```

The alternate surface automatically adjusts text colors, dividers, card backgrounds, chrome, and tag styles. Do not override these — `.surface-alt` handles the full color inversion.

**Rule:** Black is for declaration moments — covers, section dividers, agenda layouts, and dramatic data reveals. Don't alternate every step. Bone is the default workspace.

## Spacing Rhythm

Base unit: 8px. All gaps use CSS vars:
- `--space-md` (16px): default stack/row gap
- `--space-lg` (24px): grid gap, card padding
- `--space-xl` (48px): section breaks
- `--stage-pad-x: 64px; --stage-pad-y: 48px`: stage padding

**Rule:** Respect the padding. Content should never touch the stage edge. The bone field visible between and around cards is structural — don't shrink it to fit more content.

## Decorative Vocabulary

### Rounded Tablet Cards (22-26px)

The system's namesake container. Use `.card` for standard 22px radius cards and `.card-lg` for larger 26px radius tablets (e.g., quote panel, principle card, CTA pane). Cards are flat — no drop shadows, no gradients, no top accent borders. Color blocks AS the layout. Set the background color inline using any accent or paper color.

### Numerals Inside Cards

Use a `<span className="num">` inside a `.card` or `.card-lg` for Stardos Stencil numerals at 220px scale. The numeral is the tablet's defining feature — a tablet without a numeral is just a card.

### Section-Divider Numeral (540px)

The 540px mega-numeral pattern sits on a black field only. Use --accent (orange) for the numeral color. The numeral IS the layout — it fills the left half of the slide while the section headline runs bottom-right.

### Action Bar

Use `.action-bar` for a mustard-yellow callout bar spanning the top of a slide. Contains a `.tag` (Barlow Condensed 800, ink right-border separator) on the left and a stencil headline on the right.

### Process Nodes

Use `.process-node` for step-by-step diagrams. Contains a 64px stencil ordinal (`.num`), a 28px stencil h3, and Inter body. Each node takes a different accent fill.

### Timeline Bar

Use `.timeline-bar` for a paper-fill horizontal bar with Barlow Condensed markers spread evenly. 14px radius, 50px height.

### Quote Panel

For pull quotes, use `.quote` (inline) or build a full panel: a 26px-rounded accent-filled (typically magenta) container with a Bowlby One 320px quote-mark on the left (`.quote::before`) and 60px Stardos Stencil 400 quote text on the right.

### Legend Swatch

Use `.legend-bar` for a flat 32x6px rectangle (no border-radius) as a chart legend marker beside a Barlow Condensed 700 label.

### Chrome Bars

Use `.chrome-top` and `.chrome-bottom` for 1px hairline-ruled chrome bars at the top or bottom of step content. These are structural separators, not the absolute-positioned top/footer chrome of the stage frame (which is handled by the runtime).

### Organic Blob Shapes

For agenda or decorative layouts, use `.blob-bg` to place an SVG shape behind content. The shape is position absolute and fills its parent; the content is z-indexed above it.

## Animation

Stencil & Tablet moves with moderate confidence — not as slow as cinematic themes, not as sharp as agency themes. Durations:
- Base reveal: 500ms
- Slow / dramatic: 800ms
- Easing: `--ease-quart` (smooth deceleration) for most reveals.

Use `--dur-base` and `--dur-slow` CSS vars. Avoid spring/overshoot — that breaks the tactile, analog feel. Avoid slow fades over 1s — that doesn't match the confident poster-loud register.

## Anti-Patterns

- Don't lowercase a stencil headline. Stardos Stencil at any scale is uppercase only.
- Don't render chrome or metadata in sentence case. Barlow Condensed in this system is always uppercase with at least 0.04em tracking.
- Don't add drop shadows or gradients. The system is flat blocks of saturated color.
- Don't square the corners on cards, action bars, or pills. Minimum acceptable card radius is 22px; pills are 999px.
- Don't invert text to pure white on dark fills. Use bone (`#E2DCC9`).
- Don't use Inter for headlines or chrome. Inter is the body voice; it never leads.
- Don't use Stardos Stencil for body paragraphs. The stencil face at body scale becomes illegible.
- Don't introduce an eighth accent color. The seven-accent palette plus bone/black/paper is closed.
- Don't use the section-divider 540px numeral on a light field. The mega-numeral pattern lives on dark fields only.
- Don't crowd cards with less than 22px gaps. The bone field visible between cards is structural.
- Don't use Bowlby One anywhere except the quote-mark pseudo-element.
- Don't use font-weight 400 or 500 on Barlow Condensed in chrome roles — chrome runs at 600-900 only.

# Sakura Chroma — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/sakura-chroma/
**Tone:** Retro, playful, warm, tactile, vibrant
**Formality:** Low

## Overview

Sakura Chroma is a cassette-package editorial system that treats every WVP step as a printed product page from a small Japanese audio-products catalogue. The visual metaphor is total: petal-cluster blob marks, diagonal multi-color ribbon bands, 12-point starburst seals, red rectangular stamps, mono-font spec rows, color-coded chips, and equalizer-style bar charts. Everything reads as if pulled from the back-page spread of a 1970s consumer-audio brochure -- warm, hand-curated, industrially typeset.

The typeface stack pairs four faces with distinct functional roles. Big Shoulders Display is the display voice (condensed industrial sans at weight 900 with tight negative letter-spacing -0.025em). Albert Sans is the body voice (clean modern humanist sans at weight 400-700). JetBrains Mono is the tabular voice (spec rows, page numbers, dates, chips). Noto Sans JP is the cultural accent (Japanese characters in cover footers).

Together they compose as "industrial display + clean body + monospaced data + Japanese spice."

## Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Shell (stage letterbox) | `#0E0E0E` | `--shell` | Dark stage background framing the cream surface |
| Primary surface (paper) | `#F1E6CB` | `--surface` | Default step background -- warm cream canvas |
| Surface-2 (paper dark) | `#E5D6B0` | `--surface-2` | Slightly darker cream for cards, layered surfaces |
| Surface-3 | `#D4C49A` | `--surface-3` | Deepest cream for nested regions |
| Alternate surface (ink) | `#3A2516` | `--surface-alt` | Warm brown -- inverted step background via `.surface-alt` |
| Primary text (ink) | `#3A2516` | `--text` | All body text, headlines, borders, dividers |
| Secondary text | `#5C4A3A` | `--text-2` | Body paragraphs |
| Muted text | `#8A7A6A` | `--text-mute` | Captions |
| Text on alt | `#F1E6CB` | `--text-on-alt` | Headlines and text on `.surface-alt` |
| Accent (red) | `#E5392A` | `--accent` | Primary emphasis -- em tags, stamps, hero stats |
| Accent pink | `#E54489` | `--accent-pink` | Lockup bars, ribbon bands, card topstrips |
| Accent orange | `#F09131` | `--accent-orange` | Petal clusters, ribbons, card topstrips |
| Accent yellow | `#F0BC2A` | `--accent-yellow` | Petal clusters, ribbon bands, chips |
| Accent green | `#3D9F47` | `--accent-green` | Petal clusters, ribbons, chips, eq bars |
| Accent blue | `#3F8BC4` | `--accent-blue` | Petal clusters, ribbons, card topstrips, eq bars |
| Rule (ink) | `#3A2516` | `--rule` | All borders, dividers, hard-shadow color |
| Rule on alt | `rgba(241,230,203,0.20)` | `--rule-on-alt` | Subtle rule on `.surface-alt` |

**Key rules:**
- The surface is warm cream paper (`#F1E6CB`), never pure white or off-white tinted toward cool.
- The ink is warm brown (`#3A2516`), never pure black -- this gives every type and border a print-on-paper warmth.
- The six primary accent colors have no fixed semantic meaning (red is not "danger," green is not "success"). They serve as a categorical accent set. Red carries an "attention" register and is reserved for inline emphasis and hero stats.
- No seventh primary color. The palette is locked at red, pink, orange, yellow, green, blue.

## Typography

### Font Family

- **Display (Latin):** Big Shoulders Display, weight 900, negative tracking -0.025em to -0.012em. Use `.display` for English headlines. The condensed industrial 900 voice is the entire system identity.
- **Display (Chinese):** ZCOOL XiaoWei, weight 400. Use `.display-cn` for Chinese headlines. Single-weight face -- no 900 equivalent. Drop negative tracking to 0 for CJK.
- **Body:** Albert Sans, weight 400 (body), 600 (stat-label), 700 (micro-labels, labels). Use `.body` for paragraph text.
- **Mono:** JetBrains Mono, weight 400-500. Use `.label` for kickers, `.meta` for footnotes, `.tag` for badges, `.spec-row` for tabular data.
- **Japanese accent:** Noto Sans JP, weight 500-700. Use sparingly for Japanese characters.

### Type Scale

| Token | Size | Weight | Family | Usage |
|-------|------|--------|--------|-------|
| `--t-display` | `clamp(80px, 14vw, 280px)` | 900 | Big Shoulders Display | Hero numeral, cover display |
| `--t-h1` | `clamp(70px, 8.4vw, 168px)` | 900 | Big Shoulders Display | Statement headline, manifesto |
| `--t-h2` | `clamp(52px, 5.6vw, 100px)` | 900 | Big Shoulders Display | Section title, topbar title |
| `--t-h3` | `clamp(28px, 2.6vw, 48px)` | 900 | Big Shoulders Display | Product card name |
| `--t-body` | `16px` | 400 | Albert Sans | Paragraph body |
| `--t-caption` | `13px` | 400-700 | Albert Sans | Captions, micro-labels |
| `--t-micro` | `11px` | 400-500 | JetBrains Mono / Albert Sans | Spec rows, page numbers, meta |

### Key Typographic Techniques

- **Every Big Shoulders Display element carries negative letter-spacing** (-0.025em to -0.012em). Default tracking reads as untreated.
- **Every micro-label is uppercase with significant tracking** (0.16em standard, 0.2em for eyebrows, 0.22em for the loosest kicker).
- **Every page number uses JetBrains Mono** in `NN / TT` format at bottom-right. Required on every step.
- **Inline `<em>` inside display headlines switches color** to `--accent` (red). Never italic -- the color shift is the entire emphasis device. For quote spreads where red is overloaded, use `--accent-blue` instead.
- **Italic does not exist. Underline does not exist.** Emphasis = color shift (red/blue), weight switch, or face switch.
- **Every spec row uses JetBrains Mono.** A spec row in Albert Sans reads as a body sentence, not as catalogue data.

## Surface Rhythm

Sakura Chroma defaults to the warm cream paper surface (`--surface`). Apply `.surface-alt` to a step's root `<div>` to switch to warm brown:

```tsx
// Cream step (default)
<div className="scene-pad stack">
  <h1 className="display">T-26 SUPERCATALOG</h1>
</div>

// Warm brown step
<div className="scene-pad stack surface-alt">
  <h1 className="display">COLOUR PALETTE</h1>
</div>
```

The alternate surface automatically adjusts text colors, dividers, and card backgrounds. Use it sparingly -- for chapter openers, data reveals, or colophon moments. Cream is the default workspace.

## Spacing

Base unit: 8px. All gaps use CSS vars:
- `--space-md` (16px): default stack/row gap
- `--space-lg` (24px): grid gap, card padding
- `--space-xl` (48px): section breaks
- `--stage-pad-x: 80px; --stage-pad-y: 64px`: stage padding

**Rule:** Content should never touch the stage edge. Frame inset is generous but not as loose as editorial themes -- the catalogue-grid density needs the stage boundary.

## Decorative Vocabulary

### Halftone-Dot Paper Texture

A 4px-period halftone-dot pattern overlays every step at 16% opacity (via `--surface-pattern`). It is the paper-grain that anchors every flat color block in the print register. Required on every step. Do not remove.

### Petal Clusters

A decorative cluster of 4-5 overlapping perfect circles (`border-radius: 50%`, `aspect-ratio: 1/1`) in primary palette colors. Circles overlap and tile within a bounded container. Used as brand mark anchors in step corners, cover spreads, and quote-page ornament.

### Diagonal Ribbon Bands

A bundle of 5 stacked solid-color horizontal bars (pink, orange, yellow, green, blue) rotated -22 degrees or +22 degrees to sweep diagonally across a region. Echoes the cassette-label color-stripe motif. Anchored to one edge, oversized (160% width) to bleed off the opposite edge. Reserved for cover, closing, and atmospheric stripe moments -- not a routine element.

### Starburst Seal

A 12-point starburst clip-path shape filled warm brown (`--surface-alt`) with cream (`--text-on-alt`) text. Carries a 1-4 character glyph (year number, volume, abbreviation). Used as authority mark on covers and colophons.

### Red Rectangular Stamp

A red (`--accent`) rectangle with cream (`--surface`) text, optionally rotated -3 degrees. Used for status badges (COMPLETE, AS SEEN ON, LIMITED) and product callouts. Always Big Shoulders 900 uppercase.

### Product Card

Vertical card with a 1.5px ink border, a colored topstrip (red/pink/orange/blue variant via `.c-*` class), and a stacked body: card name in Big Shoulders 900, description in Albert Sans 400, dashed ink rule, JetBrains Mono spec rows. The catalogue grid's primary unit.

### Hard Offset Shadow

`box-shadow: 8px 8px 0 var(--rule)` (zero blur, solid ink). Applied via `.shadow-hard` to quote callout boxes and other elevated elements. No soft shadows, no blurred drops in the system.

### Equalizer Bar Chart

8-column grid where each column stacks 6 equal-height tiles (segments). `column-reverse` flex direction means the first segment in source order sits at the bottom; "on" segments stack from the bottom up like a VU meter. On-segment color is set per column (red, pink, orange, yellow, green, or blue); off-segments are translucent ink tint.

### Spec Checklist

Vertical column of ink-bordered square checkboxes (filled or empty, filled state shows a cream multiplication-sign glyph) followed by tracked-caps labels (COLOR, LO-FI, STEREO, LP).

### Ledger / Tabular Row

5-column pattern: date (mono) | title (Big Shoulders 700) | edition (Albert Sans) | chip (mono color badge) | NR indicator (ink square boxes). Header rows use a 1.5px ink rule; body rows use 1px hairline ink-alpha dividers.

## Depth and Elevation

Depth comes from three techniques, applied in this priority order:

1. **Hard offset shadow** (`8px 8px 0 ink`, `.shadow-hard`) -- rare, reserved for quote callout boxes that need to lift off busy compositions
2. **Paper-grain halftone texture** (16% dots, always on) -- the foundational textural ground  
3. **Color-block layering** -- ribbon bands behind hero numerals, petals behind brand lockups, topstrip color tabs on paper cards

No blurred `box-shadow`, no `drop-shadow` filters, no rgba shadow tints. A soft modern shadow breaks the print catalogue aesthetic.

## Border Treatment

| Weight | Style | Usage |
|--------|-------|-------|
| 1.5px | solid ink | Standard border on cards, topbar rules, ledger headers, quote boxes |
| 2px | solid ink | Spec-checklist checkbox borders |
| 1px | solid ink | Equalizer tick-label separators |
| 1px | solid ink-alpha | Ledger body-row dividers, eq off-segment borders |
| 1px | dashed ink | Dashed rule separating card description from mono spec rows |

Borders are always warm-brown ink. No colored borders except as implicit chip backgrounds.

## Animation

Sakura Chroma is moderate and playful -- catalogue-paced, not cinematic. Durations:
- Quick: 300ms
- Base reveal: 500ms
- Slow: 800ms

Easing: `--ease-quart` `cubic-bezier(0.19, 1, 0.22, 1)` for smooth deceleration. Use `--dur-base`, `--dur-quick`, `--dur-slow` CSS vars. Avoid slow cinematic fades -- Sakura Chroma is a product catalogue, not a film.

## Anti-Patterns

- Don't round any corner. Cards, stamps, chips, topbars -- all strict rectangles. Petals (circles) and the starburst seal (polygon clip-path) are the only non-rectangular shapes.
- Don't use blurred `box-shadow`. The only shadow is the 8px hard ink offset on `.shadow-hard`. Soft modern shadows break the print register.
- Don't substitute another display face for Big Shoulders Display. The condensed industrial 900 voice is the entire system identity.
- Don't substitute another mono face for JetBrains Mono. The tabular voice is part of the catalogue conceit.
- Don't use Big Shoulders Display for body paragraphs. It reads as overwrought at small body sizes.
- Don't use Albert Sans for display moments. Albert Sans is the neutral body face; display moments need Big Shoulders.
- Don't italicize for emphasis. Use inline `<em>` with red (or blue on quote spreads) color shift, or switch weight (Albert 400 to 700).
- Don't introduce a seventh primary color. The palette is locked at red/pink/orange/yellow/green/blue.
- Don't fill a card border with a saturated accent color. Borders are always ink.
- Don't omit the halftone-dot paper texture from any step. It is the foundational print register.
- Don't omit the page number from a content step. It is a non-optional editorial signal.
- Don't use dashes or dots for bullet markers. Use `.bullet-list` with em-dash markers.
- Don't use checkmarks in spec checkboxes. Use multiplication sign (`×`) as the filled-state glyph.

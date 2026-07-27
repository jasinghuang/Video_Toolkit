# Emerald Editorial — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/emerald-editorial/
**Tone:** Editorial, confident, authoritative, magazine-cover
**Formality:** Medium-high

## Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Primary surface | `#3CD896` | `--surface` | Default step background (emerald) |
| Alternate surface | `#0F1A5C` | `--surface-alt` | Use `.surface-alt` on step root for navy variant |
| Paper surface | `#F1E9D6` | `--surface-paper` | Use `.surface-paper` for oat-cream alt surface |
| Primary text | `#0F1A5C` | `--text` | Headlines on emerald and paper |
| Secondary text | `#1B2774` | `--text-2` | Body on emerald |
| Accent (emerald) | `#3CD896` | `--accent` | Text on navy, accent emphasis |
| Text on navy | `#3CD896` | `--text-on-alt` | Headlines on `.surface-alt` |

**Rule:** Never introduce a fourth chromatic family. The system is emerald / navy / paper — no additional accent colors.

## Typography

- **Display (Latin):** Bodoni Moda, weight 900, negative letter-spacing (-0.01 to -0.03em), tight leading (0.92-0.96). Use `.display` for English headlines.
- **Display (Chinese):** Noto Serif SC, weight 900, letter-spacing 0. Use `.display-cn` for Chinese headlines.
- **Body:** Manrope, weight 500. Use `.body` for paragraph text.
- **Chrome (labels/tags/captions):** Manrope, weight 700-800, uppercase with 0.08-0.18em letter-spacing. Never sentence-case.
- **Mono:** JetBrains Mono. Use `.meta` for footnotes, `.tag` for badges.

**Key technique:** Every Bodoni headline runs at weight 900 with negative tracking. The 900-weight commitment is the system's theatrical-playbill voice. Manrope chrome is always uppercase — never sentence-case.

## Surface System

Emerald Editorial supports three surfaces:

- **Emerald (`--surface`, default):** The primary slide canvas. Navy text on emerald is the default reading state.
- **Navy (`--surface-alt`):** Apply `.surface-alt` to a step's root for a dramatic inverted panel. Emerald text on navy. Use for section openers, chapter breaks, and statement slides.
- **Paper (`--surface-paper`):** Apply `.surface-paper` for an oat-cream tile surface. Navy text. Use as an alt-tile variant within a row to break monotony.

```tsx
// Emerald step (default)
<div className="scene-pad stack">
  <h1 className="display">The Pattern</h1>
</div>

// Navy dramatic step
<div className="scene-pad stack surface-alt">
  <h1 className="display">The Contrast</h1>
</div>
```

**Rule:** Don't alternate every step. Emerald is home; navy is for emphasis. Paper breaks rows of tiles.

## Spacing Rhythm

Base unit: 8px. Key gaps:
- `--space-md` (16px): default stack/row gap
- `--space-lg` (24px): grid gap, card padding
- `--space-xl` (48px): section breaks
- `--stage-pad-x: 110px; --stage-pad-y: 80px`: stage padding

All shapes are strict rectangles (border-radius: 0 everywhere).

## Decorative Vocabulary

### Double-Rule Ornament

The system's signature decorative device. A centered serif word framed by two stacked 4px horizontal rules on each side (3px between them). Use the `.ornament` class for this pattern:

```tsx
<div className="ornament">
  <span className="lines"></span>
  <span className="word">of</span>
  <span className="lines"></span>
</div>
```

### 4px Navy Rules

Every structural divider — section separators, list-row borders, tile top rules — uses a 4px solid navy rule (`.divider`, `.divider-thick`). This 4px weight is the system's structural rhythm. Never use 1px or 2px for structural division.

### Color-Block Inversion

Depth comes from color-block inversion: a navy tile on the emerald canvas is the "elevated" element. No shadows, no gradients, no glow.

### Masthead / Footline

Use `.chrome-top` for a magazine-style header bar with uppercase Manrope labels and a 4px navy rule. The chrome bar is optional but recommended for content slides.

## Animation

Emerald Editorial is confident and deliberate:
- Base reveal: 700ms
- Slow / dramatic: 1000ms
- Cinematic entrance: 1200ms

Use `--dur-base`, `--dur-slow`, `--dur-cinematic` CSS vars. Easing is `--ease-quart` (smooth deceleration) for most reveals. No spring/overshoot — that breaks editorial gravity.

## Anti-Patterns

- Don't introduce a fourth chromatic family. The emerald / navy / paper triad is the entire palette.
- Don't use border-radius on any element. Strict rectangles are non-negotiable.
- Don't use drop shadows, gradients, or glow effects. Depth comes from color-block inversion.
- Don't run Bodoni at weight below 900 for display moments.
- Don't render Manrope chrome in sentence case or without letter-spacing.
- Don't use 1px or 2px structural rules. The 4px weight is the default.
- Don't crowd a slide with more than one display headline plus 3-4 supporting elements.

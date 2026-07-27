# BlockFrame — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/block-frame/
**Tone:** Bold, playful, graphic, pop, confident
**Formality:** Medium-low

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Primary surface | `#FFFDF5` | `--surface` | Default step background (warm off-white) |
| Card fill | `#FFFFFF` | `--surface-2` | White card backgrounds |
| Accent (pink) | `#FE90E8` | `--accent` | Hot pink — primary accent |
| Pastel blue | `#C0F7FE` | `--pastel-blue` | Surface ground, label fills |
| Pastel green | `#99E885` | `--pastel-green` | Surface ground, label fills |
| Pastel yellow | `#F7CB46` | `--pastel-yellow` | CTA color, label fills |
| Pastel cream | `#FFDC8B` | `--pastel-cream` | Surface ground, label fills |
| Ink | `#000000` | `--text, --rule` | All text, borders, and shadows |
| Close surface | `#000000` | `.surface-close` | Inverted black closing slide |

**Rule:** All borders are pure black. All text is pure black on light surfaces. The pastels are interchangeable — none carry fixed semantic meaning. Cycle through them for surface variety.

## Typography

- **Display (Latin):** Space Grotesk, weight 900, uppercase, negative tracking. Use `.display` for English headlines. Geometric sans at maximum weight — the brutalist voice.
- **Display (Chinese):** Noto Sans SC, weight 900. Use `.display-cn` for Chinese headlines.
- **Body:** Inter, weight 500. Neutral, widely-available sans-serif for paragraph text and card body. Sentence case.
- **Label / Chrome:** Space Grotesk, weight 600 uppercase with 0.08em tracking. Used for `.label`, `.tag`, `.label-pill` components.
- **Stat value:** Inter weight 900, pure black, line-height 1.
- **Card titles:** Inter weight 700 uppercase.

**Key technique:** Pair heavy uppercase Space Grotesk display (weight 900, -0.03em) with weight-500 Inter body in sentence case. The uppercase/lowercase and display/body contrast is the system's typographic rhythm.

## Surface Rhythm

BlockFrame uses pastel surface cycling. Each step can use a different colored ground:

```tsx
// Off-white step (default)
<div className="scene-pad stack">
  <span className="label-pill label-pill-pink">Overview</span>
  <h1 className="display">WHAT WE DELIVER</h1>
</div>

// Blue ground
<div className="scene-pad stack surface-blue">
  <span className="label-pill label-pill-yellow">Core Features</span>
  <h2 className="h1">MODULAR LAYOUTS</h2>
</div>

// Black closing surface
<div className="scene-pad stack surface-close">
  <h1 className="display">LET'S BUILD</h1>
</div>
```

**Rule:** Cycle surfaces every 1-3 steps. Don't stay on one ground for more than 3 slides. Surface classes: `.surface-pink`, `.surface-blue`, `.surface-green`, `.surface-yellow`, `.surface-cream`, `.surface-close` (black).

## Spacing Rhythm

Base unit: 8px. All gaps use CSS vars:
- `--space-md` (16px): default stack/row gap
- `--space-lg` (24px): grid gap, card content padding
- `--space-xl` (48px): section breaks
- `--stage-pad-x: 80px; --stage-pad-y: 60px`: stage padding

BlockFrame's density is comfortably packed — cards sit close together and decorative elements fill empty space.

## Decorative Vocabulary

### Label-Pill
Use `<span className="label-pill label-pill-[color]">` for section eyebrows. Every label-pill has a 3px black border, 4px offset shadow, colored fill. Pastel variants: pink, blue, green, yellow, cream. White is default.

### Hard Offset Shadows
Every elevated card uses `--card-shadow` (8px 8px 0 black). Chrome elements (label-pills, tags, stat cards) use `--card-shadow-sm` (4px 4px 0 black). Shadows are always solid black, zero blur.

### Corner Brackets
Four `.corner-bracket` variants (`.corner-tl`, `.corner-tr`, `.corner-bl`, `.corner-br`) create frame-within-frame decoration on cards and quote frames. Place them at the inner corners.

### Dot Grid
Use `.dot-grid` class on any surface for a faint black dot pattern at 24px spacing. Good for decorative stage overlays and card surface details.

### Tilt
Add `.tilt-left` (-2deg) or `.tilt-right` (+2deg) to cards for playful misalignment. Use `.tilt-8-left` / `.tilt-8-right` for more aggressive tilt on decorative elements.

### Card Fill Variants
Use `.card-fill-pink`, `.card-fill-blue`, `.card-fill-green`, `.card-fill-yellow`, `.card-fill-cream` for solid-pastel filled cards (without white background). These are used in timeline steps, feature cards with colored grounds.

### Close Surface
Use `.surface-close` for the final step: pure black background with white text. Inverted from all other surfaces. The text and labels automatically flip to white.

## Animation

BlockFrame is snappy and playful:
- Base reveal: 400ms
- Slide transition: 500ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for reveals, with a spring-like `--ease-spring` for hover micro-interactions.

## Anti-Patterns

- Don't round any corner on cards, buttons, label-pills, or avatars. Only the tiny stat-deco dot (12px circle) uses border-radius.
- Don't blur shadows. Every shadow is hard-edged at zero blur. Soft shadows collapse the brutalist character.
- Don't use colored borders. Borders are always pure black, except on the inverted close-surface (white border).
- Don't use Space Grotesk display in sentence case. Uppercase is mandatory on display/h1/h2.
- Don't set display without negative letter-spacing. Untracked Space Grotesk at heavy weights reads as a different system.
- Don't introduce a sixth pastel. The palette is locked at pink, blue, green, yellow, cream.
- Don't omit the label-pill on a region. Every section needs an eyebrow tag.
- Don't render label-pills as plain text — the 3px border + 4px shadow + fill combination defines the pill.
- Don't blur or color body text. Body is solid black on light surfaces, white on dark.
- Don't keep every card perfectly aligned. Tilted stat cards and decorations give the system hand-made energy.

# Playful — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/playful/
**Tone:** Warm, approachable, indie, friendly
**Formality:** Low

## Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Primary surface | `#F0C8A0` | `--surface` | Default step background (peach clay) |
| Surface-2 | `#E8B88E` | `--surface-2` | Slightly deeper peach for cards |
| Surface-3 | `#E0B898` | `--surface-3` | Deepest peach for nested surfaces |
| Alternate surface | `#F7DEC6` | `--surface-alt` | Lighter peach tonal variant |
| Shell | `#C8A080` | `--shell` | Darker peach for letterbox depth |
| Primary text | `#1A1A1A` | `--text` | Headlines and body — charcoal ink |
| Secondary text | `#3A3A3A` | `--text-2` | Body text de-emphasis |
| Muted text | `#6A6A6A` | `--text-mute` | Captions and labels |
| Text on alt surface | `#1A1A1A` | `--text-on-alt` | Same ink on lighter peach |
| Accent | `#1A1A1A` | `--accent` | Charcoal — the only accent color |
| Rule | `rgba(26,26,26,0.20)` | `--rule` | Subtle charcoal for dividers |

**Rule:** No second brand color. The system is monochrome: peach canvas + charcoal ink. Every visual decision is a binary between these two. Never introduce a third hue.

## Typography

- **Display (Latin):** Syne, weight 800, uppercase, negative letter-spacing (-0.03em). Use `.display` for English headlines. Tight tracking is essential — Syne at default spacing reads as untreated.
- **Display (Chinese):** ZCOOL KuaiLe, weight 400. Use `.display-cn` for Chinese headlines. No negative letter-spacing on CJK.
- **Body:** Space Grotesk, weight 400. Use `.body` for paragraph text at 18px with 1.7 line-height.
- **Labels:** Space Grotesk, weight 600, uppercase, 0.15em letter-spacing. Use `.label` for eyebrow labels above headlines.
- **Mono:** Space Grotesk (no dedicated mono face — the clean geometric proportions handle code well enough).

**Key technique:** The typographic rhythm comes from the Syne-vs-Space Grotesk contrast, not from mixing weights within a face. Syne carries the personality (indie studio voice, quirky humanist proportions). Space Grotesk provides steady legible body copy. Every headline, statement, numeral, and vertical label is Syne. Every paragraph, caption, label, and tag is Space Grotesk.

**No italic, no underline.** Emphasis comes from switching face (body to display) or weight (400 to 700/800).

## Single-Surface System

Playful is a single-surface monochrome system. There is no dual-surface alternation as in Signal (navy/cream) or Studio (dark/yellow). Every step uses peach clay (`--surface`) as the default background, with the lighter peach (`--surface-alt`) available as a subtle tonal variant:

```tsx
// Default step (peach clay)
<div className="scene-pad stack">
  <h1 className="display">The Idea</h1>
</div>

// Lighter tonal variant
<div className="scene-pad stack surface-alt">
  <h1 className="display">The Detail</h1>
</div>
```

The alternate surface is a lighter shade of the same peach — not a different hue. Text colors remain charcoal throughout. Use `.surface-alt` sparingly, when a single step needs a tonal lift without introducing white or a new color.

## Spacing Rhythm

Base unit: 8px. All gaps use CSS vars:
- `--space-md` (16px): default stack/row gap
- `--space-lg` (24px): grid gap, card padding
- `--space-xl` (48px): section breaks
- `--stage-pad-x: 120px; --stage-pad-y: 80px`: stage padding (spacious)

**Rule:** Let negative space breathe. One dominant element per slide with generous padding. Crowding collapses the hand-touched feeling into clutter.

## Decorative Vocabulary

### Double-Stroke Offset Border

Playful's signature depth treatment. A card carries a 3px solid charcoal border, and a `::before` pseudo-element absolutely positioned over it carries a second 2px border offset 6px down-and-right. The offset border has no fill — the canvas shows through. The visual effect is a hand-drawn double outline suggesting imperfect tracing.

Apply via the `.double-border` class or the `.card` MUST class (which includes it automatically).

### Rough-Box Wobbly Corners

A card variant with extreme asymmetric border-radius: `255px 15px 225px 15px / 15px 225px 15px 255px`. Two opposing corners pull long, the other two pinch short. Reads as a hand-drawn lozenge or pebble shape.

Apply via the `.rough-box` class.

### Organic Blobs

Two blob shapes with asymmetric organic border-radius:
- **Blob frame** (`--r: 40% 60% 70% 30% / 40% 50% 60% 50%`): outlined organic wrapper, often paired with a smaller solid fill
- **Blob fill** (`--r: 60% 40% 30% 70% / 60% 30% 70% 40%`): solid charcoal mass used inside a frame or floating

Apply via `.blob-frame` and `.blob-fill` classes.

### Ghost-Blob Wallpaper

An oversized organic blob filled with charcoal at 0.08 opacity, placed absolutely in a slide corner as atmospheric wallpaper. Functions like a watermark cloud behind content. Apply via `.ghost-blob`. At most one per slide, anchored to a corner the primary content does not occupy.

### SVG Scribble Doodles

Inline SVG paths drawn as single 2px-stroke charcoal lines with rounded caps. The vocabulary: wavy squiggles, star outlines, scribbled circles, waveform squiggles, arrows, concentric circles. Placed absolutely in slide corners as hand-drawn punctuation. Every slide gets at least one scribble.

Apply via the `.scribble-line` class on SVG `<path>` elements, with `.doodle-scribble` for positioning.

### Rotation

Small rotations (±0.5deg to ±3deg) on cards, blocks, and statistics provide a hand-placed feeling. Rotation directions alternate across adjacent elements — never all in the same direction, never more than 3deg.

Apply via the `.rotated` and `.rotated-neg` helper classes, or set `--rot` CSS variable for custom amounts.

### No Web Shadows

The system uses no `box-shadow` blur values, no `drop-shadow`, no rgba shadows. All apparent depth comes from the double-stroke offset border, rotation, and ink-density contrast. A blurred shadow on any element breaks the hand-crafted aesthetic.

### Surface Pattern

A subtle notebook grid overlay at 4% charcoal opacity on 20px squares gives the canvas a sketchbook-paper feel. Automatically applied via `--surface-pattern`.

## Animation

Playful is playful and bouncy — not slow and cinematic (Signal) or sharp and urgent (Studio). Durations:
- Base reveal: 500ms
- Slow reveal: 800ms
- Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` for overshoot spring, `cubic-bezier(0.16, 1, 0.3, 1)` for smooth enters.

Use `--ease-bounce` for elements that should feel energetic and playful (cards appearing, stats counting up). Use `--ease-enter` for text reveals and fades. Avoid the slow 1.5s cinematic pacing of Signal — Playful is quicker and lighter.

## Anti-Patterns

- Don't introduce a third color. The system is peach-canvas + charcoal-ink only. No blues, reds, greens, golds, or any chromatic accent.
- Don't use blurred `box-shadow` or `drop-shadow`. Depth comes from double borders and rotation only.
- Don't apply medium border-radius values (4px, 8px, 12px). Corners are sharp (0), perfectly round (50%), or organically blob-shaped — nothing between.
- Don't use Space Grotesk for headlines or display moments. Syne is the personality face.
- Don't use Syne for body paragraphs. It reads as overwrought at small sizes.
- Don't rotate elements more than 3deg. Beyond ±3deg the hand-placed feeling tips into wonky.
- Don't rotate every element in the same direction. Alternate — uniformity reads as a tilted canvas, not as hand-placement.
- Don't crowd a slide with simultaneous cards, statistics, and doodles. One dominant element per slide with one or two scribbles is the correct density.
- Don't use italic or underline for emphasis. Switch face (body to display) or weight (400 to 700/800) instead.
- Don't put display-weight text at default tracking. Always tighten Syne with negative letter-spacing.
- Don't use a separate mono face for labels/meta. Space Grotesk handles all body roles — there is no third typeface.

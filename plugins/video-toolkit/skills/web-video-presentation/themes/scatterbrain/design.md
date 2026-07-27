# Scatterbrain — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/scatterbrain/
**Tone:** Playful, creative, warm, messy-on-purpose, workshop
**Formality:** Low

## Overview

Scatterbrain is a **Post-it-note-and-cork-board presentation system**. Every content block is a colored sticky note on one of three textured background variants -- cork board, desk paper, or warm gradient -- with red thumbtacks pinning the notes and translucent masking tape sometimes layered on top. The visual metaphor is total: the deck is a creative-workshop wall, a brainstorming board, or a thinker's desk.

The typeface stack pairs three Google Fonts:

- **Shrikhand** (display) -- a chunky decorative display serif with playful curves. Used at weight 400 (the only weight available) for every headline, statement, feature-icon glyph, stat value, and oversized callout.
- **Zilla Slab** (body) -- a friendly modern slab serif with humanist warmth. Used at weight 400 for body paragraphs, list items, and labels.
- **Caveat** (hand-script) -- a casual cursive. Used for personal notes, side annotations, label-script eyebrows, and decorative quips.

## Palette

### Surface / Shell

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Shell (letterbox) | `#C9B8A0` | `--shell` | Stage letterbox / outer depth |
| Primary surface | `#F7F5F0` | `--surface` | Default step background (paper) |
| Cream surface | `#FAF8F3` | `--surface-2` | Secondary background for cards/regions |
| Deep cream | `#F5F2EC` | `--surface-3` | Nested surfaces |
| Alternate surface | `#FFFFFF` | `--surface-alt` | White bordered-note surface |

### Text

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Ink (primary) | `#2D2A26` | `--text` | Headlines, stat values, borders, doodle strokes |
| Ink-light | `#5C5750` | `--text-2` | Body paragraphs, secondary text |
| Muted | `#8A857A` | `--text-mute` | Captions, de-emphasized |
| Faint | `#B0AAA0` | `--text-faint` | Metadata, footnotes |

Ink is a soft warm charcoal rather than pure black, sitting comfortably on warm pastels.

### Accent

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Post-it yellow (primary accent) | `#FFE066` | `--accent` | Default sticky-note color, primary accent |
| Accent soft | `rgba(255,224,102,0.3)` | `--accent-soft` | Subtle accent fills |

### Post-it Color Palette

These are the seven sticky-note colors. They have **no fixed semantic meaning** -- yellow is not "warning," green is not "success." They serve as a categorical palette for visual variety.

| Color | Hex | CSS Variable | Fill Style |
|-------|-----|-------------|------------|
| Yellow | `#FFE066` / `#FFD43B` | `--yellow` / `--yellow-deep` | Gradient (135deg) |
| Blue | `#A5D8FF` / `#74C0FC` | `--blue` / `--blue-deep` | Gradient (135deg) |
| Pink | `#FFC9C9` / `#FF9F9F` | `--pink` / `--pink-deep` | Gradient (135deg) |
| Green | `#B2F2BB` / `#8CE99A` | `--green` / `--green-deep` | Gradient (135deg) |
| Orange | `#FFCC80` | `--orange` | Flat fill |
| Purple | `#D0BFFF` | `--purple` | Flat fill |
| White (bordered) | `#FFFFFF` | (see post-it-white class) | Flat fill + 2px ink border |

### Shadow Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-soft` | `rgba(45,42,38,0.15)` | Soft drop shadow on every post-it |
| `--shadow-deep` | `rgba(45,42,38,0.25)` | Contact shadow, second layer of the post-it drop shadow |

**Rule:** Scatterbrain is the only WVP theme that embraces soft blurred shadows for tactile depth. Other themes prohibit them. The visual metaphor depends on the lifted-note-off-a-board effect. Use `2px 3px 15px --shadow-soft, 0 1px 3px --shadow-deep` on every post-it, photo-frame, chart-card, and diagram-canvas.

### Defaults

- **Default surface background**: any of `.bg-cork` / `.bg-paper` / `.bg-warm` per step. Cork for wall-of-notes energy; paper for desk-surface focus; warm-gradient for atmospheric hero moments.
- **Default post-it color**: yellow (`--post-it-color: var(--yellow)`).
- **Default headline color**: `--text` (#2D2A26).
- **Default body text color**: `--text-2` (#5C5750).
- **Default pin color**: red (`.pin`). Use blue/green/gold variants to match post-it color underneath.
- **Default rotation**: `-1deg` on `.card`. Alternate directions across adjacent notes.
- **Custom cursor**: red-and-white thumbtack SVG via `--cursor-tack`.

## Typography

### Font Family

- **Display (Latin):** Shrikhand, weight 400. Use `.display` for English headlines. Chunky decorative serif, single weight (400). This is the system's primary identity -- substituting another display face loses the workshop voice.
- **Display (Chinese):** ZCOOL KuaiLe (站酷快乐体). Use `.display-cn` for Chinese headlines. A chunky rounded display face that matches Shrikhand's playful, hand-drawn marker-pen feel.
- **Body (Latin):** Zilla Slab, weight 400. Use `.body` for paragraph text. Friendly modern slab serif with humanist warmth.
- **Body (Chinese):** Yozai (悠哉字体). Use alongside Zilla Slab in the `--font-body` stack.
- **Hand-script (Latin only):** Caveat, weights 400-700. Use for personal notes, side annotations, label-script eyebrows (`text-transform: uppercase; letter-spacing: 0.15em`), and decorative quips.
- **Mono:** Zilla Slab (fallback to Noto Sans SC). Labels and metadata use the body face rather than a true mono -- the "chunky hand-lettered" register overrides the mono convention.

### Type Scale

| Token | Size | Family | Weight | Use |
|-------|------|--------|--------|-----|
| `--t-display` | `clamp(40px, 5vw, 72px)` | Shrikhand | 400 | Cover/closing oversized headline |
| `--t-h1` | `clamp(32px, 3.5vw, 48px)` | Shrikhand | 400 | Primary slide headline |
| `--t-h2` | `clamp(28px, 2.5vw, 32px)` | Shrikhand | 400 | Section headline / stat-value |
| `--t-h3` | `22px` | Shrikhand | 400 | Card title |
| `--t-body` | `18px` | Zilla Slab | 400 | Standard paragraph body |
| `--t-caption` | `14px` | Zilla Slab | 400 | Captions, labels |
| `--t-micro` | `12px` | Zilla Slab | 400 | Metadata, footnotes |

### MUST Classes

| Class | Font | Size | Weight | Key Properties |
|-------|------|------|--------|---------------|
| `.display` | Shrikhand | `--t-display` | 400 | letter-spacing 0.02em, line-height 1.1 |
| `.display-cn` | ZCOOL KuaiLe | `--t-display` | 400 | letter-spacing 0, line-height 1.2 |
| `.body` | Zilla Slab | `--t-body` | 400 | line-height 1.7, color --text-2 |
| `.body-sm` | Zilla Slab | `--t-caption` | 400 | line-height 1.5, color --text-mute |
| `.label` | Caveat | `--t-caption` | 400 | uppercase, letter-spacing 0.15em |
| `.stat-value` | Shrikhand | `--t-h2` | 400 | line-height 1.1 |
| `.stat-label` | Zilla Slab | `--t-caption` | 400 | color --text-mute |
| `.card` | (post-it container) | -- | -- | gradient bg, soft shadow, small rotation, pin via ::before |
| `.divider` | -- | -- | -- | 2px solid --text |
| `.quote` | Shrikhand | `--t-h2` | 400 | text-align center, padding --space-lg |
| `.tag` | Shrikhand | 1.5rem | 400 | 60px round, 3px ink border, centered flex |
| `.meta` | Zilla Slab | `--t-micro` | 400 | color --text-faint |

### Signature Treatments (non-negotiable)

- **Every display headline is set in Shrikhand.** Even small titles (1.3rem) inside feature cards use Shrikhand.
- **Every body paragraph and list item is set in Zilla Slab.**
- **Every casual / personal note is set in Caveat** -- side annotations, decorative quips, and label-script eyebrows.
- **Every label-script eyebrow is uppercase with 0.15em tracking** in Caveat.
- **Every post-it that hosts a primary headline gets a thumbtack pin via `::before`** (automatic on `.card`).
- **Every hero / statement post-it carries both a pin and a strip of tape** (both `pin` and `tape` classes) for the "officially posted" treatment.

## Layout

### Canvas System

The WVP canvas is the stage container (`--stage-pad-x: 80px; --stage-pad-y: 60px`). Steps fill the viewport with generous padding so content never touches the stage edge.

### Background Texture Rhythm

Each step picks one of three background variants:

- **`.bg-cork`** -- Warm tan/brown tonal gradient with a faint plus-sign pattern suggesting cork texture. Use for "wall of pinned notes" energy -- title slides, data slides, closing slides.
- **`.bg-paper`** -- Cream gradient with a faint 40px grid overlay suggesting graph or notebook paper. Use for "notes arranged on a desk" focus -- feature grids, comparison layouts.
- **`.bg-warm`** -- Cream base with soft-glow ellipses of yellow/blue/pink suggesting morning light. Use for softer, less-textured atmosphere -- statement slides, timeline slides.

**Rule:** Vary background texture across steps. Running three cork steps in a row reads as monotonous. Cork is the default for energy; paper for focus; warm for atmosphere.

### Post-it Composition Patterns

- **Centered single-card**: one large post-it (statement, closing, RSVP-style).
- **Multi-column grid**: aligned grid of post-its with small alternating rotations.
- **Chart + legend**: white chart-card on one side, colored post-it legend on the other.
- **Image + text**: polaroid-style photo-frame on one side, text post-it cluster on the other.
- **Free cluster**: hero post-it surrounded by 2-4 small accent post-its at varied rotations.
- **Timeline rows**: alternating left/right node + dashed-bezier connector + content card.
- **Compare**: two post-its side by side with a centered ink versus-circle between them.

**Density rule:** 1-4 main post-its plus 1-2 small accent/floating notes per step. Overlapping notes collapse playful energy into chaos.

### Spacing Scale

| Token | Value | Use |
|-------|-------|-----|
| `--space-unit` | 8px | Base unit |
| `--space-sm` | 8px | Compact gap |
| `--space-md` | 16px | Default stack/row gap |
| `--space-lg` | 24px | Grid gap, card padding |
| `--space-xl` | 48px | Section breaks |
| `--space-2xl` | 96px | Large section breaks |

## Depth and Elevation

Scatterbrain's depth comes from three techniques:

### 1. Soft Drop Shadow (Primary)

Every post-it carries `box-shadow: 2px 3px 15px --shadow-soft, 0 1px 3px --shadow-deep`. The 15px-blur outer shadow with 2px horizontal and 3px vertical offset suggests the note hovers slightly above the surface. The 1px-blur inner shadow adds the contact shadow at the bottom edge.

### 2. Small Rotation (Secondary)

Every post-it carries a small rotation via `--card-rotation` (default `-1deg`). Hero/statement/feature post-its: small rotations (`+-1-3deg`). Accent/floating post-its: larger rotations (`+-5-15deg`). **Alternate direction** across adjacent notes so the cluster reads as casually applied, not grid-snapped.

### 3. Tactile Layering (Pins + Tape)

- **Pin** (`.pin` or automatic on `.card`) -- 16px round red thumbtack via `::before` at top-center. Radial-gradient highlight + inset shadow + drop shadow make it read as a 3D bead. Color variants: `.pin-blue`, `.pin-green`, `.pin-gold`.
- **Tape** (`.tape`) -- 80x25px translucent white masking-tape strip via `::after` at top-center, slightly rotated (-2deg).
- Use `.pin.tape` on hero/statement post-its for the "officially posted" treatment.

### 4. Background Texture (Atmospheric)

The three background variants and the optional grain overlay (`.grain-overlay` at 4% opacity) provide the foundational textural ground. Without the bg variants the deck reads as floating notes on white.

## Shapes and Treatment

### Border Radius

| Value | Use |
|-------|-----|
| 0 | All post-its, chart-cards, photo-frames, compare-cards |
| 50% (circle) | Feature-icon round border, pins, versus-circle |
| 3px | Chart bar `<rect>` corner radius (inline SVG) |

### Border Weights

- **2px solid `--text`** -- white-note border, chart SVG `<rect>` strokes, `.divider`
- **3px solid `--text`** -- feature-icon round border, doodle SVG paths
- **1px dashed `--rule`** -- stat-row hairline divider
- **1px solid `--rule`** -- compare-list row divider

Borders are universally ink (warm charcoal). Colored borders do not appear.

### Decorative Elements

- **Post-it (`.card` + color helper)**: Colored sticky-note. Soft drop shadow + small rotation + pin via `::before`.
- **Pin (`.pin`, `.pin-blue`, `.pin-green`, `.pin-gold`)**: Thumbtack at top-center via `::before`.
- **Tape (`.tape`)**: Translucent white masking-tape via `::after`.
- **Feature icon (`.feature-icon`)**: 60px round ink-bordered circle with Shrikhand glyph inside.
- **Versus circle (`.vs-circle`)**: Ink-filled circle with cream Shrikhand text between two compare cards.
- **Photo frame (`.photo-frame`)**: Polaroid white card with 1rem padding around a 4:3 inner image area.
- **Stat card (`.stat-card`)**: Top-rule ink divider with label-value `.stat-row` pairs.
- **Doodle SVG (`.doodle`, `.doodle-circle`, `.doodle-line`)**: Decorative marks in step corners. 3px ink stroke at 0.15 opacity. 0-2 per step.

## Animation

Scatterbrain is playful and bouncy. Durations:

- Quick: 300ms
- Base reveal: 500ms
- Slow reveal: 800ms
- Playful entrance: 600ms

Easing: `--ease-bounce` (`cubic-bezier(0.34, 1.56, 0.64, 1)`) for playful spring-like entries. `--ease-soft` (`cubic-bezier(0.4, 0, 0.2, 1)`) for standard reveals.

Use `--dur-base`, `--dur-slow`, `--dur-playful` CSS variables. Use the bouncy easing for elements entering the scene; the soft easing for general reveals. Avoid slow cinematic fades -- Scatterbrain is a workshop, not a film.

## Post-it Color Helpers

Apply these classes to `.card` elements (or any post-it container) to switch the note color:

- `.post-it-yellow` -- default, gradient
- `.post-it-blue` -- gradient
- `.post-it-pink` -- gradient
- `.post-it-green` -- gradient
- `.post-it-orange` -- flat fill
- `.post-it-purple` -- flat fill
- `.post-it-white` -- flat fill with 2px ink border

Cycle through colors for visual variety in multi-card grids. Pair gradient-filled notes with flat-filled notes for textural variation.

## Anti-Patterns

- Don't omit background textures -- post-its floating on a plain white viewport lose the tactile ground.
- Don't substitute another display face for Shrikhand -- the chunky decorative serif is the system's identity.
- Don't substitute another script face for Caveat -- the casual cursive anchors the "scribbled by hand" register.
- Don't use Zilla Slab for headlines or Shrikhand for body paragraphs. The pairing is locked: Shrikhand display + Zilla Slab body + Caveat script.
- Don't assign semantic meaning to post-it colors (yellow = warning, green = good).
- Don't rotate post-its more than `+-15deg`.
- Don't rotate every post-it in the same direction -- alternate across adjacent notes.
- Don't use pure white as a post-it fill without the 2px ink border.
- Don't omit the pin on a headline post-it (removed automatically on `.surface-alt`).
- Don't crowd a step with overlapping post-its -- 1-4 main notes plus 1-2 small accents is the max.
- Don't use slow cinematic fades -- the motion is playful and bouncy.
- Don't use the `.grain-overlay` class if the WVP framework already provides grain -- avoid double-graining.

## CJK Strategy

### Recommended Chinese Font Pairing

| Role | Latin | Chinese |
|------|-------|---------|
| Display | Shrikhand | ZCOOL KuaiLe (站酷快乐体) |
| Body | Zilla Slab | Yozai (悠哉字体) |
| Hand-script | Caveat (Latin only) | (no CJK substitute -- keep Latin notes) |

### Loading (for reference -- fonts are loaded by the WVP framework)

```html
<link href="https://chinese-fonts-cdn.deno.dev/packages/zcool-kuaile/dist/ZCOOLKuaiLe-Regular/result.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/cn-fontsource-yozai-regular/font.css" rel="stylesheet">
```

### Key Adjustments

- Drop the 0.02em positive tracking on ZCOOL KuaiLe (CJK display) -- tracked Chinese characters look broken. Set `letter-spacing: 0`.
- Open display line-height from 1.1 to 1.2-1.3 for ZCOOL KuaiLe.
- Feature-icon round borders work with a single Chinese character (新, 巧, 趣) in ZCOOL KuaiLe.
- Versus circles work with short Chinese words (对比, 与) at smaller display scale.
- Label-script Caveat eyebrows (uppercase tracked) become lowercase CJK in Yozai at the same size without tracking -- or keep them in Latin as an English kicker above Chinese headlines.
- Personal notes / decorative quips should stay in Latin (Caveat). On Chinese-primary steps, treat hand-script as English margin notes -- authentic for modern Chinese creative teams.
- Stat-row patterns work cleanly with Chinese labels (用户数量, 转化率) in Yozai and numerical values in ZCOOL KuaiLe.

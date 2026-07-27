# Pink Script — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/pink-script/
**Tone:** Nocturnal, moody, luxe, expressive, editorial, intentional
**Formality:** Medium-high

## Overview

Pink Script is a **nocturnal couture editorial system** built on a single atmospheric premise: a deep warm-black surface (--surface, #060507) lit from the upper-left by a warm-dark radial ellipse (#1A1218 fading to near-black) with a subtle film-grain overlay at 8% screen blend and a 1px pearl-cream hairline interior frame inset 36px. Together, these three layers create a late-night magazine atmosphere that reads as photographic grain on editorial stock rather than flat digital UI.

The typeface stack is a deliberate three-voice editorial pairing:

- **DM Serif Display** carries every editorial moment — script titles in hot pink, serif headlines in pearl-cream, stat figures, quote text. Always weight 400. Scales from 32px to 600px.
- **Inter at weight 300** carries every body paragraph, lead, description, and caption. The ultra-light geometric sans is the system's calm prose voice — this is a key signature of the system.
- **JetBrains Mono** carries every label, kicker, page number, runner string, and footer. Always uppercase with positive tracking (0.08em to 0.42em).

Hot pink (#ED3D8C) is the single chromatic accent. It appears as script title color, kicker color, chart line color, pill border, inline `<em>` emphasis within pearl-cream headlines, and the source of the soft halo glow behind hero script titles. There is no second chromatic accent. Pearl-cream (#F5EDF1) is the text color on dark and the alternate surface paper.

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Shell (letterbox) | `#050306` | `--shell` | Stage letterbox — darker than surface |
| Primary surface | `#060507` | `--surface` | Default step background (near-black) |
| Surface-2 | `#0F0D11` | `--surface-2` | Lifted dark violet for card regions |
| Surface-3 | `#0A0709` | `--surface-3` | Deeper warm dark for nested surfaces |
| Alternate surface | `#F5EDF1` | `--surface-alt` | Pearl-cream paper — use `.surface-alt` on step root |
| Primary text | `#F5EDF1` | `--text` | Pearl-cream on dark surface |
| Secondary text | `rgba(245,237,241,0.55)` | `--text-2` | Muted paper-blush for body |
| Muted text | `rgba(245,237,241,0.32)` | `--text-mute` | Faint paper for captions |
| Faint text | `rgba(245,237,241,0.14)` | `--text-faint` | Whisper paper for metadata |
| Text on paper | `#060507` | `--text-on-alt` | Deep-ink on pearl-cream surface |
| Text-2 on paper | `rgba(6,5,7,0.62)` | `--text-2-on-alt` | Muted ink on paper |
| Accent | `#ED3D8C` | `--accent` | Hot pink — single chromatic accent |
| Accent soft | `rgba(237,61,140,0.12)` | `--accent-soft` | Pink wash for backgrounds |
| Accent glow | `rgba(237,61,140,0.18)` | `--accent-glow` | Pink glow for text-shadow halo |
| Rule (pink) | `rgba(237,61,140,0.32)` | `--rule` | Pink hairline on dark |
| Rule on paper | `rgba(6,5,7,0.14)` | `--rule-on-alt` | Ink hairline on pearl-cream |

**Rule:** Pink is the only chromatic accent. Never introduce a second accent color. The system is monochromatically pink against a near-black/pearl-cream surface pair.

## Typography

### Font Families

- **Display (Latin):** DM Serif Display, weight 400. Use `.display` for English headlines and editorial scripts. Always in hot pink except when rendering "ink" headlines (pearl-cream with one word switched to pink via `<em>`).
- **Display (Chinese):** Noto Serif SC, weight 700. Use `.display-cn` for Chinese headlines.
- **Body:** Inter, weight 300. Use `.body` for paragraph text. The ultra-light weight is the system's key typographic signature — switching Inter to weight 400 changes the tone.
- **Mono:** JetBrains Mono. Use `.label` for kickers, `.meta` for footnotes, `.tag` for badges. Always uppercase with positive tracking.

### Key Typographic Technique: `<em>` as Color Switch

Inside any pearl-cream DM Serif Display headline, wrap one word or phrase in `<em>` to render it in hot pink (`--accent`). The `<em>` tag is repurposed as a pink color switch — `font-style` is normalized to `normal`. This is Pink Script's most distinctive editorial emphasis mechanism. Use once per headline for emphasis. Do not use on every word.

### Type Scale

| Token | Size | Family | Weight | Use |
|-------|------|--------|--------|-----|
| `--t-script-huge` | 540px | DM Serif Display | 400 | Hero editorial script (cover feature) |
| `--t-display` | 280px | DM Serif Display | 400 | Primary display headline |
| `--t-h1` | 220px | DM Serif Display | 400 | TOC / section headline |
| `--t-h2` | 132px | DM Serif Display | 400 | Content headline / stat headline |
| `--t-h3` | 88px | DM Serif Display | 400 | Supporting headline |
| `--t-stat` | 116px | DM Serif Display | 400 | Stat row figure |
| `--t-body` | 24px | Inter | 300 | Standard body paragraph |
| `--t-caption` | 22px | Inter | 300 | Muted lead / description |
| `--t-micro` | 11px | JetBrains Mono | 500 | Labels / metadata |

### Defaults

- **Default primary headline**: .display in hot pink (`--accent`).
- **Default "ink" headline**: pearl-cream serif headline with one `<em>` pink word.
- **Default body paragraph**: Inter 300 in pearl-cream (--text). Muted body uses `--text-2`.
- **Default label / kicker**: JetBrains Mono uppercase, pink for kickers, muted for metadata.
- **Default stat figure**: DM Serif Display in hot pink at `--t-stat` with tabular-nums.

### Signature Treatment: Pink Halo Text-Shadow

Every hero script element (sizes 280px and larger) carries the pink halo text-shadow:

```
text-shadow: 0 0 80px rgba(237,61,140,0.18);
```

Section-divider mega numerals (600px) carry a stronger halo:

```
text-shadow: 0 0 120px rgba(237,61,140,0.22);
```

The halo simulates the light bleed of large neon-saturated type on photographic paper. It is non-optional on hero script titles.

## Dual-Surface Rhythm

Pink Script alternates between near-black (`--surface`, default) and pearl-cream paper (`--surface-alt`). Apply `.surface-alt` to a step's root `<div>` to switch:

```tsx
// Near-black step (default)
<div className="scene-pad stack">
  <h1 className="display">After Hours</h1>
</div>

// Pearl-cream paper step
<div className="scene-pad stack surface-alt">
  <h1 className="display">The Details</h1>
</div>
```

The alternate surface inverts the color roles: pearl-cream background with deep-ink text. Text colors, dividers, and card backgrounds automatically adjust via `.surface-alt` overrides. Note: on `.surface-alt`, the `.display` class stays hot pink (the accent color is not inverted).

**Rule:** Use the paper surface sparingly — for close-ups, detail shots, stat-heavy slides, or QR/CTA moments where the paper background reads as a "ticket" or "note" surface. The near-black dark surface is the default workspace.

## Spacing Rhythm

Base unit: 8px. All gaps use CSS vars:
- `--space-md` (16px): default stack/row gap
- `--space-lg` (24px): grid gap, card padding
- `--space-xl` (48px): section breaks
- `--stage-pad-x: 60px; --stage-pad-y: 60px`: stage padding

Pink Script runs tighter than editorial themes like Signal because the oversized DM Serif Display type fills the canvas at large sizes — generous padding would dilute the scale effect. The interior hairline frame at 36px creates a secondary structural boundary inside the stage padding.

## Decorative Vocabulary

### Three-Layer Atmospheric Depth

Pink Script creates depth through exactly three atmospheric mechanisms — no box-shadows, no drop-shadows, no elevation:

1. **Radial gradient surface**: An off-center ellipse (90% width, 70% height, positioned at 30% left / 30% top) fading from warm #1A1218 through #0A0709 to near-black #060507. This reads as a studio softbox catching one corner of the magazine page.
2. **Film-grain overlay**: A fractal noise SVG at 8% opacity with screen blend, applied via `::before` on every slide. Adds photographic grain texture to the dark surface.
3. **Pink halo text-shadow**: On hero script titles, an 80-120px blur in pink at low alpha simulates the light bleed of large neon-saturated type on photographic paper.

These three layers together are the system's identity. Omit any one and the editorial atmosphere collapses.

### Hairline Interior Frame

A 1px pearl-cream line at 14% opacity, inset 36px from each edge of the slide, applied via `::after`. Functions as the editorial border of the magazine page. Present unconditionally on every slide.

### Pink Kicker

A JetBrains Mono uppercase eyebrow in hot pink (`--accent`) placed above a headline. The kicker is always pink — this is non-negotiable.

### Runner / Footer Chrome

- **Top runner**: JetBrains Mono 24px / 0.14em tracking, uppercase. Brand name on the left (always pink), section/chapter tag on the right (muted paper-blush).
- **Bottom footer**: Same format. Source/confidentiality on the left, page-position on the right (pearl-cream base with pink `.current` number).

### Callout Rail

A 1px solid pink left border with `padding-left: 24px` and right-aligned content. Used as a vertical callout container beside charts or beside a chapter explanation.

### Stat Row

A 240px DM Serif Display figure in hot pink (with a smaller pearl-cream `<sup>` unit suffix) paired with a JetBrains Mono label and Inter 300 description. Rows separated by 1px hairline.

### Pills (0-Radius Rectangles)

Despite the "pill" naming convention, all pills are strict 0-radius rectangles:
- **Outline**: 1px pink border, pink text, transparent fill (default).
- **Solid**: Pink fill, deep-ink text (affirmative/featured).
- **Dim**: Faint pearl-cream border and text (de-emphasized).

### Pink Chart Line

Primary chart series: 3px solid hot pink. Secondary: 2px dashed pearl-cream at 55% opacity. Inflection markers: 9px solid pink circle with 18px hollow ring.

### Em-Dash Bullet Alternative

Lists may use an em-dash marker (`—`) in hot pink before each item. Use instead of dots or numbers for editorial list moments.

## Animation

Pink Script is slow and editorial — "late-night magazine, not agency urgency." Durations:
- Base reveal: 800ms
- Slow / dramatic: 1200ms
- Cinematic entrance: 1500ms

Use `--dur-base`, `--dur-slow`, `--dur-cinematic` CSS vars. Easing is `--ease-quart` (cubic-bezier(0.19, 1, 0.22, 1)) for smooth deceleration. No spring/overshoot — the editorial gravity requires slow, intentional motion. The 1.5s cinematic duration is used for major reveals: cover titles, section dividers, hero stat reveals.

## Anti-Patterns

- Don't omit the film-grain overlay, the radial gradient surface, or the interior hairline frame. The editorial atmosphere depends on all three.
- Don't use box-shadow on any panel, card, or element. Depth is atmospheric — radial gradient + film grain + pink glow.
- Don't introduce a second chromatic accent. Pink is the only accent color in the system.
- Don't render hot pink text on the pearl-cream surface as body copy — the contrast inverts and reads incorrectly.
- Don't set body copy in DM Serif Display. The serif is for editorial display moments only.
- Don't set display headlines in Inter. The sans-serif is the body voice.
- Don't round any corner. All elements are strict rectangles — cards, pills, tables, and tiles.
- Don't use italic letterforms. The `<em>` tag is repurposed as a pink color switch with font-style normalized to normal.
- Don't crowd a slide with multiple equally-weighted regions. The system reads as elegant when one hero script moment dominates (60-70% of the canvas) and supporting copy orbits in the margins.
- Don't use DM Serif Display below 32px. The serif loses editorial impact at small sizes.
- Don't use Inter at weight 400 for body paragraphs. The ultra-light weight 300 is the system's prose voice.
- Don't use JetBrains Mono for headlines or body text. Mono lives only in label/meta/tag/runner roles.
- Don't use lowercase or negative tracking on JetBrains Mono chrome. Labels are always uppercase with at least 0.08em positive tracking (most use 0.12-0.18em).
- Don't use dashed borders except on chart secondary lines and chart grid lines.
- Don't fill more than ~70% of a slide. Editorial whitespace is structural.

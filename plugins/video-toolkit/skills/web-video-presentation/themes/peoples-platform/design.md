# People's Platform — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/peoples-platform/
**Tone:** Activist, loud, graphic, honest, expressive
**Formality:** Medium-low
**Mood:** WPA-poster-meets-political-campaign — the visual language of conviction, the graphic register of public address.

## Overview

People's Platform is a protest-poster slide system built on three typefaces and a five-color palette that reduces to three functional roles. Alfa Slab One — a compressed slab serif — does all the heavy lifting at extreme sizes in pure uppercase. Caveat Brush drops in as a handwritten human interrupt: lowercase, slightly rotated, emotionally warm. DM Mono carries all metadata at tight uppercase tracking. The palette is electric cobalt blue, amber orange, and hot red — with red functioning exclusively as a shadow/depth color, never as a surface fill. Every slide gets a paper grain overlay that makes the whole deck feel screen-printed. The aesthetic is loud, confident, and populist — the kind of visual language that belongs on a protest placard, a union newsletter, or a campaign bus.

**Key Characteristics:**
- Paper canvas (`#F5F2EA`) with grain overlay via CSS pseudo-element on every slide.
- Stacked double text-shadow: `Npx Npx 0 #E83A2A, 2Npx 2Npx 0 #B7281C`. Shadow size scales with font size.
- Alfa Slab One for all display and structural type — uppercase, line-height 0.82–0.88, letter-spacing 0.005em.
- Red (`#E83A2A`) functions exclusively as a shadow color — never a surface background.
- Heavy 6px ink borders for all major structural divisions.
- DM Mono labels at exactly 24px with 0.18–0.22em tracking.
- Caveat Brush appears at 64–96px, always lowercase, always rotated 2–5 degrees.
- Orange bottom ribbon on data-heavy slides.
- Inset decorative frame (6px solid cream at `inset: 48px`) on blue-background slides.

## Palette

### Primary Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Blue | `#2C2CDC` | `--surface-alt`, `--blue` | Dominant surface for high-emphasis slides. Full-slide background, column fills, topbar backgrounds, display text on paper. |
| Blue Deep | `#1B1BB0` | `--blue-deep` | Outermost layer of some stacked text-shadows. Never a surface fill. |
| Orange | `#F2A03A` | `--accent` | The energy color. Stat figures, column numerals, CTA buttons, ribbon background, accent on blue surfaces. |
| Orange Deep | `#E89321` | — | Reserved for deepest shadow layer on orange elements. Not a surface fill. |
| Red | `#E83A2A` | `--accent-shadow` | The depth color. Used exclusively in text-shadows and box-shadows. **Never** a background or primary text color. |
| Red Deep | `#B7281C` | `--accent-deep` | Outermost layer of double text-shadow on the largest display elements. Never a surface fill. |

### Surface Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Cream | `#F4E9D6` | `--cream`, `--text-on-alt` | Text/border color on blue surfaces (inverted mode), inset frame border, cream-tone slide backgrounds. |
| Paper | `#F5F2EA` | `--surface` | Default slide background — warm off-white. All content slides use this. |
| Ink | `#0E0E14` | `--text`, `--ink` | Near-black with faint blue undertone. Structural borders, body text, column dividers, timeline tracks, KPI card borders. |

### Color Roles Summary

- **Blue surfaces** = high-emphasis, conclusive, authoritative moments
- **Paper/cream surfaces** = content-first, readable, subordinate moments
- **Orange** = the number, the energy, the thing that matters most on a given slide
- **Red** = never a color you see directly — only a shadow you feel

## Typography

Four typefaces; each occupies a completely non-overlapping register.

### Font Families

**Alfa Slab One** is the primary voice. A compressed, heavy slab serif with strong verticals and blocky serifs. Used at weight 400 (the only weight available, which is intrinsically bold) in strict uppercase for every display moment from 28px stamps to 540px stat figures. Its compressed letterform means even massive sizes don't feel wide — they feel tall and column-like. The slight positive letter-spacing (0.005em) keeps glyphs from touching at large sizes.

**Caveat Brush** is the human voice. A rough handwritten script face used only at large sizes (64–96px), always lowercase, always with a small rotation (-2 to -5 degrees). It appears at moments of warmth, transition, or informality. It is never used for body copy or labels.

**DM Mono** is the accounting voice. Monospace, 24px, wide letter-spacing (0.18–0.22em), uppercase. It appears on topbars, footers, kicker labels, metadata rows, source citations, and ribbon text. It is always a supporting element — the technical spec printed at the bottom of a poster.

**Archivo Narrow** is the body voice. A condensed sans used for all running body copy. Weight 500 for most body text; 400 for smaller captions. Never used at display sizes.

### Typography Principles

- Alfa Slab One is always uppercase — never use it in sentence case or lowercase.
- Line-height at display sizes is tight: 0.86 for single-line, 0.88–1.04 for multi-line.
- The 0.005em letter-spacing is nearly invisible but prevents glyph collision at 100px+ sizes.
- DM Mono labels are always 24px regardless of context. Tracking varies by placement: 0.18em for topbar/footer, 0.22em for ribbon and footline.
- Archivo Narrow is always weight 400 or 500. Never use it at display sizes.
- Caveat Brush is always lowercase, always slightly rotated, never used for body text.

### CSS Type Classes Reference

| Class | Family | Size | Weight | Notes |
|-------|--------|------|--------|-------|
| `.display` | Alfa Slab One | `--t-display` (clamp 80–260px) | 400 | UPPERCASE, orange, stacked shadow (red + red-deep) |
| `.display-cn` | Noto Serif SC | `--t-display` | 900 | Chinese display |
| `.body` | Archivo Narrow | 28px | 500 | Body copy |
| `.body-sm` | Archivo Narrow | 24px | 400 | Caption text |
| `.label` | DM Mono | 24px | 400 | UPPERCASE, 0.18em tracking |
| `.stat-value` | Alfa Slab One | clamp(80px, 7vw, 130px) | 400 | Orange with 5px/10px red shadow |
| `.stat-label` | Archivo Narrow | 28px | 500 | Stat description |
| `.quote` | Alfa Slab One | `--t-h3` | 400 | UPPERCASE, orange, stacked shadow |

### Script Scale

| Token | Size | Use |
|-------|------|-----|
| `.script` (large) | clamp(64px, 4vw, 96px) | Prominent handwritten accent |
| `.script` (within `.display`) | max(64px, 0.38em) | Inline script interrupt in headline |

All script text is lowercase, rotated -2deg to -5deg, text-shadow: none.

## Stacked Text-Shadow Depth System

The system's signature. Display text casts layered offset shadows in the same direction (bottom-right), creating a quasi-3D letterpress effect. Four tiers by element size:

| Tier | Offset layer 1 | Offset layer 2 | Use |
|------|----------------|----------------|-----|
| Small (`.shadow-stack-sm`) | `3px 3px 0 #E83A2A` | — | Items below 72px |
| Medium (`.shadow-stack-md`) | `5px 5px 0 #E83A2A` | — | 72px–140px display |
| Large (`.shadow-stack-lg`) | `6px 6px 0 #E83A2A` | `12px 12px 0 #B7281C` | Display headlines (default) |
| XL (`.shadow-stack-xl`) | `10px 10px 0 #E83A2A` | `20px 20px 0 #B7281C` | 140px–260px display |
| Jumbo (`.shadow-stack-jumbo`) | `12px 12px 0 #E83A2A` | `24px 24px 0 #B7281C` | 260px+ stat figures |

The orange display text is the "face" layer; red is the "body"; red-deep is the "foot." The illusion is of a letterform with physical thickness.

Box-shadow on decorative elements (stamps, avatars, CTA buttons, KPI cards) uses the same offset logic: `6px 6px 0 #E83A2A` or `8px 8px 0 #E83A2A`.

## Layout and Spacing

### Canvas System

Every slide is 1920x1080px. The `deck-stage` custom element handles scaling. All content uses absolute positioning or CSS grid — no scrolling.

### Gutter System

- **Stage padding:** `--stage-pad-y: 80px; --stage-pad-x: 90px` — standard edge padding for most content sections.
- **Content gutter** (120px): Extra breathing room for reading text below a structural header.
- **Topbar height** (90px): Fixed-height blue band at the absolute top of a slide.
- **Frame inset** (48px): Distance from slide edge to the decorative inset frame border on blue-background slides.

### Spacing Scale

- `--space-sm` (8px): tight inline gaps
- `--space-md` (16px): default stack/row gap, divider margin
- `--space-lg` (24px): card padding, grid gap
- `--space-xl` (48px): section breaks, headline-to-body distance
- `--space-2xl` (96px): large section gaps

### Border Weights

- **6px solid `--ink`** — Primary structural borders: section dividers, column separators, topbar bottom edges, inset frames, KPI card borders, card borders.
- **6px solid `--cream`** — Inverted structural borders on blue surfaces: inset frame, topbar divider in cream-on-blue mode.
- **5px solid** — Secondary structural borders: quote stamp, KPI cards.
- **4px solid** — Tertiary dividers: side labels in compare panels, lede left-border.
- **3px solid `--ink`** — Fine structural lines: TOC row separators, column tags, stat source dividers, inner timeline lines, badge borders.

### Radius Scale

| Value | Use |
|-------|-----|
| 999px (pill) | Meta label pills, `.tag` badges |
| 50% (circle) | Avatar elements, timeline milestone dots, circular stamp |
| 4px | Diamond bullet pseudo-elements (rotated 45deg to form a diamond) |
| 0px | All structural elements: columns, cards, topbars, frames, ribbons, KPI cards, stamps |

The system is almost entirely square. The only soft shapes are pill, circle, and diamond.

## Decorative Vocabulary

### Paper Grain Overlay (`.grain`)

Every slide carries a `.grain` class whose `::before` pseudo-element applies two overlapping radial-gradient dot grids at 3px and 5px pitch, with `mix-blend-mode: multiply` and 50% opacity. This simulates screen-print halftone texture, giving the flat digital surfaces a physical, printed quality. It is structural to the aesthetic — no slide should be without it.

### Stacked Text-Shadow

The signature depth technique. Orange display text casts a red shadow at 6–12px offset, which casts a red-deep shadow at 12–24px offset. This three-layer quasi-3D letterpress effect is the system's most recognisable trait. Apply via `.shadow-stack-*` utility classes or the built-in `.display` / `.stat-value` / `.quote` class defaults.

### Electric Blue Alternate Surface (`.surface-alt`)

Apply `.surface-alt` to a step root for a blue-background moment. This inverts the palette: blue background, cream text, cream inset frame, red/orange accents. Use for section openers, key data reveals, conclusive moments. The class handles full color inversion automatically.

### Inset Cream Frame

On blue-background slides (`.surface-alt`), the `::after` pseudo-element draws a 6px solid cream border at `inset: 48px`. This creates a poster-within-a-poster framing effect — the design within the design. Do not use on paper-background slides.

### Orange Ribbon (`.ribbon`)

A 60px bottom-anchored strip in orange with 6px ink top border and repeating DM Mono text at 0.22em tracking. Functions as a marquee footer on data-heavy slides.

### Diamond Bullet (`.bullet-diamond`)

List item marker using a `::before` pseudo-element: 24px x 24px, `background: var(--accent-shadow)` (red), `border-radius: 4px`, `transform: rotate(45deg)`. On blue surfaces, diamonds are orange. The shape sits 48px left of the text.

### Short Accent Divider (`.divider-accent-short`)

A 36px wide, 6px tall solid orange rule. Use between a headline and body text or below a stat. Never more than one per step.

### KPI Card (`.kpi-card`)

Data card with 5px ink border, paper background. The `.kpi-card.alt` variant uses blue background with cream text. The value inside uses Alfa Slab One with the standard text-shadow.

### Stamp (`.stamp`)

A rectangular block rotated -3deg with 5px cream border, blue background, orange text, and 6px red box-shadow. Contains Alfa Slab One 28px text at 0.04em tracking. Functions as an address-label-style decorative element.

### Script Interrupt

Caveat Brush text at 64–96px, lowercase, rotated 2–5 degrees. Always appears adjacent to an Alfa Slab One headline it qualifies or interrupts — never alone. Use the `.script` class or the inline `.display .script` pattern.

### Underline Rule (`.underline-rule`)

A 14px tall solid ink rectangle, width 30% of its container. Use as a full-stop after a manifesto headline. Heavier than a hairline rule — closer to a redaction bar.

### Topbar (`.topbar`)

A full-width 90px blue bar anchored to the absolute top of a step. Contains DM Mono 24px label text at 0.18em tracking with a 6px solid cream bottom border. Use on high-emphasis blue-background slides.

### Display-Ink (`.display-ink`)

A modifier for `.display` when a section heading needs to be ink-blue instead of accent-orange (e.g. TOC entries, section dividers on paper). Uses a single red shadow (5px) rather than the double orange-red-red-deep stack.

## Surface-Alt Rhythm (Dual-Surface)

Peoples-platform is a dual-surface system. Steps alternate between paper (`--surface`, default) and electric blue (`--surface-alt`). Apply `.surface-alt` to a step's root `<div>` to switch:

```tsx
// Paper step (default — no class needed)
<div className="scene-pad stack grain">
  <h1 className="display">THE MESSAGE</h1>
</div>

// Blue step
<div className="scene-pad stack grain surface-alt">
  <h1 className="display">THE COMMITMENT</h1>
</div>
```

The alternate surface automatically adjusts text colors, dividers, card backgrounds, and adds the inset cream frame. Do not override these — `.surface-alt` handles the full color inversion.

**Rule:** Don't alternate every step — that's jarring. Use blue for "chapter openers," key data reveals, or conclusive moments. Paper is the default workspace.

## Animation

Peoples-platform is punchy and fast. Durations:

- Quick reveals: 200ms (`--dur-quick`)
- Base reveals: 300ms (`--dur-base`)
- Slow / dramatic: 800ms (`--dur-slow`)

Use `--ease-quart` (smooth deceleration) for most reveals. The fast cadence matches the poster/placard energy — the deck moves at the pace of a spoken rally, not a whispered editorial.

## Typography Stacking Rules

When combining typefaces in a single slide:

1. Alfa Slab One owns the headline — always at the top, always uppercase, always the largest thing on the slide.
2. Caveat Brush interrupts the headline — inline within `.display` via `.display <span class="script">...</span>` or as a standalone pre-headline above the display text.
3. DM Mono labels sit below or beside the headline — in topbars, footer rows, kicker lines, source citations.
4. Archivo Narrow body paragraphs fill the remainder — never clustered near the headline.

When displaying both Latin and Chinese, set Chinese in Noto Serif SC for display roles and Noto Sans SC for body roles. The stacked text-shadow transfers perfectly to Chinese.

## Anti-Patterns

- **Don't use red as a background or primary text color.** It is a shadow material, not a surface material. The moment red appears as a fill, the depth system collapses.
- **Don't use Alfa Slab One in mixed case.** The uppercase lock is essential to the slab's authority.
- **Don't round card or container corners.** Cards, frames, topbars, columns, KPI cards — all strictly square (border-radius: 0).
- **Don't soften the border weights.** 1px or 2px borders on structural elements break the printed-matter aesthetic. 6px is the standard.
- **Don't use Archivo Narrow for headlines.** It is a body and lede face only — it lacks the visual weight for display use.
- **Don't use blue-deep or red-deep as surface colors.** They are shadow-only values.
- **Don't omit the diamond bullet rotation on list items.** A 45deg-rotated square is a diamond; an upright square is a box.
- **Don't vary the DM Mono font size.** 24px is the single fixed size for all monospace label text.
- **Don't omit the grain overlay.** Every slide must have the `.grain` class — it is the surface everything else is printed on.
- **Don't use shadowless Alfa Slab One orange text.** The stacked shadow is the system's signature.
- **Don't use Caveat Brush at body sizes or without rotation.** Flat, small handwriting reads as untidy, not intentional.
- **Don't use inset frames on paper-background slides.** The cream inset frame is exclusive to blue surfaces.
- **Don't use pure white or pure black.** Paper (`#F5F2EA`) is the light end; ink (`#0E0E14`) is the dark end.

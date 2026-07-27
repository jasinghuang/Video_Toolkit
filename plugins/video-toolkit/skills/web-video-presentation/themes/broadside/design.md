# Broadside — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/broadside/
**Tone:** Editorial, dramatic, loud, literary
**Formality:** Medium-high

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Primary surface | `#111111` | `--surface` | Default step background (ink-black) |
| Alternate surface | `#E85D26` | `--surface-alt` | Use `.surface-alt` for orange register |
| Primary text | `#F0ECE5` | `--text` | Warm cream headlines on dark |
| Secondary text | `#888880` | `--text-2` | Cream-muted body on dark |
| Accent | `#E85D26` | `--accent` | Fire orange — singular accent |
| Border | `#282826` | `--rule` | Hairline dividers on dark |
| Text on orange | `#111111` | `--text-on-alt` | Dark ink headlines on orange |
| Text on orange 2 | `rgba(17,17,17,0.75)` | `--text-2-on-alt` | Muted body on orange |

**Rule:** Never introduce a second accent color. Fire orange is the only non-neutral hue. No pure white background slides exist — the lightest surface is warm cream text on dark.

## Two-Register System

Broadside operates on a **binary register system**. Every step is either:

**Dark register** (default `--surface`):
- Ink-black background, warm cream text, fire orange as the singular accent
- Used for content slides (split, stats, list, compare, chart, quote)
- Kickers, stat values, bullet markers, and accent rules render in fire orange

**Orange register** (`.surface-alt`):
- Fire orange fills the entire background; dark ink (`#111111`) becomes the text color
- Used for covers, chapter dividers, statement/payoff slides, and end slides
- Accent elements (kickers, tags, rules) render in dark ink

```tsx
// Dark step (default — no class needed)
<div className="scene-pad stack">
  <p className="kicker">Core Thesis</p>
  <h1 className="display">the argument</h1>
</div>

// Orange step
<div className="scene-pad stack surface-alt">
  <h1 className="display">the next chapter</h1>
</div>
```

**Rule:** Covers and chapters = orange. Content = dark. Don't use orange for data slides — orange is for declaration moments only.

## Typography

- **Display (Latin):** Barlow, weight 900, lowercase (NEVER uppercase). Use `.display` for hero headlines. The lowercase + weight-900 + negative-tracking combination is Broadside's most distinctive single decision.
- **Display (Chinese):** Noto Serif SC, weight 700. Use `.display-cn` for Chinese headlines. Note: CJK has no case — the lowercase signal drops away.
- **Body:** Work Sans, weight 400. Clean geometric sans for paragraph text. Paired with Barlow's dense grotesque display, Work Sans offers a slightly wider, more legible reading face.
- **Mono:** IBM Plex Mono. Use `.label` for kickers, `.meta` for footnotes, `.tag` for badges. All mono text is uppercase with 0.14em tracking.
- **h1/h2/h3:** Barlow at progressive weights — h1=800, h2=700, h3=600. All lowercase.
- **Stat value:** Barlow 900 lowercase, rendered in fire orange on dark (`--accent`) or dark ink on orange (`--text-on-alt`).

**Key technique:** The lowercase display + massive scale + negative tracking creates a "protest poster" density. At 13vw, a single word at weight 900 becomes a graphic primitive. On `.surface-alt`, the "ink on fire" rule forces every display/h1/h2/h3 to pure black — cream text on orange does not exist.

## Spacing Rhythm

Base unit: 8px. All gaps use CSS vars:
- `--space-md` (16px): default stack/row gap
- `--space-lg` (24px): grid gap, card padding
- `--space-xl` (48px): section breaks
- `--stage-pad-x: 80px; --stage-pad-y: 60px`: stage padding

Broadside's type is massive — the padding is deliberately tighter than editorial norms so the type crowds the frame.

## Decorative Vocabulary

### Accent Rule (36×2px)
Use `<hr className="rule-accent" />` for a short 36px orange (or dark-ink-on-orange) line. Broadside's only decorative ornament. Place between a kicker and headline, or as a visual section break. Use at most one per step.

### Kicker
Use `<p className="kicker">` for an orange mono uppercase eyebrow line above headlines. The kicker is the system's most reliable "slide type" signal — content slides always open with a kicker.

### Slash Bullets
The `.bullet-list` component renders `/` (forward slash) as the marker in the accent color, set in IBM Plex Mono weight 700. Cap bullet lists at 3 items — Broadside prizes impact over density.

### Tag (Bordered Mono)
Use `.tag` for inline labels: mono uppercase, 1px solid border in accent color, transparent fill. On orange surface, border and text flip to dark ink.

### Fadelist
A three-stage stacked composition with words at descending opacity (1.0, 0.5, 0.22). Used for "before / during / after" or "past / present / future" narratives. Works best on the orange register.

### Broadside Number
Use `<span className="broadside-num">` for a small mono catalogue-style numeral (typically pinned top-left on covers and chapter slides).

## Animation

Broadside uses a brisk editorial tempo:
- Base reveal: 500ms
- Slide transition: 800ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for enters, `cubic-bezier(0.77, 0, 0.175, 1)` for slide transitions.

## Anti-Patterns

- Don't uppercase Barlow at display or heading weights. Uppercase Barlow at 13vw reads as a different design system entirely.
- Don't introduce a second accent color. Orange is the only color — adding blue, yellow, or green breaks the protest-poster identity.
- Don't use cream-colored text on orange slides. The "ink on fire" rule is absolute — orange surfaces use dark ink for all headlines and body.
- Don't add drop shadows, blurred elevations, or rounded surfaces. Broadside is strictly flat.
- Don't pair Barlow with a serif companion. The single-typeface monolith is part of the identity.
- Don't render chrome elements in Barlow. Chrome is exclusively IBM Plex Mono uppercase.
- Don't create a third surface register. There are two: dark and orange. No cream/paper surface exists.
- Don't use italic or underline. Emphasis is achieved through weight, size, or orange color only.
- Don't use emoji or playful typography — this is an editorial system.

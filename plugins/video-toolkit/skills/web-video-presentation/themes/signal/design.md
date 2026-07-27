# Signal — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/signal/
**Tone:** Editorial, confident, cinematic, refined
**Formality:** High

## Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Primary surface | `#F0ECE3` | `--surface` | Default step background (cream) |
| Alternate surface | `#1C2644` | `--surface-alt` | Use `.surface-alt` on step root for navy variant |
| Primary text | `#1C2644` | `--text` | Headlines on cream |
| Secondary text | `#3A4560` | `--text-2` | Body on cream |
| Accent | `#C8A870` | `--accent` | Antique gold — use sparingly |
| Text on navy | `#F0ECE3` | `--text-on-alt` | Headlines on `.surface-alt` |

**Rule:** Never use pure white or pure black. The cream is the warmest neutral; the navy is deep but not black.

## Typography

- **Display (Latin):** Instrument Serif italic, 400 weight. Use `.display` for English headlines.
- **Display (Chinese):** Noto Serif SC, 700 weight. Use `.display-cn` for Chinese headlines.
- **Body:** Archivo, 400 weight. Use `.body` for paragraph text.
- **Mono:** JetBrains Mono. Use `.label` for kickers, `.meta` for footnotes, `.tag` for badges.

**Key technique:** Wrap emphasized words in `.display` with `<em>` or `<i>` — they render in gold (`--accent`). This is Signal's most distinctive typographic signature. Use once per headline, never on every word.

## Dual-Surface Rhythm

Signal is a dual-surface system. Steps alternate between cream (`--surface`, default) and navy (`--surface-alt`). Apply `.surface-alt` to a step's root `<div>` to switch:

```tsx
// Cream step (default — no class needed)
<div className="scene-pad stack">
  <h1 className="display">The Pattern</h1>
</div>

// Navy step
<div className="scene-pad stack surface-alt">
  <h1 className="display">The Contrast</h1>
</div>
```

The alternate surface automatically adjusts text colors, dividers, and card backgrounds. Do not override these — `.surface-alt` handles the full color inversion.

**Rule:** Don't alternate every step — that's jarring. Use navy for "chapter openers," key data reveals, or dramatic pauses. Cream is the default workspace.

## Spacing Rhythm

Base unit: 8px. All gaps use CSS vars:
- `--space-md` (16px): default stack/row gap
- `--space-lg` (24px): grid gap, card padding
- `--space-xl` (48px): section breaks
- `--stage-pad-x: 120px; --stage-pad-y: 80px`: stage padding

**Rule:** Respect the padding. Content should never touch the stage edge.

## Decorative Vocabulary

### 80px Grid

An invisible structural grid overlays the cream surface at 3% white. You don't see it consciously, but it gives the surface a "structured" feel. On navy, the grid is not visible (it's white-on-cream only). Do not try to add your own grid — it's automatic via `--surface-pattern`.

### Short Gold Rule

Use `<hr className="divider-accent-short" />` for a 36px gold accent line. Signal's signature separator. Place it between a headline and body text, or below a stat. Never use more than one per step.

### Gold Italic Emphasis

Inside `.display`, wrap key phrases in `<em>` or `<i>` for gold rendering. This is the mid-sentence emphasis technique. Use on the single most important word or phrase in the headline.

## Animation

Signal is slow and cinematic. Durations:
- Base reveal: 800ms
- Slow / dramatic: 1200ms
- Cinematic entrance: 1500ms

Use `--dur-base`, `--dur-slow`, `--dur-cinematic` CSS vars. Easing is `--ease-quart` (smooth deceleration) for most reveals. Don't use spring/overshoot — that breaks the editorial gravity.

## Anti-Patterns

- Don't use gold on every element — accent is scarce and precious
- Don't alternate surface every step — cream is home, navy is emphasis
- Don't use bright/saturated colors beyond the gold accent
- Don't use decorative borders, gradients, or glow effects — Signal is refined, not flashy
- Don't use emoji or playful typography — this is an editorial system

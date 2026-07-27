# Studio — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/studio/
**Tone:** Electric, bold, graphic, design-led
**Formality:** Medium

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Primary surface | `#1C1C1C` | `--surface` | Default step background (near-black) |
| Alternate surface | `#F5D200` | `--surface-alt` | Use `.surface-alt` on step root for yellow variant |
| Primary text | `#F5D200` | `--text` | Headlines on dark — acid yellow |
| Secondary text | `rgba(245,210,0,0.58)` | `--text-2` | Body on dark |
| Muted text | `rgba(245,210,0,0.32)` | `--text-mute` | Captions on dark |
| Text on yellow | `#1C1C1C` | `--text-on-alt` | Headlines on `.surface-alt` |
| Text on yellow 2 | `rgba(28,28,28,0.62)` | `--text-2-on-alt` | Body on yellow |

**Rule:** Never introduce a third color. The system is binary: near-black or acid yellow, with opacity variants for hierarchy. No greys — muting is done via opacity only.

## Typography

- **Display (Latin):** Barlow, weight 900, uppercase, negative letter-spacing. Use `.display` for English headlines. The type-as-graphic-mass effect depends on all three (weight, case, tracking) being applied together.
- **Display (Chinese):** Noto Serif SC, weight 700. Use `.display-cn` for Chinese headlines. Note: CJK has no case, so the "uppercase" signal drops away.
- **Body:** Barlow, weight 400. Use `.body` for paragraph text.
- **Mono:** IBM Plex Mono. Use `.label` for kickers, `.meta` for footnotes, `.tag` for badges.
- **h1/h2/h3:** Barlow weight 900 (h1/h2) or 700 (h3). All uppercase with negative tracking.
- **Stat value:** Barlow weight 900 uppercase, `--accent` color.

**Key technique:** The headline IS the design. At display scale (12vw), Barlow 900 uppercase stops reading as type and starts reading as a graphic shape. Use short, punchy headlines — 1-3 words at display scale, 4-8 words at h2 scale.

## Dual-Surface Rhythm

Studio alternates between near-black (`--surface`, default) and acid yellow (`--surface-alt`). Apply `.surface-alt` to a step's root `<div>` to switch:

```tsx
// Near-black step (default)
<div className="scene-pad stack">
  <h1 className="display">PROPOSAL</h1>
</div>

// Yellow step
<div className="scene-pad stack surface-alt">
  <h1 className="display">THE WORK</h1>
</div>
```

**Rule:** Alternate surfaces every 1-3 steps for pacing. Don't run more than 3 dark steps in a row without a yellow break. Yellow is for "declaration moments" — covers, chapter breaks, statement slides. Dark is the default workspace.

## Spacing Rhythm

Base unit: 8px. All gaps use CSS vars:
- `--space-md` (16px): default stack/row gap
- `--space-lg` (24px): grid gap, card padding
- `--space-xl` (48px): section breaks
- `--stage-pad-x: 80px; --stage-pad-y: 60px`: stage padding

Studio runs tighter than editorial themes (80/60 vs 120/80) because Barlow display type at weight 900 fills the canvas visually — generous padding would dilute the scale effect.

## Decorative Vocabulary

### No Patterns, No Vignettes
Studio is aggressively flat. There is no background pattern, no grain texture, no vignette overlay. The surface is pure color.

### Hairline Rules
Use `.divider` (1px) for structural separation. Use 2px rules on stat-card tops and chart baselines for anchor-weight division. Both are solid lines only — no dashed borders.

### Em-Dash Bullets
Lists use `.bullet-list` which renders `—` (em-dash) as the marker in the accent color. Never use dots or numbers.

### Tag (Bordered Mono)
Use `.tag` for inline labels: mono uppercase with a 1px solid border in the accent color and transparent fill.

## Animation

Studio is sharp and fast — "agency urgency, not editorial grace." Durations:
- Base reveal: 500ms
- Slide transition: 750ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for enters (overshoot-free spring), `cubic-bezier(0.77, 0, 0.175, 1)` for slide transitions.

Use `--dur-enter`, `--dur-slide` CSS vars. Keep animations crisp. Avoid slow fades — Studio is designed for fast-paced agency presentations.

## Anti-Patterns

- Don't use lowercase on headlines. Every Barlow 900 element is uppercase — no exceptions.
- Don't use weight 800 or 700 at display scale. Display = 900 weight, always.
- Don't add a third color to the palette. The binary (dark/yellow) is the identity.
- Don't round any corner. Border-radius: 0 on everything structural.
- Don't add drop shadows, gradients, or elevation. Flat is non-negotiable.
- Don't use Barlow for metadata chrome. Mono (IBM Plex Mono) is for metadata only.
- Don't use Mono for headlines or body. Mono lives only in the label/meta/tag roles.
- Don't use italic, underline, or color variants for emphasis. Only weight contrast (900 vs 400).
- Don't use dashed borders. Every line is solid.
- Don't fill more than ~60% of a step. Empty space is structural — Studio reads as broken when crowded.
- Don't use a separate grey color for muted text. Always use opacity variants of yellow or near-black.

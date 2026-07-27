# Cartesian — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/cartesian/
**Tone:** Classical, restrained, quiet, architectural
**Formality:** High

## Palette

| Role | Hex | CSS Variable |
|------|-----|-------------|
| Primary surface | `#EDE8E0` | `--surface` |
| Card surface | `#E2DBD1` | `--surface-2` |
| Primary text | `#1A1A1A` | `--text` |
| Secondary text | `#5A5A5A` | `--text-2` |
| Muted / accent | `#8A8178` | `--text-mute`, `--accent` |
| Hairline | `#B8B0A4` | `--rule` |

**Critical rule:** No saturated color anywhere. The entire system runs on tonal contrast between warm stones. The "accent" is the warm stone `#8A8178` itself — use it like any text-mute color, not like a saturated accent. Hierarchy comes from font weight and spacing, not color.

## Typography

- **Display:** Playfair Display italic, 400 weight. Use `.display`.
- **Display (CN):** Noto Serif SC, 700 weight. Use `.display-cn`.
- **Body:** Inter, 400 weight. Use `.body`.
- **Mono:** JetBrains Mono. Use `.label`, `.meta`.

## Spacing

All gaps use CSS vars: `--space-md` (16px) for stack/row, `--space-lg` (24px) for grid. Stage padding: 120px × 80px.

## Decoration

A compass circle ornament (1px taupe dotted/dashed concentric circles at 30% and 20% opacity) overlays the surface via `--surface-pattern`. It creates atmosphere without demanding attention. Do not try to add your own geometric decorations — this is Cartesian's only ornament.

## Animation

Slow, quiet, unhurried. Base reveals at 900ms, slow at 1400ms, cinematic at 1650ms. Use `--ease-quart` for smooth deceleration. No spring, no bounce, no overshoot.

## Anti-Patterns

- Never introduce a saturated color — no blue, no red, no gold
- Never use a rule thicker than 1px
- Never use emoji or playful typography
- Don't add decorative elements beyond the compass circle
- Don't use bright highlights or glow effects

# Capsule — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/capsule/
**Tone:** Playful, modern, warm, fresh, fun
**Formality:** Medium-low

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Canvas | `#F5F5F0` | `--surface` | Default step background (warm bone cream) |
| Ink | `#1A1A1A` | `--text` | Primary text, outline color |
| Outline | `#1E1E1E` | `--rule` | Universal 2px stroke on every pill/card |
| White | `#FFFFFF` | `--surface-2` | Pill-card fill |
| Shadow | `rgba(26,26,26,0.08)` | `--card-shadow` | Universal hard-offset shadow color |
| **Coral** | `#E85D4E` | `--candy-coral` | Default accent-line, stat color |
| **Lime** | `#C4D94E` | `--candy-lime` | Orbit-center fill |
| **Lavender** | `#C5B5E0` | `--candy-lavender` | Header-pill fill |
| **Sky** | `#8BB4F7` | `--candy-sky` | Third accent in sequences |
| **Violet** | `#A06CE8` | `--candy-violet` | Second purple accent |
| **Yellow** | `#F2D160` | `--candy-yellow` | Title/closing pill fill |
| **Peach** | `#F5B895` | `--candy-peach` | Softest accent, decorative pills |
| **Mint** | `#A8E6CF` | `--candy-mint` | Lower-emphasis decorative |

**Rule:** Nine closed candy colors. No semantic mapping. Choose for compositional balance.

## Typography

- **Display (Latin):** Bodoni Moda, weights 700-800, variable opsz. For every headline, stat, card title, quote. Negative letter-spacing (-0.01em to -0.03em). Always ink color, never candy.
- **Display (Chinese):** ZCOOL XiaoWei, weight 400.
- **Body (Latin):** Space Grotesk, weights 400-600. For every paragraph, label, pill text, subtitle. Uppercase + 0.08em tracking on small text.
- **Body (Chinese):** Yozai (cn-fontsource), weight 400.
- **Stat number:** Bodoni Moda 800, candy color (default coral).

**Key technique:** The serif/grotesk pairing creates the rhythm. Bodoni headlines are always ink. Color lives on stat numerals and pill fills only.

## Decoration Vocabulary

### Universal Pill Geometry
- Small containers: `border-radius: 9999px` (full pill).
- Larger cards: `border-radius: 2rem` (32px).
- Circular elements: `border-radius: 50%`.
- 2px solid outline on everything.

### Hard-Offset Shadows
- 4px 4px 0: small nodes (step nodes, small pills).
- 6px 6px 0: orbit pills, stat-pills, diagram nodes.
- 8px 8px 0: pillar-cards, chart containers.
- 12px 12px 0: visual frame (most lifted element).
- Shadow color: `rgba(26,26,26,0.08)` — always bottom-right, never blurred.

### Decorative Floating Pills
5-8 small pills in candy fills, tilted -20 to +25 degrees, placed absolutely on slide backgrounds. Contain single uppercase Space Grotesk words. Atmospheric, not informational.

### Ambient Canvas
- Radial accent glows (6-15% opacity) in candy colors on every slide.
- Fractal-noise grain overlay (4% opacity, multiply blend) over the entire viewport.

### Button/Icons
- **Title pill:** Yellow fill, uppercase pill text, `pill-pad-lg` padding.
- **Card icon:** 60px circular pill, candy fill, Bodoni numeral.
- **Step node:** 56px circular pill, white fill, 4px shadow.
- **Bar track:** 36px pill shape, 2px outline.
- **Diagram node:** Pill container with 6px shadow.

### Internal Dividers
- 1px solid ink (solid dividers between sections).
- 1px dashed ink (decorative interior borders).

## Animation

- Slide transition: 0.6s opacity fade via `cubic-bezier(0.4, 0, 0.2, 1)`.
- Bar fill: 1s `cubic-bezier(0.4, 0, 0.2, 1)` from 0 to width.
- Card hover: 0.3s transform ease.
- Nav dot: 0.3s scale + background transition.

## Anti-Patterns

- Don't render any text container with sharp corners. No square text containers.
- Don't render a pill, card, or icon without the 2px ink outline. The stroke is the identity.
- Don't render Bodoni headlines in a candy color. Headlines are always ink.
- Don't use blurred drop shadows. Shadow is always solid hard offset.
- Don't pair Bodoni with a different sans. Bodoni Moda + Space Grotesk is fixed.
- Don't use uppercase on Bodoni headlines. Sentence case for headlines.
- Don't use sentence case on Space Grotesk subtitles, labels, or pill text.
- Don't introduce a 10th accent color. The nine candy colors are the closed palette.
- Don't apply shadows to decorative floating pills. Shadows are for content-bearing containers only.

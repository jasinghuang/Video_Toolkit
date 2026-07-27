# Neo-Grid Bold — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/neo-grid-bold/
**Tone:** Confident, bold, minimal, editorial-graphic
**Formality:** Medium

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Putty surface | `#ECECE8` | `--surface` | Slide background behind the 40px frame |
| Paper panel | `#F5F4EF` | `--surface-2` | Default card/panel fill (warm ecru) |
| Ink panel | `#0A0A0A` | `--surface-alt` | Inverted panel fill (near-black) |
| Primary text | `#0A0A0A` | `--text` | Headlines on paper and lemon surfaces |
| Accent yellow | `#E6FF3D` | `--accent` | Neon yellow — panel fill, marks, charts only; never text |
| Text on ink | `#F5F4EF` | `--text-on-alt` | Headlines on `.surface-alt` |
| Muted text | `#8A8A85` | `--text-mute` | Labels and de-emphasised text |

**Rule:** Never introduce a second accent color. Neon yellow is the only chromatic accent. The accent is too light to read as type — use it as a fill only.

## Typography

- **Display (Latin):** Space Grotesk, weight 700, uppercase, negative letter-spacing (-0.01 to -0.05em). Use `.display` for English headlines.
- **Display (Chinese):** Noto Sans SC, weight 900, letter-spacing 0. Use `.display-cn`.
- **Body:** Space Grotesk, weight 400, mixed case. Use `.body`.
- **Chrome (labels/meta):** JetBrains Mono, uppercase, 0.08-0.12em tracking. Use `.label` for kickers, `.meta` for footnotes.
- **Stat numerals:** Space Grotesk 700 uppercase, accent color.

**Key technique:** The `<mark>` element wraps one or more words in a neon-yellow swatch — the system's headline emphasis mechanism. The `<em>` element switches to accent color (upright, no italic).

## Surface System

- **Putty (`--surface`, default):** The slide background, visible as the 40px frame around every composition.
- **Paper (`--surface-2`):** Default panel fill. When in doubt, a panel is paper.
- **Ink (`--surface-alt`):** Apply `.surface-alt` to a step root for full black surface with paper text.
- **Lemon (extension):** Apply `.card-lemon` for neon-yellow panels — the loudest signal. Use sparingly (1-3 per slide).

## Decorative Vocabulary

- **Blockmark:** 2x2 diagonal stamp (`.blockmark`) — three solid squares, one transparent. A structural identity mark.
- **Highlight mark:** Inline `<mark>` or `<span class="highlight-mark">` for yellow swatch emphasis inside headlines.
- **Em-dash bullets:** Lists use `.bullet-list` with em-dash markers in accent color.
- **Page number:** `.pagenum` with three background variants (paper/ink/lemon).

## Animation

Punchy and immediate:
- Base reveal: 500ms
- Slide: 800ms
- Ease: `--ease-quart` for clean deceleration

## Anti-Patterns

- Don't use lowercase on display headlines. Space Grotesk display is always uppercase.
- Don't use the yellow as a text color. Fill only.
- Don't round any corner. Border-radius: 0 on everything structural.
- Don't add drop shadows or gradients. Depth is color adjacency only.
- Don't introduce a second accent color. Yellow is the only accent.

# Monochrome (Ivory Ledger) — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/monochrome/
**Tone:** Restrained, literary, archival, honest
**Formality:** High

## Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|-------------|-------|
| Ivory cream | `#FAFADF` | `--surface` | Default step background |
| Deeper cream | `#F2F2D2` | `--surface-2` | Card/inset surface |
| Warm cream | `#F5F0E4` | `--surface-warm` | Alternative warm cream for insights |
| Ink black | `#1A1A16` | `--text`, `--accent`, `--rule` | Every text element, divider — the only color |
| Graphite | `#5E5E54` | `--text-2` | Secondary text |
| Light graphite | `#8A8A80` | `--text-mute` | Muted text |

**Rule:** There is no chromatic accent. "Accent" simply means "darker ink." Every color is a cream or graphite tone.

## Typography

- **Display (Latin):** Jost, weight 200 (hero) or 300 (headlines). Ultra-light geometric sans. Use `.display`.
- **Display (Chinese):** Noto Sans SC, weight 200-300.
- **Body:** Jost, weight 300, generous line-height (1.65-1.7). Use `.body`.
- **Serif:** Lora, weight 400, italic for quotes and insight card titles. Use `.quote`, `.serif` or `.insight-title`.
- **Chrome:** JetBrains Mono, weight 400, uppercase, 0.12em tracking. Use `.label`.

**Key signatures:**
- Weight 200-300 is the system's voice — maximum lightness and air.
- Negative letter-spacing on display (-0.02em), zero on body.
- The serif italic quote is the only focal emphasis mechanism.

## Surface System

- **Ivory (`--surface`, default):** Light cream for most content slides.
- **Warm cream (`--surface-warm`):** Apply class `.surface-warm` for insight card or timeline slides — slightly warmer tone.
- **Deeper cream (`--surface-2`):** Use for card panels and inset regions.

## Decorative Vocabulary

- **Ink rules:** 36px short rules (`.divider`) are the primary structural separator. Full-width variant available (`.divider.full`).
- **Em-dash bullets:** Lists use `.bullet-list` with em-dash markers in muted graphite.
- **Timeline dots:** 8px ink circles with cream border on timeline tracks.
- **No decorative patterns, no illustrations, no icons.** The system runs on typography, line, and white space alone.

## Animation

Slow and readerly:
- Base reveal: 700ms
- Slide transition: 900ms
- Easing: `--ease-quart` for smooth deceleration

## Anti-Patterns

- Don't introduce any chromatic color. No red, blue, yellow, or green — ink only.
- Don't use weights above 400 for Jost. The system is ultra-light.
- Don't use uppercase Jost body text. Body is sentence-case weight 300.
- Don't add drop shadows, gradients, or decorative patterns.
- Don't use thick rules (>1px).
- Don't add icons, emoji, or illustrations.
- Don't use italic for body text — italic is reserved for Lora quotes only.

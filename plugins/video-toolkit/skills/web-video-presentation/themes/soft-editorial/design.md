# Soft Editorial — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/soft-editorial/
**Tone:** Literary, elegant, quiet, warm-classical, editorial
**Formality:** High

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Paper (cream) | `#F2EEDF` | `--surface` | Universal slide background — warm aged cream |
| Ink | `#2A241B` | `--text` | Primary text color on every surface |
| Ink soft | `#5C5345` | `--text-2` | Secondary text — captions, descriptions |
| Dusty pink | `#E1A4C2` | `--accent` | Most-used accent fill; closer full-bleed |
| Chartreuse lemon | `#D6DD63` | `--accent-lemon` | Brightest accent; action bars, "yes" pills |
| Soft peach blush | `#E8C9B6` | `--accent-blush` | Most neutral pastel; step cards, "partial" pills |
| Sage green | `#B7C7A8` | `--accent-sage` | Extra accent for variety in larger grids |
| Lilac | `#C9BEDC` | `--accent-lilac` | Cool counterpart to sage; 5-step process flows |
| Card fill | `rgba(255,255,255,0.55)` | (transparent) | Translucent white default card background |

**Rule:** Pastels are interchangeable with no fixed semantic meaning (except the matrix convention: lemon=yes, blush=partial, pink=no). Text stays `#2A241B` on every pastel surface — never inverted to white.

## Typography

- **Display / Headline / Numeral / Quote:** Cormorant Garamond at weight 500, mixed roman + italic. Negative letter-spacing (-0.01 to -0.02em) at largest sizes.
- **Emphasis:** `<em>` within headlines drops to weight 400 italic — the gentle `weight drop` is the system's primary typographic signal.
- **Body only:** Work Sans at weight 400, 24–26px. Never carries a headline.
- **Kickers / Markers / Page numerals / Footers:** Always italic Cormorant Garamond at 26–38px in ink-soft.
- **Step ordinals:** Lowercase italic Roman numerals (i., ii., iii.) in Cormorant Garamond italic — never arabic, never uppercase.
- **CJK:** LXGW WenKai for display (kaiti matching Cormorant's literary register), Noto Serif SC for body. No italic in CJK — substitute ink-soft color shift.
- **No monospace in this system.** Every label is sans (Work Sans) or italic serif (Cormorant Garamond).

## Decoration Vocabulary

- **Soft card (default):** Translucent white at rgba(255,255,255,0.55) with 24–36px border-radius. Deep from translucency, not shadow.
- **Color card:** Saturated pastel fill (pink, lemon, blush, sage, lilac) with 22–36px radius. Text stays ink — never inverted.
- **Status pill:** 999px radius. Pastel-filled (lemon=yes, blush=partial, pink=no) or translucent white with ink border (note).
- **Cover swatch dots:** 3–5 circular 56px discs in accent palette, positioned top-right of cover. The system's visual identity mark.
- **Drop cap:** 132px Cormorant Garamond medium first letter, floated left at the start of opener paragraphs — padding: 8px 14px 0 0.
- **Action bar:** Full-width lemon-filled rounded card (24px radius) near top — label separator + serif headline.
- **Italic step numeral:** i., ii., iii. in Cormorant Garamond italic at 64–92px, top of step cards.
- **Quote mark:** 220px italic Cormorant Garamond `"` in blush, centered above pull-quote.
- **Legend bar:** 28×12px rounded-end bar in chart accent color, paired with label.

## Animation Guidance

- Slide navigation via deck-stage.js — arrow keys, space, PgUp/PgDn, Home/End.
- Fixed 1920×1080 canvas — no viewport-relative units.
- No hover states defined.
- Print: deck-stage handles per-slide rendering.

## Anti-Patterns

- No pastel slides fill backgrounds — pastels are card fills only (exception: full-bleed closer slide).
- No inverted text to white on pastel cards.
- No square corners. Minimum radius is 14px; cards live at 22–36px.
- No drop shadows. Depth from translucency and form.
- No third typeface. Cormorant Garamond + Work Sans only.
- No bold inside body — use italic serif or a light strong tag for emphasis.
- No kickers, markers, or footers in roman serif — always italic.
- No uppercase outside the 11px swatch-label. Sentence case throughout.
- No monospace. None.
- No crowding cards edge-to-edge. The cream field and 28–36px gaps are load-bearing.

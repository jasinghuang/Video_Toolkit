# Grove — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/grove/
**Tone:** Organic, considered, warm, literary, natural
**Formality:** Medium-high

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Deep forest green | `#192B1B` | `--surface` | Default dark canvas |
| BG alt | `#1E3221` | `--surface-2` | Slightly lighter green for secondary surfaces |
| Parchment | `#E8E4D6` | `--surface-alt` | Warm parchment — light slide background |
| Warm cream | `#D4CFBF` | `--text` | Primary text on dark — never pure white |
| Muted cream | `rgba(212,207,191,0.60)` | `--text-2` | Secondary / muted text on dark |
| FG light | `#192B1B` | `--text-on-alt` | Forest green text on light (same hex as bg!) |
| Accent | `#C8524A` | `--accent` | Terracotta coral — the single warm note |
| Border | `rgba(212,207,191,0.12)` | `--rule` | Hairline divider on dark |
| Border light | `rgba(25,43,27,0.14)` | `--rule-on-alt` | Hairline divider on light |

**Rule:** Minimal palette. Dark forest / light parchment / terracotta coral triad is the entire color vocabulary. Accent is used only for italic emphasis, kicker, 36px rule, em-dash bullet, stat figure, quote mark, chapter ordinal.

## Typography

- **Display / Serif (Latin):** Playfair Display, weight 400 ONLY (never bold!). For every headline, quote, stat figure, watermark numeral. Italic `<em>` in accent coral is the signature Grove accent.
- **Display / Serif (Chinese):** LXGW WenKai TC, weight 400.
- **Body (Latin):** Jost, weight 300 ONLY. For every paragraph and bullet body. The light weight is the "good paper" feel.
- **Body (Chinese):** Noto Serif SC, weight 300-400.
- **Chrome (Latin):** JetBrains Mono, weight 300 ONLY. Uppercase with at least 0.12em letter-spacing. For labels, kickers, footlines, counters, stat captions.
- **Chrome (Chinese):** Noto Sans Mono CJK SC, weight 300.

**Key technique:** The four-face stack with single-weight commitment (400 / 300 / 300 / 300). Bold serif is explicitly forbidden. The italic-coral `<em>` is the system's most iconic move.

## Decoration Vocabulary

### 1px Hairline Borders
Universal structural rhythm. Chrome bar borders, stat-card bottoms, compare-panel separators, section dividers. Never thicker than 1px.

### Coral Rule
A 36px-wide by 1px-tall terracotta coral horizontal rule. The compositional beat between a kicker and a headline.

### Kicker
JetBrains Mono uppercase label in coral, placed above an h1/h2 headline. Always paired with a coral rule below.

### Em-Dash Bullet
Two-column grid (2em / 1fr) where the bullet column is a coral em-dash rendered in JetBrains Mono. The system's only bullet language.

### Watermark Numeral
Massive Playfair digit at 18vw / 6% opacity, positioned absolutely at bottom-right. Compositional texture, never UI.

### Quote Mark
Massive Playfair opening-quote glyph at 8vw in coral, above the italic quote body. Always present on quote slides.

### Chrome Bars
Slide-chrome (top) and slide-foot (bottom): flex space-between rows of mono labels separated by 1px hairline borders. Hidden on cover/chapter/quote/end slides.

### Stat Card
Vertical stack: large Playfair coral value (4.5vw) on top, mono uppercase label beneath, 1px border-bottom hairline. No background fill.

## Animation

- Slide transition: 0.9s cubic-bezier(0.77, 0, 0.175, 1) with horizontal translate.
- Element entrance: staggered via `[data-anim]` + `[data-delay]` attributes (fade-up / fade-in / reveal-right / reveal-left / scale-in) at 0.7s with delays 0 / 0.08s / 0.18s / 0.3s / 0.44s / 0.6s / 0.78s.
- Entrance curve: cubic-bezier(0.16, 1, 0.3, 1).

## Anti-Patterns

- Don't use bold serif. Playfair weight 700 is not in this system.
- Don't introduce a fourth typeface. Playfair / Jost / JetBrains Mono / Noto SC is the stack.
- Don't use coral as a surface fill or for body paragraphs. Coral is the accent voice only.
- Don't use box-shadow, gradient, blur, or any rgba shadow. The system is flat.
- Don't use thick borders (2px+). The 1px hairline is the structural rhythm.
- Don't round any corners. Only round shape is the 5px nav-dot.
- Don't use round bullets, hyphens, or asterisks. The em-dash in coral is the only bullet.
- Don't put a kicker without a coral rule below it.
- Don't render mono text in sentence case or without letter-spacing.
- Don't omit slide-chrome and slide-foot on content slides.

# Vellum — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/vellum/
**Tone:** Scholarly, literary, considered, quiet, intellectual
**Formality:** High

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| Shell (letterbox) | `#1A2550` | `--shell` | Stage letterbox depth, darker than surface |
| Primary surface | `#2A3870` | `--surface` | Every slide — single monochromatic deep periwinkle navy |
| Surface lifted | `#343F80` | `--surface-2` | Cards / panel differentiation |
| Alternate surface | `#2A3870` | `--surface-alt` | Same — system has no alternate surface (no-op) |
| Primary text | `#E8D85C` | `--text` | Warm chartreuse-yellow type on navy |
| Secondary text | `rgba(232,216,92,0.62)` | `--text-2` | Lead paragraphs, descriptions |
| Muted text | `rgba(232,216,92,0.32)` | `--text-mute` | Captions, tertiary labels |
| Faint text | `rgba(232,216,92,0.15)` | `--text-faint` | Metadata, footnotes |
| Emphasis text | `#F5E168` | `--emphasis-text` | Brighter yellow for `<em>` in headlines (roman/weight 600) |
| Accent | `#3A7878` | `--accent` | Dusty teal — pin-notes, kickers, quote marks, list counters, 28px rule |
| Border | `rgba(232,216,92,0.20)` | `--rule` | 1px hairline — chrome bars, stat dividers |

**Rule:** Never use a second background color. Every slide is the same navy field. No light theme, no inversion. The only non-yellow visible colour is dusty teal, and it appears only in small annotation contexts.

## Typography

- **Display (Latin):** Cormorant Garamond italic, 400 weight. Use `.display` for English headlines. Italic is **structural**, not decorative — every headline defaults to italic.
- **Display (Chinese):** LXGW WenKai TC (kaiti), 400 weight. Use `.display-cn` for Chinese headlines. No italic axis — kaiti's hand-drawn warmth substitutes.
- **Body:** DM Sans, 400 weight. Use `.body` for paragraph text and `.body-sm` for captions.
- **Mono:** Courier Prime. Use `.label` for kickers/chrome, `.meta` for footnotes, `.tag` for badges, `.pin-note` for the bottom-left annotation voice.

**Key technique — italic-to-roman emphasis:** Inside any italic headline (`.display`, `.h1`, `.h2`), wrap emphasized words in `<em>` or `<i>`: they render as upright roman at weight 600 in `--emphasis-text` (brighter yellow `#F5E168`). This is the opposite of conventional italic-for-emphasis; here, italic is the default and roman carries the emphasis signal. Use once per headline, never on every word.

## Single-Surface Constraint

Vellum has **no alternate surface**. Every slide uses the same deep periwinkle navy (`--surface`). There is no `.surface-alt` split, no color inversion, no light theme. The design achieves rhythm through typographic contrast (italic serif vs sans vs mono, three yellow-opacity tiers) and the persistent teal pin-annotation rather than background changes.

```tsx
// Every slide — same surface, no class needed for background
<div className="scene-pad stack">
  <h1 className="display">The Argument</h1>
</div>
```

**Rule:** All steps use the same uniform background. Contrast and rhythm come from typography, opacity hierarchy, and the teal accent elements (kicker, pin-note, list counters). Do not attempt to introduce a second surface colour.

## Spacing Rhythm

Base unit: 8px. All gaps use CSS vars:
- `--space-md` (16px): default stack/row gap
- `--space-lg` (24px): card padding
- `--space-xl` (48px): section breaks
- `--stage-pad-x: 6vw; --stage-pad-y: 6vh`: stage padding (generous, viewport-relative)

Vellum uses generous viewport-relative padding (6vw/6vh) because the navy field around centered content is structural — it is the "wall" on which content is pinned. Padding scales fluidly with viewport. Quote slides typically use 1.2x pad-y and 1.4x pad-x for extra breathing room around centered pull-quotes.

**Rule:** Content should never fill more than ~70% width or ~60% height. The empty navy field is intentional breathing room, not wasted space.

## Decorative Vocabulary

### Pin-Annotation (System Signature)

The pin-annotation is a stack of 1-3 Courier Prime mono lines in dusty teal (`--accent`, `#3A7878`), positioned absolute at the bottom-left of every slide. It holds a slide counter (e.g., "03 / 09") plus one or two short pin-note phrases. Use `.pin-note` for the text style (Courier Prime 500, 1.15vw, teal, 0.01em tracking). The pin-annotation is non-negotiable — every slide carries one.

### Kicker

Use `<span className="kicker">` for a small Courier Prime teal label above headlines. Label size (0.72vw), uppercase, 0.1em letter-spacing, teal colour. Substituting any other face or colour breaks the annotation register.

### 28px Teal Rule

Use `<hr className="rule" />` for a 28px-wide 1px teal accent line. Vellum's subtle decorative separator. Place between kicker and headline, or above a stat group.

### Teal Quote-Mark Glyph

Use `<span className="quote-mark">"</span>` for a 7vw italic Cormorant Garamond opening quote glyph in dusty teal. Centered above a pull-quote. The teal quote-mark is the system's only large-scale graphic accent.

### Numbered Lists (No Dots or Dashes)

Lists use `.bullet-list` — CSS counters render numbers in Courier Prime mono at label size in teal. The list item has a 2em grid column for the number and 0.5em gap to body text. Never use bullet dots, em-dashes, or other markers.

### Chrome Bars

Use `.chrome-top` (hairline rule beneath) and `.chrome-bottom` (hairline rule above) for structural framing. Typically carry `.label` on each side (subject left, counter right). Chromeless layouts (cover, statement, quote, end) omit these.

### Stat Card

Use `.stat-card` for centered stat tiles in a row. Each tile: italic serif numeral (5.5vw Cormorant Garamond italic) above a mono label in muted yellow. Tiles separated by single 1px hairlines at 20% yellow opacity; the last tile drops the border.

## Animation

Vellum is **intentionally still**. All CSS animation durations are set to `0s`:
- Slide transitions: 0s
- Entrance reveals: 0s
- All easing functions are defined but unused

The deck uses instant cuts between slides. There are no fade-ins, slide-ins, or motion effects of any kind. Do not override durations to add motion — motionlessness is a deliberate design register (essays on a wall are still).

## Anti-Patterns

- Don't introduce a second background colour. The navy field is the single surface across every slide. No `.surface-alt` split.
- Don't render headlines in upright roman. Italic at display scale is the system's identity. Roman appears only as the `<em>` emphasis mechanism.
- Don't use yellow on the quote-mark glyph, kicker, or pin-notes. Those moments are teal.
- Don't use bullet dots or em-dashes. Lists are numbered with teal Courier Prime counters.
- Don't add drop shadows, rounded corners, or gradients. The system is severely flat — no shadows, no border-radius, no gradients.
- Don't omit the pin-annotation. Every slide carries it.
- Don't introduce a fourth typeface. The three families (Cormorant Garamond italic, DM Sans, Courier Prime) are the entire stack.
- Don't use italic at body scale. Italic serif is for display/headline/quote sizes only; body stays upright sans.
- Don't motion the slides. Zero-duration is the deliberate register.
- Don't crowd slides edge-to-edge. The empty navy field is structural — sparse centred content is the format.
- Don't use a separate grey for muted text. Muting is done via yellow opacity tiers only.
- Don't use dashed borders except on image placeholders.

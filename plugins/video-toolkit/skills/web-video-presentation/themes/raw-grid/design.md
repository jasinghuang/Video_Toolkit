# Raw Grid — Design System for Chapter Agents

**Source:** beautiful-html-templates/templates/raw-grid/
**Tone:** Raw, punchy, energetic, confident, graphic
**Formality:** Medium-low

## Palette

| Role | Hex / Value | CSS Variable | Usage |
|------|-------------|-------------|-------|
| White | `#FFFFFF` | `--surface` | Canvas — default slide background |
| Black | `#0A0A0A` | `--text` / `--rule` | All borders, headlines, body text, label fills, shadows |
| Blush pink | `#F2D4CF` | `--accent` | Warm accent surface — region fills, bar fills |
| Sage green | `#E5EDD6` | `--accent-2` | Cool accent surface — region fills, bar fills |
| Gray | `#F5F5F5` | `--surface-2` | Neutral fill — zebra-stripe rows, tertiary cards |

**Rule:** Pink and green are interchangeable — neither has semantic meaning. Pair them for warm/cool balance. Text is never inverted on pastel surfaces (black text works on pink/green).

## Typography

- **All type:** Native system sans-serif stack (`Segoe UI, system-ui, -apple-system, Helvetica, Arial, sans-serif`). No web fonts.
- **Display / Headline / Title:** Weight 900 uppercase with negative tracking (-0.01 to -0.04em). Never sentence-case.
- **Subtitle:** Weight 700 uppercase, 0.04em tracking.
- **Body:** Weight 500 sentence-case only. Never uppercase.
- **Caption / Label:** Weight 700–800 uppercase, 0.06–0.08em tracking.
- **CJK:** Noto Sans SC appended after the Latin stack. No negative tracking on CJK — set letter-spacing to 0.

## Decoration Vocabulary

- **3px solid black borders:** On every structural division. Borders ARE the layout — regions meet at borders, not gaps.
- **Hard offset shadows:** `6px 6px 0 black` (default) or `4px 4px 0 black` (small). Zero blur, solid black only.
- **Black label pills:** Universal section tag — black background, white uppercase 11px text at weight 800, 6px 14px padding.
- **Arrow prefix:** `→ + nbsp` via ::before on CTAs and interactive list items.
- **Decorative wallpaper numerals:** Oversized weight-900 numerals at 0.15–0.35 opacity behind content in cards.
- **Icon box:** 48px white square with 3px black border, 1–3 character glyph.
- **Connector node:** 32px black square with white arrow glyph, positioned between timeline steps.
- **Bar track:** 32px-tall bordered rectangle with fill in pink, green, or black.

## Animation Guidance

- Slide transition: display: none/block toggle via JS. No fade.
- Navigation: arrow keys, space, Home (first), End (last).
- Hover states on list items and table rows: background shifts to sage green with 0.15s transition.
- Touch swipe (vertical) on mobile.

## Anti-Patterns

- No web fonts. System stack only.
- No rounded corners — everything is a strict rectangle or circle (donut chart only).
- No blurred shadows. `0 4px 12px rgba()` does not exist here.
- No colored borders — all borders are black.
- No intermediate font weights (400, 600). Ladder is 500 / 700 / 800 / 900.
- No italic or underline. Weight contrast is the only emphasis.
- No display text in sentence case — uppercase is non-negotiable.
- No third accent surface color. Pink and green are the only accent surfaces.
- No gap properties between border-divided regions.

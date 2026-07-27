# BHT Theme Migration — Replace WVP Theme System with beautiful-html-templates Design Systems

> **For agentic workers:** Each task is independently implementable and testable. Tasks in the same phase can run in parallel where noted. Checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace WVP's current "25 CSS token" theme system with full design-system themes derived from beautiful-html-templates (BHT). Visual output must match BHT quality. All 23 old themes deleted.

**Architecture:** Each theme becomes a complete CSS design system (300-600 lines), not just color variables. A semantic class contract (12 MUST classes) bridges theme CSS and chapter React components. `base.css` slims from 415 lines to 194, keeping only stage framework + layout primitives. Chapters use theme-provided semantic classes instead of writing all CSS from scratch.

**Working directory:** All WVP file paths in this plan are relative to `plugins/video-toolkit/skills/web-video-presentation/`. BHT source paths (`beautiful-html-templates/`) are relative to the repository root. Tasks that read BHT sources must switch to the repo root first; tasks that modify WVP files must switch to the WVP skill directory. Each task's steps include explicit `cd` commands where needed.

**Tech Stack:** CSS custom properties, Vite + React + TypeScript (unchanged), BHT template.html as design source

## Global Constraints

- Visual output must match BHT template quality — color accuracy, typography fidelity, decoration preservation
- All 23 old WVP themes deleted — no backwards compatibility required
- `scaffold.sh --theme=<id>` interface preserved — only the target directory structure changes
- `CHAPTER-CRAFT.md` methodology preserved (step-driven, dual-source, progressive reveal) — only the "how to style" guidance changes
- `narrations.ts` contract unchanged — audio pipeline untouched
- Chapter code physical isolation preserved — one folder per chapter, private CSS prefix
- TypeScript compilation must pass (`npx tsc --noEmit`) after every task that touches source files
- Each theme MUST provide 12 semantic CSS classes (the contract)

---

## File Map

### New files

| File | Responsibility |
|------|---------------|
| `references/SEMANTIC-CLASSES.md` | The 12-class contract: what each class is, CSS properties themes must set, usage examples for chapter agents |
| `themes/signal/theme.json` | Metadata for Signal theme (from BHT `templates/signal/template.json`) |
| `themes/signal/theme.css` | Full CSS design system: `:root` vars + 12 MUST classes + theme-specific extras |
| `themes/signal/design.md` | Design intent doc for chapter agents (from BHT `templates/signal/design.md`, adapted for WVP chapter context) |
| `themes/cartesian/` | Same structure for Cartesian |
| `themes/studio/` | Same structure for Studio |
| `themes/broadside/` | Same structure for Broadside |
| `themes/block-frame/` | Same structure for Block-frame |
| `themes/<slug>/` | ~8 more BHT templates translated to WVP themes |

### Modified files

| File | Change |
|------|--------|
| `templates/src/styles/base.css` | Slim from ~416 to ~200 lines. Remove primitive classes. Keep: reset, body defaults, CSS var defaults, stage chrome, layout primitives, state helpers. |
| `templates/src/App.tsx:2` | `import "./styles/tokens.css"` → `import "./styles/theme.css"` |
| `templates/src/styles/fonts.css` | Add Google Fonts needed by BHT themes (Archivo, Barlow, Clash Display, Syne, etc.) |
| `scripts/scaffold.sh:69,126` | Rename `THEME_TOKENS` variable; copy `theme.css` not `tokens.css`; update help text |
| `references/CHAPTER-CRAFT.md:133-177` | Rewrite "代码层最小约束" section |
| `references/CHAPTER-CRAFT.md:200-224` | Update "完工自检" checklist |
| `references/THEMES.md` | Full rewrite: document new theme structure, BHT-derived theme catalog, semantic class contract reference |
| `SKILL.md:112-120,174-175,239-243,444-450` | Update file-reading guide, Checkpoint Plan, scaffold examples, resource table |

### Deleted files

`themes/bauhaus-bold/` through `themes/warm-keynote/` (all 23 old WVP theme directories) and `templates/src/styles/tokens.css`.

---

## Semantic Class Contract

Every theme MUST provide these 12 CSS classes. Chapter agents rely on these names regardless of which theme is active. Each theme styles them differently — that's the point — but the class names are the invariant bridge.

### MUST classes (12)

| Class | Purpose | Minimum CSS properties |
|-------|---------|----------------------|
| `.display` | Hero headline (Latin) | `font-family: var(--font-display-en); font-size: var(--t-display); line-height: 0.95;` |
| `.display-cn` | Hero headline (Chinese) | `font-family: var(--font-display-cn); font-size: var(--t-display); font-weight: 700; line-height: 1.05;` |
| `.body` | Body/paragraph | `font-family: var(--font-body); font-size: var(--t-body); line-height: 1.6; color: var(--text-2);` |
| `.body-sm` | Caption, secondary | `font-family: var(--font-body); font-size: var(--t-caption); line-height: 1.5; color: var(--text-mute);` |
| `.label` | Uppercase label/kicker | `font-family: var(--font-mono); font-size: var(--t-micro); text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-mute);` |
| `.stat-value` | Large stat/number | `font-family: var(--font-display-en); font-size: var(--t-h1); font-weight: 700; line-height: 1; font-variant-numeric: tabular-nums;` |
| `.stat-label` | Stat description | `font-family: var(--font-body); font-size: var(--t-caption); color: var(--text-mute);` |
| `.card` | Card container | `background: var(--surface-2); border-radius: var(--r-card); padding: var(--space-lg); box-shadow: var(--card-shadow, none);` |
| `.divider` | Horizontal rule | `width: 100%; height: 1px; background: var(--rule); border: 0; margin: var(--space-md) 0;` |
| `.quote` | Pull quote | `border-left: 3px solid var(--accent); padding-left: var(--space-lg); font-family: var(--font-display-en); font-style: italic; font-size: var(--t-h3); line-height: 1.4;` |
| `.tag` | Badge/pill | `display: inline-flex; padding: 2px 10px; border-radius: 999px; font-family: var(--font-mono); font-size: var(--t-micro); text-transform: uppercase; letter-spacing: 0.1em; background: var(--accent-soft); color: var(--accent);` |
| `.meta` | Metadata/footnote | `font-family: var(--font-mono); font-size: var(--t-micro); color: var(--text-faint);` |

### CSS custom properties themes MUST define

Consumed by base.css (stage chrome, body defaults, layout primitives) and by the MUST classes above:

```
--shell, --surface, --surface-2, --surface-3
--text, --text-2, --text-mute, --text-faint
--rule, --accent, --accent-soft, --accent-glow
--font-display-en, --font-display-cn, --font-body, --font-mono
--font-features
--t-display, --t-h1, --t-h2, --t-h3, --t-body, --t-caption, --t-micro
--space-unit, --space-xs, --space-sm, --space-md, --space-lg, --space-xl, --space-2xl
--r-card
--shadow-stage, --card-shadow
--stage-pad-x, --stage-pad-y
```

### CSS custom properties themes MAY define (decoration layer)

```
--surface-pattern, --surface-pattern-size, --surface-pattern-blend, --surface-pattern-opacity
--surface-vignette
--text-shadow
--stage-border
--surface-alt, --text-on-alt, --rule-on-alt  (dual-surface themes)
```

### Layout primitives (in base.css, consume theme vars)

| Class | Definition |
|-------|-----------|
| `.scene-pad` | `position: absolute; inset: 0; padding: var(--stage-pad-y) var(--stage-pad-x); display: flex; flex-direction: column;` |
| `.stack` | `display: flex; flex-direction: column; gap: var(--space-md);` |
| `.row` | `display: flex; flex-direction: row; gap: var(--space-md);` |
| `.grid-2` | `display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg);` |
| `.grid-3` | `display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-lg);` |
| `.center` | `display: grid; place-items: center;` |
| `.fill` | `flex: 1;` |

---

## Tasks

### Phase 0 — Contract Definition

#### Task 1: Write SEMANTIC-CLASSES.md

**Files:**
- Create: `references/SEMANTIC-CLASSES.md`

**Interfaces:**
- Produces: The canonical 12-class contract consumed by all theme translation tasks (Tasks 6-14) and referenced by CHAPTER-CRAFT.md (Task 16)

Write the file that defines the invariant contract. This is the single source of truth that both theme authors and chapter agents reference. Content:

```markdown
# Semantic Class Contract

The 12 CSS classes every WVP theme MUST provide. Chapter agents write
`<div className="display">...</div>` and the active theme's `theme.css`
handles the visual rendering specific to that theme's design system.

## Why a contract?

Before the BHT migration, chapters wrote most CSS themselves. The theme
only provided color and font variables via `tokens.css`. Now the theme
provides finished component styles — chapters compose layouts from these
building blocks instead of writing CSS from scratch.

## MUST classes (12)

### `.display` — Hero headline (Latin)

The main visual statement of a step. Typically the largest text on screen.

```
font-family: var(--font-display-en);
font-size: var(--t-display);
line-height: 0.95;
```

Chapter usage: `<h1 className="display">The Future of AI</h1>`

### `.display-cn` — Hero headline (Chinese)

Same role as `.display` but tuned for Chinese typography (heavier weight,
taller line-height, no italic).

```
font-family: var(--font-display-cn);
font-size: var(--t-display);
font-weight: 700;
line-height: 1.05;
```

Chapter usage: `<h1 className="display-cn">人工智能的未来</h1>`

### `.body` — Body / paragraph text

The workhorse text class. Used for explanations, descriptions, narration text on screen.

```
font-family: var(--font-body);
font-size: var(--t-body);
line-height: 1.6;
color: var(--text-2);
```

### `.body-sm` — Caption / secondary text

Smaller body variant for secondary information, image captions, source lines.

```
font-family: var(--font-body);
font-size: var(--t-caption);
line-height: 1.5;
color: var(--text-mute);
```

### `.label` — Uppercase label / kicker

Small mono label for section markers, category tags, "CHAPTER 01" style labels.

```
font-family: var(--font-mono);
font-size: var(--t-micro);
text-transform: uppercase;
letter-spacing: 0.15em;
color: var(--text-mute);
```

### `.stat-value` — Large stat / number

Big numbers with tabular-nums for consistent width. Used for metrics, data points, percentages.

```
font-family: var(--font-display-en);
font-size: var(--t-h1);
font-weight: 700;
line-height: 1;
font-variant-numeric: tabular-nums;
```

### `.stat-label` — Stat description

The label below a `.stat-value`.

```
font-family: var(--font-body);
font-size: var(--t-caption);
color: var(--text-mute);
```

### `.card` — Card container

A raised surface for grouping related content.

```
background: var(--surface-2);
border-radius: var(--r-card);
padding: var(--space-lg);
box-shadow: var(--card-shadow, none);
```

### `.divider` — Horizontal rule

A full-width separator line.

```
width: 100%;
height: 1px;
background: var(--rule);
border: 0;
margin: var(--space-md) 0;
```

### `.quote` — Pull quote / blockquote

An editorial quote with left accent border.

```
border-left: 3px solid var(--accent);
padding-left: var(--space-lg);
font-family: var(--font-display-en);
font-style: italic;
font-size: var(--t-h3);
line-height: 1.4;
```

### `.tag` — Badge / pill

Small inline label for categories, status, metadata.

```
display: inline-flex;
padding: 2px 10px;
border-radius: 999px;
font-family: var(--font-mono);
font-size: var(--t-micro);
text-transform: uppercase;
letter-spacing: 0.1em;
background: var(--accent-soft);
color: var(--accent);
```

### `.meta` — Metadata / footnote

Smallest text tier for footnotes, sources, timestamps.

```
font-family: var(--font-mono);
font-size: var(--t-micro);
color: var(--text-faint);
```

## What chapters still write themselves

Chapter-specific CSS that is NOT covered by the contract — chapters own these:

- **Animation keyframes** — unique to each chapter's content-driven reveals
- **Custom layout for a specific visual demonstration** — CSS Grid / absolute
  positioning for a unique diagram or interactive element
- **Chapter-specific decorative elements** — a particular SVG shape, a gradient
  overlay, a custom border effect that is not part of the theme's design vocabulary
- **Animation timing and easing** — duration, delay, easing per step

## What chapters MUST NOT write

- Hardcoded colors (hex, rgb, color names) — use theme CSS vars
- Hardcoded font-family declarations — use theme CSS vars or MUST classes
- Reinventing `.card` / `.divider` / `.tag` — use the contract classes
- Overriding theme CSS vars in chapter CSS files
```

- [ ] **Step 1: Write the file**

Write the content shown above to `references/SEMANTIC-CLASSES.md`.

- [ ] **Step 2: Commit**

```bash
git add references/SEMANTIC-CLASSES.md
git commit -m "docs: add semantic class contract for BHT theme migration"
```

---

### Phase 1 — Foundation (parallel-safe: Tasks 2-5)

#### Task 2: Rewrite base.css

**Files:**
- Modify: `templates/src/styles/base.css` (rewrite entire file)

**Interfaces:**
- Consumes: CSS custom properties defined by themes in `theme.css` (see contract above)
- Produces: Slim stage framework consumed by every scaffolded project

Replace the 415-line `base.css` with a 194-line version that removes all primitive classes (`.hero-num`, `.card`, `.rule`, `.serif-cn`, `.serif-it`, `.display-en`, `.mono`, `.kicker`, `.label-mono`, `.dot-accent`, `.corner-mark`, `.click-cue`, `.badge-mono`, `.pull-quote`, `.masthead`, `.tr-rule`, `.card-glass`) and keeps only the stage framework, layout primitives, and state helpers.

- [ ] **Step 1: Write the new base.css**

Write the following content to `templates/src/styles/base.css`:

```css
/* ======================================================================
 * base.css — stage framework for the web-video-presentation skill.
 *
 * Ownership split (post BHT migration):
 *   • Themes (themes/<id>/theme.css) own the COMPLETE visual system:
 *     CSS custom properties + 12 MUST semantic classes + decorations.
 *   • This file owns the STAGE FRAMEWORK only:
 *     reset, body defaults, 16:9 stage chrome, layout primitives,
 *     state helpers. It consumes theme vars but defines no visual
 *     personality.
 *   • Chapters compose layouts from MUST classes + layout primitives,
 *     writing custom CSS only for animation keyframes and unique
 *     visual demonstrations.
 *
 * Themes MUST define the CSS custom properties listed in
 * references/SEMANTIC-CLASSES.md. This file provides fallback defaults
 * so the page doesn't break before a theme loads.
 * ====================================================================== */

/* ─── 0. Reset ─── */
*, *::before, *::after { box-sizing: border-box; }
html, body, #root { margin: 0; padding: 0; height: 100%; overflow: hidden; }
img, svg, video { display: block; max-width: 100%; }
button { font: inherit; color: inherit; background: none; border: 0; padding: 0; }

/* ─── 1. Body defaults ─── */
body {
  font-family: var(--font-body, -apple-system, sans-serif);
  color: var(--text, #000);
  background: var(--shell, #000);
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
  text-wrap: pretty;
  font-feature-settings: var(--font-features, "tnum", "ss01");
  cursor: default;
}
::selection { background: var(--accent, #06f); color: var(--surface, #fff); }

/* ─── 2. CSS custom property defaults ──────
   Themes override these in theme.css. Defaults exist so the page
   renders something coherent before theme CSS loads. */
:root {
  /* Colors */
  --shell: #000;
  --surface: #fff;
  --surface-2: #f5f5f5;
  --surface-3: #eee;
  --text: #000;
  --text-2: #444;
  --text-mute: #888;
  --text-faint: #bbb;
  --rule: #ddd;
  --accent: #06f;
  --accent-soft: rgba(0,102,255,0.12);
  --accent-glow: rgba(0,102,255,0.45);

  /* Fonts */
  --font-display-en: Georgia, serif;
  --font-display-cn: "Noto Serif SC", serif;
  --font-body: -apple-system, sans-serif;
  --font-mono: ui-monospace, monospace;
  --font-features: "tnum", "ss01";

  /* Spacing scale */
  --space-unit: 8px;
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 48px;
  --space-2xl: 96px;

  /* Type scale */
  --t-display: clamp(80px, 9.5vw, 180px);
  --t-h1: clamp(48px, 5vw, 72px);
  --t-h2: clamp(32px, 3.6vw, 48px);
  --t-h3: clamp(24px, 2.5vw, 36px);
  --t-body: 20px;
  --t-caption: 14px;
  --t-micro: 12px;

  /* Radii */
  --r-none: 0;
  --r-sm: 4px;
  --r-md: 8px;
  --r-lg: 16px;
  --r-xl: 32px;
  --r-card: var(--r-md);

  /* Shadows */
  --shadow-stage: 0 60px 160px rgba(0,0,0,0.55);
  --card-shadow: none;
  --stage-border: none;

  /* Stage padding */
  --stage-pad-x: 96px;
  --stage-pad-y: 80px;

  /* Motion */
  --ease-quart: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-expo: cubic-bezier(0.86, 0, 0.07, 1);
  --ease-soft: cubic-bezier(0.4, 0, 0.1, 1);
  --ease-overshoot: cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-quick: 280ms;
  --dur-base: 600ms;
  --dur-slow: 900ms;
  --dur-cinematic: 1400ms;

  /* Decoration (no-op by default, themes enable selectively) */
  --surface-pattern: none;
  --surface-pattern-size: auto;
  --surface-pattern-blend: normal;
  --surface-pattern-opacity: 1;
  --surface-vignette: none;
  --text-shadow: none;
}

/* ─── 3. Stage chrome ──────
   The letterbox + 16:9 fitter + raw 1920x1080 frame. Chapters render
   inside .scene. */
.app-shell {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--shell);
}
.stage-fitter {
  position: relative;
  isolation: isolate;
}
.stage-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 1920px;
  height: 1080px;
  transform-origin: top left;
  background: var(--surface);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-stage);
  border: var(--stage-border, none);
  border-radius: 0;
}

/* Optional pattern overlay drawn ON the stage (screen recordings catch it) */
.stage-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: var(--surface-pattern, none);
  background-size: var(--surface-pattern-size, auto);
  mix-blend-mode: var(--surface-pattern-blend, normal);
  opacity: var(--surface-pattern-opacity, 1);
  z-index: 1;
}
/* Optional vignette overlay (cinematic edges, chalkboard corners) */
.stage-frame::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: var(--surface-vignette, none);
  z-index: 1;
}

/* Every chapter root sits above pattern/vignette layers */
.scene { position: absolute; inset: 0; z-index: 2; }

/* ─── 4. Layout primitives ──────
   Structural building blocks. Spacing comes from theme vars so density
   feels native to each design system. */
.scene-pad {
  position: absolute;
  inset: 0;
  padding: var(--stage-pad-y) var(--stage-pad-x);
  display: flex;
  flex-direction: column;
}
.stack { display: flex; flex-direction: column; gap: var(--space-md); }
.row   { display: flex; flex-direction: row; gap: var(--space-md); }
.fill  { flex: 1; }
.center { display: grid; place-items: center; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-lg); }

/* ─── 5. State helpers ─── */
.fade-in { animation: fade-in var(--dur-base) var(--ease-quart) both; }
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

- [ ] **Step 2: Verify old base.css is fully replaced**

```bash
wc -l templates/src/styles/base.css
# Expected: 194 lines (was 415)
```

- [ ] **Step 3: Commit**

```bash
git add templates/src/styles/base.css
git commit -m "refactor: slim base.css to stage framework only, remove primitive classes"
```

#### Task 3: Update App.tsx import chain

**Files:**
- Modify: `templates/src/App.tsx:2`

**Interfaces:**
- Consumes: `theme.css` at `src/styles/theme.css` (written by scaffold.sh)
- Produces: Import order that loads theme before base

- [ ] **Step 1: Change the import**

In `templates/src/App.tsx`, change line 2 from:

```tsx
import "./styles/tokens.css"; // active theme — generated by scaffold (see THEMES.md)
```

to:

```tsx
import "./styles/theme.css"; // active theme — generated by scaffold (see THEMES.md)
```

- [ ] **Step 2: Commit**

```bash
git add templates/src/App.tsx
git commit -m "refactor: import theme.css instead of tokens.css"
```

#### Task 4: Update scaffold.sh

**Files:**
- Modify: `scripts/scaffold.sh:69,126,194-243`

**Interfaces:**
- Consumes: `themes/<id>/theme.css` (new file structure)
- Produces: `src/styles/theme.css` in scaffolded project

- [ ] **Step 1: Rename variable and update copy command**

In `scripts/scaffold.sh`, change line 69 from:

```bash
THEME_TOKENS="$THEME_DIR/tokens.css"
```

to:

```bash
THEME_CSS="$THEME_DIR/theme.css"
```

Change the validation check on line 71 from:

```bash
if [[ ! -d "$THEME_DIR" || ! -f "$THEME_TOKENS" ]]; then
```

to:

```bash
if [[ ! -d "$THEME_DIR" || ! -f "$THEME_CSS" ]]; then
```

Change the copy command on line 126 from:

```bash
cp "$THEME_TOKENS"                          src/styles/tokens.css
```

to:

```bash
cp "$THEME_CSS"                             src/styles/theme.css
```

- [ ] **Step 2: Update help text**

Change the help text at lines 194-243 (the `cat <<EOF` block). Replace all references to `tokens.css` with `theme.css`:

- Line 207 area: `把 src/chapters/01-example/ 替换成你自己的章节` — keep
- Line 240-242: Replace:
  ```
  要换一个主题，覆盖 tokens.css 即可：
    cp $SKILL_DIR/themes/<id>/tokens.css src/styles/tokens.css
  ```
  with:
  ```
  要换一个主题，覆盖 theme.css 即可：
    cp $SKILL_DIR/themes/<id>/theme.css src/styles/theme.css
  ```

- [ ] **Step 3: Commit**

```bash
git add scripts/scaffold.sh
git commit -m "refactor: scaffold.sh copies theme.css instead of tokens.css"
```

#### Task 5: Update fonts.css for BHT fonts

**Files:**
- Modify: `templates/src/styles/fonts.css`

**Interfaces:**
- Produces: Google Fonts @import declarations covering all BHT-derived themes

- [ ] **Step 1: Add BHT-required fonts**

Read the current `templates/src/styles/fonts.css`. It already has many of the fonts needed (Inter, Noto Serif SC, Noto Sans SC, JetBrains Mono, Playfair Display, Fraunces, Source Serif 4, IBM Plex Mono, IBM Plex Sans, Manrope, Instrument Serif, Archivo Black).

Add the following missing fonts that BHT themes need — append these `@import` lines before the closing of the file:

```css
/* BHT theme additions */
@import url("https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Satoshi:wght@400;500;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;0,700;1,400&display=swap");
```

- [ ] **Step 2: Commit**

```bash
git add templates/src/styles/fonts.css
git commit -m "feat: add Google Fonts for BHT-derived themes"
```

---

### Phase 2 — First Theme: Signal (proof of concept)

#### Task 6: Create themes/signal/theme.json

**Files:**
- Create: `themes/signal/theme.json`

**Interfaces:**
- Produces: Theme metadata consumed by Checkpoint Plan agent

- [ ] **Step 1: Read BHT Signal source**

Read `beautiful-html-templates/templates/signal/template.json` for metadata fields.

- [ ] **Step 2: Translate to WVP theme.json format**

Create `themes/signal/theme.json`:

```json
{
  "id": "signal",
  "name": "Signal",
  "nameZh": "信号",
  "description": "Deep editorial navy + warm cream dual-surface system. Antique gold accent. Instrument Serif italic display vs Archivo body. 80px invisible structural grid. Short gold rules.",
  "descriptionZh": "深海军蓝 + 暖奶油双表面系统。古董金强调色。Instrument Serif 斜体标题 + Archivo 正文。80px 不可视听网格。金色短分隔线。",
  "mood": ["dark", "editorial", "cinematic", "refined", "confident"],
  "bestFor": [
    "深度内容 / 长文解析",
    "品牌 / 文化内容",
    "高端产品发布",
    "编辑级口播"
  ],
  "avoidFor": [
    "轻松 / 俏皮内容",
    "快节奏 vlog"
  ],
  "formality": "high",
  "source": "beautiful-html-templates/signal",
  "preview": {
    "shell": "#0D1117",
    "surface": "#F0ECE3",
    "text": "#1C2644",
    "accent": "#C8A870"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add themes/signal/theme.json
git commit -m "feat: add Signal theme metadata from BHT"
```

#### Task 7: Create themes/signal/theme.css

**Files:**
- Create: `themes/signal/theme.css`

**Interfaces:**
- Produces: Full CSS design system consumed by base.css and chapter components

- [ ] **Step 1: Read BHT Signal source for visual extraction**

Read `beautiful-html-templates/templates/signal/template.html` (Zone A — CSS variables section, lines 1-100). Read `beautiful-html-templates/templates/signal/design.md` for design intent.

Extract:
- Signal's color palette (navy `#1C2644`, cream `#F0ECE3`, gold `#C8A870`, ink colors, muted tones)
- Typography stack (Instrument Serif italic display, Archivo body, mono)
- Spacing rhythm (from design.md's grid system description)
- Decorative vocabulary (80px grid at 3% white, 36px short gold rules, gold italic mid-sentence emphasis)
- Component styles (stat value/stat label sizing, card treatment, quote style, tag style)

- [ ] **Step 2: Write theme.css**

Create `themes/signal/theme.css`:

```css
/* ======================================================================
 * Theme · signal
 *   Deep editorial navy + warm cream dual-surface system.
 *   Antique gold accent. Instrument Serif italic display vs Archivo body.
 *   80px invisible structural grid on cream surface. Short gold rules.
 *   Slow cinematic pacing (1.5s reveals).
 *
 *   Source: beautiful-html-templates/templates/signal/
 *
 *   character signatures:
 *     • dual-surface: navy (`--surface-alt`) ↔ cream (`--surface`)
 *     • gold italic mid-sentence emphasis (`.display em, .display i`)
 *     • 36px short gold divider (`.divider-accent-short`)
 *     • 80px invisible grid on cream surface
 *     • stat value: Source Serif 4 italic 600 tabular-nums
 * ====================================================================== */
:root {
  /* ─── Palette ─── */
  --shell:        #0D1117;    /* darker than surface for letterbox depth */
  --surface:      #F0ECE3;    /* warm cream — primary surface */
  --surface-2:    #E6E0D5;    /* slightly deeper cream for cards */
  --surface-3:    #D8D1C5;    /* deepest cream for nested surfaces */
  --surface-alt:  #1C2644;    /* deep navy — alternate surface */
  --text:         #1C2644;    /* navy ink on cream */
  --text-2:       #3A4560;    /* lighter navy for secondary text */
  --text-mute:    #7A8299;    /* muted steel blue */
  --text-faint:   #B0B5C0;    /* faint steel */
  --text-on-alt:  #F0ECE3;    /* cream text on navy surface */
  --text-2-on-alt:#C8CFD8;    /* muted cream text on navy */
  --rule:         #D0C9BB;    /* warm hairline on cream */
  --rule-on-alt:  rgba(240,236,227,0.12);  /* subtle rule on navy */
  --accent:       #C8A870;    /* antique gold */
  --accent-soft:  rgba(200,168,112,0.12);
  --accent-glow:  rgba(200,168,112,0.45);

  /* ─── Typography ─── */
  --font-display-en: "Instrument Serif", "Playfair Display", Georgia, serif;
  --font-display-cn: "Noto Serif SC", "Source Han Serif SC", serif;
  --font-body:       "Archivo", "Noto Sans SC", -apple-system, sans-serif;
  --font-mono:       "JetBrains Mono", "SF Mono", ui-monospace, monospace;
  --font-features:   "tnum", "ss01";

  /* ─── Type scale ─── */
  --t-display:  clamp(80px, 9.5vw, 182px);
  --t-h1:       clamp(48px, 5vw, 72px);
  --t-h2:       clamp(32px, 3.6vw, 48px);
  --t-h3:       clamp(24px, 2.5vw, 34px);
  --t-body:     20px;
  --t-caption:  14px;
  --t-micro:    11px;

  /* ─── Spacing scale ─── */
  --space-unit: 8px;
  --space-xs:   4px;
  --space-sm:   8px;
  --space-md:   16px;
  --space-lg:   24px;
  --space-xl:   48px;
  --space-2xl:  96px;

  /* ─── Radii ─── */
  --r-card: 4px;    /* refined, almost sharp */

  /* ─── Stage ─── */
  --stage-pad-x: 120px;
  --stage-pad-y: 80px;
  --shadow-stage:
    0 60px 160px rgba(28,38,68,0.30),
    0 0 0 1px rgba(0,0,0,0.04);

  /* ─── Motion: slow cinematic ─── */
  --ease-quart:    cubic-bezier(0.19, 1, 0.22, 1);
  --ease-expo:     cubic-bezier(0.86, 0, 0.07, 1);
  --dur-quick:     300ms;
  --dur-base:      800ms;
  --dur-slow:      1200ms;
  --dur-cinematic: 1500ms;

  /* ─── Decoration ─── */
  /* 80px invisible structural grid on cream surface */
  --surface-pattern:
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='none' stroke='white' stroke-width='0.5' stroke-opacity='0.03'/></svg>");
  --surface-pattern-size: 80px 80px;
}

/* ────────────────────────────────────────────────────────────────────
 * MUST classes — the 12-class contract
 * ──────────────────────────────────────────────────────────────────── */

/* .display — Hero headline (Latin) */
.display {
  font-family: var(--font-display-en);
  font-size: var(--t-display);
  font-style: italic;
  font-weight: 400;
  line-height: 0.95;
  letter-spacing: -0.02em;
  color: var(--text);
}
/* Signal signature: gold italic mid-sentence emphasis */
.display em,
.display i {
  color: var(--accent);
  font-style: italic;
}

/* .display-cn — Hero headline (Chinese) */
.display-cn {
  font-family: var(--font-display-cn);
  font-size: var(--t-display);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--text);
}

/* .body — Body text */
.body {
  font-family: var(--font-body);
  font-size: var(--t-body);
  font-weight: 400;
  line-height: 1.6;
  color: var(--text-2);
}

/* .body-sm — Caption */
.body-sm {
  font-family: var(--font-body);
  font-size: var(--t-caption);
  font-weight: 400;
  line-height: 1.5;
  color: var(--text-mute);
}

/* .label — Uppercase mono label */
.label {
  font-family: var(--font-mono);
  font-size: var(--t-micro);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-mute);
}

/* .stat-value — Large stat number */
.stat-value {
  font-family: "Source Serif 4", var(--font-display-en);
  font-size: var(--t-h1);
  font-weight: 600;
  font-style: italic;
  line-height: 1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--accent);  /* Signal: gold stats */
}

/* .stat-label — Stat description */
.stat-label {
  font-family: var(--font-body);
  font-size: var(--t-caption);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-mute);
}

/* .card — Card container */
.card {
  background: var(--surface-2);
  border-radius: var(--r-card);
  padding: var(--space-lg);
  box-shadow: 0 1px 0 var(--rule);
}

/* .divider — Horizontal rule */
.divider {
  width: 100%;
  height: 1px;
  background: var(--rule);
  border: 0;
  margin: var(--space-md) 0;
}

/* .quote — Pull quote */
.quote {
  border-left: 3px solid var(--accent);
  padding: var(--space-sm) 0 var(--space-sm) var(--space-lg);
  font-family: var(--font-display-en);
  font-style: italic;
  font-weight: 400;
  font-size: var(--t-h3);
  line-height: 1.4;
  color: var(--text);
}

/* .tag — Badge / pill */
.tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 12px;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: var(--t-micro);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: var(--accent-soft);
  color: var(--accent);
}

/* .meta — Metadata / footnote */
.meta {
  font-family: var(--font-mono);
  font-size: var(--t-micro);
  color: var(--text-faint);
}

/* ────────────────────────────────────────────────────────────────────
 * Signal-specific extensions (MAY — not part of the contract)
 * ──────────────────────────────────────────────────────────────────── */

/* Short gold accent divider — Signal's signature */
.divider-accent-short {
  width: 36px;
  height: 2px;
  background: var(--accent);
  border: 0;
  margin: var(--space-md) 0;
}

/* Dual-surface helper: apply to a step's root to use navy surface */
.surface-alt {
  background: var(--surface-alt);
  color: var(--text-on-alt);
}
.surface-alt .body { color: var(--text-2-on-alt); }
.surface-alt .body-sm { color: var(--text-2-on-alt); opacity: 0.7; }
.surface-alt .label { color: rgba(200,207,216,0.6); }
.surface-alt .meta { color: rgba(200,207,216,0.4); }
.surface-alt .divider { background: var(--rule-on-alt); }
.surface-alt .card {
  background: rgba(240,236,227,0.06);
  box-shadow: 0 1px 0 rgba(240,236,227,0.08);
}
```

- [ ] **Step 3: Count lines — verify all 12 MUST classes present**

```bash
grep -c "^\.[a-z]" themes/signal/theme.css
# Expected: at least 12 class definitions
```

- [ ] **Step 4: Commit**

```bash
git add themes/signal/theme.css
git commit -m "feat: add Signal theme CSS from BHT design system"
```

#### Task 8: Create themes/signal/design.md

**Files:**
- Create: `themes/signal/design.md`

**Interfaces:**
- Produces: Design intent document consumed by chapter agents during chapter development

- [ ] **Step 1: Read BHT Signal design.md source**

Read `beautiful-html-templates/templates/signal/design.md`.

- [ ] **Step 2: Adapt for WVP chapter context**

Create `themes/signal/design.md`:

```markdown
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
```

- [ ] **Step 3: Commit**

```bash
git add themes/signal/design.md
git commit -m "docs: add Signal design intent document for chapter agents"
```

#### Task 9: Verify Signal theme with scaffold

**Files:**
- Test: scaffold a fresh project with `--theme=signal`

- [ ] **Step 1: Scaffold test project**

```bash
bash scripts/scaffold.sh /tmp/test-signal --theme=signal
cd /tmp/test-signal
npm install
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```
Expected: PASS (no type errors).

- [ ] **Step 3: Verify file structure**

```bash
test -f src/styles/theme.css && echo "theme.css OK" || echo "MISSING"
test -f src/styles/base.css && echo "base.css OK" || echo "MISSING"
grep -c "\.display" src/styles/theme.css
# Expected: at least 1
```

- [ ] **Step 4: Start dev server and verify visually**

```bash
npm run dev &
# Wait for server, then check:
# - Stage background is cream (#F0ECE3)
# - Letterbox is dark (#0D1117)
# - Demo chapter text uses Signal typography
# - Accent color is antique gold (#C8A870)
```

- [ ] **Step 5: Cleanup**

```bash
kill %1  # stop dev server
rm -rf /tmp/test-signal
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test: verify Signal theme scaffolds and renders correctly"
```

---

### Phase 3 — Core Themes Batch (parallel-safe: tasks can run concurrently)

Each task in this phase follows the same pattern as Tasks 6-9 (Signal), condensed. The key deliverable per theme is: `themes/<slug>/theme.json`, `themes/<slug>/theme.css`, `themes/<slug>/design.md`.

#### Task 10: Translate Cartesian

**Files:**
- Create: `themes/cartesian/theme.json`, `themes/cartesian/theme.css`, `themes/cartesian/design.md`

**Source:** `beautiful-html-templates/templates/cartesian/`

- [ ] **Step 1: Read BHT Cartesian source files**

Read `beautiful-html-templates/templates/cartesian/template.json`, `template.html` (CSS zone), and `design.md`.

- [ ] **Step 2: Create theme.json**

Cartesian metadata: warm stone palette (no saturated accent), Playfair Display, 1px taupe hairline system, compass dotted circle ornament, minimal editorial tone.

```json
{
  "id": "cartesian",
  "name": "Cartesian",
  "nameZh": "笛卡尔",
  "mood": ["light", "editorial", "minimal", "architectural", "quiet"],
  "formality": "high",
  "bestFor": ["学术 / 研究", "建筑 / 设计", "极简内容", "文献感口播"],
  "avoidFor": ["活泼 / 快节奏", "数据密集", "年轻化内容"],
  "source": "beautiful-html-templates/cartesian"
}
```

- [ ] **Step 3: Create theme.css**

From BHT Cartesian's CSS, extract and write `themes/cartesian/theme.css` covering:

- **Palette:** Warm stone 5-tone system (`#EDE8E0` cream, `#E2DBD1` surface-2, `#1A1A1A` ink, `#5A5A5A` text-2, `#8A8178` muted accent, `#B8B0A4` rule). No saturated color at all.
- **Typography:** Playfair Display italic display, Noto Serif SC Chinese, Inter body, JetBrains Mono mono. `--font-features: "tnum", "ss01", "dlig"`.
- **MUST classes:** All 12. `.stat-value` uses Playfair Display italic. `.divider` is 1px `#B8B0A4` taupe. `.card` has `--r-card: 2px` near-sharp radius.
- **Decoration:** Compass dotted circle via `--surface-pattern` (1px taupe dotted circle SVG at 20-50% opacity).

- [ ] **Step 4: Create design.md**

Key rules:
- No saturated colors anywhere — the entire system runs on warm stone tones. Hierarchy comes from font weight and spacing, not color.
- The 1px taupe hairline is the universal separator. Never use a thicker rule.
- The compass circle ornament is automatic via `--surface-pattern`. Don't try to position or scale it — it sits centered at fixed size.

- [ ] **Step 5: Commit**

```bash
git add themes/cartesian/
git commit -m "feat: add Cartesian theme from BHT"
```

#### Task 11: Translate Studio

**Files:**
- Create: `themes/studio/theme.json`, `themes/studio/theme.css`, `themes/studio/design.md`

**Source:** `beautiful-html-templates/templates/studio/`

- [ ] **Step 1: Read BHT Studio source files**

Read `beautiful-html-templates/templates/studio/template.json`, `template.html`, and `design.md`.

- [ ] **Step 2: Create theme.json**

```json
{
  "id": "studio",
  "name": "Studio",
  "nameZh": "工作室",
  "mood": ["dark", "bold", "graphic", "modernist", "energy"],
  "formality": "medium-low",
  "bestFor": ["创意 / 设计", "品牌宣言", "激进观点", "年轻化内容"],
  "avoidFor": ["学术 / 严肃", "金融 / 法律", "温馨 / 柔和"],
  "source": "beautiful-html-templates/studio"
}
```

- [ ] **Step 3: Create theme.css**

From BHT Studio's CSS, extract:

- **Palette:** Near-black `#1C1C1C` surface, acid yellow `#F5D200` accent, `#F0F0F0` text, `#2E2E2C` rule. Dual-surface: `.surface-alt` = full acid yellow background with black text.
- **Typography:** Barlow display (weight 900 uppercase), Barlow body, Noto Sans SC Chinese, Space Mono mono. `--font-display-en: "Barlow"` with `font-weight: 900; text-transform: uppercase; letter-spacing: -0.03em`.
- **MUST classes:** `.display` is Barlow 900 uppercase at 12vw-ish scale. `.stat-value` is Barlow 900 with acid yellow color. `.divider` is 1px `#2E2E2C` near-invisible on dark.
- **Decoration:** Three-column mono footer lockup (may be implemented as a chapter pattern rather than CSS decoration). No pattern/vignette.

- [ ] **Step 4: Create design.md**

Key rules:
- Type as graphic mass: Barlow 900 uppercase at display sizes means letterforms themselves become the visual element. Don't add decorative elements — the type is the decoration.
- Dual-surface: near-black ↔ acid yellow. Use `.surface-alt` for maximum-impact steps (opening statement, key stat, call to action). Yellow surface forces black text via `.surface-alt` helper class.
- Em-dash for bullets: use `—` not `•` for list items. Mono footer for metadata.

- [ ] **Step 5: Commit**

```bash
git add themes/studio/
git commit -m "feat: add Studio theme from BHT"
```

#### Task 12: Translate Broadside

**Files:**
- Create: `themes/broadside/theme.json`, `themes/broadside/theme.css`, `themes/broadside/design.md`

**Source:** `beautiful-html-templates/templates/broadside/`

- [ ] **Step 1-4: Follow Signal pattern**

Broadside key characteristics:
- **Palette:** Near-black `#111111` surface, warm cream `#F0ECE5` alt surface, fire orange `#E85D26` accent, `#F5F3EE` text, `#8A8A8A` muted.
- **Typography:** Barlow display + Noto Sans SC Chinese (no serif — this is a bilingual sans-serif system), Work Sans body, JetBrains Mono mono.
- **MUST classes:** `.display` is Barlow 700, not italic (sans-serif editorial). `.stat-value` is Barlow 700 with fire orange accent.
- **Dual-surface:** dark ↔ cream like Signal but warmer (orange instead of gold). `.surface-alt` for cream surface.
- **Signature:** "fadelist" — three-stage list reveal pattern documented in design.md.

- [ ] **Step 5: Commit**

#### Task 13: Translate Block-frame

**Files:**
- Create: `themes/block-frame/theme.json`, `themes/block-frame/theme.css`, `themes/block-frame/design.md`

**Source:** `beautiful-html-templates/templates/block-frame/`

- [ ] **Step 1-4: Follow Signal pattern**

Block-frame key characteristics:
- **Palette:** Multi-color pastel-neon block system: pink `#FE90E8`, cyan `#C0F7FE`, green `#99E885`, yellow `#F7CB46`, dark ink `#1A1A1A`, warm white `#FBFBFB` surface.
- **Typography:** Space Grotesk display + Inter body (full geometric sans system), JetBrains Mono mono.
- **MUST classes:** `.display` is Space Grotesk 700. `.card` has thick 3px black border (`--card-shadow: 3px 3px 0 #1A1A1A`). `.tag` uses solid fill colors from the multi-color palette.
- **Decoration:** `--stage-border: 3px solid #1A1A1A` (brutalist frame). `--r-card: 0` (no rounded corners anywhere).
- **Signature:** Block-colored cards — full solid fills, not transparent overlays. Use `.card-fill-pink`, `.card-fill-cyan`, `.card-fill-green`, `.card-fill-yellow` theme-specific extension classes.

- [ ] **Step 5: Commit**

#### Task 14: Translate remaining BHT templates

**Files:**
- Create: `themes/<slug>/` for each remaining template

**Selection criteria:** From the 34 BHT templates, select 10 more with distinct design DNA. All 10 names below have been verified to exist in `beautiful-html-templates/templates/`. Priority order:

1. `emerald-editorial` — deep green + cream editorial (unique green palette)
2. `neo-grid-bold` — 12x8 grid system, bold sans-serif (technical presentations)
3. `8-bit-orbit` — pixel art / retro gaming (unique in BHT collection)
4. `biennale-yellow` — solar yellow + warm parchment (art exhibition)
5. `daisy-days` — soft pastel + handwritten (gentle/friendly)
6. `monochrome` — strict monochrome editorial (like Cartesian but darker)
7. `pin-and-paper` — cork-board / safety pin aesthetic (unique decorative vocabulary)
8. `retro-zine` — risograph zine / layered tactile (vintage)
9. `editorial-tri-tone` — tri-tone editorial with distinctive color system
10. `raw-grid` — raw grid aesthetic / structured brutalist

- [ ] **Step 0: Verify all source templates exist before translating**

```bash
cd "$(git rev-parse --show-toplevel)"
for slug in emerald-editorial neo-grid-bold 8-bit-orbit biennale-yellow daisy-days monochrome pin-and-paper retro-zine editorial-tri-tone raw-grid; do
  test -d "beautiful-html-templates/templates/$slug" && echo "OK: $slug" || echo "MISSING: $slug — STOP"
done
```

- [ ] **Step 1: For each template, translate following the Signal pattern (Tasks 6-8)**

Read BHT source → extract palette → extract typography → implement 12 MUST classes → implement theme-specific extensions → write design.md.

- [ ] **Step 2: Commit each theme individually**

```bash
git add themes/<slug>/
git commit -m "feat: add <Name> theme from BHT"
```

---

### Phase 4 — Documentation (parallel-safe: Tasks 15-17)

#### Task 15: Rewrite THEMES.md

**Files:**
- Modify: `references/THEMES.md` (full rewrite)

- [ ] **Step 1: Write new THEMES.md**

Replace the entire content of `references/THEMES.md` with documentation for the new theme system:

1. **Header:** "主题系统" — explain the new architecture: themes are complete CSS design systems, not just color tokens
2. **Architecture overview:** Each theme = `theme.json` + `theme.css` + `design.md`. `theme.css` provides `:root` vars + 12 MUST classes. Chapter agents read `design.md` for constraints.
3. **Semantic class contract:** Reference `references/SEMANTIC-CLASSES.md` as the authoritative source. Summarize the 12 MUST classes in a compact table.
4. **Built-in theme catalog:** Table listing all BHT-derived themes with id, nameZh, descriptionZh (one line), scheme (light/dark), formality, mood tags, and bestFor. Sorted by scheme then alphabetically.
5. **How to scaffold:** `bash scripts/scaffold.sh ./presentation --theme=signal`
6. **How to switch themes:** `cp themes/<new-id>/theme.css presentation/src/styles/theme.css`
7. **How to create a new theme:** Copy closest existing theme, modify `theme.css` (palette → typography → MUST classes → spacing → decoration), update `theme.json`, write `design.md`. List which BHT themes serve as good starting points for common target moods.
8. **Anti-patterns:** (keep existing section, adapt)
   - Chapter CSS hardcoding colors/fonts — use theme vars
   - Mixing styles from different themes — one theme per project
   - Skipping the 12 MUST classes — every theme must implement all of them
   - Overriding theme vars in chapter CSS

- [ ] **Step 2: Commit**

```bash
git add references/THEMES.md
git commit -m "docs: rewrite THEMES.md for BHT-derived theme system"
```

#### Task 16: Adapt CHAPTER-CRAFT.md

**Files:**
- Modify: `references/CHAPTER-CRAFT.md:133-177` ("代码层最小约束")
- Modify: `references/CHAPTER-CRAFT.md:200-224` ("完工自检")

- [ ] **Step 1: Rewrite "代码层最小约束" section (lines 133-177)**

Replace the current "必须用 token" / "可硬编码" subsections with new text:

```markdown
## 代码层最小约束

### 必须用主题提供的 class

章节使用主题提供的语义 class 来写布局和组件样式。这 12 个 class 在每套
主题的 `theme.css` 中都有定义，视觉效果随主题变化，但 class 名不变：

- **文字层级**：`.display` / `.display-cn` / `.body` / `.body-sm` / `.label`
- **数据**：`.stat-value` / `.stat-label`
- **容器**：`.card`
- **分隔**：`.divider`
- **引用**：`.quote`
- **标记**：`.tag` / `.meta`

完整契约见 `references/SEMANTIC-CLASSES.md`。

**只用这些 class + 布局原语（`.stack` / `.row` / `.grid-2` / `.grid-3`
/ `.center` / `.scene-pad`），你的章节就能在任意主题下正常工作。**

### 颜色的唯一来源：CSS 变量

- **颜色**：`--text` / `--text-2` / `--text-mute` / `--text-faint` /
  `--surface` / `--surface-2` / `--accent` / `--accent-soft` / `--rule`
  —— **禁硬编码 hex / rgb / 颜色名**
- **字体家族**：通过 MUST class 使用，不直接写 `font-family`

### 章节自己写什么

以下维度由章节 agent 在每步实现时自由决定，走章节自己的 CSS 文件：

- **动画 keyframes + 时长 + 缓动**：按内容驱动的动画意图设计
- **独特的可视化布局**：CSS Grid / absolute 定位用于自定义图表、对比面板、
  流程图等 —— 这些是章节特有的视觉演示，主题不提供
- **章节特有的装饰元素**：特定的 SVG 形状、渐变叠层、自定义边框效果
- **字号微调**：如果主题的字号尺度在特定步中不合适，可以在章节 CSS 中
  覆盖 —— 但要三思，大多数时候主题的字号是对的

### 不要自己发明的东西

- 不要写自己的 `.card` 或 `.divider` —— 用主题提供的
- 不要在章节 CSS 中重定义主题的 CSS 变量
- 不要写硬编码颜色或字体名

### 其它工程红线

（保持现有规则：不用 setTimeout、data-no-advance、物理隔离、narrations.ts、
动画时长 ≤ 口播时长）
```

- [ ] **Step 2: Update "完工自检" checklist (lines 200-224)**

Replace the token-specific checklist items with class-contract items:

```
- [ ] **每章至少 1~2 处 CSS / SVG / Canvas / JS 视觉演示** —— 没有 = 回去补
- [ ] **不同 step 的主导动作不一样** —— 全章一种动画 = 回去重做
- [ ] 字号大、留白舒服、配色舒服
- [ ] 清单 / 列表逐个揭示，**1 项 = 1 step**
- [ ] 画面信息比口播稿多（回了原文章抽细节挂上来）
- [ ] 没有紫粉渐变 / 圆角彩色边框 / emoji / 假数据 / 假 logo
- [ ] 缺的素材用 placeholder，不是 fake
- [ ] **所有文字使用主题 MUST class**（.display / .body / .label 等）
      —— 无裸 `<p>` 无样式、无硬编码字体名
- [ ] **所有颜色走 CSS 变量** —— 无硬编码 hex / rgb
- [ ] **容器 / 分隔 / 标记使用主题 class**（.card / .divider / .tag）
      —— 无自己发明的卡片样式
- [ ] 章节交付时**主动告诉用户**："本章还缺这些素材"
- [ ] 禁止出现小号字体，大量纯文字
- [ ] 禁止出现任何形式的页眉页脚
- [ ] **`npx tsc --noEmit` 通过**
- [ ] 章节代码物理隔离：独立 CSS 类前缀，未跨章 import
- [ ] **`narrations.ts` 存在**且长度匹配
- [ ] **每条 narration 与 `script.md` 语义一致**
- [ ] **每个 step 的视觉动画时长 ≤ 口播时长**
```

- [ ] **Step 3: Add reading instruction**

In the "Phase 2.4 reading guide" section (around line 116-120 of CHAPTER-CRAFT.md), add: "Read `references/SEMANTIC-CLASSES.md` once at the start of Phase 2 to learn the 12-class contract."

- [ ] **Step 4: Commit**

```bash
git add references/CHAPTER-CRAFT.md
git commit -m "docs: adapt CHAPTER-CRAFT.md for semantic class contract"
```

#### Task 17: Update SKILL.md

**Files:**
- Modify: `SKILL.md` (4 locations)

- [ ] **Step 1: Update Checkpoint Plan reading guide (lines 112-120)**

In the file-reading guide table, update the Checkpoint Plan row:

```
| **Checkpoint Plan 选主题** | —— | `themes/*/theme.json`（动态读全部，列清单 + `bestFor` 推荐 + `descriptionZh`）；`references/THEMES.md`（用户想了解主题系统时）；`references/SEMANTIC-CLASSES.md`（了解 12-class 合约） |
```

- [ ] **Step 2: Update Checkpoint Plan theme recommendation text (lines 174-175)**

The glob pattern `themes/*/theme.json` already works with the new directory structure. No path change needed. However, update the surrounding prose to mention reading `design.md` for design intent in addition to `theme.json` for metadata. Also reference `references/SEMANTIC-CLASSES.md` for the class contract.

- [ ] **Step 3: Update scaffold examples (lines 239-243)**

Update any `--theme=<id>` examples to use new theme names (e.g., `--theme=signal` instead of `--theme=midnight-press`). Note: the actual `DEFAULT_THEME` change in scaffold.sh happens in Task 18 Step 4.

- [ ] **Step 4: Update resource table (lines 444-450)**

Update `references/THEMES.md` description and add `references/SEMANTIC-CLASSES.md` row:

```
| [`references/SEMANTIC-CLASSES.md`](references/SEMANTIC-CLASSES.md) | Phase 2 开始时读一次 | 12-class 合约：章节 agent 必须使用的主题 class |
```

- [ ] **Step 5: Commit**

```bash
git add SKILL.md
git commit -m "docs: update SKILL.md for BHT-derived theme system"
```

---

### Phase 4.5 — Housekeeping (parallel-safe: Tasks 17a-17d update independent files)

These tasks update files that the core migration (Phases 0-4) left stale. All four can run in parallel since they touch different files.

#### Task 17a: Update example chapter CSS files

**Files:**
- Modify: `references/EXAMPLES/hook-chapter/chapter.css`
- Modify: `references/EXAMPLES/list-reveal/chapter.css`

**Why:** These example CSS files use old variable names (`--space-2`, `--space-3`, `--t-display-2`, `--t-cue`, `--hero-num-font`, `--hero-num-style`, `--hero-num-track`, `--hero-num-weight`, `--rule-w`, `--shadow-card`) that no longer exist after the base.css rewrite. They must be updated to the new variable naming scheme so they remain usable as reference for chapter agents.

- [ ] **Step 1: Update hook-chapter/chapter.css**

Read `references/EXAMPLES/hook-chapter/chapter.css` and replace all old CSS variable names:

| Old variable | New variable |
|---|---|
| `--space-2` | `--space-xs` |
| `--space-3` | `--space-sm` |
| `--space-4` | `--space-md` |
| `--space-5` | `--space-lg` |
| `--space-6` | `--space-xl` |
| `--t-cue` | `--t-micro` |
| `--t-display-1` | `--t-display` |
| `--t-display-2` | `--t-h1` |
| `--hero-num-font` | `var(--font-display-en)` (or remove — hero numbers now styled via theme `.stat-value`, not a dedicated CSS var) |
| `--hero-num-style` | remove (handled by theme `.stat-value`) |
| `--hero-num-weight` | remove (handled by theme `.stat-value`) |
| `--hero-num-track` | remove (handled by theme `.stat-value`) |
| `--rule-w` | remove (handled by theme `.divider`) |
| `--shadow-card` | `--card-shadow` |

Also update any class references: `.hero-num` → `.stat-value`, `.rule` → `.divider`, any hardcoded color → CSS var. Where a visual pattern used a removed primitive class, replace it with the nearest MUST class or write it as a theme-agnostic CSS pattern.

- [ ] **Step 2: Update list-reveal/chapter.css**

Read `references/EXAMPLES/list-reveal/chapter.css` and apply the same variable mapping from Step 1.

- [ ] **Step 3: Commit**

```bash
git add references/EXAMPLES/hook-chapter/chapter.css references/EXAMPLES/list-reveal/chapter.css
git commit -m "fix: update example chapter CSS to new variable names and MUST classes"
```

#### Task 17b: Update OUTLINE-FORMAT.md

**Files:**
- Modify: `references/OUTLINE-FORMAT.md`

**Why:** Line 158 references `midnight-press` by name as an example theme. After migration, this theme is deleted. Replace the reference with a descriptive term.

- [ ] **Step 1: Find and replace the midnight-press reference**

On or near line 158, replace:
```
慢节奏 / 长镜头风主题**（midnight-press / 电影感片头）**
```
with:
```
慢节奏 / 长镜头风主题**（如 signal / 电影感片头）**
```

- [ ] **Step 2: Scan for any other old theme name references**

```bash
grep -n -E "midnight-press|paper-press|warm-keynote|newsroom|bauhaus-bold|terminal-green|chalk-garden|blueprint|dark-botanical|neon-cyber|bold-signal|creative-voltage|sunset-zine|monochrome-print|vintage-editorial|pastel-dream|split-canvas|electric-studio|indigo-porcelain|forest-ink|kraft-paper|dune|swiss-ikb" references/OUTLINE-FORMAT.md
```

If any hits: replace each with a descriptive term or a BHT-derived theme name of similar mood.

- [ ] **Step 3: Commit**

```bash
git add references/OUTLINE-FORMAT.md
git commit -m "fix: update OUTLINE-FORMAT.md theme references"
```

#### Task 17c: Update Stage.tsx comment

**Files:**
- Modify: `templates/src/components/Stage.tsx`

**Why:** Line 20 comment references `themes/<id>/tokens.css`. After migration, themes provide `theme.css` not `tokens.css`. Fix the comment.

- [ ] **Step 1: Update the comment**

At line 20, replace:
```tsx
 * (var(--shell), var(--surface)) — see themes/<id>/tokens.css.
```
with:
```tsx
 * (var(--shell), var(--surface)) — see themes/<id>/theme.css.
```

- [ ] **Step 2: Verify no other references to tokens.css in source files**

```bash
grep -r "tokens\.css" templates/src/ --include="*.ts" --include="*.tsx" --include="*.css"
```

Expected: no output. If any hits found, update them to `theme.css`.

- [ ] **Step 3: Commit**

```bash
git add templates/src/components/Stage.tsx
git commit -m "fix: update Stage.tsx comment from tokens.css to theme.css"
```

#### Task 17d: Update README files

**Files:**
- Modify: `README.md`
- Modify: `README.zh-CN.md`

**Why:** Both README files (~322 lines each) contain a theme gallery with screenshots of all 23 old themes, directory tree listings with old theme names, theme best-for descriptions, and example commands using old theme names. After deleting old themes, all of this becomes incorrect.

- [ ] **Step 1: Locate the theme gallery sections**

```bash
grep -n "## 内置主题\|## Built-in Themes\|23.*theme\|23.*主题\|midnight-press\|warm-keynote" README.md README.zh-CN.md
```

- [ ] **Step 2: Replace the old theme gallery**

Delete the entire old theme gallery/listing sections in both files. Replace with a concise reference:

```markdown
## Themes

This skill includes 15 themes derived from [beautiful-html-templates](https://github.com/zarazhangrui/beautiful-html-templates), each a complete CSS design system. Run `bash scripts/scaffold.sh --list-themes` to see the current catalog, or browse `themes/*/design.md` for design intent documents.
```

- [ ] **Step 3: Fix directory tree listings**

In both files, find any directory tree blocks listing old theme names (look for `midnight-press/`, `warm-keynote/`, `newsroom/`, `bauhaus-bold/`) and replace with:

```
themes/
├── signal/
├── cartesian/
├── studio/
├── broadside/
├── block-frame/
├── ... (15 themes total)
│   ├── theme.json
│   ├── theme.css
│   └── design.md
```

- [ ] **Step 4: Fix example commands**

Replace any `--theme=paper-press` or other old theme names in example commands with `--theme=signal`.

- [ ] **Step 5: Fix theme count references**

Replace "23 themes" / "23 套主题" with "15 themes" / "15 套主题".

- [ ] **Step 6: Commit**

```bash
git add README.md README.zh-CN.md
git commit -m "docs: update README theme gallery for BHT-derived themes"
```

---

### Phase 5 — Cleanup

#### Task 18: Delete old themes

**Files:**
- Delete: `themes/bauhaus-bold/` through `themes/warm-keynote/` (all 23 old WVP theme directories)

> Note: `templates/src/styles/tokens.css` does not exist as a standalone file in the template directory — it is only generated by scaffold.sh from theme source. No separate deletion needed.

- [ ] **Step 1: Verify all new themes are in place**

```bash
cd plugins/video-toolkit/skills/web-video-presentation
ls themes/
# Expected: signal, cartesian, studio, broadside, block-frame, emerald-editorial,
#           neo-grid-bold, 8-bit-orbit, biennale-yellow, daisy-days, monochrome,
#           pin-and-paper, retro-zine, editorial-tri-tone, raw-grid
# Should NOT include any old theme directories (bauhaus-bold, midnight-press, etc.)
```

- [ ] **Step 2: Delete old themes**

```bash
cd plugins/video-toolkit/skills/web-video-presentation
# List old themes to delete (any theme directory that is NOT a BHT-derived theme)
for dir in themes/*/; do
  slug=$(basename "$dir")
  # Skip new BHT-derived themes
  case "$slug" in
    signal|cartesian|studio|broadside|block-frame|emerald-editorial|neo-grid-bold|8-bit-orbit|biennale-yellow|daisy-days|monochrome|pin-and-paper|retro-zine|editorial-tri-tone|raw-grid)
      echo "KEEP: $slug"
      ;;
    *)
      echo "DELETE: $slug"
      rm -rf "themes/$slug"
      ;;
  esac
done
```

- [ ] **Step 3: Update scaffold.sh default theme**

In `scripts/scaffold.sh`, change the `DEFAULT_THEME` on line 26 from `midnight-press` to `signal`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete old 23 WVP themes, set Signal as default"
```

#### Task 19: Final integration test

Full end-to-end test of the new system.

- [ ] **Step 1: Scaffold with default theme (Signal)**

```bash
bash scripts/scaffold.sh /tmp/final-test
cd /tmp/final-test
npm install
npx tsc --noEmit
```

- [ ] **Step 2: Verify complete file structure**

```bash
test -f src/styles/theme.css && echo "OK" || echo "FAIL: theme.css"
test -f src/styles/base.css && echo "OK" || echo "FAIL: base.css"
test -f src/styles/fonts.css && echo "OK" || echo "FAIL: fonts.css"
test -f src/styles/animations.css && echo "OK" || echo "FAIL: animations.css"
test -d src/chapters/01-example && echo "OK" || echo "FAIL: demo chapter"
test -f src/registry/chapters.ts && echo "OK" || echo "FAIL: chapters.ts"
test -f src/App.tsx && echo "OK" || echo "FAIL: App.tsx"
test -f src/main.tsx && echo "OK" || echo "FAIL: main.tsx"
test -f .theme && echo "OK: .theme = $(cat .theme)" || echo "FAIL: .theme"
```

- [ ] **Step 3: Verify import order in App.tsx**

```bash
head -5 src/App.tsx
# Expected:
# import "./styles/fonts.css";
# import "./styles/theme.css";
# import "./styles/base.css";
# import "./styles/animations.css";
```

- [ ] **Step 4: Test theme switching**

```bash
cp "$(git rev-parse --show-toplevel)/themes/cartesian/theme.css" src/styles/theme.css
npx tsc --noEmit && echo "Cartesian typecheck OK"
cp "$(git rev-parse --show-toplevel)/themes/studio/theme.css" src/styles/theme.css
npx tsc --noEmit && echo "Studio typecheck OK"
```

- [ ] **Step 5: Verify demo chapter uses contract classes**

```bash
grep -E "(display|body|card|divider|tag|stat-value|label)" src/chapters/01-example/Example.tsx
# Expected: at least a few `.display`, `.body`, `.card` usages
```

- [ ] **Step 6: Cleanup**

```bash
rm -rf /tmp/final-test
```

- [ ] **Step 7: List all active themes**

```bash
bash scripts/scaffold.sh --list-themes
# Expected: lists all BHT-derived themes, no old themes
```

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "test: final integration test passes for BHT theme migration"
```

---

## Self-Review

### 1. Spec coverage

| Requirement | Covered by |
|---|---|
| Visuals match BHT quality | Tasks 6-14 (theme translation with fidelity to BHT source) |
| All 23 old themes deleted | Task 18 |
| `scaffold.sh --theme=<id>` preserved | Task 4 (interface unchanged) |
| `CHAPTER-CRAFT.md` methodology preserved | Task 16 (only code-rules section changes) |
| `narrations.ts` contract unchanged | No task touches it |
| Chapter code isolation preserved | No task changes chapter structure |
| 12 MUST classes per theme | Task 1 defines contract; Tasks 7, 10-14 implement it |
| Example files updated for new system | Tasks 17a-17d (example CSS, OUTLINE-FORMAT.md, Stage.tsx, README) |
| No stale references to deleted themes | Tasks 17b, 17d (OUTLINE-FORMAT.md and README sweep) |

### 2. Placeholder scan

- Tasks 6-9 (Signal): Full code provided for theme.json, theme.css (230 lines), design.md. ✅
- Tasks 10-13 (Cartesian, Studio, Broadside, Block-frame): Palette values and design rules provided. CSS must be written by the executor following the Signal pattern. ⚠️ Tasks 10-11 have partial code; Tasks 12-13 have descriptions only.
- Task 14 (remaining 10 themes): Template names verified against actual BHT directory. Each requires reading BHT source and translating per Signal pattern. ⚠️ No full CSS provided — executor must synthesize from BHT source.
- All other tasks: Complete code provided.

### 3. Type consistency

- `theme.css` is the single filename used across App.tsx (Task 3), scaffold.sh (Task 4), and all theme creation tasks
- CSS custom property names are consistent between base.css defaults (Task 2) and theme.css implementations (Tasks 7, 10-14)
- 12 MUST class names are consistent between SEMANTIC-CLASSES.md (Task 1), theme.css implementations, and CHAPTER-CRAFT.md (Task 16)
- All 10 BHT template names in Tasks 14 and 18 verified to exist in `beautiful-html-templates/templates/`

### 4. Path consistency

- All WVP paths are relative to `plugins/video-toolkit/skills/web-video-presentation/`
- All BHT paths are relative to repo root (`beautiful-html-templates/`)
- Working directory context documented in Architecture section
- Tasks that cross boundary include explicit `cd` commands

---

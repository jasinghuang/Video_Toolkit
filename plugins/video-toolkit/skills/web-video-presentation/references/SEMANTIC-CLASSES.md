# Semantic Class Contract

The 12 CSS classes every WVP theme MUST provide. Chapter agents write `<div className="display">...</div>` and the active theme's `theme.css` handles the visual rendering specific to that theme's design system.

## Why a contract?

Before the BHT migration, chapters wrote most CSS themselves. The theme only provided color and font variables via `tokens.css`. Now the theme provides finished component styles — chapters compose layouts from these building blocks instead of writing CSS from scratch.

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

Same role as `.display` but tuned for Chinese typography (heavier weight, taller line-height, no italic).

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
- **Custom layout for a specific visual demonstration** — CSS Grid / absolute positioning for a unique diagram or interactive element
- **Chapter-specific decorative elements** — a particular SVG shape, a gradient overlay, a custom border effect that is not part of the theme's design vocabulary
- **Animation timing and easing** — duration, delay, easing per step

## What chapters MUST NOT write

- Hardcoded colors (hex, rgb, color names) — use theme CSS vars
- Hardcoded font-family declarations — use theme CSS vars or MUST classes
- Reinventing `.card` / `.divider` / `.tag` — use the contract classes
- Overriding theme CSS vars in chapter CSS files

# Design Hub Canvas

The design system behind Design Hub, taken from the Spark to Shipped page in this repo.

## Files

| Path | What |
|---|---|
| `tokens.json` | Every token: colors (light and dark), type styles, spacing, radii, shadows, strokes, layout. The source of truth. |
| `tokens.css` | The same tokens as CSS custom properties. Import it once. Dark mode: set `data-theme="dark"` on `<html>`. |
| `components.css` | Styles for every component (`cv-*` classes), written against the tokens. Loads the Google Fonts. |
| `components/<Name>/README.md` | When to use the component, the markup it expects, do's and don'ts. |
| `components/<Name>/preview.html` | A live example. Open it in a browser. |
| `assets/` | The logo mark, favicon and line icons (SVG). |

To use the theme in an app: load `tokens.css`, then `components.css`, then build with the `cv-*` classes and the markup in each component's README.

## Guidelines

Canvas is the visual language of Design Hub, the product design team's portal. Every page is a design canvas: a dot-grid ground, objects placed on it as frames with labels, a blue selection around the thing that matters, and the people who made it present as multiplayer cursors and handwritten notes. It was first built for the “Spark to Shipped” process page. Use it for every Hub page; only story pages get the full scroll-driven animation.

## The idea in five rules

1. **The page is a canvas.** Set every page on `canvas` with the dot grid (`canvas-dot` dots at `dot-pitch`). Put content on it as frames: `surface` fill, 1px `hairline` border, `radius-frame` corners, a `FrameLabel` above.
2. **Blue means selected.** `accent` is the only loud color. Use it for selection frames and handles, focus rings, the current step, links and the one highlighted word in a headline. One accent moment per view; never a resting button fill or a decorative block.
3. **Ink does the drawing.** Text, outlines and icons are `ink`; supporting text is `ink-2`. Illustrations are line art in `ink` with one meaningful `accent` line.
4. **People are colors.** `role-pm`, `role-research`, `role-design` and `role-eng` belong to people: cursors, name tags, chat bubbles and avatars. Never use them for anything else.
5. **Notes are human.** Sticky notes and Caveat hand notes are the team's own voice: short, lowercase, one per screen.

## Content and voice

The team talks like a designer explaining their work to a colleague: plain, specific and short.

- **Plain and active.** “We frame the problem as a question and bring product, engineering, support and research into the room.” Name what people do, not the process jargon.
- **Sentence case** for every heading, button and label. Titles are claims that end with a full stop: “Six crafts, one team.”, “Structure before style.”
- **We and you.** “We” is the design team; “you” is the reader. Use people's roles in stories (Researcher, Product manager) and real names on the Hub.
- **Buttons say what happens:** “Request design help”, “Open the tool”, “Follow the idea”. Never “Submit” or “Click here”.
- **Hand notes and cursor chat** are short and human: “we'll bring the sticky notes”, “fewer steps, not more!”, “Wait, no wireframes?”. Lowercase for hand notes, under about 26 characters for chat.
- **Numbers are specific** (“298 devices”, “5 of 5 admins”) and example numbers in illustrations are labelled as examples on the Hub.
- **No emoji.** The only glyphs are `#` (frames) and `◇` (components).
- **American spelling** (color, organize).

## Color roles

| Role | Tokens | Rule |
|---|---|---|
| Ground | `canvas`, `canvas-dot` | Every page background, with the dot grid. Nothing else uses these. |
| Objects | `surface`, `hairline` | Cards, frames, panels, chips, inputs. A 1px `hairline` border separates; shadows don't. |
| Text | `ink`, `ink-2`, `ink-3` | `ink` for headlines and primary text, `ink-2` for body and metadata. `ink-3` only for marks that sit beside a readable label (it fails as text). |
| Selection | `accent`, `accent-soft`, `on-accent` | Selection, focus, current step, links, one highlighted word. Text on an `accent` fill is `on-accent`. |
| Components | `component`, `component-ink` | The ◇ glyph and component labels. `component-ink` for small text on `canvas`. |
| Specs | `measure` | Redlines and measurement tags only. |
| People | `role-*`, `on-role` | Cursors, name tags, chat, avatars. One color per role, everywhere. |
| Ideas | `sticky-yellow`, `sticky-pink`, `sticky-green`, `sticky-lilac`, `sticky-ink`, `sticky-shadow` | Sticky notes only, same in both themes. |
| Status (Hub) | `progress-soft`, `component-soft`, `warning`, `warning-soft`, `danger`, `danger-soft`, `success-ink`, `success-soft` | `StatusPill` and notices. Always with a word. |
| Story light | `glow`, `world`, `success` | Illustration only: the lit bulb, the warm “real world” wash, rising charts. |
| Example product | `app-*`, `rugged`, `editor-*` | Illustration only: the EMM console, device screens and code editor drawn in stories. They don't change with the theme. Never use them for Hub UI. |

## Typography

Four families, each with one job:

- **Funnel Display** (`display`) for headlines: tight leading (0.86 to 1), negative tracking (-0.02 to -0.05em), weight 700 (800 for `display-cta`). Use `display-hero` once per page, `display-section` for section titles, `title-chapter` for page titles inside the app, `title-card` on cards.
- **Funnel Sans** (`sans`) for everything read in sentences: `lede` in `ink-2` under titles, `body` at 1.6 line height, `nav`, `button`, `small`.
- **Caveat** (`hand`) for the team's handwriting: `hand-note` in `accent`, `hand-sticky` on stickies. Never for anything someone needs to read to use the page.
- **Geist Mono** (`mono`) for the tool's chrome: `label` (uppercase eyebrows, 0.08em tracking), `frame-label`, `tag`, `code`.

Display sizes are fluid. Each style's usage gives its `clamp()`; the token holds the desktop maximum. Give headings `text-wrap: balance` and keep body text within `text-max` (56ch). The highlighted word in a headline is `accent` with a small hand-drawn spark next to it, and there is only one per page.

## Layout and spacing

- **Page frame:** content max `page-max` (1280px), side gutter at least 16px (`space-4`) plus the safe-area insets; the canvas itself runs edge to edge.
- **Top bar:** `header-h` (64px), fixed. Everything that pins (a story stage) starts below it.
- **Sections:** top padding `space-section` (clamp 88 to 180px), `SectionHeader` then `space-12` to `space-20` before content.
- **Grids:** cards three across on desktop, two on tablets (≤960px), one on phones (≤620px), gap `space-6` to `space-7`, all cards in a row the same height.
- **Spacing steps:** `space-1` 4 · `space-2` 8 · `space-3` 12 · `space-4` 16 · `space-5` 20 · `space-6` 24 · `space-7` 28 · `space-10` 40 · `space-12` 48 · `space-20` 80.
- **Alignment:** left-aligned. Nothing is centered except a single CTA block if it stands alone.

## Canvas motifs

These are what make a page feel like Canvas. Use them with restraint.

- **Frames and labels.** Every section and major object is a frame with a `FrameLabel` (“# Team”) above it.
- **Selection.** One `SelectionFrame` at rest per page (the hero); cards show handles only on hover and focus. Show real dimensions in a dimension tag (`radius-sm`, `accent` fill, `on-accent` text).
- **Cursors.** Story pages and heroes have the cast as `Cursor`s; the viewer gets a pink “You” tag that follows the pointer on desktop. Hub UI pages can skip cursors and keep the role colors in avatars.
- **Sticky notes.** For ideas and findings. Tilted between -6° and 6°, `shadow-sticky`, two lines of `hand-sticky`.
- **Hand notes.** One per screen, `accent`, lowercase, with a drawn arrow.
- **Components ◇.** `ComponentTag`s and component labels mark reusable things: activities, deliverables, skills, tools, filters.
- **Measurements.** `measure` pink redlines with tags, only when showing specs.
- **Borders, not shadows.** Frames separate with `hairline`; the only shadows are `shadow-sticky`, `shadow-bar` (scrolled top bar) and `shadow-selected` (a selected card's crisp border).
- **Radii:** `radius-frame` (3px) for frames and cards, `radius-tag` (6px) for chips and name tags, `radius-panel` (14px) for panels inside illustrations, browser frames and code editors, `radius-pill` for buttons, the theme switch and status pills.

## Line art and illustration

Illustrations are hand-coded inline SVG, never raster images. Draw objects as `ink` outlines at `stroke-ink` with round caps and joins, fill them with `surface` only so they hide what's behind them, and give each scene one meaningful line in `accent` at `stroke-accent`. Secondary lines (connectors, axes) are `ink-3` at `stroke-soft`. Color is reserved for sticky notes, the lit bulb (`glow`), example product screens (`app-*`) and people (role colors). Text inside a drawing uses Caveat for annotations, Geist Mono for labels and Funnel Sans for UI. Mark illustrations `aria-hidden="true"` and put their meaning in real text next to them. See `LineArt`.

## Iconography

Line icons on a 48px grid (24px for small UI), `stroke-ui` (2px), round caps and joins, no fills, drawn in `ink` (or `currentColor` when inline). The six capability icons are in `design-system/assets/Icons/`; draw new ones in the same style. No icon font and no emoji. Icons in cards draw themselves in the first time they scroll into view.

## Motion

Motion explains; it never decorates. Pick the tier per page:

| Tier | What | Where | How |
|---|---|---|---|
| 1 · Storytelling | A pinned stage whose drawing is scrubbed by scroll, with chapters, cursors and a step rail. | Only narrative pages that walk through a story step by step. | GSAP timeline + ScrollTrigger (scrub ≈ 0.9) + DrawSVG/MotionPath; Lenis smooth scroll. |
| 2 · Reveals | Headline words rise once, card icons draw in once, principles fill in as you read, the hero's cursors drift slowly. | Landing and overview pages, section openers. | Run once on first view, from a visible resting state; never hide content waiting for scroll. |
| 3 · Feedback | Selection handles on hover, button color changes (0.2s), the theme switch knob (0.4s with a small overshoot), a circular reveal when the theme changes. | Everywhere, and the only motion on working pages (lists, boards, directories). | CSS transitions; View Transitions API for the theme reveal. |

Ease with `power2`/`power3` in-out for travel and a `back.out` overshoot for things that pop (sticky notes, handles). Draw lines; don't fade in finished drawings. Under `prefers-reduced-motion`: no smooth scrolling, no intro or idle animation, no marquee, drawings shown complete, story pages still follow scroll position exactly with no easing lag.

## Themes

Two themes, `light` and `dark`. **Light is always the default**, even when the device prefers dark. The `ThemeSwitch` in the top bar turns dark on and the choice is remembered (localStorage key `pd-theme`, applied by an inline script in `<head>` to avoid a flash). In this system the dark values are under `[data-theme="dark"]`; on the Spark to Shipped page the same values sit under `:root[data-mode="dark"]`, because that page may be embedded in a host that sets its own `data-theme`. On the Hub, pick one attribute and use it everywhere. Sticky notes, example product screens and the code editor keep their colors in both themes.

## Accessibility

- **Focus:** every interactive element shows a 2px `accent` outline at a 3px offset (4.9:1 on `canvas` light, 6.6:1 dark).
- **Contrast:** text tokens' notes name the grounds they pass on. These pairs from the original page miss 4.5:1 and are kept exact with a proposed fix in their notes: white `on-role` on role fills in dark (2.9 to 3.8:1; fix: `#0b0d12`), white on `role-pm` in light (4.2:1), `measure` as text or behind white text (fix: `#c4285f` in light, dark text in dark), `success` and `component` as small text on `canvas` in light (use `success-ink` and `component-ink`), and `ink-3` as any text. `hairline` borders are decorative (about 1.4:1), so controls also carry a label or icon.
- **Status** never relies on color: every `StatusPill` shows a word.
- **Illustrations** are `aria-hidden="true"`; story chapters are real text that screen readers read in order (hide them with opacity, not `visibility: hidden`).
- **Without JavaScript** story chapters render as a normal list.

## Tech stack

What the Spark to Shipped page is built with (repository `aniketsompura/Product_Design_Page`):

| Layer | Tool | Role |
|---|---|---|
| Build | Vite 8.3.4 | Dev server and static build (`dist/`, relative paths, hostable anywhere). |
| Language | TypeScript 5.9.3 | All page code. |
| Animation | GSAP 3.15.0 with ScrollTrigger, DrawSVGPlugin, MotionPathPlugin | One master timeline scrubbed by scroll; lines that draw themselves; things that travel along paths. |
| Smooth scroll | Lenis 1.3.26 | Weighted scrolling kept in sync with GSAP's ticker. |
| Illustration | Inline SVG written in code | Themable, crisp, each line animatable. |
| Styling | Plain CSS custom properties | The tokens in this system; dark theme by attribute. |
| Fonts | Google Fonts | Funnel Display, Funnel Sans, Caveat, Geist Mono. |
| Browser APIs | View Transitions, localStorage | The theme reveal and remembering the theme. |

For the Hub: load `design-system/tokens.css` and `design-system/components.css` once, in any framework. Load GSAP and Lenis only on Tier 1 story pages; Tier 2 reveals need only GSAP core (or CSS), and Tier 3 needs nothing.

## Intentional additions

Built for Design Hub rather than taken from the original page:

- **Status colors** `success-ink`, `success-soft`, `progress-soft`, `component-ink`, `component-soft`, `warning`, `warning-soft`, `danger`, `danger-soft`. The Hub shows the state of people's work, and the page had no text-safe status colors. All pass 4.5:1 in both themes.
- **Components** `StatusPill`, `PersonCard` and `ResourceRow` (with the `cv-avatar` class), for showing people, the state of their work, and shared resources.
- **Spacing names** (`space-*`) give names to the 4px steps the page already used.

# LineArt

The illustration style: objects drawn as single-weight `ink` outlines with round caps, filled only with `surface` so they hide what's behind them, and one `accent` line that carries the meaning.

**Use it** for every illustration on the Hub, from story scenes to empty states and section spot art.

**Rules (consumers draw these as inline SVG):**
- Outlines: `ink`, `stroke-ink` (2.5px in a 1200 × 800 scene), `stroke-linecap: round`, `stroke-linejoin: round`.
- One meaningful line per scene in `accent` at `stroke-accent` (3px): the filament, a lasso, a highlight loop.
- Secondary lines (connectors, axes): `ink-3` at `stroke-soft`.
- Fills: `surface` only, to occlude. Color fills are reserved for sticky notes, the example product screens (`app-*`) and `glow`.
- Text inside art: Caveat for annotations, Geist Mono for labels, Funnel Sans for UI.
- Animate by drawing the stroke (GSAP DrawSVG or `stroke-dashoffset`), never by fading in a finished drawing. Respect reduced motion: show it fully drawn.
- Mark illustrations `aria-hidden="true"`; the story text next to them carries the content.

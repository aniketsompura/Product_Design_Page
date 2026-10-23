Logo marks for Design Hub. Single-file SVGs with fixed colors, because an `<img>` can't recolor them.

- `canvas-mark.svg`: the selection-frame mark (a frame with four handles) shown beside the `brand` wordmark in the top bar. Inks: `accent` light value (#2a55f5) for the frame and handle borders, white handle fills. In the app, draw it inline (see `TopBar`) so it follows `accent` and `surface` in dark mode.
- `canvas-favicon.svg`: the browser-tab icon, the same mark with a filled `accent` dot in the center.

Keep at least 8px of clear space around the mark and never redraw it in another color.

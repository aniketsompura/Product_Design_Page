# TopBar

The fixed bar across the top of every Hub page: the selection-frame mark and wordmark on the left; links, the main action and the theme switch on the right.

**Use it** on every page. It's transparent over the canvas at the top and gets the `veil` background, a 10px blur and `shadow-bar` once the page scrolls.

**Markup:** `<header class="cv-topbar">` with `<a class="cv-brand">` (logo mark from `design-system/assets/Logos/` + `brand` text), `<nav class="cv-nav">` links (`nav` style, `ink-2`, `aria-current="page"` for the current one), then `cv-btn--compact`, then `cv-theme-switch`. Height is `header-h`; pad the sides with the page gutter and the safe-area insets.

- Do: keep four to six links.
- Do: keep the order links → main action → theme switch.
- On phones: hide the links behind a menu and keep the main action and theme switch visible.

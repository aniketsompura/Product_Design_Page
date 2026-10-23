# CapabilityCard

A frame on the canvas: a ◇ component label above, then a white card with a line icon, a title, a short description and a dashed list of outputs. On hover or focus it gets selection handles.

**Use it** for capabilities, for tools the team built (add a `StatusPill` and a link in the outputs row) and for quick links.

**Markup:** `<article class="cv-cap">` with `<p class="cv-cap__label">Research</p>` and `<div class="cv-cap__card">` holding the icon (`cv-cap__icon`, 48px, `stroke-ui`), `<h3>` (`title-card`), `<p>` and `<p class="cv-cap__out">Interview guides · Test reports</p>`, plus the four `cv-handle` spans. Lay cards out three across, two on tablets, one on phones, all the same height.

- Do: draw the icon from `design-system/assets/Icons/` (or in the same 48px, 2px-stroke style) and draw it in on first view.
- Don't: add color fills, shadows or a colored left border.

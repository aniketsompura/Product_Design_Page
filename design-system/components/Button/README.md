# Button

A pill with a 1.5px `ink` border. Primary is an `ink` fill that turns `accent` on hover; ghost is a `surface` fill whose border and label turn `accent`.

**Use it** for actions. One primary per view (“Request design help”, “Open the tool”); ghost for the secondary action beside it.

**Markup:** `<a class="cv-btn cv-btn--primary" href="…">Request design help</a>`, `cv-btn--ghost`, `cv-btn--cue` (outline with an arrow icon, inverts on hover, for “Follow the idea ↓” style scroll cues) and `cv-btn--compact` (the top bar's “Talk to us”). Labels use `button` (Funnel Sans 600 16px).

- Do: say exactly what happens (“Request design help”, not “Submit”).
- Do: keep the visible focus ring (2px `accent`, 3px offset).
- Don't: use `accent` as a resting button fill; blue means “selected”, so it only appears on hover.
- Don't: put two primary buttons side by side.

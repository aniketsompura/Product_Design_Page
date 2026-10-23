# ThemeSwitch

A sun/moon switch that turns the dark theme on. Light is always the default.

**Use it** once, at the far right of the top bar, after the main action.

**Markup:** `<button class="cv-theme-switch" role="switch" aria-checked="false" aria-label="Dark theme">` with the knob span and two icon SVGs. In the app, set `aria-checked` and the theme attribute together, and remember the choice (the site stores `pd-theme` in localStorage and applies it in an inline script in `<head>` so there's no flash).

- Do: play the circular reveal from the switch with the View Transitions API where it exists; switch instantly otherwise and under reduced motion.
- Don't: follow the operating system's dark setting automatically; the team chose light as the default.
- Don't: put the switch before the primary action in the bar.

# StepRail

A 2px progress track with numbered step labels under it. It shows where you are in a sequence and lets you jump.

**Use it** under a story stage (the six chapters of the process page), and for any real sequence on the Hub: onboarding steps, a project's phases.

**Markup:** `<nav class="cv-rail" style="--steps:6">` with `.cv-rail__track > .cv-rail__fill` (scale it with `transform: scaleX(progress)`) and `<ol class="cv-rail__list">` of `<button class="cv-rail__step"><span>01</span> Spark</button>`. Mark the current one `aria-current="step"`: its label turns `ink` and its number `accent`.

- Do: number steps only when they are a true sequence.
- On phones: show numbers only and the current step's label.
- Don't: use it as a tab bar for unrelated pages.

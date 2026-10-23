# StickyNote

A square of colored paper with two short lines of handwriting, slightly tilted, casting the only real shadow on the canvas.

**Use it** for ideas, quick findings and human notes: brainstorm boards, “Tested with 5 admins” results, a friendly hint in a hero (“Scroll slowly. It's a story.”).

**Markup:** `<div class="cv-sticky">One-click<br>fixes</div>`. Colors: default `sticky-yellow`, or add `cv-sticky--pink`, `--green`, `--lilac`. Tilt with the `--tilt` custom property (between -6deg and 6deg). `cv-sticky--small` is the 96px board size. Dot votes: `<span class="cv-sticky__votes"><i style="--c:var(--role-pm)"></i></span>`.

- Do: write in `hand-sticky` style, `sticky-ink`, two lines at most, no punctuation unless it is a full sentence.
- Do: keep the paper colors in dark mode; stickies are paper, not UI.
- Don't: use a sticky note as a button, card or alert.
- Don't: use sticky colors for anything that isn't a sticky note.

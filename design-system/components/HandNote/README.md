# HandNote

A short handwritten aside in Caveat, usually with a drawn arrow, as if someone annotated the page with a marker.

**Use it** for one human remark per section: under a principle (“solutions come later”), beside a CTA (“we'll bring the sticky notes”), or to point at a detail in an illustration.

**Markup:** `<p class="cv-hand-note">we'll bring the sticky notes <svg viewBox="0 0 80 40">…</svg></p>`. Default color is `accent`; `cv-hand-note--soft` uses `ink-2` (wireframe annotations). Mark the arrow `aria-hidden="true"`.

- Do: write lowercase, five words or fewer, no full stop.
- Don't: put instructions, numbers people need, or links in a hand note.
- Don't: use more than one hand note per screen.

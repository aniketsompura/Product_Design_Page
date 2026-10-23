# PersonCard

A team member as a frame on the canvas: avatar in their discipline's role color, name, role, and what they're working on now with its status. Design Hub addition.

**Use it** wherever the Hub shows people: a team directory, a strip of who's working on what. The data comes from the Hub: name, role, discipline, current project, status, last update.

**Markup:** `<article class="cv-person">` with `.cv-person__who` (`cv-avatar` with `--size:44px` and a discipline modifier, then name in `.cv-person__name` and role in `.cv-person__role`) and `.cv-person__now` (label, project link, then `.cv-person__meta` with a `StatusPill` and the update time). Add the four `cv-handle` spans for the hover selection.

- Do: map each discipline to one role color and keep it everywhere: Research `role-research`, Design `role-design`, Product partners `role-pm`, Design engineering `role-eng`.
- Do: say when the status was last updated.
- Don't: show more than one current project; link to the person's page for the rest.

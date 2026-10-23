# StatusPill

A soft pill with a dot and a word that says where a piece of work stands. Design Hub addition.

**Use it** wherever the Hub shows the state of work: boards of current work, person cards (“Now working on”) and tool cards (Live, Beta).

**Markup:** `<span class="cv-status cv-status--progress">In progress</span>`. States and tokens:
- `--progress` In progress: `accent` on `progress-soft`
- `--review` In review: `component-ink` on `component-soft`
- `--risk` At risk: `warning` on `warning-soft`
- `--blocked` Blocked: `danger` on `danger-soft`
- `--shipped` Shipped / Live: `success-ink` on `success-soft`
- `--paused` Paused / Beta: `ink-2` on `canvas` with a `hairline` ring

All pairs pass 4.5:1 in both themes.

- Do: always show the word; never rely on the color alone.
- Don't: invent new states per page; add one here first.

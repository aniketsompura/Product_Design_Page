# ComponentTag

A small mono chip with the ◇ component glyph, borrowed from how design tools mark component instances.

**Use it** for lists of activities, deliverables, skills, tools or filters: the tags under each story chapter, a tool's platforms, a person's skills, filter chips.

**Markup:** `<ul class="cv-tags"><li class="cv-tag">Usability testing</li></ul>`. As a filter, use `<button class="cv-tag" aria-pressed="true">`: pressed tags get an `accent` border.

- Do: keep tags to one to three words, sentence case.
- Do: wrap tags onto more lines rather than truncating.
- Don't: use tags for status; use `StatusPill`.

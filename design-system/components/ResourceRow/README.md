# ResourceRow

One resource in a list: an icon tile, a title and one-line description, and the format and date on the right. Design Hub addition.

**Use it** anywhere the Hub lists files, links or guides (templates, research reports, brand assets, recordings).

**Markup:** `<ul class="cv-resources">` of `<li><a class="cv-resource" href="…">` with `.cv-resource__icon` (22px line icon), `.cv-resource__title`, `.cv-resource__desc` and `.cv-resource__meta` (“Figma · Oct 2026” and an optional bold `Open ↗`). Group lists under `SectionHeader`s by type.

- Do: write titles as the thing's real name and descriptions as what it's for.
- Do: show the format and the last update so people can judge freshness.
- On phones the meta drops under the text.

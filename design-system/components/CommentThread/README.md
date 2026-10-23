# CommentThread

A design-tool comment: avatars in role colors, names in bold, and plain replies, inside a panel with an `ink` border.

**Use it** to show collaboration (a question answered in the file), and on the Hub for feedback on a tool or a project update.

**Markup:** `<div class="cv-comment">` of `<div class="cv-comment__msg">` each with `<span class="cv-avatar cv-avatar--eng" aria-hidden="true">E</span><b>Engineer</b><p>…</p>`. Radius is `radius-panel`.

- Do: show real names on the Hub (role names in stories), newest reply last.
- Don't: put more than three messages in an illustration; link to the full thread instead.

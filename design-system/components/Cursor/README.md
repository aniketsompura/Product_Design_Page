# Cursor

A multiplayer cursor: an arrow and a name tag in a role color, with an optional cursor-chat bubble. These are the cast of every story on the Hub.

**Use it** in story illustrations and hero decoration to show who is doing the work (PM, researcher, designer, engineer), and as the viewer's own “You” tag that follows the pointer. On the Hub, use the same role colors for people's avatars.

**Markup:** `<div class="cv-cursor cv-cursor--pm">` + the arrow SVG + `<span class="cv-cursor__tag">Product manager</span>`, optionally `<span class="cv-cursor__chat">It's on our Q3 roadmap</span>`. Roles: `--pm` (`role-pm`), `--research`, `--design`, `--eng`, `--you`. Mark decorative cursors `aria-hidden="true"`.

- Do: keep chat lines under about 26 characters, in the person's voice, no emoji.
- Do: keep each person's color fixed everywhere they appear.
- Don't: use role colors for anything other than people.
- Accessibility: white `on-role` on these fills misses 4.5:1 in dark mode (and on `role-pm` in light). The tags are decorative here; for text people must read, use `#0b0d12` on the role fill in dark (see `on-role`).

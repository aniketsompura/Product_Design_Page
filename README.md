# Spark to Shipped

A scroll-driven story page about what our product design team does. One idea travels from a
spark to someone's hand, and the whole journey is drawn in line art that animates as you scroll.

## The story

The page is set on a design canvas (dot grid, frames, selection handles). Multiplayer cursors
labelled **Researcher**, **Product manager**, **Designer** and **Engineer** are the characters.
They move things around and talk in cursor-chat bubbles.

| # | Chapter | What you see as you scroll |
|---|---------|----------------------------|
| 01 | **Spark** | A pen tool draws a lightbulb, anchor points and all. The cast brings in signals: user feedback, a dip in analytics, the PM's roadmap and a design audit. The signals flow into the bulb and it lights up. |
| 02 | **Brainstorm** | The bulb shrinks into a whiteboard header ("How might we…"). Cursors stick up a dozen sticky notes, drag them into affinity clusters, lasso them and dot-vote. The camera zooms in on the winner and the designer selects it. |
| 03 | **Wireframe** | The winning sticky is resized by its corner handle into a phone frame, and the size tag counts up to 393 × 852. A layout grid appears, the rectangle tool draws a grey-box wireframe, the team annotates it and a usability-test note goes up. |
| 04 | **High fidelity** | Design-system cards (color, type, spacing, components, motion, icons) arrive. A paint sweep turns the wireframe into the finished screen, and the components come alive. |
| 05 | **Build** | Spec redlines appear and an engineer asks a question in a comment, which the designer answers. Code types itself in an editor, design tokens fly from the screen into the code, and the release bar fills to "Live for 100% of users". |
| 06 | **In people's hands** | The cursors leave and the dot grid gives way to warm daylight. A hand holds the phone, a thumb taps, "coffee" is typed and the receipt is found. Reactions come in, the success chart climbs, and a small bulb lights up: the next spark. |

After the story: **What we do** (six capabilities), **How we work** (principles), a tools
marquee and a contact section.

## Tech stack

| Tool | Why |
|------|-----|
| [Vite](https://vite.dev) + TypeScript | Fast dev server, tiny static build, no framework needed for one page. |
| [GSAP](https://gsap.com) + ScrollTrigger | One master timeline scrubbed by scroll, so every frame is exactly reproducible forwards and backwards. |
| GSAP DrawSVGPlugin / MotionPathPlugin | Line drawing, the pen nib following a path, cursors tracing loops. (All GSAP plugins are free since 3.13.) |
| [Lenis](https://lenis.darkroom.engineering) | Smooth scrolling that stays in sync with GSAP's ticker. |
| Hand-written inline SVG | Every illustration is code: themable with CSS variables, crisp at any size and tiny over the wire. |

Fonts (Google Fonts): Funnel Display and Funnel Sans for type, Caveat for marker handwriting and Geist Mono for specs and labels.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/
npm run preview   # serve the build locally
```

The build uses relative paths, so `dist/` can be hosted anywhere (GitHub Pages, Netlify, an S3 bucket or a subfolder).

## Project structure

```
index.html                 All page copy: hero, chapter text, capabilities, principles, contact
src/
  main.ts                  Boot: smooth scroll, fonts, then each section
  styles.css               Design tokens (light + dark), layout, stage styles
  hero.ts                  Hero intro, live frame size, drifting cursors, "You" cursor
  outro.ts                 Capabilities, principles, marquee, contact
  lib/motion.ts            GSAP plugin registration, Lenis, reduced-motion flags
  lib/split.ts             Splits headings into words for reveal animations
  story/
    index.ts               Builds the stage SVG and the master timeline, chapter text, rail
    timing.ts              Start time of each chapter on the timeline
    rig.ts                 Device and camera transforms (tweened as plain objects)
    svg.ts                 Drawing helpers: cursors, sticky notes, arrows, loops, stars
    scenes/spark.ts        Chapter 1
    scenes/brainstorm.ts   Chapter 2 (+ resizing the sticky into a phone)
    scenes/device.ts       The phone, its wireframe and hi-fi screen, chapters 3 and 4
    scenes/build.ts        Chapter 5
    scenes/impact.ts       Chapter 6
```

## Common edits

- **Copy:** chapter text lives in `index.html` under `.chapter`. Text inside the illustrations
  (sticky notes, chat bubbles, code, app screen) lives in the scene files.
- **Pacing:** `src/story/timing.ts` sets where each chapter starts. Total scroll length is
  `timeline duration × 11% of the viewport height` (see `unit()` in `story/index.ts`).
- **Colors and fonts:** all tokens are at the top of `src/styles.css`, with dark-mode values
  below them. The fictional app on the phone uses the `--app-*` tokens.
- **Characters:** cursor names and their chat lines are in `CAST` in `story/index.ts`.
- **Contact:** replace `design@example.com` in `index.html`.

### Debugging the timeline

In dev mode the story exposes `window.__story = { tl, st }`. To jump to a moment, for example 30 seconds into the timeline:

```js
const { tl, st } = __story;
scrollTo(0, st.start + (st.end - st.start) * (30 / tl.duration()));
```

## Accessibility

- The illustration is decorative (`aria-hidden`). All story content is real text in the page,
  readable in order by screen readers.
- `prefers-reduced-motion`: no smooth scrolling, no intro or idle animations, no marquee. The
  story still follows your scroll position exactly, with no easing lag.
- Without JavaScript the chapters render as a normal readable list.
- Works in light and dark mode, and down to phone widths (the stage stacks above the text).

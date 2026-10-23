# Spark to Shipped

A scroll-driven story page about what our product design team does. One idea travels from a
spark to someone's hand, and the whole journey is drawn in line art that animates as you scroll.

## The story

The page is set on a design canvas (dot grid, frames, selection handles). Multiplayer cursors
labelled **Researcher**, **Product manager**, **Designer** and **Engineer** are the characters.
They move things around and talk in cursor-chat bubbles. The product in the story is a generic
EMM (enterprise mobility management) console, and the problem is device enrollment.

| # | Chapter | What you see as you scroll |
|---|---------|----------------------------|
| 01 | **Spark** | A pen tool draws a lightbulb, anchor points and all. The cast brings in signals: an IT admin's ticket ("312 devices stuck on Enrolling…"), a dip in first-try enrollment, an "Enrollment revamp" roadmap item and a design audit ("14 steps to enroll one device"). They flow into the bulb and it lights up. |
| 02 | **Brainstorm** | "How might we get every device enrolled on the first try?" Cursors stick up sticky notes, drag them into clusters (Diagnose, Set up, Scale), lasso them and dot-vote. The camera zooms in and the designer selects the winner: **One-click fixes**. |
| 03 | **Synthesize with AI** | The notes and research (interviews, tickets, enrollment data) stream into an AI panel. It drafts themes with percentages, an insight, a concept and a goal. A designer strikes out a bad suggestion ("fewer steps, not more!") and verifies the insight against interviews. |
| 04 | **Prototype with AI** | No wireframes. A prompt is typed (`@Brief`, `@Design system`), the winning sticky is resized into a 1440 × 900 frame, the AI lays out a skeleton and a generation sweep paints the "Enrollment health" console. The designer clicks **Renew & retry** in the prototype: 298 devices recover and the numbers update. A note says 5 of 5 admins fixed it in testing. |
| 05 | **Build** | Spec redlines on the failure card, an engineer's question answered in the file ("Batches of 50"), code that types itself, design tokens flying into the code, a design QA checklist and a release bar. |
| 06 | **In people's hands** | The cursors leave and the canvas becomes warm daylight. The admin's rollout reaches 1,200 of 1,200, the warehouse fleet lights up, and a worker's rugged device finishes setup: "You're all set → Start shift". The success chart climbs and a small bulb lights up: the next spark. |

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
    scenes/brainstorm.ts   Chapter 2 (+ the selection box that follows the winning sticky)
    scenes/synthesize.ts   Chapter 3, the AI synthesis panel
    scenes/console.ts      The EMM console prototype (skeleton, generated screen, redlines)
    scenes/prototype.ts    Chapter 4, prompt → frame → generated prototype → click-through
    scenes/build.ts        Chapter 5
    scenes/impact.ts       Chapter 6, the worker's hand, rugged device and fleet
```

## Common edits

- **Copy:** chapter text lives in `index.html` under `.chapter`. Text inside the illustrations
  (sticky notes, chat bubbles, the AI draft, code, the console and device screens) lives in the scene files.
- **Product name:** the console is labelled "EMM Console" / "EMM". Search `console.ts` for those
  strings to use your own product name.
- **Pacing:** `src/story/timing.ts` sets where each chapter starts. Total scroll length is
  `timeline duration × 11% of the viewport height` (see `unit()` in `story/index.ts`).
- **Colors and fonts:** all tokens are at the top of `src/styles.css`; the dark theme
  (`:root[data-mode="dark"]`) is right below them. The console and the rugged device use the `--app-*` tokens and `--rugged`.
- **Characters:** cursor names and their chat lines are in `CAST` in `story/index.ts`.
- **Contact:** the team address (`Product_Designers-Global@soti.net`) is in the contact section of `index.html`.

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
- Opens in the light theme. The sun/moon switch in the top bar turns on the dark theme (with a
  circular reveal where the browser supports view transitions), and the choice is remembered.
- Works down to phone widths (the stage stacks above the text).

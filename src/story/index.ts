import { gsap, ScrollTrigger, reducedMotion, scrollToY } from '../lib/motion';
import { splitWords } from '../lib/split';
import { CHAPTERS, T, type ChapterId } from './timing';
import type { Ctx } from './types';
import { cursor, fitPills } from './svg';
import { applyRig } from './rig';
import { sparkSvg, animateSpark } from './scenes/spark';
import { boardSvg, selSvg, animateBrainstorm } from './scenes/brainstorm';
import { deviceSvg, dsSvg, wireNotesSvg, animateWireframe, animateHifi } from './scenes/device';
import { buildSvg, animateBuild } from './scenes/build';
import { handBackSvg, handFrontSvg, impactSvg, animateImpact } from './scenes/impact';

const DEFS = /* svg */ `
<defs>
  <radialGradient id="g-glow">
    <stop offset="0" class="glow-stop" stop-opacity="0.95"/>
    <stop offset="0.45" class="glow-stop" stop-opacity="0.4"/>
    <stop offset="1" class="glow-stop" stop-opacity="0"/>
  </radialGradient>
</defs>`;

const CAST = [
  cursor('research', 'Researcher', [
    { id: 'chat-research-1', text: '40+ tickets this week' },
    { id: 'chat-research-2', text: 'Users asked for search!' },
  ]),
  cursor('pm', 'Product manager', [
    { id: 'chat-pm-1', text: 'It’s on our Q3 roadmap', left: true },
    { id: 'chat-pm-2', text: 'Love the filter chips' },
  ]),
  cursor('eng', 'Engineer', [{ id: 'chat-eng-1', text: 'Merged. Shipping today!', left: true }]),
  cursor('design', 'Designer', [
    { id: 'chat-design-1', text: '6 taps? Let’s fix that.', left: true },
    { id: 'chat-design-2', text: 'Ideas, everyone. Go wild.', left: true },
    { id: 'chat-design-3', text: 'Now, the fun part' },
  ]),
].join('');

const VIEWBOX_WIDE = '80 40 1050 750';
const VIEWBOX_NARROW = '110 40 990 760';

export function initStory(): void {
  const section = document.querySelector<HTMLElement>('#process');
  const pin = section?.querySelector<HTMLElement>('[data-story-pin]');
  const svg = section?.querySelector<SVGSVGElement>('[data-stage]');
  const world = section?.querySelector<HTMLElement>('[data-world]');
  if (!section || !pin || !svg || !world) return;

  svg.innerHTML =
    DEFS +
    `<g id="camera">` +
    boardSvg +
    sparkSvg +
    dsSvg +
    wireNotesSvg +
    handBackSvg +
    deviceSvg +
    handFrontSvg +
    selSvg +
    buildSvg +
    impactSvg +
    `<g id="cast">${CAST}</g>` +
    `</g>`;
  fitPills(svg);

  const narrow = window.matchMedia('(max-width: 860px)');
  const setViewBox = () => svg.setAttribute('viewBox', narrow.matches ? VIEWBOX_NARROW : VIEWBOX_WIDE);
  setViewBox();
  narrow.addEventListener('change', setViewBox);

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
  const renderFns: (() => void)[] = [];
  const ctx: Ctx = {
    tl,
    svg,
    q: <T extends Element = SVGGraphicsElement>(selector: string) => {
      const el = svg.querySelector<T>(selector);
      if (!el) throw new Error(`Story stage is missing ${selector}`);
      return el;
    },
    qa: <T extends Element = SVGGraphicsElement>(selector: string) => Array.from(svg.querySelectorAll<T>(selector)),
    onRender: (fn) => renderFns.push(fn),
  };

  // The cast waits just off stage
  gsap.set(ctx.q('#cur-design'), { x: 620, y: 900 });
  gsap.set(ctx.q('#cur-pm'), { x: 1320, y: 140 });
  gsap.set(ctx.q('#cur-research'), { x: -160, y: 150 });
  gsap.set(ctx.q('#cur-eng'), { x: 1330, y: 420 });

  animateSpark(ctx);
  animateBrainstorm(ctx);
  animateWireframe(ctx);
  animateHifi(ctx);
  animateBuild(ctx);
  animateImpact(ctx, world);
  animateChapterCopy(tl, pin);
  tl.to({}, { duration: 0.01 }, T.end);

  // Chrome around the stage: chapter label, zoom level, progress rail
  const stageLabel = pin.querySelector<HTMLElement>('[data-stage-label]');
  const zoomLabel = pin.querySelector<HTMLElement>('[data-zoom]');
  const railFill = pin.querySelector<HTMLElement>('[data-rail-fill]');
  const railButtons = Array.from(pin.querySelectorAll<HTMLButtonElement>('[data-goto]'));
  const deviceEl = ctx.q<SVGGElement>('#device');
  const cameraEl = ctx.q<SVGGElement>('#camera');
  let current = -1;

  const render = () => {
    renderFns.forEach((fn) => fn());
    applyRig(deviceEl, cameraEl, zoomLabel);
    const time = tl.time();
    let idx = 0;
    CHAPTERS.forEach((c, i) => {
      if (time >= T[c.id] - 0.2) idx = i;
    });
    if (idx !== current) {
      current = idx;
      if (stageLabel) stageLabel.textContent = CHAPTERS[idx].label;
      railButtons.forEach((b, i) => (i === idx ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')));
    }
    if (railFill) railFill.style.transform = `scaleX(${tl.progress().toFixed(4)})`;
  };
  tl.eventCallback('onUpdate', render);
  render();

  const unit = () => Math.max(window.innerHeight * 0.11, 72);
  const st = ScrollTrigger.create({
    trigger: section,
    pin,
    start: 'top top',
    end: () => `+=${Math.round(tl.duration() * unit())}`,
    scrub: reducedMotion ? true : 0.9,
    animation: tl,
    invalidateOnRefresh: true,
    anticipatePin: 1,
  });

  if (import.meta.env.DEV) (window as unknown as { __story: unknown }).__story = { tl, st };

  railButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.goto as ChapterId;
      const time = id === 'spark' ? 0 : T[id] + 1.4;
      const y = st.start + (st.end - st.start) * (time / tl.duration());
      scrollToY(y, true);
    });
  });
}

/** Chapter copy fades/slides in and out on the same timeline as the drawing. */
function animateChapterCopy(tl: gsap.core.Timeline, pin: HTMLElement): void {
  const chapters = Array.from(pin.querySelectorAll<HTMLElement>('.chapter'));
  chapters.forEach((chapter, i) => {
    const id = chapter.dataset.chapter as ChapterId;
    const start = T[id];
    const next = CHAPTERS[i + 1] ? T[CHAPTERS[i + 1].id] : null;
    const title = chapter.querySelector<HTMLElement>('.chapter__title')!;
    const words = splitWords(title);
    const rest = chapter.querySelectorAll('.chapter__eyebrow, .chapter__body, .chapter__tags li');

    // Opacity only (no visibility:hidden) so screen readers can still read every chapter in order.
    if (i > 0) {
      gsap.set(chapter, { opacity: 0, pointerEvents: 'none' });
      gsap.set(words, { yPercent: 115 });
      gsap.set(rest, { opacity: 0, y: 16 });
      tl.set(chapter, { opacity: 1, y: 0, pointerEvents: 'auto' }, start + 0.2);
      tl.to(words, { yPercent: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' }, start + 0.25);
      tl.to(rest, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, start + 0.35);
    }
    if (next !== null) {
      tl.to(chapter, { opacity: 0, y: -22, duration: 0.45, ease: 'power2.in' }, next - 0.4);
      tl.set(chapter, { pointerEvents: 'none' }, next);
    }
  });
}

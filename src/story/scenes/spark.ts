import { gsap } from '../../lib/motion';
import { T } from '../timing';
import type { Ctx } from '../types';
import { handLoop } from '../svg';

/* ── Chapter 1: an IT admin's ticket, a dip in enrollment, the roadmap and a design audit converge into a lightbulb. ── */

export const BULB_GLASS =
  'M556 410 C556 372 500 352 500 285 C500 230 545 185 600 185 C655 185 700 230 700 285 C700 352 644 372 644 410';
export const BULB_FILAMENT =
  'M580 410 V352 C580 330 596 328 594 346 C592 362 608 362 606 346 C604 328 620 330 620 352 V410';
export const BULB_BASE = `
  <rect class="ln" x="552" y="414" width="96" height="16" rx="8"/>
  <rect class="ln" x="558" y="434" width="84" height="16" rx="8"/>
  <path class="ln" d="M578 456 C584 474 616 474 622 456"/>`;

const rays = [-180, -150, -120, -90, -60, -30, 0]
  .map((deg) => {
    const a = (deg * Math.PI) / 180;
    const [x1, y1] = [600 + Math.cos(a) * 130, 285 + Math.sin(a) * 130];
    const [x2, y2] = [600 + Math.cos(a) * 168, 285 + Math.sin(a) * 168];
    return `<path class="ln" d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}"/>`;
  })
  .join('');

const DIP_LOOP = handLoop(336, 606, 38, 26, 1.2);

// Anchor points of the bulb outline, with Bézier handles where the curve is smooth.
const anchors: { x: number; y: number; h?: [number, number, number, number] }[] = [
  { x: 556, y: 410 },
  { x: 500, y: 285, h: [500, 352, 500, 230] },
  { x: 600, y: 185, h: [545, 185, 655, 185] },
  { x: 700, y: 285, h: [700, 230, 700, 352] },
  { x: 644, y: 410 },
];

export const sparkSvg = /* svg */ `
<g id="spark">
  <g id="connectors">
    <path class="ln-soft conn" id="conn-1" d="M432 230 C462 244 484 250 506 252"/>
    <path class="ln-soft conn" id="conn-2" d="M442 520 C482 498 482 384 512 344"/>
    <path class="ln-soft conn" id="conn-3" d="M778 236 C748 240 722 248 696 254"/>
    <path class="ln-soft conn" id="conn-4" d="M778 524 C730 510 722 382 690 344"/>
  </g>

  <g id="sig-feedback" class="sig">
    <text class="t-label" x="160" y="98">IT ADMIN TICKET</text>
    <path class="card" d="M176 112 H424 Q440 112 440 128 V190 Q440 206 424 206 H414 L432 232 L392 206 H176 Q160 206 160 190 V128 Q160 112 176 112 Z"/>
    <text class="t-hand" x="182" y="152" style="font-size:29px">312 devices stuck on</text>
    <text class="t-hand" x="182" y="185" style="font-size:29px">“Enrolling…” again?!</text>
  </g>

  <g id="sig-analytics" class="sig">
    <text class="t-label" x="150" y="456">FIRST-TRY ENROLLMENT</text>
    <rect class="card" x="150" y="470" width="290" height="190" rx="14"/>
    <path class="ln-soft" d="M178 500 V634 H418"/>
    <path class="ln-soft" d="M182 534 H414 M182 584 H414" stroke-dasharray="3 6" style="stroke-width:1.2"/>
    <path class="ln" id="dip-line" d="M182 530 C220 526 248 532 276 540 C300 548 312 610 336 612 C360 614 372 592 414 596"/>
    <path class="ln-accent" id="dip-loop" d="${DIP_LOOP}"/>
    <text class="t-hand is-accent" id="dip-note" x="238" y="618" text-anchor="middle" style="font-size:32px">−27%</text>
  </g>

  <g id="sig-roadmap" class="sig">
    <text class="t-label" x="780" y="106">PRODUCT GOALS</text>
    <rect class="card" x="780" y="120" width="270" height="182" rx="14"/>
    <text class="t-ui" x="802" y="156" style="font-size:18px;font-weight:700">Q3 roadmap</text>
    <rect class="ln-2" x="802" y="174" width="16" height="16" rx="4"/>
    <path class="ln" d="M805 182 L809 186 L816 177" style="stroke-width:2"/>
    <rect class="fill-hair" x="830" y="178" width="150" height="8" rx="4"/>
    <rect class="ln-2" x="802" y="208" width="16" height="16" rx="4"/>
    <rect class="s-yellow" id="roadmap-hl" x="826" y="203" width="160" height="26" rx="4"/>
    <text class="t-ui" x="834" y="221.5" style="font-size:15px;font-weight:600;fill:var(--sticky-ink)">Enrollment revamp</text>
    <rect class="ln-2" x="802" y="242" width="16" height="16" rx="4"/>
    <rect class="fill-hair" x="830" y="246" width="118" height="8" rx="4"/>
    <rect class="ln-2" x="802" y="270" width="16" height="16" rx="4"/>
    <rect class="fill-hair" x="830" y="274" width="170" height="8" rx="4"/>
  </g>

  <g id="sig-audit" class="sig">
    <text class="t-label" x="780" y="466">DESIGN AUDIT</text>
    <rect class="card" x="780" y="480" width="270" height="170" rx="14"/>
    <rect class="ln-2" x="802" y="500" width="62" height="128" rx="10"/>
    <path class="ln-accent" id="tap-path" d="M818 522 L846 540 L820 560 L848 578 L822 598 L842 614" stroke-dasharray="2 6" style="stroke-width:2"/>
    <g id="tap-dots" class="fill-accent">
      <circle cx="818" cy="522" r="5"/><circle cx="846" cy="540" r="5"/><circle cx="820" cy="560" r="5"/>
      <circle cx="848" cy="578" r="5"/><circle cx="822" cy="598" r="5"/><circle cx="842" cy="614" r="5"/>
    </g>
    <text class="t-hand" x="882" y="532" style="font-size:28px">14 steps</text>
    <text class="t-hand" x="882" y="564" style="font-size:28px">to enroll</text>
    <text class="t-hand" x="882" y="596" style="font-size:28px">one device.</text>
    <path class="ln-measure" id="audit-underline" d="M882 540 C906 537 940 538 966 541" style="stroke-width:2.5"/>
  </g>

  <g id="pulses" class="fill-accent">
    <circle id="pulse-1" r="6"/><circle id="pulse-2" r="6"/><circle id="pulse-3" r="6"/><circle id="pulse-4" r="6"/>
  </g>

  <g id="bulb">
    <circle id="bulb-glow" cx="600" cy="285" r="230" fill="url(#g-glow)"/>
    <g id="bulb-rays">${rays}</g>
    <path id="bulb-fill" class="fill-surface" d="${BULB_GLASS} Z"/>
    <path id="bulb-lit" d="${BULB_GLASS} Z" style="fill:var(--glow)"/>
    <path id="bulb-glass" class="ln" d="${BULB_GLASS}"/>
    <path id="bulb-filament" class="ln-accent" d="${BULB_FILAMENT}"/>
    <g id="bulb-base">${BULB_BASE}</g>
  </g>

  <g id="pen-anchors">
    ${anchors
      .map(
        (a, i) => `
      <g class="anchor" id="anchor-${i}">
        ${a.h ? `<path class="ln-accent" style="stroke-width:1.5" d="M${a.h[0]} ${a.h[1]} L${a.h[2]} ${a.h[3]}"/><circle class="sel__handle" cx="${a.h[0]}" cy="${a.h[1]}" r="4"/><circle class="sel__handle" cx="${a.h[2]}" cy="${a.h[3]}" r="4"/>` : ''}
        <rect class="sel__handle" x="${a.x - 5}" y="${a.y - 5}" width="10" height="10"/>
      </g>`,
      )
      .join('')}
  </g>

  <g id="pen">
    <g transform="scale(1.4)">
      <path class="fill-ink" d="M0 0 L-7.5 -15 L-4 -27 H4 L7.5 -15 Z"/>
      <path d="M0 -1 V-11" style="stroke:var(--surface);stroke-width:1.4"/>
      <circle cx="0" cy="-13" r="2.2" class="fill-surface"/>
    </g>
  </g>
</g>`;

export function animateSpark(ctx: Ctx): void {
  const { tl, q, qa } = ctx;
  const t = T.spark;

  // Resting state
  gsap.set(['#bulb-glass', '#bulb-filament', '#bulb-base > *', '#bulb-rays path', '.conn', '#dip-line', '#dip-loop', '#tap-path', '#audit-underline'].map((s) => qa(s)).flat(), {
    drawSVG: '0%',
  });
  gsap.set(q('#bulb-glow'), { autoAlpha: 0, attr: { r: 110 } });
  gsap.set([q('#bulb-fill'), q('#bulb-lit')], { autoAlpha: 0 });
  gsap.set(qa('.anchor'), { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%' });
  gsap.set(qa('.sig'), { autoAlpha: 0 });
  gsap.set(q('#sig-feedback'), { x: -140 });
  gsap.set(q('#sig-roadmap'), { x: 140 });
  gsap.set(q('#sig-analytics'), { y: 40 });
  gsap.set(q('#sig-audit'), { y: 40 });
  gsap.set(q('#dip-note'), { autoAlpha: 0, y: 8 });
  gsap.set(qa('#tap-dots circle'), { scale: 0, transformOrigin: '50% 50%' });
  gsap.set(qa('#pulses circle'), { autoAlpha: 0 });
  gsap.set(q('#pen'), { autoAlpha: 0 });
  gsap.set(q('#roadmap-hl'), { scaleX: 0, transformOrigin: '0% 50%' });

  // The pen tool draws the bulb outline, dropping anchor points as it goes.
  tl.set(q('#pen'), { autoAlpha: 1 }, t);
  tl.to(q('#bulb-glass'), { drawSVG: '100%', duration: 2, ease: 'none' }, t);
  tl.to(
    q('#pen'),
    { motionPath: { path: q<SVGPathElement>('#bulb-glass'), align: q<SVGPathElement>('#bulb-glass'), alignOrigin: [0.5, 1] }, duration: 2, ease: 'none' },
    t,
  );
  [0, 0.27, 0.5, 0.73, 1].forEach((f, i) => {
    tl.to(q(`#anchor-${i}`), { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'back.out(3)' }, t + f * 2 - 0.05);
  });
  tl.to(q('#bulb-fill'), { autoAlpha: 1, duration: 0.6 }, t + 1.6);
  tl.to(qa('#bulb-base > *'), { drawSVG: '100%', duration: 0.4, stagger: 0.12, ease: 'none' }, t + 2);
  tl.to(q('#pen'), { autoAlpha: 0, duration: 0.2 }, t + 2.4);
  tl.to(qa('.anchor'), { autoAlpha: 0, duration: 0.3, stagger: 0.04 }, t + 2.5);

  // Researcher brings user feedback
  tl.to(q('#cur-research'), { x: 420, y: 128, duration: 1, ease: 'power3.out' }, t + 0.9);
  tl.to(q('#sig-feedback'), { x: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' }, t + 0.9);
  tl.to(q('#cur-research'), { x: 196, y: 238, duration: 0.6 }, t + 2.1);

  // PM brings the roadmap
  tl.to(q('#cur-pm'), { x: 1010, y: 210, duration: 1, ease: 'power3.out' }, t + 1.6);
  tl.to(q('#sig-roadmap'), { x: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' }, t + 1.6);
  tl.to(q('#roadmap-hl'), { scaleX: 1, duration: 0.4, ease: 'power2.out' }, t + 2.5);
  tl.to(q('#cur-pm'), { x: 958, y: 306, duration: 0.5 }, t + 2.7);

  // Designer spots the dip in the numbers
  tl.to(q('#sig-analytics'), { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }, t + 2.6);
  tl.to(q('#dip-line'), { drawSVG: '100%', duration: 0.9, ease: 'none' }, t + 2.9);
  tl.to(q('#cur-design'), { x: 336 + 38, y: 606 - 10, duration: 0.8, ease: 'power3.out' }, t + 3.0);
  tl.to(q('#dip-loop'), { drawSVG: '100%', duration: 0.9, ease: 'none' }, t + 3.8);
  tl.to(
    q('#cur-design'),
    { motionPath: { path: q<SVGPathElement>('#dip-loop'), align: q<SVGPathElement>('#dip-loop'), alignOrigin: [0, 0] }, duration: 0.9, ease: 'none' },
    t + 3.8,
  );
  tl.to(q('#dip-note'), { autoAlpha: 1, y: 0, duration: 0.4 }, t + 4.5);

  // ...and the design audit
  tl.to(q('#sig-audit'), { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }, t + 4.3);
  tl.to(qa('#tap-dots circle'), { scale: 1, duration: 0.2, stagger: 0.08, ease: 'back.out(3)' }, t + 4.6);
  tl.to(q('#tap-path'), { drawSVG: '100%', duration: 0.6, ease: 'none' }, t + 4.6);
  tl.to(q('#cur-design'), { x: 990, y: 662, duration: 0.7 }, t + 4.8);
  tl.to(q('#audit-underline'), { drawSVG: '100%', duration: 0.4, ease: 'none' }, t + 5.3);

  // Cursor chat
  say(ctx, '#chat-research-1', t + 2.4, 2.6);
  say(ctx, '#chat-pm-1', t + 3.1, 2.4);
  say(ctx, '#chat-design-1', t + 5.4, 2.2);

  // Signals flow into the bulb
  tl.to(qa('.conn'), { drawSVG: '100%', duration: 0.7, stagger: 0.15, ease: 'none' }, t + 5.6);
  qa<SVGCircleElement>('#pulses circle').forEach((dot, i) => {
    const path = q<SVGPathElement>(`#conn-${i + 1}`);
    const at = t + 6.1 + i * 0.18;
    tl.set(dot, { autoAlpha: 1 }, at);
    tl.to(dot, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration: 0.7, ease: 'power1.in' }, at);
    tl.to(dot, { autoAlpha: 0, duration: 0.12 }, at + 0.66);
  });

  // The spark
  tl.to(q('#bulb-filament'), { drawSVG: '100%', duration: 0.7, ease: 'none' }, t + 6.9);
  tl.to(q('#bulb-glow'), { autoAlpha: 1, attr: { r: 230 }, duration: 0.8, ease: 'power2.out' }, t + 7.5);
  tl.to(q('#bulb-lit'), { autoAlpha: 0.55, duration: 0.6 }, t + 7.5);
  tl.to(qa('#bulb-rays path'), { drawSVG: '100%', duration: 0.35, stagger: 0.06, ease: 'power1.out' }, t + 7.6);

  // Everyone gathers around the idea
  tl.to(q('#cur-research'), { x: 432, y: 368, duration: 0.8 }, t + 8.2);
  tl.to(q('#cur-pm'), { x: 728, y: 392, duration: 0.8 }, t + 8.25);
  tl.to(q('#cur-design'), { x: 644, y: 494, duration: 0.8 }, t + 8.3);
}

/** Show a cursor-chat bubble, then hide it. */
export function say(ctx: Ctx, id: string, at: number, hold: number): void {
  const el = ctx.q(id);
  gsap.set(el, { autoAlpha: 0, scale: 0.6, transformOrigin: '0% 0%' });
  ctx.tl.to(el, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, at);
  ctx.tl.to(el, { autoAlpha: 0, scale: 0.8, duration: 0.25, ease: 'power1.in' }, at + hold);
}

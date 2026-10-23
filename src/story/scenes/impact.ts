import { gsap } from '../../lib/motion';
import { T } from '../timing';
import type { Ctx } from '../types';
import { device } from '../rig';
import { metrics } from './prototype';
import { BULB_BASE, BULB_FILAMENT, BULB_GLASS } from './spark';

/* ── Chapter 6: off the canvas, into the warehouse. The admin's rollout finishes, the fleet lights up,
   and a worker's rugged device says "You're all set". Then the next spark.
   The hand art is drawn around a device at (600, 372) × 0.86, then shifted by WORKER. ── */

const WORKER = { x: 170, y: 20 };

const FINGERS = [
  { cy: 300, h: 36, tip: 444 },
  { cy: 339, h: 38, tip: 437 },
  { cy: 378, h: 36, tip: 441 },
  { cy: 414, h: 30, tip: 452 },
];

const finger = (f: (typeof FINGERS)[number]) => {
  const top = f.cy - f.h / 2;
  const bot = f.cy + f.h / 2;
  const r = f.h / 2;
  return `M500 ${top} H${f.tip + r} A${r} ${r} 0 0 0 ${f.tip + r} ${bot} H500`;
};

const PALM_FILL =
  'M474 429 C466 446 462 470 462 500 C462 560 476 612 506 652 C524 676 540 704 548 744 L556 830 L790 830 L780 744 C776 704 774 676 768 640 L729 560 L729 429 Z';
const PALM_LEFT = 'M474 429 C466 446 462 470 462 500 C462 560 476 612 506 652 C524 676 540 704 548 744 L552 790';
const PALM_RIGHT = 'M784 790 L780 744 C776 704 774 676 768 642';
const THUMB_LINE = 'M768 642 C762 600 748 560 735.4 515 A20 20 0 0 0 696.6 525 C704 560 714 606 722 650';
const THUMB_FILL = `${THUMB_LINE} L768 642 Z`;
const SLEEVE = 'M540 750 C610 740 720 738 790 748 L800 830 L530 830 Z';

const STEPS = ['Connected to Wi-Fi', 'Enrolled with your company', '12 of 12 apps installed', 'Security policies applied'];

/** A rugged Android device, in the same local coordinates the hand was drawn for. */
const rugged = /* svg */ `
<g id="rugged" transform="translate(600 372) scale(0.86)">
  <rect x="-160" y="-312" width="320" height="624" rx="50" style="fill:var(--rugged);stroke:var(--ink);stroke-width:2.5"/>
  <rect x="166" y="-110" width="10" height="70" rx="4" style="fill:var(--rugged);stroke:var(--ink);stroke-width:2"/>
  <rect x="-148" y="-300" width="296" height="600" rx="40" class="app-bezel"/>
  <rect x="-134" y="-282" width="268" height="540" rx="16" class="app-bg"/>
  <rect x="-44" y="270" width="88" height="18" rx="9" style="fill:var(--rugged)"/>
  <text class="t-ui app-ink" x="-112" y="-258" style="font-size:12px;font-weight:700">9:41</text>
  <rect x="88" y="-268" width="20" height="10" rx="2.5" class="app-stroke" style="stroke-width:1.4"/><rect x="90" y="-266" width="13" height="6" rx="1" class="app-ink"/>

  <circle cx="0" cy="-196" r="32" class="app-primary"/>
  <path d="M0 -214 l16 6.5 v10 c0 9 -7 15 -16 18.5 c-9 -3.5 -16 -9.5 -16 -18.5 v-10 Z" style="fill:#fff"/>
  <text class="app-ink" x="0" y="-136" text-anchor="middle" style="font:700 19px var(--font-display);letter-spacing:-0.01em">Setting up your device</text>
  <text class="t-ui app-muted" x="0" y="-114" text-anchor="middle" style="font-size:12.5px">Managed by your IT team</text>
  ${STEPS.map((s, i) => {
    const y = -66 + i * 44;
    return `
  <g class="setup-step">
    <circle cx="-104" cy="${y}" r="12" style="fill:none;stroke:var(--app-line);stroke-width:2.2"/>
    <g class="step-done">
      <circle cx="-104" cy="${y}" r="12" style="fill:var(--app-success)"/>
      <path d="M-110 ${y} l4 4 l8 -8" style="fill:none;stroke:#fff;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round"/>
    </g>
    <text class="t-ui app-ink" x="-82" y="${y + 5}" style="font-size:14px;font-weight:600">${s}</text>
  </g>`;
  }).join('')}
  <g id="all-set">
    <text class="app-ink" x="0" y="146" text-anchor="middle" style="font:700 22px var(--font-display);letter-spacing:-0.01em">You’re all set</text>
    <text class="t-ui app-muted" x="0" y="168" text-anchor="middle" style="font-size:12.5px">Took 2 min 40 s</text>
    <rect x="-112" y="194" width="224" height="44" rx="22" class="app-primary"/>
    <text class="t-ui app-white" x="0" y="221" text-anchor="middle" style="font-size:15px;font-weight:700">Start shift</text>
  </g>
  <circle class="ripple" cx="20" cy="216" r="6" style="fill:none;stroke:var(--accent);stroke-width:3"/>
  <circle class="ripple" cx="20" cy="216" r="6" style="fill:none;stroke:var(--accent);stroke-width:2.4"/>
</g>`;

const bulbMini = `
  <g id="mini-bulb" transform="translate(1054 476) scale(0.26) translate(-600 -330)">
    <circle id="mini-glow" cx="600" cy="285" r="230" fill="url(#g-glow)"/>
    <path class="fill-surface" d="${BULB_GLASS} Z"/>
    <path class="ln mini-ln" d="${BULB_GLASS}" style="stroke-width:8"/>
    <path class="ln-accent mini-ln" d="${BULB_FILAMENT}" style="stroke-width:9"/>
    <g class="mini-base" style="stroke-width:8">${BULB_BASE.replace(/class="ln"/g, 'class="ln mini-ln" style="stroke-width:8"')}</g>
  </g>`;

const FLEET = { x: 994, y: 142, cols: 4, rows: 6, dx: 32, dy: 40 };

export const workerSvg = /* svg */ `
<g id="worker" transform="translate(${WORKER.x} ${WORKER.y})">
  <g id="worker-lift">
    <g id="hand-back">
      <path id="palm-fill" class="fill-surface" d="${PALM_FILL}"/>
      ${FINGERS.map((f, i) => `<path class="card finger" id="finger-${i}" d="${finger(f)}"/>`).join('')}
      <path class="ln hand-line" d="${PALM_LEFT}"/>
      <path class="ln hand-line" d="${PALM_RIGHT}"/>
      <path id="sleeve" d="${SLEEVE}" style="fill:var(--accent);stroke:var(--ink);stroke-width:2.5;stroke-linejoin:round"/>
      <path class="ln" d="M546 776 C620 766 716 765 794 776" style="stroke-width:2;opacity:0.45"/>
    </g>
    ${rugged}
    <g id="hand-front">
      <path id="thumb-fill" class="fill-surface" d="${THUMB_FILL}"/>
      <path id="thumb" class="ln" d="${THUMB_LINE}"/>
      <path class="ln hand-line" d="M722 650 C727 664 735 673 748 679" style="stroke-width:2;opacity:0.5"/>
    </g>
  </g>
</g>`;

export const impactSvg = /* svg */ `
<g id="impact">
  <g id="admin-says" class="imp">
    <path class="card" d="M156 364 H290 L312 340 L322 364 H454 Q470 364 470 380 V436 Q470 452 454 452 H156 Q140 452 140 436 V380 Q140 364 156 364 Z"/>
    <text class="t-hand" x="160" y="400" style="font-size:27px">Whole warehouse enrolled</text>
    <text class="t-hand" x="160" y="432" style="font-size:27px">before the morning shift!</text>
  </g>

  <g id="growth" class="imp">
    <text class="t-label" x="150" y="500">FIRST-TRY ENROLLMENT</text>
    <rect class="card" x="150" y="514" width="272" height="168" rx="14"/>
    <path class="ln-soft" d="M176 538 V658 H404"/>
    <path class="ln-soft" d="M180 574 H400 M180 616 H400" stroke-dasharray="3 6" style="stroke-width:1.2"/>
    <path id="growth-line" class="ln" d="M180 644 C214 640 236 634 258 622 C292 604 318 566 398 554" style="stroke:var(--success);stroke-width:3"/>
    <circle id="growth-dot" cx="398" cy="554" r="6" style="fill:var(--success)"/>
    <text id="growth-note" class="t-hand is-success" x="238" y="594" text-anchor="middle" style="font-size:38px">98%</text>
  </g>

  <g id="fleet" class="imp">
    <text class="t-label" x="${FLEET.x - 4}" y="${FLEET.y - 20}" style="font-size:11px">READY FOR THE SHIFT</text>
    ${Array.from({ length: FLEET.cols * FLEET.rows }, (_, i) => {
      const x = FLEET.x + (i % FLEET.cols) * FLEET.dx;
      const y = FLEET.y + Math.floor(i / FLEET.cols) * FLEET.dy;
      return `<g class="fleet-dev"><rect x="${x}" y="${y}" width="20" height="30" rx="4" class="fill-surface" style="stroke:var(--ink-3);stroke-width:1.6"/><rect class="fleet-on" x="${x}" y="${y}" width="20" height="30" rx="4" style="fill:var(--success);stroke:var(--ink);stroke-width:1.6"/><rect x="${x + 4}" y="${y + 4}" width="12" height="17" rx="1.5" style="fill:#fff;opacity:0.85"/></g>`;
    }).join('')}
    <text class="t-mono" id="fleet-count" x="${FLEET.x - 4}" y="${FLEET.y + FLEET.rows * FLEET.dy + 14}" style="font-size:13px;font-weight:600;fill:var(--ink)">0 devices</text>
  </g>

  <g id="closing" class="imp">
    ${bulbMini}
    <text class="t-hand" x="1054" y="570" text-anchor="middle" style="font-size:26px">…and the next</text>
    <text class="t-hand" x="1054" y="600" text-anchor="middle" style="font-size:26px">spark begins.</text>
  </g>
</g>`;

export function animateImpact(ctx: Ctx, world: HTMLElement): void {
  const { tl, q, qa } = ctx;
  const t = T.impact;
  const fleet = { n: 0 };

  gsap.set(q('#worker-lift'), { autoAlpha: 0, y: 160 });
  gsap.set([...qa('.finger'), ...qa('.hand-line'), q('#thumb')], { drawSVG: '0%' });
  gsap.set([...qa('.finger'), q('#thumb-fill'), q('#palm-fill')], { fillOpacity: 0 });
  gsap.set(qa('.imp'), { autoAlpha: 0, y: 18 });
  gsap.set(q('#growth-line'), { drawSVG: '0%' });
  gsap.set([q('#growth-dot'), q('#growth-note')], { autoAlpha: 0 });
  gsap.set(qa('.fleet-on'), { autoAlpha: 0 });
  gsap.set(qa('.mini-ln'), { drawSVG: '0%' });
  gsap.set(q('#mini-glow'), { autoAlpha: 0 });
  gsap.set(qa('.step-done'), { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%' });
  gsap.set(q('#all-set'), { autoAlpha: 0, y: 12 });
  gsap.set(qa('#rugged .ripple'), { autoAlpha: 0 });

  // Clear the workspace; collaborators leave the canvas
  tl.to([q('#editor'), q('#comment'), q('#comment-lead'), q('#release'), q('#qa'), q('#redlines'), q('#pin'), q('#frame-label')], {
    autoAlpha: 0,
    duration: 0.45,
    stagger: 0.04,
  }, t);
  tl.to(q('#cur-eng'), { x: 1320, y: 760, duration: 0.9, ease: 'power2.in' }, t + 0.1);
  tl.to(q('#cur-pm'), { x: 1300, y: -80, duration: 0.9, ease: 'power2.in' }, t + 0.15);
  tl.to(q('#cur-research'), { x: -140, y: 700, duration: 0.9, ease: 'power2.in' }, t + 0.2);
  tl.to(q('#cur-design'), { x: -140, y: 120, duration: 1, ease: 'power2.in' }, t + 0.3);

  // Leave the canvas: the dot grid gives way to warm daylight
  tl.to(world, { opacity: 1, duration: 1.1, ease: 'power1.inOut' }, t + 0.3);

  // The admin's console finishes the rollout
  tl.to(device, { x: 300, y: 222, s: 0.46, duration: 1.2, ease: 'power3.inOut' }, t + 0.4);
  tl.to(q('#group-2-ok'), { autoAlpha: 1, duration: 0.4 }, t + 1.4);
  tl.to(metrics, { enrolled: 1200, failed: 0, pct: 100, s0: 100, s1: 100, s2: 100, duration: 1, ease: 'power2.out' }, t + 1.4);
  tl.to(q('#admin-says'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }, t + 2);

  // The fleet lights up
  tl.to(q('#fleet'), { autoAlpha: 1, y: 0, duration: 0.4 }, t + 1.2);
  tl.to(qa('.fleet-on'), { autoAlpha: 1, duration: 0.12, stagger: { each: 0.05, from: 'start' } }, t + 1.7);
  tl.to(fleet, { n: 1200, duration: 1.2, ease: 'none' }, t + 1.7);
  const count = q<SVGTextElement>('#fleet-count');
  ctx.onRender(() => {
    const v = `${Math.round(fleet.n).toLocaleString('en-US')} devices`;
    if (count.textContent !== v) count.textContent = v;
  });

  // A worker's hand, a rugged device, and setup that just works
  const h0 = t + 1.6;
  tl.to(q('#worker-lift'), { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out' }, h0);
  tl.to(qa('.finger'), { drawSVG: '100%', duration: 0.6, stagger: 0.08, ease: 'power1.out' }, h0 + 0.1);
  tl.to(qa('.hand-line'), { drawSVG: '100%', duration: 0.7, ease: 'power1.out' }, h0 + 0.2);
  tl.to(q('#thumb'), { drawSVG: '100%', duration: 0.7, ease: 'power1.out' }, h0 + 0.3);
  tl.to([...qa('.finger'), q('#thumb-fill'), q('#palm-fill')], { fillOpacity: 1, duration: 0.4 }, h0 + 0.5);
  qa('.step-done').forEach((s, i) => {
    tl.to(s, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2.5)' }, h0 + 1.3 + i * 0.4);
  });
  tl.to(q('#all-set'), { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, h0 + 3);
  qa('#rugged .ripple').forEach((rip, i) => {
    tl.set(rip, { autoAlpha: 1, attr: { r: 6 } }, h0 + 3.7 + i * 0.15);
    tl.to(rip, { attr: { r: 46 }, autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, h0 + 3.7 + i * 0.15);
  });

  // Results
  const r0 = h0 + 3.4; // ≈ 62
  tl.to(q('#growth'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, r0);
  tl.to(q('#growth-line'), { drawSVG: '100%', duration: 0.9, ease: 'power1.inOut' }, r0 + 0.3);
  tl.to([q('#growth-dot'), q('#growth-note')], { autoAlpha: 1, duration: 0.3, stagger: 0.15 }, r0 + 1.1);

  // The loop closes
  const c0 = r0 + 1.7; // ≈ 63.7
  tl.to(q('#closing'), { autoAlpha: 1, y: 0, duration: 0.4 }, c0);
  tl.to(qa('.mini-ln'), { drawSVG: '100%', duration: 0.6, stagger: 0.08, ease: 'none' }, c0 + 0.1);
  tl.to(q('#mini-glow'), { autoAlpha: 1, duration: 0.5 }, c0 + 0.8);
}

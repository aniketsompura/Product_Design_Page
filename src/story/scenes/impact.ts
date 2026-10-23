import { gsap } from '../../lib/motion';
import { T } from '../timing';
import type { Ctx } from '../types';
import { heart, star } from '../svg';
import { camera } from '../rig';
import { moveDevice } from './device';
import { BULB_BASE, BULB_FILAMENT, BULB_GLASS } from './spark';

/* ── Chapter 6: off the canvas, into a hand. Someone finds their receipt, and the loop begins again. ──
   Phone sits at (600, 372) scaled 0.86 → left 471, right 729, top 114, bottom 630. */

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

// The back of the hand and palm sit behind the phone; only the edges below and beside it show.
const PALM_FILL =
  'M474 429 C466 446 462 470 462 500 C462 560 476 612 506 652 C524 676 540 704 548 744 L556 830 L790 830 L780 744 C776 704 774 676 768 640 L729 560 L729 429 Z';
const PALM_LEFT = 'M474 429 C466 446 462 470 462 500 C462 560 476 612 506 652 C524 676 540 704 548 744 L552 790';
const PALM_RIGHT = 'M784 790 L780 744 C776 704 774 676 768 642';
// Thumb rests over the right edge of the phone, ready to tap
const THUMB_LINE = 'M768 642 C762 600 748 560 735.4 515 A20 20 0 0 0 696.6 525 C704 560 714 606 722 650';
const THUMB_FILL = `${THUMB_LINE} L768 642 Z`;
const SLEEVE = 'M540 750 C610 740 720 738 790 748 L800 830 L530 830 Z';

const bulbMini = `
  <g id="mini-bulb" transform="translate(930 498) scale(0.3) translate(-600 -330)">
    <circle id="mini-glow" cx="600" cy="285" r="230" fill="url(#g-glow)"/>
    <path class="fill-surface" d="${BULB_GLASS} Z"/>
    <path class="ln mini-ln" d="${BULB_GLASS}" style="stroke-width:7"/>
    <path class="ln-accent mini-ln" d="${BULB_FILAMENT}" style="stroke-width:8"/>
    <g class="mini-base" style="stroke-width:7">${BULB_BASE.replace(/class="ln"/g, 'class="ln mini-ln" style="stroke-width:7"')}</g>
  </g>`;

export const handBackSvg = /* svg */ `
<g id="hand-back">
  <path id="palm-fill" class="fill-surface" d="${PALM_FILL}"/>
  ${FINGERS.map((f, i) => `<path class="card finger" id="finger-${i}" d="${finger(f)}"/>`).join('')}
  <path class="ln hand-line" d="${PALM_LEFT}"/>
  <path class="ln hand-line" d="${PALM_RIGHT}"/>
  <path id="sleeve" d="${SLEEVE}" style="fill:var(--accent);stroke:var(--ink);stroke-width:2.5;stroke-linejoin:round"/>
  <path id="cuff" class="ln" d="M546 776 C620 766 716 765 794 776" style="stroke-width:2;opacity:0.45"/>
</g>`;

export const handFrontSvg = /* svg */ `
<g id="hand-front">
  <path id="thumb-fill" class="fill-surface" d="${THUMB_FILL}"/>
  <path id="thumb" class="ln" d="${THUMB_LINE}"/>
  <path class="ln hand-line" d="M722 650 C727 664 735 673 748 679" style="stroke-width:2;opacity:0.5"/>
</g>`;

export const impactSvg = /* svg */ `
<g id="impact">
  <g id="happy" class="imp">
    <path class="card" d="M176 120 H424 Q440 120 440 136 V198 Q440 214 424 214 H414 L438 242 L388 214 H176 Q160 214 160 198 V136 Q160 120 176 120 Z"/>
    <text class="t-hand" x="182" y="161" style="font-size:29px">Found it in two taps.</text>
    <text class="t-hand" x="182" y="194" style="font-size:29px">Okay, I love this.</text>
  </g>

  <g id="growth" class="imp">
    <text class="t-label" x="150" y="488">SEARCH SUCCESS RATE</text>
    <rect class="card" x="150" y="502" width="272" height="176" rx="14"/>
    <path class="ln-soft" d="M176 528 V654 H404"/>
    <path class="ln-soft" d="M180 566 H400 M180 610 H400" stroke-dasharray="3 6" style="stroke-width:1.2"/>
    <path id="growth-line" class="ln" d="M180 640 C214 636 236 630 258 618 C292 600 318 562 398 546" style="stroke:var(--success);stroke-width:3"/>
    <circle id="growth-dot" cx="398" cy="546" r="6" style="fill:var(--success)"/>
    <text id="growth-note" class="t-hand is-success" x="240" y="586" text-anchor="middle" style="font-size:36px">+48%</text>
  </g>

  <g id="rating" class="imp">
    <text class="t-label" x="780" y="116">APP STORE RATING</text>
    <rect class="card" x="780" y="130" width="270" height="114" rx="14"/>
    ${[0, 1, 2, 3, 4].map((i) => `<path class="rating-star" d="${star(812 + i * 38, 172, 15)}" style="fill:var(--glow);stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/>`).join('')}
    <text x="804" y="226" style="font:700 26px var(--font-display);fill:var(--ink);letter-spacing:-0.02em">4.8</text>
    <text class="t-label" x="852" y="224" style="font-size:11.5px;letter-spacing:0.04em">AFTER THE REDESIGN</text>
  </g>

  <g id="hearts">
    ${[
      [792, 330, 11],
      [826, 372, 8],
      [770, 392, 7],
      [842, 316, 6],
    ]
      .map(([x, y, s]) => `<path class="heart" d="${heart(x, y, s)}" style="fill:var(--measure);stroke:none"/>`)
      .join('')}
  </g>

  <g id="closing" class="imp">
    ${bulbMini}
    <text class="t-hand" x="930" y="600" text-anchor="middle" style="font-size:31px">…and the next spark</text>
    <text class="t-hand" x="930" y="634" text-anchor="middle" style="font-size:31px">begins all over again.</text>
  </g>
</g>`;

export function animateImpact(ctx: Ctx, world: HTMLElement): void {
  const { tl, q, qa } = ctx;
  const t = T.impact;

  gsap.set(q('#hand-back'), { autoAlpha: 0, y: 140 });
  gsap.set(q('#hand-front'), { autoAlpha: 0, y: 140 });
  gsap.set([...qa('.finger'), ...qa('.hand-line'), q('#thumb')], { drawSVG: '0%' });
  gsap.set([...qa('.finger'), q('#thumb-fill'), q('#palm-fill')], { fillOpacity: 0 });
  gsap.set(qa('.imp'), { autoAlpha: 0, y: 18 });
  gsap.set(q('#growth-line'), { drawSVG: '0%' });
  gsap.set([q('#growth-dot'), q('#growth-note')], { autoAlpha: 0 });
  gsap.set(qa('.rating-star'), { scale: 0, transformOrigin: '50% 50%' });
  gsap.set(qa('.heart'), { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%' });
  gsap.set(qa('.mini-ln'), { drawSVG: '0%' });
  gsap.set(q('#mini-glow'), { autoAlpha: 0 });
  gsap.set(q('#hf-caret'), { autoAlpha: 0 });
  gsap.set(q('#hl-row'), { drawSVG: '0%' });
  gsap.set(q('#toast'), { scale: 0.7, transformOrigin: '50% 50%' });
  gsap.set(qa('.ripple'), { autoAlpha: 0 });

  // Clear the workspace; collaborators leave the canvas
  tl.to([q('#editor'), q('#comment'), q('#comment-lead'), q('#release'), q('#redlines'), q('#pin'), q('#frame-label')], {
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

  moveDevice(ctx, t + 0.4, { x: 600, y: 372, s: 0.86 }, 1.2);
  tl.to(camera, { s: 1.04, cy: 420, duration: 1.6, ease: 'power2.inOut' }, t + 0.4);

  // A hand
  const h0 = t + 1.2;
  tl.to([q('#hand-back'), q('#hand-front')], { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out' }, h0);
  tl.to(qa('.finger'), { drawSVG: '100%', duration: 0.6, stagger: 0.08, ease: 'power1.out' }, h0 + 0.1);
  tl.to(qa('.hand-line'), { drawSVG: '100%', duration: 0.7, ease: 'power1.out' }, h0 + 0.2);
  tl.to(q('#thumb'), { drawSVG: '100%', duration: 0.7, ease: 'power1.out' }, h0 + 0.3);
  tl.to([...qa('.finger'), q('#thumb-fill'), q('#palm-fill')], { fillOpacity: 1, duration: 0.4 }, h0 + 0.5);

  // Tap, type, find
  const p0 = h0 + 1.4; // ≈ 56.6
  qa('.ripple').forEach((rip, i) => {
    tl.set(rip, { autoAlpha: 1, attr: { r: 6 } }, p0 + i * 0.15);
    tl.to(rip, { attr: { r: 40 }, autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, p0 + i * 0.15);
  });
  tl.to(q('#hf-placeholder'), { autoAlpha: 0, duration: 0.2 }, p0 + 0.3);
  tl.set(q('#hf-caret'), { autoAlpha: 1, attr: { x: -76 } }, p0 + 0.3);
  tl.to(q('#typed-clip-rect'), { attr: { width: 52 }, duration: 0.6, ease: 'steps(6)' }, p0 + 0.4);
  tl.to(q('#hf-caret'), { attr: { x: -76 + 50 }, duration: 0.6, ease: 'steps(6)' }, p0 + 0.4);
  tl.to([q('#hf-row-1'), q('#hf-row-2')], { opacity: 0.18, duration: 0.4 }, p0 + 1.1);
  tl.to(q('#hl-row'), { autoAlpha: 1, drawSVG: '100%', duration: 0.5, ease: 'power1.inOut' }, p0 + 1.2);
  tl.to(q('#toast'), { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.2)' }, p0 + 1.6);
  tl.to(q('#hf-caret'), { autoAlpha: 0, duration: 0.1 }, p0 + 1.6);

  // Reactions and results
  const r0 = p0 + 2; // ≈ 58.6
  tl.to(q('#happy'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }, r0);
  qa('.heart').forEach((hEl, i) => {
    const at = r0 + 0.2 + i * 0.22;
    tl.to(hEl, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }, at);
    tl.to(hEl, { y: -150 - i * 20, x: (i % 2 ? 1 : -1) * 18, duration: 2.2, ease: 'power1.out' }, at);
    tl.to(hEl, { autoAlpha: 0, duration: 0.6 }, at + 1.6);
  });
  tl.to(q('#rating'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, r0 + 0.5);
  tl.to(qa('.rating-star'), { scale: 1, duration: 0.3, stagger: 0.1, ease: 'back.out(3)' }, r0 + 0.7);
  tl.to(q('#growth'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, r0 + 0.9);
  tl.to(q('#growth-line'), { drawSVG: '100%', duration: 0.9, ease: 'power1.inOut' }, r0 + 1.2);
  tl.to([q('#growth-dot'), q('#growth-note')], { autoAlpha: 1, duration: 0.3, stagger: 0.15 }, r0 + 2);

  // The loop closes
  const c0 = r0 + 2.6; // ≈ 61.2
  tl.to(q('#closing'), { autoAlpha: 1, y: 0, duration: 0.4 }, c0);
  tl.to(qa('.mini-ln'), { drawSVG: '100%', duration: 0.6, stagger: 0.08, ease: 'none' }, c0 + 0.1);
  tl.to(q('#mini-glow'), { autoAlpha: 1, duration: 0.5 }, c0 + 0.8);
}

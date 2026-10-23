import { gsap } from '../../lib/motion';
import { T } from '../timing';
import type { Ctx } from '../types';
import { arrow, sticky } from '../svg';
import { device } from '../rig';
import { say } from './spark';

/* ── Chapters 3 + 4: a phone frame gets wireframed, then painted into a high-fidelity screen. ──
   Everything inside #device is in phone-local coordinates: (0,0) is the center of the phone. */

const ROWS = [
  { y: 82, name: 'Corner Coffee', meta: 'Today · Food', amount: '$6.50', tone: 'app-mint' },
  { y: 136, name: 'Skyline Air', meta: 'Yesterday · Travel', amount: '$412.00', tone: 'app-lilac' },
  { y: 190, name: 'Green Grocer', meta: 'Mon · Groceries', amount: '$86.20', tone: 'app-coral' },
];

const rowGlyph = (i: number, y: number) =>
  [
    `M-108 ${y + 14} h16 v9 a7 7 0 0 1 -7 7 h-2 a7 7 0 0 1 -7 -7 Z M-92 ${y + 17} h2.5 a3.5 3.5 0 0 1 0 7 h-2.5`,
    `M-109 ${y + 22} L-87 ${y + 12} L-94 ${y + 31} L-98 ${y + 24} Z M-98 ${y + 24} L-87 ${y + 12}`,
    `M-110 ${y + 16} h24 l-3.5 14 h-17 Z M-104 ${y + 16} l4 -6 M-92 ${y + 16} l-4 -6`,
  ][i];

const wireframe = /* svg */ `
<g id="wf">
  <path class="ln-2 wf" d="M-114 -266 H-88" style="stroke-width:5"/>
  <rect class="ln-2 wf" x="88" y="-272" width="24" height="12" rx="3"/>
  <rect class="ln-2 wf" x="-118" y="-236" width="112" height="22" rx="5"/>
  <circle class="ln-2 wf" cx="102" cy="-225" r="15"/>
  <rect class="ln-2" id="wf-search" x="-118" y="-192" width="236" height="42" rx="21"/>
  <circle class="ln-2 wf" cx="-94" cy="-172" r="8"/>
  <path class="ln-2 wf" d="M-88 -166 L-82 -160"/>
  <path class="ln-soft wf" d="M-72 -171 H-6" style="stroke-width:5"/>
  <rect class="ln-2 wf" x="-118" y="-136" width="52" height="30" rx="15"/>
  <rect class="ln-2 wf" x="-58" y="-136" width="64" height="30" rx="15"/>
  <rect class="ln-2 wf" x="14" y="-136" width="70" height="30" rx="15"/>
  <rect class="ln-2" id="wf-hero" x="-118" y="-92" width="236" height="128" rx="18"/>
  <path class="ln-soft" id="wf-x" d="M-112 -86 L112 30 M112 -86 L-112 30"/>
  <path class="ln-2 wf" d="M-118 62 H-62" style="stroke-width:6"/>
  ${ROWS.map(
    (r) => `
  <rect class="ln-2 wf" x="-118" y="${r.y}" width="40" height="40" rx="12"/>
  <path class="ln-2 wf" d="M-66 ${r.y + 13} H36" style="stroke-width:5"/>
  <path class="ln-soft wf" d="M-66 ${r.y + 29} H-4" style="stroke-width:4"/>
  <path class="ln-2 wf" d="M78 ${r.y + 21} H116" style="stroke-width:5"/>`,
  ).join('')}
  <path class="ln-soft wf" d="M-140 246 H140"/>
  ${[-84, -28, 28, 84].map((x) => `<circle class="ln-2 wf" cx="${x}" cy="264" r="9"/>`).join('')}
</g>`;

const hifi = /* svg */ `
<g id="hifi" clip-path="url(#hifi-clip)">
  <rect class="app-bg" x="-140" y="-290" width="280" height="580" rx="31"/>
  <text class="t-ui app-ink" x="-112" y="-261" style="font-size:13px;font-weight:700">9:41</text>
  <rect x="64" y="-268" width="3" height="6" rx="1" class="app-ink"/><rect x="69" y="-270" width="3" height="8" rx="1" class="app-ink"/><rect x="74" y="-272" width="3" height="10" rx="1" class="app-ink"/>
  <rect x="88" y="-272" width="22" height="11" rx="3" class="app-stroke" style="stroke-width:1.4"/><rect x="90" y="-270" width="15" height="7" rx="1.5" class="app-ink"/>

  <text class="app-ink" x="-118" y="-213" style="font:700 27px var(--font-display);letter-spacing:-0.02em">Receipts</text>
  <circle cx="102" cy="-222" r="16" class="app-sun"/>
  <circle cx="96.5" cy="-225" r="1.8" class="app-ink"/><circle cx="107.5" cy="-225" r="1.8" class="app-ink"/>
  <path d="M96 -218 Q102 -213 108 -218" class="app-stroke" style="stroke-width:1.8"/>

  <rect x="-118" y="-192" width="236" height="42" rx="21" class="app-card" style="stroke:var(--app-line);stroke-width:1.5"/>
  <circle cx="-94" cy="-172" r="7" class="app-stroke-primary"/><path d="M-89 -167 L-84 -162" class="app-stroke-primary"/>
  <text id="hf-placeholder" class="t-ui app-muted" x="-76" y="-166" style="font-size:14.5px">Search receipts</text>
  <g clip-path="url(#typed-clip)">
    <text id="hf-typed" class="t-ui app-ink" x="-76" y="-166" style="font-size:14.5px;font-weight:600">coffee</text>
  </g>
  <rect id="hf-caret" x="-30" y="-181" width="2" height="19" class="app-primary"/>

  <rect x="-118" y="-136" width="52" height="30" rx="15" class="app-primary"/>
  <text class="t-ui app-white" x="-92" y="-116" text-anchor="middle" style="font-size:13px;font-weight:600">All</text>
  <rect x="-58" y="-136" width="64" height="30" rx="15" class="app-card" style="stroke:var(--app-line);stroke-width:1.5"/>
  <text class="t-ui app-ink" x="-26" y="-116" text-anchor="middle" style="font-size:13px;font-weight:600">Food</text>
  <rect x="14" y="-136" width="70" height="30" rx="15" class="app-card" style="stroke:var(--app-line);stroke-width:1.5"/>
  <text class="t-ui app-ink" x="49" y="-116" text-anchor="middle" style="font-size:13px;font-weight:600">Travel</text>

  <g id="hf-hero">
    <rect x="-118" y="-92" width="236" height="128" rx="18" class="app-primary"/>
    <circle cx="98" cy="-78" r="52" class="app-white" style="opacity:0.08"/>
    <circle cx="118" cy="20" r="34" class="app-white" style="opacity:0.06"/>
    <text class="app-white" x="-100" y="-62" style="font:500 12.5px var(--font-body);opacity:0.8">Spent in October</text>
    <text class="app-white" x="-100" y="-30" style="font:700 30px var(--font-display);letter-spacing:-0.02em">$1,284.50</text>
    ${[14, 24, 18, 30, 20, 34, 26]
      .map((h, i) => `<rect x="${-100 + i * 17}" y="${24 - h}" width="10" height="${h}" rx="3" class="app-sun" style="opacity:${i === 5 ? 1 : 0.55}"/>`)
      .join('')}
  </g>

  <text class="t-ui app-ink" x="-118" y="68" style="font-size:15px;font-weight:700">Recent</text>
  <text class="t-ui" x="118" y="68" text-anchor="end" style="font-size:12.5px;font-weight:600;fill:var(--app-primary)">See all</text>
  ${ROWS.map(
    (r, i) => `
  <g class="hf-row" id="hf-row-${i}">
    <rect x="-118" y="${r.y}" width="40" height="40" rx="12" class="${r.tone}"/>
    <path d="${rowGlyph(i, r.y)}" class="app-stroke" style="stroke-width:1.8"/>
    <text class="t-ui app-ink" x="-66" y="${r.y + 17}" style="font-size:14px;font-weight:600">${r.name}</text>
    <text class="t-ui app-muted" x="-66" y="${r.y + 34}" style="font-size:12px">${r.meta}</text>
    <text class="t-ui app-ink" x="118" y="${r.y + 25}" text-anchor="end" style="font-size:14px;font-weight:700">${r.amount}</text>
  </g>`,
  ).join('')}

  <path d="M-140 246 H140" style="fill:none;stroke:var(--app-line);stroke-width:1.2"/>
  <path d="M-92 272 V262 L-84 255 L-76 262 V272 Z" class="app-stroke-primary"/>
  <circle cx="-29" cy="262" r="7" class="app-stroke-muted"/><path d="M-24 267 L-19 272" class="app-stroke-muted"/>
  <path d="M20 258 V255 a2 2 0 0 1 2 -2 h3 M31 253 h3 a2 2 0 0 1 2 2 v3 M36 268 v3 a2 2 0 0 1 -2 2 h-3 M25 273 h-3 a2 2 0 0 1 -2 -2 v-3 M22 263 H34" class="app-stroke-muted"/>
  <circle cx="84" cy="258" r="5" class="app-stroke-muted"/><path d="M74 273 a10 8 0 0 1 20 0" class="app-stroke-muted"/>
  <rect x="-44" y="280" width="88" height="4" rx="2" class="app-ink"/>
</g>`;

const impactUi = /* svg */ `
<g id="impact-ui">
  <circle class="ripple" cx="-40" cy="-171" r="6" style="fill:none;stroke:var(--app-primary);stroke-width:2.5"/>
  <circle class="ripple" cx="-40" cy="-171" r="6" style="fill:none;stroke:var(--app-primary);stroke-width:2"/>
  <rect id="hl-row" x="-128" y="76" width="256" height="52" rx="14" style="fill:none;stroke:var(--app-primary);stroke-width:2.5"/>
  <g id="toast">
    <rect x="-98" y="196" width="196" height="38" rx="19" class="app-ink"/>
    <circle cx="-74" cy="215" r="10" class="app-sun"/>
    <path d="M-79 215 l3.5 3.5 l6.5 -7" style="fill:none;stroke:var(--app-ink);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round"/>
    <text class="t-ui app-white" x="-56" y="220" style="font-size:13.5px;font-weight:600">Found in 2 taps</text>
  </g>
</g>`;

/** Spec redlines (chapter 5). Values are in the units engineers see. */
const tick = (x1: number, y1: number, x2: number, y2: number) =>
  x1 === x2 ? `M${x1 - 5} ${y1} H${x1 + 5} M${x2 - 5} ${y2} H${x2 + 5}` : `M${x1} ${y1 - 5} V${y1 + 5} M${x2} ${y2 - 5} V${y2 + 5}`;
const measure = (id: string, x1: number, y1: number, x2: number, y2: number, label: string, lx: number, ly: number) => `
  <g class="redline" id="${id}">
    <path class="ln-measure rl-line" d="M${x1} ${y1} L${x2} ${y2} ${tick(x1, y1, x2, y2)}"/>
    <path class="ln-measure rl-lead" d="M${(x1 + x2) / 2} ${(y1 + y2) / 2} L${lx} ${ly}" stroke-dasharray="2 4" style="stroke-width:1.2"/>
    <g class="rl-tag" data-fit="7">
      <rect class="measure-bg" x="${lx - (lx < 0 ? 36 : 0)}" y="${ly - 11}" width="36" height="22" rx="5"/>
      <text class="measure-text" x="${lx - (lx < 0 ? 36 : 0) + 7}" y="${ly + 4.5}">${label}</text>
    </g>
  </g>`;

const redlines = /* svg */ `
<g id="redlines">
  ${measure('rl-gutter', -140, -171, -118, -171, '16', -166, -171)}
  ${measure('rl-gap', 102, -150, 102, -136, '12', 166, -143)}
  ${measure('rl-card', 129, -92, 129, 36, '140', 166, -28)}
  ${measure('rl-radius', -118, -74, -100, -92, 'r 24', -166, -96)}
</g>`;

const commentPin = /* svg */ `
<g id="pin">
  <path d="M110 -184 L104 -176 L116 -180 Z" style="fill:var(--role-eng)"/>
  <circle cx="120" cy="-194" r="14" style="fill:var(--role-eng);stroke:var(--surface);stroke-width:2.5"/>
  <text x="120" y="-189" text-anchor="middle" style="font:700 13px var(--font-body);fill:var(--on-role)">E</text>
</g>`;

export const deviceSvg = /* svg */ `
<g id="device" transform="translate(600 400)">
  <defs>
    <clipPath id="hifi-clip"><rect id="hifi-clip-rect" x="-140" y="-300" width="0" height="600"/></clipPath>
    <clipPath id="typed-clip"><rect id="typed-clip-rect" x="-78" y="-186" width="0" height="26"/></clipPath>
  </defs>
  <text id="frame-label" class="t-label" x="-150" y="-316" style="letter-spacing:0.02em;font-size:14px"><tspan style="fill:var(--accent)"># </tspan>Receipts · iPhone 16</text>
  <rect id="body-wire" class="card" x="-150" y="-300" width="300" height="600" rx="40"/>
  <rect id="body-real" class="app-bezel" x="-150" y="-300" width="300" height="600" rx="40"/>
  <rect id="screen-wire" class="fill-surface" x="-140" y="-290" width="280" height="580" rx="31"/>
  <g id="grid-cols">
    ${[-118, -56, 6, 68].map((x) => `<rect class="grid-col" x="${x}" y="-290" width="50" height="580" style="fill:var(--accent);fill-opacity:0.1"/>`).join('')}
  </g>
  ${wireframe}
  ${hifi}
  <rect id="island" class="app-bezel" x="-40" y="-281" width="80" height="22" rx="11"/>
  ${impactUi}
  ${redlines}
  ${commentPin}
  <g id="sweep">
    <path d="M0 -318 V318" style="stroke:var(--accent);stroke-width:12;opacity:0.18;stroke-linecap:round"/>
    <path d="M0 -318 V318" style="stroke:var(--accent);stroke-width:3;stroke-linecap:round"/>
  </g>
</g>`;

/* Annotations and the usability-test note sit on the canvas around the phone (stage coordinates). */
export const wireNotesSvg = /* svg */ `
<g id="wf-notes">
  <g class="wf-note"><text class="t-hand is-soft" x="384" y="214" text-anchor="end" style="font-size:29px">Search comes first</text><path class="ln-2 wf-arrow" d="${arrow(390, 218, 474, 226, 0.22, 11)}"/></g>
  <g class="wf-note"><text class="t-hand is-soft" x="820" y="262" style="font-size:29px">Filters as chips</text><path class="ln-2 wf-arrow" d="${arrow(816, 268, 704, 280, -0.22, 11)}"/></g>
  <g class="wf-note"><text class="t-hand is-soft" x="384" y="492" text-anchor="end" style="font-size:29px">Newest on top</text><path class="ln-2 wf-arrow" d="${arrow(390, 496, 474, 502, 0.22, 11)}"/></g>
  <g class="wf-note"><text class="t-hand is-soft" x="820" y="690" style="font-size:29px">Thumb-friendly tabs</text><path class="ln-2 wf-arrow" d="${arrow(816, 680, 712, 666, -0.22, 11)}"/></g>
  ${sticky('test-note', ['Tested with', '5 people.', '5 of 5 found it!'], 'green', { w: 158, h: 124, size: 23 })}
</g>`;

/* Design-system cards that surround the phone in chapter 4 (stage coordinates). */
const card = (id: string, x: number, y: number, w: number, h: number, label: string, body: string, right = '') => `
  <g class="ds-card" id="${id}">
    <rect class="card ds-frame" x="${x}" y="${y}" width="${w}" height="${h}" rx="12" style="stroke-width:1.6"/>
    <text class="t-label" x="${x + 18}" y="${y + 28}" style="font-size:12px">${label}</text>
    ${right ? `<text class="t-label" x="${x + w - 18}" y="${y + 28}" text-anchor="end" style="font-size:11px;letter-spacing:0.02em">${right}</text>` : ''}
    <g class="ds-body">${body}</g>
  </g>`;

const SWATCHES = ['app-primary', 'app-sun', 'app-mint', 'app-coral', 'app-ink'];

export const dsSvg = /* svg */ `
<g id="ds">
  ${card(
    'ds-color',
    150,
    130,
    240,
    112,
    'COLOR',
    SWATCHES.map((c, i) => `<circle class="swatch ${c}" cx="${150 + 36 + i * 42}" cy="${130 + 72}" r="15" style="stroke:var(--ink-3);stroke-width:1.5"/>`).join(''),
    '5 tokens',
  )}
  ${card(
    'ds-type',
    150,
    268,
    240,
    150,
    'TYPE',
    `<text class="t-ui" x="168" y="382" style="font:700 66px var(--font-display);letter-spacing:-0.04em">Aa</text>
     <text class="t-ui t-mono" x="268" y="334" style="font-size:12px;fill:var(--ink-2)">Title 28/34</text>
     <text class="t-ui t-mono" x="268" y="360" style="font-size:12px;fill:var(--ink-2)">Body 16/24</text>
     <text class="t-ui t-mono" x="268" y="386" style="font-size:12px;fill:var(--ink-2)">Small 12/16</text>`,
  )}
  ${card(
    'ds-space',
    150,
    444,
    240,
    124,
    'SPACING',
    [4, 8, 12, 16, 24]
      .map(
        (v, i) =>
          `<text class="t-ui t-mono" x="168" y="${444 + 52 + i * 15}" style="font-size:11px;fill:var(--ink-2)">${v}</text><rect class="measure-bg" x="196" y="${444 + 44 + i * 15}" width="${v * 5}" height="8" rx="2" style="opacity:0.85"/>`,
      )
      .join(''),
    '4-pt grid',
  )}
  ${card(
    'ds-comp',
    810,
    130,
    240,
    156,
    'COMPONENTS',
    `<rect x="828" y="174" width="120" height="40" rx="20" class="app-primary" id="ds-button"/>
     <text class="t-ui app-white" x="888" y="199" text-anchor="middle" style="font-size:14px;font-weight:600">Search</text>
     <rect x="966" y="180" width="54" height="30" rx="15" class="fill-hair"/>
     <rect id="ds-toggle-on" x="966" y="180" width="54" height="30" rx="15" class="app-primary"/>
     <circle id="ds-knob" cx="981" cy="195" r="11" class="fill-surface" style="stroke:var(--ink-3);stroke-width:1"/>
     <rect x="828" y="232" width="64" height="30" rx="15" class="fill-surface" style="stroke:var(--hairline);stroke-width:1.5"/>
     <text class="t-ui" x="860" y="252" text-anchor="middle" style="font-size:13px;font-weight:600">Food</text>
     <rect x="910" y="237" width="20" height="20" rx="5" class="app-primary"/>
     <path d="M915 247 l3.5 3.5 l6 -7" style="fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"/>
     <text class="t-ui t-mono" x="944" y="252" style="font-size:11px;fill:var(--component)">◇ 48 parts</text>`,
  )}
  ${card(
    'ds-motion',
    810,
    310,
    240,
    136,
    'MOTION',
    `<path class="ln-soft" d="M830 428 L888 428 M992 350 L934 350" style="stroke-width:1.2"/>
     <circle cx="888" cy="428" r="4" class="sel__handle"/><circle cx="934" cy="350" r="4" class="sel__handle"/>
     <path id="ds-curve" class="ln-accent" d="M830 428 C888 428 934 350 1030 350" style="stroke-width:2.5"/>
     <circle id="ds-dot" r="6" class="fill-accent"/>`,
    'ease-out 240ms',
  )}
  ${card(
    'ds-icons',
    810,
    470,
    240,
    98,
    'ICONS',
    `<g class="ln" style="stroke-width:2">
      <circle cx="842" cy="526" r="8"/><path d="M848 532 L854 538"/>
      <path d="M878 538 V526 L889 517 L900 526 V538 Z"/>
      <path d="M924 516 H942 V540 L937 536 L933 540 L929 536 L924 540 Z M928 524 H938 M928 530 H935"/>
      <path d="M966 534 V526 a9 9 0 0 1 18 0 V534 L987 538 H963 Z M972 541 a3 3 0 0 0 6 0"/>
      <circle cx="1020" cy="522" r="6"/><path d="M1009 541 a11 9 0 0 1 22 0"/>
    </g>`,
    '120 icons',
  )}
</g>`;

export function animateWireframe(ctx: Ctx): void {
  const { tl, q, qa } = ctx;
  const t = T.wireframe; // 24.5; the resize finishes around t + 1.9

  gsap.set(q('#device'), { autoAlpha: 0 });
  gsap.set(q('#body-wire'), { drawSVG: '0%', fillOpacity: 0 });
  gsap.set([q('#body-real'), q('#screen-wire'), q('#frame-label'), q('#island')], { autoAlpha: 0 });
  gsap.set(qa('.grid-col'), { scaleY: 0, transformOrigin: '50% 0%' });
  gsap.set(q('#wf-search'), { attr: { width: 0, height: 0 } });
  gsap.set(q('#wf-hero'), { attr: { width: 0, height: 0 } });
  gsap.set([...qa('#wf .wf'), q('#wf-x'), ...qa('.wf-arrow')], { drawSVG: '0%' });
  gsap.set(qa('.wf-note text'), { autoAlpha: 0, x: (i: number) => (i % 2 === 0 ? 12 : -12) });
  gsap.set(q('#test-note'), { x: 940, y: 470, rotation: -6, scale: 0.4, autoAlpha: 0, transformOrigin: '50% 50%' });
  gsap.set(q('#sweep'), { autoAlpha: 0 });
  gsap.set(qa('#impact-ui > *, #redlines, #pin'), { autoAlpha: 0 });

  // The phone outline takes over from the resized sticky note
  const take = t + 1.5;
  tl.set(q('#device'), { autoAlpha: 1 }, take);
  tl.to(q('#body-wire'), { drawSVG: '100%', duration: 0.7, ease: 'power1.inOut' }, take);
  tl.to(q('#body-wire'), { fillOpacity: 1, duration: 0.4 }, take + 0.6);
  tl.to(q('#island'), { autoAlpha: 1, duration: 0.3 }, take + 0.8);
  tl.to(q('#frame-label'), { autoAlpha: 1, duration: 0.3 }, take + 0.9);

  // Layout grid, then the rectangle tool
  const w0 = take + 1.1; // ≈ 27.1
  tl.to(qa('.grid-col'), { scaleY: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, w0);
  tl.to(q('#cur-design'), { x: 482, y: 208, duration: 0.45 }, w0);
  tl.to(q('#wf-search'), { attr: { width: 236, height: 42 }, duration: 0.6, ease: 'power1.inOut' }, w0 + 0.5);
  tl.to(q('#cur-design'), { x: 718, y: 250, duration: 0.6, ease: 'power1.inOut' }, w0 + 0.5);
  tl.to(q('#cur-design'), { x: 482, y: 308, duration: 0.35 }, w0 + 1.15);
  tl.to(q('#wf-hero'), { attr: { width: 236, height: 128 }, duration: 0.6, ease: 'power1.inOut' }, w0 + 1.55);
  tl.to(q('#cur-design'), { x: 718, y: 436, duration: 0.6, ease: 'power1.inOut' }, w0 + 1.55);
  tl.to(q('#wf-x'), { drawSVG: '100%', duration: 0.35, ease: 'none' }, w0 + 2.15);
  tl.to(qa('#wf .wf'), { drawSVG: '100%', duration: 0.4, stagger: 0.07, ease: 'power1.out' }, w0 + 0.3);
  tl.to(q('#cur-design'), { x: 760, y: 560, duration: 0.6 }, w0 + 2.5);
  tl.to(qa('.grid-col'), { opacity: 0.4, duration: 0.6 }, w0 + 2.6);

  // Annotations, from the rest of the team
  const a0 = w0 + 2.8; // ≈ 29.9
  tl.to(q('#cur-pm'), { x: 800, y: 330, duration: 0.7 }, a0 - 0.6);
  tl.to(q('#cur-research'), { x: 300, y: 600, duration: 0.7 }, a0 - 0.5);
  qa('.wf-note').forEach((note, i) => {
    tl.to(note.querySelector('.wf-arrow'), { drawSVG: '100%', duration: 0.35, ease: 'none' }, a0 + i * 0.35);
    tl.to(note.querySelector('text'), { autoAlpha: 1, x: 0, duration: 0.4 }, a0 + i * 0.35 + 0.1);
  });
  say(ctx, '#chat-pm-2', a0 + 0.5, 1.3);

  // Quick usability test
  const u0 = a0 + 1.9; // ≈ 31.8
  tl.to(q('#cur-research'), { x: 880, y: 540, duration: 0.6 }, u0 - 0.3);
  tl.to(q('#test-note'), { autoAlpha: 1, scale: 1, rotation: 5, duration: 0.4, ease: 'back.out(2)' }, u0 + 0.2);
}

export function animateHifi(ctx: Ctx): void {
  const { tl, q, qa } = ctx;
  const t = T.hifi;

  gsap.set(qa('.ds-card'), { autoAlpha: 0, y: 16 });
  gsap.set(qa('.ds-frame'), { drawSVG: '0%' });
  gsap.set(qa('.swatch'), { fillOpacity: 0 });
  gsap.set(q('#ds-toggle-on'), { autoAlpha: 0 });
  gsap.set(q('#ds-curve'), { drawSVG: '0%' });
  gsap.set(q('#ds-dot'), { autoAlpha: 0 });

  // Clear the wireframing workspace
  tl.to([...qa('.wf-note'), q('#test-note')], { autoAlpha: 0, duration: 0.4, stagger: 0.05 }, t);
  tl.to(q('#grid-cols'), { autoAlpha: 0, duration: 0.4 }, t + 0.1);

  // The design system arrives around the phone
  qa('.ds-card').forEach((cardEl, i) => {
    const at = t + 0.3 + i * 0.14;
    tl.to(cardEl, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, at);
    tl.to(cardEl.querySelector('.ds-frame'), { drawSVG: '100%', duration: 0.6, ease: 'power1.inOut' }, at);
  });
  tl.to(q('#cur-pm'), { x: 860, y: 606, duration: 0.7 }, t + 0.4);
  tl.to(q('#cur-research'), { x: 150, y: 598, duration: 0.7 }, t + 0.4);

  // A real bezel
  tl.to([q('#body-real'), q('#screen-wire')], { autoAlpha: 1, duration: 0.5 }, t + 1.1);

  // Pick colors
  tl.to(q('#cur-design'), { x: 186 + 6, y: 202 + 6, duration: 0.6 }, t + 1.0);
  qa('.swatch').forEach((s, i) => {
    tl.to(s, { fillOpacity: 1, duration: 0.25 }, t + 1.6 + i * 0.12);
  });
  tl.to(q('#cur-design'), { x: 368 + 6, y: 202 + 6, duration: 0.6, ease: 'power1.inOut' }, t + 1.6);
  say(ctx, '#chat-design-3', t + 1.9, 1.8);

  // Paint the wireframe into the real thing
  const s0 = t + 2.4;
  const SW = 3.2;
  tl.set(q('#sweep'), { autoAlpha: 1, x: -140 }, s0);
  tl.to(q('#hifi-clip-rect'), { attr: { width: 280 }, duration: SW, ease: 'power1.inOut' }, s0);
  tl.to(q('#sweep'), { x: 140, duration: SW, ease: 'power1.inOut' }, s0);
  tl.to(q('#cur-design'), { x: 460, y: 140, duration: 0.4 }, s0 - 0.4);
  tl.to(q('#cur-design'), { x: 740, duration: SW, ease: 'power1.inOut' }, s0);
  tl.to(q('#sweep'), { autoAlpha: 0, duration: 0.3 }, s0 + SW);
  tl.to(q('#wf'), { autoAlpha: 0, duration: 0.1 }, s0 + SW);

  // Micro-interactions: the components come alive
  const m0 = s0 + SW + 0.4; // ≈ 40
  tl.to(q('#cur-design'), { x: 990, y: 205, duration: 0.6 }, m0 - 0.3);
  tl.to(q('#ds-knob'), { attr: { cx: 1005 }, duration: 0.35, ease: 'back.out(2)' }, m0 + 0.3);
  tl.to(q('#ds-toggle-on'), { autoAlpha: 1, duration: 0.25 }, m0 + 0.3);
  tl.to(q('#ds-curve'), { drawSVG: '100%', duration: 0.6, ease: 'none' }, m0 + 0.2);
  tl.set(q('#ds-dot'), { autoAlpha: 1 }, m0 + 0.8);
  tl.to(
    q('#ds-dot'),
    { motionPath: { path: q<SVGPathElement>('#ds-curve'), align: q<SVGPathElement>('#ds-curve'), alignOrigin: [0.5, 0.5] }, duration: 0.9, ease: 'power3.out' },
    m0 + 0.8,
  );
  tl.to(q('#ds-button'), { scale: 0.93, transformOrigin: '50% 50%', duration: 0.15, yoyo: true, repeat: 1 }, m0 + 1.2);
}

/** Device transform is a proxy object (see rig.ts). */
export function moveDevice(ctx: Ctx, at: number, to: Partial<typeof device>, duration = 1, ease = 'power3.inOut'): void {
  ctx.tl.to(device, { ...to, duration, ease }, at);
}

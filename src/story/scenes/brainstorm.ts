import { gsap } from '../../lib/motion';
import { T } from '../timing';
import type { Ctx } from '../types';
import { handLoop, sticky, squiggle } from '../svg';
import { say } from './spark';
import { camera } from '../rig';

/* ── Chapter 2: a whiteboard fills with sticky notes, which get clustered, voted on, and one wins. ── */

type Color = 'yellow' | 'pink' | 'green' | 'lilac';
interface Note {
  lines: string[];
  color: Color;
  scatter: [number, number, number]; // x, y, rotation when first stuck on the board
  cluster: [number, number, number]; // after affinity mapping
  votes?: ('design' | 'pm' | 'research' | 'eng')[];
}

const CL = { find: 300, tidy: 600, share: 900 } as const;
const CY = 452;
const OFF = 54;

export const NOTES: Note[] = [
  // Find it
  { lines: ['Smart', 'search'], color: 'yellow', scatter: [262, 268, -6], cluster: [CL.find - OFF, CY - OFF, 0], votes: ['design', 'pm', 'research', 'eng'] },
  { lines: ['Filter by', 'store'], color: 'pink', scatter: [930, 560, 4], cluster: [CL.find + OFF, CY - OFF, 3] },
  { lines: ['Scan &', 'auto-tag'], color: 'green', scatter: [612, 262, -3], cluster: [CL.find - OFF, CY + OFF, -2], votes: ['research'] },
  { lines: ['Newest', 'first'], color: 'lilac', scatter: [394, 556, 5], cluster: [CL.find + OFF, CY + OFF, 4] },
  // Keep it tidy
  { lines: ['Auto', 'folders'], color: 'yellow', scatter: [790, 300, 5], cluster: [CL.tidy - OFF, CY - OFF, -3], votes: ['pm', 'design'] },
  { lines: ['Sort by', 'month'], color: 'lilac', scatter: [208, 470, 3], cluster: [CL.tidy + OFF, CY - OFF, 2] },
  { lines: ['Pin', 'favorites'], color: 'pink', scatter: [560, 470, 6], cluster: [CL.tidy - OFF, CY + OFF, 3] },
  { lines: ['Archive', 'old ones'], color: 'green', scatter: [1004, 300, -4], cluster: [CL.tidy + OFF, CY + OFF, -4] },
  // Share it
  { lines: ['Export', 'to PDF'], color: 'green', scatter: [430, 330, -2], cluster: [CL.share - OFF, CY - OFF, 2], votes: ['eng'] },
  { lines: ['Send to', 'accountant'], color: 'yellow', scatter: [740, 540, -5], cluster: [CL.share + OFF, CY - OFF, -3] },
  { lines: ['Split with', 'friends'], color: 'pink', scatter: [236, 614, 2], cluster: [CL.share - OFF, CY + OFF, -2] },
  { lines: ['Email', 'forward'], color: 'lilac', scatter: [1000, 470, 3], cluster: [CL.share + OFF, CY + OFF, 3] },
];

const PLACERS = ['design', 'pm', 'research'] as const;

const voteDots = (votes: Note['votes'] = []) =>
  votes.map((role, i) => `<circle class="vote vote--${role}" cx="${34 - i * 15}" cy="-32" r="7"/>`).join('');

const LABELS = [
  { x: CL.find, text: 'Find it' },
  { x: CL.tidy, text: 'Keep it tidy' },
  { x: CL.share, text: 'Share it' },
];

export const boardSvg = /* svg */ `
<g id="board">
  <rect id="board-frame" class="card" x="110" y="82" width="980" height="598" rx="18"/>
  <g id="board-tray">
    <path class="ln" d="M440 686 H760 V694 Q760 700 754 700 H446 Q440 700 440 694 Z" style="fill:var(--surface);stroke-width:2"/>
    <rect class="fill-ink" x="474" y="689" width="74" height="8" rx="4"/>
    <rect class="fill-accent" x="544" y="689" width="22" height="8" rx="4"/>
    <rect x="610" y="689" width="74" height="8" rx="4" style="fill:var(--role-pm)"/>
    <rect class="fill-ink" x="680" y="689" width="22" height="8" rx="4"/>
  </g>
  <defs><clipPath id="hmw-clip"><rect id="hmw-clip-rect" x="250" y="110" width="0" height="70"/></clipPath></defs>
  <g clip-path="url(#hmw-clip)">
    <text class="t-hand" x="256" y="160" style="font-size:38px">How might we help people find any receipt in seconds?</text>
  </g>
  <path id="hmw-underline" class="ln-accent" d="${squiggle(796, 1040, 176, 3.5, 8)}"/>

  <g id="cluster-labels">
    ${LABELS.map((l, i) => `<text class="t-hand cluster-label" id="cl-label-${i}" x="${l.x}" y="${CY - 120}" text-anchor="middle" style="font-size:32px">${l.text}</text>`).join('')}
  </g>
  <g id="lassos">
    ${LABELS.map((l, i) => `<path class="ln-accent lasso" id="lasso-${i}" d="${handLoop(l.x, CY + 2, 146, 132, i * 1.7)}"/>`).join('')}
  </g>

  <g id="notes">
    ${NOTES.map((n, i) => sticky(`note-${i}`, n.lines, n.color, { extra: `<g class="votes">${voteDots(n.votes)}</g>` })).join('')}
  </g>
</g>`;

export const selSvg = /* svg */ `
<g id="sel">
  <rect class="sel__box" id="sel-box" x="0" y="0" width="96" height="96"/>
  <rect class="sel__handle" id="sel-h0" width="11" height="11"/>
  <rect class="sel__handle" id="sel-h1" width="11" height="11"/>
  <rect class="sel__handle" id="sel-h2" width="11" height="11"/>
  <rect class="sel__handle" id="sel-h3" width="11" height="11"/>
  <rect class="sel__dims-bg" id="sel-dims-bg" height="24" rx="5" width="84"/>
  <text class="sel__dims" id="sel-dims" text-anchor="middle">96 × 96</text>
</g>`;

/** The winning sticky gets resized into the phone frame, so the selection box follows it. */
const PHONE = { w: 300, h: 600, rx: 40 };
const REAL = { w: 393, h: 852 }; // what the dimension tag reads once it's a phone frame

export function animateBrainstorm(ctx: Ctx): void {
  const { tl, q, qa } = ctx;
  const t = T.brainstorm;
  const notes = qa<SVGGElement>('#notes .sticky');
  const winner = notes[0];
  const winnerPaper = winner.querySelector<SVGRectElement>('.sticky__paper')!;

  // Resting state
  gsap.set(q('#board-frame'), { drawSVG: '0%', fillOpacity: 0 });
  gsap.set(q('#board-tray'), { autoAlpha: 0 });
  gsap.set(qa('.cluster-label'), { autoAlpha: 0, y: 12 });
  gsap.set([...qa('.lasso'), q('#hmw-underline')], { drawSVG: '0%' });
  notes.forEach((el, i) => {
    const [x, y, rot] = NOTES[i].scatter;
    gsap.set(el, { x, y, rotation: rot - 12, scale: 0.3, autoAlpha: 0, transformOrigin: '50% 50%' });
  });
  gsap.set(qa('#notes .vote'), { scale: 0, transformOrigin: '50% 50%' });
  gsap.set(q('#sel'), { autoAlpha: 0 });

  // ── Out with the spark, in with the whiteboard (the bulb becomes the board's icon)
  tl.to(qa('.sig'), { autoAlpha: 0, scale: 0.94, transformOrigin: '50% 50%', duration: 0.6, stagger: 0.06, ease: 'power2.in' }, t);
  tl.to(qa('.conn'), { autoAlpha: 0, duration: 0.4 }, t);
  tl.to(qa('#bulb-rays path'), { autoAlpha: 0, duration: 0.3 }, t + 0.1);
  tl.to(q('#bulb-glow'), { autoAlpha: 0.45, duration: 0.6 }, t + 0.2);
  tl.to(q('#bulb'), { x: 192 - 600, y: 142 - 285, scale: 0.27, svgOrigin: '600 285', duration: 1.1, ease: 'power3.inOut' }, t + 0.4);
  tl.to(q('#cur-research'), { x: 160, y: 330, duration: 1 }, t + 0.3);
  tl.to(q('#cur-pm'), { x: 950, y: 236, duration: 1 }, t + 0.35);
  tl.to(q('#cur-design'), { x: 250, y: 120, duration: 1.1 }, t + 0.6);

  tl.to(q('#board-frame'), { drawSVG: '100%', duration: 1.2, ease: 'power1.inOut' }, t + 0.8);
  tl.to(q('#board-frame'), { fillOpacity: 1, duration: 0.5 }, t + 1.6);
  tl.to(q('#board-tray'), { autoAlpha: 1, duration: 0.4 }, t + 1.8);

  // How might we… written across the top by the designer
  tl.to(q('#hmw-clip-rect'), { attr: { width: 820 }, duration: 1.6, ease: 'none' }, t + 2.2);
  tl.to(q('#cur-design'), { x: 1046, y: 150, duration: 1.6, ease: 'none' }, t + 2.2);
  tl.to(q('#hmw-underline'), { drawSVG: '100%', duration: 0.5, ease: 'none' }, t + 3.8);
  say(ctx, '#chat-design-2', t + 3.9, 1.6);

  // ── Everyone sticks up ideas
  const start = t + 4.2;
  notes.forEach((el, i) => {
    const [x, y, rot] = NOTES[i].scatter;
    const who = PLACERS[i % 3];
    const at = start + i * 0.24;
    tl.to(q(`#cur-${who}`), { x: x > 880 ? x - 70 : x + 30, y: y + 26, duration: 0.3, ease: 'power2.inOut' }, at - 0.2);
    tl.to(el, { autoAlpha: 1, scale: 1, rotation: rot, duration: 0.35, ease: 'back.out(2.2)' }, at + 0.08);
  });

  // ── Affinity mapping: drag notes into groups
  const mapAt = start + NOTES.length * 0.24 + 0.4; // ≈ t + 7.5
  notes.forEach((el, i) => {
    const [x, y, rot] = NOTES[i].cluster;
    tl.to(el, { x, y, rotation: rot, duration: 1, ease: 'power3.inOut' }, mapAt + i * 0.06);
  });
  const carry = [
    ['design', 0],
    ['pm', 4],
    ['research', 8],
  ] as const;
  carry.forEach(([who, idx]) => {
    const [sx, sy] = NOTES[idx].scatter;
    const [cx, cy] = NOTES[idx].cluster;
    tl.to(q(`#cur-${who}`), { x: sx > 880 ? sx - 60 : sx + 20, y: sy + 20, duration: 0.3 }, mapAt - 0.3 + idx * 0.06);
    tl.to(q(`#cur-${who}`), { x: cx + 20, y: cy + 20, duration: 1, ease: 'power3.inOut' }, mapAt + idx * 0.06);
  });

  tl.to(qa('.cluster-label'), { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.2 }, mapAt + 1.4);
  tl.to(qa('.lasso'), { drawSVG: '100%', duration: 0.7, stagger: 0.25, ease: 'power1.inOut' }, mapAt + 1.5);

  // ── Dot voting
  const voteAt = mapAt + 2.8; // ≈ t + 10.3
  const voters: [string, SVGCircleElement][] = [];
  notes.forEach((el) => el.querySelectorAll<SVGCircleElement>('.vote').forEach((dot) => voters.push([dot.classList[1].replace('vote--', ''), dot])));
  voters.forEach(([role, dot], i) => {
    const at = voteAt + i * 0.14;
    const noteEl = dot.closest<SVGGElement>('.sticky')!;
    const ni = notes.indexOf(noteEl);
    const [cx, cy] = NOTES[ni].cluster;
    if (role !== 'eng') tl.to(q(`#cur-${role}`), { x: cx + Number(dot.getAttribute('cx')), y: cy - 32, duration: 0.18 }, at - 0.12);
    tl.to(dot, { scale: 1, duration: 0.22, ease: 'back.out(3)' }, at);
  });
  say(ctx, '#chat-research-2', voteAt + 0.2, 1.7);
  tl.to(camera, { s: 1.14, cx: 520, cy: 410, duration: 1.3, ease: 'power2.inOut' }, voteAt - 0.3);

  // ── A winner. Everything else steps back; the designer selects it.
  const winAt = voteAt + voters.length * 0.14 + 0.4; // ≈ t + 11.9
  const dimTargets = [...notes.slice(1), ...qa('.cluster-label'), ...qa('.lasso')];
  tl.to(dimTargets, { opacity: 0.28, duration: 0.5 }, winAt);
  tl.set(q('#sel'), { autoAlpha: 1 }, winAt + 0.2);
  tl.from(q('#sel'), { scale: 1.12, svgOrigin: `${NOTES[0].cluster[0]} ${NOTES[0].cluster[1]}`, duration: 0.35, ease: 'back.out(2)', immediateRender: false }, winAt + 0.2);
  tl.to(q('#cur-design'), { x: NOTES[0].cluster[0] + 48, y: NOTES[0].cluster[1] + 48, duration: 0.5 }, winAt);
  tl.to(q('#cur-research'), { x: 380, y: 610, duration: 0.6 }, winAt);
  tl.to(q('#cur-pm'), { x: 760, y: 610, duration: 0.6 }, winAt);

  // ── Transition: the winner is resized into a phone frame (handled here because the sticky owns it)
  const m = T.wireframe - 0.5; // morph start ≈ 24
  tl.to([...notes.slice(1), ...qa('.cluster-label'), ...qa('.lasso'), q('#board-tray')], { autoAlpha: 0, duration: 0.5, stagger: 0.015 }, m);
  tl.to(q('#board-frame'), { autoAlpha: 0, duration: 0.6 }, m + 0.2);
  tl.to(q('#hmw-clip-rect'), { attr: { width: 0 }, duration: 0.5, ease: 'power2.in' }, m);
  tl.to(q('#hmw-underline'), { autoAlpha: 0, duration: 0.3 }, m);
  tl.to(q('#bulb'), { autoAlpha: 0, duration: 0.4 }, m);
  tl.to([q('#cur-pm'), q('#cur-research')], { x: (i: number) => (i === 0 ? 1080 : 140), y: (i: number) => (i === 0 ? 180 : 620), duration: 0.8 }, m);

  tl.to(camera, { s: 1, cx: 600, cy: 400, duration: 1.2, ease: 'power2.inOut' }, m + 0.1);
  tl.to(winner, { x: 600, y: 400, rotation: 0, duration: 0.8, ease: 'power3.inOut' }, m + 0.2);
  tl.to(q('#cur-design'), { x: 648, y: 448, duration: 0.8, ease: 'power3.inOut' }, m + 0.2);
  tl.to(winner.querySelectorAll('text, .votes, .sticky__strip, .sticky__shadow'), { autoAlpha: 0, duration: 0.3 }, m + 0.8);

  // Resize by the corner handle
  const rs = m + 1.1;
  tl.to(winnerPaper, { attr: { x: -PHONE.w / 2, y: -PHONE.h / 2, width: PHONE.w, height: PHONE.h, rx: PHONE.rx }, duration: 1.3, ease: 'power3.inOut' }, rs);
  tl.to(q('#cur-design'), { x: 600 + PHONE.w / 2, y: 400 + PHONE.h / 2, duration: 1.3, ease: 'power3.inOut' }, rs);
  tl.to(winnerPaper, { opacity: 0, duration: 0.4 }, rs + 1.2);
  tl.to(q('#sel'), { autoAlpha: 0, duration: 0.3 }, rs + 1.7);

  // Keep the selection box glued to the winner's paper, and the size tag honest.
  const box = q('#sel-box');
  const handles = [0, 1, 2, 3].map((i) => q(`#sel-h${i}`));
  const dimsBg = q('#sel-dims-bg');
  const dims = q<SVGTextElement>('#sel-dims');
  let lastLabel = '';
  ctx.onRender(() => {
    const gx = Number(gsap.getProperty(winner, 'x'));
    const gy = Number(gsap.getProperty(winner, 'y'));
    const w = Number(winnerPaper.getAttribute('width'));
    const h = Number(winnerPaper.getAttribute('height'));
    const x = gx + Number(winnerPaper.getAttribute('x'));
    const y = gy + Number(winnerPaper.getAttribute('y'));
    box.setAttribute('x', String(x));
    box.setAttribute('y', String(y));
    box.setAttribute('width', String(w));
    box.setAttribute('height', String(h));
    const corners = [
      [x, y],
      [x + w, y],
      [x, y + h],
      [x + w, y + h],
    ];
    handles.forEach((hEl, i) => {
      hEl.setAttribute('x', String(corners[i][0] - 5.5));
      hEl.setAttribute('y', String(corners[i][1] - 5.5));
    });
    const p = Math.max(0, Math.min(1, (w - 96) / (PHONE.w - 96)));
    const label = `${Math.round(96 + p * (REAL.w - 96))} × ${Math.round(96 + p * (REAL.h - 96))}`;
    if (label !== lastLabel) {
      dims.textContent = label;
      lastLabel = label;
    }
    const bw = label.length * 8 + 18;
    dimsBg.setAttribute('x', String(x + w / 2 - bw / 2));
    dimsBg.setAttribute('y', String(y + h + 12));
    dimsBg.setAttribute('width', String(bw));
    dims.setAttribute('x', String(x + w / 2));
    dims.setAttribute('y', String(y + h + 28.5));
  });
}

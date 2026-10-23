import { gsap } from '../../lib/motion';
import { T } from '../timing';
import type { Ctx } from '../types';
import { moveDevice } from './device';
import { say } from './spark';

/* ── Chapter 5: specs, comments in the file, code that matches the design, and a release. ── */

type Tok = [cls: string, text: string];
const CODE: { indent: number; parts: Tok[] }[] = [
  { indent: 0, parts: [['ed-key', 'export function '], ['ed-fn', 'SearchBar'], ['ed-dim', '() {']] },
  { indent: 1, parts: [['ed-key', 'return'], ['ed-dim', ' (']] },
  { indent: 2, parts: [['ed-dim', '<'], ['ed-tag', 'Field']] },
  { indent: 3, parts: [['ed-attr', 'icon'], ['ed-dim', '={<'], ['ed-tag', 'SearchIcon'], ['ed-dim', ' />}']] },
  { indent: 3, parts: [['ed-attr', 'radius'], ['ed-dim', '='], ['ed-str', '"lg"']] },
  { indent: 3, parts: [['ed-attr', 'tone'], ['ed-dim', '='], ['ed-str', '"primary"']] },
  { indent: 3, parts: [['ed-attr', 'placeholder'], ['ed-dim', '='], ['ed-str', '"Search receipts"']] },
  { indent: 2, parts: [['ed-dim', '/>']] },
  { indent: 1, parts: [['ed-dim', ');']] },
  { indent: 0, parts: [['ed-dim', '}']] },
];

const ED = { x: 620, y: 214, w: 440, h: 364 };
const CODE_X = ED.x + 46;
const CODE_Y = ED.y + 70;
const LH = 28;
const INDENT = 18;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const codeSvg = CODE.map((line, i) => {
  const y = CODE_Y + i * LH;
  const x = CODE_X + line.indent * INDENT;
  return `
    <clipPath id="code-clip-${i}"><rect class="code-clip" x="${x - 2}" y="${y - 19}" width="0" height="26"/></clipPath>
    <text class="ed-code ed-dim" x="${ED.x + 30}" y="${y}" text-anchor="end" style="font-size:12px">${i + 1}</text>
    <text class="ed-code code-line" id="code-${i}" x="${x}" y="${y}" clip-path="url(#code-clip-${i})">${line.parts
      .map(([cls, text]) => `<tspan class="${cls}">${esc(text)}</tspan>`)
      .join('')}</text>`;
}).join('');

const TOKENS = [
  { id: 'tok-radius', label: '◇ radius.lg', from: [380 + 40, 229], to: [CODE_X + 3 * INDENT + 150, CODE_Y + 4 * LH - 6] },
  { id: 'tok-color', label: '◇ color.primary', from: [380 - 60, 372], to: [CODE_X + 3 * INDENT + 140, CODE_Y + 5 * LH - 6] },
  { id: 'tok-space', label: '◇ space.4', from: [380 - 120, 229], to: [CODE_X + 3 * INDENT + 240, CODE_Y + 6 * LH - 6] },
];

export const buildSvg = /* svg */ `
<g id="build">
  <path id="comment-lead" class="ln-2" d="M502 204 C540 196 578 170 612 152" stroke-dasharray="3 5" style="stroke-width:1.6"/>
  <g id="comment">
    <rect class="card" x="612" y="88" width="320" height="112" rx="14" style="stroke-width:1.6"/>
    <g id="comment-q">
      <circle cx="636" cy="118" r="12" style="fill:var(--role-eng)"/>
      <text x="636" y="122.5" text-anchor="middle" style="font:700 12px var(--font-body);fill:var(--on-role)">E</text>
      <text class="t-ui" x="656" y="114" style="font-size:13px;font-weight:700">Engineer</text>
      <text class="t-ui" x="656" y="133" style="font-size:14px;fill:var(--ink-2)">Search radius: 20 or 24?</text>
    </g>
    <g id="comment-a">
      <circle cx="636" cy="166" r="12" style="fill:var(--role-design)"/>
      <text x="636" y="170.5" text-anchor="middle" style="font:700 12px var(--font-body);fill:var(--on-role)">D</text>
      <text class="t-ui" x="656" y="162" style="font-size:13px;font-weight:700">Designer</text>
      <text class="t-ui" x="656" y="181" style="font-size:14px;fill:var(--ink-2)">24. It’s the radius.lg token.</text>
    </g>
  </g>

  <g id="editor">
    <rect class="ed-bg" x="${ED.x}" y="${ED.y}" width="${ED.w}" height="${ED.h}" rx="14"/>
    <path class="ed-bar" d="M${ED.x} ${ED.y + 40} V${ED.y + 14} Q${ED.x} ${ED.y} ${ED.x + 14} ${ED.y} H${ED.x + ED.w - 14} Q${ED.x + ED.w} ${ED.y} ${ED.x + ED.w} ${ED.y + 14} V${ED.y + 40} Z"/>
    <circle cx="${ED.x + 22}" cy="${ED.y + 20}" r="5.5" style="fill:#ff5f57"/>
    <circle cx="${ED.x + 40}" cy="${ED.y + 20}" r="5.5" style="fill:#febc2e"/>
    <circle cx="${ED.x + 58}" cy="${ED.y + 20}" r="5.5" style="fill:#28c840"/>
    <text class="ed-code" x="${ED.x + 84}" y="${ED.y + 25}" style="font-size:12.5px;fill:var(--editor-text)">SearchBar.tsx</text>
    <text class="ed-code ed-dim" x="${ED.x + ED.w - 18}" y="${ED.y + 25}" text-anchor="end" style="font-size:12px">main</text>
    ${codeSvg}
    <rect id="caret" x="0" y="0" width="2" height="19" style="fill:var(--editor-fn)"/>
  </g>

  <g id="tokens">
    ${TOKENS.map(
      (tk) => `
    <g class="token" id="${tk.id}">
      <g data-fit="9">
        <rect x="0" y="-13" width="100" height="26" rx="13" class="fill-surface" style="stroke:var(--component);stroke-width:1.6"/>
        <text x="9" y="4.5" class="t-mono" style="font-size:12.5px;font-weight:500;fill:var(--component)">${tk.label}</text>
      </g>
    </g>`,
    ).join('')}
  </g>

  <g id="release">
    <text class="t-label" id="rel-label" x="620" y="612" style="letter-spacing:0.04em">SHIPPING v4.2</text>
    <text class="t-label" id="rel-pct" x="1060" y="612" text-anchor="end" style="letter-spacing:0.04em">0%</text>
    <rect class="fill-hair" x="620" y="624" width="440" height="8" rx="4"/>
    <rect class="fill-accent" id="rel-fill" x="620" y="624" width="0" height="8" rx="4"/>
    <g id="rel-badge">
      <rect x="620" y="648" width="236" height="34" rx="17" style="fill:var(--success)"/>
      <circle cx="640" cy="665" r="9" style="fill:#fff"/>
      <path d="M635.5 665 l3 3 l6 -6.5" style="fill:none;stroke:var(--success);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round"/>
      <text x="656" y="670" style="font:600 13.5px var(--font-body);fill:#fff">Live for 100% of users</text>
    </g>
  </g>
</g>`;

export function animateBuild(ctx: Ctx): void {
  const { tl, q, qa } = ctx;
  const t = T.build;

  gsap.set(q('#comment-lead'), { drawSVG: '0%' });
  gsap.set([q('#comment'), q('#comment-q'), q('#comment-a')], { autoAlpha: 0 });
  gsap.set(q('#editor'), { autoAlpha: 0, scale: 0.94, transformOrigin: '50% 0%' });
  gsap.set(q('#caret'), { autoAlpha: 0 });
  gsap.set(qa('.token'), { autoAlpha: 0 });
  gsap.set(q('#release'), { autoAlpha: 0 });
  gsap.set(q('#rel-badge'), { autoAlpha: 0, scale: 0.6, transformOrigin: '0% 50%' });
  qa('.redline').forEach((r) => {
    gsap.set(r.querySelectorAll('.rl-line, .rl-lead'), { drawSVG: '0%' });
    gsap.set(r.querySelector('.rl-tag'), { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' });
  });

  // Make room: design system out, phone to the left, engineer in
  tl.to(qa('.ds-card'), { autoAlpha: 0, y: -12, duration: 0.45, stagger: 0.05 }, t);
  moveDevice(ctx, t + 0.3, { x: 380 }, 1.1);
  tl.to(q('#cur-eng'), { x: 1080, y: 300, duration: 1, ease: 'power3.out' }, t + 0.6);
  tl.to(q('#cur-pm'), { x: 1180, y: 40, duration: 0.8 }, t + 0.2);
  tl.to(q('#cur-research'), { x: 120, y: 680, duration: 0.8 }, t + 0.2);
  tl.to(q('#cur-design'), { x: 170, y: 300, duration: 0.9 }, t + 0.3);

  // Redlines
  tl.set(q('#redlines'), { autoAlpha: 1 }, t + 1.3);
  qa('.redline').forEach((r, i) => {
    const at = t + 1.3 + i * 0.25;
    tl.to(r.querySelector('.rl-line'), { drawSVG: '100%', duration: 0.35, ease: 'none' }, at);
    tl.to(r.querySelector('.rl-lead'), { drawSVG: '100%', duration: 0.25, ease: 'none' }, at + 0.25);
    tl.to(r.querySelector('.rl-tag'), { autoAlpha: 1, scale: 1, duration: 0.25, ease: 'back.out(2.5)' }, at + 0.4);
  });

  // The editor opens and the code types itself
  const e0 = t + 1.7;
  tl.to(q('#editor'), { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, e0);
  tl.set(q('#caret'), { autoAlpha: 1 }, e0 + 0.5);
  let at = e0 + 0.6;
  qa<SVGTextElement>('.code-line').forEach((line, i) => {
    const clip = q(`#code-clip-${i} rect`);
    const x0 = Number(line.getAttribute('x'));
    const y0 = Number(line.getAttribute('y'));
    const len = line.getComputedTextLength();
    const dur = Math.max(0.12, len / 700);
    tl.set(q('#caret'), { attr: { x: x0, y: y0 - 15 } }, at);
    tl.to(clip, { attr: { width: len + 4 }, duration: dur, ease: 'steps(' + Math.max(2, Math.round(len / 9)) + ')' }, at);
    tl.to(q('#caret'), { attr: { x: x0 + len + 2 }, duration: dur, ease: 'steps(' + Math.max(2, Math.round(len / 9)) + ')' }, at);
    at += dur + 0.06;
  });
  tl.to(q('#cur-eng'), { x: 1010, y: 520, duration: 0.8 }, e0 + 0.4);

  // A question in the file, answered in the file
  const c0 = t + 2.6;
  tl.set(q('#pin'), { autoAlpha: 1 }, c0);
  tl.from(q('#pin'), { scale: 0, transformOrigin: '50% 100%', duration: 0.35, ease: 'back.out(3)', immediateRender: false }, c0);
  tl.to(q('#comment-lead'), { drawSVG: '100%', duration: 0.4, ease: 'none' }, c0 + 0.3);
  tl.to(q('#comment'), { autoAlpha: 1, duration: 0.3 }, c0 + 0.5);
  tl.to(q('#comment-q'), { autoAlpha: 1, duration: 0.3 }, c0 + 0.6);
  tl.to(q('#cur-design'), { x: 944, y: 150, duration: 0.8 }, c0 + 0.9);
  tl.to(q('#comment-a'), { autoAlpha: 1, duration: 0.3 }, c0 + 1.6);

  // Tokens fly from the design into the code
  const k0 = at + 0.1;
  TOKENS.forEach((tk, i) => {
    const el = q(`#${tk.id}`);
    const s = k0 + i * 0.25;
    tl.set(el, { x: tk.from[0], y: tk.from[1], autoAlpha: 0, scale: 0.7 }, s - 0.01);
    tl.to(el, { autoAlpha: 1, scale: 1, duration: 0.2 }, s);
    tl.to(el, { x: tk.to[0], duration: 0.9, ease: 'power2.inOut' }, s);
    tl.to(el, { y: tk.to[1], duration: 0.9, ease: 'back.in(1.4)' }, s);
    tl.to(el, { autoAlpha: 0, scale: 0.6, duration: 0.2 }, s + 0.85);
  });

  // Ship it
  const r0 = k0 + 1.6;
  const pct = q<SVGTextElement>('#rel-pct');
  const fill = q('#rel-fill');
  tl.to(q('#release'), { autoAlpha: 1, duration: 0.3 }, r0);
  tl.to(fill, { attr: { width: 440 }, duration: 1.6, ease: 'power2.inOut' }, r0 + 0.2);
  ctx.onRender(() => {
    const v = `${Math.round((Number(fill.getAttribute('width')) / 440) * 100)}%`;
    if (pct.textContent !== v) pct.textContent = v;
  });
  tl.to(q('#rel-badge'), { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, r0 + 1.85);
  tl.to(q('#cur-eng'), { x: 900, y: 662, duration: 0.6 }, r0 + 1.5);
  say(ctx, '#chat-eng-1', r0 + 2.0, 1.4);
}

import { gsap } from '../../lib/motion';
import { T } from '../timing';
import type { Ctx } from '../types';
import { device } from '../rig';
import { PIN_LOCAL } from './console';
import { say } from './spark';

/* ── Chapter 5: specs, a question answered in the file, code that matches the prototype,
   design QA, and a release. ── */

type Tok = [cls: string, text: string];
const CODE: { indent: number; parts: Tok[] }[] = [
  { indent: 0, parts: [['ed-key', 'export function '], ['ed-fn', 'FailureGroup'], ['ed-dim', '({ group }) {']] },
  { indent: 1, parts: [['ed-key', 'return'], ['ed-dim', ' (']] },
  { indent: 2, parts: [['ed-dim', '<'], ['ed-tag', 'Alert']] },
  { indent: 3, parts: [['ed-attr', 'tone'], ['ed-dim', '='], ['ed-str', '"critical"']] },
  { indent: 3, parts: [['ed-attr', 'title'], ['ed-dim', '={group.'], ['ed-fn', 'reason'], ['ed-dim', '}']] },
  { indent: 3, parts: [['ed-attr', 'count'], ['ed-dim', '={group.'], ['ed-fn', 'devices'], ['ed-dim', '}']] },
  { indent: 3, parts: [['ed-attr', 'onFix'], ['ed-dim', '={'], ['ed-fn', 'retryInBatches'], ['ed-dim', '(50)}']] },
  { indent: 2, parts: [['ed-dim', '/>']] },
  { indent: 1, parts: [['ed-dim', ');']] },
  { indent: 0, parts: [['ed-dim', '}']] },
];

/** Where the console sits during this chapter */
export const BUILD_DEVICE = { x: 360, y: 300, s: 0.66 };

const ED = { x: 640, y: 214, w: 440, h: 364 };
const CODE_X = ED.x + 46;
const CODE_Y = ED.y + 70;
const LH = 28;
const INDENT = 18;
const QA = { x: 122, y: 474, w: 476, h: 204 };
const CHECKS = ['Matches the prototype', 'Contrast passes WCAG AA', 'Keyboard and screen reader tested', 'Error copy reviewed with support'];

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

const pinStage = { x: BUILD_DEVICE.x + PIN_LOCAL.x * BUILD_DEVICE.s, y: BUILD_DEVICE.y + PIN_LOCAL.y * BUILD_DEVICE.s };

const TOKENS = [
  { id: 'tok-radius', label: '◇ radius.md', from: [200, 330], to: [CODE_X + 2 * INDENT + 90, CODE_Y + 2 * LH - 6] },
  { id: 'tok-color', label: '◇ color.critical', from: [300, 312], to: [CODE_X + 3 * INDENT + 150, CODE_Y + 3 * LH - 6] },
  { id: 'tok-space', label: '◇ space.3', from: [250, 360], to: [CODE_X + 3 * INDENT + 210, CODE_Y + 5 * LH - 6] },
];

export const buildSvg = /* svg */ `
<g id="build">
  <path id="comment-lead" class="ln-2" d="M${pinStage.x + 10} ${pinStage.y - 10} C${pinStage.x + 30} ${pinStage.y - 60} ${ED.x - 30} 160 ${ED.x} 148" stroke-dasharray="3 5" style="stroke-width:1.6"/>
  <g id="comment">
    <rect class="card" x="${ED.x}" y="74" width="352" height="116" rx="14" style="stroke-width:1.6"/>
    <g id="comment-q">
      <circle cx="${ED.x + 24}" cy="104" r="12" style="fill:var(--role-eng)"/>
      <text x="${ED.x + 24}" y="108.5" text-anchor="middle" style="font:700 12px var(--font-body);fill:var(--on-role)">E</text>
      <text class="t-ui" x="${ED.x + 44}" y="100" style="font-size:13px;font-weight:700">Engineer</text>
      <text class="t-ui" x="${ED.x + 44}" y="119" style="font-size:14px;fill:var(--ink-2)">Retry all 298 at once, or in batches?</text>
    </g>
    <g id="comment-a">
      <circle cx="${ED.x + 24}" cy="154" r="12" style="fill:var(--role-design)"/>
      <text x="${ED.x + 24}" y="158.5" text-anchor="middle" style="font:700 12px var(--font-body);fill:var(--on-role)">D</text>
      <text class="t-ui" x="${ED.x + 44}" y="150" style="font-size:13px;font-weight:700">Designer</text>
      <text class="t-ui" x="${ED.x + 44}" y="169" style="font-size:14px;fill:var(--ink-2)">Batches of 50, with progress per site.</text>
    </g>
  </g>

  <g id="editor">
    <rect class="ed-bg" x="${ED.x}" y="${ED.y}" width="${ED.w}" height="${ED.h}" rx="14"/>
    <path class="ed-bar" d="M${ED.x} ${ED.y + 40} V${ED.y + 14} Q${ED.x} ${ED.y} ${ED.x + 14} ${ED.y} H${ED.x + ED.w - 14} Q${ED.x + ED.w} ${ED.y} ${ED.x + ED.w} ${ED.y + 14} V${ED.y + 40} Z"/>
    <circle cx="${ED.x + 22}" cy="${ED.y + 20}" r="5.5" style="fill:#ff5f57"/>
    <circle cx="${ED.x + 40}" cy="${ED.y + 20}" r="5.5" style="fill:#febc2e"/>
    <circle cx="${ED.x + 58}" cy="${ED.y + 20}" r="5.5" style="fill:#28c840"/>
    <text class="ed-code" x="${ED.x + 84}" y="${ED.y + 25}" style="font-size:12.5px;fill:var(--editor-text)">FailureGroup.tsx</text>
    <text class="ed-code ed-dim" x="${ED.x + ED.w - 18}" y="${ED.y + 25}" text-anchor="end" style="font-size:12px">main</text>
    ${codeSvg}
    <rect id="caret" x="0" y="0" width="2" height="19" style="fill:var(--editor-fn)"/>
  </g>

  <g id="qa">
    <rect class="card" x="${QA.x}" y="${QA.y}" width="${QA.w}" height="${QA.h}" rx="14" style="stroke-width:1.6"/>
    <text class="t-label" x="${QA.x + 22}" y="${QA.y + 32}">DESIGN QA</text>
    <text class="t-mono" id="qa-count" x="${QA.x + QA.w - 22}" y="${QA.y + 32}" text-anchor="end" style="font-size:12px;fill:var(--ink-2)">0 / 4</text>
    ${CHECKS.map((c, i) => {
      const y = QA.y + 72 + i * 34;
      return `
    <g class="qa-row" id="qa-${i}">
      <rect x="${QA.x + 22}" y="${y - 15}" width="20" height="20" rx="5" class="fill-surface" style="stroke:var(--ink-3);stroke-width:1.6"/>
      <g class="qa-check">
        <rect x="${QA.x + 22}" y="${y - 15}" width="20" height="20" rx="5" style="fill:var(--success)"/>
        <path d="M${QA.x + 27} ${y - 5} l3.5 3.5 l6.5 -7" style="fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round"/>
      </g>
      <text class="t-ui" x="${QA.x + 54}" y="${y + 1}" style="font-size:15px">${c}</text>
    </g>`;
    }).join('')}
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
    <text class="t-label" x="${ED.x}" y="612" style="letter-spacing:0.04em">ROLLING OUT v24.3</text>
    <text class="t-label" id="rel-pct" x="${ED.x + ED.w}" y="612" text-anchor="end" style="letter-spacing:0.04em">0%</text>
    <rect class="fill-hair" x="${ED.x}" y="624" width="${ED.w}" height="8" rx="4"/>
    <rect class="fill-accent" id="rel-fill" x="${ED.x}" y="624" width="0" height="8" rx="4"/>
    <g id="rel-badge">
      <rect x="${ED.x}" y="648" width="236" height="34" rx="17" style="fill:var(--success)"/>
      <circle cx="${ED.x + 20}" cy="665" r="9" style="fill:#fff"/>
      <path d="M${ED.x + 15.5} 665 l3 3 l6 -6.5" style="fill:none;stroke:var(--success);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round"/>
      <text x="${ED.x + 36}" y="670" style="font:600 13.5px var(--font-body);fill:#fff">Live for every customer</text>
    </g>
  </g>
</g>`;

export function animateBuild(ctx: Ctx): void {
  const { tl, q, qa } = ctx;
  const t = T.build;

  gsap.set(q('#comment-lead'), { drawSVG: '0%' });
  gsap.set([q('#comment'), q('#comment-q'), q('#comment-a'), q('#qa'), ...qa('.qa-check')], { autoAlpha: 0 });
  gsap.set(q('#editor'), { autoAlpha: 0, scale: 0.94, transformOrigin: '50% 0%' });
  gsap.set(q('#caret'), { autoAlpha: 0 });
  gsap.set(qa('.token'), { autoAlpha: 0 });
  gsap.set(q('#release'), { autoAlpha: 0 });
  gsap.set(q('#rel-badge'), { autoAlpha: 0, scale: 0.6, transformOrigin: '0% 50%' });
  qa('.redline').forEach((r) => {
    gsap.set(r.querySelectorAll('.rl-line, .rl-lead'), { drawSVG: '0%' });
    gsap.set(r.querySelector('.rl-tag'), { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' });
  });

  // Make room: the prototype becomes the spec, the engineer joins
  tl.to([q('#prompt'), q('#proto-test')], { autoAlpha: 0, duration: 0.45, stagger: 0.05 }, t);
  tl.to(device, { ...BUILD_DEVICE, duration: 1.1, ease: 'power3.inOut' }, t + 0.3);
  tl.to(q('#cur-eng'), { x: 1080, y: 300, duration: 1, ease: 'power3.out' }, t + 0.6);
  tl.to(q('#cur-pm'), { x: 1180, y: 40, duration: 0.8 }, t + 0.2);
  tl.to(q('#cur-research'), { x: 96, y: 700, duration: 0.8 }, t + 0.2);
  tl.to(q('#cur-design'), { x: 560, y: 470, duration: 0.9 }, t + 0.3);

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
    const steps = `steps(${Math.max(2, Math.round(len / 9))})`;
    tl.set(q('#caret'), { attr: { x: x0, y: y0 - 15 } }, at);
    tl.to(clip, { attr: { width: len + 4 }, duration: dur, ease: steps }, at);
    tl.to(q('#caret'), { attr: { x: x0 + len + 2 }, duration: dur, ease: steps }, at);
    at += dur + 0.06;
  });
  tl.to(q('#cur-eng'), { x: 990, y: 552, duration: 0.8 }, e0 + 0.4);

  // A question in the file, answered in the file
  const c0 = t + 2.6;
  tl.set(q('#pin'), { autoAlpha: 1 }, c0);
  tl.from(q('#pin'), { scale: 0, transformOrigin: '50% 100%', duration: 0.35, ease: 'back.out(3)', immediateRender: false }, c0);
  tl.to(q('#comment-lead'), { drawSVG: '100%', duration: 0.4, ease: 'none' }, c0 + 0.3);
  tl.to(q('#comment'), { autoAlpha: 1, duration: 0.3 }, c0 + 0.5);
  tl.to(q('#comment-q'), { autoAlpha: 1, duration: 0.3 }, c0 + 0.6);
  tl.to(q('#cur-design'), { x: ED.x + 320, y: 176, duration: 0.8 }, c0 + 0.9);
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

  // Design QA, row by row
  const qaCount = q<SVGTextElement>('#qa-count');
  const q0 = c0 + 2.2;
  tl.to(q('#qa'), { autoAlpha: 1, duration: 0.4 }, q0);
  tl.to(q('#cur-design'), { x: QA.x + 40, y: QA.y + 74, duration: 0.6 }, q0);
  qa('.qa-check').forEach((chk, i) => {
    const ati = q0 + 0.7 + i * 0.35;
    tl.to(q('#cur-design'), { y: QA.y + 74 + i * 34, duration: 0.2 }, ati - 0.15);
    tl.to(chk, { autoAlpha: 1, duration: 0.15 }, ati);
    tl.from(chk, { scale: 0.4, transformOrigin: '50% 50%', duration: 0.25, ease: 'back.out(3)', immediateRender: false }, ati);
  });
  tl.to(q('#cur-design'), { x: 610, y: 712, duration: 0.6 }, q0 + 0.7 + CHECKS.length * 0.35);
  ctx.onRender(() => {
    const n = qa('.qa-check').filter((c) => Number(gsap.getProperty(c, 'opacity')) > 0.5).length;
    const v = `${n} / 4`;
    if (qaCount.textContent !== v) qaCount.textContent = v;
  });

  // Ship it
  const r0 = Math.max(k0 + 1.6, q0 + 2.2);
  const pct = q<SVGTextElement>('#rel-pct');
  const fill = q('#rel-fill');
  tl.to(q('#release'), { autoAlpha: 1, duration: 0.3 }, r0);
  tl.to(fill, { attr: { width: ED.w }, duration: 1.6, ease: 'power2.inOut' }, r0 + 0.2);
  ctx.onRender(() => {
    const v = `${Math.round((Number(fill.getAttribute('width')) / ED.w) * 100)}%`;
    if (pct.textContent !== v) pct.textContent = v;
  });
  tl.to(q('#rel-badge'), { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, r0 + 1.85);
  tl.to(q('#cur-eng'), { x: 940, y: 662, duration: 0.6 }, r0 + 1.5);
  say(ctx, '#chat-eng-1', r0 + 2.0, 1.4);
}

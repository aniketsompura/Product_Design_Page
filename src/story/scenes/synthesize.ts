import { gsap } from '../../lib/motion';
import { T } from '../timing';
import type { Ctx } from '../types';
import { arrow } from '../svg';
import { camera } from '../rig';
import { say } from './spark';

/* ── Chapter 3: the chosen idea and all the research go into AI, which drafts themes and a brief.
   A designer reviews it: verifies the insight and strikes out a suggestion that doesn't belong. ── */

export const SPARKLE = (x: number, y: number, r: number) =>
  `M${x} ${y - r} C${x + r * 0.12} ${y - r * 0.12} ${x + r * 0.12} ${y - r * 0.12} ${x + r} ${y} ` +
  `C${x + r * 0.12} ${y + r * 0.12} ${x + r * 0.12} ${y + r * 0.12} ${x} ${y + r} ` +
  `C${x - r * 0.12} ${y + r * 0.12} ${x - r * 0.12} ${y + r * 0.12} ${x - r} ${y} ` +
  `C${x - r * 0.12} ${y - r * 0.12} ${x - r * 0.12} ${y - r * 0.12} ${x} ${y - r} Z`;

const P = { x: 440, y: 96, w: 630, h: 604 };
const L = P.x + 26; // text left edge inside the panel
const SPARK_AT = { x: P.x + 36, y: P.y + 44 };

const SOURCES = ['9 admin interviews', '52 support tickets', '36 sticky notes', 'Enrollment analytics'];
const FILES = [
  { y: 392, name: 'Admin interviews', meta: '9 notes' },
  { y: 450, name: 'Support tickets', meta: '52 rows' },
  { y: 508, name: 'Enrollment data', meta: '90 days' },
];
const THEMES = [
  { y: 272, text: 'Error messages don’t say what to fix', pct: 64 },
  { y: 304, text: 'Expired certificates and tokens', pct: 22 },
  { y: 336, text: 'Firewall and network rules', pct: 14 },
];
const BAR = { x: 820, w: 160 };

/** A line of text that "streams" in, revealed by its own clip rect. */
const streamText = (id: string, x: number, y: number, text: string, style: string, cls = 't-ui') => `
  <clipPath id="${id}-clip"><rect class="stream-clip" x="${x - 2}" y="${y - 20}" width="0" height="28"/></clipPath>
  <text class="${cls} stream" id="${id}" x="${x}" y="${y}" clip-path="url(#${id}-clip)" style="${style}">${text}</text>`;

export const synthSvg = /* svg */ `
<g id="synth">
  <text id="chosen-label" class="t-label" x="214" y="198">CHOSEN IDEA</text>
  <path id="chosen-arrow" class="ln-accent" d="${arrow(328, 258, 428, 236, -0.18, 12)}" style="stroke-width:2.5"/>

  <g id="files">
    ${FILES.map(
      (f, i) => `
    <g class="file" id="file-${i}">
      <path class="card" d="M150 ${f.y - 20} H376 Q386 ${f.y - 20} 386 ${f.y - 10} V${f.y + 10} Q386 ${f.y + 20} 376 ${f.y + 20} H160 Q150 ${f.y + 20} 150 ${f.y + 10} Z" style="stroke-width:1.6"/>
      <path class="ln-2" d="M164 ${f.y - 10} H176 L182 ${f.y - 4} V${f.y + 10} H164 Z" style="stroke-width:1.6"/>
      <text class="t-ui" x="194" y="${f.y + 5}" style="font-size:14px;font-weight:600">${f.name}</text>
      <text class="t-mono" x="372" y="${f.y + 5}" text-anchor="end" style="font-size:11px;fill:var(--ink-2)">${f.meta}</text>
      <path class="ln-soft file-link" d="M388 ${f.y} C414 ${f.y} 414 ${330 + i * 18} 438 ${330 + i * 18}" stroke-dasharray="3 5"/>
    </g>`,
    ).join('')}
  </g>

  <g id="ai-panel">
    <rect id="ai-frame" class="card" x="${P.x}" y="${P.y}" width="${P.w}" height="${P.h}" rx="18" style="stroke-width:2"/>
    <path id="ai-spark" d="${SPARKLE(SPARK_AT.x, SPARK_AT.y, 15)}" fill="url(#g-ai)"/>
    <text class="t-ui" id="ai-title" x="${P.x + 62}" y="${P.y + 52}" style="font:700 22px var(--font-display);letter-spacing:-0.02em">AI synthesis</text>
    <text class="t-mono ai-status" id="ai-status-1" x="${P.x + P.w - 24}" y="${P.y + 50}" text-anchor="end" style="font-size:12px;fill:var(--component)">Reading 4 sources…</text>
    <text class="t-mono ai-status" id="ai-status-2" x="${P.x + P.w - 24}" y="${P.y + 50}" text-anchor="end" style="font-size:12px;fill:var(--success)">Draft ready · 38 s</text>

    <g id="ai-sources">
      ${SOURCES.map(
        (s, i) => `
      <g class="ai-source" id="ai-source-${i}" data-fit="10">
        <rect x="0" y="${P.y + 74}" width="80" height="24" rx="12" class="fill-canvas" style="stroke:var(--hairline);stroke-width:1.2"/>
        <text x="10" y="${P.y + 90}" class="t-mono" style="font-size:11.5px;fill:var(--ink-2)">${s}</text>
      </g>`,
      ).join('')}
    </g>
    <path class="ln-soft" id="ai-divider" d="M${L} ${P.y + 116} H${P.x + P.w - 24}" style="stroke-width:1.2"/>

    <text class="t-label ai-label" x="${L}" y="240">THEMES</text>
    ${THEMES.map(
      (th, i) => `
    <g class="theme" id="theme-${i}">
      ${streamText(`theme-text-${i}`, L, th.y, th.text, 'font-size:15px')}
      <rect class="fill-hair theme-track" x="${BAR.x}" y="${th.y - 10}" width="${BAR.w}" height="10" rx="5"/>
      <rect class="theme-bar" x="${BAR.x}" y="${th.y - 10}" width="${(BAR.w * th.pct) / 64}" height="10" rx="5" fill="url(#g-ai-bar)"/>
      <text class="t-mono theme-pct" x="${P.x + P.w - 24}" y="${th.y}" text-anchor="end" style="font-size:13px;font-weight:600">${th.pct}%</text>
    </g>`,
    ).join('')}

    <text class="t-label ai-label" x="${L}" y="386">INSIGHT</text>
    <rect id="insight-hl" x="${L - 6}" y="396" width="338" height="54" rx="4" style="fill:var(--sticky-yellow);opacity:0.55"/>
    ${streamText('insight-1', L, 416, 'Admins can’t see why devices fail,', 'font-size:17px;font-weight:600')}
    ${streamText('insight-2', L, 440, 'so a whole rollout can stall for days.', 'font-size:17px;font-weight:600')}
    <g id="verified" data-fit="12">
      <rect x="826" y="404" width="160" height="28" rx="14" style="fill:var(--role-design)"/>
      <text x="838" y="422.5" style="font:600 12.5px var(--font-body);fill:var(--on-role)">✓ Matches 6 admin interviews</text>
    </g>

    <text class="t-label ai-label" x="${L}" y="488">CONCEPT</text>
    ${streamText('concept-1', L, 518, 'Enrollment health: live status for every site,', 'font-size:17px;font-weight:600')}
    ${streamText('concept-2', L, 542, 'and a one-click fix for each kind of failure.', 'font-size:17px;font-weight:600')}
    ${streamText('suggest', L, 580, '+ Also add an “Advanced settings” step to the wizard', 'font-size:15px;fill:var(--ink-2)')}
    <path id="suggest-strike" d="M${L - 4} 575 C${L + 120} 571 ${L + 260} 578 ${L + 382} 572" style="fill:none;stroke:var(--measure);stroke-width:3;stroke-linecap:round"/>
    <text id="suggest-note" class="t-hand is-accent" x="${L + 160}" y="614" style="font-size:27px">fewer steps, not more!</text>

    <text class="t-label ai-label" x="${L}" y="${P.y + P.h - 40}">GOAL</text>
    ${streamText('goal', L + 58, P.y + P.h - 40, '95% of devices enroll on the first try', 'font-size:16px;font-weight:700')}
    <path id="ai-caret" d="${SPARKLE(0, 0, 7)}" fill="url(#g-ai)"/>
  </g>
</g>`;

export function animateSynthesize(ctx: Ctx): void {
  const { tl, q, qa } = ctx;
  const t = T.synthesize;
  const notes = qa<SVGGElement>('#notes .sticky');
  const winner = notes[0];

  gsap.set(q('#synth'), { autoAlpha: 0 });
  gsap.set([q('#chosen-label'), ...qa('.file'), ...qa('.ai-source'), ...qa('.ai-label'), ...qa('.theme-pct'), ...qa('.theme-track'), q('#ai-title'), q('#verified'), q('#suggest-note'), q('#ai-status-1'), q('#ai-status-2')], { autoAlpha: 0 });
  gsap.set([q('#chosen-arrow'), q('#ai-frame'), q('#ai-divider'), q('#suggest-strike'), ...qa('.file-link')], { drawSVG: '0%' });
  gsap.set(q('#ai-frame'), { fillOpacity: 0 });
  gsap.set(qa('.file'), { x: -16 });
  gsap.set(qa('.theme-bar'), { scaleX: 0, transformOrigin: '0% 50%' });
  gsap.set(q('#insight-hl'), { scaleX: 0, transformOrigin: '0% 50%' });
  gsap.set(q('#ai-caret'), { autoAlpha: 0 });

  // Lay the source chips out in a row (their widths were fitted to the text)
  let sx = L;
  qa<SVGGElement>('.ai-source').forEach((chip) => {
    const rect = chip.querySelector('rect')!;
    chip.setAttribute('transform', `translate(${sx} 0)`);
    sx += Number(rect.getAttribute('width')) + 8;
  });

  // ── Clear the whiteboard; the winner is pinned as the chosen idea
  const b = t - 0.5;
  tl.to(camera, { s: 1, cx: 600, cy: 400, duration: 1.2, ease: 'power2.inOut' }, b + 0.1);
  tl.to([...qa('.cluster-label'), ...qa('.lasso'), q('#board-tray'), q('#hmw-underline'), q('#bulb')], { autoAlpha: 0, duration: 0.5 }, b);
  tl.to(q('#hmw-clip-rect'), { attr: { width: 0 }, duration: 0.5, ease: 'power2.in' }, b);
  tl.to(q('#board-frame'), { autoAlpha: 0, duration: 0.6 }, b + 0.2);
  tl.to(q('#sel'), { autoAlpha: 0, duration: 0.3 }, b);
  tl.set(q('#synth'), { autoAlpha: 1 }, b + 0.3);
  tl.to(winner, { x: 270, y: 270, rotation: -4, duration: 0.9, ease: 'power3.inOut' }, b + 0.2);
  tl.to(winner.querySelector('.votes'), { autoAlpha: 0, duration: 0.3 }, b + 0.2);
  tl.to(q('#chosen-label'), { autoAlpha: 1, duration: 0.3 }, b + 1);
  tl.to([q('#cur-pm'), q('#cur-research'), q('#cur-design')], {
    x: (i: number) => [920, 170, 330][i],
    y: (i: number) => [728, 560, 330][i],
    duration: 0.9,
  }, b + 0.2);

  // ── The AI panel opens; research and notes stream into it
  const p0 = t + 0.5;
  tl.to(q('#ai-frame'), { drawSVG: '100%', duration: 0.8, ease: 'power1.inOut' }, p0);
  tl.to(q('#ai-frame'), { fillOpacity: 1, duration: 0.4 }, p0 + 0.5);
  tl.from(q('#ai-spark'), { scale: 0, rotation: -90, svgOrigin: `${SPARK_AT.x} ${SPARK_AT.y}`, duration: 0.5, ease: 'back.out(2)', immediateRender: true }, p0 + 0.4);
  tl.to(q('#ai-title'), { autoAlpha: 1, duration: 0.3 }, p0 + 0.5);
  tl.to(q('#ai-status-1'), { autoAlpha: 1, duration: 0.3 }, p0 + 0.7);
  tl.to(q('#chosen-arrow'), { drawSVG: '100%', duration: 0.5, ease: 'none' }, p0 + 0.6);
  tl.to(qa('.file'), { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.12 }, p0 + 0.6);
  tl.to(qa('.file-link'), { drawSVG: '100%', duration: 0.5, stagger: 0.12, ease: 'none' }, p0 + 0.9);
  tl.to(qa('.ai-source'), { autoAlpha: 1, duration: 0.3, stagger: 0.1 }, p0 + 1.1);
  tl.to(q('#ai-divider'), { drawSVG: '100%', duration: 0.5, ease: 'none' }, p0 + 1.4);

  const others = notes.slice(1);
  others.forEach((note, i) => {
    const at = p0 + 0.9 + i * 0.09;
    tl.to(note, { opacity: 1, duration: 0.15 }, at);
    tl.to(note, { x: SPARK_AT.x, y: SPARK_AT.y, scale: 0.1, rotation: (i % 2 ? 1 : -1) * 40, duration: 0.85, ease: 'power2.in' }, at);
    tl.to(note, { autoAlpha: 0, duration: 0.15 }, at + 0.75);
  });
  tl.to(q('#ai-spark'), { scale: 1.35, svgOrigin: `${SPARK_AT.x} ${SPARK_AT.y}`, duration: 0.18, yoyo: true, repeat: 7, ease: 'sine.inOut' }, p0 + 1.6);

  // ── The draft streams in
  let at = p0 + 2.2;
  const stream = (id: string, speed = 900) => {
    const text = q<SVGTextElement>(`#${id}`);
    const clip = q(`#${id}-clip rect`);
    const len = text.getComputedTextLength();
    const dur = Math.max(0.2, len / speed);
    const x0 = Number(text.getAttribute('x'));
    const y0 = Number(text.getAttribute('y'));
    tl.set(q('#ai-caret'), { autoAlpha: 1, x: x0 + 8, y: y0 - 6 }, at);
    tl.to(clip, { attr: { width: len + 6 }, duration: dur, ease: 'none' }, at);
    tl.to(q('#ai-caret'), { x: x0 + len + 12, duration: dur, ease: 'none' }, at);
    at += dur + 0.06;
  };
  const labels = qa('.ai-label');
  tl.to(labels[0], { autoAlpha: 1, duration: 0.2 }, at - 0.1);
  THEMES.forEach((_, i) => {
    stream(`theme-text-${i}`, 1100);
    tl.to(q(`#theme-${i} .theme-track`), { autoAlpha: 1, duration: 0.2 }, at - 0.3);
    tl.to(q(`#theme-${i} .theme-bar`), { scaleX: 1, duration: 0.4, ease: 'power2.out' }, at - 0.2);
    tl.to(q(`#theme-${i} .theme-pct`), { autoAlpha: 1, duration: 0.2 }, at - 0.1);
  });
  tl.to(labels[1], { autoAlpha: 1, duration: 0.2 }, at);
  at += 0.15;
  stream('insight-1');
  stream('insight-2');
  tl.to(labels[2], { autoAlpha: 1, duration: 0.2 }, at);
  at += 0.15;
  stream('concept-1');
  stream('concept-2');
  stream('suggest', 1000);
  tl.to(labels[3], { autoAlpha: 1, duration: 0.2 }, at);
  at += 0.1;
  stream('goal');
  tl.to(q('#ai-caret'), { autoAlpha: 0, duration: 0.2 }, at);
  tl.to(q('#ai-status-1'), { autoAlpha: 0, duration: 0.2 }, at);
  tl.to(q('#ai-status-2'), { autoAlpha: 1, duration: 0.3 }, at + 0.1);

  // ── A designer reviews the draft: cuts one suggestion, verifies the insight
  const r0 = at + 0.2; // ≈ 31
  tl.to(q('#cur-design'), { x: L - 4, y: 578, duration: 0.6 }, r0 - 0.6);
  tl.to(q('#suggest-strike'), { drawSVG: '100%', duration: 0.45, ease: 'power1.inOut' }, r0 + 0.1);
  tl.to(q('#cur-design'), { x: L + 384, y: 574, duration: 0.45, ease: 'power1.inOut' }, r0 + 0.1);
  tl.to(q('#suggest'), { opacity: 0.45, duration: 0.3 }, r0 + 0.4);
  tl.to(q('#suggest-note'), { autoAlpha: 1, duration: 0.35 }, r0 + 0.5);
  tl.to(q('#cur-design'), { x: L + 330, y: 448, duration: 0.6 }, r0 + 0.9);
  tl.to(q('#insight-hl'), { scaleX: 1, duration: 0.5, ease: 'power1.inOut' }, r0 + 1.3);
  tl.to(q('#verified'), { autoAlpha: 1, duration: 0.3 }, r0 + 1.8);
  tl.from(q('#verified'), { scale: 0.6, transformOrigin: '0% 50%', duration: 0.35, ease: 'back.out(2.5)', immediateRender: false }, r0 + 1.8);
  say(ctx, '#chat-research-3', r0 + 1.6, 1.6);
}

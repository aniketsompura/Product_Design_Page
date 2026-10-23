import { gsap } from '../../lib/motion';
import { T } from '../timing';
import type { Ctx } from '../types';
import { sticky } from '../svg';
import { FRAME } from '../rig';
import { SITES } from './console';
import { SPARKLE } from './synthesize';
import { say } from './spark';

/* ── Chapter 4: skip the grey boxes. A prompt + the brief + the design system → AI generates a
   working prototype of the console, which the designer refines and clicks through. ── */

/** Live numbers on the console screen, tweened by the timeline (chapters 4 and 6). */
export const metrics = { enrolled: 888, failed: 312, pct: 74, s0: SITES[0].from, s1: SITES[1].from, s2: SITES[2].from };

const BAR = { x: 300, y: 626, w: 600, h: 54 };

export const promptSvg = /* svg */ `
<g id="prompt">
  <rect class="card" x="${BAR.x}" y="${BAR.y}" width="${BAR.w}" height="${BAR.h}" rx="${BAR.h / 2}" style="stroke-width:1.8"/>
  <path d="${SPARKLE(BAR.x + 30, BAR.y + 27, 10)}" fill="url(#g-ai)"/>
  <clipPath id="prompt-clip"><rect id="prompt-clip-rect" x="${BAR.x + 48}" y="${BAR.y + 8}" width="0" height="38"/></clipPath>
  <text id="prompt-text" class="t-ui" x="${BAR.x + 52}" y="${BAR.y + 32}" clip-path="url(#prompt-clip)" style="font-size:14.5px">Prototype enrollment health from <tspan style="fill:var(--component);font-weight:600">@Brief</tspan> with <tspan style="fill:var(--component);font-weight:600">@Design system</tspan></text>
  <rect id="prompt-caret" x="${BAR.x + 52}" y="${BAR.y + 17}" width="2" height="20" class="fill-accent"/>
  <g id="gen-btn">
    <rect x="${BAR.x + BAR.w - 116}" y="${BAR.y + 9}" width="106" height="36" rx="18" fill="url(#g-ai)"/>
    <text id="gen-label" x="${BAR.x + BAR.w - 63}" y="${BAR.y + 32}" text-anchor="middle" style="font:600 13px var(--font-body);fill:#fff">Generate</text>
    <text id="gen-busy" x="${BAR.x + BAR.w - 63}" y="${BAR.y + 32}" text-anchor="middle" style="font:600 13px var(--font-body);fill:#fff">Generating…</text>
    <text id="gen-done" x="${BAR.x + BAR.w - 63}" y="${BAR.y + 32}" text-anchor="middle" style="font:600 13px var(--font-body);fill:#fff">✓ Ready</text>
  </g>
</g>
${sticky('proto-test', ['Tested with', '5 admins.', '5 of 5 fixed it!'], 'green', { w: 150, h: 120, size: 22 })}`;

export function bindMetrics(ctx: Ctx): void {
  const { q } = ctx;
  const enrolled = q<SVGTextElement>('#stat-enrolled');
  const failed = q<SVGTextElement>('#stat-failed');
  const pct = q<SVGTextElement>('#stat-pct');
  const prog = q('#prog-fill');
  const bars = [0, 1, 2].map((i) => q(`#site-fill-${i}`));
  const pcts = [0, 1, 2].map((i) => q<SVGTextElement>(`#site-pct-${i}`));
  const set = (el: SVGTextElement, v: string) => {
    if (el.textContent !== v) el.textContent = v;
  };
  ctx.onRender(() => {
    set(enrolled, Math.round(metrics.enrolled).toLocaleString('en-US'));
    set(failed, String(Math.round(metrics.failed)));
    set(pct, `${Math.round(metrics.pct)}% enrolled`);
    prog.setAttribute('width', String((580 * metrics.pct) / 100));
    [metrics.s0, metrics.s1, metrics.s2].forEach((v, i) => {
      bars[i].setAttribute('width', String((400 * v) / 100));
      set(pcts[i], `${Math.round(v)}%`);
    });
  });
}

export function animatePrototype(ctx: Ctx): void {
  const { tl, q, qa } = ctx;
  const t = T.prototype;
  const winner = qa<SVGGElement>('#notes .sticky')[0];
  const paper = winner.querySelector<SVGRectElement>('.sticky__paper')!;

  gsap.set(q('#prompt'), { autoAlpha: 0, y: 24 });
  gsap.set([q('#prompt-caret'), q('#gen-busy'), q('#gen-done')], { autoAlpha: 0 });
  gsap.set(q('#proto-test'), { x: 1040, y: 252, rotation: -8, scale: 0.4, autoAlpha: 0, transformOrigin: '50% 50%' });
  gsap.set(q('#device'), { autoAlpha: 0 });
  gsap.set(q('#body-wire'), { drawSVG: '0%', fillOpacity: 0 });
  gsap.set([q('#chrome'), q('#frame-label'), q('#sweep'), q('#group-1-ok'), q('#group-2-ok'), q('#redlines'), q('#pin'), ...qa('.ripple-c')], { autoAlpha: 0 });
  gsap.set(qa('.skel'), { autoAlpha: 0, scaleX: 0.3, transformOrigin: '0% 50%' });
  bindMetrics(ctx);

  // ── The synthesis wraps up into a prompt
  tl.to([q('#ai-panel'), q('#files'), q('#chosen-arrow'), q('#chosen-label')], { autoAlpha: 0, duration: 0.5, stagger: 0.06 }, t);
  tl.to(q('#prompt'), { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, t + 0.3);
  tl.to(q('#cur-design'), { x: BAR.x + 60, y: BAR.y + 40, duration: 0.6 }, t + 0.3);
  tl.to([q('#cur-pm'), q('#cur-research')], { x: (i: number) => [130, 1004][i], y: (i: number) => [420, 640][i], duration: 0.8 }, t + 0.2);
  say(ctx, '#chat-pm-2', t + 0.9, 1.5);
  say(ctx, '#chat-design-4', t + 1.9, 1.6);
  tl.to(q('#cur-pm'), { x: 96, y: 610, duration: 0.8 }, t + 3.2);

  // Type the prompt
  const ty = t + 0.9;
  const promptText = q<SVGTextElement>('#prompt-text');
  const len = promptText.getComputedTextLength();
  tl.set(q('#prompt-caret'), { autoAlpha: 1 }, ty);
  tl.to(q('#prompt-clip-rect'), { attr: { width: len + 8 }, duration: 1.3, ease: 'none' }, ty);
  tl.to(q('#prompt-caret'), { x: len + 2, duration: 1.3, ease: 'none' }, ty);
  tl.to(q('#prompt-caret'), { autoAlpha: 0, duration: 0.1 }, ty + 1.4);

  // Generate
  const g0 = ty + 1.5; // ≈ 37.4
  tl.to(q('#cur-design'), { x: BAR.x + BAR.w - 50, y: BAR.y + 30, duration: 0.4 }, g0 - 0.3);
  tl.to(q('#gen-btn'), { scale: 0.92, transformOrigin: '50% 50%', duration: 0.12, yoyo: true, repeat: 1 }, g0 + 0.1);
  tl.to(q('#gen-label'), { autoAlpha: 0, duration: 0.1 }, g0 + 0.2);
  tl.to(q('#gen-busy'), { autoAlpha: 1, duration: 0.1 }, g0 + 0.25);

  // The chosen sticky is selected and resized into a desktop frame (1440 × 900)
  const m0 = g0 + 0.3;
  tl.to(winner, { x: FRAME.cx, y: FRAME.cy, rotation: 0, duration: 0.8, ease: 'power3.inOut' }, m0);
  tl.to(winner.querySelectorAll('text, .sticky__strip, .sticky__shadow'), { autoAlpha: 0, duration: 0.3 }, m0 + 0.6);
  tl.to(q('#sel'), { autoAlpha: 1, duration: 0.2 }, m0 + 0.2);
  tl.to(q('#cur-design'), { x: FRAME.cx + 48, y: FRAME.cy + 48, duration: 0.8, ease: 'power3.inOut' }, m0);
  const rs = m0 + 0.9;
  tl.to(paper, { attr: { x: -FRAME.w / 2, y: -FRAME.h / 2, width: FRAME.w, height: FRAME.h, rx: FRAME.rx }, duration: 1.3, ease: 'power3.inOut' }, rs);
  tl.to(q('#cur-design'), { x: FRAME.cx + FRAME.w / 2, y: FRAME.cy + FRAME.h / 2, duration: 1.3, ease: 'power3.inOut' }, rs);

  // The frame takes over from the sticky
  const f0 = rs + 1.1; // ≈ 39.8
  tl.set(q('#device'), { autoAlpha: 1 }, f0);
  tl.to(q('#body-wire'), { drawSVG: '100%', duration: 0.5, ease: 'power1.inOut' }, f0);
  tl.to(q('#body-wire'), { fillOpacity: 1, duration: 0.3 }, f0 + 0.3);
  tl.to(paper, { opacity: 0, duration: 0.3 }, f0 + 0.3);
  tl.to([q('#chrome'), q('#frame-label')], { autoAlpha: 1, duration: 0.3 }, f0 + 0.4);
  tl.to(q('#sel'), { autoAlpha: 0, duration: 0.3 }, f0 + 0.6);
  tl.to(q('#cur-design'), { x: 1000, y: 470, duration: 0.7 }, f0 + 0.5);

  // AI lays out a skeleton, then paints the real thing in
  const s0 = f0 + 0.6;
  tl.to(qa('.skel'), { autoAlpha: 1, scaleX: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out' }, s0);
  tl.to(qa('.skel'), { opacity: 0.55, duration: 0.25, yoyo: true, repeat: 3, ease: 'sine.inOut' }, s0 + 0.6);
  const w0 = s0 + 1.1; // ≈ 41.5
  const SW = 2.6;
  tl.set(q('#sweep'), { autoAlpha: 1, x: -FRAME.w / 2 }, w0);
  tl.to(q('#hifi-clip-rect'), { attr: { width: FRAME.w }, duration: SW, ease: 'power1.inOut' }, w0);
  tl.to(q('#sweep'), { x: FRAME.w / 2, duration: SW, ease: 'power1.inOut' }, w0);
  tl.to(qa('.sweep-star'), { rotation: 180, transformOrigin: '50% 50%', duration: SW, ease: 'none' }, w0);
  tl.to(q('#sweep'), { autoAlpha: 0, duration: 0.3 }, w0 + SW);
  tl.to(q('#skeleton'), { autoAlpha: 0, duration: 0.1 }, w0 + SW);
  tl.to(q('#gen-busy'), { autoAlpha: 0, duration: 0.1 }, w0 + SW);
  tl.to(q('#gen-done'), { autoAlpha: 1, duration: 0.2 }, w0 + SW + 0.05);

  // Click through it: one click fixes 298 devices
  const c0 = w0 + SW + 0.4; // ≈ 44.5
  const fixX = FRAME.cx + 274;
  const fixY = FRAME.cy + 41;
  tl.to(q('#cur-design'), { x: fixX + 4, y: fixY + 4, duration: 0.5 }, c0);
  tl.to(q('#fix-btn'), { scale: 0.92, transformOrigin: '50% 50%', duration: 0.1, yoyo: true, repeat: 1 }, c0 + 0.55);
  qa('.ripple-c').forEach((rip, i) => {
    tl.set(rip, { autoAlpha: 1, attr: { r: 6 } }, c0 + 0.55 + i * 0.12);
    tl.to(rip, { attr: { r: 44 }, autoAlpha: 0, duration: 0.55, ease: 'power2.out' }, c0 + 0.55 + i * 0.12);
  });
  tl.to(q('#group-1-ok'), { autoAlpha: 1, duration: 0.35 }, c0 + 0.8);
  tl.to(metrics, { enrolled: 1186, failed: 14, pct: 99, s0: 100, s1: 92, s2: 99, duration: 0.9, ease: 'power2.out' }, c0 + 0.8);

  // Same afternoon: real admins try it
  tl.to(q('#cur-research'), { x: 1000, y: 330, duration: 0.6 }, c0 + 0.6);
  tl.to(q('#proto-test'), { autoAlpha: 1, scale: 1, rotation: 5, duration: 0.4, ease: 'back.out(2)' }, c0 + 1.1);
}

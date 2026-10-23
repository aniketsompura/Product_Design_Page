export type Pt = [number, number];

const r = (n: number) => Math.round(n * 10) / 10;

/** Catmull-Rom spline through points, as cubic Béziers. Gives hand-drawn curves without hand-writing path data. */
export function smoothPath(points: Pt[], tension = 1): string {
  if (points.length < 2) return '';
  let d = `M${r(points[0][0])} ${r(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension];
    d += ` C${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d;
}

/** A marker loop drawn around something, overshooting its start like a real pen stroke. */
export function handLoop(cx: number, cy: number, rx: number, ry: number, seed = 0, overshoot = 0.14): string {
  const n = 18;
  const start = -Math.PI * 0.7 + seed * 0.4;
  const total = Math.PI * 2 * (1 + overshoot);
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = start + (total * i) / n;
    const wobble = 1 + 0.05 * Math.sin(i * 2.3 + seed * 3.1);
    const shrink = 1 - 0.06 * (i / n);
    pts.push([cx + Math.cos(a) * rx * wobble * shrink, cy + Math.sin(a) * ry * wobble * shrink]);
  }
  return smoothPath(pts);
}

/** A slightly curved arrow with an open arrowhead. */
export function arrow(x1: number, y1: number, x2: number, y2: number, bend = 0.2, head = 12): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const cx = mx - (y2 - y1) * bend;
  const cy = my + (x2 - x1) * bend;
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const a1 = ang + Math.PI - 0.5;
  const a2 = ang + Math.PI + 0.5;
  return (
    `M${r(x1)} ${r(y1)} Q${r(cx)} ${r(cy)} ${r(x2)} ${r(y2)} ` +
    `M${r(x2 + Math.cos(a1) * head)} ${r(y2 + Math.sin(a1) * head)} L${r(x2)} ${r(y2)} ` +
    `L${r(x2 + Math.cos(a2) * head)} ${r(y2 + Math.sin(a2) * head)}`
  );
}

/** A wavy underline. */
export function squiggle(x1: number, x2: number, y: number, amp = 4, waves = 6): string {
  const pts: Pt[] = [];
  const steps = waves * 2;
  for (let i = 0; i <= steps; i++) {
    pts.push([x1 + ((x2 - x1) * i) / steps, y + (i % 2 === 0 ? -amp : amp) * (i === 0 || i === steps ? 0.3 : 1)]);
  }
  return smoothPath(pts);
}

/** Five-point star path centered on cx, cy. */
export function star(cx: number, cy: number, outer: number, inner = outer * 0.45): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(`${r(cx + Math.cos(a) * rad)} ${r(cy + Math.sin(a) * rad)}`);
  }
  return `M${pts.join(' L')} Z`;
}

/** Heart outline centered on cx, cy. */
export function heart(cx: number, cy: number, s: number): string {
  return (
    `M${r(cx)} ${r(cy + s * 0.9)} ` +
    `C${r(cx - s * 1.4)} ${r(cy)} ${r(cx - s * 1.1)} ${r(cy - s)} ${r(cx - s * 0.5)} ${r(cy - s)} ` +
    `C${r(cx - s * 0.15)} ${r(cy - s)} ${r(cx)} ${r(cy - s * 0.7)} ${r(cx)} ${r(cy - s * 0.5)} ` +
    `C${r(cx)} ${r(cy - s * 0.7)} ${r(cx + s * 0.15)} ${r(cy - s)} ${r(cx + s * 0.5)} ${r(cy - s)} ` +
    `C${r(cx + s * 1.1)} ${r(cy - s)} ${r(cx + s * 1.4)} ${r(cy)} ${r(cx)} ${r(cy + s * 0.9)} Z`
  );
}

/**
 * A sticky note centered on its own origin. The outer group is moved by GSAP; the paper is a
 * separate rect so it can be resized later.
 */
export function sticky(
  id: string,
  lines: string[],
  color: 'yellow' | 'pink' | 'green' | 'lilac',
  opts: { w?: number; h?: number; size?: number; extra?: string } = {},
): string {
  const w = opts.w ?? 96;
  const h = opts.h ?? 96;
  const size = opts.size ?? 22;
  const lh = size * 1.02;
  const firstY = -((lines.length - 1) * lh) / 2 + size * 0.32;
  const tspans = lines.map((line, i) => `<tspan x="0" y="${r(firstY + i * lh)}">${line}</tspan>`).join('');
  return `
  <g class="sticky" id="${id}">
    <rect class="sticky__shadow" x="${-w / 2 + 3}" y="${-h / 2 + 6}" width="${w}" height="${h}" rx="3"/>
    <rect class="sticky__paper s-${color}" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="3"/>
    <rect class="sticky__strip" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${Math.round(h * 0.16)}" rx="3"/>
    <text class="sticky__text" text-anchor="middle" style="font-size:${size}px">${tspans}</text>
    ${opts.extra ?? ''}
  </g>`;
}

export type Role = 'design' | 'pm' | 'research' | 'eng';

/** A multiplayer cursor with a name tag. Chat bubbles (cursor chat) are added as children. */
export function cursor(role: Role, label: string, chats: { id: string; text: string; left?: boolean }[] = []): string {
  const chatSvg = chats
    .map(
      (c) => `
      <g class="chat" id="${c.id}" data-fit="14"${c.left ? ' data-side="left"' : ''}>
        <rect class="chat__bg" x="12" y="48" width="120" height="30" rx="15"/>
        <rect class="chat__bg" x="12" y="48" width="16" height="16"/>
        <text class="chat__text" x="26" y="68">${c.text}</text>
      </g>`,
    )
    .join('');
  return `
  <g class="cursor" id="cur-${role}" data-role="${role}">
    <g transform="scale(1.35)">
      <path class="cursor__arrow" d="M0 0 V19.5 L5 15 L8.8 23.4 L12.2 21.9 L8.5 13.7 L15 13.4 Z"/>
      <g data-fit="8">
        <rect class="cursor__tag" x="11" y="21" width="60" height="22" rx="6"/>
        <text class="cursor__label" x="19" y="36.2">${label}</text>
      </g>
      ${chatSvg}
    </g>
  </g>`;
}

/** Size every [data-fit] pill to the text inside it. Run once web fonts are ready. */
export function fitPills(root: Element): void {
  root.querySelectorAll<SVGGElement>('[data-fit]').forEach((group) => {
    const pad = Number(group.dataset.fit ?? 8);
    const text = group.querySelector('text');
    const rect = group.querySelector('rect');
    if (!text || !rect) return;
    const len = text.getComputedTextLength();
    const w = Math.ceil(len + pad * 2);
    rect.setAttribute('width', String(w));
    if (group.dataset.side === 'left') {
      // Mirror the bubble so it grows to the left of the cursor
      const x = -w - 4;
      rect.setAttribute('x', String(x));
      text.setAttribute('x', String(x + pad));
      const corner = group.querySelectorAll('rect')[1];
      corner?.setAttribute('x', String(-20));
    }
  });
}

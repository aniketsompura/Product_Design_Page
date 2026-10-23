import { FRAME } from '../rig';
import { SPARKLE } from './synthesize';

/* ── The prototype: an EMM console's "Enrollment health" page, in frame-local coordinates.
   (0,0) is the frame center; the frame is 720 × 450 (stands for a 1440 × 900 desktop). ── */

const W = FRAME.w / 2; // 360
const H = FRAME.h / 2; // 225
const TOP = -H + 30; // below the browser bar
const MX = -236; // main column left
const MR = 344; // main column right
const MW = MR - MX;

export const SITES = [
  { name: 'Toronto DC', from: 96, to: 100 },
  { name: 'Dallas DC', from: 71, to: 98 },
  { name: 'Leeds', from: 52, to: 99 },
];
const SITE_Y = [176, 194, 212];
const SITE_BAR = { x: -126, w: 400 };

const STATS = [
  { label: 'ENROLLED', id: 'stat-enrolled', value: '888', side: 'of 1,200' },
  { label: 'FAILED', id: 'stat-failed', value: '312', side: '2 reasons', critical: true },
  { label: 'AVG. TIME', id: 'stat-time', value: '4m 12s', side: 'per device' },
];

const NAV = ['Devices', 'Enrollment', 'Policies', 'Apps', 'Reports'];

const skeleton = /* svg */ `
<g id="skeleton">
  <path class="skel" d="M${-W} ${TOP} H${-W + 108} V${H} H${-W + 14} Q${-W} ${H} ${-W} ${H - 14} Z"/>
  <rect class="skel" x="${MX}" y="${TOP + 18}" width="180" height="18" rx="5"/>
  <rect class="skel" x="${MX}" y="${TOP + 44}" width="250" height="10" rx="5"/>
  <rect class="skel" x="${MR - 120}" y="${TOP + 19}" width="120" height="30" rx="15"/>
  ${[0, 1, 2].map((i) => `<rect class="skel" x="${MX + i * 197}" y="-122" width="186" height="56" rx="10"/>`).join('')}
  <rect class="skel" x="${MX}" y="-40" width="${MW}" height="8" rx="4"/>
  <rect class="skel" x="${MX}" y="-16" width="110" height="12" rx="5"/>
  <rect class="skel" x="${MX}" y="6" width="${MW}" height="70" rx="12"/>
  <rect class="skel" x="${MX}" y="86" width="${MW}" height="52" rx="12"/>
  ${SITE_Y.map((y) => `<rect class="skel" x="${MX}" y="${y - 9}" width="${MW}" height="10" rx="5"/>`).join('')}
</g>`;

const groupCard = (id: string, y: number, h: number, tone: 'critical' | 'warn' | 'ok', title: string, sub: string, action: string) => {
  const fill = tone === 'critical' ? 'var(--app-critical-soft)' : tone === 'ok' ? 'var(--app-success-soft)' : 'var(--app-card)';
  const stroke = tone === 'critical' ? 'var(--app-critical)' : tone === 'ok' ? 'var(--app-success)' : 'var(--app-line)';
  const iconFill = tone === 'critical' ? 'var(--app-critical)' : tone === 'ok' ? 'var(--app-success)' : 'var(--app-warn)';
  const cy = y + h / 2;
  const icon =
    tone === 'ok'
      ? `<circle cx="${MX + 24}" cy="${cy}" r="12" style="fill:${iconFill}"/><path d="M${MX + 18} ${cy} l4 4 l8 -8" style="fill:none;stroke:#fff;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round"/>`
      : `<circle cx="${MX + 24}" cy="${cy}" r="12" style="fill:${iconFill}"/><text x="${MX + 24}" y="${cy + 5}" text-anchor="middle" style="font:800 14px var(--font-body);fill:#fff">!</text>`;
  const big = h > 60;
  const btn =
    action === ''
      ? ''
      : tone === 'critical'
        ? `<g id="fix-btn"><rect x="${MR - 126}" y="${cy - 16}" width="112" height="32" rx="16" class="app-primary"/><text class="t-ui app-white" x="${MR - 70}" y="${cy + 4.5}" text-anchor="middle" style="font-size:12.5px;font-weight:600">${action}</text></g>`
        : tone === 'ok'
          ? `<rect x="${MR - 76}" y="${cy - 13}" width="62" height="26" rx="13" style="fill:var(--app-success)"/><text class="t-ui app-white" x="${MR - 45}" y="${cy + 4.5}" text-anchor="middle" style="font-size:12px;font-weight:700">${action}</text>`
          : `<rect x="${MR - 112}" y="${cy - 14}" width="98" height="28" rx="14" class="app-card" style="stroke:var(--app-line);stroke-width:1.4"/><text class="t-ui app-ink" x="${MR - 63}" y="${cy + 4.5}" text-anchor="middle" style="font-size:12px;font-weight:600">${action}</text>`;
  return `
  <g id="${id}">
    <rect x="${MX}" y="${y}" width="${MW}" height="${h}" rx="12" style="fill:${fill};stroke:${stroke};stroke-width:1.5"/>
    ${icon}
    <text class="t-ui app-ink" x="${MX + 46}" y="${cy - (big ? 6 : 3)}" style="font-size:${big ? 14 : 13}px;font-weight:700">${title}</text>
    <text class="t-ui app-muted" x="${MX + 46}" y="${cy + (big ? 14 : 13)}" style="font-size:11.5px">${sub}</text>
    ${btn}
  </g>`;
};

const hifi = /* svg */ `
<g id="hifi" clip-path="url(#hifi-clip)">
  <path class="app-bg" d="M${-W} ${TOP} H${W} V${H - 14} Q${W} ${H} ${W - 14} ${H} H${-W + 14} Q${-W} ${H} ${-W} ${H - 14} Z"/>

  <path d="M${-W} ${TOP} H${-W + 108} V${H} H${-W + 14} Q${-W} ${H} ${-W} ${H - 14} Z" style="fill:var(--app-side)"/>
  <rect x="${-W + 16}" y="${TOP + 16}" width="24" height="24" rx="7" class="app-primary"/>
  <path d="M${-W + 28} ${TOP + 21} l7 3 v5 c0 4 -3 6.5 -7 8 c-4 -1.5 -7 -4 -7 -8 v-5 Z" style="fill:#fff"/>
  <text x="${-W + 48}" y="${TOP + 33}" style="font:700 13px var(--font-display);fill:#fff;letter-spacing:0.02em">EMM</text>
  ${NAV.map((n, i) => {
    const y = TOP + 74 + i * 28;
    const active = n === 'Enrollment';
    return `${active ? `<rect x="${-W + 8}" y="${y - 15}" width="92" height="24" rx="7" style="fill:#fff;opacity:0.13"/>` : ''}
    <rect x="${-W + 18}" y="${y - 8}" width="10" height="10" rx="3" style="fill:#fff;opacity:${active ? 0.95 : 0.45}"/>
    <text x="${-W + 36}" y="${y + 1}" style="font:${active ? 600 : 500} 11.5px var(--font-body);fill:#fff;opacity:${active ? 1 : 0.62}">${n}</text>`;
  }).join('')}

  <text class="app-ink" x="${MX}" y="${TOP + 34}" style="font:700 21px var(--font-display);letter-spacing:-0.02em">Enrollment health</text>
  <text class="t-ui app-muted" x="${MX}" y="${TOP + 53}" style="font-size:11.5px">Warehouse rollout · 1,200 devices · 3 sites</text>
  <rect x="${MR - 120}" y="${TOP + 19}" width="120" height="30" rx="15" class="app-card" style="stroke:var(--app-line);stroke-width:1.4"/>
  <text class="t-ui app-ink" x="${MR - 60}" y="${TOP + 38.5}" text-anchor="middle" style="font-size:12px;font-weight:600">Enroll devices</text>

  ${STATS.map((s, i) => {
    const x = MX + i * 197;
    return `
  <rect x="${x}" y="-122" width="186" height="56" rx="10" class="app-card" style="stroke:var(--app-line);stroke-width:1.2"/>
  <text class="t-mono app-muted" x="${x + 14}" y="-102" style="font-size:10px;letter-spacing:0.06em">${s.label}</text>
  <text id="${s.id}" x="${x + 14}" y="-76" style="font:700 22px var(--font-display);fill:${s.critical ? 'var(--app-critical)' : 'var(--app-ink)'};font-variant-numeric:tabular-nums">${s.value}</text>
  <text class="t-ui app-muted" x="${x + 172}" y="-77" text-anchor="end" style="font-size:11px">${s.side}</text>`;
  }).join('')}

  <text id="stat-pct" class="t-ui app-ink" x="${MX}" y="-44" style="font-size:11.5px;font-weight:700">74% enrolled</text>
  <text class="t-ui app-muted" x="${MR}" y="-44" text-anchor="end" style="font-size:11px">Target 95%</text>
  <rect x="${MX}" y="-36" width="${MW}" height="8" rx="4" style="fill:var(--app-line)"/>
  <rect id="prog-fill" x="${MX}" y="-36" width="${MW * 0.74}" height="8" rx="4" class="app-primary"/>
  <path d="M${MX + MW * 0.95} -40 V-24" style="stroke:var(--app-ink);stroke-width:1.5"/>

  <text class="t-ui app-ink" x="${MX}" y="-6" style="font-size:13px;font-weight:700">Needs attention</text>
  ${groupCard('group-1', 6, 70, 'critical', '298 devices · Apple push certificate expired', 'Expired 2 days ago, so these devices can’t check in.', 'Renew & retry')}
  <g id="group-1-ok">${groupCard('group-1-ok-card', 6, 70, 'ok', '298 devices re-enrolled', 'Certificate renewed. Retried in batches of 50.', 'Fixed')}</g>
  ${groupCard('group-2', 86, 52, 'warn', '14 devices · Wi-Fi profile missing', 'Dallas DC · profile not assigned to this group', 'Add profile')}
  <g id="group-2-ok">${groupCard('group-2-ok-card', 86, 52, 'ok', '14 devices re-enrolled', 'Wi-Fi profile added to Dallas DC', 'Fixed')}</g>

  <text class="t-mono app-muted" x="${MX}" y="158" style="font-size:10px;letter-spacing:0.06em">BY SITE</text>
  ${SITES.map(
    (s, i) => `
  <text class="t-ui app-ink" x="${MX}" y="${SITE_Y[i]}" style="font-size:11.5px;font-weight:600">${s.name}</text>
  <rect x="${SITE_BAR.x}" y="${SITE_Y[i] - 8}" width="${SITE_BAR.w}" height="7" rx="3.5" style="fill:var(--app-line)"/>
  <rect class="site-fill" id="site-fill-${i}" x="${SITE_BAR.x}" y="${SITE_Y[i] - 8}" width="${(SITE_BAR.w * s.from) / 100}" height="7" rx="3.5" style="fill:var(--app-primary)"/>
  <text class="t-mono app-ink site-pct" id="site-pct-${i}" x="${MR}" y="${SITE_Y[i]}" text-anchor="end" style="font-size:11px;font-weight:600">${s.from}%</text>`,
  ).join('')}
</g>`;

/** Spec redlines for chapter 5, drawn large because the frame is scaled down then. */
const tick = (x1: number, y1: number, x2: number, y2: number) =>
  x1 === x2 ? `M${x1 - 6} ${y1} H${x1 + 6} M${x2 - 6} ${y2} H${x2 + 6}` : `M${x1} ${y1 - 6} V${y1 + 6} M${x2} ${y2 - 6} V${y2 + 6}`;
const measure = (id: string, x1: number, y1: number, x2: number, y2: number, label: string, lx: number, ly: number) => `
  <g class="redline" id="${id}">
    <path class="ln-measure rl-line" d="M${x1} ${y1} L${x2} ${y2} ${tick(x1, y1, x2, y2)}" style="stroke-width:2.4"/>
    <path class="ln-measure rl-lead" d="M${(x1 + x2) / 2} ${(y1 + y2) / 2} L${lx} ${ly}" stroke-dasharray="3 5" style="stroke-width:1.8"/>
    <g class="rl-tag" data-fit="9">
      <rect class="measure-bg" x="${lx}" y="${ly - 15}" width="44" height="30" rx="7"/>
      <text class="measure-text" x="${lx + 9}" y="${ly + 6}" style="font-size:17px">${label}</text>
    </g>
  </g>`;

const redlines = /* svg */ `
<g id="redlines">
  ${measure('rl-pad', MX, 41, MX + 12, 41, '12', MX - 90, 41)}
  ${measure('rl-gap', 120, 76, 120, 86, '8', 150, 108)}
  ${measure('rl-btn', MR + 8, 25, MR + 8, 57, '32', MR + 26, 41)}
  ${measure('rl-radius', MX + 2, 18, MX + 12, 8, 'r 12', MX - 104, -52)}
</g>`;

const pin = /* svg */ `
<g id="pin">
  <path d="M${MR - 12} ${-2} L${MR - 22} ${10} L${MR - 6} ${4} Z" style="fill:var(--role-eng)"/>
  <circle cx="${MR - 2}" cy="${-12}" r="17" style="fill:var(--role-eng);stroke:var(--surface);stroke-width:3"/>
  <text x="${MR - 2}" y="${-6}" text-anchor="middle" style="font:700 16px var(--font-body);fill:var(--on-role)">E</text>
</g>`;

export const PIN_LOCAL = { x: MR - 2, y: -12 };
export const FIX_BTN_LOCAL = { x: MR - 70, y: 41 };

export const consoleSvg = /* svg */ `
<g id="device" transform="translate(${FRAME.cx} ${FRAME.cy})">
  <defs>
    <clipPath id="hifi-clip"><rect id="hifi-clip-rect" x="${-W}" y="${-H - 4}" width="0" height="${FRAME.h + 8}"/></clipPath>
  </defs>
  <text id="frame-label" class="t-label" x="${-W}" y="${-H - 12}" style="letter-spacing:0.02em;font-size:14px"><tspan style="fill:var(--accent)"># </tspan>EMM Console · Enrollment health</text>
  <rect id="body-wire" class="card" x="${-W}" y="${-H}" width="${FRAME.w}" height="${FRAME.h}" rx="${FRAME.rx}" style="stroke-width:2"/>
  <g id="chrome">
    <path d="M${-W} ${TOP} H${W}" class="ln-soft" style="stroke-width:1.4"/>
    <circle cx="${-W + 20}" cy="${-H + 15}" r="5" style="fill:#ff5f57"/>
    <circle cx="${-W + 36}" cy="${-H + 15}" r="5" style="fill:#febc2e"/>
    <circle cx="${-W + 52}" cy="${-H + 15}" r="5" style="fill:#28c840"/>
    <rect x="-170" y="${-H + 6}" width="340" height="18" rx="9" class="fill-canvas" style="stroke:var(--hairline);stroke-width:1"/>
    <text x="0" y="${-H + 19}" text-anchor="middle" class="t-mono" style="font-size:10.5px;fill:var(--ink-2)">emm-console / enrollment / health</text>
  </g>
  ${skeleton}
  ${hifi}
  <g id="sweep">
    <path d="M0 ${-H - 18} V${H + 18}" style="stroke:var(--component);stroke-width:14;opacity:0.16;stroke-linecap:round"/>
    <path d="M0 ${-H - 18} V${H + 18}" stroke="url(#g-ai-v)" style="stroke-width:3;stroke-linecap:round"/>
    <path class="sweep-star" d="${SPARKLE(0, -120, 11)}" fill="url(#g-ai)"/>
    <path class="sweep-star" d="${SPARKLE(0, 30, 8)}" fill="url(#g-ai)"/>
    <path class="sweep-star" d="${SPARKLE(0, 160, 12)}" fill="url(#g-ai)"/>
  </g>
  ${redlines}
  ${pin}
  <g id="console-ripple">
    <circle class="ripple-c" cx="${FIX_BTN_LOCAL.x}" cy="${FIX_BTN_LOCAL.y}" r="6" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>
    <circle class="ripple-c" cx="${FIX_BTN_LOCAL.x}" cy="${FIX_BTN_LOCAL.y}" r="6" style="fill:none;stroke:var(--accent);stroke-width:2"/>
  </g>
</g>`;

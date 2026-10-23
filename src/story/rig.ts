/**
 * Plain objects tweened by the timeline. They are applied as SVG transform attributes on every
 * render, which keeps nested translate/scale math predictable.
 */

/** The prototype frame (a desktop console). Local coordinates are centered on (0, 0). */
export const FRAME = { w: 720, h: 450, rx: 14, cx: 600, cy: 372, realW: 1440, realH: 900 } as const;

export const device = { x: FRAME.cx, y: FRAME.cy, s: 1 };
export const camera = { cx: 600, cy: 400, s: 1 };

export function applyRig(deviceEl: SVGGElement, cameraEl: SVGGElement, zoomLabel: HTMLElement | null): void {
  deviceEl.setAttribute('transform', `translate(${device.x.toFixed(2)} ${device.y.toFixed(2)}) scale(${device.s.toFixed(4)})`);
  const { cx, cy, s } = camera;
  cameraEl.setAttribute('transform', `translate(600 400) scale(${s.toFixed(4)}) translate(${(-cx).toFixed(2)} ${(-cy).toFixed(2)})`);
  if (zoomLabel) {
    const pct = `${Math.round(s * 100)}%`;
    if (zoomLabel.textContent !== pct) zoomLabel.textContent = pct;
  }
}

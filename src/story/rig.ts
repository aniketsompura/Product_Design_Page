/**
 * Plain objects tweened by the timeline. They are applied as SVG transform attributes on every
 * render, which keeps nested translate/scale math predictable.
 */
export const device = { x: 600, y: 400, s: 1 };
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

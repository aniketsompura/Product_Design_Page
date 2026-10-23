export interface Ctx {
  tl: gsap.core.Timeline;
  svg: SVGSVGElement;
  /** querySelector inside the stage (throws if missing, so typos surface immediately) */
  q: <T extends Element = SVGGraphicsElement>(selector: string) => T;
  qa: <T extends Element = SVGGraphicsElement>(selector: string) => T[];
  /** Run something on every timeline render (for attributes that follow other tweens). */
  onRender: (fn: () => void) => void;
}

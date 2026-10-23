import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin);

export { gsap, ScrollTrigger };

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis: Lenis | null = null;

/** Smooth scrolling, kept in lockstep with GSAP's ticker so scrubbed timelines never drift. */
export function initSmoothScroll(): Lenis | null {
  if (reducedMotion) return null;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToY(y: number, slow = false): void {
  if (lenis) {
    lenis.scrollTo(y, { duration: slow ? 2.2 : 1.4 });
  } else {
    window.scrollTo({ top: y, behavior: reducedMotion ? 'auto' : 'smooth' });
  }
}

export function scrollVelocity(): number {
  return lenis ? lenis.velocity : 0;
}

/** In-page links go through the smooth scroller. */
export function wireAnchorLinks(): void {
  document.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href')!.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    event.preventDefault();
    const y = id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY;
    scrollToY(y, true);
    if (id === 'main' || id === 'top') return;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

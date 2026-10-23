import { gsap, ScrollTrigger, reducedMotion, scrollVelocity } from './lib/motion';
import { splitWords, wrapWords } from './lib/split';

export function initOutro(): void {
  // Section titles rise in, word by word
  document.querySelectorAll<HTMLElement>('.section__title, .cta__title').forEach((title) => {
    const words = splitWords(title);
    if (reducedMotion) return;
    gsap.from(words, {
      yPercent: 115,
      duration: 0.9,
      stagger: 0.06,
      ease: 'power3.out',
      scrollTrigger: { trigger: title, start: 'top 88%', once: true },
    });
  });

  // Capability cards: icons draw themselves, cards settle into place
  document.querySelectorAll<HTMLElement>('.cap').forEach((cap, i) => {
    const strokes = cap.querySelectorAll('.cap__icon > *');
    gsap.set(strokes, { drawSVG: '0%' });
    const tl = gsap.timeline({ scrollTrigger: { trigger: cap, start: 'top 90%', once: true } });
    if (!reducedMotion) tl.from(cap, { y: 48, duration: 0.9, ease: 'power3.out', delay: (i % 3) * 0.08 });
    tl.to(strokes, { drawSVG: '100%', duration: 0.9, stagger: 0.12, ease: 'power2.inOut' }, reducedMotion ? 0 : 0.2);
  });

  // Principles fill in, word by word, as you read down the page
  document.querySelectorAll<HTMLElement>('[data-fill]').forEach((p) => {
    const words = wrapWords(p);
    gsap.fromTo(
      words,
      { opacity: 0.18 },
      { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: p, start: 'top 85%', end: 'top 45%', scrub: true } },
    );
    const note = p.nextElementSibling;
    if (note && !reducedMotion) {
      gsap.from(note, { x: -16, rotation: -3, opacity: 0, duration: 0.6, ease: 'back.out(2)', scrollTrigger: { trigger: p, start: 'top 55%', once: true } });
    }
  });

  // Tool marquee: endless, and it leans into your scroll speed
  const track = document.querySelector<HTMLElement>('[data-marquee-track]');
  if (track && !reducedMotion) {
    track.innerHTML += track.innerHTML;
    track.querySelectorAll('span, i').forEach((el, i, all) => {
      if (i >= all.length / 2) el.setAttribute('aria-hidden', 'true');
    });
    const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    let boost = 1;
    gsap.ticker.add(() => {
      const v = scrollVelocity();
      const target = 1 + Math.min(Math.abs(v) / 6, 5);
      boost += (target - boost) * 0.08;
      loop.timeScale(v < -0.5 ? -boost : boost);
    });
  }

  // CTA arrow scribble
  const arrow = document.querySelector('.cta__note path');
  if (arrow) {
    gsap.fromTo(arrow, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: '.cta', start: 'top 70%', once: true } });
  }

  ScrollTrigger.refresh();
}

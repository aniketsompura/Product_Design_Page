import { gsap, ScrollTrigger, reducedMotion, finePointer } from './lib/motion';
import { splitWords } from './lib/split';

export function initHero(): void {
  const frame = document.querySelector<HTMLElement>('[data-hero-frame]');
  const title = frame?.querySelector<HTMLElement>('.hero__title');
  const dims = document.querySelector<HTMLElement>('[data-hero-dims]');
  if (!frame || !title) return;

  // The selection tag shows the frame's real size, like a design tool would.
  const showSize = () => {
    if (!dims) return;
    const r = frame.getBoundingClientRect();
    dims.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`;
  };
  showSize();
  new ResizeObserver(showSize).observe(frame);

  const words = splitWords(title);
  const doodle = title.querySelectorAll('.spark-doodle path');
  const handles = frame.querySelectorAll('.sel-handle');
  const decor = document.querySelectorAll<HTMLElement>('.hero-cursor, .hero-sticky');

  if (!reducedMotion) {
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });
    intro
      .from(words, { yPercent: 115, duration: 0.9, stagger: 0.045 })
      .from(frame, { outlineColor: 'rgba(0,0,0,0)', duration: 0.5, ease: 'none' }, 0.5)
      .from(handles, { scale: 0, duration: 0.35, stagger: 0.06, ease: 'back.out(3)' }, 0.6)
      .from(dims, { autoAlpha: 0, y: -6, duration: 0.3 }, 0.9)
      .from(doodle, { drawSVG: '50% 50%', duration: 0.5, ease: 'power2.out' }, 0.8)
      .from('.hero__below > *', { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, 0.7)
      .from('.hero-cursor', { x: (i: number) => [140, -160, 120][i] ?? 0, y: (i: number) => [60, 80, -60][i] ?? 0, autoAlpha: 0, duration: 1.1, stagger: 0.15 }, 0.9)
      .from('.hero-sticky', { scale: 1.5, rotation: 24, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.8)' }, 1.3);

    // The spark keeps twinkling
    gsap.to('.spark-doodle', { scale: 1.12, rotation: 8, transformOrigin: '50% 50%', duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 });

    // Collaborators idle on the canvas and react a little to the pointer
    decor.forEach((el, i) => {
      gsap.to(el, { y: '+=8', x: '+=5', duration: 2.2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2 + i * 0.2 });
    });
    if (finePointer) {
      const movers = Array.from(decor).map((el) => ({
        k: Number(el.dataset.drift ?? 1),
        x: gsap.quickTo(el, 'xPercent', { duration: 1.2, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'yPercent', { duration: 1.2, ease: 'power3.out' }),
      }));
      window.addEventListener('pointermove', (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(nx * 18 * m.k);
          m.y(ny * 30 * m.k);
        });
      });
    }
  }

  // The thread that leads you into the story draws as you scroll
  const thread = document.querySelector('[data-hero-thread]');
  if (thread) {
    gsap.fromTo(
      thread,
      { drawSVG: '0%' },
      { drawSVG: '100%', ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: true } },
    );
  }

  // Top bar gets a background once you leave the top
  const bar = document.querySelector('[data-topbar]');
  if (bar) {
    ScrollTrigger.create({
      start: 24,
      end: 'max',
      onToggle: (self) => bar.classList.toggle('is-scrolled', self.isActive),
    });
  }
}

/** A "You" cursor tag follows the viewer, so they join the session too. */
export function initYouCursor(): void {
  if (!finePointer) return;
  const tag = document.createElement('div');
  tag.className = 'you-cursor';
  tag.setAttribute('aria-hidden', 'true');
  tag.textContent = 'You';
  document.body.appendChild(tag);
  const dur = reducedMotion ? 0 : 0.35;
  const x = gsap.quickTo(tag, 'x', { duration: dur, ease: 'power3.out' });
  const y = gsap.quickTo(tag, 'y', { duration: dur, ease: 'power3.out' });
  let shown = false;
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (!shown) {
      gsap.set(tag, { x: e.clientX + 14, y: e.clientY + 20 });
      tag.classList.add('is-on');
      shown = true;
    }
    x(e.clientX + 14);
    y(e.clientY + 20);
  });
  document.documentElement.addEventListener('pointerleave', () => {
    tag.classList.remove('is-on');
    shown = false;
  });
}

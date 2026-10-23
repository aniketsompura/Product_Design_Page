import './styles.css';
import { ScrollTrigger, initSmoothScroll, wireAnchorLinks } from './lib/motion';
import { initHero, initYouCursor } from './hero';
import { initStory } from './story';
import { initOutro } from './outro';

/** Wait for web fonts (SVG text is measured), but never longer than a moment. */
function fontsReady(timeout = 1800): Promise<void> {
  if (!('fonts' in document)) return Promise.resolve();
  return Promise.race([document.fonts.ready.then(() => undefined), new Promise<void>((r) => setTimeout(r, timeout))]);
}

async function boot(): Promise<void> {
  initSmoothScroll();
  wireAnchorLinks();
  await fontsReady();
  initHero();
  initStory();
  initOutro();
  initYouCursor();
  ScrollTrigger.refresh();
}

boot();

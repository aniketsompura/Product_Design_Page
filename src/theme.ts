import { reducedMotion } from './lib/motion';

const KEY = 'pd-theme';
type Mode = 'light' | 'dark';

const root = document.documentElement;
const current = (): Mode => (root.dataset.mode === 'dark' ? 'dark' : 'light');

function save(mode: Mode): void {
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* storage can be blocked; the switch still works for this visit */
  }
}

/** Light by default. The switch in the top bar flips to dark (and back), with a circular reveal. */
export function initThemeSwitch(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-switch]');
  if (!button) return;

  const sync = () => {
    const dark = current() === 'dark';
    button.setAttribute('aria-checked', String(dark));
    button.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
  };
  sync();

  button.addEventListener('click', () => {
    const next: Mode = current() === 'dark' ? 'light' : 'dark';
    const apply = () => {
      if (next === 'dark') root.dataset.mode = 'dark';
      else delete root.dataset.mode;
      sync();
      save(next);
    };

    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || reducedMotion) {
      apply();
      return;
    }
    const r = button.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    doc
      .startViewTransition(apply)
      .ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
        );
      })
      .catch(() => undefined);
  });
}

/**
 * Wraps every word of an element in a masked span so words can slide up into view.
 * Works on text nodes only, so inline markup (spans, inline SVG) is preserved.
 * Returns the inner spans, in reading order.
 */
export function splitWords(root: HTMLElement): HTMLElement[] {
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.parentElement?.closest('svg')) continue;
    textNodes.push(node);
  }

  const words: HTMLElement[] = [];
  for (const node of textNodes) {
    const parts = (node.textContent ?? '').split(/(\s+)/);
    const frag = document.createDocumentFragment();
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(' '));
        continue;
      }
      const outer = document.createElement('span');
      outer.className = 'w';
      const inner = document.createElement('span');
      inner.className = 'w__i';
      inner.textContent = part;
      outer.appendChild(inner);
      frag.appendChild(outer);
      words.push(inner);
    }
    node.replaceWith(frag);
  }
  return words;
}

/** Plain word spans (no mask), for color/opacity scrubbing. */
export function wrapWords(root: HTMLElement): HTMLElement[] {
  const words = (root.textContent ?? '').trim().split(/\s+/);
  root.textContent = '';
  return words.map((word, i) => {
    const span = document.createElement('span');
    span.className = 'fw';
    span.textContent = word;
    root.appendChild(span);
    if (i < words.length - 1) root.appendChild(document.createTextNode(' '));
    return span;
  });
}

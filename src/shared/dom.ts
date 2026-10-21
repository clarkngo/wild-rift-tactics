import type { Champion } from './types';
import { portraitUrl } from './champions';

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function portrait(c: Champion, size = 56) {
  return `<img class="portrait" src="${portraitUrl(c)}" alt="" width="${size}" height="${size}"
    loading="lazy" data-initials="${esc(c.name.slice(0, 2))}" />`;
}

/** Swap broken portraits for initials so a missing image never breaks the layout. */
export function installPortraitFallback() {
  document.addEventListener(
    'error',
    (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement) || !img.classList.contains('portrait')) return;
      const span = document.createElement('span');
      span.className = 'portrait portrait-fallback';
      span.textContent = img.dataset.initials ?? '?';
      img.replaceWith(span);
    },
    true,
  );
}

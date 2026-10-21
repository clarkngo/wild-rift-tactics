import type { Section } from '../../sections';
import { championById } from '../../shared/champions';
import { esc, portrait } from '../../shared/dom';
import { hasMatchups, matchupUrl } from '../baron-matchups';
import { CARDS, CATEGORIES, cardById, type Category, type StrategyCard } from './cards';
import { H, W, card as pixelCard } from './pixel';

const ROUTE = 'strategy';
const PNG_SCALE = 8;

let activeFilter: Category | 'all' = 'all';
const svgCache = new Map<string, string>();

function svgFor(c: StrategyCard) {
  let svg = svgCache.get(c.id);
  if (!svg) {
    svg = pixelCard({ title: c.title, takeaway: c.takeaway, scene: c.scene(), accent: CATEGORIES[c.category].accent });
    svgCache.set(c.id, svg);
  }
  return svg;
}

const sentenceCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
const cardUrl = (c: StrategyCard) => `${location.origin}${location.pathname}#/${ROUTE}/${c.id}`;
const fileName = (c: StrategyCard, ext: string) => `wild-rift-tactics-${c.id}.${ext}`;

// ---- Export & share ----------------------------------------------------------

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function toPng(c: StrategyCard): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = Object.assign(document.createElement('canvas'), { width: W * PNG_SCALE, height: H * PNG_SCALE });
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG export failed'))), 'image/png');
    };
    img.onerror = () => reject(new Error('Could not render card'));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgFor(c))}`;
  });
}

function toast(message: string) {
  const el = Object.assign(document.createElement('div'), { className: 'toast', textContent: message });
  el.setAttribute('role', 'status');
  document.body.append(el);
  setTimeout(() => el.remove(), 2200);
}

async function share(c: StrategyCard) {
  const title = `${sentenceCase(c.title)} · Wild Rift Tactics`;
  const url = cardUrl(c);
  try {
    const png = new File([await toPng(c)], fileName(c, 'png'), { type: 'image/png' });
    if (navigator.canShare?.({ files: [png] })) {
      await navigator.share({ files: [png], title, text: `${c.takeaway.toLowerCase()} ${url}` });
      return;
    }
    if (navigator.share) {
      await navigator.share({ title, text: c.summary, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast('Link copied');
  } catch (err) {
    if ((err as DOMException)?.name !== 'AbortError') toast('Couldn’t share. Try Save PNG instead.');
  }
}

async function handleAction(action: string, c: StrategyCard) {
  if (action === 'svg') download(new Blob([svgFor(c)], { type: 'image/svg+xml' }), fileName(c, 'svg'));
  else if (action === 'png') download(await toPng(c), fileName(c, 'png'));
  else if (action === 'share') await share(c);
}

// ---- Rendering ---------------------------------------------------------------

const actions = (c: StrategyCard) => `
  <div class="scard-actions">
    <button type="button" data-action="share" data-card="${c.id}">Share</button>
    <button type="button" data-action="png" data-card="${c.id}">Save PNG</button>
    <button type="button" data-action="svg" data-card="${c.id}" title="Animated SVG">Save SVG</button>
  </div>`;

function examples(c: StrategyCard) {
  if (!c.examples) return '';
  const chips = c.examples.champions
    .map((id) => championById.get(id))
    .filter((ch) => ch !== undefined)
    .map((ch) => {
      const inner = `${portrait(ch, 28)}<span>${esc(ch.name)}</span>`;
      return hasMatchups(ch.id)
        ? `<a class="chip" href="${matchupUrl(ch.id)}" title="${esc(ch.name)} matchups">${inner}</a>`
        : `<span class="chip">${inner}</span>`;
    })
    .join('');
  return `<h3>${esc(c.examples.label)}</h3><div class="chips">${chips}</div>`;
}

function renderGrid() {
  const list = CARDS.filter((c) => activeFilter === 'all' || c.category === activeFilter);
  return list
    .map(
      (c) => `
      <article class="scard" style="--accent:${CATEGORIES[c.category].accent}">
        <a class="scard-art" href="#/${ROUTE}/${c.id}" aria-label="${esc(sentenceCase(c.title))}: open card">${svgFor(c)}</a>
        <div class="scard-body">
          <p class="scard-cat">${CATEGORIES[c.category].label}</p>
          <h2><a href="#/${ROUTE}/${c.id}">${esc(sentenceCase(c.title))}</a></h2>
          <p>${esc(c.summary)}</p>
          ${actions(c)}
        </div>
      </article>`,
    )
    .join('');
}

function renderIndex(app: HTMLElement) {
  const filters = (['all', ...Object.keys(CATEGORIES)] as (Category | 'all')[])
    .map((f) => {
      const label = f === 'all' ? 'All' : CATEGORIES[f].label;
      return `<button type="button" class="filter" data-filter="${f}" aria-pressed="${f === activeFilter}">${label}</button>`;
    })
    .join('');

  app.innerHTML = `
    <a class="back" href="#/">← Home</a>
    <section class="hero">
      <h1>Strategy cards</h1>
      <p>Pixel-sized lessons on laning, macro, items and class counters. Tap one to open it, or save and share it.</p>
    </section>
    <div class="filters" role="group" aria-label="Filter cards">${filters}</div>
    <div class="scard-grid" id="scard-grid">${renderGrid()}</div>`;

  app.querySelector('.filters')!.addEventListener('click', (e) => {
    const btn = (e.target as Element).closest<HTMLButtonElement>('button[data-filter]');
    if (!btn) return;
    activeFilter = btn.dataset.filter as Category | 'all';
    app.querySelectorAll('.filter').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    app.querySelector('#scard-grid')!.innerHTML = renderGrid();
    applyMotionPreference(app);
  });
}

function renderDetail(app: HTMLElement, c: StrategyCard) {
  const i = CARDS.indexOf(c);
  const prev = CARDS[(i - 1 + CARDS.length) % CARDS.length];
  const next = CARDS[(i + 1) % CARDS.length];
  app.innerHTML = `
    <a class="back" href="#/${ROUTE}">← All strategy cards</a>
    <article class="scard scard-detail" style="--accent:${CATEGORIES[c.category].accent}">
      <div class="scard-art">${svgFor(c)}</div>
      <div class="scard-body">
        <p class="scard-cat">${CATEGORIES[c.category].label}</p>
        <h1>${esc(sentenceCase(c.title))}</h1>
        <p class="lead">${esc(c.summary)}</p>
        ${actions(c)}
        <h3>How to do it</h3>
        <ol>${c.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
        ${examples(c)}
      </div>
    </article>
    <nav class="pager" aria-label="More cards">
      <a href="#/${ROUTE}/${prev.id}">← ${esc(sentenceCase(prev.title))}</a>
      <a href="#/${ROUTE}/${next.id}">${esc(sentenceCase(next.title))} →</a>
    </nav>`;
}

/** SMIL animations ignore CSS, so pause them explicitly for reduced-motion users. */
function applyMotionPreference(root: HTMLElement) {
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.querySelectorAll('svg').forEach((svg) => {
    svg.pauseAnimations();
    svg.setCurrentTime(0);
  });
}

let actionsBound = false;

export const strategyCards: Section = {
  route: ROUTE,
  title: 'Strategy Cards',
  navLabel: 'Strategy',
  description: `${CARDS.length} shareable pixel cards on laning micro, macro, itemization and class counters.`,
  render(app, [cardId]) {
    if (!actionsBound) {
      // One delegated listener for Share / Save buttons on any strategy view.
      app.addEventListener('click', (e) => {
        const btn = (e.target as Element).closest<HTMLButtonElement>('button[data-action]');
        const c = btn && cardById.get(btn.dataset.card ?? '');
        if (btn && c) void handleAction(btn.dataset.action!, c);
      });
      actionsBound = true;
    }
    const c = cardId ? cardById.get(cardId) : undefined;
    if (cardId && !c) {
      app.innerHTML = `<p class="empty">That card doesn't exist. <a href="#/${ROUTE}">See all strategy cards</a></p>`;
      return;
    }
    if (c) renderDetail(app, c);
    else renderIndex(app);
    applyMotionPreference(app);
  },
};

import type { Section } from '../../sections';
import { championById } from '../../shared/champions';
import { esc, portrait } from '../../shared/dom';
import { hasMatchups, matchupUrl } from '../baron-matchups';
import { CARDS, CATEGORIES, cardById, type Category, type StrategyCard } from './cards';
import { card as pixelCard } from './pixel';

const ROUTE = 'strategy';

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

// ---- Rendering ---------------------------------------------------------------

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
      <p>Pixel-sized lessons on laning, macro, items and class counters. Tap one to open it; every card has its own link.</p>
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

export const strategyCards: Section = {
  route: ROUTE,
  title: 'Strategy Cards',
  navLabel: 'Strategy',
  description: `${CARDS.length} pixel cards on laning micro, macro, itemization and class counters.`,
  render(app, [cardId]) {
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

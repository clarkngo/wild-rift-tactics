import './style.css';
import type { Champion, EnemyMatchups, Matchup, Rating } from './types';
import { BARON_CHAMPIONS, championById, portraitUrl } from './data/champions';

const files = import.meta.glob<EnemyMatchups>('./data/baron/*.json', {
  eager: true,
  import: 'default',
});
const baronData = new Map(Object.values(files).map((f) => [f.enemy, f]));

const app = document.getElementById('app')!;

const RATING_META: Record<Rating, { label: string; hint: string }> = {
  good: { label: 'Good picks', hint: 'You win lane or trades comfortably' },
  neutral: { label: 'Skill matchups', hint: 'Even, decided by cooldown tracking and waves' },
  bad: { label: 'Avoid', hint: 'Locked in already? Here’s how to survive' },
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function portrait(c: Champion, size = 56) {
  return `<img class="portrait" src="${portraitUrl(c)}" alt="" width="${size}" height="${size}"
    loading="lazy" data-initials="${esc(c.name.slice(0, 2))}" />`;
}

// Swap broken portraits for initials so a missing image never breaks the layout.
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

function renderPicker(query = '') {
  const q = query.trim().toLowerCase();
  const list = BARON_CHAMPIONS.filter((c) => c.name.toLowerCase().includes(q)).sort(
    (a, b) => Number(baronData.has(b.id)) - Number(baronData.has(a.id)) || a.name.localeCompare(b.name),
  );

  const grid = list
    .map((c) => {
      const ready = baronData.has(c.id);
      return ready
        ? `<a class="champ" href="#/baron/${c.id}">${portrait(c)}<span>${esc(c.name)}</span></a>`
        : `<div class="champ champ-soon" aria-disabled="true">${portrait(c)}<span>${esc(c.name)}</span><small>Soon</small></div>`;
    })
    .join('');

  return `<div class="grid">${grid || '<p class="empty">No champion matches that search.</p>'}</div>`;
}

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <h1>Who's your Baron lane opponent?</h1>
      <p>Tap the enemy's champion to see what beats it, and exactly how to trade.</p>
      <label class="search">
        <span class="visually-hidden">Search champions</span>
        <input id="search" type="search" placeholder="Search champion…" autocomplete="off" />
      </label>
    </section>
    <div id="picker">${renderPicker()}</div>`;

  const input = document.getElementById('search') as HTMLInputElement;
  const picker = document.getElementById('picker')!;
  input.addEventListener('input', () => (picker.innerHTML = renderPicker(input.value)));
}

function renderMatchup(m: Matchup) {
  const c = championById.get(m.champion);
  const name = c?.name ?? m.champion;
  return `
    <details class="matchup matchup-${m.rating}">
      <summary>
        ${c ? portrait(c, 44) : ''}
        <span class="matchup-name">${esc(name)}</span>
        <span class="tag tag-${m.confidence}" title="Confidence in this advice">${m.confidence}</span>
      </summary>
      <div class="matchup-body">
        <p class="why">${esc(m.why)}</p>
        <h4>Trading</h4>
        <ol>${m.trading.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
        <dl class="phases">
          <div><dt>Lv 1–3</dt><dd>${esc(m.early)}</dd></div>
          <div><dt>Lv 4–5 (ults)</dt><dd>${esc(m.spike)}</dd></div>
          <div><dt>Wave</dt><dd>${esc(m.wave)}</dd></div>
          <div><dt>Jungle</dt><dd>${esc(m.jungle)}</dd></div>
          <div><dt>Build</dt><dd>${esc(m.build)}</dd></div>
        </dl>
        <p class="remember"><strong>Remember:</strong> ${esc(m.remember)}</p>
      </div>
    </details>`;
}

function renderEnemy(id: string) {
  const enemy = championById.get(id);
  const data = baronData.get(id);
  if (!enemy || !data) {
    app.innerHTML = `<p class="empty">No matchup data for that champion yet. <a href="#/">Back to all champions</a></p>`;
    return;
  }

  const groups = (['good', 'neutral', 'bad'] as Rating[])
    .map((r) => {
      const ms = data.matchups.filter((m) => m.rating === r);
      if (!ms.length) return '';
      return `
        <section class="group group-${r}">
          <h2>${RATING_META[r].label} <small>${RATING_META[r].hint}</small></h2>
          ${ms.map(renderMatchup).join('')}
        </section>`;
    })
    .join('');

  app.innerHTML = `
    <a class="back" href="#/">← All champions</a>
    <section class="enemy">
      ${portrait(enemy, 72)}
      <div>
        <p class="eyebrow">Baron lane · vs</p>
        <h1>${esc(enemy.name)}</h1>
        <p>${esc(data.summary)}</p>
      </div>
    </section>
    ${
      data.reviewed
        ? ''
        : `<p class="notice">Draft content, not yet reviewed by a high-elo player. Patch: ${esc(data.patch)}.</p>`
    }
    <section class="threats">
      <h2>What ${esc(enemy.name)} wants to do</h2>
      <ul>${data.threats.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    </section>
    ${groups}`;
}

function route() {
  const [, section, id] = location.hash.replace(/^#\/?/, '#/').split('/');
  if (section === 'baron' && id) renderEnemy(id);
  else renderHome();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();

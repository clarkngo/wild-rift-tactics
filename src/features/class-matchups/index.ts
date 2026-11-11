import type { Section } from '../../sections';
import type { Rating } from '../baron-matchups/types';
import { hasMatchups, matchupUrl } from '../baron-matchups';
import { esc, portrait } from '../../shared/dom';
import data from './classes.json';

const ROUTE = 'class-matchups';

interface ClassInfo {
  id: string;
  name: string;
  identity: string;
  strengths: string[];
  weaknesses: string[];
  examples: { name: string; img: string; id?: string }[];
}
interface ClassMatchup {
  pick: string;
  enemy: string;
  rating: Rating;
  why: string;
  tip: string;
}

const CLASSES = data.classes as ClassInfo[];
const MATCHUPS = data.matchups as ClassMatchup[];
const byId = new Map(CLASSES.map((c) => [c.id, c]));
const ratingOf = (pick: string, enemy: string) => MATCHUPS.find((m) => m.pick === pick && m.enemy === enemy)!;

/** Each loop reads "beats the next one", like rock-paper-scissors. */
const LOOPS: [string, string, string][] = [
  ['tank', 'assassin', 'marksman'],
  ['bruiser', 'assassin', 'mage'],
];

const RATING_META: Record<Rating, { label: string; hint: string; mark: string }> = {
  good: { label: 'Strong into', hint: 'This class has the tools to beat it', mark: '✓' },
  neutral: { label: 'Even against', hint: 'Decided by kits, items and positioning', mark: '–' },
  bad: { label: 'Weak into', hint: 'Picking this? Here’s how to cope', mark: '✗' },
};

function loopSvg([a, b, c]: [string, string, string]) {
  const pts = [
    { x: 160, y: 40 },
    { x: 272, y: 196 },
    { x: 48, y: 196 },
  ];
  const ids = [a, b, c];
  const R = 38;
  const arrows = pts
    .map((p, i) => {
      const q = pts[(i + 1) % 3];
      const dx = q.x - p.x;
      const dy = q.y - p.y;
      const len = Math.hypot(dx, dy);
      const [ux, uy] = [dx / len, dy / len];
      const x1 = p.x + ux * (R + 4);
      const y1 = p.y + uy * (R + 4);
      const x2 = q.x - ux * (R + 10);
      const y2 = q.y - uy * (R + 10);
      const mx = (p.x + q.x) / 2 - uy * 16;
      const my = (p.y + q.y) / 2 + ux * 16;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="loop-arrow" marker-end="url(#beats)" />
        <text x="${mx}" y="${my}" class="loop-label" text-anchor="middle" dominant-baseline="middle">beats</text>`;
    })
    .join('');
  const nodes = pts
    .map((p, i) => {
      const cls = byId.get(ids[i])!;
      return `<a href="#/${ROUTE}/${cls.id}" aria-label="${esc(cls.name)}">
        <circle cx="${p.x}" cy="${p.y}" r="${R}" class="loop-node node-${cls.id}" />
        <text x="${p.x}" y="${p.y}" class="loop-name" text-anchor="middle" dominant-baseline="central">${esc(cls.name)}</text>
      </a>`;
    })
    .join('');
  const label = `${byId.get(a)!.name} beats ${byId.get(b)!.name}, ${byId.get(b)!.name} beats ${byId.get(c)!.name}, ${byId.get(c)!.name} beats ${byId.get(a)!.name}`;
  return `<svg viewBox="0 0 320 236" class="loop" role="img" aria-label="${esc(label)}">
    <defs><marker id="beats" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 10 5 0 10z" class="loop-head" /></marker></defs>
    ${arrows}${nodes}</svg>`;
}

function classPicker(current?: string) {
  return `<nav class="filters" aria-label="Enemy class">${CLASSES.map(
    (c) =>
      `<a class="filter class-chip node-${c.id}" href="#/${ROUTE}/${c.id}"${c.id === current ? ' aria-current="page"' : ''}>${esc(c.name)}</a>`,
  ).join('')}</nav>`;
}

function matrix() {
  const head = CLASSES.map((c) => `<th scope="col"><a href="#/${ROUTE}/${c.id}">${esc(c.name)}</a></th>`).join('');
  const rows = CLASSES.map((p) => {
    const cells = CLASSES.map((e) => {
      const m = ratingOf(p.id, e.id);
      return `<td class="cell-${m.rating}" title="${esc(`${p.name} vs ${e.name}: ${m.rating}`)}">
        <span aria-hidden="true">${RATING_META[m.rating].mark}</span><span class="visually-hidden">${m.rating}</span></td>`;
    }).join('');
    return `<tr><th scope="row">${esc(p.name)}</th>${cells}</tr>`;
  }).join('');
  return `<div class="matrix-wrap"><table class="matrix">
    <caption>Row picks into column enemy: <span class="cell-good">✓ strong</span> <span class="cell-neutral">– even</span> <span class="cell-bad">✗ weak</span></caption>
    <colgroup><col class="row-head" />${CLASSES.map(() => '<col />').join('')}</colgroup>
    <thead><tr><td></td>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderIndex(app: HTMLElement) {
  app.innerHTML = `
    <a class="back" href="#/">← Home</a>
    <section class="hero">
      <h1>Class matchups</h1>
      <p>Rock-paper-scissors for champion classes. Tap the enemy's class to see what beats it.</p>
    </section>
    ${classPicker()}
    <div class="loops">${LOOPS.map(loopSvg).join('')}</div>
    <p class="loop-note">Also: bruisers grind down tanks, and enchanters stop assassins by shielding and peeling their target.</p>
    <h2 class="section-title">Every class against every class</h2>
    ${matrix()}
    <p class="loop-note">Class is a starting point. Specific kits override it, so check <a href="#/baron-matchups">Baron matchups</a> for champion-level detail.</p>`;
}

function exampleChip(e: ClassInfo['examples'][number]) {
  const img = portrait({ id: e.id ?? e.img.toLowerCase(), name: e.name, img: e.img }, 28);
  return e.id && hasMatchups(e.id)
    ? `<a class="chip" href="${matchupUrl(e.id)}">${img}${esc(e.name)}</a>`
    : `<span class="chip">${img}${esc(e.name)}</span>`;
}

function renderClass(app: HTMLElement, id: string) {
  const enemy = byId.get(id);
  if (!enemy) {
    app.innerHTML = `<p class="empty">Unknown class. <a href="#/${ROUTE}">Back to all classes</a></p>`;
    return;
  }

  const groups = (['good', 'neutral', 'bad'] as Rating[])
    .map((r) => {
      const ms = MATCHUPS.filter((m) => m.enemy === id && m.rating === r);
      if (!ms.length) return '';
      return `
        <section class="group group-${r}">
          <h2>${RATING_META[r].label} ${esc(enemy.name)} <small>${RATING_META[r].hint}</small></h2>
          ${ms
            .map((m) => {
              const pick = byId.get(m.pick)!;
              return `
              <details class="matchup matchup-${m.rating}">
                <summary><span class="class-dot node-${pick.id}" aria-hidden="true"></span>
                  <span class="matchup-name">${esc(pick.name)}${m.pick === id ? ' (mirror)' : ''}</span></summary>
                <div class="matchup-body">
                  <p class="why">${esc(m.why)}</p>
                  <p class="remember"><strong>How to play it:</strong> ${esc(m.tip)}</p>
                  <p class="class-link"><a href="#/${ROUTE}/${pick.id}">How to beat ${esc(pick.name)} →</a></p>
                </div>
              </details>`;
            })
            .join('')}
        </section>`;
    })
    .join('');

  app.innerHTML = `
    <a class="back" href="#/${ROUTE}">← All classes</a>
    ${classPicker(id)}
    <section class="class-head">
      <p class="eyebrow">Enemy class</p>
      <h1>${esc(enemy.name)}</h1>
      <p>${esc(enemy.identity)}</p>
      <div class="sw">
        <div><h3>Strengths</h3><ul>${enemy.strengths.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
        <div><h3>Weaknesses</h3><ul>${enemy.weaknesses.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
      </div>
      <div class="chips">${enemy.examples.map(exampleChip).join('')}</div>
    </section>
    ${groups}`;
}

export const classMatchups: Section = {
  route: ROUTE,
  title: 'Class Matchups',
  navLabel: 'Classes',
  description: 'Rock-paper-scissors by class: which of tank, bruiser, assassin, mage, marksman and enchanter beats which, and how to play it.',
  render(app, [classId]) {
    if (classId) renderClass(app, classId);
    else renderIndex(app);
  },
};

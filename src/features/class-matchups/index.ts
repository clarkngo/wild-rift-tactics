import type { Section } from '../../sections';
import type { Rating } from '../baron-matchups/types';
import { hasMatchups, matchupUrl } from '../baron-matchups';
import { esc, portrait } from '../../shared/dom';
import data from './classes.json';
import lanesData from './lanes.json';

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

interface LaneType {
  id: string;
  name: string;
  /** Label for the matrix, where full names don't fit on a phone. */
  short: string;
  identity: string;
  winCondition: string;
  examples: ClassInfo['examples'];
}
interface LaneMatchup {
  a: string;
  b: string;
  /** From `a`'s point of view. */
  rating: Rating;
  confidence: 'high' | 'medium' | 'low';
  why: string;
  tip: string;
}
interface Lane {
  id: string;
  name: string;
  intro: string;
  types: LaneType[];
  matchups: LaneMatchup[];
  exceptions: { name: string; img: string; id?: string; text: string }[];
}

const LANES = lanesData.lanes as Lane[];
/** Which lane breakdown to suggest from each class page. */
const LANE_FOR_CLASS: Record<string, string> = {
  tank: 'baron', bruiser: 'baron', assassin: 'mid', mage: 'mid', marksman: 'dragon', enchanter: 'support',
};
const FLIP: Record<Rating, Rating> = { good: 'bad', neutral: 'neutral', bad: 'good' };

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

function lanePicker(current?: string) {
  return `<nav class="filters" aria-label="Lane">${LANES.map(
    (l) => `<a class="filter" href="#/${ROUTE}/lane/${l.id}"${l.id === current ? ' aria-current="page"' : ''}>${esc(l.name)}</a>`,
  ).join('')}</nav>`;
}

/** Every matchup involving `typeId`, seen from that type's side. */
function laneMatchupsFor(lane: Lane, typeId: string) {
  return lane.matchups
    .filter((m) => m.a === typeId || m.b === typeId)
    .map((m) => (m.a === typeId ? { ...m, other: m.b, rating: m.rating } : { ...m, other: m.a, rating: FLIP[m.rating] }));
}

function laneMatrix(lane: Lane) {
  const head = lane.types.map((t) => `<th scope="col" title="${esc(t.name)}">${esc(t.short)}</th>`).join('');
  const rows = lane.types
    .map((p) => {
      const cells = lane.types
        .map((e) => {
          if (p.id === e.id) return `<td class="cell-self" aria-label="Same type">·</td>`;
          const m = laneMatchupsFor(lane, p.id).find((x) => x.other === e.id)!;
          return `<td class="cell-${m.rating}" title="${esc(`${p.name} vs ${e.name}: ${m.rating}`)}"><span aria-hidden="true">${RATING_META[m.rating].mark}</span><span class="visually-hidden">${m.rating}</span></td>`;
        })
        .join('');
      return `<tr><th scope="row" title="${esc(p.name)}">${esc(p.short)}</th>${cells}</tr>`;
    })
    .join('');
  return `<div class="matrix-wrap"><table class="matrix lane-matrix">
    <caption>Row type into column type: <span class="cell-good">✓ strong</span> <span class="cell-neutral">– even</span> <span class="cell-bad">✗ weak</span></caption>
    <colgroup><col class="row-head" />${lane.types.map(() => '<col />').join('')}</colgroup>
    <thead><tr><td></td>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderLane(app: HTMLElement, id: string) {
  const lane = LANES.find((l) => l.id === id);
  if (!lane) {
    app.innerHTML = `<p class="empty">Unknown lane. <a href="#/${ROUTE}">Back to class matchups</a></p>`;
    return;
  }
  const typeName = (tid: string) => lane.types.find((t) => t.id === tid)!.name;
  const cards = lane.types
    .map((t) => {
      const ms = laneMatchupsFor(lane, t.id);
      const group = (r: Rating) => {
        const list = ms.filter((m) => m.rating === r);
        if (!list.length) return '';
        return `<h4>${RATING_META[r].label}</h4><ul class="lane-vs">${list
          .map(
            (m) => `<li><strong>${esc(typeName(m.other))}</strong>${m.confidence === 'low' ? ' <span class="tag tag-low">low</span>' : ''}: ${esc(m.why)}${
              r !== 'good' ? `<span class="lane-tip">${esc(m.tip)}</span>` : ''
            }</li>`,
          )
          .join('')}</ul>`;
      };
      return `
        <details class="matchup lane-type" id="${lane.id}-${t.id}">
          <summary><span class="lane-type-name"><span class="matchup-name">${esc(t.name)}</span><small>${esc(t.examples.map((e) => e.name).join(', '))}</small></span></summary>
          <div class="matchup-body">
            <p class="why">${esc(t.identity)}</p>
            <p class="remember"><strong>Win condition:</strong> ${esc(t.winCondition)}</p>
            <div class="chips lane-chips">${t.examples.map(exampleChip).join('')}</div>
            ${group('good')}${group('neutral')}${group('bad')}
          </div>
        </details>`;
    })
    .join('');

  app.innerHTML = `
    <a class="back" href="#/${ROUTE}">← Class matchups</a>
    ${lanePicker(lane.id)}
    <section class="hero">
      <p class="eyebrow">Types within a lane</p>
      <h1>${esc(lane.name)}</h1>
      <p>${esc(lane.intro)}</p>
    </section>
    ${laneMatrix(lane)}
    <h2 class="section-title">Each type</h2>
    ${cards}
    <section class="threats">
      <h2>Exceptions to the rules</h2>
      <ul class="lane-exceptions">${lane.exceptions
        .map((x) => `<li>${exampleChip(x)}<span>${esc(x.text)}</span></li>`)
        .join('')}</ul>
    </section>
    <p class="loop-note">Types are a starting point; the exact champions and their items decide the lane.${lanesData.reviewed ? '' : ' Draft: not yet reviewed by a high-elo player.'}</p>`;
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
    <h2 class="section-title">Types within each lane</h2>
    <p class="loop-note">Not every marksman, tank or mage plays the same. Pick a lane to see its types, who beats whom, and the exceptions.</p>
    ${lanePicker()}
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
      ${LANE_FOR_CLASS[enemy.id] ? `<p class="class-link"><a href="#/${ROUTE}/lane/${LANE_FOR_CLASS[enemy.id]}">${esc(LANES.find((l) => l.id === LANE_FOR_CLASS[enemy.id])!.name)}: types, who beats whom, and exceptions →</a></p>` : ''}
    </section>
    ${groups}`;
}

export const classMatchups: Section = {
  route: ROUTE,
  title: 'Class Matchups',
  navLabel: 'Classes',
  description: 'Rock-paper-scissors by class: which of tank, bruiser, assassin, mage, marksman and enchanter beats which, and how to play it.',
  render(app, [classId, laneId]) {
    if (classId === 'lane') renderLane(app, laneId ?? '');
    else if (classId) renderClass(app, classId);
    else renderIndex(app);
  },
};

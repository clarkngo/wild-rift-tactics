import type { Section } from '../../sections';
import { esc } from '../../shared/dom';
import { CHECKLIST, OBJECTIVES, TRADES, type Objective } from './data';

const ROUTE = 'objectives';

const icon = (o: Objective, size = 44) =>
  `<svg class="obj-icon" viewBox="0 0 11 9" width="${size}" height="${Math.round((size * 9) / 11)}" shape-rendering="crispEdges" aria-hidden="true">${o.icon}</svg>`;

function renderObjective(o: Objective, rank: number) {
  return `
    <details class="matchup obj" id="${o.id}">
      <summary>
        <span class="obj-rank" aria-label="Priority ${rank}">${rank}</span>
        ${icon(o)}
        <span class="matchup-name">${esc(o.name)}</span>
      </summary>
      <div class="matchup-body">
        <p class="why">${esc(o.gives)}</p>
        <dl class="phases">
          <div><dt>Where</dt><dd>${esc(o.where)}</dd></div>
          <div><dt>Take it when</dt><dd>${esc(o.takeWhen)}</dd></div>
          <div><dt>As the Baron laner</dt><dd>${esc(o.baronLaner)}</dd></div>
          <div><dt>Can't contest?</dt><dd>${esc(o.ifNot)}</dd></div>
        </dl>
      </div>
    </details>`;
}

function render(app: HTMLElement) {
  app.innerHTML = `
    <a class="back" href="#/">← Home</a>
    <section class="hero">
      <h1>Objective cheat sheet</h1>
      <p>What each objective gives, when to take it, and what to do from Baron lane. Ranked by how much it usually decides the game.</p>
    </section>
    ${OBJECTIVES.map((o, i) => renderObjective(o, i + 1)).join('')}
    <section class="threats obj-list">
      <h2>Before any objective</h2>
      <ol>${CHECKLIST.map((c) => `<li>${esc(c)}</li>`).join('')}</ol>
    </section>
    <section class="threats obj-list">
      <h2>Can't contest? Trade it</h2>
      <table class="obj-trades">
        <thead><tr><th scope="col">They take</th><th scope="col">You take</th></tr></thead>
        <tbody>${TRADES.map((t) => `<tr><td>${esc(t.them)}</td><td>${esc(t.you)}</td></tr>`).join('')}</tbody>
      </table>
    </section>
    <p class="loop-note">Spawn times, health and exact buff values change between Wild Rift patches, so this page leaves them out. Check the in-game timers.</p>`;
}

export const objectives: Section = {
  route: ROUTE,
  title: 'Objective Cheat Sheet',
  navLabel: 'Objectives',
  description: 'Elder, Baron, Dragon Soul, Herald, drakes, plates and scuttlers: what each gives, when to take it, and your job from Baron lane.',
  render(app, [id]) {
    render(app);
    if (id) {
      const el = app.querySelector<HTMLDetailsElement>(`#${CSS.escape(id)}`);
      if (el) {
        el.open = true;
        // The router scrolls to the top after render, so scroll on the next frame.
        requestAnimationFrame(() => el.scrollIntoView());
      }
    }
  },
};

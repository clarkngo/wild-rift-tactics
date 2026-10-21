import { SECTIONS } from '../sections';
import { esc } from '../shared/dom';

export function renderHome(app: HTMLElement) {
  app.innerHTML = `
    <section class="hero">
      <h1>Wild Rift Tactics</h1>
      <p>Quick, practical guides you can check between games.</p>
    </section>
    <div class="cards">
      ${SECTIONS.map(
        (s) => `
        <a class="card" href="#/${s.route}">
          <h2>${esc(s.title)}</h2>
          <p>${esc(s.description)}</p>
        </a>`,
      ).join('')}
    </div>`;
}

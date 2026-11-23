import type { Section } from '../../sections';
import type { Rating } from '../baron-matchups/types';
import { esc, portrait } from '../../shared/dom';
import type { Guide } from './types';
import { smolder } from './smolder';

const ROUTE = 'guides';
const GUIDES: Guide[] = [smolder];

const RATING_LABEL: Record<Rating, string> = { good: 'Easy lane', neutral: 'Even lane', bad: 'Hard lane' };

const champ = (g: Guide, size: number) => portrait({ id: g.id, name: g.name, img: g.img }, size);
const list = (items: string[], tag: 'ul' | 'ol' = 'ul') => `<${tag}>${items.map((s) => `<li>${esc(s)}</li>`).join('')}</${tag}>`;
const conf = (c: string) => `<span class="tag tag-${c}" title="Confidence in this advice">${c}</span>`;

function renderIndex(app: HTMLElement) {
  app.innerHTML = `
    <a class="back" href="#/">← Home</a>
    <section class="hero">
      <h1>Champion guides</h1>
      <p>How to play one champion through every kind of lane and team: what to do, and in what order.</p>
    </section>
    <div class="chips">${GUIDES.map((g) => `<a class="chip" href="#/${ROUTE}/${g.id}">${champ(g, 28)}${esc(g.name)} <small>${esc(g.role)}</small></a>`).join('')}</div>`;
}

function tierLadder(g: Guide) {
  const max = g.tiers[g.tiers.length - 1].stacks;
  return `
    <ol class="cg-tiers">${g.tiers
      .map(
        (t) => `
      <li style="--fill:${Math.round((t.stacks / max) * 100)}%">
        <span class="cg-stacks">${t.stacks}</span>
        <span><strong>${esc(t.name)}</strong><span class="cg-bar" aria-hidden="true"></span>${esc(t.text)}</span>
      </li>`,
      )
      .join('')}</ol>`;
}

function renderGuide(app: HTMLElement, g: Guide) {
  const jumps = [
    ['stacks', 'Stacking'],
    ['plans', 'Stack plans'],
    ['lanes', 'Lane matchups'],
    ['teams', 'Team matchups'],
    ['build', 'Build'],
  ];
  app.innerHTML = `
    <a class="back" href="#/${ROUTE}">← All guides</a>
    <section class="enemy">
      ${champ(g, 72)}
      <div>
        <p class="eyebrow">${esc(g.role)} · patch ${esc(g.patch)}</p>
        <h1>${esc(g.name)}</h1>
        <p>${esc(g.summary)}</p>
      </div>
    </section>
    <nav class="filters" aria-label="On this page">${jumps.map(([id, l]) => `<a class="filter" href="#/${ROUTE}/${g.id}/${id}">${esc(l)}</a>`).join('')}</nav>

    <section class="threats">
      <h2>Kit at a glance</h2>
      <dl class="cg-kit">${g.kit.map((k) => `<div><dt><span class="cg-key">${esc(k.key)}</span> ${esc(k.name)}</dt><dd>${esc(k.text)}</dd></div>`).join('')}</dl>
    </section>

    <h2 class="section-title" id="stacks">How stacking works</h2>
    ${tierLadder(g)}
    <section class="threats">${list(g.stackRules)}</section>

    <h2 class="section-title" id="plans">Stack plans</h2>
    ${g.plans
      .map(
        (p) => `
      <details class="matchup cg-plan" id="plan-${p.id}">
        <summary><span class="matchup-name">${esc(p.name)}</span>${conf(p.confidence)}</summary>
        <div class="matchup-body">
          <p class="why">${esc(p.when)}</p>
          ${list(p.steps, 'ol')}
        </div>
      </details>`,
      )
      .join('')}

    <h2 class="section-title" id="lanes">Lane matchups</h2>
    <p class="loop-note">Grouped by the kind of bot lane you face. Easy, even or hard is from ${esc(g.name)}’s point of view.</p>
    ${g.lanes
      .map(
        (l) => `
      <details class="matchup matchup-${l.rating}" id="lane-${l.id}">
        <summary>
          <span class="cg-lane"><span class="matchup-name">${esc(l.name)}</span><small>${esc(l.examples)}</small>
            <span class="cg-meta"><span class="cg-rating">${RATING_LABEL[l.rating]}</span>${conf(l.confidence)}</span></span>
        </summary>
        <div class="matchup-body">
          <p class="remember"><strong>Stack plan:</strong> ${esc(l.plan)}</p>
          <h4>How to play it</h4>
          ${list(l.tips, 'ol')}
        </div>
      </details>`,
      )
      .join('')}

    <h2 class="section-title" id="teams">Team matchups</h2>
    ${g.teams
      .map(
        (t) => `
      <details class="matchup cg-plan" id="team-${t.id}">
        <summary><span class="matchup-name">${esc(t.name)}</span></summary>
        <div class="matchup-body">${list(t.tips, 'ol')}</div>
      </details>`,
      )
      .join('')}

    <section class="threats" id="build">
      <h2>Build</h2>
      ${list(g.builds)}
    </section>
    <section class="threats">
      <h2>Remember</h2>
      ${list(g.remember)}
    </section>
    <p class="loop-note">${g.reviewed ? '' : 'Draft: not yet checked by a high-elo player. '}Numbers change between patches; check the in-game ability text. Sources:
      ${g.sources.map((s) => `<a href="${esc(s.url)}" rel="noopener">${esc(s.label)}</a>`).join(' · ')}.</p>`;
}

export const championGuides: Section = {
  route: ROUTE,
  title: 'Champion Guides',
  navLabel: 'Guides',
  description: 'Smolder and more: how to stack, which plan to use in each lane matchup, and how to play into different team comps.',
  render(app, [id, part]) {
    const g = GUIDES.find((x) => x.id === id);
    if (!id) return renderIndex(app);
    if (!g) {
      app.innerHTML = `<p class="empty">No guide for that champion yet. <a href="#/${ROUTE}">All guides</a></p>`;
      return;
    }
    renderGuide(app, g);
    if (part) {
      const el = app.querySelector<HTMLElement>(`#${CSS.escape(part)}`);
      if (el) requestAnimationFrame(() => el.scrollIntoView());
    }
  },
};

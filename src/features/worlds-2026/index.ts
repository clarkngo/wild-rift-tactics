import type { Section } from '../../sections';
import { esc, portrait } from '../../shared/dom';
import {
  AFTER_FINAL, BRACKET, DUELS, FINAL, GAMES, HEAD_TO_HEAD, META, PREDICTION, RESULT, ROLES, SOURCES, STORYLINES, TEAMS, VERDICT, WILD_RIFT_TAKEAWAYS,
  type Player, type Team,
} from './data';

const ROUTE = 'worlds-2026';

const champ = (name: string, img: string, size = 28) => portrait({ id: img.toLowerCase(), name, img }, size);
const team = (id: Team['id']) => TEAMS.find((t) => t.id === id)!;

const JUMPS = [
  ['final', 'The final'],
  ...(RESULT ? ([['games', 'Game by game']] as const) : []),
  ['prediction', 'Prediction'],
  ['lanes', 'Lane duels'],
  ['players', 'Players'],
  ['road', 'Road to the final'],
  ['meta', 'Meta'],
  ['wild-rift', 'For Wild Rift'],
] as const;

function finalCard() {
  const [gen, blg] = TEAMS;
  const status = RESULT
    ? `<p class="wf-status wf-done">Final: <strong>${esc(team(RESULT.winner).name)} win ${esc(RESULT.score)}</strong>${RESULT.mvp ? `. Finals MVP: ${esc(RESULT.mvp)}` : ''}</p>`
    : `<p class="wf-status">Preview, written before the final. Check <a href="https://lolesports.com" rel="noopener">LoL Esports</a> for the live result.</p>`;
  const side = (t: Team) => `
    <div class="wf-team wf-${t.id.toLowerCase()}${RESULT?.winner === t.id ? ' wf-winner' : ''}">
      <span class="wf-tag">${esc(t.id)}</span>
      <strong>${esc(t.name)}</strong>
      <small>${esc(t.region)}</small>
    </div>`;
  return `
    <section class="wf-final" id="final" aria-label="The final">
      <div class="wf-vs">${side(gen)}<span class="wf-v" aria-hidden="true">vs</span>${side(blg)}</div>
      ${status}
      <dl class="wf-facts">
        <div><dt>When</dt><dd>${esc(FINAL.date)}, ${esc(FINAL.time)}</dd></div>
        <div><dt>Where</dt><dd>${esc(FINAL.venue)}</dd></div>
        <div><dt>Format</dt><dd>${esc(FINAL.format)}</dd></div>
        <div><dt>Patch</dt><dd>${esc(FINAL.patch)}</dd></div>
        <div><dt>Prize</dt><dd>${esc(FINAL.prize)}</dd></div>
      </dl>
    </section>`;
}

function games() {
  if (!RESULT) return '';
  const [gen, blg] = TEAMS;
  const ROLE_ABBR = ['Top', 'Jg', 'Mid', 'Bot', 'Sup'];
  return `
    <h2 class="section-title" id="games">Game by game</h2>
    <ol class="wf-games">${GAMES.map((g, i) => `
      <li class="wf-game">
        <div class="wf-duel-head">
          <span class="wf-role">Game ${i + 1} · ${esc(g.length)}</span>
          <span class="wf-edge-tag wf-edge-${g.winner.toLowerCase()}">${esc(g.winner)} win ${g.winner === 'GEN' ? g.kills[0] : g.kills[1]}–${g.winner === 'GEN' ? g.kills[1] : g.kills[0]} in kills</span>
        </div>
        <table class="wf-comp">
          <thead><tr><th scope="col"><span class="visually-hidden">Role</span></th><th scope="col" class="wf-gen-text">${esc(gen.id)}</th><th scope="col" class="wf-blg-text">${esc(blg.id)}</th></tr></thead>
          <tbody>${ROLE_ABBR.map((r, j) => `<tr><th scope="row">${r}</th><td>${esc(g.gen[j])}</td><td>${esc(g.blg[j])}</td></tr>`).join('')}</tbody>
        </table>
        <p>${esc(g.note)}</p>
      </li>`).join('')}
    </ol>
    <section class="threats">
      <h2>What the result means</h2>
      <ul>${AFTER_FINAL.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
    </section>`;
}

function prediction() {
  const head = RESULT
    ? `Our prediction was ${esc(PREDICTION.pick)} <small class="wf-conf">Wrong: ${esc(team(RESULT.winner).name)} won ${esc(RESULT.score)}</small>`
    : `Our prediction: ${esc(PREDICTION.pick)} <small class="wf-conf">${esc(PREDICTION.confidence)}</small>`;
  return `
    <section class="threats" id="prediction">
      <h2>${head}</h2>
      ${RESULT ? `<p class="wf-verdict">${esc(VERDICT)}</p><h3 class="wf-sub">What we said before the final</h3>` : ''}
      <ul>${PREDICTION.why.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
      <p class="loop-note">${esc(PREDICTION.experts)}</p>
      <div class="wf-keys">
        ${TEAMS.map((t) => `<div><h3>How ${esc(t.name)} win</h3><ol>${t.keys.map((k) => `<li>${esc(k)}</li>`).join('')}</ol></div>`).join('')}
      </div>
    </section>`;
}

function lanes() {
  const [gen, blg] = TEAMS;
  const rows = ROLES.map((role) => {
    const g = gen.players.find((p) => p.role === role)!;
    const b = blg.players.find((p) => p.role === role)!;
    const d = DUELS[role];
    const edge = d.edge === 'even' ? 'Even' : `Edge ${d.edge}`;
    const cell = (p: Player, t: Team) => `
      <div class="wf-duel-p${d.edge === t.id ? ' wf-edge' : ''}">
        ${champ(p.pool[0][0], p.pool[0][1], 36)}
        <span><strong>${esc(p.name)}</strong><small>${p.kda.toFixed(1)} KDA · ${esc(p.record)}</small></span>
      </div>`;
    return `
      <li class="wf-duel">
        <div class="wf-duel-head"><span class="wf-role">${esc(role)}</span><span class="wf-edge-tag wf-edge-${d.edge.toLowerCase()}">${edge}</span></div>
        <div class="wf-duel-row">${cell(g, gen)}<span class="wf-v" aria-hidden="true">vs</span>${cell(b, blg)}</div>
        <p>${esc(d.why)}</p>
      </li>`;
  }).join('');
  return `
    <h2 class="section-title" id="lanes">Lane by lane</h2>
    <p class="loop-note">Icons show each player’s most played champion at this Worlds. The edge is our read of tournament stats.</p>
    <ul class="wf-duels">${rows}</ul>`;
}

function playerCard(p: Player, t: Team) {
  return `
    <details class="matchup wf-player wf-${t.id.toLowerCase()}">
      <summary>
        ${champ(p.pool[0][0], p.pool[0][1], 44)}
        <span class="wf-pname"><span class="matchup-name">${esc(p.name)}</span><small>${esc(p.role)} · ${p.kda.toFixed(1)} KDA</small></span>
      </summary>
      <div class="matchup-body">
        <p class="wf-real">${esc(p.realName)}</p>
        <p class="why">${esc(p.note)}</p>
        <dl class="wf-stats">
          <div><dt>Games</dt><dd>${p.games} (${esc(p.record)})</dd></div>
          <div><dt>KDA</dt><dd>${p.kda.toFixed(1)}</dd></div>
          <div><dt>K / D / A per game</dt><dd>${esc(p.perGame)}</dd></div>
          <div><dt>Kill participation</dt><dd>${esc(p.kp)}</dd></div>
          <div><dt>${p.role === 'Support' ? 'Vision' : 'Damage'}</dt><dd>${esc(p.stat)}</dd></div>
        </dl>
        <h4>Champions at Worlds 2026</h4>
        <div class="chips">${p.pool.map(([n, img, g]) => `<span class="chip">${champ(n, img)}${esc(n)} <small>×${g}</small></span>`).join('')}</div>
      </div>
    </details>`;
}

function players() {
  return `
    <h2 class="section-title" id="players">Player profiles</h2>
    <div class="wf-rosters">
      ${TEAMS.map(
        (t) => `
        <section class="wf-roster">
          <h3><span class="wf-tag wf-${t.id.toLowerCase()}">${esc(t.id)}</span> ${esc(t.name)} <small>Coach ${esc(t.coach)}</small></h3>
          <p class="loop-note">${esc(t.identity)}</p>
          ${t.players.map((p) => playerCard(p, t)).join('')}
        </section>`,
      ).join('')}
    </div>`;
}

function road() {
  const score = (m: readonly string[]) => {
    const aWin = Number(m[1]) > Number(m[2]);
    return `<li><span${aWin ? ' class="wf-w"' : ''}>${esc(m[0])}</span> <b>${m[1]}–${m[2]}</b> <span${aWin ? '' : ' class="wf-w"'}>${esc(m[3])}</span></li>`;
  };
  return `
    <h2 class="section-title" id="road">Road to the final</h2>
    <div class="wf-keys">
      ${TEAMS.map((t) => `<div class="threats"><h3>${esc(t.name)} <small>${esc(t.record)}</small></h3><ol>${t.path.map((p) => `<li>${esc(p)}</li>`).join('')}</ol></div>`).join('')}
    </div>
    ${BRACKET.map((r) => `<h3 class="wf-sub">${esc(r.round)} <small>${esc(r.date)}</small></h3><ul class="wf-bracket">${r.matches.map(score).join('')}</ul>`).join('')}
    <h3 class="wf-sub">Earlier best-of-fives between them</h3>
    <ul class="wf-bracket">${HEAD_TO_HEAD.map((h) => `<li>${esc(h.event)}: <b class="wf-${h.winner.toLowerCase()}-text">${esc(h.winner)} ${esc(h.score)}</b></li>`).join('')}</ul>
    <section class="threats">
      <h2>Storylines</h2>
      <ul>${STORYLINES.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
    </section>`;
}

function meta() {
  return `
    <h2 class="section-title" id="meta">The meta: most contested champions</h2>
    <p class="loop-note">Picked or banned across 94 games on patch ${esc(FINAL.patch)}, before the final.</p>
    <div class="matrix-wrap"><table class="obj-trades wf-meta">
      <thead><tr><th scope="col">Champion</th><th scope="col">Picks</th><th scope="col">Bans</th><th scope="col">Win</th></tr></thead>
      <tbody>${META.map(
        ([n, img, role, p, b, w]) => `<tr>
          <td><span class="wf-champ">${champ(n, img)}<span>${esc(n)}<small>${esc(role)}</small></span></span></td>
          <td>${p}</td><td>${b}</td><td>${w}%</td></tr>`,
      ).join('')}</tbody>
    </table></div>`;
}

function wildRift() {
  return `
    <section class="threats" id="wild-rift">
      <h2>What to take into your Wild Rift games</h2>
      <ul>${WILD_RIFT_TAKEAWAYS.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <p class="loop-note">Worlds is played on PC League of Legends. Champion strength and items differ in Wild Rift, so take the ideas, not the exact picks.</p>
    </section>`;
}

function render(app: HTMLElement) {
  app.innerHTML = `
    <a class="back" href="#/">← Home</a>
    <section class="hero">
      <p class="eyebrow">League of Legends esports</p>
      <h1>Worlds 2026 final</h1>
      <p>${RESULT
        ? `Bilibili Gaming beat Gen.G ${esc(RESULT.score)} to win the World Championship. Every game of the final, the players, their champions, and how our prediction held up.`
        : 'Gen.G against Bilibili Gaming: the players, their champions, the lane duels, and who we think wins.'}</p>
    </section>
    <nav class="filters" aria-label="On this page">${JUMPS.map(([id, label]) => `<a class="filter" href="#/${ROUTE}/${id}">${esc(label)}</a>`).join('')}</nav>
    ${finalCard()}
    ${games()}
    ${prediction()}
    ${lanes()}
    ${players()}
    ${road()}
    ${meta()}
    ${wildRift()}
    <p class="loop-note wf-sources">Player and champion stats cover the Swiss stage to the semifinals, before the final. Sources:
      ${SOURCES.map((s) => `<a href="${esc(s.url)}" rel="noopener">${esc(s.label)}</a>`).join(' · ')}.</p>`;
}

export const worlds2026: Section = {
  route: ROUTE,
  title: 'Worlds 2026 Final',
  navLabel: 'Worlds',
  description: 'Bilibili Gaming beat Gen.G 3–1: every game of the League of Legends World Championship final, player profiles, champion pools, lane duels and the meta.',
  render(app, [id]) {
    render(app);
    const el = id ? app.querySelector<HTMLElement>(`#${CSS.escape(id)}`) : null;
    // The router scrolls to the top after render, so scroll on the next frame.
    if (el) requestAnimationFrame(() => el.scrollIntoView());
  },
};

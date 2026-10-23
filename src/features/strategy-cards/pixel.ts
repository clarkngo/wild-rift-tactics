/**
 * Tiny pixel-art SVG toolkit. Everything is drawn on a 128×72 grid and scaled up with
 * crisp edges, so exported SVGs and PNGs stay sharp and need no fonts or images.
 */

export const W = 128;
export const H = 72;

export const C = {
  bg: '#0b1220',
  grass: '#16261c',
  grassDark: '#112018',
  lane: '#3a3226',
  laneEdge: '#4a4030',
  brush: '#2c6a35',
  river: '#1f4f7a',
  ally: '#4aa3ff',
  allyDark: '#2a6bb0',
  enemy: '#ff5a5f',
  enemyDark: '#b03338',
  skin: '#f1c8a0',
  gold: '#e8b84a',
  white: '#f2f4f8',
  muted: '#8a96ad',
  stone: '#7d8698',
  stoneDark: '#4d5566',
  purple: '#a970ff',
  green: '#4fd18b',
  heal: '#5cff9d',
  ward: '#f7d35c',
  allySup: '#4fe0d0',
  enemySup: '#ffa04d',
  dragon: '#ff8a3d',
  pink: '#ff7ad9',
  mid: '#8fd3ff',
  mana: '#3d7dff',
  lime: '#b8f35c',
  calm: '#c9a0ff',
} as const;

/** 3×5 glyphs, five rows of three pixels each ('#' = on). */
const GLYPHS: Record<string, string[]> = {
  'A': '.#. #.# ### #.# #.#'.split(' '),
  'B': '##. #.# ##. #.# ##.'.split(' '),
  'C': '.## #.. #.. #.. .##'.split(' '),
  'D': '##. #.# #.# #.# ##.'.split(' '),
  'E': '### #.. ##. #.. ###'.split(' '),
  'F': '### #.. ##. #.. #..'.split(' '),
  'G': '.## #.. #.# #.# .##'.split(' '),
  'H': '#.# #.# ### #.# #.#'.split(' '),
  'I': '### .#. .#. .#. ###'.split(' '),
  'J': '..# ..# ..# #.# .#.'.split(' '),
  'K': '#.# #.# ##. #.# #.#'.split(' '),
  'L': '#.. #.. #.. #.. ###'.split(' '),
  'M': '#.# ### ### #.# #.#'.split(' '),
  'N': '##. #.# #.# #.# #.#'.split(' '),
  'O': '.#. #.# #.# #.# .#.'.split(' '),
  'P': '##. #.# ##. #.. #..'.split(' '),
  'Q': '.#. #.# #.# ##. .##'.split(' '),
  'R': '##. #.# ##. #.# #.#'.split(' '),
  'S': '.## #.. .#. ..# ##.'.split(' '),
  'T': '### .#. .#. .#. .#.'.split(' '),
  'U': '#.# #.# #.# #.# ###'.split(' '),
  'V': '#.# #.# #.# #.# .#.'.split(' '),
  'W': '#.# #.# ### ### #.#'.split(' '),
  'X': '#.# #.# .#. #.# #.#'.split(' '),
  'Y': '#.# #.# .#. .#. .#.'.split(' '),
  'Z': '### ..# .#. #.. ###'.split(' '),
  '0': '### #.# #.# #.# ###'.split(' '),
  '1': '.#. ##. .#. .#. ###'.split(' '),
  '2': '##. ..# .#. #.. ###'.split(' '),
  '3': '##. ..# .#. ..# ##.'.split(' '),
  '4': '#.# #.# ### ..# ..#'.split(' '),
  '5': '### #.. ##. ..# ##.'.split(' '),
  '6': '.## #.. ### #.# ###'.split(' '),
  '7': '### ..# .#. .#. .#.'.split(' '),
  '8': '### #.# ### #.# ###'.split(' '),
  '9': '### #.# ### ..# ##.'.split(' '),
  ' ': '... ... ... ... ...'.split(' '),
  '.': '... ... ... ... .#.'.split(' '),
  '!': '.#. .#. .#. ... .#.'.split(' '),
  '?': '##. ..# .#. ... .#.'.split(' '),
  '-': '... ... ### ... ...'.split(' '),
  '+': '... .#. ### .#. ...'.split(' '),
  '/': '..# ..# .#. #.. #..'.split(' '),
  ':': '... .#. ... .#. ...'.split(' '),
  '%': '#.# ..# .#. #.. #.#'.split(' '),
  '>': '#.. .#. ..# .#. #..'.split(' '),
  '<': '..# .#. #.. .#. ..#'.split(' '),
  "'": '.#. .#. ... ... ...'.split(' '),
  '(': '.#. #.. #.. #.. .#.'.split(' '),
  ')': '.#. ..# ..# ..# .#.'.split(' '),
  ',': '... ... ... .#. #..'.split(' '),
  '=': '... ### ... ### ...'.split(' '),
};

export const rect = (x: number, y: number, w: number, h: number, fill: string) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;

/** Draw a sprite from rows of characters; each character maps to a colour ('.' is empty). */
export function sprite(rows: string[], x: number, y: number, colors: Record<string, string>) {
  let out = '';
  rows.forEach((row, dy) => {
    // Merge horizontal runs of the same colour into one rect.
    let dx = 0;
    while (dx < row.length) {
      const ch = row[dx];
      let end = dx + 1;
      while (end < row.length && row[end] === ch) end++;
      if (ch !== '.' && colors[ch]) out += rect(x + dx, y + dy, end - dx, 1, colors[ch]);
      dx = end;
    }
  });
  return out;
}

/** 3×5 pixel text. Width is 4px per character. */
export function text(str: string, x: number, y: number, fill: string = C.white) {
  const rows: string[] = ['', '', '', '', ''];
  for (const ch of str.toUpperCase()) {
    const g = GLYPHS[ch] ?? GLYPHS['?'];
    for (let r = 0; r < 5; r++) rows[r] += g[r] + '.';
  }
  return sprite(rows, x, y, { '#': fill });
}

export const textWidth = (str: string) => str.length * 4 - 1;
export const centerText = (str: string, y: number, fill?: string) =>
  text(str, Math.round((W - textWidth(str)) / 2), y, fill);

// ---- Animation -------------------------------------------------------------

/** Wrap content in a group that moves through the given [dx, dy] offsets on a loop. */
export function move(content: string, path: [number, number][], dur = 2.4, begin = 0) {
  const values = path.map(([dx, dy]) => `${dx} ${dy}`).join(';');
  return `<g>${content}<animateTransform attributeName="transform" type="translate" values="${values}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite" calcMode="discrete"/></g>`;
}

/** Wrap content so it is only visible during part of the loop. `on` is a list of 0/1 keyframes. */
export function show(content: string, on: number[], dur = 2.4, begin = 0) {
  return `<g opacity="${on[0]}">${content}<animate attributeName="opacity" values="${on.join(';')}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite" calcMode="discrete"/></g>`;
}

export const blink = (content: string, dur = 0.8) => show(content, [1, 0], dur);

// ---- Sprites ---------------------------------------------------------------

const CHAMP = ['.HHH.', '.HHH.', '..B..', 'BBBBB', '..B..', '.B.B.', '.B.B.'];
const MINION = ['.M.', 'MMM', 'M.M'];
const TOWER = ['F.F.F', 'FFFFF', '.SSS.', '.SDS.', '.SSS.', '.SDS.', '.SSS.', 'SSSSS', 'SSSSS'];
const WARD = ['.Y.', 'YYY', '.Y.', '.S.', '.S.'];
const SHIELD = ['SSSSS', 'SLSSS', 'SLSSS', 'SSSSS', '.SSS.', '..S..'];
const HEART = ['.R.R.', 'RRRRR', 'RRRRR', '.RRR.', '..R..'];
const COIN = ['.YY.', 'YYYY', 'YDYY', '.YY.'];
const BURST = ['#.#.#', '.###.', '#####', '.###.', '#.#.#'];
const SWORD = ['....#', '...#.', '#.#..', '.#...', '#.#..'];
const ORB = ['.PP.', 'PWPP', 'PPPP', '.PP.'];
const SKULL = ['.###.', '#.#.#', '#####', '.###.', '.#.#.'];
const HERALD = ['.PPP.', 'PWPWP', 'PPPPP', 'P.P.P'];
const BARON = ['.PPPPPPP.', 'PPWPPPWPP', 'PPPPPPPPP', 'PP.PPP.PP', 'P..P.P..P'];
const BOOT = ['BB..', 'BB..', 'BB..', 'BBBB', 'BBBB'];
const FACE_CALM = ['.#####.', '##.#.##', '#######', '#.###.#', '##...##', '.#####.'];
const FACE_ANGRY = ['.#####.', '##.#.##', '#######', '##...##', '#.###.#', '.#####.'];
const SPEAKER = ['..#', '.##', '###', '###', '.##', '..#'];
const PLAY = ['#..', '##.', '###', '##.', '#..'];
const STUN = ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'];
const DRAGON = ['..OO.', '.OOOO', 'OOWO.', '.OOOO', 'O.O.O'];
const FLASH = ['YYYYY', 'Y...Y', 'Y.Y.Y', 'Y...Y', 'YYYYY'];

/** Supports get their own colours so a 2v2 lane stays readable. */
export type Team = 'ally' | 'enemy' | 'jungle' | 'allySup' | 'enemySup';

const TEAM_COLOR: Record<Team, string> = {
  ally: C.ally, enemy: C.enemy, jungle: C.purple, allySup: C.allySup, enemySup: C.enemySup,
};
const teamColor = (t: Team) => TEAM_COLOR[t];

export const champ = (x: number, y: number, team: Team) =>
  sprite(CHAMP, x, y, { H: C.skin, B: teamColor(team) });

export const minion = (x: number, y: number, team: Team) =>
  sprite(MINION, x, y, { M: team === 'enemy' || team === 'enemySup' ? C.enemyDark : C.allyDark });

export function wave(x: number, y: number, team: Team, count = 3, gap = 4) {
  let out = '';
  for (let i = 0; i < count; i++) out += minion(x + (team === 'enemy' || team === 'enemySup' ? i : -i) * gap, y + (i % 2) * 3, team);
  return out;
}

export const tower = (x: number, y: number, team: Team) =>
  sprite(TOWER, x, y, { F: teamColor(team), S: C.stone, D: C.stoneDark });

export const ward = (x: number, y: number) => sprite(WARD, x, y, { Y: C.ward, S: C.stone });
export const shield = (x: number, y: number, fill: string = C.stone) =>
  sprite(SHIELD, x, y, { S: fill, L: C.white });
export const heart = (x: number, y: number, fill: string = C.heal) => sprite(HEART, x, y, { R: fill });
export const coin = (x: number, y: number) => sprite(COIN, x, y, { Y: C.gold, D: '#b8862a' });
export const burst = (x: number, y: number, fill: string = C.gold) => sprite(BURST, x, y, { '#': fill });
export const sword = (x: number, y: number, fill: string = C.white) => sprite(SWORD, x, y, { '#': fill });
export const orb = (x: number, y: number) => sprite(ORB, x, y, { P: C.purple, W: C.white });
export const skull = (x: number, y: number) => sprite(SKULL, x, y, { '#': C.white });
export const herald = (x: number, y: number) => sprite(HERALD, x, y, { P: C.purple, W: C.white });
export const baron = (x: number, y: number) => sprite(BARON, x, y, { P: C.purple, W: C.white });
export const dragon = (x: number, y: number) => sprite(DRAGON, x, y, { O: C.dragon, W: C.white });
export const boot = (x: number, y: number, fill: string = C.ward) => sprite(BOOT, x, y, { B: fill });
/** 7x6 face: calm (smile) or angry (frown). */
export const face = (x: number, y: number, mood: 'calm' | 'angry') =>
  sprite(mood === 'calm' ? FACE_CALM : FACE_ANGRY, x, y, { '#': mood === 'calm' ? C.calm : C.enemy });
export const speaker = (x: number, y: number, fill: string = C.white) => sprite(SPEAKER, x, y, { '#': fill });
export const playIcon = (x: number, y: number, fill: string = C.white) => sprite(PLAY, x, y, { '#': fill });
/** One-pixel outline rectangle. */
export const box = (x: number, y: number, w: number, h: number, fill: string) =>
  rect(x, y, w, 1, fill) + rect(x, y + h - 1, w, 1, fill) + rect(x, y, 1, h, fill) + rect(x + w - 1, y, 1, h, fill);
export const stun = (x: number, y: number) => sprite(STUN, x, y, { '#': C.ward });
/** Summoner-spell slot icon; pass `used` to cross it out. */
export const flashIcon = (x: number, y: number, used = false) =>
  sprite(FLASH, x, y, { Y: used ? C.muted : C.ward }) + (used ? sprite(['#...#', '.#.#.', '..#..', '.#.#.', '#...#'], x, y, { '#': C.enemy }) : '');

/** Horizontal or vertical arrow with a 3px head. */
export function arrow(x1: number, y1: number, x2: number, y2: number, fill: string = C.gold) {
  let out = '';
  if (y1 === y2) {
    const dir = Math.sign(x2 - x1);
    const [a, b] = dir > 0 ? [x1, x2 - 2] : [x2 + 2, x1];
    out += rect(Math.min(a, b), y1, Math.abs(b - a) + 1, 1, fill);
    out += rect(x2 - dir * 2, y1 - 2, 1, 5, fill) + rect(x2 - dir, y1 - 1, 1, 3, fill) + rect(x2, y1, 1, 1, fill);
  } else {
    const dir = Math.sign(y2 - y1);
    const [a, b] = dir > 0 ? [y1, y2 - 2] : [y2 + 2, y1];
    out += rect(x1, Math.min(a, b), 1, Math.abs(b - a) + 1, fill);
    out += rect(x1 - 2, y2 - dir * 2, 5, 1, fill) + rect(x1 - 1, y2 - dir, 3, 1, fill) + rect(x1, y2, 1, 1, fill);
  }
  return out;
}

/** HP bar; `pct` is 0–1. */
export const hpBar = (x: number, y: number, w: number, pct: number, fill: string = C.green) =>
  rect(x, y, w, 2, '#00000088') + rect(x, y, Math.max(1, Math.round(w * pct)), 2, fill);

/** Standard Baron-lane backdrop: grass, a horizontal lane, ally tower left, enemy tower right. */
export function laneScene({ y = 34, towers = true, brush = true } = {}) {
  let out = rect(0, 10, W, 51, C.grass);
  for (let x = 0; x < W; x += 8) out += rect(x + ((x / 8) % 2) * 3, 12 + ((x / 8) % 3) * 2, 1, 1, C.grassDark);
  out += rect(0, y - 1, W, 1, C.laneEdge) + rect(0, y, W, 14, C.lane) + rect(0, y + 14, W, 1, C.laneEdge);
  if (brush) out += rect(92, 14, 12, 7, C.brush) + rect(104, 51, 12, 6, C.brush);
  if (towers) out += tower(3, y + 2, 'ally') + tower(W - 8, y + 2, 'enemy');
  return out;
}

/** Wrap a scene in a complete, standalone SVG with title bar and takeaway caption. */
export function card({ title, takeaway, scene, accent }: { title: string; takeaway: string; scene: string; accent: string }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W * 8}" height="${H * 8}" shape-rendering="crispEdges" role="img" aria-label="${title}. ${takeaway}">`
    + `<title>${title}: ${takeaway}</title>`
    + rect(0, 0, W, H, C.bg)
    + rect(0, 0, W, 9, '#131c2e') + rect(0, 9, W, 1, accent)
    + centerText(title, 2, C.white)
    + scene
    + rect(0, 61, W, 1, accent) + rect(0, 62, W, 10, '#131c2e')
    + centerText(takeaway, 64, accent)
    + '</svg>';
}

/** Draw content authored at (0,0) scaled up by `s` and placed at (x, y). */
export const scaled = (s: number, x: number, y: number, content: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})">${content}</g>`;

/**
 * Square minimap: three lanes, the river (top-left to bottom-right), both bases, and
 * camps in each team's jungle. Ally side is bottom-left. Returns markup plus a `at` helper
 * that converts map-local coordinates (0 to size) to scene coordinates.
 */
export function miniMap(x0 = 40, y0 = 12, size = 48) {
  const at = (x: number, y: number): [number, number] => [x0 + x, y0 + y];
  let out = rect(x0, y0, size, size, C.grassDark);
  for (let i = 0; i < (size - 6) / 2; i++) out += rect(x0 + 3 + i * 2, y0 + 3 + i * 2, 2, 2, C.river);
  for (let i = 0; i < (size - 6) / 2; i++) out += rect(x0 + 3 + i * 2, y0 + size - 5 - i * 2, 2, 2, C.lane);
  out += rect(x0, y0, 3, size, C.lane) + rect(x0, y0, size, 3, C.lane);
  out += rect(x0 + size - 3, y0, 3, size, C.lane) + rect(x0, y0 + size - 3, size, 3, C.lane);
  out += rect(x0, y0 + size - 6, 6, 6, C.ally) + rect(x0 + size - 6, y0, 6, 6, C.enemy);
  return { out, at };
}

/** Jungle camp marker. */
export const camp = (x: number, y: number, fill: string = C.green) => rect(x, y, 2, 2, fill);

/** Small square map marker for a champion. */
export const dot = (x: number, y: number, fill: string) => rect(x, y, 3, 3, fill);

// Validates src/features/baron-matchups/data/*.json: schema, champion ids, minimum detail,
// and mirror-rating consistency; plus the class matchup matrix.
import { readFileSync, readdirSync } from 'node:fs';

const dir = new URL('../src/features/baron-matchups/data/', import.meta.url);
const roster = new Set(
  [...readFileSync(new URL('../src/shared/champions.ts', import.meta.url), 'utf8').matchAll(/id: '([a-z]+)'/g)].map((m) => m[1]),
);
const RATINGS = ['good', 'neutral', 'bad'];
const MIRROR = { good: 'bad', neutral: 'neutral', bad: 'good' };
// Minimum lengths so entries stay specific rather than one-line generic advice.
const MIN_LENGTH = { why: 140, early: 60, spike: 60, wave: 40, jungle: 40, build: 25, remember: 12 };
const MIN_TRADING_STEPS = 3;
const MIN_TRADING_STEP_LENGTH = 35;
const errors = [];
const ratings = new Map(); // "pick>enemy" -> rating

for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const d = JSON.parse(readFileSync(new URL(file, dir), 'utf8'));
  const where = (s) => errors.push(`${file}: ${s}`);
  if (`${d.enemy}.json` !== file) where(`enemy "${d.enemy}" doesn't match filename`);
  if (!roster.has(d.enemy)) where(`enemy "${d.enemy}" not in champions.ts`);
  if (typeof d.patch !== 'string' || typeof d.reviewed !== 'boolean') where('needs patch (string) and reviewed (boolean)');
  if (!d.summary || !Array.isArray(d.threats) || !d.threats.length) where('needs summary and threats');
  for (const m of d.matchups ?? []) {
    const at = (s) => where(`${m.champion}: ${s}`);
    if (!roster.has(m.champion)) at('not in champions.ts');
    if (!RATINGS.includes(m.rating)) at(`bad rating "${m.rating}"`);
    if (!['high', 'medium', 'low'].includes(m.confidence)) at(`bad confidence "${m.confidence}"`);
    if (!Array.isArray(m.trading) || m.trading.length < MIN_TRADING_STEPS) at(`needs ${MIN_TRADING_STEPS}+ trading steps`);
    else if (m.trading.some((t) => typeof t !== 'string' || t.length < MIN_TRADING_STEP_LENGTH))
      at(`trading steps must be ${MIN_TRADING_STEP_LENGTH}+ characters`);
    for (const [f, min] of Object.entries(MIN_LENGTH)) {
      if (typeof m[f] !== 'string' || !m[f].trim()) at(`missing ${f}`);
      else if (m[f].length < min) at(`${f} is too thin (${m[f].length} chars, min ${min})`);
    }
    ratings.set(`${m.champion}>${d.enemy}`, m.rating);
  }
}

for (const [key, r] of ratings) {
  const [pick, enemy] = key.split('>');
  const mirror = ratings.get(`${enemy}>${pick}`);
  if (mirror && mirror !== MIRROR[r]) errors.push(`${pick} is "${r}" into ${enemy}, but ${enemy} is "${mirror}" into ${pick}`);
}

// Class matchups: every pick/enemy pair present once, mirrors consistent, text not thin.
const cls = JSON.parse(readFileSync(new URL('../src/features/class-matchups/classes.json', import.meta.url), 'utf8'));
const classIds = cls.classes.map((c) => c.id);
const classRatings = new Map();
for (const m of cls.matchups) {
  const key = `${m.pick}>${m.enemy}`;
  if (!classIds.includes(m.pick) || !classIds.includes(m.enemy)) errors.push(`classes.json: unknown class in ${key}`);
  if (!RATINGS.includes(m.rating)) errors.push(`classes.json: ${key} bad rating "${m.rating}"`);
  if (classRatings.has(key)) errors.push(`classes.json: duplicate ${key}`);
  if (!(m.why?.length >= 80) || !(m.tip?.length >= 35)) errors.push(`classes.json: ${key} why/tip too thin`);
  classRatings.set(key, m.rating);
}
for (const a of classIds)
  for (const b of classIds) {
    const r = classRatings.get(`${a}>${b}`);
    if (!r) errors.push(`classes.json: missing ${a}>${b}`);
    else if (classRatings.get(`${b}>${a}`) !== MIRROR[r]) errors.push(`classes.json: ${a}>${b} is "${r}" but ${b}>${a} isn't "${MIRROR[r]}"`);
  }

if (errors.length) {
  console.error(`Matchup data errors:\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`Matchup data OK (${ratings.size} matchups, ${classRatings.size} class pairs).`);

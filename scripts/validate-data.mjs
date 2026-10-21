// Validates src/features/baron-matchups/data/*.json: schema, champion ids, and mirror-rating consistency.
import { readFileSync, readdirSync } from 'node:fs';

const dir = new URL('../src/features/baron-matchups/data/', import.meta.url);
const roster = new Set(
  [...readFileSync(new URL('../src/shared/champions.ts', import.meta.url), 'utf8').matchAll(/id: '([a-z]+)'/g)].map((m) => m[1]),
);
const RATINGS = ['good', 'neutral', 'bad'];
const MIRROR = { good: 'bad', neutral: 'neutral', bad: 'good' };
const STRING_FIELDS = ['why', 'early', 'spike', 'wave', 'jungle', 'build', 'remember'];
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
    if (!Array.isArray(m.trading) || !m.trading.length) at('needs trading steps');
    for (const f of STRING_FIELDS) if (typeof m[f] !== 'string' || !m[f].trim()) at(`missing ${f}`);
    ratings.set(`${m.champion}>${d.enemy}`, m.rating);
  }
}

for (const [key, r] of ratings) {
  const [pick, enemy] = key.split('>');
  const mirror = ratings.get(`${enemy}>${pick}`);
  if (mirror && mirror !== MIRROR[r]) errors.push(`${pick} is "${r}" into ${enemy}, but ${enemy} is "${mirror}" into ${pick}`);
}

if (errors.length) {
  console.error(`Matchup data errors:\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`Matchup data OK (${ratings.size} matchups).`);

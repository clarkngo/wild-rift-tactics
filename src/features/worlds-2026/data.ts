/**
 * Worlds 2026 (PC League of Legends) final guide.
 *
 * Facts were checked on 14 Nov 2026, just before the final:
 * - Bracket, dates, venues, rosters, history: Wikipedia "2026 League of Legends World Championship" and "... final".
 * - Player and champion stats (patch 26.20, 94 games before the final): riftgraphs.com.
 * - Expert predictions: Strafe and eGamersWorld previews.
 * When the final is played, fill in `RESULT` and the page switches from preview to result.
 */

export interface Result {
  winner: 'GEN' | 'BLG';
  score: string; // e.g. "3–1"
  mvp?: string;
}
/** Set once the final is over, e.g. { winner: 'GEN', score: '3–1', mvp: 'Chovy' }. */
export const RESULT: Result | null = null;

export const FINAL = {
  date: 'Saturday 14 November 2026',
  time: '2:00 PM ET (19:00 UTC)',
  venue: 'Barclays Center, Brooklyn, New York City',
  format: 'Best of five, Fearless Draft: a champion played in one game can’t be picked again by either team for the rest of the series.',
  patch: '26.20',
  prize: 'US$5,000,000 pool; the champion takes $1,000,000, runner-up $800,000.',
};

export interface Player {
  name: string;
  realName: string;
  role: 'Top' | 'Jungle' | 'Mid' | 'Bot' | 'Support';
  games: number;
  record: string;
  kda: number;
  /** Kills / deaths / assists per game. */
  perGame: string;
  kp: string;
  /** Damage per minute, or vision score per minute for supports. */
  stat: string;
  /** Champions played at this Worlds, most played first: [name, Data Dragon image id, games]. */
  pool: [string, string, number][];
  note: string;
}

export interface Team {
  id: 'GEN' | 'BLG';
  name: string;
  region: string;
  coach: string;
  record: string;
  path: string[];
  identity: string;
  players: Player[];
  keys: string[];
}

export const TEAMS: Team[] = [
  {
    id: 'GEN',
    name: 'Gen.G',
    region: 'LCK (Korea)',
    coach: 'Ryu',
    record: '10–1 in games',
    path: ['Swiss 3–0 (beat Invictus Gaming, Hanwha Life, LYON)', 'Quarterfinal 3–0 LYON', 'Semifinal 3–0 Invictus Gaming'],
    identity:
      'LCK champions in 2025 and 2026 and the first seed from Korea. They have dropped one game all tournament, and they win by controlling the early game and the jungle. Their first Worlds final under the Gen.G name (they won 2017 as Samsung Galaxy).',
    keys: [
      'Get Canyon ahead early: he has the best KDA at the tournament and five games on Qiyana.',
      'Let Ruler carry: he takes 25% of Gen.G’s gold and has a 7.7 KDA.',
      'Stretch BLG’s pool under Fearless: Knight has played Orianna six times, and once she’s used she’s gone.',
    ],
    players: [
      {
        name: 'Kiin', realName: 'Kim Gi-in', role: 'Top', games: 11, record: '10–1', kda: 7.4,
        perGame: '3.7 / 1.5 / 7.7', kp: '61%', stat: '651 damage/min',
        pool: [['Camille', 'Camille', 2], ['Olaf', 'Olaf', 2], ['Rumble', 'Rumble', 2], ['Ambessa', 'Ambessa', 1], ['Aurora', 'Aurora', 1], ['Gwen', 'Gwen', 1], ['Ornn', 'Ornn', 1], ['Sion', 'Sion', 1]],
        note: 'Best KDA among top laners at the event. Eight different champions in 11 games, which is exactly what Fearless Draft rewards.',
      },
      {
        name: 'Canyon', realName: 'Kim Geon-bu', role: 'Jungle', games: 11, record: '10–1', kda: 9.6,
        perGame: '3.9 / 1.5 / 10.1', kp: '74%', stat: '560 damage/min',
        pool: [['Qiyana', 'Qiyana', 5], ['Jarvan IV', 'JarvanIV', 1], ['Jayce', 'Jayce', 1], ['Lee Sin', 'LeeSin', 1], ['Nocturne', 'Nocturne', 1], ['Pantheon', 'Pantheon', 1], ['Wukong', 'Wukong', 1]],
        note: '2020 world champion (with DAMWON, beating Bin’s Suning in the final). Best KDA of any player at Worlds 2026.',
      },
      {
        name: 'Chovy', realName: 'Jeong Ji-hoon', role: 'Mid', games: 11, record: '10–1', kda: 6.4,
        perGame: '4.2 / 1.9 / 8.1', kp: '65%', stat: '608 damage/min',
        pool: [['Galio', 'Galio', 2], ['Taliyah', 'Taliyah', 2], ['Ahri', 'Ahri', 1], ['Akali', 'Akali', 1], ['Anivia', 'Anivia', 1], ['Cassiopeia', 'Cassiopeia', 1], ['Lissandra', 'Lissandra', 1], ['Syndra', 'Syndra', 1], ['Viktor', 'Viktor', 1]],
        note: '2026 LCK Season MVP, in his first Worlds final after semifinal exits in 2022, 2024 and 2025. Nine champions in 11 games.',
      },
      {
        name: 'Ruler', realName: 'Park Jae-hyuk', role: 'Bot', games: 11, record: '10–1', kda: 7.7,
        perGame: '5.7 / 1.8 / 8.2', kp: '74%', stat: '740 damage/min',
        pool: [['Ashe', 'Ashe', 3], ['Jhin', 'Jhin', 3], ['Ezreal', 'Ezreal', 2], ['Corki', 'Corki', 1], ['Xayah', 'Xayah', 1], ['Yunara', 'Yunara', 1]],
        note: '2017 world champion with Samsung Galaxy, the same organisation. Best KDA among bot laners at the event.',
      },
      {
        name: 'Duro', realName: 'Joo Min-kyu', role: 'Support', games: 11, record: '10–1', kda: 5.0,
        perGame: '1.3 / 2.6 / 12.0', kp: '71%', stat: '4.43 vision/min',
        pool: [['Leona', 'Leona', 3], ['Nautilus', 'Nautilus', 3], ['Seraphine', 'Seraphine', 3], ['Alistar', 'Alistar', 1], ['Rakan', 'Rakan', 1]],
        note: 'Engage support who mostly plays Leona and Nautilus. His first Worlds final.',
      },
    ],
  },
  {
    id: 'BLG',
    name: 'Bilibili Gaming',
    region: 'LPL (China)',
    coach: 'Daeny',
    record: '11–4 in games',
    path: ['Swiss 3–2 (lost to Movistar KOI and Top Esports)', 'Quarterfinal 3–0 Dplus KIA', 'Semifinal 3–1 T1, ending T1’s run of three straight titles'],
    identity:
      '2026 First Stand champions and MSI runners-up. BLG started Worlds with a loss and nearly went out in Swiss, then swept Dplus KIA and beat three-time champions T1. Their second Worlds final after losing to T1 in 2024.',
    keys: [
      'Play through Knight: he has a 9.2 KDA and deals 28% of BLG’s damage.',
      'Survive the early game: previews rate Gen.G’s early game far above BLG’s, so BLG want long, messy games.',
      'Make it a long series: BLG have played four tough series in a row; Gen.G have barely been tested.',
    ],
    players: [
      {
        name: 'Bin', realName: 'Chen Ze-Bin', role: 'Top', games: 15, record: '11–4', kda: 4.2,
        perGame: '3.5 / 2.0 / 4.9', kp: '52%', stat: '427 damage/min',
        pool: [['Ambessa', 'Ambessa', 4], ['Gnar', 'Gnar', 4], ['Camille', 'Camille', 2], ["K'Sante", 'KSante', 2], ['Jax', 'Jax', 1], ['Olaf', 'Olaf', 1], ['Renekton', 'Renekton', 1]],
        note: 'First Chinese player to reach three Worlds finals (2020, 2024, 2026). A split-pusher who plays on his own side of the map.',
      },
      {
        name: 'Xun', realName: 'Peng Li-Xun', role: 'Jungle', games: 15, record: '11–4', kda: 5.6,
        perGame: '3.5 / 2.1 / 8.2', kp: '72%', stat: '396 damage/min',
        pool: [['Lee Sin', 'LeeSin', 3], ['Pantheon', 'Pantheon', 3], ['Naafiri', 'Naafiri', 2], ['Jarvan IV', 'JarvanIV', 1], ['Maokai', 'Maokai', 1], ['Qiyana', 'Qiyana', 1], ['Skarner', 'Skarner', 1], ['Trundle', 'Trundle', 1], ['Vi', 'Vi', 1], ['Wukong', 'Wukong', 1]],
        note: 'Widest pool on either team: ten junglers in 15 games. Second-best jungle KDA at the event, behind Canyon.',
      },
      {
        name: 'Knight', realName: 'Zhuo Ding', role: 'Mid', games: 15, record: '11–4', kda: 9.2,
        perGame: '4.9 / 1.3 / 7.3', kp: '76%', stat: '679 damage/min',
        pool: [['Orianna', 'Orianna', 6], ['LeBlanc', 'Leblanc', 2], ['Ahri', 'Ahri', 1], ['Akali', 'Akali', 1], ['Galio', 'Galio', 1], ['Locke', 'Locke', 1], ['Taliyah', 'Taliyah', 1], ['Viktor', 'Viktor', 1], ['Yone', 'Yone', 1]],
        note: 'Best mid laner by KDA at the event, ahead of Faker and Chovy. Orianna is his comfort pick; Gen.G may ban it or force it out early.',
      },
      {
        name: 'Viper', realName: 'Park Do-hyeon', role: 'Bot', games: 15, record: '11–4', kda: 4.7,
        perGame: '3.8 / 2.3 / 7.2', kp: '68%', stat: '718 damage/min',
        pool: [['Ezreal', 'Ezreal', 4], ['Ashe', 'Ashe', 3], ["Kai'Sa", 'Kaisa', 2], ['Cassiopeia', 'Cassiopeia', 1], ['Corki', 'Corki', 1], ['Jhin', 'Jhin', 1], ['Kalista', 'Kalista', 1], ['Lucian', 'Lucian', 1], ['Yunara', 'Yunara', 1]],
        note: '2021 world champion with Edward Gaming. A Korean player on a Chinese team; he deals 30% of BLG’s damage.',
      },
      {
        name: 'ON', realName: 'Luo Wen-Jun', role: 'Support', games: 15, record: '11–4', kda: 3.6,
        perGame: '0.5 / 3.2 / 11.1', kp: '71%', stat: '4.17 vision/min',
        pool: [['Nautilus', 'Nautilus', 6], ['Seraphine', 'Seraphine', 3], ['Alistar', 'Alistar', 1], ['Leona', 'Leona', 1], ['Lulu', 'Lulu', 1], ['Milio', 'Milio', 1], ['Nami', 'Nami', 1], ['Renata Glasc', 'Renata', 1]],
        note: 'Aggressive engage support; Nautilus in six of 15 games. Both supports want Nautilus, so expect it banned or picked first.',
      },
    ],
  },
];

export const ROLES = ['Top', 'Jungle', 'Mid', 'Bot', 'Support'] as const;

/** Who has the edge in each lane, judged on tournament stats. Our read, not a fact. */
export const DUELS: Record<(typeof ROLES)[number], { edge: 'GEN' | 'BLG' | 'even'; why: string }> = {
  Top: { edge: 'GEN', why: 'Kiin has a 7.4 KDA to Bin’s 4.2, and a deeper pool. Bin is at his best on a split-push champion like Ambessa or Gnar.' },
  Jungle: { edge: 'GEN', why: 'Canyon (9.6 KDA, 10–1) has been the best player at the event. Xun’s ten-champion pool is BLG’s answer to Fearless.' },
  Mid: { edge: 'even', why: 'The headline duel. Knight has the better numbers (9.2 KDA, 28% of team damage), Chovy has the wider pool and fewer losses.' },
  Bot: { edge: 'GEN', why: 'Ruler’s 7.7 KDA is well ahead of Viper’s 4.7, but Viper deals more of his team’s damage and has won a Worlds final more recently.' },
  Support: { edge: 'even', why: 'Two engage supports with similar vision numbers. Whoever gets Nautilus or Leona first sets up the bot side.' },
};

export const HEAD_TO_HEAD = [
  { event: 'MSI 2023, lower bracket semifinal', winner: 'BLG', score: '3–0' },
  { event: 'Worlds 2023', winner: 'BLG', score: '3–2' },
  { event: 'MSI 2024, upper bracket final', winner: 'GEN', score: '3–1' },
  { event: 'MSI 2024, grand final', winner: 'GEN', score: '3–1' },
];

export const PREDICTION = {
  pick: 'Gen.G 3–2',
  confidence: 'Lean, not a lock',
  why: [
    'Gen.G have been the cleaner team all tournament: one game lost to BLG’s four, and previews rate their early game far ahead.',
    'Fearless Draft hurts one-trick comfort picks. Knight on Orianna and ON on Nautilus can each be used only once, and Gen.G’s players have spread across more champions.',
    'BLG beat T1 and have the momentum, the better mid by the numbers, and a history of beating Gen.G at Worlds (3–2 in 2023). That’s why we expect five games.',
  ],
  experts: 'Most previews pick Gen.G: Strafe says 3–2, eGamersWorld says 3–1.',
};

export const BRACKET = [
  { round: 'Quarterfinals', date: '3–6 Nov', matches: [['Top Esports', '1', '3', 'Invictus Gaming'], ['Gen.G', '3', '0', 'LYON'], ['Dplus KIA', '0', '3', 'Bilibili Gaming'], ['Karmine Corp', '1', '3', 'T1']] },
  { round: 'Semifinals', date: '7–8 Nov', matches: [['Invictus Gaming', '0', '3', 'Gen.G'], ['Bilibili Gaming', '3', '1', 'T1']] },
] as const;

/** Most-present champions (picked or banned) across 94 games on patch 26.20, before the final. */
export const META: [string, string, string, number, number, number][] = [
  // name, image id, role, picks, bans, win rate %
  ['Nocturne', 'Nocturne', 'Jungle', 16, 67, 56],
  ['Vi', 'Vi', 'Jungle', 16, 55, 63],
  ['Renata Glasc', 'Renata', 'Support', 16, 54, 50],
  ['Cassiopeia', 'Cassiopeia', 'Mid / Bot', 17, 44, 65],
  ['Olaf', 'Olaf', 'Top', 18, 39, 67],
  ['Syndra', 'Syndra', 'Mid', 23, 31, 57],
  ['Qiyana', 'Qiyana', 'Jungle', 22, 32, 50],
  ['Ezreal', 'Ezreal', 'Bot', 28, 23, 43],
  ['Lee Sin', 'LeeSin', 'Jungle', 29, 21, 52],
  ['Orianna', 'Orianna', 'Mid', 23, 24, 70],
];

export const STORYLINES = [
  'No T1 in the final for the first time since 2021. T1 had won three straight titles (2023–2025); BLG knocked them out 3–1 in the semifinal.',
  'Chovy vs Knight: the two best mid laners at the event by the numbers, and Chovy’s first Worlds final.',
  'Gen.G’s first final under that name. The organisation last won Worlds as Samsung Galaxy in 2017, with Ruler in the bot lane.',
  'BLG’s second final in three years, after losing to T1 in 2024. Bin is the first Chinese player in three Worlds finals.',
  'A rematch of the 2020 final in the jungle and top lane: Canyon’s DAMWON beat Bin’s Suning.',
  'The first Worlds final on the US East Coast.',
];

export const WILD_RIFT_TAKEAWAYS = [
  'Pick for the team, not for yourself: pro drafts lean on a few contested junglers (Nocturne, Vi, Lee Sin). In ranked, ban or first-pick the jungler that decides your lobby.',
  'A deep pool beats one main: under Fearless Draft, Kiin and Chovy played eight and nine champions. Learn two or three champions per role so a ban doesn’t ruin your game.',
  'Early game wins series: Gen.G play around Canyon’s jungle tempo. In your games, push your lane when your jungler is on your side so you can move with them.',
];

export const SOURCES = [
  { label: 'Wikipedia: 2026 League of Legends World Championship', url: 'https://en.wikipedia.org/wiki/2026_League_of_Legends_World_Championship' },
  { label: 'Wikipedia: 2026 Worlds final', url: 'https://en.wikipedia.org/wiki/2026_League_of_Legends_World_Championship_final' },
  { label: 'Rift Graphs: Worlds 2026 player and champion stats', url: 'https://riftgraphs.com/players' },
  { label: 'LoL Esports (official)', url: 'https://lolesports.com' },
];

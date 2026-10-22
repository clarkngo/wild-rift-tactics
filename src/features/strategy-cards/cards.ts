import {
  C, W, arrow, baron, boot, burst, camp, champ, coin, dot, dragon, flashIcon, miniMap, heart, herald, hpBar, laneScene, minion, move, orb, rect,
  scaled, shield, show, skull, stun, sword, text, tower, ward, wave, type Team,
} from './pixel';

export type Category = 'micro' | 'macro' | 'items' | 'counters' | 'support' | 'jungle' | 'mid' | 'dragon' | 'teamfight';

export const CATEGORIES: Record<Category, { label: string; accent: string; blurb: string }> = {
  micro: { label: 'Laning micro', accent: C.gold, blurb: 'Trades, spacing and wave control in lane.' },
  macro: { label: 'Macro', accent: C.green, blurb: 'When to push, roam, recall and take objectives.' },
  items: { label: 'Itemization', accent: C.purple, blurb: 'What to buy, and when, based on the enemy.' },
  counters: { label: 'Class counters', accent: C.ally, blurb: 'Which champion types beat which.' },
  support: { label: 'Support', accent: C.allySup, blurb: 'Dragon lane support: peel, engage, vision and roams.' },
  jungle: { label: 'Jungle', accent: C.pink, blurb: 'Clears, ganks, counter-jungling and objectives.' },
  mid: { label: 'Mid lane', accent: C.mid, blurb: 'Roams, river priority, mana and playing around assassins.' },
  dragon: { label: 'Dragon lane', accent: C.dragon, blurb: 'Playing ADC: kiting, farming, positioning and your support.' },
  teamfight: { label: 'Team fights', accent: C.lime, blurb: 'When to fight, who does what, and how to win the fight.' },
};

export interface StrategyCard {
  id: string;
  category: Category;
  /** Pixel-font title and takeaway: uppercase, 31 characters max each. */
  title: string;
  takeaway: string;
  summary: string;
  tips: string[];
  examples?: { label: string; champions: string[] };
  scene: () => string;
}

/** A row of champions at the given x positions. */
const team = (xs: number[], y: number, t: Team) => xs.map((x) => champ(x, y, t)).join('');
/** Small ultimate-ready (gold) or on-cooldown (grey) marker. */
const ultIcon = (x: number, y: number, up: boolean) => rect(x, y, 3, 3, up ? C.gold : C.stoneDark);

export const CARDS: StrategyCard[] = [
  // ---- Laning micro --------------------------------------------------------
  {
    id: 'trade-on-cooldown',
    category: 'micro',
    title: 'TRADE ON THEIR COOLDOWN',
    takeaway: 'THEY MISS IT. YOU STEP IN.',
    summary: 'The safest trade is the one right after your opponent burns their key spell. Step in, hit, and step out before it comes back.',
    tips: [
      'Know the one spell that wins their trades: Darius E, Fiora W, Jax E, Renekton W.',
      'When it goes on cooldown (on a minion, or a miss), walk forward immediately.',
      'Leave before it comes back. A short trade you win beats a long one you might not.',
    ],
    examples: { label: 'Key cooldowns to watch', champions: ['darius', 'fiora', 'jax', 'renekton', 'illaoi'] },
    scene: () =>
      laneScene()
      + wave(40, 39, 'ally', 3) + wave(92, 39, 'enemy', 3)
      + champ(80, 37, 'enemy') + hpBar(78, 34, 9, 1)
      + show(hpBar(78, 34, 9, 0.5, C.enemy), [0, 0, 0, 1, 1, 1], 3)
      + show(burst(72, 38, C.enemy), [0, 1, 0, 0, 0, 0], 3)
      + show(text('SPELL DOWN', 44, 14, C.enemy), [0, 1, 1, 1, 0, 0], 3)
      + move(champ(54, 37, 'ally') + hpBar(52, 34, 9, 1), [[0, 0], [0, 0], [10, 0], [16, 0], [6, 0], [0, 0]], 3)
      + show(burst(80, 37), [0, 0, 0, 1, 0, 0], 3),
  },
  {
    id: 'hit-when-they-last-hit',
    category: 'micro',
    title: 'HIT THEM WHEN THEY LAST-HIT',
    takeaway: 'CS OR HP: MAKE THEM CHOOSE',
    summary: 'Every time your opponent walks up to last-hit, they commit to an animation and a position. That is your free poke window.',
    tips: [
      'Watch for low-HP minions near them; that is where they are about to walk.',
      'Auto or poke the moment they commit to the last hit.',
      'If they skip the creep to avoid you, you just won gold anyway.',
    ],
    scene: () =>
      laneScene()
      + wave(46, 39, 'ally', 3)
      + show(minion(68, 40, 'ally') + hpBar(67, 37, 5, 0.15, C.enemy), [1, 1, 1, 0, 0, 0], 3)
      + move(champ(84, 37, 'enemy'), [[0, 0], [-6, 0], [-10, 0], [-10, 0], [-6, 0], [0, 0]], 3)
      + champ(54, 37, 'ally')
      + show(arrow(60, 40, 72, 40), [0, 0, 1, 1, 0, 0], 3)
      + show(burst(74, 37), [0, 0, 0, 1, 0, 0], 3)
      + text('CS OR HP?', 46, 14, C.gold),
  },
  {
    id: 'wave-states',
    category: 'micro',
    title: 'SLOW PUSH / FREEZE / CRASH',
    takeaway: 'PICK YOUR WAVE STATE ON PURPOSE',
    summary: 'Every wave is either building, held still, or crashing. Choose which one you want instead of auto-attacking whatever is closest.',
    tips: [
      'Slow push: last-hit only, let your wave grow, then crash a huge wave before a recall or roam.',
      'Freeze: keep the wave just outside your tower so they must overextend to farm.',
      'Crash: shove the wave into their tower so you can recall, roam, or take plates for free.',
    ],
    scene: () => {
      let out = rect(0, 10, W, 51, C.grass);
      const strip = (y: number, label: string) =>
        text(label, 2, y, C.white) + rect(0, y + 7, W, 8, C.lane);
      out += strip(12, 'SLOW PUSH') + strip(28, 'FREEZE') + strip(44, 'CRASH');
      out += move(wave(60, 20, 'ally', 5, 4), [[0, 0], [3, 0], [6, 0], [9, 0]], 3) + wave(76, 20, 'enemy', 2);
      out += rect(4, 35, 3, 7, C.stone) + rect(4, 34, 3, 1, C.ally) + wave(24, 36, 'ally', 2) + wave(28, 36, 'enemy', 4);
      out += rect(121, 51, 3, 7, C.stone) + rect(121, 50, 3, 1, C.enemy);
      out += move(wave(90, 52, 'ally', 7, 4), [[0, 0], [8, 0], [16, 0], [24, 0]], 3);
      out += show(burst(118, 52), [0, 0, 0, 1], 3);
      return out;
    },
  },
  {
    id: 'freeze-for-ganks',
    category: 'micro',
    title: 'FREEZE NEAR YOUR TOWER',
    takeaway: 'THEY OVERREACH. JUNGLE COLLECTS',
    summary: 'A freeze holds the wave just outside your tower. Your opponent has to walk far up the lane to farm, which makes them easy to gank and hard to save.',
    tips: [
      'Only last-hit; never push the wave once it is sitting outside your tower.',
      'Keep a few more enemy minions than yours so the wave keeps drifting toward you.',
      'Ping your jungler when they walk past the middle of the lane to farm.',
    ],
    examples: { label: 'Great lanes to freeze against', champions: ['nasus', 'kayle', 'jax'] },
    scene: () =>
      laneScene()
      + wave(22, 39, 'ally', 2) + wave(26, 39, 'enemy', 4)
      + champ(12, 37, 'ally')
      + move(champ(70, 37, 'enemy'), [[0, 0], [-12, 0], [-24, 0], [-30, 0], [-30, 0], [-30, 0]], 3.6)
      + move(champ(95, 14, 'jungle'), [[0, 0], [0, 0], [-18, 8], [-34, 14], [-52, 21], [-52, 21]], 3.6)
      + show(skull(41, 28), [0, 0, 0, 0, 0, 1], 3.6),
  },
  {
    id: 'minion-aggro',
    category: 'micro',
    title: "DON'T TRADE IN THEIR WAVE",
    takeaway: 'THEIR MINIONS HIT YOU TOO',
    summary: 'Hitting an enemy champion makes every nearby enemy minion target you. Trading inside their wave means you take extra damage they do not.',
    tips: [
      'Trade when their wave is small or behind them, not when they stand in the middle of it.',
      'Walk out of minion range right after you hit them so the aggro drops.',
      'Early levels, minion damage decides close trades more than your runes do.',
    ],
    scene: () =>
      laneScene()
      + wave(70, 39, 'enemy', 2, 4) + champ(80, 37, 'enemy') + wave(88, 39, 'enemy', 2, 4)
      + move(champ(54, 37, 'ally'), [[0, 0], [10, 0], [10, 0], [10, 0], [0, 0]], 3)
      + show(burst(80, 36), [0, 1, 0, 0, 0], 3)
      + show(text('!', 70, 33, C.enemy) + text('!', 74, 30, C.enemy) + text('!', 88, 33, C.enemy) + text('!', 92, 30, C.enemy), [0, 0, 1, 1, 0], 3)
      + show(hpBar(62, 34, 9, 0.35, C.enemy), [0, 0, 0, 1, 0], 3)
      + text('AGGRO!', 52, 14, C.enemy),
  },
  {
    id: 'sidestep-skillshots',
    category: 'micro',
    title: "SIDESTEP, DON'T BACKSTEP",
    takeaway: 'MOVE SIDEWAYS OUT OF SKILLSHOTS',
    summary: 'Most skillshots fly in a straight line toward you. Walking backward keeps you in the path; one step to the side gets you out of it.',
    tips: [
      'Walk perpendicular to the throw: up or down the lane, never straight back.',
      'Stand slightly behind your own minions so they body-block linear spells.',
      'Watch the cast animation, not the projectile; you react faster.',
    ],
    examples: { label: 'Skillshots to sidestep', champions: ['jayce', 'illaoi', 'aatrox', 'mordekaiser'] },
    scene: () =>
      laneScene({ towers: false })
      + champ(100, 37, 'enemy')
      + move(rect(92, 40, 5, 1, C.enemy) + rect(91, 40, 1, 1, C.gold), [[0, 0], [-12, 0], [-24, 0], [-36, 0], [-48, 0], [-60, 0]], 3)
      + move(champ(40, 37, 'ally'), [[0, 0], [0, 0], [0, -9], [0, -9], [0, -9], [0, 0]], 3)
      + arrow(43, 33, 43, 22, C.green) + text('YES', 46, 20, C.green)
      + arrow(38, 55, 26, 55, C.enemy) + text('NO', 16, 53, C.enemy),
  },

  {
    id: 'level-2-first',
    category: 'micro',
    title: 'HIT LEVEL 2 FIRST',
    takeaway: 'FIRST TO LV2 WINS THE TRADE',
    summary: 'Whoever reaches level 2 first has a second ability before the other laner. That is the strongest all-in window of the early game.',
    tips: [
      'Hit the first wave hard enough to finish it a little before your opponent does.',
      'Track your XP bar: the moment you level, walk forward and trade with both spells.',
      'If they will hit level 2 first, step back until you level too.',
    ],
    scene: () =>
      laneScene()
      + wave(56, 39, 'ally', 2) + wave(66, 39, 'enemy', 2)
      + text('XP', 30, 14, C.gold) + rect(40, 15, 30, 3, '#00000088')
      + show(rect(40, 15, 12, 3, C.gold), [1, 0, 0, 0, 0], 3)
      + show(rect(40, 15, 22, 3, C.gold), [0, 1, 0, 0, 0], 3)
      + show(rect(40, 15, 30, 3, C.gold) + text('LV2!', 74, 14, C.gold), [0, 0, 1, 1, 1], 3)
      + move(champ(44, 37, 'ally'), [[0, 0], [0, 0], [0, 0], [16, 0], [8, 0]], 3)
      + champ(80, 37, 'enemy') + text('LV1', 78, 28, C.enemy)
      + show(burst(80, 36), [0, 0, 0, 1, 0], 3),
  },
  {
    id: 'level-5-ult-spike',
    category: 'micro',
    title: 'LEVEL 5: ULTS COME ONLINE',
    takeaway: 'HIT 5 FIRST, FIGHT FIRST',
    summary: 'In Wild Rift ultimates unlock at level 5. Being one level ahead at that moment means you have an ult and they do not.',
    tips: [
      'Count the XP race before level 5 the same way you do for level 2.',
      'If you hit 5 first, trade or all-in immediately; the window closes when they level.',
      'If they hit 5 first, respect their ult and back off until you have yours.',
    ],
    scene: () =>
      laneScene()
      + champ(52, 37, 'ally') + text('LV5', 50, 28, C.gold)
      + champ(78, 37, 'enemy') + text('LV4', 76, 28, C.enemy)
      + show(scaled(2, 74, 33, burst(0, 0, C.gold)), [0, 1, 1, 0], 2.4)
      + show(text('ULT!', 46, 14, C.gold), [0, 1, 1, 0], 2.4)
      + show(hpBar(76, 34, 9, 0.3, C.enemy), [0, 0, 1, 1], 2.4),
  },
  {
    id: 'punish-flash-down',
    category: 'micro',
    title: 'NO FLASH? GO IN',
    takeaway: 'TRACK FLASH. PUNISH THE WINDOW',
    summary: 'Flash has a long cooldown. Once your opponent uses it, they cannot escape an all-in or a gank until it comes back.',
    tips: [
      'When they Flash, note the time; it is down for minutes, not seconds.',
      'Tell your jungler: a gank on a laner without Flash almost always works.',
      'Play aggressive while it is down; play safe the moment it is back.',
    ],
    scene: () =>
      laneScene()
      + show(flashIcon(58, 14) + text('READY', 66, 14, C.ward), [1, 1, 0, 0, 0, 0], 3.6)
      + show(flashIcon(58, 14, true) + text('DOWN', 66, 14, C.enemy), [0, 0, 1, 1, 1, 1], 3.6)
      + move(champ(84, 37, 'enemy'), [[0, 0], [0, 0], [10, 0], [10, 0], [10, 0], [10, 0]], 3.6)
      + show(burst(84, 38, C.ward), [0, 1, 0, 0, 0, 0], 3.6)
      + move(champ(48, 37, 'ally'), [[0, 0], [0, 0], [0, 0], [16, 0], [34, 0], [34, 0]], 3.6)
      + show(skull(95, 28), [0, 0, 0, 0, 0, 1], 3.6),
  },
  {
    id: 'no-tower-trades',
    category: 'micro',
    title: "DON'T TRADE UNDER THEIR TOWER",
    takeaway: "TOWER SHOTS HURT. DON'T DIVE",
    summary: 'Early towers deal heavy damage and focus you the moment you hit an enemy champion near them. A trade you win in the open becomes a trade you lose under their tower.',
    tips: [
      'If they are standing under their tower, farm instead; they are already losing gold.',
      'Only dive with your jungler, with a kill guaranteed, and with a minion wave to take tower aggro.',
      'Hitting their champion under tower switches tower aggro to you immediately.',
    ],
    examples: { label: 'Safe-farm champions who sit under tower', champions: ['nasus', 'kayle', 'malphite'] },
    scene: () =>
      laneScene()
      + champ(110, 37, 'enemy')
      + move(champ(88, 37, 'ally') + hpBar(86, 34, 9, 1), [[0, 0], [10, 0], [10, 0], [10, 0], [0, 0]], 3)
      + show(burst(110, 36), [0, 1, 0, 0, 0], 3)
      + show(rect(103, 40, 17, 1, C.ward) + rect(101, 39, 2, 3, C.ward), [0, 0, 1, 1, 0], 3)
      + show(hpBar(96, 34, 9, 0.3, C.enemy), [0, 0, 0, 1, 0], 3)
      + text('TOWER AGGRO', 40, 14, C.enemy),
  },
  {
    id: 'hide-in-brush',
    category: 'micro',
    title: 'USE BRUSH TO HIDE',
    takeaway: 'UNSEEN = UNDODGEABLE',
    summary: 'Standing in brush hides your position. Your opponent cannot react to an attack or skillshot that starts from somewhere they cannot see.',
    tips: [
      'Walk into lane brush when the wave is in the middle so they lose track of you.',
      'Start trades or skillshots from the brush; they cannot pre-dodge what they cannot see.',
      'Never face-check enemy brush without vision; they can do the same to you.',
    ],
    scene: () =>
      laneScene({ brush: false })
      + rect(46, 49, 22, 10, C.brush)
      + show(champ(54, 50, 'ally'), [0, 0, 1, 0], 3)
      + show(rect(54, 50, 5, 7, C.ally + '55'), [1, 1, 0, 0], 3)
      + champ(76, 37, 'enemy') + show(text('?', 77, 28, C.enemy), [1, 1, 0, 0], 3)
      + show(rect(62, 44, 12, 1, C.gold) + burst(76, 36), [0, 0, 1, 1], 3),
  },

  // ---- Macro ---------------------------------------------------------------
  {
    id: 'crash-then-recall',
    category: 'macro',
    title: 'CRASH, THEN RECALL',
    takeaway: 'YOU LOSE NOTHING WHILE AWAY',
    summary: 'Recall right after your wave crashes into their tower. Their tower kills it slowly, so you miss almost no gold or XP while you shop.',
    tips: [
      'Build a big wave (slow push), crash it, then recall immediately.',
      'Recalling with the wave on your side means it bounces back and you lose minions under your tower.',
      'Same rule for roaming: crash first, then leave lane.',
    ],
    scene: () =>
      laneScene()
      + move(wave(96, 39, 'ally', 6, 4), [[0, 0], [6, 0], [12, 0], [16, 0], [16, 0], [16, 0]], 3.6)
      + show(burst(116, 37), [0, 0, 0, 1, 1, 0], 3.6)
      + show(champ(84, 37, 'ally'), [1, 1, 1, 0, 0, 0], 3.6)
      + show(rect(83, 30, 7, 15, C.ally + '66'), [0, 0, 1, 0, 0, 0], 3.6)
      + show(champ(12, 22, 'ally') + coin(12, 15) + text('SHOP', 20, 16, C.gold), [0, 0, 0, 1, 1, 1], 3.6),
  },
  {
    id: 'push-before-herald',
    category: 'macro',
    title: 'PUSH BEFORE OBJECTIVES',
    takeaway: 'WAVE PRIO = FIRST TO HERALD',
    summary: 'Before Rift Herald or a skirmish near your lane, push your wave. The laner who has to stay and catch the wave arrives late or not at all.',
    tips: [
      'Start shoving about 30 seconds before the objective spawns.',
      'Crash the wave, then walk to the river with your jungler.',
      'If you cannot push first, ping your jungler not to start the objective.',
    ],
    scene: () =>
      laneScene()
      + rect(60, 10, 8, 23, C.river) + herald(70, 15)
      + wave(112, 39, 'ally', 4) + champ(104, 37, 'enemy') + text('STUCK', 96, 28, C.enemy)
      + move(champ(90, 37, 'ally'), [[0, 0], [-10, 0], [-18, -8], [-28, -16], [-28, -16], [-28, -16]], 3.6)
      + show(burst(70, 14, C.purple), [0, 0, 0, 0, 1, 0], 3.6),
  },
  {
    id: 'ward-before-push',
    category: 'macro',
    title: 'WARD BEFORE YOU PUSH',
    takeaway: "NO WARD? DON'T PUSH PAST MID",
    summary: 'Pushing past the middle of the lane without vision is how most Baron laners die to ganks. A river ward shows the jungler coming in time to walk away.',
    tips: [
      'Ward the river brush before shoving past the middle of the lane.',
      'If their jungler was last seen on your side of the map, play it safe.',
      'When the ward spots them, back off immediately; do not finish the last hit.',
    ],
    scene: () =>
      laneScene()
      + show(ward(93, 15), [0, 1, 1, 1, 1, 1], 3.6)
      + show(champ(98, 14, 'enemy') + text('!', 104, 14, C.enemy), [0, 0, 1, 1, 1, 0], 3.6)
      + move(champ(90, 37, 'ally'), [[0, 0], [0, 0], [0, 0], [-16, 0], [-32, 0], [-50, 0]], 3.6),
  },
  {
    id: 'split-push',
    category: 'macro',
    title: 'SPLIT WHILE THEY GROUP',
    takeaway: 'MAKE TWO OF THEM COME TO YOU',
    summary: 'Strong side-laners create pressure by pushing a lane alone while their team plays safe elsewhere. If two enemies come to stop you, your team fights 4v3.',
    tips: [
      'Only split when your team can avoid fighting without you.',
      'Keep vision in the river and jungle entrances near your lane so you see who is coming.',
      'When two or more show up, walk away; you have already done your job.',
    ],
    examples: { label: 'Strong split-pushers', champions: ['tryndamere', 'jax', 'fiora', 'nasus', 'camille'] },
    scene: () => {
      let out = rect(42, 12, 46, 47, C.grassDark);
      out += rect(42, 12, 3, 47, C.lane) + rect(42, 12, 46, 3, C.lane);
      out += rect(85, 12, 3, 47, C.lane) + rect(42, 56, 46, 3, C.lane);
      for (let i = 0; i < 20; i++) out += rect(45 + i * 2, 53 - i * 2, 2, 2, C.lane);
      out += rect(76, 11, 3, 5, C.enemy);
      out += move(rect(68, 12, 3, 3, C.ally), [[0, 0], [3, 0], [5, 0], [5, 0]], 3) + show(burst(76, 8), [0, 0, 1, 0], 3);
      out += rect(78, 48, 3, 3, C.enemy) + rect(74, 52, 3, 3, C.enemy);
      out += move(rect(80, 44, 3, 3, C.enemy), [[0, 0], [0, -10], [0, -20], [0, -28]], 3);
      out += move(rect(70, 50, 3, 3, C.enemy), [[0, 0], [2, -10], [4, -20], [6, -30]], 3);
      out += text('YOU: TOP', 92, 16, C.ally) + text('THEY SEND', 92, 30, C.enemy) + text('TWO', 92, 36, C.enemy);
      out += text('TEAM:', 4, 40, C.ally) + text('4V3', 4, 46, C.ally);
      return out;
    },
  },

  {
    id: 'take-plates',
    category: 'macro',
    title: 'TAKE TOWER PLATES',
    takeaway: 'EARLY PLATES ARE FREE GOLD',
    summary: 'Early in the game, each tower plate you break gives gold. When your opponent recalls or dies, your wave plus you can take plates for a big gold lead.',
    tips: [
      'Opponent recalled or dead? Push the wave into their tower and hit plates.',
      'Bring a minion wave so the tower targets minions, not you.',
      'Plates stop paying out after the early game, so use these windows while they last.',
    ],
    scene: () =>
      laneScene()
      + wave(112, 39, 'ally', 3) + champ(104, 37, 'ally')
      + show(burst(120, 36), [1, 0, 1, 0], 2)
      + move(coin(118, 28), [[0, 0], [-2, -4], [-4, -8], [-6, -12]], 2)
      + move(coin(122, 26), [[0, 0], [2, -4], [4, -8], [6, -12]], 2, 1)
      + text('+GOLD', 70, 14, C.gold)
      + text('ENEMY: RECALLED', 4, 52, C.muted),
  },
  {
    id: 'jungler-seen-elsewhere',
    category: 'macro',
    title: 'JUNGLER SEEN BOT? PUSH TOP',
    takeaway: "USE THEIR JUNGLER'S POSITION",
    summary: 'When the enemy jungler shows up on the other side of the map, they cannot gank you for a while. That is your window to push, trade hard, or take plates.',
    tips: [
      'Watch the minimap: a jungler seen bot or mid cannot reach Baron lane quickly.',
      'Use the window to shove, trade aggressively, or take plates.',
      'When they disappear again, assume they are walking to you and back off.',
    ],
    scene: () => {
      let out = rect(42, 12, 46, 47, C.grassDark);
      out += rect(42, 12, 3, 47, C.lane) + rect(42, 12, 46, 3, C.lane);
      out += rect(85, 12, 3, 47, C.lane) + rect(42, 56, 46, 3, C.lane);
      for (let i = 0; i < 20; i++) out += rect(45 + i * 2, 53 - i * 2, 2, 2, C.lane);
      out += show(rect(78, 50, 3, 3, C.enemy) + text('!', 82, 44, C.enemy), [1, 0], 1);
      out += move(rect(60, 12, 3, 3, C.ally), [[0, 0], [4, 0], [8, 0], [12, 0]], 3);
      out += text('JUNGLER:', 92, 46, C.enemy) + text('BOT', 92, 52, C.enemy);
      out += text('YOU:', 4, 16, C.ally) + text('PUSH', 4, 22, C.ally);
      return out;
    },
  },
  {
    id: 'shove-before-baron',
    category: 'macro',
    title: 'SHOVE BEFORE BARON',
    takeaway: 'YOUR WAVE BUYS THE BARON',
    summary: 'Baron sits next to your lane. Before your team starts it, push your wave so the enemy laner is stuck clearing minions instead of contesting.',
    tips: [
      'When your team pings Baron, crash your wave first, then walk to the pit.',
      'A wave pushing into their tower forces someone to leave the Baron fight to defend.',
      'If your wave is pushing toward your tower, Baron is a much riskier call.',
    ],
    scene: () =>
      laneScene()
      + rect(56, 12, 10, 20, C.river) + scaled(2, 34, 14, baron(0, 0))
      + wave(112, 39, 'ally', 4) + champ(104, 37, 'enemy') + text('STUCK', 96, 28, C.enemy)
      + move(champ(86, 37, 'ally'), [[0, 0], [-12, 0], [-24, -8], [-32, -14], [-32, -14]], 3)
      + show(burst(44, 18, C.purple), [0, 0, 0, 1, 0], 3),
  },

  // ---- Itemization ---------------------------------------------------------
  {
    id: 'first-item-or-boots',
    category: 'items',
    title: 'FIRST ITEM OR BOOTS?',
    takeaway: 'SPIKE FIRST, THEN BOOTS',
    summary: 'Most champions get their biggest early power spike from finishing their first core item, so the default is to build it first and buy boots right after. Buy boots earlier when movement matters more than damage.',
    tips: [
      'Default: finish your first core item, then boots. That item is your first big power spike.',
      'Boots early if your lane is full of skillshots to dodge, or a ranged champion keeps kiting you.',
      'Boots early on roaming roles (jungle, mid, support), where reaching fights first matters most.',
    ],
    scene: () =>
      text('DEFAULT', 4, 18, C.white)
      + scaled(2, 50, 14, sword(0, 0, C.gold)) + text('1', 52, 27, C.muted)
      + arrow(64, 19, 78, 19, C.gold)
      + scaled(2, 84, 14, boot(0, 0)) + text('2', 86, 27, C.muted)
      + rect(4, 33, 120, 1, '#26324d')
      + text('DODGE/ROAM', 4, 42, C.white)
      + scaled(2, 50, 38, boot(0, 0)) + text('1', 52, 51, C.muted)
      + arrow(64, 43, 78, 43, C.ward)
      + scaled(2, 84, 38, sword(0, 0, C.gold)) + text('2', 86, 51, C.muted)
      + show(rect(2, 25, 100, 1, C.gold), [1, 0], 2.4)
      + show(rect(2, 49, 100, 1, C.ward), [0, 1], 2.4),
  },
  {
    id: 'enchant-boots',
    category: 'items',
    title: 'ENCHANT BOOTS TO COUNTER',
    takeaway: 'STASIS: BURST. QUICKSILVER: CC',
    summary: 'In Wild Rift, boots can be upgraded with an enchant that adds an active effect. Pick the one that answers the enemy\'s biggest threat to you, usually once your core items are done.',
    tips: [
      'Stasis: a few seconds of invulnerability, but you cannot act. Use it to survive assassins and big burst.',
      'Quicksilver: removes crowd control on you. Take it against stuns and knock-ups that lock you down.',
      'Both have long cooldowns; save the active for the moment that would otherwise kill you.',
    ],
    scene: () =>
      text('STASIS', 14, 14, C.ward)
      + scaled(2, 22, 26, champ(0, 0, 'ally'))
      + show(rect(21, 25, 12, 16, C.ward + '99'), [0, 1, 1, 0], 3)
      + show(burst(36, 30, C.enemy) + burst(14, 34, C.enemy), [0, 1, 1, 0], 3)
      + show(text('SAFE', 18, 48, C.green), [0, 0, 1, 1], 3)
      + rect(63, 14, 1, 40, '#26324d')
      + text('QUICKSILVER', 74, 14, C.white)
      + scaled(2, 90, 26, champ(0, 0, 'ally'))
      + show(stun(92, 18), [1, 1, 0, 0], 3)
      + show(text('FREE', 88, 48, C.green), [0, 0, 1, 1], 3),
  },
  {
    id: 'buy-what-they-deal',
    category: 'items',
    title: 'BUY WHAT THEY DEAL',
    takeaway: 'AD > ARMOR. AP > MAGIC RESIST',
    summary: 'Check whether your lane opponent deals physical or magic damage before your first back, and buy the matching resistance.',
    tips: [
      'Physical (AD): Darius, Jax, Renekton, Tryndamere. Buy armor.',
      'Magic (AP): Kennen, Rumble, Gragas, Teemo, Mordekaiser. Buy magic resist.',
      'Mixed or true damage? Health is often better than either resistance.',
    ],
    scene: () =>
      text('AD', 14, 15, C.enemy)
      + scaled(3, 10, 24, sword(0, 0, C.enemy))
      + show(arrow(30, 31, 42, 31, C.gold), [1, 0], 1.2)
      + scaled(3, 46, 22, shield(0, 0, C.stone)) + text('ARMOR', 42, 44, C.stone)
      + rect(63, 14, 1, 40, '#26324d')
      + text('AP', 76, 15, C.purple)
      + scaled(3, 72, 24, orb(0, 0))
      + show(arrow(88, 31, 100, 31, C.gold), [0, 1], 1.2)
      + scaled(3, 104, 22, shield(0, 0, C.purple)) + text('MR', 108, 44, C.purple),
  },
  {
    id: 'anti-heal',
    category: 'items',
    title: 'VS HEALERS: BUY ANTI-HEAL',
    takeaway: 'BUY IT EARLY, NOT LAST',
    summary: 'Some champions win by out-healing your damage. When you face one, buy an anti-heal item to cut their healing, and buy it early as a component rather than as your last item.',
    tips: [
      'Buy the cheap anti-heal component on your first or second back, not as your final item.',
      'It matters most against champions whose kit heals in every trade.',
      'Apply it right before their big heal (Aatrox R, Mundo R, Volibear W).',
    ],
    examples: { label: 'Big healers in Baron lane', champions: ['aatrox', 'drmundo', 'volibear', 'darius', 'illaoi'] },
    scene: () =>
      scaled(3, 18, 20, champ(0, 0, 'ally'))
      + scaled(3, 92, 20, champ(0, 0, 'enemy'))
      + show(heart(96, 13) + text('+', 103, 13, C.heal), [1, 1, 0, 0], 3)
      + show(arrow(38, 32, 86, 32, C.enemy), [0, 1, 1, 0], 3)
      + show(heart(96, 13, C.enemy) + text('X', 103, 13, C.enemy) + text('HEAL CUT', 80, 50, C.enemy), [0, 0, 1, 1], 3),
  },
  {
    id: 'true-damage-buy-health',
    category: 'items',
    title: 'TRUE DAMAGE IGNORES ARMOR',
    takeaway: 'VS %HP + TRUE DMG: BUY HEALTH',
    summary: 'Champions with true or %HP damage go straight through resistances. Against them, raw health and a sustain plan beat stacking armor.',
    tips: [
      'Fiora vitals, Vayne W, Gwen Q centre and Camille Q2 ignore armor.',
      'Health items still help; armor alone does not.',
      'Short trades are your friend: true damage wins the long ones.',
    ],
    examples: { label: 'True or %HP damage', champions: ['fiora', 'vayne', 'gwen', 'camille'] },
    scene: () =>
      scaled(3, 18, 20, champ(0, 0, 'ally'))
      + scaled(2, 40, 26, shield(0, 0, C.stone))
      + move(rect(100, 34, 8, 2, C.white) + rect(99, 33, 1, 4, C.white), [[0, 0], [-20, 0], [-40, 0], [-62, 0], [-62, 0]], 3)
      + show(burst(26, 30, C.white), [0, 0, 0, 1, 0], 3)
      + show(scaled(2, 80, 40, heart(0, 0, C.heal)) + text('+HP', 94, 44, C.heal), [0, 0, 0, 1, 1], 3),
  },
  {
    id: 'first-back-component',
    category: 'items',
    title: 'FIRST BACK: BUY THE COUNTER',
    takeaway: 'SMALL ARMOR > HALF AN ITEM',
    summary: 'Against a lane bully, a cheap defensive component on your first back often wins lane more than saving up for your damage item.',
    tips: [
      'Losing trades early? Spend your first back on the resistance that blocks their damage.',
      'Finish the damage item on the next back, once lane is stable.',
      'Ahead in lane? Rush damage instead and press the lead.',
    ],
    scene: () =>
      move(coin(14, 26) + coin(20, 30) + coin(14, 34), [[0, 0], [12, 0], [24, 0], [24, 0]], 3)
      + arrow(44, 32, 56, 32, C.gold)
      + show(shield(62, 28, C.stone) + text('BACK 1', 54, 40, C.stone), [0, 0, 1, 1], 3)
      + arrow(74, 32, 86, 32, C.muted)
      + show(scaled(2, 92, 24, shield(0, 0, C.stone)) + text('LATER', 92, 40, C.muted), [0, 0, 0, 1], 3),
  },

  {
    id: 'ahead-or-behind',
    category: 'items',
    title: 'FAR AHEAD? PROTECT THE LEAD',
    takeaway: "THEY'LL FOCUS YOU. BUY DEFENSE",
    summary: 'A big lead makes you the enemy team\'s main target and puts a shutdown bounty on your head. Once your core damage is done, a defensive item keeps you alive, and dying once can hand the whole lead back.',
    tips: [
      'Slightly ahead: finish your core damage item first so the lead turns into kill pressure.',
      'Far ahead: expect to be focused. Add a defensive item that answers their biggest threat to you.',
      'Behind: buy cheap defensive components to survive and farm, not damage you cannot use safely.',
    ],
    scene: () =>
      text('AHEAD', 12, 14, C.green)
      + scaled(3, 16, 22, sword(0, 0, C.gold)) + text('CORE DMG', 8, 42, C.gold)
      + rect(50, 14, 1, 40, '#26324d')
      + text('FAR AHEAD', 74, 14, C.green)
      + champ(84, 30, 'ally')
      + show(arrow(70, 33, 81, 33, C.enemy) + arrow(102, 33, 91, 33, C.enemy) + arrow(86, 52, 86, 39, C.enemy), [1, 1, 0, 0], 3)
      + show(text('FOCUSED', 72, 22, C.enemy), [1, 1, 0, 0], 3)
      + show(scaled(2, 79, 26, shield(0, 0, C.stone)) + text('DEFENSE', 72, 50, C.stone), [0, 0, 1, 1], 3),
  },

  // ---- Class counters ------------------------------------------------------
  {
    id: 'ranged-kites-juggernauts',
    category: 'counters',
    title: 'RANGED KITES JUGGERNAUTS',
    takeaway: 'NO DASH = CANNOT CATCH YOU',
    summary: 'Juggernauts like Darius and Mordekaiser hit hard but have little mobility. Ranged champions win by hitting them, then stepping back before they arrive.',
    tips: [
      'Auto, then step back: keep them at the edge of your range.',
      'Save your escape for their one gap closer (Darius E, Mordekaiser E).',
      'Juggernauts get stronger in long fights; never let them catch you without an escape.',
    ],
    examples: { label: 'Juggernauts that get kited', champions: ['darius', 'mordekaiser', 'urgot', 'illaoi', 'garen'] },
    scene: () =>
      laneScene({ towers: false })
      + move(champ(52, 37, 'enemy') + hpBar(50, 34, 9, 1), [[0, 0], [3, 0], [6, 0], [9, 0], [12, 0], [15, 0]], 3)
      + move(champ(80, 37, 'ally'), [[0, 0], [0, 0], [6, 0], [6, 0], [12, 0], [12, 0]], 3)
      + show(rect(66, 40, 3, 1, C.gold), [1, 0, 1, 0, 1, 0], 3)
      + text('RANGE', 64, 52, C.gold) + rect(60, 50, 22, 1, C.gold),
  },
  {
    id: 'duelists-shred-tanks',
    category: 'counters',
    title: 'DUELISTS SHRED TANKS',
    takeaway: '%HP DAMAGE LOVES BIG HEALTH',
    summary: 'Tanks stack health and resistances, which is exactly what %HP and true damage punish. Duelists like Fiora and Vayne turn tankiness into a liability.',
    tips: [
      'Tanks win lanes by farming safely; push them under tower to deny that.',
      'Trade constantly: every hit is a % of their health.',
      'Tanks get strong in teamfights; win the side lane before that matters.',
    ],
    examples: { label: 'Tanks that duelists punish', champions: ['malphite', 'ornn', 'ksante', 'drmundo', 'singed'] },
    scene: () =>
      scaled(4, 82, 18, champ(0, 0, 'enemy'))
      + show(hpBar(76, 14, 32, 1), [1, 0, 0, 0], 3)
      + show(hpBar(76, 14, 32, 0.75), [0, 1, 0, 0], 3)
      + show(hpBar(76, 14, 32, 0.5), [0, 0, 1, 0], 3)
      + show(hpBar(76, 14, 32, 0.25, C.enemy), [0, 0, 0, 1], 3)
      + champ(56, 34, 'ally')
      + show(burst(78, 30, C.white), [1, 0, 1, 0], 1.5)
      + text('%HP', 50, 50, C.white),
  },
  {
    id: 'tanks-absorb-burst',
    category: 'counters',
    title: 'TANKS ABSORB BURST',
    takeaway: "BURST FALLS OFF. ARMOR DOESN'T",
    summary: 'Burst champions like Pantheon and Riven win with big early combos. Tanks with early armor survive the combo and win the longer game.',
    tips: [
      'Buy armor early; one cheap component halves their combo.',
      'Do not fight when their key burst spell is up; farm and wait.',
      'You outscale them; a quiet lane is a winning lane.',
    ],
    examples: { label: 'Burst champions tanks can absorb', champions: ['pantheon', 'riven', 'renekton', 'jayce'] },
    scene: () =>
      scaled(4, 30, 18, champ(0, 0, 'ally'))
      + scaled(2, 52, 24, shield(0, 0, C.stone))
      + hpBar(24, 14, 32, 1)
      + show(hpBar(24, 14, 32, 0.9), [0, 0, 1, 1], 3)
      + champ(92, 34, 'enemy')
      + show(scaled(2, 64, 26, burst(0, 0, C.enemy)), [0, 1, 0, 0], 3)
      + show(text('TINY DMG', 18, 50, C.green), [0, 0, 1, 1], 3),
  },
  {
    id: 'bullies-vs-scalers',
    category: 'counters',
    title: 'BULLIES MUST WIN EARLY',
    takeaway: 'END EARLY OR GET OUTSCALED',
    summary: 'Lane bullies are strongest at levels 1–5; scaling champions are strongest with items. Know which one you are and play to your window.',
    tips: [
      'Bully? Trade every cooldown, take plates, and turn your lead into objectives.',
      'Scaler? Concede contested creeps, farm safely, and avoid early all-ins.',
      'The bully loses if the game goes long with no lead to show for it.',
    ],
    examples: { label: 'Scalers to bully early', champions: ['kayle', 'nasus', 'gwen', 'jax', 'yone'] },
    scene: () =>
      rect(10, 40, 54, 4, C.enemy) + rect(64, 40, 54, 4, C.ally)
      + text('EARLY', 14, 47, C.enemy) + text('LATE', 100, 47, C.ally)
      + move(rect(12, 37, 2, 10, C.white), [[0, 0], [26, 0], [52, 0], [78, 0], [104, 0]], 4)
      + show(scaled(3, 20, 14, champ(0, 0, 'enemy')) + text('BULLY', 40, 22, C.enemy), [1, 1, 0, 0, 0], 4)
      + show(scaled(3, 94, 14, champ(0, 0, 'ally')) + text('SCALER', 68, 22, C.ally), [0, 0, 0, 1, 1], 4),
  },
  {
    id: 'cc-the-dash',
    category: 'counters',
    title: 'SAVE CC FOR THEIR DASH',
    takeaway: 'STUN THE DIVE, NOT THE WALK',
    summary: 'Dash-heavy fighters like Irelia, Camille and Riven win by dashing onto you. Holding your stun or knock-up for the moment they commit stops the whole combo.',
    tips: [
      'Do not waste your CC poking; keep it for when they commit to an engage.',
      'Hit them as their dash lands, when they cannot react.',
      'Once your CC is down, back off until it comes back.',
    ],
    examples: { label: 'Dash-reliant fighters', champions: ['irelia', 'camille', 'riven', 'yone', 'renekton'] },
    scene: () =>
      laneScene({ towers: false })
      + champ(44, 37, 'ally')
      + move(champ(92, 37, 'enemy'), [[0, 0], [-16, 0], [-32, 0], [-32, 0], [-32, 0]], 2.5)
      + show(rect(66, 40, 18, 1, C.enemy + '88'), [0, 1, 0, 0, 0], 2.5)
      + show(stun(61, 29), [0, 0, 1, 1, 0], 2.5)
      + show(text('STUNNED', 50, 14, C.ward), [0, 0, 1, 1, 0], 2.5),
  },


  // ---- Support (Dragon lane) -----------------------------------------------
  {
    id: 'peel-for-carry',
    category: 'support',
    title: 'PEEL FOR YOUR CARRY',
    takeaway: 'PROTECT THE ONE WHO SCALES',
    summary: "Your ADC deals most of your team's damage later on. When an enemy diver jumps on them, your shields, knock-backs and stuns are worth more on them than on anyone else.",
    tips: [
      'Stay close enough to your ADC that your peel spell can reach them.',
      'Hold your knock-back or stun until the diver commits, not before.',
      "Peel tools to look for: Janna's tornado, Braum's shield, Lulu's polymorph.",
    ],
    scene: () =>
      laneScene()
      + champ(30, 37, 'ally') + text('ADC', 28, 50, C.ally)
      + champ(44, 37, 'allySup') + text('SUP', 42, 50, C.allySup)
      + move(champ(84, 37, 'enemy'), [[0, 0], [-16, 0], [-48, 0], [-48, 0], [-30, 0], [-14, 0]], 3.6)
      + show(shield(30, 27, C.allySup), [0, 0, 1, 1, 0, 0], 3.6)
      + show(burst(38, 36, C.allySup), [0, 0, 0, 1, 0, 0], 3.6)
      + show(text('PEEL!', 52, 14, C.allySup), [0, 0, 1, 1, 1, 0], 3.6),
  },
  {
    id: 'engage-on-mistake',
    category: 'support',
    title: 'ENGAGE ON THEIR MISTAKE',
    takeaway: 'WAIT FOR THE MISSTEP, THEN GO',
    summary: 'Engage supports like Leona, Alistar and Nautilus win lane by catching an enemy who steps too far forward. Engaging on a player who is already in position just gets you killed.',
    tips: [
      'Wait for their ADC to walk past their own minions to last-hit.',
      "Engage when your ADC is close enough to follow up; an engage your ADC can't follow is wasted.",
      'Back off if their support is holding a knock-back or disengage spell.',
    ],
    scene: () =>
      laneScene()
      + wave(62, 39, 'ally', 2) + wave(76, 39, 'enemy', 2)
      + champ(38, 37, 'ally') + champ(50, 37, 'allySup') + text('SUP', 48, 50, C.allySup)
      + champ(104, 37, 'enemySup')
      + move(champ(94, 37, 'enemy'), [[0, 0], [-14, 0], [-28, 0], [-28, 0], [-28, 0]], 3)
      + show(rect(55, 40, 11, 1, C.allySup), [0, 0, 1, 0, 0], 3)
      + show(stun(66, 29), [0, 0, 0, 1, 1], 3)
      + show(text('MISSTEP', 46, 14, C.enemy), [0, 1, 1, 0, 0], 3),
  },
  {
    id: 'minions-block-hooks',
    category: 'support',
    title: 'STAY BEHIND YOUR MINIONS',
    takeaway: 'MINIONS BLOCK HOOKS',
    summary: 'Hooks from Thresh, Blitzcrank and Nautilus hit the first unit in their path. Standing behind your minions makes them land on a minion instead of you.',
    tips: [
      'Keep a minion between you and their hook support at all times.',
      'When your wave dies, step back until the next one arrives.',
      'Playing the hook support? Look for gaps in their wave, not long-range guesses.',
    ],
    scene: () =>
      laneScene()
      + champ(28, 37, 'ally') + champ(40, 37, 'allySup')
      + wave(58, 39, 'ally', 3)
      + champ(100, 37, 'enemySup')
      + move(rect(92, 40, 5, 1, C.enemySup), [[0, 0], [-12, 0], [-24, 0], [-33, 0], [-33, 0]], 2.5)
      + show(burst(57, 37, C.enemySup), [0, 0, 0, 1, 0], 2.5)
      + show(text('BLOCKED', 50, 14, C.green), [0, 0, 0, 1, 1], 2.5),
  },
  {
    id: 'ward-before-dragon',
    category: 'support',
    title: 'WARD BEFORE DRAGON',
    takeaway: 'VISION WINS DRAGON FIGHTS',
    summary: 'Dragon fights are won by the team that sees the other coming. Ward the river and the pit entrance before Dragon spawns, then group up.',
    tips: [
      'Ward the river and Dragon pit entrances about a minute before it spawns.',
      'Clear their wards near the pit so they have to fight blind.',
      'Walk into unwarded river with your ADC and jungler, never alone.',
    ],
    scene: () =>
      laneScene({ brush: false })
      + rect(58, 10, 12, 23, C.river) + scaled(2, 59, 14, dragon(0, 0))
      + show(ward(46, 16), [0, 1, 1, 1, 1], 3)
      + show(ward(78, 18), [0, 0, 1, 1, 1], 3)
      + show(ward(62, 27), [0, 0, 0, 1, 1], 3)
      + champ(36, 37, 'ally') + champ(48, 37, 'allySup')
      + text('VISION', 86, 24, C.ward),
  },
  {
    id: 'roam-after-crash',
    category: 'support',
    title: 'CRASH, THEN ROAM MID',
    takeaway: 'NEVER LEAVE YOUR ADC 1V2',
    summary: 'When the wave is crashing into their tower, a support can walk to mid or help the jungler without leaving the ADC in danger.',
    tips: [
      "Crash the wave first so your ADC isn't left facing a big enemy wave alone.",
      "Tell your ADC you're leaving so they play safe near tower.",
      'Come back when the next wave arrives; long roams leave your ADC exposed.',
    ],
    scene: () => {
      let out = rect(42, 12, 46, 47, C.grassDark);
      out += rect(42, 12, 3, 47, C.lane) + rect(42, 12, 46, 3, C.lane);
      out += rect(85, 12, 3, 47, C.lane) + rect(42, 56, 46, 3, C.lane);
      for (let i = 0; i < 20; i++) out += rect(45 + i * 2, 53 - i * 2, 2, 2, C.lane);
      out += rect(85, 30, 3, 5, C.enemy) + show(burst(84, 24), [1, 1, 0, 0], 3);
      out += rect(84, 50, 3, 3, C.ally);
      out += move(rect(84, 44, 3, 3, C.allySup), [[0, 0], [-8, -2], [-14, -6], [-18, -10]], 3);
      out += text('1. CRASH', 2, 20, C.white) + show(text('2. ROAM', 2, 28, C.allySup), [0, 0, 1, 1], 3);
      out += text('ADC:', 92, 46, C.ally) + text('SAFE', 92, 52, C.ally);
      return out;
    },
  },
  {
    id: 'zone-off-cs',
    category: 'support',
    title: 'ZONE THEM OFF CS',
    takeaway: "THREATEN, DON'T OVERCOMMIT",
    summary: 'Every time their ADC walks up to last-hit, a support stepping forward threatens a trade. Often they back off and miss the creep entirely.',
    tips: [
      'Step slightly ahead of your ADC when their ADC walks up to last-hit.',
      "Threaten, don't commit: walk forward, then step back if they retreat.",
      "Watch their support; zoning only works if you aren't walking into their engage.",
    ],
    scene: () =>
      laneScene()
      + wave(58, 39, 'ally', 2)
      + show(minion(66, 40, 'ally') + hpBar(65, 37, 5, 0.15, C.enemy), [1, 1, 1, 0], 3)
      + champ(34, 37, 'ally')
      + move(champ(48, 37, 'allySup'), [[0, 0], [0, 0], [12, 0], [0, 0]], 3)
      + move(champ(92, 37, 'enemy'), [[0, 0], [-12, 0], [0, 0], [0, 0]], 3)
      + show(text('THREAT', 46, 14, C.allySup), [0, 0, 1, 0], 3)
      + show(text('-CS', 66, 28, C.enemy), [0, 0, 0, 1], 3),
  },
  {
    id: 'leave-last-hits',
    category: 'support',
    title: 'LEAVE LAST HITS TO YOUR ADC',
    takeaway: 'THEIR GOLD WINS YOUR GAME',
    summary: 'Your ADC needs gold to carry. Supports should avoid taking minion kills, except when the ADC is not there to take them.',
    tips: [
      'Do not hit low-HP minions when your ADC is nearby.',
      'If your ADC recalls or dies, take the wave rather than letting it die to tower.',
      'Your job is vision, protection and pressure; their job is farming.',
    ],
    scene: () =>
      laneScene()
      + show(minion(62, 40, 'enemy') + hpBar(61, 37, 5, 0.15, C.enemy), [1, 1, 0, 0], 3)
      + champ(34, 37, 'ally') + text('ADC', 32, 50, C.ally)
      + champ(50, 37, 'allySup') + text('SUP', 48, 50, C.allySup)
      + show(arrow(56, 40, 60, 40, C.allySup) + text('X', 57, 30, C.enemy), [1, 0, 0, 0], 3)
      + show(arrow(40, 44, 60, 44, C.ally), [0, 1, 0, 0], 3)
      + show(coin(32, 28) + text('+GOLD', 38, 28, C.gold), [0, 0, 1, 1], 3),
  },
  {
    id: 'recall-together',
    category: 'support',
    title: 'RECALL TOGETHER',
    takeaway: "DON'T LEAVE YOUR ADC 1V2",
    summary: 'If the support recalls alone, the ADC is left alone against two enemies and is easy to dive. Crash the wave and recall at the same time.',
    tips: [
      'Crash the wave together, then recall together.',
      'If one of you has to stay, play near tower and avoid trades.',
      'Walk back to lane together so you never take a 2v2 trade alone.',
    ],
    scene: () => {
      const strip = (y: number, label: string, fill: string) => text(label, 2, y, fill) + rect(0, y + 7, W, 9, C.lane);
      let out = rect(0, 10, W, 51, C.grass) + strip(12, 'TOGETHER', C.green) + strip(36, 'ALONE', C.enemy);
      out += champ(40, 20, 'ally') + champ(50, 20, 'allySup');
      out += show(rect(39, 18, 7, 10, C.ally + '55') + rect(49, 18, 7, 10, C.allySup + '55'), [0, 1, 1, 0], 3);
      out += show(text('SAFE', 66, 21, C.green), [0, 0, 1, 1], 3);
      out += champ(40, 44, 'ally') + show(champ(50, 44, 'allySup'), [1, 0, 0, 0], 3);
      out += move(champ(84, 44, 'enemy') + champ(94, 44, 'enemySup'), [[0, 0], [0, 0], [-24, 0], [-30, 0]], 3);
      out += show(skull(41, 37), [0, 0, 0, 1], 3);
      return out;
    },
  },
  {
    id: 'support-triangle',
    category: 'support',
    title: 'ENGAGE > POKE > ENCHANTER',
    takeaway: 'COUNTER-PICK THEIR SUPPORT',
    summary: 'Most supports fall into three types. Engage supports dive poke mages, poke mages out-damage enchanter heals from range, and enchanters peel and shield to shut down engage.',
    tips: [
      'Engage (Leona, Alistar, Nautilus) beats poke: get on top of fragile mages.',
      'Poke (Lux, Seraphine, Karma) beats enchanters: out-damage their heals from range.',
      'Enchanters (Janna, Lulu, Nami) beat engage: shield, knock back and peel the dive.',
    ],
    scene: () =>
      text('ENGAGE', 6, 26, C.enemySup) + text('POKE', 54, 26, C.purple) + text('ENCHANTER', 88, 26, C.allySup)
      + arrow(31, 28, 50, 28, C.white) + arrow(71, 28, 84, 28, C.white)
      + rect(105, 33, 1, 15, C.white) + rect(17, 48, 89, 1, C.white) + arrow(17, 48, 17, 34, C.white)
      + text('EACH BEATS THE NEXT', 26, 52, C.muted)
      + show(text('ENGAGE', 6, 26, C.white), [1, 0, 0], 3)
      + show(text('POKE', 54, 26, C.white), [0, 1, 0], 3)
      + show(text('ENCHANTER', 88, 26, C.white), [0, 0, 1], 3),
  },

  // ---- Jungle ----------------------------------------------------------------
  {
    id: 'plan-first-clear',
    category: 'jungle',
    title: 'PLAN YOUR FIRST CLEAR',
    takeaway: 'END YOUR CLEAR NEAR A LANE',
    summary: 'Your first clear decides where you can be for your first gank. Plan it so you finish next to the lane you want to gank, not on the far side of the map.',
    tips: [
      'Start on the side opposite to where you want to finish.',
      'Pick the lane to finish near: one with CC, an overextended enemy, or a strong early laner.',
      'If the lane is not set up when you arrive, keep farming instead of forcing it.',
    ],
    scene: () => {
      const { out, at } = miniMap();
      return out
        + camp(...at(10, 20), C.ally) + camp(...at(8, 28)) + camp(...at(14, 34)) + camp(...at(22, 38), C.dragon) + camp(...at(30, 40))
        + move(dot(...at(9, 19), C.purple), [[0, 0], [-2, 8], [4, 14], [12, 18], [20, 20], [26, 22]], 3.6)
        + show(burst(...at(34, 42), C.pink), [0, 0, 0, 0, 0, 1], 3.6)
        + text('BUFF', 4, 20, C.ally) + text('CAMPS', 4, 28, C.green) + text('GANK!', 4, 36, C.pink);
    },
  },
  {
    id: 'gank-overextended',
    category: 'jungle',
    title: 'GANK OVEREXTENDED LANES',
    takeaway: 'PUSHED + NO FLASH = GO',
    summary: 'The best gank target is a laner who has pushed toward your tower and has no Flash. They are far from safety with no escape.',
    tips: [
      'Look for enemies past the middle of the lane, especially against an ally who is freezing.',
      'Check their summoner spells: no Flash makes almost any gank work.',
      'Skip lanes pushed into the enemy tower; you will waste time and risk a dive.',
    ],
    scene: () =>
      laneScene()
      + champ(12, 37, 'ally') + wave(26, 39, 'ally', 2) + wave(30, 39, 'enemy', 3)
      + champ(46, 37, 'enemy')
      + flashIcon(38, 14, true) + text('NO FLASH', 46, 14, C.enemy)
      + move(champ(62, 20, 'jungle'), [[0, 0], [0, 0], [-4, 8], [-8, 16], [-8, 16]], 3)
      + show(stun(46, 28), [0, 0, 0, 1, 0], 3)
      + show(skull(46, 28), [0, 0, 0, 0, 1], 3),
  },
  {
    id: 'gank-from-behind',
    category: 'jungle',
    title: 'GANK FROM BEHIND',
    takeaway: 'CUT OFF THEIR WAY HOME',
    summary: 'Ganks fail when the enemy simply walks back to their tower. Come in from their side of the lane so running away means running into you.',
    tips: [
      'Path through river or the enemy-side brush so you arrive between them and their tower.',
      'Ask your laner to hold their CC until you are in position.',
      'Use lane brush and river entrances to approach; do not walk straight up the lane.',
    ],
    scene: () =>
      laneScene()
      + move(champ(30, 37, 'ally'), [[0, 0], [0, 0], [10, 0], [20, 0], [28, 0]], 3)
      + move(champ(64, 37, 'enemy'), [[0, 0], [0, 0], [8, 0], [8, 0], [6, 0]], 3)
      + move(champ(108, 50, 'jungle'), [[0, 0], [-12, -6], [-24, -13], [-28, -13], [-28, -13]], 3)
      + show(text('BLOCKED', 58, 14, C.pink), [0, 0, 0, 1, 1], 3)
      + show(skull(71, 28), [0, 0, 0, 0, 1], 3),
  },
  {
    id: 'counter-gank',
    category: 'jungle',
    title: 'COUNTER-GANK THEIR GANKS',
    takeaway: 'BE WHERE THEIR JUNGLER GOES',
    summary: 'When you can predict where the enemy jungler is going, be nearby. Their 2v1 becomes a 2v2 they did not plan for.',
    tips: [
      'Track their clear: a jungler seen on one buff is heading to the lanes on that side.',
      'Wait in a bush near the lane that looks gankable to them.',
      'Engage after they use their CC, not before.',
    ],
    scene: () => {
      const { out, at } = miniMap();
      return out
        + dot(...at(18, 0), C.ally) + dot(...at(26, 0), C.enemy)
        + move(dot(...at(24, 14), C.enemy), [[0, 0], [0, -4], [0, -8], [0, -10]], 3)
        + move(dot(...at(8, 14), C.purple), [[0, 0], [4, -4], [8, -8], [12, -10]], 3)
        + show(burst(...at(20, 0), C.pink), [0, 0, 0, 1], 3)
        + text('THEY:', 92, 12, C.enemy) + text('GANK', 92, 18, C.enemy)
        + text('YOU:', 4, 12, C.purple) + text('WAIT', 4, 18, C.purple)
        + show(text('2V2', 92, 30, C.pink), [0, 0, 1, 1], 3);
    },
  },
  {
    id: 'invade-when-seen',
    category: 'jungle',
    title: 'SEEN BOT? INVADE TOP SIDE',
    takeaway: "TAKE CAMPS THEY CAN'T DEFEND",
    summary: 'When the enemy jungler shows on one side of the map, their camps on the other side are unguarded. Taking them slows their gold and experience.',
    tips: [
      'Only invade after their jungler is seen far away, for example ganking bot while you are top-side.',
      'Make sure your nearby laners have priority so they can follow if it is contested.',
      'Leave before their jungler can walk back; a stolen camp is not worth a death.',
    ],
    scene: () => {
      const { out, at } = miniMap();
      return out
        + show(camp(...at(22, 8), C.enemy), [1, 1, 0, 0], 3) + show(camp(...at(30, 10)), [1, 1, 1, 0], 3)
        + camp(...at(38, 22))
        + show(dot(...at(30, 42), C.enemy) + text('!', ...at(34, 36), C.enemy), [1, 0], 1)
        + move(dot(...at(10, 18), C.purple), [[0, 0], [10, -10], [18, -8], [26, 2]], 3)
        + text('INVADE', 4, 14, C.purple)
        + text('THEM:', 92, 40, C.enemy) + text('BOT', 92, 46, C.enemy);
    },
  },
  {
    id: 'smite-last',
    category: 'jungle',
    title: 'SMITE AT THE LAST MOMENT',
    takeaway: 'SMITE TO SECURE, NOT TO START',
    summary: 'Smite deals a big burst of damage to monsters. Used early, it leaves the objective open for the enemy jungler to steal; save it for the final hit.',
    tips: [
      "Watch the objective's HP and smite when it drops below your Smite damage.",
      'If the enemy jungler is close, be ready to smite a little earlier.',
      'Never open with Smite on an objective; hold it until the end.',
    ],
    scene: () =>
      show(scaled(4, 54, 18, dragon(0, 0)), [1, 1, 1, 1, 0], 3.5)
      + show(hpBar(44, 13, 40, 1), [1, 0, 0, 0, 0], 3.5)
      + show(hpBar(44, 13, 40, 0.6), [0, 1, 0, 0, 0], 3.5)
      + show(hpBar(44, 13, 40, 0.25, C.enemy), [0, 0, 1, 0, 0], 3.5)
      + show(hpBar(44, 13, 40, 0.08, C.enemy), [0, 0, 0, 1, 0], 3.5)
      + show(rect(63, 10, 2, 30, C.ward) + text('SMITE!', 82, 24, C.ward), [0, 0, 0, 1, 0], 3.5)
      + show(text('SECURED', 50, 30, C.green), [0, 0, 0, 0, 1], 3.5)
      + champ(28, 40, 'jungle') + champ(104, 40, 'enemy') + text('?', 105, 32, C.enemy),
  },
  {
    id: 'early-to-objectives',
    category: 'jungle',
    title: 'BE EARLY TO OBJECTIVES',
    takeaway: 'ARRIVE BEFORE IT SPAWNS',
    summary: 'Objectives are won by whoever arrives first with vision and their team. Show up before the spawn, not when it is already being fought over.',
    tips: [
      'Track when Dragon and Herald spawn, and plan your clear to be nearby.',
      'Ping your team well before the spawn so laners can push and walk over.',
      'Ward the pit and clear their vision before it spawns.',
    ],
    scene: () => {
      const { out, at } = miniMap();
      return out
        + dragon(...at(32, 31))
        + text('DRAGON', 4, 12, C.dragon)
        + show(text('0:30', 4, 22, C.white), [1, 0, 0, 0], 4)
        + show(text('0:20', 4, 22, C.white), [0, 1, 0, 0], 4)
        + show(text('0:10', 4, 22, C.white), [0, 0, 1, 0], 4)
        + show(text('UP!', 4, 22, C.dragon), [0, 0, 0, 1], 4)
        + move(dot(...at(10, 38), C.ally) + dot(...at(16, 42), C.ally) + dot(...at(20, 30), C.purple), [[0, 0], [6, -2], [12, -4], [14, -4]], 4)
        + show(dot(...at(44, 20), C.enemy) + dot(...at(42, 26), C.enemy) + text('LATE', 92, 26, C.enemy), [0, 0, 0, 1], 4)
        + show(text('FIRST', 92, 44, C.green), [0, 0, 0, 1], 4);
    },
  },
  {
    id: 'trade-cross-map',
    category: 'jungle',
    title: "CAN'T CONTEST? TRADE",
    takeaway: 'TAKE SOMETHING ELSEWHERE',
    summary: 'If the enemy team is taking an objective you cannot contest, do not flip a losing fight. Take something on the other side of the map at the same time.',
    tips: [
      'Cannot win the fight at Dragon? Take Herald, a tower, or their camps instead.',
      'Make the call early so your team moves together.',
      'Only contest if you have more people there or better vision.',
    ],
    scene: () => {
      const { out, at } = miniMap();
      return out
        + dragon(...at(32, 31)) + dot(...at(28, 27), C.enemy) + dot(...at(37, 28), C.enemy) + dot(...at(34, 37), C.enemy)
        + show(burst(...at(32, 31), C.enemy), [0, 1, 0, 1], 2)
        + herald(...at(9, 10)) + dot(...at(15, 14), C.purple) + dot(...at(8, 16), C.ally)
        + show(burst(...at(9, 9), C.ally), [1, 0, 1, 0], 2)
        + text('YOU:', 4, 12, C.ally) + text('HERALD', 4, 18, C.ally)
        + text('THEY:', 92, 40, C.enemy) + text('DRAGON', 92, 46, C.enemy);
    },
  },

  // ---- Mid lane ----------------------------------------------------------------
  {
    id: 'mid-shove-and-roam',
    category: 'mid',
    title: 'SHOVE, THEN ROAM',
    takeaway: 'MID PRIO = MAP CONTROL',
    summary: 'Mid is the shortest lane, so a mid laner who pushes first can reach either side lane quickly. Push the wave, then roam while their mid is stuck clearing it.',
    tips: [
      'Push the wave into their tower before you leave, or you lose minions and tower plates.',
      'Roam to a lane with a gankable enemy, preferably with your jungler nearby.',
      'Ping before you leave so your side laners can set up the fight.',
    ],
    scene: () => {
      const { out, at } = miniMap();
      const [tx, ty] = at(31, 13);
      return out + rect(tx, ty, 3, 4, C.enemy)
        + move(dot(...at(22, 22), C.mid), [[0, 0], [4, -4], [4, -4], [10, 6], [14, 14], [16, 20]], 3.6)
        + show(burst(...at(28, 12), C.mid), [0, 1, 1, 0, 0, 0], 3.6)
        + dot(...at(36, 44), C.enemy)
        + show(skull(...at(35, 38)), [0, 0, 0, 0, 0, 1], 3.6)
        + text('1. PUSH', 4, 14, C.white) + show(text('2. ROAM', 4, 22, C.mid), [0, 0, 0, 1, 1, 1], 3.6);
    },
  },
  {
    id: 'mid-ping-missing',
    category: 'mid',
    title: 'PING WHEN MID GOES MISSING',
    takeaway: 'MISSING? PING IT FAST',
    summary: 'When your lane opponent disappears, they are usually walking to a side lane. A quick ping gives your teammates the seconds they need to back off.',
    tips: [
      'Ping as soon as they leave vision, not after someone dies.',
      'Push their wave while they are gone; you get gold and plates for free.',
      'If you know where they went, follow; arriving second still turns a 2v1 into a 2v2.',
    ],
    scene: () =>
      laneScene({ brush: false })
      + champ(40, 37, 'ally')
      + show(champ(80, 37, 'enemy'), [1, 1, 0, 0, 0], 3)
      + show(text('?', 81, 37, C.enemy), [0, 0, 1, 1, 1], 3)
      + show(arrow(82, 31, 82, 20, C.enemy) + arrow(82, 50, 82, 58, C.enemy), [0, 0, 0, 1, 1], 3)
      + show(text('TOP?', 88, 16, C.enemy) + text('BOT?', 88, 54, C.enemy), [0, 0, 0, 1, 1], 3)
      + show(text('MIA!', 34, 14, C.ward), [0, 0, 0, 1, 1], 3),
  },
  {
    id: 'mid-follow-or-punish',
    category: 'mid',
    title: 'THEY ROAM? FOLLOW OR PUNISH',
    takeaway: 'NEVER JUST STAND THERE',
    summary: 'When their mid roams, you have two good answers: follow them to the fight, or punish by taking their tower plates. Standing in lane doing neither loses you both.',
    tips: [
      'If you can arrive in time, follow and turn their 2v1 into a 2v2.',
      'If you are too far, push their wave and hit their tower instead.',
      'Ping your side lanes either way so they know mid is missing.',
    ],
    scene: () => {
      const { out, at } = miniMap();
      const [tx, ty] = at(31, 13);
      return out + rect(tx, ty, 3, 4, C.enemy)
        + move(dot(...at(26, 20), C.enemy), [[0, 0], [4, 4], [8, 10], [12, 18]], 3)
        + move(dot(...at(20, 26), C.mid), [[0, 0], [6, -6], [8, -9], [8, -9]], 3)
        + show(burst(...at(30, 11), C.mid), [0, 0, 1, 1], 3)
        + text('THEY:', 4, 14, C.enemy) + text('ROAM', 4, 20, C.enemy)
        + text('YOU:', 92, 14, C.mid) + text('PLATES', 92, 20, C.mid);
    },
  },
  {
    id: 'mid-river-priority',
    category: 'mid',
    title: 'FIRST TO RIVER WINS FIGHTS',
    takeaway: 'PUSH, THEN HELP YOUR JUNGLER',
    summary: 'River skirmishes near mid are decided by who arrives first. If your wave is pushed and theirs is not, you can join your jungler while their mid is stuck in lane.',
    tips: [
      'Keep the wave pushed toward their side when your jungler is nearby.',
      'Walk into river with your jungler, not after the fight has started.',
      'If your wave is pushed toward you, do not leave; their mid arrives first.',
    ],
    scene: () =>
      laneScene({ brush: false })
      + rect(58, 10, 10, 24, C.river)
      + wave(100, 39, 'ally', 4) + champ(110, 37, 'enemy') + text('STUCK', 100, 28, C.enemy)
      + champ(60, 14, 'jungle') + champ(46, 24, 'enemy')
      + move(champ(80, 37, 'ally'), [[0, 0], [-6, -6], [-12, -14], [-14, -20], [-14, -20]], 3)
      + show(text('2V1', 28, 14, C.mid), [0, 0, 1, 1, 1], 3)
      + show(skull(46, 17), [0, 0, 0, 0, 1], 3),
  },
  {
    id: 'mid-ward-both-sides',
    category: 'mid',
    title: 'WARD BOTH SIDES OF MID',
    takeaway: 'TWO ENTRANCES, TWO WARDS',
    summary: 'Mid can be ganked from both sides of the river. A ward on one side only covers half the danger; ward both before you push past the middle.',
    tips: [
      'Place one ward on each river entrance near mid.',
      'If you only have one, ward the side the enemy jungler was last seen heading toward.',
      'When a ward spots someone, back off before they reach you.',
    ],
    scene: () =>
      laneScene({ brush: false })
      + rect(52, 12, 14, 8, C.brush) + rect(52, 51, 14, 7, C.brush)
      + show(ward(57, 13), [0, 1, 1, 1, 1], 3)
      + show(ward(57, 52), [0, 0, 1, 1, 1], 3)
      + show(champ(70, 51, 'enemy') + text('!', 76, 51, C.enemy), [0, 0, 0, 1, 1], 3)
      + move(champ(70, 37, 'ally'), [[0, 0], [0, 0], [0, 0], [-14, 0], [-28, 0]], 3),
  },
  {
    id: 'mid-save-mana',
    category: 'mid',
    title: 'SAVE MANA FOR TRADES',
    takeaway: 'LAST-HIT WITH AUTOS EARLY',
    summary: 'Mages who spend all their mana clearing waves have nothing left when the enemy all-ins. Early on, last-hit with autos and keep mana for trades and defense.',
    tips: [
      'Use spells on the wave only when you need to push for a roam or a recall.',
      'Trade with spells when the enemy walks up to last-hit, not on minions.',
      'If you are out of mana, play back; you cannot win a trade without spells.',
    ],
    scene: () => {
      const strip = (y: number, label: string, fill: string) => text(label, 2, y, fill) + rect(0, y + 7, W, 9, C.lane);
      let out = rect(0, 10, W, 51, C.grass) + strip(12, 'SPELLS ON WAVE', C.enemy) + strip(36, 'AUTOS ON WAVE', C.green);
      out += champ(30, 20, 'ally') + wave(64, 22, 'enemy', 2);
      out += show(hpBar(28, 18, 9, 1, C.mana), [1, 0, 0, 0], 3) + show(hpBar(28, 18, 9, 0.1, C.mana), [0, 1, 1, 1], 3);
      out += show(burst(64, 21, C.mana), [0, 1, 0, 0], 3) + show(text('NO MANA', 70, 12, C.mana), [0, 0, 1, 1], 3);
      out += move(champ(92, 20, 'enemy'), [[0, 0], [0, 0], [-40, 0], [-50, 0]], 3) + show(burst(32, 19, C.enemy), [0, 0, 0, 1], 3);
      out += champ(30, 44, 'ally') + hpBar(28, 42, 9, 1, C.mana) + wave(64, 46, 'enemy', 2);
      out += move(champ(92, 44, 'enemy'), [[0, 0], [0, 0], [-40, 0], [-50, 0]], 3) + show(burst(44, 43, C.mana), [0, 0, 0, 1], 3);
      return out;
    },
  },
  {
    id: 'mid-hold-escape',
    category: 'mid',
    title: 'HOLD YOUR ESCAPE',
    takeaway: 'DODGE THE ALL-IN, NOT THE POKE',
    summary: 'Against assassins like Zed, Akali or Fizz, your Flash or dash is your life. Use it on their real all-in, after they commit, not on harmless poke.',
    tips: [
      'Know their all-in pattern; most assassins dash in before their big damage.',
      'Use your escape after their dash lands, not before.',
      'Without your escape, play far back until it comes back up.',
    ],
    scene: () =>
      laneScene({ towers: false, brush: false })
      + show(champ(44, 37, 'ally') + flashIcon(43, 27), [1, 1, 1, 0, 0], 3)
      + show(champ(24, 37, 'ally') + flashIcon(23, 27, true) + burst(44, 37, C.ward), [0, 0, 0, 1, 1], 3)
      + move(champ(96, 37, 'enemy'), [[0, 0], [0, 0], [-44, 0], [-44, 0], [-44, 0]], 3)
      + show(rect(56, 40, 40, 1, C.enemy + '88'), [0, 0, 1, 0, 0], 3)
      + show(text('NOT YET', 36, 14, C.muted), [1, 1, 0, 0, 0], 3)
      + show(text('NOW!', 42, 14, C.ward), [0, 0, 1, 1, 1], 3),
  },

  // ---- Dragon lane (ADC) -----------------------------------------------------
  {
    id: 'adc-kite',
    category: 'dragon',
    title: 'ATTACK, STEP, ATTACK',
    takeaway: 'MOVE BETWEEN EVERY AUTO',
    summary: 'ADCs deal damage with autos, but standing still lets melee champions reach you. Step back between each auto so you keep hitting while staying out of reach.',
    tips: [
      'Auto, then move during the time before your next auto is ready.',
      'Kite backward from melee champions and sideways from skillshots.',
      'More attack speed means less time to move; practice the rhythm in practice mode.',
    ],
    scene: () =>
      laneScene({ towers: false })
      + move(champ(50, 37, 'enemy'), [[0, 0], [4, 0], [8, 0], [12, 0], [16, 0], [20, 0]], 3)
      + move(champ(80, 37, 'ally'), [[0, 0], [0, 0], [6, 0], [6, 0], [12, 0], [12, 0]], 3)
      + show(rect(66, 40, 4, 1, C.gold), [1, 0, 1, 0, 1, 0], 3)
      + show(text('AUTO', 52, 14, C.gold), [1, 0, 1, 0, 1, 0], 3)
      + show(text('STEP', 52, 14, C.white), [0, 1, 0, 1, 0, 1], 3),
  },
  {
    id: 'adc-farm-first',
    category: 'dragon',
    title: 'FARM FIRST, FIGHT SECOND',
    takeaway: 'EVERY MINION IS PART OF AN ITEM',
    summary: 'ADCs are the most item-dependent role. Missed minions mean later items, and an ADC without items cannot carry fights.',
    tips: [
      'Prioritize last hits over poke unless the trade is clearly free.',
      'Under tower, learn the rhythm: tower shots plus one or two autos finish minions.',
      'Do not leave a big wave to die under your tower to chase a fight you are not needed in.',
    ],
    scene: () =>
      laneScene()
      + champ(28, 37, 'allySup') + champ(40, 37, 'ally') + wave(60, 39, 'enemy', 4, 4)
      + arrow(46, 42, 56, 42, C.gold)
      + show(coin(60, 29), [1, 0, 0, 0], 2.4) + show(coin(64, 29), [0, 1, 0, 0], 2.4)
      + show(coin(68, 29), [0, 0, 1, 0], 2.4) + show(coin(72, 29), [0, 0, 0, 1], 2.4)
      + show(text('CS 10', 88, 14, C.gold), [1, 0, 0, 0], 2.4) + show(text('CS 11', 88, 14, C.gold), [0, 1, 0, 0], 2.4)
      + show(text('CS 12', 88, 14, C.gold), [0, 0, 1, 0], 2.4) + show(text('CS 13', 88, 14, C.gold), [0, 0, 0, 1], 2.4),
  },
  {
    id: 'adc-stay-behind-frontline',
    category: 'dragon',
    title: 'STAY BEHIND YOUR FRONTLINE',
    takeaway: 'HIT THE CLOSEST SAFE TARGET',
    summary: 'In teamfights, the ADC wins by staying alive and attacking whoever is in range. Stand behind your tanks and hit the closest enemy instead of walking forward for the backline.',
    tips: [
      'Keep your tank or bruiser between you and the enemy team.',
      'Auto the closest enemy you can hit safely, even if it is their tank.',
      'Only reach for their carry once their engage and dive tools are used.',
    ],
    scene: () =>
      scaled(3, 52, 20, champ(0, 0, 'ally')) + text('FRONT', 50, 46, C.ally)
      + champ(24, 34, 'ally') + text('YOU', 22, 46, C.gold)
      + move(champ(100, 34, 'enemy'), [[0, 0], [-14, 0], [-28, 0], [-28, 0]], 3)
      + show(burst(70, 33, C.ally), [0, 0, 1, 1], 3)
      + show(rect(30, 37, 40, 1, C.gold), [0, 0, 1, 0], 3)
      + show(text('BLOCKED', 80, 14, C.ally), [0, 0, 1, 1], 3),
  },
  {
    id: 'adc-trade-with-support',
    category: 'dragon',
    title: 'TRADE WHEN YOUR SUPPORT IS NEAR',
    takeaway: 'NO SUPPORT? NO TRADE',
    summary: "Dragon lane is a 2v2. Trades go your way when your support's damage, shields and CC are there with you; alone, you are just a 1v2 target.",
    tips: [
      'Look at your support before you step up to trade.',
      'If your support roams or recalls, farm safely near your tower.',
      'Follow up on your support\'s engage immediately; a late follow-up wastes it.',
    ],
    scene: () => {
      const strip = (y: number, label: string, fill: string) => text(label, 2, y, fill) + rect(0, y + 7, W, 9, C.lane);
      let out = rect(0, 10, W, 51, C.grass) + strip(12, 'SUPPORT HERE', C.green) + strip(36, 'SUPPORT GONE', C.enemy);
      out += champ(30, 20, 'ally') + champ(40, 20, 'allySup') + champ(80, 20, 'enemy') + champ(90, 20, 'enemySup');
      out += show(burst(80, 19), [0, 1, 0, 1], 3) + show(hpBar(78, 18, 9, 0.4, C.enemy), [0, 0, 1, 1], 3);
      out += champ(30, 44, 'ally');
      out += move(champ(80, 44, 'enemy') + champ(90, 44, 'enemySup'), [[0, 0], [-16, 0], [-30, 0], [-36, 0]], 3);
      out += show(skull(31, 53), [0, 0, 0, 1], 3);
      return out;
    },
  },
  {
    id: 'adc-farm-near-team',
    category: 'dragon',
    title: 'FARM WAVES NEAR YOUR TEAM',
    takeaway: 'SAFE FARM BEATS LONELY FARM',
    summary: 'After laning, ADCs still need gold, but a side wave far from the team is where they get caught. Take waves your team can protect, and leave the far ones to a side laner.',
    tips: [
      'Farm the lane closest to where your team is grouped.',
      'If you must take a far side wave, do it right after the enemy shows elsewhere.',
      'Never walk into a side lane alone when three or more enemies are missing.',
    ],
    scene: () => {
      const { out, at } = miniMap();
      return out
        + dot(...at(20, 24), C.ally) + dot(...at(25, 20), C.ally) + dot(...at(24, 27), C.allySup)
        + dot(...at(30, 13), C.enemy) + dot(...at(33, 16), C.enemy) + dot(...at(28, 9), C.enemy)
        + show(dot(...at(15, 30), C.gold) + text('SAFE', 4, 30, C.green), [1, 1, 0, 0], 3)
        + show(dot(...at(1, 8), C.gold) + skull(...at(4, 2)) + text('ALONE', 4, 30, C.enemy), [0, 0, 1, 1], 3)
        + text('ADC', 4, 14, C.gold);
    },
  },
  {
    id: 'adc-engage-range',
    category: 'dragon',
    title: 'KNOW THEIR ENGAGE RANGE',
    takeaway: 'ONE STEP OUTSIDE = SAFE',
    summary: "Engage supports like Leona, Nautilus and Thresh have a fixed engage range. Standing just outside it lets you farm while their engage has nothing to hit.",
    tips: [
      "Learn the range of their support's engage spell and stay just outside it.",
      'Step forward to last-hit, then step back out of range.',
      'When their engage is on cooldown, you can trade freely for a few seconds.',
    ],
    scene: () =>
      laneScene({ towers: false })
      + champ(100, 37, 'enemySup')
      + rect(72, 50, 28, 1, C.enemySup) + rect(72, 48, 1, 5, C.enemySup) + text('RANGE', 78, 53, C.enemySup)
      + champ(52, 37, 'allySup') + champ(62, 37, 'ally')
      + move(rect(94, 40, 5, 1, C.enemySup), [[0, 0], [-10, 0], [-22, 0], [-22, 0]], 2.4)
      + show(text('SHORT!', 64, 14, C.green), [0, 0, 1, 1], 2.4),
  },
  {
    id: 'adc-no-facecheck',
    category: 'dragon',
    title: 'NEVER FACE-CHECK BRUSH',
    takeaway: 'LET THE TANK CHECK IT',
    summary: 'Walking into an unwarded bush as the ADC is the fastest way to die. Let your tank or support check it, or ward it first.',
    tips: [
      'Treat every unwarded bush near objectives as if an enemy is inside.',
      'Ward it, or let a tankier teammate walk in first.',
      'Use a skillshot or an auto on the bush edge if your champion can reveal it.',
    ],
    scene: () =>
      laneScene({ brush: false })
      + rect(60, 50, 22, 9, C.brush)
      + show(text('?', 70, 43, C.enemy), [1, 1, 0, 0], 3)
      + show(champ(70, 51, 'enemy'), [0, 0, 1, 1], 3)
      + move(champ(40, 38, 'ally'), [[0, 0], [12, 6], [22, 12], [22, 12]], 3)
      + show(skull(62, 42), [0, 0, 0, 1], 3),
  },

  // ---- Team fights -------------------------------------------------------------
  {
    id: 'tf-count-ults',
    category: 'teamfight',
    title: 'COUNT ULTS BEFORE FIGHTING',
    takeaway: 'MORE ULTS UP = TAKE THE FIGHT',
    summary: 'Ultimates decide most team fights. Before you commit, compare how many big ults your team has ready against theirs.',
    tips: [
      'Watch for enemy ults being used in skirmishes; that is your window to force a fight.',
      'If your key ult (your engage or your carry\'s) is down, play for time instead.',
      'Ping your own ult status so the team knows when you are ready.',
    ],
    scene: () =>
      rect(0, 10, W, 51, C.grass)
      + team([8, 20, 32, 44, 56], 34, 'ally') + team([70, 82, 94, 106, 118], 34, 'enemy')
      + [8, 20, 32, 44, 56].map((x, i) => ultIcon(x + 1, 28, i !== 2)).join('')
      + [70, 82, 94, 106, 118].map((x, i) => ultIcon(x + 1, 28, i === 1 || i === 3)).join('')
      + text('ULTS: 4', 14, 16, C.gold) + text('ULTS: 2', 80, 16, C.muted)
      + show(text('FIGHT!', 52, 50, C.lime), [1, 0], 1.2),
  },
  {
    id: 'tf-count-heads',
    category: 'teamfight',
    title: "DON'T FIGHT DOWN A PLAYER",
    takeaway: '4V5 LOSES. WAIT FOR FIVE',
    summary: 'A team fight with one player missing is usually lost before it starts. If someone is dead, recalling or far away, back off until you are even.',
    tips: [
      'Check the scoreboard and minimap before committing: who is dead, who is missing?',
      'If you are down a player, give up the objective rather than the fight.',
      'If they are down a player, that is the moment to force.',
    ],
    scene: () =>
      rect(0, 10, W, 51, C.grass)
      + team([8, 20, 32, 44], 30, 'ally') + text('?', 57, 31, C.muted)
      + team([70, 82, 94, 106, 118], 30, 'enemy')
      + text('4', 26, 16, C.ally) + text('V', 60, 16, C.white) + text('5', 92, 16, C.enemy)
      + show(text('BACK OFF', 48, 48, C.enemy), [1, 1, 0], 2.4)
      + show(text('WAIT FOR 5', 44, 48, C.lime), [0, 0, 1], 2.4),
  },
  {
    id: 'tf-know-your-job',
    category: 'teamfight',
    title: 'KNOW YOUR TEAMFIGHT JOB',
    takeaway: 'ENGAGE, PEEL OR DEAL DAMAGE',
    summary: 'Every champion has one main job in a fight. Tanks start it, carries deal damage from safety, and supports or peelers keep the carries alive.',
    tips: [
      'Engage: go in first and land your CC on as many enemies as possible.',
      'Damage: hit the closest safe target and stay alive; dead carries deal no damage.',
      'Peel: stay next to your carry and stop whoever dives them.',
    ],
    scene: () =>
      text('ENGAGE', 4, 14, C.ally) + scaled(3, 10, 22, champ(0, 0, 'ally')) + arrow(28, 32, 38, 32, C.ally)
      + rect(43, 14, 1, 40, '#26324d')
      + text('DAMAGE', 48, 14, C.gold) + scaled(3, 54, 24, sword(0, 0, C.gold))
      + rect(86, 14, 1, 40, '#26324d')
      + text('PEEL', 98, 14, C.allySup) + scaled(3, 98, 22, shield(0, 0, C.allySup))
      + show(rect(4, 50, 36, 1, C.ally), [1, 0, 0], 3) + show(rect(48, 50, 34, 1, C.gold), [0, 1, 0], 3)
      + show(rect(92, 50, 30, 1, C.allySup), [0, 0, 1], 3),
  },
  {
    id: 'tf-engage-together',
    category: 'teamfight',
    title: 'ENGAGE AS FIVE, NOT ONE',
    takeaway: 'ONE ENGAGE, FOUR FOLLOW',
    summary: 'An engage only works if your team can follow it. Going in alone, or before your team is in range, just trades one life for nothing.',
    tips: [
      'Engage when your team is close enough to reach the fight within a second or two.',
      'Ping before you go so everyone commits at the same time.',
      'If your engage goes in alone, the rest of the team should back off, not trickle in.',
    ],
    scene: () => {
      const strip = (y: number, label: string, fill: string) => text(label, 2, y, fill) + rect(0, y + 7, W, 9, C.lane);
      let out = rect(0, 10, W, 51, C.grass) + strip(12, 'ALONE', C.enemy) + strip(36, 'TOGETHER', C.lime);
      out += team([10, 20, 30, 40], 20, 'ally') + team([90, 100, 110], 20, 'enemy');
      out += move(champ(50, 20, 'ally'), [[0, 0], [20, 0], [32, 0], [32, 0]], 3) + show(skull(83, 13), [0, 0, 0, 1], 3);
      out += team([90, 100, 110], 44, 'enemy');
      out += move(team([10, 20, 30, 40, 50], 44, 'ally'), [[0, 0], [14, 0], [26, 0], [30, 0]], 3);
      out += show(burst(92, 43, C.lime), [0, 0, 1, 1], 3);
      return out;
    },
  },
  {
    id: 'tf-bait-ult',
    category: 'teamfight',
    title: 'BAIT THEIR KEY ULT',
    takeaway: 'THEIR ULT IS DOWN? NOW FIGHT',
    summary: 'Some ults win fights on their own, like Malphite or Ornn engaging onto your whole team. Get them used on one tanky target first, then take the fight.',
    tips: [
      'Know which enemy ult wins them the fight, and who it will be aimed at.',
      'Let a tanky teammate step forward to draw it out.',
      'The moment it is used, commit; you have its full cooldown to win.',
    ],
    examples: { label: 'Fight-winning ults to bait', champions: ['malphite', 'ornn', 'kennen', 'sett'] },
    scene: () =>
      rect(0, 10, W, 51, C.grass)
      + team([10, 20, 30], 36, 'ally') + team([92, 104, 116], 36, 'enemy')
      + show(ultIcon(93, 30, true), [1, 1, 0, 0], 3) + show(ultIcon(93, 30, false), [0, 0, 1, 1], 3)
      + move(champ(42, 36, 'ally'), [[0, 0], [12, 0], [12, 0], [12, 0]], 3)
      + show(burst(54, 35, C.enemy) + text('ULT USED', 40, 16, C.enemy), [0, 0, 1, 0], 3)
      + show(text('NOW FIGHT', 42, 16, C.lime) + arrow(36, 50, 80, 50, C.lime), [0, 0, 0, 1], 3),
  },
  {
    id: 'tf-chokepoints',
    category: 'teamfight',
    title: 'FIGHT AT CHOKEPOINTS',
    takeaway: 'AOE ULTS LOVE NARROW PATHS',
    summary: 'In narrow jungle paths, enemies have no room to spread out. Teams with area-of-effect ults should fight there; teams without should avoid them.',
    tips: [
      'With AoE ults on your team, catch them as they walk through narrow jungle paths.',
      'Without AoE, fight in open areas such as river and lanes.',
      'Do not walk through a chokepoint toward an enemy team with AoE ults up.',
    ],
    examples: { label: 'AoE ults that punish chokepoints', champions: ['malphite', 'kennen', 'rumble', 'ornn'] },
    scene: () =>
      rect(0, 10, W, 51, C.grassDark)
      + rect(40, 10, 48, 18, C.stoneDark) + rect(40, 44, 48, 17, C.stoneDark)
      + rect(0, 28, W, 16, C.grass)
      + team([52, 62, 72], 33, 'enemy')
      + champ(16, 33, 'ally')
      + show(scaled(3, 55, 28, burst(0, 0, C.lime)), [0, 0, 1, 1], 3)
      + show(text('HIT 3!', 98, 33, C.lime), [0, 0, 1, 1], 3)
      + text('NARROW', 50, 14, C.white),
  },
  {
    id: 'tf-spread-vs-aoe',
    category: 'teamfight',
    title: 'SPREAD OUT VS AOE ULTS',
    takeaway: "DON'T LET ONE ULT HIT FIVE",
    summary: 'Against AoE ults like Malphite, Kennen or Rumble, standing in a clump lets one ult decide the fight. Spread out so it can only catch one or two of you.',
    tips: [
      'Keep a few steps between yourself and your teammates when their AoE ult is up.',
      'Carries especially: never stand next to your tank when the enemy has a big AoE engage.',
      'Once the ult is used, group back up and fight.',
    ],
    examples: { label: 'AoE ults to spread against', champions: ['malphite', 'kennen', 'rumble', 'gragas'] },
    scene: () => {
      const strip = (y: number, label: string, fill: string) => text(label, 2, y, fill) + rect(0, y + 7, W, 9, C.lane);
      let out = rect(0, 10, W, 51, C.grass) + strip(12, 'CLUMPED', C.enemy) + strip(36, 'SPREAD', C.lime);
      out += team([44, 50, 56, 62], 20, 'ally') + show(scaled(3, 46, 18, burst(0, 0, C.enemy)), [0, 1, 1, 0], 3);
      out += show(text('X4', 74, 20, C.enemy), [0, 0, 1, 1], 3);
      out += team([20, 44, 68, 92], 44, 'ally') + show(scaled(2, 40, 43, burst(0, 0, C.enemy)), [0, 1, 1, 0], 3);
      out += show(text('X1', 104, 44, C.lime), [0, 0, 1, 1], 3);
      return out;
    },
  },
  {
    id: 'tf-take-objectives',
    category: 'teamfight',
    title: 'WON THE FIGHT? TAKE OBJECTIVES',
    takeaway: "DON'T CHASE INTO THE FOG",
    summary: 'After winning a fight, the reward is the objective: Baron, Dragon or towers. Chasing survivors into unwarded jungle is how won fights turn into lost ones.',
    tips: [
      'Count how many enemies are dead and for how long; that is your window.',
      'Go straight to the nearest objective: Baron, Dragon or a tower.',
      'Let the survivors run; a tower is worth more than a risky last kill.',
    ],
    scene: () =>
      rect(0, 10, W, 51, C.grass) + rect(88, 10, 40, 51, '#05080f')
      + text('FOG', 100, 14, C.muted)
      + scaled(2, 20, 16, baron(0, 0)) + text('BARON', 18, 30, C.purple)
      + skull(52, 44) + skull(60, 48) + skull(68, 42)
      + show(champ(96, 36, 'enemy') + text('?', 97, 28, C.enemy), [1, 1, 1, 1], 3)
      + move(team([56, 66, 76], 30, 'ally'), [[0, 0], [-10, -4], [-20, -8], [-24, -10]], 3)
      + show(burst(26, 18, C.purple), [0, 0, 1, 1], 3),
  },
];

export const cardById = new Map(CARDS.map((c) => [c.id, c]));

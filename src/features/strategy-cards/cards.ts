import {
  C, W, arrow, baron, burst, camp, champ, coin, dot, dragon, flashIcon, miniMap, heart, herald, hpBar, laneScene, minion, move, orb, potion, rect,
  scaled, shield, show, skull, stun, sword, text, tower, ward, wave,
} from './pixel';

export type Category = 'micro' | 'macro' | 'items' | 'counters' | 'support' | 'jungle';

export const CATEGORIES: Record<Category, { label: string; accent: string; blurb: string }> = {
  micro: { label: 'Laning micro', accent: C.gold, blurb: 'Trades, spacing and wave control in lane.' },
  macro: { label: 'Macro', accent: C.green, blurb: 'When to push, roam, recall and take objectives.' },
  items: { label: 'Itemization', accent: C.purple, blurb: 'What to buy, and when, based on the enemy.' },
  counters: { label: 'Class counters', accent: C.ally, blurb: 'Which champion types beat which.' },
  support: { label: 'Support', accent: C.allySup, blurb: 'Dragon lane support: peel, engage, vision and roams.' },
  jungle: { label: 'Jungle', accent: C.pink, blurb: 'Clears, ganks, counter-jungling and objectives.' },
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
    title: 'HEALERS NEED ANTI-HEAL',
    takeaway: 'BUY IT EARLY, NOT LAST',
    summary: 'Some Baron laners win by out-healing your damage. An anti-heal item cuts that healing; buy it as an early component when your opponent is one of them.',
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
    title: 'AHEAD? BUY DAMAGE',
    takeaway: 'BEHIND? BUY RESISTS FIRST',
    summary: 'Your lead or deficit should change your next item. Ahead, damage lets you snowball; behind, defense keeps you alive long enough to scale.',
    tips: [
      'Ahead in gold or kills: finish your damage item and keep pressuring.',
      'Behind: buy the resistance that matches their damage before more damage.',
      'Even: follow your normal core build.',
    ],
    scene: () =>
      text('AHEAD', 10, 14, C.green) + arrow(20, 34, 20, 22, C.green)
      + scaled(3, 30, 24, sword(0, 0, C.gold)) + text('DAMAGE', 26, 44, C.gold)
      + rect(63, 14, 1, 40, '#26324d')
      + text('BEHIND', 72, 14, C.enemy) + arrow(84, 22, 84, 34, C.enemy)
      + scaled(3, 94, 22, shield(0, 0, C.stone)) + text('RESISTS', 88, 44, C.stone)
      + show(rect(26, 52, 24, 1, C.gold), [1, 0], 1.6) + show(rect(88, 52, 28, 1, C.stone), [0, 1], 1.6),
  },
  {
    id: 'carry-potions',
    category: 'items',
    title: 'CARRY A POTION EARLY',
    takeaway: 'POTIONS WIN CLOSE TRADES',
    summary: 'A cheap health potion heals you over time after a trade. In an even lane, the player who drinks potions stays healthy enough to win the next trade.',
    tips: [
      'Grab a potion on early backs while you are still laning.',
      'Drink after a trade, not before; it heals over time.',
      'Stop buying them once you have sustain items or are out of lane.',
    ],
    scene: () =>
      laneScene({ towers: false })
      + champ(50, 37, 'ally') + champ(78, 37, 'enemy') + hpBar(76, 34, 9, 0.5, C.enemy)
      + scaled(2, 32, 14, potion(0, 0))
      + show(hpBar(48, 34, 9, 0.45, C.enemy), [1, 0, 0, 0], 3)
      + show(hpBar(48, 34, 9, 0.6), [0, 1, 0, 0], 3)
      + show(hpBar(48, 34, 9, 0.75), [0, 0, 1, 0], 3)
      + show(hpBar(48, 34, 9, 0.9), [0, 0, 0, 1], 3)
      + show(text('+', 58, 30, C.heal), [0, 1, 1, 1], 3),
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
];

export const cardById = new Map(CARDS.map((c) => [c.id, c]));

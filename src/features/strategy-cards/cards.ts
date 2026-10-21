import {
  C, W, arrow, burst, champ, coin, heart, herald, hpBar, laneScene, minion, move, orb, rect, scaled, shield,
  show, skull, sword, text, tower, ward, wave,
} from './pixel';

export type Category = 'micro' | 'macro' | 'items' | 'counters';

export const CATEGORIES: Record<Category, { label: string; accent: string; blurb: string }> = {
  micro: { label: 'Laning micro', accent: C.gold, blurb: 'Trades, spacing and wave control in lane.' },
  macro: { label: 'Macro', accent: C.green, blurb: 'When to push, roam, recall and take objectives.' },
  items: { label: 'Itemization', accent: C.purple, blurb: 'What to buy, and when, based on the enemy.' },
  counters: { label: 'Class counters', accent: C.ally, blurb: 'Which champion types beat which.' },
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
];

export const cardById = new Map(CARDS.map((c) => [c.id, c]));

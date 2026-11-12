import { C, baron, dragon, herald, sprite, tower, coin } from '../strategy-cards/pixel';

export interface Objective {
  id: string;
  name: string;
  /** Pixel icon drawn on an 11×9 grid. */
  icon: string;
  where: string;
  gives: string;
  takeWhen: string;
  baronLaner: string;
  ifNot: string;
}

const ELDER = ['..WW.', '.WWWW', 'WWGW.', '.WWWW', 'W.W.W'];
const CRAB = ['.M...M.', 'MM.M.MM', '.MMMMM.', 'M.M.M.M'];

/** Ordered by how much the objective usually decides the game. */
export const OBJECTIVES: Objective[] = [
  {
    id: 'elder',
    name: 'Elder Dragon',
    icon: sprite(ELDER, 3, 2, { W: C.white, G: C.gold }),
    where: 'Dragon pit, by Dragon lane. It replaces the elemental drakes once a team has Dragon Soul.',
    gives: 'A temporary team buff that burns enemies you hit and executes them at low health. The team that has it wins even fights.',
    takeWhen: 'After you win a fight or catch an enemy, with vision around the pit and your jungler’s Smite ready.',
    baronLaner: 'Stop split-pushing when Elder is about to spawn. Push your wave, then walk to the pit so your team fights five against five.',
    ifNot: 'Never face-check the pit. Group, ward the river around it, and fight the enemy as they leave with the buff on the clock.',
  },
  {
    id: 'baron',
    name: 'Baron Nashor',
    icon: baron(1, 2),
    where: 'Baron pit, by Baron lane. It takes over the pit after the Rift Herald window.',
    gives: 'A temporary team buff: bonus stats, faster recall, and empowered minions that make towers fall fast.',
    takeWhen: 'After a won fight or a pick, with the enemy jungler dead or seen far away, and side waves pushed toward their base.',
    baronLaner: 'You live next to it. Keep Baron lane pushed, keep a ward on the pit, and be the first to group when your team starts it.',
    ifNot: 'Don’t walk into the pit through one entrance. Push a lane, take a tower or drake on the other side, or wait at range to punish them leaving low.',
  },
  {
    id: 'soul',
    name: 'Dragon Soul',
    icon: dragon(3, 3) + sprite(['G.G', '.G.'], 4, 0, { G: C.gold }),
    where: 'Earned by the team that stacks enough elemental drakes. The drake that would give a team Soul is the "soul point" drake.',
    gives: 'A permanent, game-long effect matching the Soul’s element, on top of the drake stacks. It also brings Elder Dragon into play.',
    takeWhen: 'Treat the soul point drake like Baron: set up vision early and fight for it with everyone, even if it means losing a tower elsewhere.',
    baronLaner: 'Shove your lane early and show up for the fight. A soul point drake is worth more than a side tower.',
    ifNot: 'If you can’t stop it, don’t throw a 4v5. Trade the biggest thing you can on the map, like Baron or two towers.',
  },
  {
    id: 'herald',
    name: 'Rift Herald',
    icon: herald(3, 2) + sprite(['W'], 5, 7, { W: C.white }),
    where: 'Baron pit, early in the game before Baron takes over.',
    gives: 'The Eye of the Herald. Use it to summon the Herald, which charges the nearest tower and deals heavy damage to it.',
    takeWhen: 'When Baron lane has priority and the enemy jungler was last seen on the Dragon side.',
    baronLaner: 'This is your objective. Push your wave, help your jungler kill it, then summon it with a wave at the enemy tower and hit the tower with it.',
    ifNot: 'Summoning is a channel: stun or knock up whoever summons it and the Eye is lost. Wait by your tower with CC ready. Summon your own out of enemy CC range.',
  },
  {
    id: 'drakes',
    name: 'Elemental drakes',
    icon: dragon(3, 2),
    where: 'Dragon pit, by Dragon lane. Each drake has an element, like Infernal, Ocean, Mountain or Cloud.',
    gives: 'A small permanent buff for the whole team that stacks with every drake you take, such as damage, regen, resistances or move speed.',
    takeWhen: 'When Dragon lane and mid have pushed their waves and can move to the pit first.',
    baronLaner: 'Make the enemy pay for the drake on your side of the map: push your wave into their tower, take plates or Herald while they fight.',
    ifNot: 'One early drake isn’t worth a lost fight. Trade it for Herald, plates or a tower.',
  },
  {
    id: 'plates',
    name: 'Tower plates',
    icon: tower(2, 0, 'enemy') + coin(7, 5),
    where: 'On the outer towers in every lane.',
    gives: 'Gold for your team every time a plate breaks, before the tower itself falls.',
    takeWhen: 'When your wave crashes into their tower and the enemy laner is dead or backed.',
    baronLaner: 'Crash the wave, hit the tower while the wave tanks, and back before the enemy jungler arrives. Herald plus plates is your early gold lead.',
    ifNot: 'Stand next to your tower when your wave crashes so their minions don’t do free damage, and ask your jungler for help if they dive.',
  },
  {
    id: 'scuttle',
    name: 'Rift Scuttler',
    icon: sprite(CRAB, 2, 3, { M: C.mid }),
    where: 'In the river, one on each side of the map.',
    gives: 'Gold and experience for your jungler, and control of the river where it’s taken.',
    takeWhen: 'At the first spawn, on the side where your lane has priority.',
    baronLaner: 'Push your wave so you can walk into the river when your jungler contests the Baron-side scuttler.',
    ifNot: 'If their laner is pushed and yours isn’t, let it go. Don’t start a 1v2 in the river.',
  },
];

export const CHECKLIST = [
  'Push your lane before the objective spawns, so the enemy laner has to choose between their wave and the fight.',
  'Ward the entrances to the pit and the river around it about a minute before it spawns.',
  'Know where the enemy jungler was last seen; a jungler with Smite can steal it.',
  'Count players: start when enemies are dead or backed, not when your own team is.',
  'Make sure your jungler has Smite up and no one on your team is in base shopping.',
  'If you can’t win the fight, trade: take a tower, a drake or plates on the other side of the map.',
];

export const TRADES = [
  { them: 'Baron', you: 'Two towers, or the soul point drake if it’s up' },
  { them: 'An early drake', you: 'Rift Herald or outer tower plates' },
  { them: 'Rift Herald', you: 'A drake, or Dragon lane plates' },
  { them: 'A side tower', you: 'A tower in another lane, or an objective on the other side' },
];

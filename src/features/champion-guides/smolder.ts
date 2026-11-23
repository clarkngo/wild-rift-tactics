import type { Guide } from './types';

/**
 * Smolder (Dragon lane marksman). Kit and stack tiers checked on 22 Nov 2026 against the
 * Wild Rift wiki and riftpatchnotes: tiers became 25 / 100 / 175 in patch 7.1e; patch 7.3
 * only touched attack speed.
 */
export const smolder: Guide = {
  id: 'smolder',
  name: 'Smolder',
  img: 'Smolder',
  role: 'Dragon lane marksman',
  patch: '7.3',
  reviewed: false,
  summary:
    'A scaling marksman who gets permanently stronger every time his abilities hit a champion or his Q kills a unit. Weak in early all-ins, a team-fight monster once his Q burns and executes. Your whole game is: survive lane, never miss a Q stack, and reach 175.',
  kit: [
    { key: 'Passive', name: 'Dragon Practice', text: 'A permanent stack each time an ability hits an enemy champion, or Q kills a minion or monster. Stacks add damage to Q, W and E.' },
    { key: 'Q', name: 'Super Scorcher Breath', text: 'Targeted fireball with your attack range. Your main farming and stacking tool; it upgrades at 25, 100 and 175 stacks.' },
    { key: 'W', name: 'Achooo!', text: 'Long-range sneeze that slows and explodes on champions. Only the first hit on each champion gives a stack.' },
    { key: 'E', name: 'Flap, Flap, Flap', text: 'Fly for a short time with bonus move speed, over walls, firing bolts at the lowest-health enemy nearby. One stack per cast. Ends if you cast another ability or get immobilized.' },
    { key: 'R', name: 'MMOOOMMMM!', text: 'His mother breathes a long wave of fire from behind him. Heals you, deals more damage and slows in the middle of the wave.' },
  ],
  tiers: [
    { stacks: 25, name: 'Splash', text: 'Q explodes on impact and hits enemies around the target. Your wave clear starts here.' },
    { stacks: 100, name: 'Bolts', text: 'Q also fires bolts in an arc that explode behind the target. You can poke champions standing behind their minions.' },
    { stacks: 175, name: 'Burn and execute', text: 'Q burns for true damage based on max health and executes champions that drop below a small slice of their health. This is your win condition.' },
  ],
  stackRules: [
    'Every Q last-hit on a minion or monster is a stack. A missed Q last-hit is a lost stack forever.',
    'Q, W and E each give a stack when they hit a champion. W counts once per champion, E once per cast.',
    'Stacks are permanent: dying doesn’t remove them, so a bad lane only slows you down.',
    'Stacks also make W and E hit harder, so poke gets stronger as you stack, not just Q.',
  ],
  plans: [
    {
      id: 'farm',
      name: 'Safe farm stacking',
      when: 'Default plan, and every lane where you can’t win trades.',
      steps: [
        'Last-hit with Q whenever it’s up, on the minion that would otherwise die to your auto. Cannon minions first.',
        'Hold Q for a last-hit rather than poking with it when the enemy bot lane can punish you.',
        'Under your tower, keep Q for the minions you’d miss with autos. Tower farming still stacks.',
        'Use W on a champion only when it’s safe: you get a stack and slow them without walking forward.',
      ],
      confidence: 'medium',
    },
    {
      id: 'poke',
      name: 'Poke stacking',
      when: 'Into short-range or immobile bot lanes that can’t punish you for walking up.',
      steps: [
        'Q the enemy marksman when they walk up to last-hit; each hit is a stack and chips their health.',
        'Throw W when they’re lined up behind or beside their minions; the slow sets up a second Q.',
        'After 100 stacks, Q a minion in front of them: the bolts land behind it and still hit champions.',
        'Step back after each trade. Your stacks win later; you don’t need a kill now.',
      ],
      confidence: 'medium',
    },
    {
      id: 'camps',
      name: 'Camp stacking',
      when: 'Mid game, when your lane is pushed and your jungler is on the other side.',
      steps: [
        'Q kills on monsters stack too. Take a free camp near your lane once your jungler agrees.',
        'Push the wave first, then take the camp, so you don’t lose a wave of Q stacks.',
        'Don’t take camps your jungler needs right before an objective.',
      ],
      confidence: 'low',
    },
    {
      id: 'losing',
      name: 'Losing lane',
      when: 'You’re behind, or the enemy lane keeps diving you.',
      steps: [
        'Farm under tower and Q every last-hit; never trade.',
        'Keep E for escaping before you get stunned: it ends the moment you’re immobilized.',
        'Ask your jungler to play your side; their ganks let you Q the enemy for free stacks.',
        'Don’t force fights to “catch up”. Stacks keep coming as long as you’re alive and farming.',
      ],
      confidence: 'medium',
    },
  ],
  lanes: [
    {
      id: 'engage',
      name: 'Hook and engage supports',
      examples: 'Blitzcrank, Thresh, Nautilus, Leona',
      confidence: 'medium',
      rating: 'bad',
      plan: 'Safe farm stacking',
      tips: [
        'Stand behind your minions at all times; one hook can lose you the lane.',
        'Use E early, before the stun lands: once you’re immobilized, Flap, Flap, Flap is cancelled.',
        'Q last-hits from max range and don’t walk forward to W.',
        'After their engage misses, Q and W the support for free stacks while it’s on cooldown.',
      ],
    },
    {
      id: 'allin',
      name: 'Early all-in marksmen',
      examples: 'Draven, Lucian, Tristana',
      confidence: 'medium',
      rating: 'bad',
      plan: 'Safe farm stacking',
      tips: [
        'They win levels 1–3 and want to kill you before you scale. Give up contested minions, not health.',
        'Let them push into your tower and Q the minions they leave low.',
        'W slows them when they jump on you; use it to walk back to tower, not to trade.',
        'From 25 stacks your Q splash clears faster, so you can stop them freezing on you.',
      ],
    },
    {
      id: 'range',
      name: 'Long-range marksmen',
      examples: 'Caitlyn',
      confidence: 'medium',
      rating: 'bad',
      plan: 'Safe farm stacking',
      tips: [
        'She out-ranges your autos and Q. Don’t try to Q her; save it for last-hits.',
        'Throw W from long range when she walks up; it out-ranges her autos.',
        'Play for your jungler. She can’t escape a gank as easily as she can win a 2v2.',
      ],
    },
    {
      id: 'enchanter',
      name: 'Enchanter and sustain lanes',
      examples: 'Soraka, Nami, Lulu, Janna',
      confidence: 'low',
      rating: 'neutral',
      plan: 'Poke stacking',
      tips: [
        'Their healing undoes poke, but every Q hit is still a permanent stack for you.',
        'Q the marksman when they walk up to farm; the healing doesn’t take the stack away.',
        'At 175 your burn deals true damage based on max health, so their healing matters less.',
      ],
    },
    {
      id: 'poke',
      name: 'Poke and mage supports',
      examples: 'Lux, Karma',
      confidence: 'low',
      rating: 'neutral',
      plan: 'Safe farm stacking, then poke after 100',
      tips: [
        'Stand where their poke can’t hit you and still reach your Q last-hits.',
        'R heals you; in a long poke war you can use it to win a trade, but keep it for fights after level 5.',
        'After 100 stacks your bolts reach behind minions, so you start winning the poke.',
      ],
    },
    {
      id: 'scaling',
      name: 'Other scaling marksmen',
      examples: "Kog'Maw, Vayne",
      confidence: 'low',
      rating: 'good',
      plan: 'Poke stacking',
      tips: [
        'They also want a quiet lane, so you can stack with poke more freely.',
        'Q them when they walk up to farm; they don’t have the early burst to punish you for it.',
        'Track their power spikes and fight when you hit 100 or 175 before they finish items.',
      ],
    },
    {
      id: 'windwall',
      name: 'Wind Wall',
      examples: 'Yasuo',
      confidence: 'medium',
      rating: 'neutral',
      plan: 'Safe farm stacking',
      tips: [
        'Wind Wall blocks your Q fireball and W. Wait for it to be used before you poke.',
        'Keep Q for last-hits while Wind Wall is up; don’t lose stacks to it.',
        'Once it’s down, Q and W him for free stacks; he has to walk forward to trade.',
      ],
    },
  ],
  teams: [
    {
      id: 'dive',
      name: 'Against dive and assassins',
      tips: [
        'Stand behind your frontline. Divers want to reach you before your Q burn matters.',
        'Use E early to fly over a wall the moment a diver commits; it’s cancelled if you’re stunned first.',
        'W the diver to slow them, then Q them; each hit is a stack and buys time for your team.',
        'Stasis Enchant on your boots gives you a second answer to an all-in.',
      ],
    },
    {
      id: 'tanks',
      name: 'Against tanky front lines',
      tips: [
        'This is your best team matchup: the 175 burn is true damage based on max health.',
        'Q the closest tank while you stay safe. Every hit is a stack and the burn stacks too.',
        'Buy armor penetration, like Serylda’s Grudge or Black Cleaver, once they stack armor.',
      ],
    },
    {
      id: 'poke',
      name: 'Against poke and siege',
      tips: [
        'Your R heals you, so save it to undo poke when they siege your tower.',
        'W out-ranges most poke. Hit it on a champion to stack without walking into range.',
        'Don’t walk up to Q a target under their poke; farm the wave with Q splash instead.',
      ],
    },
    {
      id: 'pick',
      name: 'Against pick comps',
      tips: [
        'Hooks, charms and stuns are your biggest danger. Walk with your team and stay behind minions.',
        'Ward the side of the map you’re farming, and leave when an enemy goes missing.',
        'E over a wall to escape before you’re caught, not after.',
      ],
    },
    {
      id: 'teamfight',
      name: 'In team fights',
      tips: [
        'Hit whoever is closest with Q; at 175 the burn and execute win long fights.',
        'Cast R from behind your team toward theirs. The middle of the wave hits harder and slows.',
        'Use E to reposition, not to dive. It stops if you cast another ability.',
      ],
    },
  ],
  builds: [
    'Builds vary by guide. Common cores in Wild Rift: Muramana, Trinity Force and Serylda’s Grudge, or Essence Reaver, Black Cleaver and Spear of Shojin.',
    'Add Infinity Edge for crit: Q damage scales with critical strike chance.',
    'Defensive boots with Stasis Enchant against dive.',
  ],
  remember: ['Never miss a Q last-hit.', 'Survive lane; 175 stacks wins the game.', 'Fly early, not after the stun.'],
  sources: [
    { label: 'Wild Rift wiki: Smolder', url: 'https://wiki.leagueoflegends.com/en-us/WR:Smolder' },
    { label: 'Smolder patch history', url: 'https://www.riftpatchnotes.com/champion/smolder' },
    { label: 'Wild Rift: Smolder', url: 'https://wildrift.leagueoflegends.com/en-sg/champions/smolder/' },
  ],
};

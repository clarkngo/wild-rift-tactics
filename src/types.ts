export type Rating = 'good' | 'neutral' | 'bad';
export type Confidence = 'high' | 'medium' | 'low';

export interface Champion {
  id: string;
  name: string;
  /** Data Dragon image key, e.g. "MonkeyKing" for Wukong. */
  img: string;
}

/** How the player's champion fares into the enemy. */
export interface Matchup {
  champion: string;
  rating: Rating;
  confidence: Confidence;
  why: string;
  trading: string[];
  /** Levels 1–3. */
  early: string;
  /** Levels 4–5, when ultimates come online. */
  spike: string;
  wave: string;
  jungle: string;
  build: string;
  remember: string;
}

export interface EnemyMatchups {
  enemy: string;
  patch: string;
  reviewed: boolean;
  summary: string;
  threats: string[];
  matchups: Matchup[];
}

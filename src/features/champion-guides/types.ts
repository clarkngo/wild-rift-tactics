import type { Confidence, Rating } from '../baron-matchups/types';

export interface StackPlan {
  id: string;
  name: string;
  when: string;
  steps: string[];
  confidence: Confidence;
}

/** A type of enemy lane, rated from the guide champion's point of view. */
export interface LaneMatchup {
  id: string;
  name: string;
  examples: string;
  confidence: Confidence;
  rating: Rating;
  /** Which stacking plan to use. */
  plan: string;
  tips: string[];
}

export interface TeamMatchup {
  id: string;
  name: string;
  tips: string[];
}

export interface Guide {
  id: string;
  name: string;
  /** Data Dragon image id. */
  img: string;
  role: string;
  patch: string;
  reviewed: boolean;
  summary: string;
  kit: { key: string; name: string; text: string }[];
  tiers: { stacks: number; name: string; text: string }[];
  stackRules: string[];
  plans: StackPlan[];
  lanes: LaneMatchup[];
  teams: TeamMatchup[];
  builds: string[];
  remember: string[];
  sources: { label: string; url: string }[];
}

// types.ts

import { discoveryTiers, dynamicMilestones, entropyMilestones, slamoMilestones, state, State } from "./imports.js";

export type ResetLayers = "cells" | "research" | "breakthrough" | "breakthroughChallenge" | "automatorTrial";

export interface resettableKeys {
  // TODO: fix the ARCHITECTURE MATEY
  cells: [
    resources: Array<keyof State["resources"]>,
    stats: Array<keyof State["stats"]>,
  ];
}

// This creates a union type of all possible milestone objects in those lists
export type AllMilestonesType = 
  | typeof slamoMilestones[number]
  | typeof entropyMilestones[number]
  | typeof discoveryTiers[number]
  | typeof dynamicMilestones[number];

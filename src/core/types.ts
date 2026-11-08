// types.ts

// import {
//   discoveryTiers,
//   dynamicMilestones,
//   entropyMilestones,
//   slamoMilestones,
//   upgradeLibrary,
// } from "../data";
// import { milestones } from "../data/milestones/milestoneData";
// import { State } from "../state";

export type ResetLayers =
  | "cells"
  | "research"
  | "breakthrough"
  | "breakthroughChallenge"
  | "automatorTrial";

// Enforces that every layer defined in ResetLayers has an entry mapping to arrays of valid State keys
export type ResettableKeysMap = {
  [Layer in ResetLayers]: {
    resources: Array<keyof State["resources"]>;
    stats: Array<keyof State["stats"]>;
    upgrades?: Array<keyof State["upgradeState"]>; // Scalable for later
  };
};

// This creates a union type of all possible milestone objects in those lists
export type AllMilestonesType =
  | (typeof slamoMilestones)[number]
  | (typeof entropyMilestones)[number]
  | (typeof discoveryTiers)[number]
  | (typeof dynamicMilestones)[number];

export type AllUpgradeIds = keyof typeof upgradeLibrary;
export type AllMilestoneIds = keyof typeof milestones;

export function isValidUpgradeId(id: string): id is AllUpgradeIds {
  return id in ALL_UPGRADES;
}

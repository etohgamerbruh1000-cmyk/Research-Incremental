// types.ts

export interface UpgradeStateEntry {
  level: number;
  bonusMax: number;
}

export interface MilestoneStateEntry {
  claimed: boolean;
}

export type ResetLayers =
  | "cells"
  | "research"
  | "breakthrough"
  | "breakthroughChallenge"
  | "automatorTrial";

// Enforces that every layer defined in ResetLayers has an entry mapping to arrays of valid State keys
export type ResettableKeysMap = {
  [Layer in ResetLayers]: {
    resources: Array<string>;
    stats: Array<string>;
    upgrades?: Array<string>; // Scalable for later
  };
};

// This creates a union type of all possible milestone objects in those lists
export type AllMilestonesType =
  | (typeof slamoMilestones)[number]
  | (typeof entropyMilestones)[number]
  | (typeof discoveryTiers)[number]
  | (typeof dynamicMilestones)[number];

export type AllUpgradeIds = string;
export type AllMilestoneIds = string;

export function isValidUpgradeId(id: string): id is AllUpgradeIds {
  const typecheck = typeof id === "string" && id.length > 0;
  return typecheck;
}

export interface State {
  resources: {
    amoeba: number;
    RNA: number;
    highestRNA: number;
    kineticEnergy: number;
    slamoClicks: number;
  };

  stats: {
    clickPower: number;
    slamoClickPower: number;
    slamoBoost: number;
    RNAPower: number;
    entropyPerSecondPower: number;
    cellResets: number;
    critEffectiveness: number;
    automatorEffectiveness: number;
    clickCooldown: number;
    slamoClickCooldown: number;
    critChance: number;
    critIIGuarantee: number;
    g1EffectFormula: number;
  };

  runtime: {
    timesClicked: number;
    totalEntropyClicks: number;
    lastClickTime: number;
    lastSlamoClickTime: number;
    formulaicEntropyClicks: number;
    automatorTickCounter: number;
  };

  upgradeState: Record<AllUpgradeIds, UpgradeStateEntry>;
  milestoneState: Record<AllMilestoneIds, MilestoneStateEntry>;

  flags: {
    unlocked: {
      slamo: boolean;
      theAutomator: boolean;
      cells: boolean;
    };
  };

  config: {
    ignoredStats: Array<string>;
    hideBoughtUpgrades: boolean;
  };
}

// import {
//   discoveryTiers,
//   dynamicMilestones,
//   entropyMilestones,
//   slamoMilestones,
//   upgradeLibrary,
// } from "../data";
// import { milestones } from "../data/milestones/milestoneData";
// import { State } from "../state";

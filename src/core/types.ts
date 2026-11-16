// types.ts

export interface Effect {
  name: string;
  effectFormula: (level: number, state: State) => any;
  type: "multiply" | "add" | "subtract";
}

export interface Upgrade {
  name: string;
  ID: string;
  maxLevel: number;
  costCurrency: "amoeba" | "RNA" | "kineticEnergy";
  effects: Effect[];

  unlock?: string;
  optional?: boolean;

  description: string;
  // If the returned function takes a level and returns a number:
  costFormula: (level: number, state: State) => number;

  onPurchase?: (level: number, state: State) => void;
}

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
  MilestoneBlueprint;


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
    saveInterval: number,
     notation: "scientific" | "engineering" | "standard" | "mixed",
      scientificNotationOoMs: number
      confirmations: {
        cells: boolean
      }
  };
}
export interface MilestoneBlueprint {
  ID: string;
  needed: number;
  description: string;
  type: "dynamic" | "static";
  category: "slamoMilestone" | "entropyMilestone" | "discoveryTier";
  stat: "slamoClicks" | "kineticEnergy";
  // Single function type that provides everything the milestone might want
  effect: ((ctx: { state: State; upgradeLibrary: Record<string, Upgrade>; }) => void) |
  null;
}

// data.js
// stores upgrade data and similar hard-coded data.

import { getRNASynergyMultiplier, getSynergyMultiplier } from "./synergy.js";
import { state, State } from "./state.js";
import { calculateU20Cost, getRNABurst } from "./cells.js";
import { createNext, getU2Mult, increaseStat } from "./imports.js";
export interface MilestoneBlueprint {
  ID: string;
  needed: number;
  description: string;
  type: string;
  category: string;
  stat: string;
  effect: ((state: State) => any) | ((upgradeLibrary: Upgrade[]) => any) | null;
}

export const milestones: MilestoneBlueprint[] = [
  // * SLAMO MILESTONES
  {
    ID: "M1",
    needed: 10,
    description: "+1% click power per slamo click, cap at 250.",
    type: "dynamic",
    category: "slamoMilestone",
    stat: "slamoClicks",

    // The linear slamo boost is calculated in getClickPower() so it cannot
    // compound by re-multiplying the already modified clickPower value.
    effect: null,
  },
  {
    ID: "M2",
    needed: 25,
    description: "+3 U2 max levels",
    type: "static",
    category: "slamoMilestone",
    stat: "slamoClicks",

    effect: (upgradeLibrary: Upgrade[]) => {
      upgradeLibrary[3].maxLevel += 3;
      return state;
    },
  },
  {
    ID: "M3",
    needed: 100,
    description: "-0.25s click cooldown",
    type: "static",
    category: "slamoMilestone",
    stat: "slamoClicks",

    effect: (state) => {
      return {
        ...state,
        stats: {
          ...state.stats,
          clickCooldown: state.stats.clickCooldown - 0.25,
        },
      };
    },
  },
  // * ENTROPY MILESTONES
  // TODO: Add more miletones past M3 after e20 amoeba, possibly unlocked by Discovery Tiers.
];

export interface Effect {
  name: string;
  effectFormula: (level: number, state?: State) => number | typeof state;
  type: "multiply" | "add" | "subtract";
}

export interface Upgrade {
  name: string;
  ID: string;
  maxLevel: number;
  costCurrency: "amoeba" | "RNA" | "entropy";
  effects: Effect[];

  unlock?: string;
  optional?: boolean;

  description: string;
  // If the returned function takes a level and returns a number:
  costFormula: (level: number, state: State) => number;

  onPurchase?: (level: number, state: State) => void;
}

export const upgradeLibrary: Record<string, Upgrade> = {
  // GLOBAL UPGRADES

  G1: {
    name: "Speedy clicks",
    ID: "G1",
    maxLevel: 5,
    costCurrency: "amoeba",

    effects: [
      {
        name: "clickCooldown",
        effectFormula: (level) => 1 / state.stats.g1EffectFormula ** level,
        type: "multiply",
      },
    ],

    description: "Decreases click cooldown.",

    costFormula: (level) => 1.45 ** level * 100,
  },
  G2: {
    name: "The Automator",
    ID: "G2",
    maxLevel: 10,
    costCurrency: "amoeba",

    effects: [
      {
        name: "automatorEffectiveness",
        effectFormula: (level) => 1 + level * 0.0125,
        type: "multiply",
      },
    ],

    unlock: "theAutomator",

    description:
      "Increases the effectiveness of the automated clicking system.",
    costFormula: (level) => 1.55 ** (1.2 / (level + 1)) * 2.5e4,
  },

  // MAIN UPGRADES (U1-U20)

  U1: {
    name: "The start",
    ID: "U1",
    maxLevel: 1,

    costCurrency: "amoeba",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 2,
        type: "multiply",
      },
    ],

    description: "Provides an initial multiplier to manual click power.",
    costFormula: () => 25,
  },
  U2: {
    name: "Repeatable",
    ID: "U2",
    maxLevel: 5,

    costCurrency: "amoeba",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level: number, state: State) => getU2Mult(level, state),
        type: "multiply",
      },
    ],

    description:
      "Multiplies manual click power repeatedly, with scalable bonuses based on your amoeba count later on.",
    costFormula: (level) => level * 1.2 * 40,
  },
  U3: {
    name: "Synergy",
    ID: "U3",
    maxLevel: 1,

    costCurrency: "amoeba",

    effects: [
      {
        name: "clickPower",
        effectFormula: () => getSynergyMultiplier(state),
        type: "multiply",
      },
    ],
    description:
      "Applies a dynamic synergy multiplier directly to your manual click power.",
    costFormula: () => 125,
  },
  U4: {
    name: "Critical",
    ID: "U4",
    maxLevel: 4,

    costCurrency: "amoeba",

    effects: [
      {
        name: "critChance",
        effectFormula: (level) => level * 4,
        type: "add",
      },
    ],

    description: "Adds a flat percentage bonus to your critical hit chance.",
    costFormula: (level) => level ** 0.7 * 200,
  },
  U5: {
    name: "Cellular growth",
    ID: "U5",
    maxLevel: 1,

    costCurrency: "amoeba",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 3,
        type: "multiply",
      },
    ],

    description: "Triples your manual click power to accelerate growth.",
    costFormula: () => 450,
  },
  U6: {
    name: "Experiments",
    ID: "U6",
    maxLevel: 1,

    costCurrency: "amoeba",

    effects: [
      {
        name: "critEffectiveness",
        effectFormula: (level) => 1 + level * 0.75,

        type: "multiply",
      },
      {
        name: "G1CostScaling",
        effectFormula: (level) => level * 0.05,
        type: "add",
      },
    ],

    optional: true,

    description:
      "Boosts critical hit effectiveness and increases G1 upgrade cost scaling.",
    costFormula: () => 1000,
  },
  U7: {
    name: "Synergism",
    ID: "U7",
    maxLevel: 1,

    costCurrency: "amoeba",

    effects: [
      {
        name: "amoeba",
        effectFormula: (level, state) => getSynergyMultiplier(state),
        type: "multiply",
      },
    ],

    description:
      "Enhances game progression by applying an additional synergy multiplier to your performance.",
    costFormula: () => 1675,
  },
  U8: {
    name: "Repeatable II",
    ID: "U8",
    maxLevel: 5,

    costCurrency: "amoeba",

    effects: [
      {
        name: "critEffectiveness",
        effectFormula: (level) => level * 0.1,
        type: "add",
      },
      {
        name: "clickCooldown",
        effectFormula: (level) => level * 0.05,
        type: "subtract",
      },
    ],

    description:
      "Provides incremental bonuses to critical effectiveness while reducing click cooldown.",
    costFormula: (level) => level ** 0.7 * 2000,
  },
  U9: {
    name: "Critical II",
    ID: "U9",
    maxLevel: 1,

    costCurrency: "amoeba",

    effects: [
      {
        name: "critIIGuarantee",
        effectFormula: (level) => level * 10,
        type: "multiply",
      },
    ],

    description:
      "Greatly multiplies the guarantee or chance of triggering level-two critical effects.",
    costFormula: () => 4500,
  },
  U10: {
    name: "The cube",
    ID: "U10",
    maxLevel: 1,

    costCurrency: "amoeba",

    unlock: "slamo",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 1.5,
        type: "multiply",
      },
    ],

    description: "Unlocks slamo and increases manual click power by 50%.",
    costFormula: () => 7500,
  },

  // =========
  // * U11-U20
  // ==========

  U11: {
    name: "slamo will like this",
    ID: "U11",
    maxLevel: 4,

    costCurrency: "amoeba",

    effects: [
      {
        name: "slamoClickPower",
        effectFormula: (level) => level,
        type: "add",
      },
      {
        name: "clickPower",
        effectFormula: (level) => level * 1.05,
        type: "multiply",
      },
    ],

    description:
      "Adds a flat bonus to slamo click power and multiplies general manual click power.",
    costFormula: (level) => level ** 0.7 * 10000,
  },
  U12: {
    name: "timewarp",
    ID: "U12",
    maxLevel: 1,

    costCurrency: "amoeba",

    effects: [
      {
        name: "g1EffectFormula",
        effectFormula: () => 0.01,
        type: "add",
      },
    ],

    description:
      "Alters time metrics by adding a flat bonus to the G1 speed calculation formula.",
    costFormula: () => 13500,
  },
  U13: {
    name: "Riskgrade",
    ID: "U13",
    maxLevel: 1,

    costCurrency: "amoeba",

    effects: [
      {
        name: "slamoM1Cap",
        effectFormula: () => 500,
        type: "add",
      },
      {
        name: "critIIGuarantee",
        effectFormula: () => 5,
        type: "multiply",
      },
    ],

    optional: true,

    description:
      "Raises the slamo M1 capacity cap and multiplies the tier-two critical guarantee.",
    costFormula: () => 9000,
  },
  U14: {
    name: "RNA has a purpose now",
    ID: "U14",
    maxLevel: 1,

    costCurrency: "amoeba",

    effects: [
      {
        name: "amoeba",
        effectFormula: (level) => level * 1.2,
        type: "multiply",
      },
      {
        name: "amoeba",
        effectFormula: () =>
          getRNASynergyMultiplier(state, upgradeLibrary) ?? 1,
        type: "multiply",
      },
    ],

    description:
      "Provides scalable multipliers to your total amoeba count based on RNA synergy.",
    costFormula: () => 23500,
  },
  U15: {
    name: "Loan",
    ID: "U15",
    maxLevel: 1,

    costCurrency: "amoeba",

    effects: [
      {
        name: "slamoClickPower",
        effectFormula: () => 0.66,
        type: "multiply",
      },
      {
        name: "clickPower",
        effectFormula: () => 0.9,
        type: "multiply",
      },
    ],

    optional: true,

    description:
      "Grants an immediate lump sum of amoebas at the expense of reducing click power and slamo click power.",
    costFormula: () => 17500,
    onPurchase: (level, state) =>
      increaseStat({
        target: state.resources,
        stat: "amoeba",
        amount: 20000,
        operation: "add",
      }),
  },
  U16: {
    name: "Exponential",
    ID: "U16",
    maxLevel: 1,

    costCurrency: "amoeba",
    effects: [
      {
        effectFormula: (level, state) => getU2Mult(level, state),
        name: "amoeba",
        type: "multiply",
      },
    ],
    description:
      "Unlocks an exponential growth mechanic that empowers previous repeatable clicking upgrades.",
    costFormula: () => 35000,
  },
  U17a: {
    name: "Automation/idle based",
    ID: "U17a",
    maxLevel: 1,

    costCurrency: "amoeba",

    effects: [
      {
        effectFormula: (level) => 1.5 * level,
        name: "automatorEffectiveness",
        type: "multiply",
      },
    ],
    description: "why",

    costFormula: () => 50000,
  },
  U17b: {
    name: "Active/manual focused",
    ID: "U17b",
    maxLevel: 1,

    costCurrency: "amoeba",

    effects: [
      {
        effectFormula: (level) => 1.5 * level,
        name: "amoeba",
        type: "multiply",
      },
      {
        effectFormula: () => 0.66,
        name: "automatorEffectiveness",
        type: "multiply",
      },
    ],

    description:
      "Multiplies amoeba production while reducing the overall effectiveness of your automator.",
    costFormula: () => 50000,
  },
  U18: {
    name: "I promise this is the last synergy upgrade",
    ID: "U18",
    maxLevel: 1,

    costCurrency: "amoeba",

    effects: [
      {
        name: "amoeba",
        effectFormula: (state) => getSynergyMultiplier(state),
        type: "multiply",
      },
    ],

    description:
      "Applies a final massive synergy multiplier to boost your progression capabilities.",
    costFormula: () => 120000,
  },
  U19: {
    name: "Calm before the storm",
    ID: "U19",
    maxLevel: 1,

    costCurrency: "amoeba",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 2,
        type: "multiply",
      },
    ],

    description:
      "Doubles your manual click power to prepare for late-game scaling.",
    costFormula: () => 175000,
  },
  U20: {
    name: "Cells",
    ID: "U20",
    maxLevel: 1,

    costCurrency: "amoeba",
    unlock: "cells",
    effects: [
      {
        name: "RNA",
        effectFormula: (state) => getRNABurst(state),
        type: "add",
      },
    ],
    description: "Unlocks the brand new 'cells' feature and progression tier.",

    costFormula: (level, state) => {
      const cellResets = state?.stats?.cellResets ?? 0;
      const formula = ((cellResets + 1) * 5) ** 1.5 * 250000;
      if (state) {
        const amoebaCount = state.resources.amoeba;
        if (amoebaCount >= formula) {
          state.resources.RNA += getRNABurst(state);
        }
        return 250000;
      }
      return 250000;
    },
    onPurchase: (level, state) => {
      state.flags.unlocked.cells = true;
    },
  },
  U99: {
    name: "Test",
    ID: "U99",
    maxLevel: 1000,
    costCurrency: "amoeba",
    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => 10 ** level,
        type: "multiply",
      },
    ],
    description:
      "Exponentially scales manual click power by orders of magnitude for testing purposes.",
    costFormula: () => 0,
  },
  // REPEATABLE UPGRADES
  RE1: {
    name: "Addition",
    ID: "RE1",
    maxLevel: 1000,
    costCurrency: "entropy",
    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => 1 + level * 0.2,
        type: "multiply",
      },
    ],
    description:
      "Provides a repeatable, linear multiplier to your total manual click power.",
    costFormula: (level) => (1 + level) ** 1.7 * 100,
  },
  RE2: {
    name: "Multiplication",
    ID: "RE2",
    maxLevel: 150,
    costCurrency: "entropy",
    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 2,
        type: "multiply",
      },
    ],
    description:
      "Doubles click power per level to rapidly accelerate manual resource generation.",
    costFormula: () => 25,
  },
  RE3: {
    name: "Exponentiation",
    ID: "RE3",
    maxLevel: 25,
    costCurrency: "entropy",
    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 2,
        type: "multiply",
      },
    ],
    description:
      "Significantly scales click power growth using an exponential multiplier structure.",
    costFormula: () => 25,
  },
  // Slamo DNA upgrades
  DNA_AGG: {
    name: "Aggressiveness",
    ID: "DNA_AGG",
    maxLevel: 6,
    costCurrency: "entropy",
    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 2,
        type: "multiply",
      },
    ],
    description:
      "Aggressively multiplies manual click power using accumulated entropy.",
    costFormula: () => 25,
  },
  DNA_ACTIVE: {
    name: "Active",
    ID: "DNA_ACTIVE",
    maxLevel: 6,
    costCurrency: "entropy",
    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 2,
        type: "multiply",
      },
    ],
    description:
      "Enhances active gameplay loops by scaling up manual click power.",
    costFormula: () => 25,
  },
  DNA_IDLE: {
    name: "Idle",
    ID: "DNA_IDLE",
    maxLevel: 6,
    costCurrency: "entropy",
    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 2,
        type: "multiply",
      },
    ],
    description:
      "Boosts baseline manual click power properties through specialized DNA mutation.",
    costFormula: () => 25,
  },
};

// milestone types.

export const slamoMilestones = milestones.filter(
  (entry) => entry.category === "slamoMilestone",
);

export const entropyMilestones = milestones.filter(
  (entry) => entry.category === "entropyMilestone",
);

export const discoveryTiers = milestones.filter(
  (entry) => entry.category === "discoveryTier",
);

export const dynamicMilestones = milestones.filter(
  (milestone) => milestone.type === "dynamic",
);

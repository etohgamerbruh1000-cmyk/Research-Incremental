// data.js
// stores upgrade data and similar hard-coded data.

import { calculateU20Cost } from "./cells.js";
import { getRNASynergyMultiplier, getSynergyMultiplier } from "./logic.js";
import { state } from "./state.js";

// This array of objects has a list of all milestones, and slamo-related data.

export const slamoData = {
  ID: "slamo",
  slamoClickPower: 1,
  slamoClicks: 0,

  slamoBoost: 0,
};

export const milestones = [
  // * SLAMO MILESTONES
  {
    ID: "M1",
    needed: 10,
    description: "+1% click power per slamo click, cap at 250.",
    type: "dynamic",
    category: "slamoMilestone",
    stat: "slamoClicks",

    claimed: false,

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

    claimed: false,

    effect: ({ upgrades }) => {
      const u2 = upgrades.find((u) => u.ID === "U2");
      u2.maxLevel += 3;
      return upgrades;
    },
  },
  {
    ID: "M3",
    needed: 100,
    description: "-0.25s click cooldown",
    type: "static",
    category: "slamoMilestone",
    stat: "slamoClicks",

    claimed: false,
    effect: ({ state }) => {
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

// milestone-related data

export let upgrades = [
  // GLOBAL UPGRADES

  {
    name: "Speedy clicks",
    ID: "G1",
    costCurrency: "amoeba",

    effects: [
      {
        name: "clickCooldown",
        effectFormula: (level) => 1 / state.stats.g1EffectFormula ** level,
        type: "multiply",
      },
    ],

    description: "Decreases click cooldown.",

    level: 0,
    maxLevel: 5,
    costFormula: (level) => 1.45 ** level * 100,
  },
  {
    name: "The Automator",
    ID: "G2",
    costCurrency: "amoeba",

    effects: [
      {
        name: "automatorEffectiveness",
        effectFormula: (level) => 1 + level * 0.0125,
        type: "multiply",
      },
    ],

    unlock: "theAutomator",

    level: 0,
    maxLevel: 10,
    costFormula: (level) => 1.55 ** (1.2 / (level + 1)) * 2.5e4,
  },

  // MAIN UPGRADES (U1-U20)

  {
    name: "The start",
    ID: "U1",

    costCurrency: "amoeba",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 2,
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 1,
    costFormula: () => 25,
  },
  {
    name: "Repeatable",
    ID: "U2",

    costCurrency: "amoeba",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => {
          let base = 1.15 ** level;
          const u16 = upgrades.find((u) => u.ID == "U16");
          if (u16.level >= 1) {
            base += Math.log10(1 + state.resources.amoeba) / 100;
          }
          return base;
        },
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 5,
    costFormula: (level) => level * 1.2 * 40,
  },
  {
    name: "Synergy",
    ID: "U3",

    costCurrency: "amoeba",

    effects: [
      {
        name: "clickPower",
        effectFormula: () => getSynergyMultiplier(),
        type: "multiply",
      },
    ],
    level: 0,
    maxLevel: 1,
    costFormula: () => 125,
  },
  {
    name: "Critical",
    ID: "U4",

    costCurrency: "amoeba",

    effects: [
      {
        name: "critChance",
        effectFormula: (level) => level * 4,
        type: "add",
      },
    ],

    level: 0,
    maxLevel: 4,
    costFormula: (level) => level ** 0.7 * 200,
  },

  {
    name: "Cellular growth",
    ID: "U5",

    costCurrency: "amoeba",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 3,
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 1,
    costFormula: () => 450,
  },
  {
    name: "Experiments",
    ID: "U6",

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

    level: 0,
    maxLevel: 1,
    costFormula: () => 1000,
  },
  {
    name: "Synergism",
    ID: "U7",

    costCurrency: "amoeba",

    effects: [
      {
        effectFormula: () => getSynergyMultiplier(),
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 1,
    costFormula: () => 1675,
  },
  {
    name: "Repeatable II",
    ID: "U8",

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

    level: 0,
    maxLevel: 5,
    costFormula: (level) => level ** 0.7 * 2000,
  },
  {
    name: "Critical II",
    ID: "U9",

    costCurrency: "amoeba",

    effects: [
      {
        name: "critIIGuarantee",
        effectFormula: (level) => level * 10,
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 1,
    costFormula: () => 4500,
  },
  {
    name: "The cube",
    ID: "U10",

    costCurrency: "amoeba",

    unlock: "slamo",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 1.5,
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 1,
    costFormula: () => 7500,
  },
  // =========
  // * U11-U20
  // ==========
  {
    name: "slamo will like this",
    ID: "U11",

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

    level: 0,
    maxLevel: 4,
    costFormula: (level) => level ** 0.7 * 10000,
  },
  {
    name: "timewarp",
    ID: "U12",

    costCurrency: "amoeba",

    effects: [
      {
        name: "g1EffectFormula",
        effectFormula: () => 0.01,
        type: "add",
      },
    ],

    level: 0,
    maxLevel: 1,
    costFormula: () => 13500,
  },
  {
    name: "Riskgrade",
    ID: "U13",

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

    level: 0,
    maxLevel: 1,
    costFormula: () => 9000,
  },
  {
    name: "RNA has a purpose now",
    ID: "U14",

    costCurrency: "amoeba",

    effects: [
      {
        name: "amoeba",
        effectFormula: (level) => level * 1.2,
        type: "multiply",
      },

      {
        name: "amoeba",
        effectFormula: () => getRNASynergyMultiplier(),
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 1,
    costFormula: () => 23500,
  },
  {
    name: "Loan",
    ID: "U15",

    costCurrency: "amoeba",

    effects: [
      {
        name: "amoeba",
        effectFormula: () => 20000,
        type: "add",
      },
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

    level: 0,
    maxLevel: 1,
    costFormula: () => 17500,
  },

  {
    name: "Exponential",
    ID: "U16",

    costCurrency: "amoeba",

    level: 0,
    maxLevel: 1,
    costFormula: () => 35000,
  },
  {
    name: "Automation/idle based",
    ID: "U17a",

    costCurrency: "amoeba",

    effects: [
      {
        effectFormula: (level) => 1.5 * level,
        name: "automatorEffectiveness",
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 1,
    costFormula: () => 50000,
  },
  {
    name: "Active/manual focused",
    ID: "U17b",

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

    level: 0,
    maxLevel: 1,
    costFormula: () => 50000,
  },
  {
    name: "I promise this is the last synergy upgrade",
    ID: "U18",

    costCurrency: "amoeba",

    effects: [
      {
        effectFormula: () => getSynergyMultiplier(),
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 1,
    costFormula: () => 120000,
  },
  {
    name: "Calm before the storm",
    ID: "U19",

    costCurrency: "amoeba",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 2,
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 1,
    costFormula: () => 175000,
  },
  {
    name: "Cells",
    ID: "U20",

    costCurrency: "amoeba",
    unlock: "cells",

    level: 0,
    maxLevel: 1,
    costFormula: () => calculateU20Cost(),
  },

  {
    name: "Test",
    ID: "U99",

    costCurrency: "amoeba",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => 10 ** level,
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 100,
    costFormula: () => 0,
  },

  // REPEATABLE UPGRADES
  // FIXME: BALANCE RE1-3
  // TODO: ADD COMPATIBILITY FOR 2 COSTS IN BUY UPGRADE
  // TODO: ADD RENDERING OF COSTS
  {
    name: "Addition",
    ID: "RE1",

    costCurrency: "entropy",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => 1 + level * 0.2,
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 100,
    costFormula: (level) => (1 + level) ** 1.7 * 100,
  },
  {
    name: "Multiplication",
    ID: "RE2",

    costCurrency: "entropy",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 2,
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 1,
    costFormula: () => 25,
  },
  {
    name: "Exponentiation",
    ID: "RE3",

    costCurrency: "entropy",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 2,
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 1,
    costFormula: () => 25,
  },

  // ! =- Slamo DNA upgrades -=
  // TODO: Change cost + effect formulas

  {
    name: "Aggressiveness",
    ID: "DNA_AGG",

    costCurrency: "entropy",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 2,
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 10,
    costFormula: () => 25,
  },
  {
    name: "Active",
    ID: "DNA_ACTIVE",

    costCurrency: "entropy",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 2,
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 10,
    costFormula: () => 25,
  },
  {
    name: "Idle",
    ID: "DNA_IDLE",

    costCurrency: "entropy",

    effects: [
      {
        name: "clickPower",
        effectFormula: (level) => level * 2,
        type: "multiply",
      },
    ],

    level: 0,
    maxLevel: 10,
    costFormula: () => 25,
  },
];

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

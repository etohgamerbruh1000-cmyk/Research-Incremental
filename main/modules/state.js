// state.js
//handles player state

export let state = {
  resources: {
    amoeba: 0,
    RNA: 0,
    highestRNA: 0,
    entropy: 0,
  },

  stats: {
    clickPower: 1,
    RNAPower: 0.01,

    cellResets: 1,

    critEffectiveness: 2,
    // 33% automator amoeba compared to normal click
    automatorEffectiveness: 0.33,
    clickCooldown: 0.5,
    slamoClickCooldown: 3,

    critChance: 0,
    critIIGuarantee: 0,

    // TODO: move elsewhere.
    g1EffectFormula: 1.025,
  },

  runtime: {
    timesClicked: 0,
    totalEntropyClicks: 0,
    lastClickTime: 0,
    lastSlamoClickTime: 0,
    formulaicEntropyClicks: 0,
    automatorTickCounter: 5,
  },

  // upgrade catalog of level/maxLevel.
  upgrades: {
    G1: { level: 0, maxLevel: 5 },
    G2: { level: 0, maxLevel: 10 },

    U1: { level: 0, maxLevel: 1 },
    U2: { level: 0, maxLevel: 5 },
    U3: { level: 0, maxLevel: 1 },
    U4: { level: 0, maxLevel: 4 },
    U5: { level: 0, maxLevel: 1 },
    U6: { level: 0, maxLevel: 1 },
    U7: { level: 0, maxLevel: 1 },
    U8: { level: 0, maxLevel: 5 },
    U9: { level: 0, maxLevel: 1 },
    U10: { level: 0, maxLevel: 1 },
    U11: { level: 0, maxLevel: 4 },
    U12: { level: 0, maxLevel: 1 },
    U13: { level: 0, maxLevel: 1 },
    U14: { level: 0, maxLevel: 1 },
    U15: { level: 0, maxLevel: 1 },
    U16: { level: 0, maxLevel: 1 },
    U17: { level: 0, maxLevel: 1 },
    U18: { level: 0, maxLevel: 1 },
    U19: { level: 0, maxLevel: 1 },
    U20: { level: 0, maxLevel: 1 },
  },

  milestones: {
    M1: { claimed: false },
    M2: { claimed: false },
    M3: { claimed: false },
  },

  flags: {
    unlocked: {
      cells: false,
    },
  },
};

export const resettableKeys = [
  "amoeba",
  "timesClicked",
  "clickPower",
  "critChance",
  "critEffectiveness",
  "clickCooldown",
  // TODO: INCLUDE SLAMO CLICKS + SLAMO CLICK POWER
  "critIIGuarantee",
];

// snapshot taken once, at true game start before any playing happens.
export const initialState = structuredClone(state);

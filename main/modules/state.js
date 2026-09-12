// state.js
//handles player state

export function makeInitialState() {
  // snapshot taken once, at true game start before any playing happens.
  const initialState = structuredClone(state);
}
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
  upgradeState: {
    G1: { ID: "G1", level: 0, maxLevel: 5 },
    G2: { ID: "G2", level: 0, maxLevel: 10 },
    U1: { ID: "U1", level: 0, maxLevel: 1 },
    U2: { ID: "U2", level: 0, maxLevel: 5 },
    U3: { ID: "U3", level: 0, maxLevel: 1 },
    U4: { ID: "U4", level: 0, maxLevel: 4 },
    U5: { ID: "U5", level: 0, maxLevel: 1 },
    U6: { ID: "U6", level: 0, maxLevel: 1 },
    U7: { ID: "U7", level: 0, maxLevel: 1 },
    U8: { ID: "U8", level: 0, maxLevel: 5 },
    U9: { ID: "U9", level: 0, maxLevel: 1 },
    U10: { ID: "U10", level: 0, maxLevel: 1 },
    U11: { ID: "U11", level: 0, maxLevel: 4 },
    U12: { ID: "U12", level: 0, maxLevel: 1 },
    U13: { ID: "U13", level: 0, maxLevel: 1 },
    U14: { ID: "U14", level: 0, maxLevel: 1 },
    U15: { ID: "U15", level: 0, maxLevel: 1 },
    U16: { ID: "U16", level: 0, maxLevel: 1 },
    U17: { ID: "U17", level: 0, maxLevel: 1 },
    U18: { ID: "U18", level: 0, maxLevel: 1 },
    U19: { ID: "U19", level: 0, maxLevel: 1 },
    U20: { ID: "U20", level: 0, maxLevel: 1 },
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

export function replaceState(next) {
  state = next;
}

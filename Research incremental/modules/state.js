// state.js
//handles player state

export let state = {
  // currencies
  timesClicked: 0,
  totalEntropyClicks: 0,
  lastClickTime: 0,
  lastSlamoClickTime: 0,
  formulaicEntropyClicks: 0,
  automatorTickCounter: 5,
  amoeba: 0,
  RNA: 0,
  highestRNA: 0,
  entropy: 0,
  
  // formulas :D
  g1EffectFormula: 1.025,

  // clickPower
  clickPower: 1,
  RNAPower: 0.01,
  // slamoBoost calculated in decimal, not percent.
  M1Boost: 1,
  cellResets: 1,

  critEffectiveness: 2,
  // 33% automator amoeba gains/click compared to normal click...
  automatorEffectiveness: 0.33,

  // cooldowns
  clickCooldown: 0.5,
  slamoClickCooldown: 3,

  // chances
  critChance: 0,
  critIIGuarantee: 0,

  // unlocks
  unlocked: {
    ID: "unlocks",
    cells: false,
  },
};

export const resettableKeys = [
  "amoeba",
  "timesClicked",
  "clickPower",
  "critChance",
  "critEffectiveness",
  "clickCooldown",
  "M1Boost",
  // TODO: INCLUDE SLAMO CLICKS + SLAMO CLICK POWER
  "critIIGuarantee",
];

// snapshot taken once, at true game start before any playing happens.
export const initialState = structuredClone(state);

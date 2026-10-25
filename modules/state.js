// state.js
//handles player state

import { upgradeLibrary } from "./data.js";
import { createNext } from "./imports.js";

export function makeInitialState() {
  // snapshot taken once, at true game start before any playing happens.
  return structuredClone(state);
}
export let state = {
  resources: {
    amoeba: 0,
    RNA: 0,
    highestRNA: 0,
    entropy: 0,
    slamoClicks: 0,
    slamoBoost: 0,
  },

  stats: {
    clickPower: 1,
    slamoClickPower: 1,
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

  // writable upgrade catalog of level/maxLevel.
  upgradeState: {},

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

// 2. Dynamically populate the player's upgrade registry from your catalog array
const next = createNext();
upgradeLibrary.forEach((upgrade) => {
  next.upgradeState[upgrade.ID] = {
    ID: upgrade.ID,
    level: 0,
    // Safely pull the maxLevel from the catalog, defaulting to 1 if it's missing
    maxLevel: upgrade.maxLevel !== undefined ? upgrade.maxLevel : 1,
  };
});

export const resettableKeys = {
  // TODO: fix the ARCHITECTURE MATEY
  cells: [
    state.resources.amoeba,
    state.resources.clickPower,
    state.resources.slamoClickCooldown,
    state.resources.slamoBoost,
    state.resources.slamoClicks,
    state.resources.timesClicked,
    state.resources.clickCooldown,
    state.resources.critChance,
    state.resources.critEffectiveness,
    state.resources.critIIGuarantee,
  ],
};

export function replaceState(replaced) {
  state = replaced;
}

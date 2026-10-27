// state.js state.ts
//handles player state

import { upgradeLibrary } from "./data.js";
import { createNext } from "./imports.js";

export function makeInitialState(): State {
  // snapshot taken once, at true game start before any playing happens.

const initialState = structuredClone(state);
  initialState 
  return initialState
}

export interface State {
  resources: {
    amoeba: number;
    RNA: number;
    highestRNA: number;
    entropy: number;
    slamoClicks: number;
  };

  stats: {
    clickPower: number;
    slamoClickPower: number;
    slamoBoost: number;
    RNAPower: number;
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

  upgradeState: Record<string, { level: number; maxLevel: number } | any>;

  milestones: Record<string, { claimed: boolean }>;

  flags: {
    unlocked: {
      cells: boolean;
    };
  };
}

export let state = {
  resources: {
    amoeba: 0,
    RNA: 0,
    highestRNA: 0,
    entropy: 0,
    slamoClicks: 0,
  },

  stats: {
    clickPower: 1,
    slamoClickPower: 1,
    slamoBoost: 0,
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
// 1. Define your custom upgrade caps in one clear place
const upgMaxCaps = {
  G1: 5,
  G2: 10,
  U2: 5,
  U4: 4,
  U8: 5,
  U11: 4,
};

upgradeLibrary.forEach((upgrade) => {
  // 2. Determine the default cap fallback from your configuration mapping
  const catalogMaxCap =
    upgMaxCaps[upgrade.ID] !== undefined
      ? upgMaxCaps[upgrade.ID]
      : 1;

  next.upgradeState[upgrade.ID] = {
    ID: upgrade.ID,
    level: 0,
    // 3. Check old state first (with safe '?.' checking); fall back to your custom cap configuration if missing
    maxLevel:
      state?.upgradeState?.[upgrade.ID]?.maxLevel !== undefined
        ? state.upgradeState[upgrade.ID].maxLevel
        : catalogMaxCap,
  };
});

export interface resettableKeys {
  // TODO: fix the ARCHITECTURE MATEY
  cells: [
    resources: Array<keyof State["resources"]>,
    stats: Array<keyof State["stats"]>,
  ];
}

export const resettableKeys = {
  // TODO: fix the ARCHITECTURE MATEY
  cells: [
    // Resources
    state.resources.amoeba,
    state.resources.slamoClicks,

    // Stats
    state.stats.clickPower,
    state.stats.slamoClickCooldown,
    state.stats.slamoBoost,
    state.stats.clickCooldown,
    state.stats.critChance,
    state.stats.critEffectiveness,
    state.stats.critIIGuarantee,
  ],
};

export function replaceState(replaced: State) {
  state = replaced;
}

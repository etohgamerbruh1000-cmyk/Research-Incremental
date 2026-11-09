import type {
  AllMilestoneIds,
  AllUpgradeIds,
  MilestoneStateEntry,
  State,
  UpgradeStateEntry,
} from "./core/types";
import { upgradeLibrary } from "./data";
export let state: State;

/**
 * Creates the initial fresh game state.
 * Accepts optional dynamic IDs to partially reset or explicitly scope upgrade/milestone initialization.
 */
export function makeInitialState(
  startingUpgradeIDs?: AllUpgradeIds[],
  startingMilestoneIDs?: AllMilestoneIds[],
): State {
  // 1. Build initial upgrade states dynamically from library (or provided subset)
  const targetUpgradeIDs =
    startingUpgradeIDs ??
    (Object.values(upgradeLibrary).map((u) => u.ID) as AllUpgradeIds[]);
  const upgradeState: Record<AllUpgradeIds, UpgradeStateEntry> = {};
  targetUpgradeIDs.forEach((id) => {
    upgradeState[id] = { level: 0, bonusMax: 0 };
  });

  // 2. Build initial milestone states dynamically (or provided subset)
  const targetMilestoneIDs =
    startingMilestoneIDs ?? ([] as AllMilestoneIds[]);
  const milestoneState: Record<AllMilestoneIds, MilestoneStateEntry> = {};

  targetMilestoneIDs.forEach((id) => {
    milestoneState[id] = { claimed: false };
  });

  // 3. Fallback logic: If global state exists, we can extract non-reset properties
  const everythingElse = state
    ? {
        resources: { ...state.resources },
        stats: { ...state.stats },
        runtime: { ...state.runtime },
        flags: { ...state.flags },
        config: { ...state.config },
      }
    : null;

  return {
    // If a current state exists, carry over non-reset data; otherwise, populate default values
    resources: everythingElse?.resources ?? {
      amoeba: 0,
      RNA: 0,
      highestRNA: 0,
      kineticEnergy: 0,
      slamoClicks: 0,
    },

    stats: everythingElse?.stats ?? {
      clickPower: 1,
      slamoClickPower: 1,
      slamoBoost: 0,
      RNAPower: 0.01,
      entropyPerSecondPower: 1,
      cellResets: 0,
      critEffectiveness: 2,
      automatorEffectiveness: 0.33, // 33% automator amoeba compared to normal click
      clickCooldown: 0.5,
      slamoClickCooldown: 3,
      critChance: 0,
      critIIGuarantee: 0,
      g1EffectFormula: 1.025,
    },

    runtime: everythingElse?.runtime ?? {
      timesClicked: 0,
      totalEntropyClicks: 0,
      lastClickTime: 0,
      lastSlamoClickTime: 0,
      formulaicEntropyClicks: 0,
      automatorTickCounter: 5,
    },

    upgradeState,
    milestoneState,

    flags: everythingElse?.flags ?? {
      unlocked: {
        slamo: false,
        theAutomator: false,
        cells: false,
      },
    },

    config: everythingElse?.config ?? {
      ignoredStats: [],
      hideBoughtUpgrades: false,
    },
  };
}

/**
 * Replaces the current active game state instance.
 */
export function replaceState(replaced: State): void {
  state = replaced;
}

export interface resettableKeys {
  cells: [
    resources: Array<keyof State["resources"]>,
    stats: Array<keyof State["stats"]>,
  ];
}

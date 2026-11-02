// reset.ts

import { upgradeLibrary } from "./data.js";
import { makeInitialState, state } from "./state.js";

// 2. Enforce that type on your array and lock it with 'as const'

// 1. Define your source of truth using string keys
export const CELL_RESET = {
  resources: ["amoeba", "slamoClicks"],
  stats: [
    "clickPower",
    "clickCooldown",
    "critChance",
    "critEffectiveness",
    "critIIGuarantee",
    "slamoBoost",
    "slamoClickCooldown",
  ],
} as const;

// 2. Type-safe exceptions array linked directly to your library
type UpgradeID = keyof typeof upgradeLibrary;

const exceptions: readonly UpgradeID[] = [
  "DNA_AGG",
  "DNA_IDLE",
  "DNA_ACTIVE",
  "RE1",
  "RE2",
  "RE3",
] as const;

// 3. Your fully functional reset function
export function resetAllStats() {
  const fresh = makeInitialState();

  // Reset resources & stats using the keys from CELL_RESET
  for (const k of CELL_RESET.resources) {
    state.resources[k] = fresh.resources[k];
  }
  for (const k of CELL_RESET.stats) {
    state.stats[k] = fresh.stats[k];
  }

  // Reset upgrade levels unless they are protected in your exceptions array
  for (const id of Object.keys(state.upgradeState) as UpgradeID[]) {
    // Check if it's a real upgrade in your library AND not an exception

    if (id in upgradeLibrary && !exceptions.includes(id)) {
      if (state.upgradeState[id]) {
        state.upgradeState[id].level = 0;
      } else {
        // Optional: Initialize it if it doesn't exist
        state.upgradeState[id] = { level: 0, bonusMax: 0 };
      }
    }
  }
}

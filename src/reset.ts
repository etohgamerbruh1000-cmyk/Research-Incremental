// reset.ts

import { State } from "@/core/types";
import { upgradeLibrary } from "./data";

// 1. Define the interface mapping directly to the keys of State
export interface Resettable {
  readonly resources: readonly (keyof State["resources"])[];
  readonly stats: readonly (keyof State["stats"])[];
}


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
} as const satisfies Resettable; // readonly assertion ensures immutability and type safety

// 2. Type-safe exceptions array linked directly to your library
type UpgradeID = keyof typeof upgradeLibrary;



export const CELL_UPG_EXCEPTIONS: UpgradeID[] = [
  "DNA_AGG",
  "DNA_IDLE",
  "DNA_ACTIVE",
  "RE1",
  "RE2",
  "RE3",
] as const satisfies UpgradeID[];

export function resetUpgrades(state: State, exceptions: UpgradeID[]) {
  // Reset upgrade levels unless they are protected in your exceptions array
  for (const id of Object.keys(state.upgradeState) as UpgradeID[]) {
    if (id in upgradeLibrary && !exceptions.includes(id)) {
      if (state.upgradeState[id]) {
        state.upgradeState[id].level = 0;
      } else {
        // Optional: Initialize it if it doesn't exist
        state.upgradeState[id] = { level: 0, bonusMax: 0 };
        console.error(`Upgrade state for ${id} was undefined. Initialized to level 0.`);
      }
    }
  }
}
export function resetStats<T extends Resettable>(
  state: State,
  fresh: State,
  resettable: T,
) {
  for (const k of resettable.resources) {
    state.resources[k] = fresh.resources[k];
  }
  for (const k of resettable.stats) {
    state.stats[k] = fresh.stats[k];
  }
}

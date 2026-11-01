// reset.ts

import { makeInitialState } from "./state.js";
import { upgradeLibrary } from "./data.js";

export function resetAllStats() {
  const fresh = makeInitialState();

  for (const k of CELL_RESET.resources) state.resources[k] = fresh.resources[k];
  for (const k of CELL_RESET.stats) state.stats[k] = fresh.stats[k];

  for (const id of Object.keys(state.upgradeState))
    // Safely check if your ID string exists as a valid key inside your library definitions
    if (!(exceptions in upgradeLibrary)) {
      // Your code here runs if the ID is NOT found
    }

  if (!exceptions.includes(id)) {
    state.upgradeState[id].level = 0;
  }
}

// 1. Create a type that extracts the exact valid keys from your upgrade library
type UpgradeID = keyof typeof upgradeLibrary;

// 2. Enforce that type on your array and lock it with 'as const'
const exceptions: UpgradeID[] = [
  "DNA_AGG",
  "DNA_IDLE",
  "DNA_ACTIVE",
  "RE1",
  "RE2",
  "RE3",
  "Himmat" // TypeScript will now yell at you if you misspell any of these!
] as const;

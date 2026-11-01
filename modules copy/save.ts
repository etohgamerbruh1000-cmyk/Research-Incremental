// save.js
// handles browser reload saving
// will handle cloud save soon

import { replaceState, State } from "./state.js";

const SAVE_KEY = "rir-save-v0";

export function saveGame(state: State) {
  // 1. Structural check: Ensure the input object actually has data before stringifying
  if (!state || Object.keys(state).length === 0) {
    console.error("Save aborted: Active state object is missing or empty.");
    return false;
  }

  try {
    const saveString = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, saveString);
    return true; // Explicitly confirm save success
  } catch (error) {
    // 2. Safe Fallback: Handle storage full or private browsing blocks gracefully
    console.error("Failed to write save to localStorage:", error.message);
    return false;
  }
}

export function loadGame() {
  const saveData = localStorage.getItem(SAVE_KEY);

  // 1. Safe path for brand new players
  if (saveData === null) {
    return null;
  }

  try {
    const parsedState = JSON.parse(saveData);

    // 2. Validate the data shape: Ensure crucial structural nodes exist
    if (
      !parsedState ||
      typeof parsedState !== "object" ||
      !parsedState.resources
    ) {
      console.warn("Save data layout is malformed or corrupted.");
      return null;
    }

    return parsedState;
  } catch (error) {
    // 3. Prevent startup freeze: catch string corruption errors cleanly
    console.error("Failed to parse save data string:", error.message);
    return null;
  }
}

export function createNext(state: State) {
  const next = structuredClone(state);
  return next;
}

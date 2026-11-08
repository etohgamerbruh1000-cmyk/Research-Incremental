// save.js
// handles browser reload saving
// will handle cloud save soon

import { SAVE_KEY } from "./core/config";
import { State } from "./state";

export function saveGame(state: State): boolean {
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
    // Check if it's a standard Error object before reading .message
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to write save to localStorage:", errorMessage);
    return false;
  }
}

export function loadGame(): State | null {
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
    // Check if it's a standard Error object before reading .message
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to write save to localStorage:", errorMessage);
    return null;
  }
}

export function createNext(state: State) {
  const next = structuredClone(state);
  return next;
}

// cells.js
// responsible for handling the cells reset, cell mechanics, and slamo DNA.
// * currently working on: adding cell as a html
// TODO: Add U20 escalating cost, add RE1-2-3 addition upon certain RNA reset points
// TODO: REMEMBER TO CALL EACH FUNCTION

// [x] Add highest rna variable

import { upgrades } from "./data.js";
import { initialState, resettableKeys, state } from "./state.js";

// sets all upgrades and stats to 0 to prevent people from resetting infinitely
export function resetStats() {
  let RNAGain = getRNABurst();
  if (state.unlocked.cells) {
  cellUnlock();
}
  checkREUnlocks();
  console.log(`[RESET] Your highest amoeba this reset was: ${state.amoeba}`);
  console.log(`[RESET] You resetted for: ${RNAGain} RNA.`);
  console.log(`[RESET] You unlocked upgrades ${checkREUnlocks()} this reset!`);

  state.cellResets += 1; // drives U20's escalating cost
  state.RNA += RNAGain;
  resettableKeys.forEach((key) => {
    state[key] = initialState[key];
  });
  resetUpgrades();
}

export function resetUpgrades() {
  upgrades.forEach((upgrade) => {
    if (upgrade) {
      upgrade.level = 0;
    }
  });
}

// * this function does not use getEffectsFor
// FIXME: Balance if neccesary

export function calculateU20Cost() {
  // not called yet
  let cost = 250000;
  cost = (state.cellResets * 5) ** 1.15 * 250000;
  return cost;
}

export function calculateEntropyToAmoebaBoost() {
  let boost = 1;
  if (state.unlocked.cells) {
    boost = 1 + state.entropy ** 0.2 * 0.5;
  }
  return boost;
}

export function getRNABurst() {
  let RNA = 100;
  // TODO: Implement formula, change and debug accordingly
  RNA = state.cellResets ** 1.67 * (10 + Math.sqrt(state.amoeba ** 0.3));
  if (RNA > state.highestRNA) {
    state.highestRNA = RNA;
  }
  return RNA;
}

export function unlockUpgrade(ID) {
  // TODO: there is no selected button, giving a warn
  const selectedButton = document.getElementById(ID);

  if (!selectedButton) {
    console.warn(`unlockUpgrade: no card found for ID "${ID}"`);
    return;
  }

  selectedButton.classList.remove("hide");
}

// * Connect cellUnlock
export function cellUnlock() {
  const cell = document.getElementById("cell");
  cell.classList.remove("hide");
}

export function checkREUnlocks() {
  let highestRNA = state.highestRNA;
  let unlockedREs = [0, 0, 0];
  if (state.highestRNA >= 10) {
    unlockUpgrade("card-RE1");
    unlockedREs[0] = "RE1";
  }

  if (state.highestRNA >= 20) {
    unlockUpgrade("card-RE2");
    unlockedREs[1] = "RE2";
  }

  if (state.highestRNA >= 50) {
    unlockUpgrade("card-RE3");
    unlockedREs[2] = "RE3";
  }
  return unlockedREs;
}

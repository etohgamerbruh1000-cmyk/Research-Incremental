// cells.js
// responsible for handling the cells reset, cell mechanics, and slamo DNA.
// * currently working on: adding cell as a html

// TODO: REMEMBER TO CALL EACH FUNCTION
// TODO: ADD ENTROPY MILESTONES

import { entropyMilestones, upgrades } from "./data.js";
import { unhideElement } from "./render.js";
import { initialState, resettableKeys, state } from "./state.js";

// sets all upgrades and stats to 0 to prevent people from resetting infinitely
export function resetStats() {
  let RNAGain = getRNABurst();
  if (state.unlocked.cells) {
    const cell = document.getElementById("cell");
    const switchToCells = document.getElementById("switchToCells");
    unhideElement(cell);
    unhideElement(switchToCells);
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

// FIXME: Balance if neccesary

export function calculateU20Cost() {
  let cost = 250000;
  if (state.unlocked.cells) {
    cost = (state.cellResets * 5) ** 1.15 * 250000;
  }
  return cost;
}

// ===============
// * =- ENTROPY -=
// ===============

export function calculateEntropyToAmoebaBoost() {
  let boost = 1;
  if (state.unlocked.cells && entropyMilestones[0] === "EM1") {
    boost = 1 + state.entropy ** 0.1 * 0.25;
  }
  if (state.unlocked.cells && entropyMilestones[1] === "EM2") {
    boost = 1 + state.entropy ** 0.15 * 0.25;
  }
  return boost;
}

export function getRNABurst() {
  let RNA;
  // TODO: Implement formula, change and debug accordingly
  RNA = state.cellResets ** 1.67 * (10 + Math.sqrt(state.amoeba ** 0.3));
  if (RNA > state.highestRNA) {
    state.highestRNA = RNA;
  }
  return RNA;
}

export function unlockUpgrade(ID) {
  const selectedButton = document.getElementById(ID);

  if (!selectedButton) {
    console.warn(`unlockUpgrade: no card found for ID "${ID}"`);
    return;
  }

  unhideElement(selectedButton);
}



// TODO: Delete this soon
let unlockedREs = [0, 0, 0, 0];
export function checkREUnlocks() {
  // placeholder var for cleanliness
  let highestRNA = state.highestRNA;

  if (state.highestRNA >= 10 && unlockedREs[0] !== "RE1") {
    unlockUpgrade("card-RE1");
    unlockedREs[0] = "RE1";
  }

  if (state.highestRNA >= 17 && unlockedREs[1] !== "RE2") {
    unlockUpgrade("card-RE2");
    unlockedREs[1] = "RE2";
  }

  if (state.highestRNA >= 35 && unlockedREs[2] !== "RE3") {
    unlockUpgrade("card-RE3");
    unlockedREs[2] = "RE3";
  }

  if (state.highestRNA >= 50 && unlockedREs[3] !== "Slamo DNA") {
    unlockedREs[3] = "Slamo DNA";
    unlockSlamoDNA();
  }
  return unlockedREs.filter(Boolean);
}

export function unlockSlamoDNA() {
  const dnaMachine = document.getElementById("dnaMachine");

  unhideElement(dnaMachine);
}

export function getCellEntropyMultiplier() {
  let multiplier;
  multiplier = 1 + state.formulaicEntropyClicks ** 0.2 * 0.5;
  multiplier = Math.min(multiplier, 2);
  return multiplier;
}

export function updateCellEntropyMultiplier() {
  state.formulaicEntropyClicks -= 0.05;
  state.formulaicEntropyClicks = Math.max(0, state.formulaicEntropyClicks);
}

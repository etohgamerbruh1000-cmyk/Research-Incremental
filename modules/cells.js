// cells.js
// responsible for handling the cells reset, cell mechanics, and slamo DNA.

// TODO: REMEMBER TO CALL EACH FUNCTION
// TODO: ADD ENTROPY MILESTONES

import { entropyMilestones } from "./data.js";

import { makeInitialState, resettableKeys } from "./state.js";

// sets all upgrades and stats to 0 to prevent people from resetting infinitely
export function resetStats(state) {
  const initialState = makeInitialState();
  const RNAGain = getRNABurst();
  if (state.flags.unlocked.cells) {
    const cell = document.getElementById("cell");
    const switchToCells = document.getElementById("switchToCells");
    cell.classList.remove("hide");
    switchToCells.classList.remove("hide");
  }
  checkUpgradeUnlocks();
  console.log(
    `[RESET] Your highest amoeba this reset was: ${state.resources.amoeba}`,
  );
  console.log(`[RESET] You resetted for: ${RNAGain} RNA.`);
  console.log(
    `[RESET] You unlocked upgrades ${checkUpgradeUnlocks()} this reset!`,
  );

  state.stats.cellResets += 1; // drives U20's escalating cost
  state.resources.RNA += RNAGain;
  resettableKeys.forEach((key) => {
    state[key] = initialState[key];
  });
  const resettedUpgradeExceptions = ["DNA_AGG", "DNA_ACTIVE", "DNA_IDLE"];
  resetUpgrades(state, resettedUpgradeExceptions);
}

// global function :DDD
// TODO: check params (included 2 params instead of 1)
export function resetUpgrades(state, resetUpgExceptions) {
  if (!state || !state.upgradeState) {
    console.error("Unknown state object or upgrade state");
    return false;
  }
  for (const upg of Object.values(state.upgradeState)) {
    if (resetUpgExceptions.includes(upg.ID)) {
      continue;
    } else {
      state.upgrades[upg.ID].level = 0;
    }
  }
  return true;
}

// ===============
// * =- ENTROPY -=
// ===============

export function calculateEntropyToAmoebaBoost(state) {
  let boost = 1;
  if (state.flags.unlocked.cells && entropyMilestones[0] === "EM1") {
    boost = 1 + state.resources.entropy ** 0.1 * 0.25;
  }
  if (state.flags.unlocked.cells && entropyMilestones[1] === "EM2") {
    boost = 1 + state.resources.entropy ** 0.15 * 0.25;
  }
  return boost;
}

export function getRNABurst(state) {
  // TODO: Implement formula, change and debug accordingly
  const RNA =
    state.stats.cellResets ** 1.67 *
    (10 + Math.sqrt(state.resources.amoeba ** 0.3));
  if (RNA > state.resources.highestRNA) {
    state.resources.highestRNA = RNA;
  }
  return RNA;
}

export function unlockUpgrade(ID) {
  const selectedButton = document.getElementById(ID);

  if (!selectedButton) {
    console.warn(`unlockUpgrade: no card found for ID "${ID}"`);
    return;
  }

  selectedButton.classList.remove("hide");
}

// TODO: Delete this soon
const unlockedREs = [0, 0, 0, 0];
export function checkUpgradeUnlocks(state, lockedUpgs) {
  if (state.resources.highestRNA >= 10 && unlockedREs[0] !== "RE1") {
    unlockUpgrade("card-RE1");
    unlockedREs[0] = "RE1";
  }

  if (state.resources.highestRNA >= 17 && unlockedREs[1] !== "RE2") {
    unlockUpgrade("card-RE2");
    unlockedREs[1] = "RE2";
  }

  if (state.resources.highestRNA >= 35 && unlockedREs[2] !== "RE3") {
    unlockUpgrade("card-RE3");
    unlockedREs[2] = "RE3";
  }

  if (state.resources.highestRNA >= 50 && unlockedREs[3] !== "Slamo DNA") {
    unlockedREs[3] = "Slamo DNA";
    unlockSlamoDNA();
  }
  return unlockedREs.filter(Boolean);
}

export function unlockSlamoDNA() {
  const dnaMachine = document.getElementById("dnaMachine");

  dnaMachine.classList.remove("hide");
}

export function getCellEntropyMultiplier(state) {
  let multiplier;
  multiplier = 1 + state.runtime.formulaicEntropyClicks ** 0.2 * 0.5;
  multiplier = Math.min(multiplier, 2);
  return multiplier;
}

export function updateCellEntropyMultiplier(state) {
  state.runtime.formulaicEntropyClicks -= 0.05;
  state.runtime.formulaicEntropyClicks = Math.max(
    0,
    state.runtime.formulaicEntropyClicks,
  );
}

export function calculateU20Cost(state) {
  return ((state.stats.cellResets + 1) * 5) ** 1.15 * 250000;
}

// cells.js
// responsible for handling the cells reset, cell mechanics, and slamo DNA.

// TODO: REMEMBER TO CALL EACH FUNCTION
// TODO: ADD ENTROPY MILESTONES

import { entropyMilestones } from "./data.js";

import { makeInitialState, resettableKeys, State } from "./state.js";

// sets all upgrades and stats to 0 to prevent people from resetting infinitely
export function resetStats(state: State) {
  const initialState = makeInitialState();
  const RNAGain = getRNABurst(state);
  if (state.flags.unlocked.cells) {
    const cell = document.getElementById("cell");
    const switchToCells = document.getElementById("switchToCells");

    if (!cell || !switchToCells) {
      console.error("No cell or HTML Element 'switchToCells' found.");
      return false;
    }
    cell.classList.remove("hide");
    switchToCells.classList.remove("hide");
  }

  const reThresholds = [0, 0, 0, 0];
  checkREUnlocks(state, reThresholds);
  console.log(
    `[RESET] Your highest amoeba this reset was: ${state.resources.amoeba}`,
  );
  console.log(`[RESET] You resetted for: ${RNAGain} RNA.`);

  console.log(
    `[RESET] You unlocked upgrades ${checkREUnlocks(state, reThresholds)} this reset!`,
  );

  state.stats.cellResets++; // drives U20's escalating cost
  state.resources.RNA += RNAGain;
  resettableKeys.forEach((key) => {
    state[key] = initialState[key];
  });
  const resettedUpgradeExceptions = ["DNA_AGG", "DNA_ACTIVE", "DNA_IDLE"];
  resetUpgrades(state, resettedUpgradeExceptions);
}

// global function :DDD
// TODO: check params (included 2 params instead of 1)
export function resetUpgrades(state: State, resetUpgExceptions: Array<string>) {
  if (!state || !state.upgradeState) {
    console.error("Unknown state object or upgrade state");
    return false;
  }
  for (const upg of Object.values(state.upgradeState)) {
    if (resetUpgExceptions.includes(upg.ID)) {
      continue;
    } else {
      state.upgradeState[upg.ID].level = 0;
    }
  }
  return true;
}

// ===============
// * =- ENTROPY -=
// ===============

export function calculateEntropyToAmoebaBoost(state: State) {
  let boost = 1;
  if (state.flags.unlocked.cells && entropyMilestones[0] === "EM1") {
    boost = 1 + state.resources.entropy ** 0.1 * 0.25;
  }
  if (state.flags.unlocked.cells && entropyMilestones[1] === "EM2") {
    boost = 1 + state.resources.entropy ** 0.15 * 0.25;
  }
  return boost;
}

export function getRNABurst(state: State) {
  // TODO: Implement formula, change and debug accordingly
  const RNA =
    state.stats.cellResets ** 1.67 *
    (10 + Math.sqrt(state.resources.amoeba ** 0.3));
  if (RNA > state.resources.highestRNA) {
    state.resources.highestRNA = RNA;
  }
  return RNA;
}

// helper function to remove hide from an upgrade :DDD
export function unlockUpgrade(ID: string) {
  const selectedButton = document.getElementById(ID);

  if (!selectedButton) {
    console.warn(`unlockUpgrade: no card found for ID "${ID}"`);
    return;
  }

  selectedButton.classList.remove("hide");
}

// TODO: Delete this soon

export function checkREUnlocks(
  state: State,
  lockedREs: Array<number | string>,
) {
  if (state.resources.highestRNA >= 10 && lockedREs[0] !== "RE1") {
    unlockUpgrade("card-RE1");
    lockedREs[0] = "RE1";
  }

  if (state.resources.highestRNA >= 17 && lockedREs[1] !== "RE2") {
    unlockUpgrade("card-RE2");
    lockedREs[1] = "RE2";
  }

  if (state.resources.highestRNA >= 35 && lockedREs[2] !== "RE3") {
    unlockUpgrade("card-RE3");
    lockedREs[2] = "RE3";
  }

  if (state.resources.highestRNA >= 50 && lockedREs[3] !== "Slamo DNA") {
    lockedREs[3] = "Slamo DNA";
    unlockSlamoDNA();
  }
  return lockedREs.filter(Boolean);
}

export function unlockSlamoDNA() {
  const dnaMachine = document.getElementById("dnaMachine");
  if (!dnaMachine) {
    console.error("No htmlelement dnaMachine found :(");
    return false;
  } else {
    dnaMachine.classList.remove("hide");
  }
  return true;
}

export function getCellEntropyMultiplier(state: State) {
  let multiplier;
  multiplier = 1 + state.runtime.formulaicEntropyClicks ** 0.2 * 0.5;
  multiplier = Math.min(multiplier, 2);
  return multiplier;
}

export function updateCellEntropyMultiplier(state: State) {
  state.runtime.formulaicEntropyClicks -= 0.05;
  state.runtime.formulaicEntropyClicks = Math.max(
    0,
    state.runtime.formulaicEntropyClicks,
  );
}

export function calculateU20Cost(state: State) {
  return ((state.stats.cellResets + 1) * 5) ** 1.15 * 250000;
}

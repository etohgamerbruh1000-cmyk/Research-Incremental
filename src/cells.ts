// cells.js
// responsible for handling the cells reset, cell mechanics, and slamo DNA.

// TODO: REMEMBER TO CALL EACH FUNCTION
// TODO: ADD ENTROPY MILESTONES

import { makeInitialState } from "@/state";
import { isMilestoneClaimed } from "./calculations";
import { MilestoneBlueprint } from "./data/milestones/milestoneData";
import { getRNABurst } from "./formulas/upgradeFormulas";
import {
  CELL_RESET,
  CELL_UPG_EXCEPTIONS,
  resetStats,
  resetUpgrades,
} from "./reset";

import { State } from "@/core/types";

export const reThresholds = [0, 0, 0, 0];
// sets all upgrades and stats to 0 to prevent people from resetting infinitely
export function handleCellReset(state: State): boolean {
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

  checkREUnlocks(state, reThresholds);

  const cellResets = state?.stats?.cellResets;
  const amoebaCount = state?.resources?.amoeba;
  const RNAGain = getRNABurst(cellResets, amoebaCount);
  state.resources.RNA += RNAGain;
  state.stats.cellResets++; // drives U20's escalating cost

  resetUpgrades(state, CELL_UPG_EXCEPTIONS);
  const fresh = makeInitialState();
  resetStats(state, fresh, CELL_RESET);

  console.log(
    `[RESET] Your highest amoeba this reset was: ${state.resources.amoeba}`,
  );
  console.log(`[RESET] You resetted for: ${RNAGain} RNA.`);

  console.log(
    `[RESET] You unlocked upgrades ${checkREUnlocks(state, reThresholds)} this reset!`,
  );
  return true;
}

// ===============
// * =- ENTROPY -=
// ===============

export function calculateEntropyToAmoebaBoost(
  state: State,
  entropyMilestones: Record<string, MilestoneBlueprint>,
) {
  let boost = 1;
  const isCellsUnlocked = state.flags.unlocked.cells;
  if (
    entropyMilestones["E1"] &&
    isCellsUnlocked &&
    isMilestoneClaimed(state, entropyMilestones["E1"].ID)
  ) {
    boost = 1 + state.resources.kineticEnergy ** 0.1 * 0.25;
  }
  if (
    entropyMilestones["E2"] &&
    isCellsUnlocked &&
    isMilestoneClaimed(state, entropyMilestones["E2"].ID)
  ) {
    boost = 1 + state.resources.kineticEnergy ** 0.15 * 0.25;
  }
  return boost;
}

export function updateHighestRNA(state: State): State {
  const currentRNA = state.resources.RNA;

  if (currentRNA > state.resources.highestRNA) {
    // Return a new shallow copy of the state with the updated value
    return {
      ...state,
      resources: {
        ...state.resources,
        highestRNA: currentRNA,
      },
    };
  }

  // If it's not higher, return the original state unchanged
  return state;
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

export function unlockSlamoDNA(): boolean {
  const dnaMachine = document.getElementById("dnaMachine");
  if (!dnaMachine) {
    console.error("No HTML dnaMachine found :(");
    return false;
  } else {
    dnaMachine.classList.remove("hide");
  }
  return true;
}

export function calculateU20Cost(state: State): number {
  return ((state.stats.cellResets + 1) * 5) ** 1.15 * 250000;
}

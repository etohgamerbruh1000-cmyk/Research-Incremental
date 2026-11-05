// reducer.js
// handles the reducer function

import { dynamicMilestones, milestones, upgradeLibrary } from "./data.js";
import { increaseStat, isMilestoneClaimed } from "./calculations.js";
import { applyMilestoneEffect, claimMilestone } from "./milestones.js";
import { replaceState, State } from "./state.js";
import { render } from "./render.js";
import { attemptToBuyUpgrade } from "./upgradeSystem.js";
import { handleCellReset } from "./cells.js";

/* const action = {
  type: "increaseStat",
  target: "resources",
  stat: "amoeba",
  amount: 25
};
reducer(state, action);
*/

export type Actions =
  | { type: "increaseStat"; target: keyof State; [key: string]: any }
  | { type: "buyUpgrade"; ID: keyof typeof upgradeLibrary } // Complies with upgradeLibrary keys
  | { type: "claimMilestone"; ID: keyof typeof milestones } // Complies with milestones keys
  | { type: "resetCells"; resettableKeys: string[] };

export function reducer(state: State, action: Actions): State {
  const next = structuredClone(state);

  switch (action.type) {
    case "increaseStat": {
      const destructured = next[action.target];
      increaseStat({ ...action, target: destructured });

      for (const milestone of dynamicMilestones) {
        if (isMilestoneClaimed(state, milestone.ID)) {
          const nextState = applyMilestoneEffect(next, milestone);
          if (nextState) {
            Object.assign(next, nextState);
          }
        }
      }
      return next;
    }

    case "buyUpgrade": {
      const upgradeID = action.ID;
      const upg = upgradeLibrary[upgradeID];
      if (upgradeID && upg) {
        attemptToBuyUpgrade(next, upg);
      }
      return next;
    }

    case "claimMilestone": {
      const milestoneID = action.ID;
      const milestone = milestones[milestoneID]; // Kept the bracket notation fix
      if (milestoneID && milestone) {
        claimMilestone(next, milestone);
      }
      return next;
    }

    case "resetCells": {
      handleCellReset(next);
      return next;
    }

    default: {
      const _exhaustiveCheck: never = action;
      console.warn("Invalid action:", action);
      return state;
    }
  }
}

export function dispatch(state: State, action: Actions): void {
  replaceState(reducer(state, action));
  render(state);
}

// reducer.js
// handles the reducer function

import { dynamicMilestones, milestones, slamoMilestones, upgradeLibrary } from "./data.js";
import { increaseStat, isMilestoneClaimed } from "./calculations.js";
import { applyMilestoneEffect, checkMilestoneClaims, claimMilestone } from "./milestones.js";
import { replaceState, State } from "./state.js";
import { render } from "./render.js";
import { attemptToBuyUpgrade } from "./upgradeSystem.js";
import { handleCellReset } from "./cells.js";
import { handleAmoebaClick, handleSlamoClick } from "./systems/clickHandler.js";

/* const action = {
  type: "increaseStat",
  target: "resources",
  stat: "amoeba",
  amount: 25
};
reducer(state, action);
*/

export type increaseStatExpectations = {
  target: keyof State;
  stat: string;
  amount: number;
  operation: "add" | "multiply";
};

export type Actions =
  | { type: "increaseStat"; payload: increaseStatExpectations } // Clear payload structure
  | { type: "buyUpgrade"; ID: keyof typeof upgradeLibrary }
  | { type: "claimMilestone"; ID: keyof typeof milestones }
  | { type: "resetCells"; resettableKeys: string[] }
  | { type: "amoebaClick" }
  | { type: "slamoClick" };

// Usage inside dispatch would be:
// dispatch(state, { type: "increaseStat", payload: { target: "resources", stat: "amoeba", ... } })

export function reducer(state: State, action: Actions): State {
  const next = structuredClone(state);

  switch (action.type) {
    case "increaseStat": {
      // 1. Extract the payload for cleaner readability
      const { target, stat, amount, operation } = action.payload;

      // 2. Fetch the target sub-object slice dynamically (e.g. next["resources"])
      const subStateSlice = next[target];

      // 3. Fire your pure mutation helper safely
      increaseStat({
        target: subStateSlice,
        stat: stat as any, // Cast as any locally so the compiler accepts dynamic keys
        amount,
        operation,
      });

      for (const milestone of Object.values(dynamicMilestones)) {
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

    case "amoebaClick": {
      handleAmoebaClick(next);
      return next;
    }

    case "slamoClick": {
      handleSlamoClick(next);
      checkMilestoneClaims(next, slamoMilestones);
      return next;
    }

    default: {
      const _exhaustiveCheck: never = action;
      console.warn("Invalid action:", action);
      return state;
    }
  }
}

export function dispatch(oldState: State, action: Actions): void {
  const newState = reducer(oldState, action);
  replaceState(newState);
  render(newState);
  
}

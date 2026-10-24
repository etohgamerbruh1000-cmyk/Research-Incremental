// reducer.js
// handles the reducer function

import { dynamicMilestones, milestones, upgradeLibrary } from "./data.js";
import { increaseStat } from "./calculations.js";
import { applyMilestoneEffect, claimMilestone } from "./milestones.js";
import { replaceState } from "./state.js";
import { render } from "./render.js";
import { buyUpgrade } from "./upgradeSystem.js";
import { resetStats } from "./cells.js";

/* const action = {
  type: "increaseStat",
  target: "resources",
  stat: "amoeba",
  amount: 25
};
reducer(state, action);
*/

export function reducer(state, action) {
  const next = structuredClone(state);
  switch (action.type) {
    case "increaseStat": {
      const destructured = next[action.target];
      increaseStat({ ...action, target: destructured });

      for (const milestone of dynamicMilestones) {
        if (milestone.claimed) {
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
      const upg = upgradeLibrary.find((u) => u.ID === upgradeID);
      if (upgradeID && upg) {
        buyUpgrade(next, upg);
      }

      return next;
    }
    case "claimMilestone": {
      const milestoneID = action.ID;
      const milestone = milestones.find((m) => m.ID === milestoneID);
      if (milestoneID && milestone) {
        claimMilestone(next, milestone);
      }
      return next;
    }
    case "resetCells": {
      // in this case, action === {resettableKeys: ...}
      resetStats(next);
      return next;
    }

    default:
      console.warn("Invalid action:", action);
      return state;
  }
}

export function dispatch(state, action) {
  replaceState(reducer(state, action));
  render(state);
}

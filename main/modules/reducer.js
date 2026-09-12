// reducer.js

import { dynamicMilestones, milestones, upgradeLibrary } from "./data";
import {
  buyUpgrade,
  calculateDynamicMilestoneEffect,
  increaseStat,
} from "./logic";
import { claimMilestone } from "./milestones";
import { replaceState } from "./state";

//ex. {type: buyUpgrade, ID: "U17a"}
export function reducer(state, action) {
  const next = structuredClone(state);
  switch (action.type) {
    case "gameTick": {
      return next;
    }

    case "increaseStat": {
      const destructured = next[action.target];
      increaseStat({ ...action, target: destructured });

      for (const milestone of dynamicMilestones) {
        if (milestone.claimed) {
          const nextState = calculateDynamicMilestoneEffect(milestone);
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
    case "cellsReset": {
      return next;
    }

    default:
      console.warn("Invalid action:", action);
      return state;
  }
}

export function dispatch(state, action) {
  replaceState(reducer(state, action));
}

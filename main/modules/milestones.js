// milestones.js
// Milestone logic moved out of logic.js to reduce file size.

import { state } from "./state.js";
import { slamoData, upgradeLibrary } from "./data.js";

export function checkMilestoneClaim(milestoneType, currency) {
  for (const milestone of milestoneType) {
    if (currency >= milestone.needed && !milestone.claimed) {
      milestone.claimed = true;
      applyMilestoneEffect(milestone);
    }
  }

  return milestoneType;
}

export function applyMilestoneEffect(milestone) {
  if (typeof milestone.effect !== "function") return;
  const nextState = calculateDynamicMilestoneEffect(milestone);
  if (nextState) {
    Object.assign(state, nextState);
  }
}

export function calculateDynamicMilestoneEffect(milestone) {
  if (typeof milestone.effect !== "function") return;
  return milestone.effect({
    state,
    slamoData,
    upgrades: upgradeLibrary,
  });
}

// milestones.js

import { State } from "@/core/types";
import { isMilestoneClaimed } from "./calculations";
import { MilestoneBlueprint } from "./core/types";
import { upgradeLibrary } from "./data";

// Mstilestone logic
// ex. checkMilestone(slamoMilestones, slamoClicks)
export function checkMilestoneClaims(
  next: State,
  milestones: Record<string, MilestoneBlueprint>,
) {
  for (const milestone of Object.values(milestones)) {
    if (
      !checkMilestoneEligibility(next, milestone) ||
      isMilestoneClaimed(next, milestone.ID)
    )
      continue;

    claimMilestone(next, milestone);
    console.log("Unlocked milestone:", milestone);
  }
}

export function checkMilestoneEligibility(
  next: State,
  milestone: MilestoneBlueprint,
): boolean {
  const statValue = next.resources?.[milestone.stat as keyof typeof next.resources];
  if (typeof statValue !== "number") {
    console.warn(`invalid stat type: ${milestone.stat}`);
    return false;
  }
  
  return statValue >= milestone.needed;
}

export function claimMilestone(
  next: State,
  blueprint: MilestoneBlueprint,
): State {
  if (!next.milestoneState) {
    next.milestoneState = {};
  }

  next.milestoneState[blueprint.ID] = { claimed: true };

  applyMilestoneEffect(next, blueprint);
  return next;
}

export function applyMilestoneEffect(
  state: State,
  milestone: MilestoneBlueprint,
) {
  if (typeof milestone.effect !== "function") return state;

  milestone.effect({ state, upgradeLibrary });
  return state;
}

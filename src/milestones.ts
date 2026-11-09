// milestones.js

import { state, State } from "@/core/types";
import { isMilestoneClaimed } from "./calculations";
import { upgradeLibrary } from "./data";
import { MilestoneBlueprint } from "./data/milestones/milestoneData";
import { createNext } from "./save";

// Milestone logic
// ex. checkMilestone(slamoMilestones, slamoClicks)
export function checkMilestoneClaims(
  next: State,
  milestones: Record<string, MilestoneBlueprint>,
) {
  for (const milestone of Object.values(milestones)) {
    if (
      !checkMilestoneEligibility(next, milestone) ||
      isMilestoneClaimed(state, milestone.ID)
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
  const value = next.resources?.[milestone.stat as keyof typeof next.resources];
  if (typeof value !== "number") {
    console.warn(`invalid milestone stat: ${milestone.stat}`);
    return false;
  }
  return value >= milestone.needed;
}

export function claimMilestone(
  next: State,
  blueprint: MilestoneBlueprint,
): State {
  // 1. Initialize the state property if it doesn't exist
  if (!next.milestoneState) {
    next.milestoneState = {};
  }

  // 2. Mark the milestone as claimed directly using the correct 'blueprint' parameter
  next.milestoneState[blueprint.ID] = {
    claimed: true,
  };
  // 3. Apply effects using the correct parameter name

  applyMilestoneEffect(next, blueprint);

  return next;
}

// recalculates milestone effects from scratch
// TODO: Create effect functionality.
export function applyMilestoneEffect(
  state: State,
  milestone: MilestoneBlueprint,
) {
  if (typeof milestone.effect !== "function") return state;
  const next = createNext(state);
  milestone.effect({ state: next, upgradeLibrary });
  return next;
}

// milestones.js

import { MilestoneBlueprint, milestones, state, State } from "./imports.js";
import { renderMilestoneText } from "./render.js";
import { AllMilestonesType } from "./types.js";

// Milestone logic
// ex. checkMilestone(slamoMilestones, slamoClicks)
export function checkMilestoneClaims(
  next: State,
  milestones: MilestoneBlueprint[],
) {
  for (const milestone of milestones) {
    const forgedID = `milestone-${milestone.ID}`;
    const milestoneLi = document.getElementById(forgedID);
    const isMilestoneClaimed = next.milestones[milestone.ID].claimed;
    if (!checkMilestoneEligibility(next, milestone) || isMilestoneClaimed)
      continue;

    claimMilestone(next, milestone);

    console.log("Unlocked milestone:", milestone);
    renderMilestoneText(milestoneLi, milestone);
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

export function claimMilestone(next: State, milestone: MilestoneBlueprint) {
  state.milestones[milestone.ID as keyof typeof state.milestones].claimed =
    true;
  applyMilestoneEffect(next, milestone);
  return next;
}

// recalculates milestone effects from scratch
// TODO: Create effect functionality.
export function applyMilestoneEffect(
  state: State,
  milestone: MilestoneBlueprint,
) {
  if (typeof milestone.effect !== "function") return state;

  milestone.effect({
    state,
  });
  return state;
}

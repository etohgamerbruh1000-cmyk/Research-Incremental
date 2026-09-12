// milestones.js

import { renderMilestoneText } from "./render";

// Milestone logic

// ex. checkMilestone(slamoMilestones, slamoClicks)
export function checkMilestoneClaims(next, milestones) {
  for (const milestone of milestones) {
    const forgedID = `milestone-${milestone.ID}`;
    const milestoneLi = document.getElementById(forgedID);

    if (!checkMilestoneEligibility(next, milestone) || milestone.claimed)
      continue;

    claimMilestone(milestone);

    console.log("Unlocked milestone:", milestone);
    renderMilestoneText(milestoneLi, milestone);
  }
}

export function checkMilestoneEligibility(next, milestone) {
  const value = next.resources?.[milestone.stat];
  if (typeof value !== "number") {
    console.warn(`invalid milestone stat: ${milestone.stat}`);
    return false;
  }
  return value >= milestone.needed;
}


export function claimMilestone(next, milestone) {

  milestone.claimed = true;
  applyMilestoneEffect(next, milestone);
}

// recalculates milestone effects from scratch
// TODO: Create effect functionality.
export function applyMilestoneEffect(next, milestone) {
  if (typeof milestone.effect !== "function") return;
  
  milestone.effect({
    next,
  });
}

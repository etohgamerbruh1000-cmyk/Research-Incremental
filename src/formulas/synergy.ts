// synergy.js
// Pure helper functions for synergy calculations.

// Ordered from highest priority (strongest) to lowest priority
const SYNERGY_HIERARCHY = [
  {
    id: "U18",
    formula: (amoeba: number) =>
      1 + Math.log10(1 + amoeba ** 0.75) / Math.log10(40),
  },
  {
    id: "U7",
    formula: (amoeba: number) =>
      1 + Math.log10(1 + amoeba ** 0.6) / Math.log10(70),
  },
  {
    id: "U3",
    formula: (amoeba: number) =>
      1 + Math.log10(1 + Math.sqrt(amoeba)) / Math.log10(100),
  },
];

export function getSynergyMultiplier(
  amoebaCount: number,
  ownedUpgLevels: Record<string, number>,
): number {
  // Scan from top to bottom; return the first matching formula found
  for (const config of SYNERGY_HIERARCHY) {
    const playerUpgrade = ownedUpgLevels[config.id];

    if ((playerUpgrade ?? 0) >= 1) {
      return config.formula(amoebaCount);
    }
  }

  // Baseline multiplier if no synergy upgrades are owned yet
  return 1;
}

export function getRNASynergyMultiplier(
  amoebaCount: number,
  u14Level: number,
): number {
  let multiplier = 1;

  if (u14Level >= 1) {
    // TODO: placeholder multiplier; replace soon
    multiplier = 1 + Math.log10(1 + Math.sqrt(amoebaCount)) / Math.log10(100);
  }
  return multiplier;
} // types.ts
// import {
//   discoveryTiers,
//   dynamicMilestones,
//   entropyMilestones,
//   slamoMilestones,
//   upgradeLibrary,
// } from "../data";
// import { milestones } from "../data/milestones/milestoneData";
// import { State } from "../state";


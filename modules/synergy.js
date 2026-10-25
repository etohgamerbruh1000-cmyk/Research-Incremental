// synergy.js
// Pure helper functions for synergy calculations.

// Ordered from highest priority (strongest) to lowest priority
const SYNERGY_HIERARCHY = [
  {
    id: "U18",
    formula: (amoeba) => 1 + Math.log10(1 + amoeba ** 0.75) / Math.log10(40),
  },
  {
    id: "U7",
    formula: (amoeba) => 1 + Math.log10(1 + amoeba ** 0.6) / Math.log10(70),
  },
  {
    id: "U3",
    formula: (amoeba) =>
      1 + Math.log10(1 + Math.sqrt(amoeba)) / Math.log10(100),
  },
];

export function getSynergyMultiplier(state) {
  const amoebaCount = state.resources.amoeba || 0;

  // Scan from top to bottom; return the first matching formula found
  for (const config of SYNERGY_HIERARCHY) {
    const playerUpgrade = state.upgradeState[config.id];

    if (playerUpgrade && playerUpgrade.level >= 1) {
      return config.formula(amoebaCount);
    }
  }

  // Baseline multiplier if no synergy upgrades are owned yet
  return 1;
}

export function getRNASynergyMultiplier(state, upgradeLibrary) {
  const u14 = upgradeLibrary.find((upg) => upg.ID === "U14");
  let multiplier;

  if (u14 && u14.level >= 1) {
    // TODO: placeholder multiplier; replace soon
    multiplier =
      1 + Math.log10(1 + Math.sqrt(state.resources.amoeba)) / Math.log10(100);
  }
  return multiplier;
}

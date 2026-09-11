// synergy.js
// Pure helper functions for synergy calculations.

export function getSynergyMultiplier(state, upgradeLibrary) {
  const u3 = upgradeLibrary.find((upg) => upg.ID === "U3");
  const u7 = upgradeLibrary.find((upg) => upg.ID === "U7");
  const u18 = upgradeLibrary.find((upg) => upg.ID === "U18");
  let multiplier;

  if (u3 && u3.level >= 1) {
    multiplier =
      1 + Math.log10(1 + Math.sqrt(state.resources.amoeba)) / Math.log10(100);
  }
  if (u7 && u7.level >= 1) {
    multiplier =
      1 + Math.log10(1 + state.resources.amoeba ** 0.6) / Math.log10(70);
  }
  if (u18 && u18.level >= 1) {
    multiplier =
      1 + Math.log10(1 + state.resources.amoeba ** 0.75) / Math.log10(40);
  }

  return multiplier;
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

// gameLoop.js
// handles the gameloop, automator,
import {
  calculateEntropyToAmoebaBoost,
  updateCellEntropyMultiplier,
} from "./cells.js";
import {
  slamoMilestones,
  slamoData,
  upgradeLibrary,
  entropyMilestones,
} from "./data.js";
import {
  checkMilestoneClaim,
  getClickCooldown,
  getClickPower,
  getCritIIGuarantee,
  getEntropyPerSecond,
  getSlamoClickCooldown,
  getSlamoClickPower,
  increaseStat,
} from "./logic.js";
import {
  renderClasses,
  renderStats,
  updateButtonBrightness,
} from "./render.js";
import { state } from "./state.js";

export function theAutomator() {
  increaseStat(
    state.resources,
    "amoeba",
    getClickPower(state.stats.clickPower * state.stats.automatorEffectiveness),
    true,
  );
}

export function gameLoop() {
  // this calculates once every second to calculate resource gain via automator
  const U17a = upgradeLibrary.find((u) => u.ID === "U17a");

  if (U17a.level >= 1) {
    increaseStat(slamoData, "slamoClicks", getSlamoClickPower() / 10, true);
    // calculates every milestone since the logic would be unneccesarily complicated if calculating

    checkMilestoneClaim(slamoMilestones, slamoData.slamoClicks);
  }

  const G2 = upgradeLibrary.find((u) => u.ID === "G2");
  if (G2.level >= 1) {
    if (state.runtime.timesClicked % getCritIIGuarantee() === 0) theAutomator();
  }

  if (state.flags.unlocked.cells) {
    increaseStat(state.resources, "entropy", getEntropyPerSecond(), true);
    calculateEntropyToAmoebaBoost();
    checkMilestoneClaim(entropyMilestones, state.resources.entropy);
  }

  renderStats();
}
// this calculates every tick to render visuals
const amoebaButton = document.getElementById("amoebaButton");
const slamo = document.getElementById("slamo");

export function tick() {
  renderClasses();
  updateCellEntropyMultiplier();
  updateButtonBrightness(
    amoebaButton,
    getClickCooldown,
    state.runtime.lastClickTime,
  );
  updateButtonBrightness(
    slamo,
    getSlamoClickCooldown,
    state.runtime.lastSlamoClickTime,
  );
  requestAnimationFrame(tick);
}

// gameLoop.js
// handles the gameloop, automator,
import {
  calculateEntropyToAmoebaBoost,
  updateCellEntropyMultiplier,
} from "./cells.js";
import {
  slamoMilestones,
  slamoData,
  upgrades,
  entropyMilestones,
} from "./data.js";
import {
  checkMilestone,
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
    state,
    "amoeba",
    getClickPower(
      state.clickPower * state.automatorEffectiveness,
      state.M1Boost,
    ),
    true,
  );
}

export function gameLoop() {
  // this calculates once every second to calculate resource gain via automator
  const U17a = upgrades.find((u) => u.ID === "U17a");
  const G2 = upgrades.find((u) => u.ID === "G2");
  if (U17a.level >= 1) {
    increaseStat(slamoData, "slamoClicks", getSlamoClickPower() / 10, true);
    // calculates every milestone since the logic would be unneccesarily complicated if calculating
    for (let i = 0; i < slamoMilestones.length; i++) {
      if (!slamoMilestones[i].claimed) {
        checkMilestone(slamoMilestones[i], slamoData.slamoClicks);
      }
    }
  }

  if (G2.level >= 1) {
    if (state.timesClicked % getCritIIGuarantee() === 0) theAutomator();
  }

  if (state.unlocked.cells) {
    increaseStat(state, "entropy", getEntropyPerSecond(), true);
    calculateEntropyToAmoebaBoost();
    checkMilestone(entropyMilestones, state.entropy);
  }

  renderStats();
}

// this calculates every tick to render visuals
export function tick() {
  const amoebaButton = document.getElementById("amoebaButton");
  const slamo = document.getElementById("slamo");
  renderClasses();
  updateCellEntropyMultiplier();
  updateButtonBrightness(amoebaButton, getClickCooldown, state.lastClickTime);
  updateButtonBrightness(
    slamo,
    getSlamoClickCooldown,
    state.lastSlamoClickTime,
  );
  requestAnimationFrame(tick);
}

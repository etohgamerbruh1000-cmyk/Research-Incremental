// gameLoop.js
// handles the gameloop, automator,
import {
  calculateEntropyToAmoebaBoost,
  checkEntropyMilestones,
  updateCellEntropyMultiplier,
} from "./cells.js";
import { filteredMilestones, slamoObj, upgrades } from "./data.js";
import {
  getClickCooldown,
  getClickPower,
  getEntropyPerSecond,
  getSlamoClickCooldown,
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
    increaseStat(slamoObj, "slamoClicks", getSlamoClickPower() / 10, true);
  }

  if (G2.level >= 1) {
    if (state.timesClicked % getCritIIGuarantee() === 0) theAutomator();
  }

  if (state.unlocked.cells) {
    increaseStat(state, "entropy", getEntropyPerSecond(), true);
    calculateEntropyToAmoebaBoost();
    checkEntropyMilestones();
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
  updateButtonBrightness(slamo, getSlamoClickCooldown, state.lastSlamoClickTime);
  requestAnimationFrame(tick);
}

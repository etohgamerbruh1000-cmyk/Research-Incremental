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
import { saveGame } from "./save.js";
import { state } from "./state.js";

export function theAutomator() {
  increaseStat({
    target: state.resources,
    stat: "amoeba",
    amount: getClickPower(
      state.stats.clickPower * state.stats.automatorEffectiveness,
    ),
    operation: "add",
  });
}

export function gameLoop() {
  // this calculates once every second to calculate resource gain via automator
  const U17a = upgradeLibrary.find((u) => u.ID === "U17a");

  if (U17a.level >= 1) {
    increaseStat({
      target: slamoData,
      stat: "slamoClicks",
      amount: getSlamoClickPower() / 10,
      operation: "add",
    });
    // calculates every milestone since the logic would be unneccesarily complicated if calculating

    checkMilestoneClaim(slamoMilestones, slamoData.slamoClicks);
  }

  const G2 = upgradeLibrary.find((u) => u.ID === "G2");
  if (G2.level >= 1) {
    if (state.runtime.timesClicked % getCritIIGuarantee() === 0) theAutomator();
  }

  if (state.runtime.automatorTickCounter % 30) {
    saveGame(state);
  }

  if (state.flags.unlocked.cells) {
    increaseStat({
      target: state.resources,
      stat: "entropy",
      amount: getEntropyPerSecond(),
      operation: "add",
    });
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

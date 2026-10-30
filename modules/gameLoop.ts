// gameLoop.js
// handles the gameloop, automator,
import { updateCellEntropyMultiplier } from "./cells.js";
import { slamoMilestones, upgradeLibrary, entropyMilestones } from "./data.js";
import {
  getClickCooldown,
  getClickPower,
  getCritIIGuarantee,
  getEntropyPerSecond,
  getSlamoClickCooldown,
  getSlamoClickPower,
  increaseStat,
} from "./calculations.js";
import { renderClasses, render, updateButtonBrightness } from "./render.js";
import { saveGame } from "./save.js";
import { state } from "./state.js";
import { checkMilestoneClaims } from "./milestones.js";
import { createNext, levelOf, State } from "./imports.js";

export function theAutomator(state: State) {
  const simulatedClickPower =
    state.stats.clickPower * state.stats.automatorEffectiveness;
  increaseStat({
    target: state.resources,
    stat: "amoeba",
    amount: getClickPower(state, simulatedClickPower),
    operation: "add",
  });
}

export function gameLoop(state: State) {
  // this calculates once every second to calculate resource gain via automator
  const U17a = upgradeLibrary.u17a;

  if (levelOf(state, U17a.ID) >= 1) {
    increaseStat({
      target: state,
      stat: "slamoClicks",
      amount: getSlamoClickPower(state) / 10,
      operation: "add",
    });
    // calculates every milestone since the logic would be unneccesarily complicated if calculating
    const next = createNext();
    checkMilestoneClaims(next, slamoMilestones);
  }

  const G2 = upgradeLibrary.G2;
  if (levelOf(state, G2.ID) >= 1) {
    if (state.runtime.timesClicked % getCritIIGuarantee(state) === 0)
      theAutomator(state);
  }

  if (state.runtime.automatorTickCounter % 30) {
    saveGame(state);
  }

  if (state.flags.unlocked.cells) {
    increaseStat({
      target: state.resources,
      stat: "entropy",
      amount: getEntropyPerSecond(state),
      operation: "add",
    });
    const next = createNext();
    checkMilestoneClaims(next, entropyMilestones);
  }

  render();
}
// this calculates every tick to render visuals
const amoebaButton = document.getElementById("amoebaButton");
const slamo = document.getElementById("slamo");

export const tick = (state: State) => {
  renderClasses(state);
  updateCellEntropyMultiplier(state);

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

  // Use an arrow function so 'state' isn't replaced by the RAF timestamp
  requestAnimationFrame(() => tick(state));
};

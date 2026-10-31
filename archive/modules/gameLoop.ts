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
  levelOf,
} from "./calculations.js";
import {
  renderClasses,
  render,
  updateButtonBrightness,
  doc,
} from "./render.js";
import { createNext, saveGame } from "./save.js";
import { state, State } from "./state.js";
import { checkMilestoneClaims } from "./milestones.js";

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
      target: state.resources,
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
const amoebaButton = doc("amoebaButton");
const slamo = doc("slamo");
// Define a flag outside the function to track if the loop is active
let isLoopRunning = false;

export const attemptGameTick = (state: State) => {
  // 1. Core game logic and UI updates
  renderClasses(state);
  updateCellEntropyMultiplier(state);

  // Cache or check DOM elements cleanly
  if (amoebaButton && slamo) {
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
  }

  // 2. The critical performance fix: Ensure only ONE loop runs at a time
  if (!isLoopRunning) {
    isLoopRunning = true;
    
    const loop = () => {
      attemptGameTick(state);
      requestAnimationFrame(loop);
    };
    
    requestAnimationFrame(loop);
  }
};


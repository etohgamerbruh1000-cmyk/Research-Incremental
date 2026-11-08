// gameLoop.js
// handles the gameloop, automator,
import { updateCellEntropyMultiplier } from "./fluidSystem";
import { slamoMilestones, upgradeLibrary, entropyMilestones } from "./data";
import {
  getClickCooldown,
  getClickPower,
  getCritIIGuarantee,
  getEntropyPerSecond,
  getSlamoClickCooldown,
  getSlamoClickPower,
  increaseStat,
  levelOf,
} from "./calculations";
import {
  renderClasses,
  render,
  doc,
  updateButtonBrightness,
} from "./render";
import { createNext, saveGame } from "./save";
import { State } from "./state";
import { checkMilestoneClaims } from "./milestones";

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
  const U17a = upgradeLibrary.U17a;
  renderClasses(state);
  if (U17a && levelOf(state, U17a.ID) >= 1) {
    increaseStat({
      target: state.resources,
      stat: "slamoClicks",
      amount: getSlamoClickPower(state) / 10,
      operation: "add",
    });
    // calculates every milestone since the logic would be unneccesarily complicated if calculating
    const next = createNext(state);
    checkMilestoneClaims(next, slamoMilestones);
  }

  const G2 = upgradeLibrary.G2;
  if (G2 && levelOf(state, G2.ID) >= 1) {
    if (state.runtime.timesClicked % getCritIIGuarantee(state) === 0)
      theAutomator(state);
  }

  if (state.flags.unlocked.cells) {
    increaseStat({
      target: state.resources,
      stat: "kineticEnergy",
      amount: getEntropyPerSecond(state),
      operation: "add",
    });
    const next = createNext(state);
    checkMilestoneClaims(next, entropyMilestones);
  }

  // counts for every 30 seconds :D
  if (state.runtime.automatorTickCounter % 30 === 0) {
    saveGame(state);
  }
  increaseStat({
    target: state.runtime,
    stat: "automatorTickCounter",
    amount: 1,
    operation: "add",
  });
  render(state);
}
// this calculates every tick to render visuals
const amoebaButton = doc("amoebaButton");
const slamo = doc("slamo");
// Define a flag outside the function to track if the loop is active
let isLoopRunning = false;

let lastTime = performance.now();
export const attemptGameTick = (state: State) => {
  // 1. Core game logic and UI updates

  const currentTime = performance.now();
  let deltaMs = currentTime - lastTime;
  lastTime = currentTime;

  if (deltaMs > 1000) deltaMs = 1000;
  const deltaTime = deltaMs / 1000;

  updateCellEntropyMultiplier(state, deltaTime);

  // Cache or check DOM elements cleanly
  if (amoebaButton && slamo) {
    const time = getClickCooldown(state);
    updateButtonBrightness(amoebaButton, time, state.runtime.lastClickTime);
    const slamoTime = getSlamoClickCooldown(state);
    updateButtonBrightness(slamo, slamoTime, state.runtime.lastSlamoClickTime);
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

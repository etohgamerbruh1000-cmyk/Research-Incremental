// gameLoop.js
// handles the gameloop, automator,
import { State } from "@/core/types";
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
import { entropyMilestones, slamoMilestones, upgradeLibrary } from "./data";
import { updateCellEntropyMultiplier } from "./fluidSystem";
import { checkMilestoneClaims } from "./milestones";
import { doc, render, updateButtonBrightness, updateUIState } from "./render";
import { saveGame } from "./save";

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
  updateUIState(state);
  if (U17a && levelOf(state, U17a.ID) >= 1) {
    increaseStat({
      target: state.resources,
      stat: "slamoClicks",
      amount: getSlamoClickPower(state) / 10,
      operation: "add",
    });


    checkMilestoneClaims(state, slamoMilestones);
  }

  const G2 = upgradeLibrary.G2;
  const isCritII = state.runtime.timesClicked % getCritIIGuarantee(state) === 0;
  if (G2 && levelOf(state, G2.ID) >= 1) {
    if (isCritII) {
      theAutomator(state);
    }
  }

  if (state.flags.unlocked.cells) {
    increaseStat({
      target: state.resources,
      stat: "kineticEnergy",
      amount: getEntropyPerSecond(state),
      operation: "add",
    });

    checkMilestoneClaims(state, entropyMilestones);
  }

  // save the game every saveInterval seconds
  if (state.runtime.automatorTickCounter % state.config.saveInterval === 0) {
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

  if (amoebaButton && slamo) {
    const time = getClickCooldown(state);
    updateButtonBrightness(amoebaButton, time, state.runtime.lastClickTime);
    const slamoTime = getSlamoClickCooldown(state);
    updateButtonBrightness(slamo, slamoTime, state.runtime.lastSlamoClickTime);
  }

  // 2. Ensure only ONE loop runs at a time
  if (!isLoopRunning) {
    isLoopRunning = true;
    const loop = () => {
      attemptGameTick(state);
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
};

// app.js
// * Starts the game
// handles buttons, event listeners, and renders everything at first.

import {
  getClickCooldown,
  getClickPower,
  getCritEffectiveness,
  getCritIIGuarantee,
  getSlamoClickCooldown,
  rollCrit,
} from "./modules/calculations.js";
import { resetStats } from "./modules/cells.js";
import { slamoMilestones } from "./modules/data.js";
import { checkMilestoneClaims } from "./modules/milestones.js";
import { doc, renderProgressBar } from "./modules/render.js";
import { state } from "./modules/state.js";

// session - gives important info
console.log("Starting to plan the Research layer");
console.log("Session 65");

// button IDs using doc()
const amoebaButton = doc("amoebaButton");
const slamo = doc("slamo");
const cellResetBtn = doc("cellResetBtn");
const cell = doc("cell");

// tabs using doc()
const switchToAmoeba = doc("switchToAmoeba");
const switchToCells = doc("switchToCells");

const mainTab = doc("mainTab");
const cellsTab = doc("cellsTab");

amoebaButton.addEventListener("click", () => {
  const timing = calculateTime(getClickCooldown, state.runtime.lastClickTime);

  if (timing.elapsed >= timing.cooldownMs) {
    state.runtime.lastClickTime = Date.now();
    const u9 = upgradeLibrary.u9;
    const u17b = upgradeLibrary.u17b;
    let isCrit = false;
    let baseClickPower = state.stats.clickPower;
    const critEffectiveness = getCritEffectiveness();
    state.runtime.timesClicked++;

    if (
      state.runtime.timesClicked % getCritIIGuarantee() === 0 &&
      u9.level >= 1
    ) {
      console.log(
        "CRIT II! x2 click power, crit effect automatically applied :)",
      );
      baseClickPower *= critEffectiveness * 2;
    } else if (rollCrit(state)) {
      isCrit = true;
      if (u17b.level >= 1) {
        increaseStat({
          target: state,
          stat: "slamoClicks",
          amount: getSlamoClickPower(),
          operation: "add",
        });
      }
      baseClickPower *= critEffectiveness;
    }

    if (isCrit === false) {
      increaseStat({
        target: state.resources,
        stat: "RNA",
        amount: 0.01,
        operation: "add",
      });
    }
    // normal amoeba click
    increaseStat({
      target: state.resources,
      stat: "amoeba",
      amount: getClickPower(state, baseClickPower),
      operation: "add",
    });
    render();
    renderProgressBar();
  }
});

slamo.addEventListener("click", () => {
  const timing = calculateTime(
    getSlamoClickCooldown,
    state.runtime.lastSlamoClickTime,
  );

  if (timing.elapsed >= timing.cooldownMs) {
    state.runtime.lastSlamoClickTime = Date.now();

    increaseStat({
      target: state,
      stat: "slamoClicks",
      amount: getSlamoClickPower(),
      operation: "add",
    });
    render();

    const next = createNext();
    checkMilestoneClaims(next, slamoMilestones);
  }
});

cellResetBtn.addEventListener("click", () => {
  resetStats();
  cellResetBtn.classList.add("hide");
});

cell.addEventListener("click", () => {
  state.runtime.totalEntropyClicks += 1;
  getCellEntropyMultiplier();
});

// general tab function, adds an event listener inside tabName
export function createTabButtonFunctionality(
  button: HTMLElement | null,
  tabName: HTMLElement | null,
) {
  button.addEventListener("click", () => {
    mainTab.classList.add("hide");
    cellsTab.classList.add("hide");

    tabName.classList.remove("hide");
  });
}
createTabButtonFunctionality(switchToAmoeba, mainTab);
createTabButtonFunctionality(switchToCells, cellsTab);

// ==============
// * 2. Rendering
// ==============

upgradeLibrary.forEach(renderUpgrade);

for (const milestone of milestones) {
  renderMilestone(milestone);
}

// 1. Load the data exactly once
const savedState = loadGame();

// 2. Overwrite your active engine state directly if a save exists
if (savedState !== null) {
  replaceState(savedState);
}
const next = createNext();
render(next);
setInterval(gameLoop, 1000);
requestAnimationFrame(tick);
renderDNAMachine();
renderDNAUpgradeCounter();



// app.js
// * Starts the game
// handles buttons, event listeners, and renders everything at first.

import {
  gameLoop,
  tick,
  checkMilestoneClaim,
  getClickCooldown,
  getClickPower,
  getCritEffectiveness,
  getCritIIGuarantee,
  getSlamoClickCooldown,
  getSlamoClickPower,
  increaseStat,
  rollCrit,
  calculateTime,
  renderDNAMachine,
  renderMilestone,
  renderProgressBar,
  renderDNAUpgradeCounter,
  renderStats,
  renderUpgrade,
  unhideElement,
  state,
  slamoMilestones,
  slamoData,
  upgradeLibrary,
  getCellEntropyMultiplier,
  resetStats,
  loadGame,
  makeInitialState,
  replaceState,
} from "./modules/imports.js";

// session - gives important info
console.log("Starting to plan the Research layer");
console.log("Session 35-40");

// button IDs
const amoebaButton = document.getElementById("amoebaButton");
const slamo = document.getElementById("slamo");
const cellResetBtn = document.getElementById("cellResetBtn");
const cell = document.getElementById("cell");

// tabs
const switchToAmoeba = document.getElementById("switchToAmoeba");
const switchToCells = document.getElementById("switchToCells");

const mainTab = document.getElementById("mainTab");
const cellsTab = document.getElementById("cellsTab");

// =====================
// =- EVENT LISTENERS -=
// =====================

amoebaButton.addEventListener("click", () => {
  const timing = calculateTime(getClickCooldown, state.runtime.lastClickTime);

  if (timing.elapsed >= timing.cooldownMs) {
    state.runtime.lastClickTime = Date.now();
    const u9 = upgradeLibrary.find((u) => u.ID === "U9");
    const U17b = upgradeLibrary.find((u) => u.ID === "U17b");
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
    } else if (rollCrit()) {
      isCrit = true;
      if (U17b.level >= 1) {
        increaseStat({
          target: slamoData,
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
      amount: getClickPower(baseClickPower),
      operation: "add",
    });
    renderStats();
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

    console.log("slamoData:", slamoData);

    increaseStat({
      target: slamoData,
      stat: "slamoClicks",
      amount: getSlamoClickPower(),
      operation: "add",
    });
    renderStats();
    checkMilestoneClaim(slamoMilestones, slamoData.slamoClicks);
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
export function createTabButtonFunctionality(button, tabName) {
  button.addEventListener("click", () => {
    mainTab.classList.add("hide");
    cellsTab.classList.add("hide");

    unhideElement(tabName);
  });
}
createTabButtonFunctionality(switchToAmoeba, mainTab);
createTabButtonFunctionality(switchToCells, cellsTab);

// ==============
// * 2. Rendering
// ==============

renderStats();
upgradeLibrary.forEach(renderUpgrade);

slamoMilestones.forEach((milestone) => {
  renderMilestone(milestone.ID);
});

if (state !== makeInitialState()) {
  loadGame();
}

setInterval(gameLoop, 1000);
requestAnimationFrame(tick);
renderDNAMachine();
renderDNAUpgradeCounter();

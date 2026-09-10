// app.js
// * Starts the game
// handles buttons, event listeners, and renders everything at first.

import { gameLoop, tick } from "./modules/gameLoop.js";
import {
  checkMilestoneClaim,
  getClickCooldown,
  getClickPower,
  getCritEffectiveness,
  getCritIIGuarantee,
  getSlamoClickCooldown,
  getSlamoClickPower,
  increaseStat,
  rollCrit,
} from "./modules/logic.js";
import {
  calculateTime,
  renderDNAMachine,
  renderMilestone,
  renderProgressBar,
  renderDNAUpgradeCounter,
  renderStats,
  renderUpgrade,
  unhideElement,
} from "./modules/render.js";
import { state } from "./modules/state.js";
import { slamoMilestones, slamoData, upgrades } from "./modules/data.js";
import { getCellEntropyMultiplier, resetStats } from "./modules/cells.js";

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

amoebaButton.addEventListener("click", function () {
  const timing = calculateTime(getClickCooldown, state.lastClickTime);

  if (timing.elapsed >= timing.cooldownMs) {
    state.lastClickTime = Date.now();
    const u9 = upgrades.find((u) => u.ID === "U9");
    const U17b = upgrades.find((u) => u.ID === "U17b");
    let isCrit = false;
    let baseClickPower = state.clickPower;
    let critEffectiveness = getCritEffectiveness();
    state.timesClicked++;

    if (state.timesClicked % getCritIIGuarantee() === 0 && u9.level >= 1) {
      console.log(
        "CRIT II! x2 click power, crit effect automatically applied :)",
      );
      baseClickPower *= critEffectiveness * 2;
    } else if (rollCrit()) {
      isCrit = true;
      if (U17b.level >= 1) {
        increaseStat(slamoData, "slamoClicks", getSlamoClickPower(), true);
      }
      baseClickPower *= critEffectiveness;
    }

    if (isCrit === false) {
      increaseStat(state, "RNA", 0.01, true);
    }
    // normal amoeba click
    increaseStat(state, "amoeba", getClickPower(baseClickPower), true);
    renderStats();
    renderProgressBar();
  }
});

slamo.addEventListener("click", function () {
  const timing = calculateTime(getSlamoClickCooldown, state.lastSlamoClickTime);

  if (timing.elapsed >= timing.cooldownMs) {
    state.lastSlamoClickTime = Date.now();

    console.log("slamoData:", slamoData);

    increaseStat(slamoData, "slamoClicks", getSlamoClickPower(), true);
    renderStats();
    checkMilestoneClaim(slamoMilestones, slamoData.slamoClicks);
  }
});

cellResetBtn.addEventListener("click", function () {
  resetStats();
  cellResetBtn.classList.add("hide");
});

cell.addEventListener("click", function () {
  state.totalEntropyClicks += 1;
  getCellEntropyMultiplier();
});

// general tab function, adds an event listener inside tabName
export function createTabButtonFunctionality(button, tabName) {
  button.addEventListener("click", function () {
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
upgrades.forEach(renderUpgrade);

slamoMilestones.forEach((milestone) => {
  renderMilestone(milestone.ID);
});

setInterval(gameLoop, 1000);
requestAnimationFrame(tick);
renderDNAMachine();
renderDNAUpgradeCounter();

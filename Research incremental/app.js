// app.js
// * Starts the game
// handles buttons, event listeners, and renders everything at first.

import { gameLoop, tick } from "./modules/gameLoop.js";
import {
  checkSlamoMilestones,
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
  renderClasses,
  renderDNAMachine,
  renderMilestone,
  renderProgressBar,
  renderSlamoUpgradeCounter,
  renderStats,
  renderUpgrade,
  unhideElement,
  updateButtonBrightness,
} from "./modules/render.js";
import { state } from "./modules/state.js";
import {
  filteredMilestones,
  slamoData,
  slamoObj,
  upgrades,
} from "./modules/data.js";
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
    let baseClickPower = 1;
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
        increaseStat(slamoObj, "slamoClicks", getSlamoClickPower(), true);
      }
      baseClickPower *= critEffectiveness;
    }

    if (isCrit === false) {
      increaseStat(state, "RNA", 0.01, true);
    }
    // normal amoeba click
    increaseStat(
      state,
      "amoeba",
      getClickPower(baseClickPower, state.M1Boost),
      true,
    );
    renderStats();
    renderProgressBar();
  }
});


slamo.addEventListener("click", function () {
  const timing = calculateTime(getSlamoClickCooldown, state.lastSlamoClickTime);

  const u10 = upgrades.find((u) => u.ID === "U10");
  if (u10.level >= 1) {
    if (timing.elapsed >= timing.cooldownMs) {
      state.lastSlamoClickTime = Date.now();
      increaseStat(slamoObj, "slamoClicks", getSlamoClickPower(), true);

      renderStats();

      checkSlamoMilestones(filteredMilestones, slamoObj.slamoClicks);
    }
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
export function switchToTab(button, tabName) {
  button.addEventListener("click", function () {
    mainTab.classList.add("hide");
    cellsTab.classList.add("hide");

    unhideElement(tabName);
  });
}
switchToTab(switchToAmoeba, mainTab);
switchToTab(switchToCells, cellsTab);

// ==============
// * 2. Rendering
// ==============

renderStats();
upgrades.forEach(renderUpgrade);

filteredMilestones.forEach((milestone) => {
  renderMilestone(milestone.ID);
});

// Game loop
setInterval(gameLoop, 1000);
requestAnimationFrame(tick);
renderDNAMachine();
renderSlamoUpgradeCounter();

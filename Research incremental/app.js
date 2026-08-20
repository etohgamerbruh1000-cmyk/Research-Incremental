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
  increaseStat,
  rollCrit,
} from "./modules/logic.js";
import {
  calculateTime,
  renderClasses,
  renderMilestone,
  renderProgressBar,
  renderStats,
  renderUpgrade,
  updateButtonBrightness,
} from "./modules/render.js";
import { state } from "./modules/state.js";
import {
  filteredMilestones,
  slamoData,
  slamoObj,
  upgrades,
} from "./modules/data.js";
import { resetStats } from "./modules/cells.js";

// session - gives important info
console.log("session 28 - creating RE1-3");

// button IDs
const amoebaButton = document.getElementById("amoebaButton");
const slamo = document.getElementById("slamo");
const cellResetBtn = document.getElementById("cellResetBtn");

// tabs
const switchToAmoeba = document.getElementById("switchToAmoeba");
const switchToCells = document.getElementById("switchToCells");

const mainTab = document.getElementById("mainTab");
const cellsTab = document.getElementById("cellsTab");

export let lastClickTime = 0;
// Gives amoeba, crit logic lives here.

amoebaButton.addEventListener("click", function () {
  const timing = calculateTime(getClickCooldown, lastClickTime);

  console.log("elapsed:", timing.elapsed, "cooldownMs:", timing.cooldownMs);
  if (timing.elapsed >= timing.cooldownMs) {
    lastClickTime = Date.now();
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
        increaseStat(slamoObj, "slamoClicks", slamoObj.slamoClickPower, true);
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

    setTimeout(() => {}, getClickCooldown() * 1000);
  }
});

export let lastSlamoClickTime = 0;
slamo.addEventListener("click", function () {
  const timing = calculateTime(getSlamoClickCooldown, lastSlamoClickTime);

  const u10 = upgrades.find((u) => u.ID === "U10");
  if (u10.level >= 1) {
    if (timing.elapsed >= timing.cooldownMs) {
      lastSlamoClickTime = Date.now();
      increaseStat(slamoObj, "slamoClicks", slamoObj.slamoClickPower, true);

      renderStats();
      console.log(
        "slamo clicks:",
        slamoData.find((entry) => entry.ID === "slamo").slamoClicks,
      );

      checkSlamoMilestones(filteredMilestones, slamoObj.slamoClicks);
      setTimeout(() => {}, getSlamoClickCooldown() * 1000);
    }
  }
});

cellResetBtn.addEventListener("click", function () {
  resetStats();
  cellResetBtn.classList.add("hide");
});

// general tab function, adds an event listener inside tabName
export function switchToTab(button, tabName) {
  console.log(document.getElementById(tabName));

  button.addEventListener("click", function () {
    mainTab.classList.add("hide");
    cellsTab.classList.add("hide");

    tabName.classList.remove("hide");
  });
}

// TODO: get the button element of mainTab and cellsTab
switchToTab(switchToAmoeba, mainTab);
switchToTab(switchToCells, cellsTab);

// ==============
// * 1. Rendering
// ==============

renderStats();
upgrades.forEach(renderUpgrade);

filteredMilestones.forEach((milestone) => {
  renderMilestone(milestone.ID);
});

// Game loop
setInterval(gameLoop, 1000);
requestAnimationFrame(tick);

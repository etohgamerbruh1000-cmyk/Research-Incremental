// app.js
// * Starts the game
// handles buttons, event listeners, and renders everything at first.

import {
  calculateTime,
  getClickCooldown,
  getClickPower,
  getCritEffectiveness,
  getCritIIGuarantee,
  getSlamoClickCooldown,
  getSlamoClickPower,
  increaseStat,
  levelOf,
  rollCrit,
} from "./src/calculations.js";
import { handleCellReset } from "./src/cells.js";

import { milestones, slamoMilestones, upgradeLibrary } from "./src/data.js";

import { attemptGameTick, gameLoop } from "./src/gameLoop.js";
import { checkMilestoneClaims } from "./src/milestones.js";
import {
  doc,
  render,
  renderDNAMachine,
  renderDNAUpgradeCounter,
  renderMilestone,
  renderProgressBar,
  renderUpgrade,
} from "./src/render.js";
import { createNext, loadGame } from "./src/save.js";

import { makeInitialState, replaceState, state } from "./src/state.js";
replaceState(loadGame() ?? makeInitialState());

// session - gives important info
console.log("Starting to plan the Research layer");
console.log("Session 65");

// button IDs using doc()
const amoebaButton = doc("amoebaButton");
const slamo = doc("slamo");
const cellResetBtn = doc("cellResetBtn");
const cell = doc("cell");



amoebaButton.addEventListener("click", () => {
  const time = getClickCooldown(state);
  const timing = calculateTime(time, state.runtime.lastClickTime);

  if (timing.elapsed >= timing.cooldownMs) {
    state.runtime.lastClickTime = Date.now();
    const u9 = upgradeLibrary.U9;
    const u17b = upgradeLibrary.U17b;
    if (u9 && u17b) {
      let isCrit = false;
      let baseClickPower = state.stats.clickPower;
      const critEffectiveness = getCritEffectiveness(state);
      state.runtime.timesClicked++;

      if (
        state.runtime.timesClicked % getCritIIGuarantee(state) === 0 &&
        levelOf(state, u9.ID) >= 1
      ) {
        console.log(
          "CRIT II! x2 click power, crit effect automatically applied :)",
        );
        baseClickPower *= critEffectiveness * 2;
      } else if (rollCrit(state)) {
        isCrit = true;
        if (levelOf(state, u17b.ID) >= 1) {
          increaseStat({
            target: state.resources,
            stat: "slamoClicks",
            amount: getSlamoClickPower(state),
            operation: "add",
          });
        }
        baseClickPower *= critEffectiveness;
      }

      // normal amoeba click
      increaseStat({
        target: state.resources,
        stat: "amoeba",
        amount: getClickPower(state, baseClickPower),
        operation: "add",
      });
      render(state);
      renderProgressBar(state);
    }
  }
});

// fuuuuuck
slamo.addEventListener("click", () => {
  const cooldownSeconds = getSlamoClickCooldown(state);
  const timing = calculateTime(
    cooldownSeconds,
    state.runtime.lastSlamoClickTime,
  );

  if (timing.elapsed >= timing.cooldownMs) {
    state.runtime.lastSlamoClickTime = Date.now();

    increaseStat({
      target: state.resources,
      stat: "slamoClicks",
      amount: getSlamoClickPower(state),
      operation: "add",
    });
    render(state);

    const next = createNext(state);
    checkMilestoneClaims(next, slamoMilestones);
  }
});

cellResetBtn.addEventListener("click", () => {
  handleCellReset(state);
  cellResetBtn.classList.add("hide");
});

cell.addEventListener("click", () => {
  state.runtime.totalEntropyClicks += 1;
});

// genal tab function, adds an event listener inside tabName

export function initializeGlobalTabs() {
  const tabButtons =
    document.querySelectorAll<HTMLButtonElement>("#tabList button");
  const tabPanels = document.querySelectorAll<HTMLElement>(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 1. Get the target ID from the clicked button's data attribute
      const targetId = button.getAttribute("data-tab");
      if (!targetId) return;

      const targetPanel = document.getElementById(targetId);
      if (!targetPanel) return;

      // 2. Hide ALL tab panels globally
      tabPanels.forEach((panel) => panel.classList.add("hide"));

      // 3. Reveal the chosen tab panel
      targetPanel.classList.remove("hide");
    });
  });
}

// Call this once when your application initializes
initializeGlobalTabs();



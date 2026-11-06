// startup.ts

import { upgradeLibrary, milestones } from "./data";
import { gameLoop, attemptGameTick } from "./gameLoop";
import {
  renderUpgrade,
  renderMilestone,
  renderProgressBar,
  render,
  renderDNAMachine,
  renderDNAUpgradeCounter,
} from "./render";
import { loadGame, createNext } from "./save";
import { state, replaceState } from "./state";

// TODO: fix this, i want to get state in, but dont wanna import
for (const upg of Object.values(upgradeLibrary)) {
  renderUpgrade(state, upg);
}
for (const milestone of Object.values(milestones)) {
  renderMilestone(state, milestone);
}

// 1. Load the data exactly once
const savedState = loadGame();

// 2. Overwrite your active engine state directly if a save exists
if (savedState !== null) {
  replaceState(savedState);
}

renderProgressBar(state);
setInterval(() => gameLoop(state), 1000);
const next = createNext(state);
render(next);
requestAnimationFrame(() => {
  attemptGameTick(state);
});

renderDNAMachine(state);
renderDNAUpgradeCounter(state);

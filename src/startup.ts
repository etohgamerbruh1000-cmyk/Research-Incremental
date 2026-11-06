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
import { state, replaceState, makeInitialState } from "./state";
import { initializeButtonBindings } from "./ui/bindings";
import { initializeGlobalTabs } from "./ui/tabs";

replaceState(loadGame() ?? makeInitialState());

renderProgressBar(state);
setInterval(() => gameLoop(state), 1000);
const next = createNext(state);
render(next);
requestAnimationFrame(() => {
  attemptGameTick(state);
});

renderDNAMachine(state);
renderDNAUpgradeCounter(state);

// TODO: fix this, i want to get state in, but dont wanna import
for (const upg of Object.values(upgradeLibrary)) {
  renderUpgrade(state, upg);
}
for (const milestone of Object.values(milestones)) {
  renderMilestone(state, milestone);
}

initializeButtonBindings();
initializeGlobalTabs();
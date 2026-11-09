// startup.ts

import { makeInitialState, replaceState, state } from "@/core/types";
import { upgradeLibrary } from "./data";
import { attemptGameTick, gameLoop } from "./gameLoop";
import {
  render,
  renderDNAMachine,
  renderDNAUpgradeCounter,
  renderMilestones,
  renderProgressBar,
  renderUpgrade,
} from "./render";
import { createNext, loadGame } from "./save";
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
renderMilestones(state);

initializeButtonBindings();
initializeGlobalTabs();

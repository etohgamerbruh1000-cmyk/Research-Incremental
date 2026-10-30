// upgradeSystem.js
// grefigfe

import { upgradeLibrary } from "./data.js";
import {
  editUpgradeDetails,
  renderDNAUpgradeCounter,
  render,
  updateUpgradeDisplay,
} from "./render.js";

import { state, State, Upgrade } from "./imports.js";

// TODO: make it not change STATE directly. use next instead.

export function canBuyPurchase(state: State, next: State, upgrade: Upgrade) {
  return (
    state.upgradeState[upgrade.ID].level <
      state.upgradeState[upgrade.ID].maxLevel &&
    next.resources[upgrade.costCurrency] >= getUpgradeCost(state, upgrade)
  );
}

export function getUpgradeCost(state: State, upgrade: Upgrade): number {
  const currentLevel = state.upgradeState[upgrade.ID].level;

  // 1. Call the formula with the next level and current state
  const costOrFunction = upgrade.costFormula(currentLevel + 1, state);

  // 2. If it returned a function, execute it with state. Otherwise, return the number.
  return typeof costOrFunction === "function"
    ? costOrFunction(state)
    : costOrFunction;
}

// it just blindly buys since theres a checker function
export function purchaseUpgrade(next: State, upgrade: Upgrade) {
  if (!next.upgradeState[upgrade.ID].level) {
    console.error("no upgradeIndex found.");
    return false;
  }
  next.resources[upgrade.costCurrency] -= getUpgradeCost(next, upgrade);
  next.upgradeState[upgrade.ID].level++;
  return true;
}

export function evaluateConditionalUnlocks(
  next: State,
  upgrade: Upgrade,
): boolean {
  const U17a = upgradeLibrary.find((upg) => upg.ID === "U17a");
  const U17b = upgradeLibrary.find((upg) => upg.ID === "U17b");
  if (!U17a || !U17b) {
    console.error("No id found for U17a?b");
    return false;
  }
  const upgradeIndex = next.upgradeState;
  if (upgrade === U17a && next.upgradeState["U17a"].level >= 1) {
    console.log("You already bought u17b.");
    return false;
  }

  if (upgrade === U17b && next.upgradeState["U17b"].level >= 1) {
    console.log("You already bought u17a.");
    return false;
  }

  return true;
}

export function updateUpgradeRendering(state: State, upgrade: Upgrade) {
  if (upgrade.ID.startsWith("DNA")) {
    renderDNAUpgradeCounter();
  }
  render();
  updateUpgradeDisplay(upgrade);
  editUpgradeDetails(upgrade, getUpgradeCost(state, upgrade));
}

// * Main function; buys upgrade with checking
export function attemptToBuyUpgrade(next: State, upgrade: Upgrade) {
  if (
    evaluateConditionalUnlocks(next, upgrade) &&
    canBuyPurchase(state, next, upgrade)
  ) {
    console.log(`Bought upgrade: ${upgrade.name}`);
    purchaseUpgrade(next, upgrade);
    calculateUpgradeEffect(next, upgrade);
    updateUpgradeRendering(next, upgrade);
    const level = next.upgradeState[upgrade.ID];
    // 1. Ensure the upgrade object exists
    if (upgrade) {
      if (typeof upgrade.onPurchase === "function") {
        // 3. Execute it safely passing your parameters
        upgrade.onPurchase(level, next);
      }
    }

    return next;
  }
}

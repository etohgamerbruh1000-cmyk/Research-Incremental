// upgradeSystem.js

import { levelOf, maxLevelOf } from "./calculations.js";
import { upgradeLibrary, Upgrade } from "./data.js";
import {
  editUpgradeDetails,
  renderDNAUpgradeCounter,
  render,
  updateUpgradeDisplay,
} from "./render.js";
import { state, State } from "./state.js";


export function canBuyPurchase(state: State, next: State, upgrade: Upgrade) {
  return (
    levelOf(state, upgrade.ID) < maxLevelOf(state, upgrade) &&
    next.resources[upgrade.costCurrency] >= getUpgradeCost(state, upgrade)
  );
}

export function getUpgradeCost(state: State, upgrade: Upgrade): number {
  const currentLevel = state?.upgradeState?.[upgrade?.ID]?.level ?? 0;

  // 1. Call the formula with the next level and current state
  const costOrFunction = upgrade.costFormula(currentLevel + 1, state);

  // 2. If it returned a function, execute it with state. Otherwise, return the number.
  return typeof costOrFunction === "function"
    ? costOrFunction(state)
    : costOrFunction;
}

// it just blindly buys since theres a checker function
export function purchaseUpgrade(next: State, upgrade: Upgrade): boolean {
  const currentUpgrade = next.upgradeState[upgrade.ID];

  // Fix: Check for undefined or null, allowing level 0
  if (!currentUpgrade || currentUpgrade.level === undefined) {
    console.error(`Upgrade state not found for ID: ${upgrade.ID}`);
    return false;
  }

  // Apply mutations
  next.resources[upgrade.costCurrency] -= getUpgradeCost;
  currentUpgrade.level++;

  return true;
}

export function evaluateConditionalUnlocks(
  next: State,
  upgrade: Upgrade,
): boolean {
  const U17a = upgradeLibrary.U17a;
  const U17b = upgradeLibrary.U17b;
  if (!U17a || !U17b) {
    console.error("No id found for U17a?b");
    return false;
  }
  if (next.upgradeState?.U17a?.level && next.upgradeState?.U17b?.level) {
    if (upgrade === U17a && next.upgradeState.U17b.level >= 1) return false;
    if (upgrade === U17b && next.upgradeState.U17a.level >= 1) return false;
  }

  return true;
}

export function updateUpgradeRendering(state: State, upgrade: Upgrade) {
  if (upgrade.ID.startsWith("DNA")) {
    renderDNAUpgradeCounter(state);
  }
  render(state);
  updateUpgradeDisplay(upgrade, state);
  editUpgradeDetails(upgrade, getUpgradeCost(state, upgrade));
}

// * Main function; buys upgrade with checking
export function attemptToBuyUpgrade(next: State, upgrade: Upgrade): State {
  if (
    evaluateConditionalUnlocks(next, upgrade) &&
    canBuyPurchase(state, next, upgrade)
  ) {
    console.log(`Bought upgrade: ${upgrade.name}`);
    purchaseUpgrade(next, upgrade);

    updateUpgradeRendering(next, upgrade);

    // 1. Ensure the upgrade object exists
    if (upgrade) {
      if (typeof upgrade.onPurchase === "function") {
        // 3. Execute it safely passing your parameters
        upgrade.onPurchase(levelOf(state, upgrade.ID), next);
      }
    }
  }
  return next;
}

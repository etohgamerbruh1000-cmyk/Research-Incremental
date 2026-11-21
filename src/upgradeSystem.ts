// upgradeSystem.js


import { State, Upgrade } from "@/core/types";

import { levelOf, maxLevelOf } from "./calculations";
import { upgradeLibrary } from "./data";
import {
    editUpgradeDetails,
    render,
    renderDNAUpgradeCounter,
    updateUpgradeDisplay,
} from "./render";

export function canBuyPurchase(state: State, next: State, upgrade: Upgrade) {
  return (
    levelOf(state, upgrade.ID) < maxLevelOf(state, upgrade) &&
    next.resources[upgrade.costCurrency as keyof typeof next.resources] >= getUpgradeCost(state, upgrade)
  );
}

export function getUpgradeCost(state: State, upgrade: Upgrade): number {
  const nextLevel = levelOf(state, upgrade.ID) + 1;
  const cost = upgrade.costFormula(nextLevel, state);

  return cost;
}

// it just blindly buys since theres a checker function
export function purchaseUpgrade(next: State, upgrade: Upgrade): boolean {
  const currentUpgrade = next.upgradeState[upgrade.ID];

  // Fix: Check for undefined or null, allowing level 0
  if (!currentUpgrade || currentUpgrade.level === undefined) {
    console.error(`Upgrade state entry not found for ID: ${upgrade.ID}`);
    return false;
  }
  

  // Apply mutations
  next.resources[upgrade.costCurrency as keyof typeof next.resources] -= getUpgradeCost(next, upgrade);
  currentUpgrade.level++;

  return true;
}

export function checkMutualExclusivity(
  next: State,
  upgrade: Upgrade,
): boolean {
  const { U17a: activeUpg, U17b: idleUpg } = upgradeLibrary;
  if (!activeUpg || !idleUpg) {
    console.error("Missing U17a or U17b in upgradeLibrary");
    return false;
  }

  const levelA = next.upgradeState?.U17a?.level ?? 0;
  const levelB = next.upgradeState?.U17b?.level ?? 0;

  if (upgrade === activeUpg) return levelB === 0;
  if (upgrade === idleUpg) return levelA === 0;

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
  const isEligible =
    checkMutualExclusivity(next, upgrade) &&
    canBuyPurchase(next, next, upgrade);

  if (!isEligible) {
    return next;
  }

  console.log(`Bought upgrade: ${upgrade.name}`);
  purchaseUpgrade(next, upgrade);
  updateUpgradeRendering(next, upgrade);

  upgrade.onPurchase?.(levelOf(next, upgrade.ID), next);

  return next;
}


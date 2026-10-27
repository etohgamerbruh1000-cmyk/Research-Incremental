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
    next.resources[upgrade.costCurrency] >= getCost(upgrade)
  );
}

export function getCost(state: State, upgrade: Upgrade) {
  return upgrade.costFormula(state.upgradeState[upgrade.ID].level + 1);
}

// it just blindly buys since theres a checker function
export function purchaseUpgrade(next: State, upgrade: Upgrade) {
  next.resources[upgrade.costCurrency] -= getCost(upgrade);
  if (!next.upgradeState[upgrade.ID].level) {
    console.error("no upgradeIndex found.");
    return false;
  }
  next.upgradeState[upgrade.ID].level++;
  return true;
}

export function evaluateConditionalUnlocks(next: State, upgrade: Upgrade) {
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

  if (upgrade.unlock) {
    next.flags.unlocked[upgrade.unlock] = true;
  }

  return true;
}

export function updateUpgradeRendering(upgrade: Upgrade) {
  if (upgrade.ID.startsWith("DNA")) {
    renderDNAUpgradeCounter();
  }
  render();
  updateUpgradeDisplay(upgrade);
  editUpgradeDetails(upgrade, getCost(upgrade));
}

export function calculateUpgradeEffect(next: State, upgrade: Upgrade) {
  if (!upgrade.effects) return;

  upgrade.effects.forEach((e: Upgrade["effects"][number]) => {
    // Determine the level after the purchase to calculate correct formula value
    const currentLvl = next?.upgradeState[upgrade.ID]?.level;
    const value = e.effectFormula(currentLvl);

    // Get the exact stat name string from the effect (e.g., "critEffectiveness")
    const statName = e.name;

    // Dynamically update the correct resource/stat
    if (e.type === "multiply") {
      next.resources[statName] *= value;
    } else if (e.type === "add") {
      next.resources[statName] += value;
    } else if (e.type === "subtract") {
      next.resources[statName] -= value;
    }
  });
}

// * Main function; buys upgrade with checking
export function buyUpgrade(next: State, upgrade: Upgrade) {
  if (
    evaluateConditionalUnlocks(next, upgrade) &&
    canBuyPurchase(state, next, upgrade)
  ) {
    console.log(`Bought upgrade: ${upgrade.name}`);
    purchaseUpgrade(next, upgrade);
    calculateUpgradeEffect(next, upgrade);
    updateUpgradeRendering(upgrade);
  }
  return next;
}

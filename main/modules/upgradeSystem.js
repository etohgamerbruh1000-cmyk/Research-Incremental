// upgradeSystem.js
// grefigfe

import { upgradeLibrary } from "./data.js";
import {
  editUpgradeDetails,
  renderDNAUpgradeCounter,
  render,
  updateUpgradeDisplay,
} from "./render.js";

// TODO: make it not change STATE directly. use next instead.

export function canBuyPurchase(next, upgrade) {
  return (
    upgrade.level < upgrade.maxLevel &&
    next.resources[upgrade.costCurrency] >=
      upgrade.costFormula(upgrade.level + 1)
  );
}

// doesnt do any checking since it just blindly does it since theres a checker function
export function purchaseUpgrade(next, upgrade) {
  next.resources[upgrade.costCurrency] -= upgrade.costFormula(
    upgrade.level + 1,
  );
  if (!next.upgradeState[upgrade.ID].level) {
    console.error("no upgradeIndex found ig");
    return false;
  }
  next.upgradeState[upgrade.ID].level++;
}

export function evaluateConditionalUnlocks(next, upgrade) {
  const U17a = upgradeLibrary.find((upg) => upg.ID === "U17a");
  const U17b = upgradeLibrary.find((upg) => upg.ID === "U17b");

  if (upgrade === U17a && U17b.level >= 1) {
    console.log("You already bought u17b.");
    return false;
  }

  if (upgrade === U17b && U17a.level >= 1) {
    console.log("You already bought u17a.");
    return false;
  }

  if (upgrade.unlock) {
    next.flags.unlocked[upgrade.unlock] = true;
  }

  return true;
}
export function updateUpgradeRendering(upgrade) {
  if (upgrade.ID.startsWith("DNA")) {
    renderDNAUpgradeCounter();
  }
  render();
  updateUpgradeDisplay(upgrade);
  editUpgradeDetails(upgrade, upgrade.costFormula(upgrade.level + 1));
}
export function calculateUpgradeEffect(next, upgrade) {
  if (!upgrade.effects) return;

  upgrade.effects.forEach((e) => {
    // Determine the level after the purchase to calculate correct formula value
    const currentLvl =
      next.upgradeState.find((u) => u.ID === upgrade.ID)?.level ??
      upgrade.level;
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

export function buyUpgrade(next, upgrade) {
  if (
    evaluateConditionalUnlocks(next, upgrade) &&
    canBuyPurchase(next, upgrade)
  ) {
    console.log(`Bought upgrade: ${upgrade.name}`);
    purchaseUpgrade(next, upgrade);
    calculateUpgradeEffect(next, upgrade);
    updateUpgradeRendering(upgrade);
  }
  return next;
}

// logic.js
// handles resource gain, upgrade buying

import {
  renderDNAUpgradeCounter,
  renderStats,
  updateUpgradeDisplay,
  editUpgradeDetails,
} from "./render.js";

import { milestones, slamoData, upgradeLibrary } from "./data.js";

export function increaseStat({ target, stat, amount, operation }) {
  if (operation === "add") {
    target[stat] += amount;
  } else {
    target[stat] *= amount;
  }
  // removed dynamic milestone checking;
  // it is now inside reducer()
}

// TODO: make it not change STATE directly. use next instead.

export function canBuyPurchase(next, upgrade) {
  return (
    upgrade.level < upgrade.maxLevel &&
    next.resources[upgrade.costCurrency] >=
      upgrade.costFormula(upgrade.level + 1)
  );
}

export function purchaseUpgrade(next, upgrade) {
  next.resources[upgrade.costCurrency] -= upgrade.costFormula(
    upgrade.level + 1,
  );

  next.upgradeState.find((upg) => upg.ID === upgrade.ID).level++;
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
  renderStats();
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
}

// Recalculates stat from scratch.
// Generic function; you can repurpose it into getCritChance, getCritEffectiveness,...

export function getEffectsFor(target, baseStat) {
  let stat = baseStat;

  upgradeLibrary.forEach((upgrade) => {
    if (upgrade.level < 1) return; // not owned yet

    if (upgrade.effects) {
      upgrade.effects
        // find all upgrades which effects boost stat
        .filter((e) => e.name === target)
        // for each of the upgrades that boost stat, apply its effect
        .forEach((e) => {
          const value = e.effectFormula(upgrade.level);
          if (e.type === "multiply") stat *= value;
          else if (e.type === "add") stat += value;
          else if (e.type === "subtract") stat -= value;
        });
    } else if (upgrade.currencyEffect === target) {
      const value = upgrade.effectFormula(upgrade.level);
      if (upgrade.type === "multiply") stat *= value;
      else if (upgrade.type === "add") stat += value;
      else if (upgrade.type === "subtract") stat -= value;
    }
  });
  return stat;
}

// ====================
// * 2. get effects for
// ====================

export function getSlamoMilestoneBoost() {
  const m1 = milestones.find((milestone) => milestone.ID === "M1");
  if (!m1 || !m1.claimed) return 1;
  return 1 + slamoData.slamoClicks * 0.01;
}

export function getClickPower(baseClickPower) {
  const clickPowerMultiplier = getEffectsFor("clickPower", baseClickPower);
  return clickPowerMultiplier * getSlamoMilestoneBoost();
}

export function getClickCooldown() {
  return Math.max(getEffectsFor("clickCooldown", 0.5), 0.25);
}

export function getSlamoClickCooldown() {
  return Math.max(getEffectsFor("slamoClickCooldown", 3), 1);
}

export function getSlamoClickPower() {
  return getEffectsFor("slamoClickPower", 1);
}
// The function returns clicks.
export function getSlamoBoost(clicks) {
  if (clicks >= 250) {
    clicks = 250;
  }
  return 1 + clicks / 100;
}

export function getCritChance() {
  return getEffectsFor("critChance", 1);
}

export function getCritEffectiveness() {
  return getEffectsFor("critEffectiveness", 1);
}

export function getCritIIGuarantee() {
  return getEffectsFor("critIIGuarantee", 0);
}

export function getEntropyPerSecond() {
  return getEffectsFor("entropy", 1);
}

export function rollCrit() {
  const roll = Math.random() * 100;
  const needed = getCritChance();
  if (roll < needed) {
    console.log("Crit!", "Effectiveness:", getCritEffectiveness(), "x");
  } else return roll < needed;
}

// Synergy helpers moved to modules/synergy.js to avoid circular imports.

// logic.js
// handles resource gain, upgrade buying

import { milestones, upgradeLibrary } from "./data.js";

export function increaseStat({ target, stat, amount, operation }) {
  // 1. Structural Check: Ensure all parameters are present
  if (!target || !stat || amount === undefined || !operation) {
    console.error("Didn't find increaseStat params :(");
    return false;
  }

  // 2. Target Check: Ensure the property actually exists or initialize it safely if numeric
  if (target[stat] === undefined) {
    target[stat] = 0;
  }

  // 3. Mathematical Evaluation
  if (operation === "add") {
    target[stat] += amount;
  } else if (operation === "multiply") {
    target[stat] *= amount;
  } else {
    // Catches typos like "multply" or "addition" right at the source
    console.error(`Incorrect operation in increaseStat: "${operation}"`);
    return false;
  }

  // 4. Return explicit success confirmation
  return true;
}

// Recalculates stat from scratch.
// Generic function; you can repurpose it into getCritChance, getCritEffectiveness,...

export function getEffectsFor(target, baseStat, state) {
  let stat = baseStat;

  upgradeLibrary.forEach((upgrade) => {
    if (state.upgradeState[upgrade.ID].level < 1) return; // not owned yet

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

export function getSlamoMilestoneBoost(state) {
  const m1 = milestones.find((milestone) => milestone.ID === "M1");
  if (!m1 || !m1.claimed) return 1;
  return 1 + state.resources.slamoClicks * 0.01;
}

export function getClickPower(state, baseClickPower) {
  const clickPowerMultiplier = getEffectsFor("clickPower", baseClickPower);
  return clickPowerMultiplier * getSlamoMilestoneBoost(state);
}

export function getClickCooldown(state) {
  return Math.max(getEffectsFor("clickCooldown", 0.5, state), 0.25);
}

export function getSlamoClickCooldown(state) {
  return Math.max(getEffectsFor("slamoClickCooldown", 3, state), 1);
}

export function getSlamoClickPower(state) {
  return getEffectsFor("slamoClickPower", 1, state);
}
// The function returns clicks.
export function getSlamoBoost(clicks) {
  if (clicks >= 250) {
    clicks = 250;
  }
  return 1 + clicks / 100;
}

export function getCritChance(state) {
  return getEffectsFor("critChance", 1, state);
}

export function getCritEffectiveness(state) {
  return getEffectsFor("critEffectiveness", 1, state);
}

export function getCritIIGuarantee(state) {
  return getEffectsFor("critIIGuarantee", 0, state);
}

export function getEntropyPerSecond(state) {
  return getEffectsFor("entropy", 1, state);
}

export function rollCrit() {
  const roll = Math.random() * 100;
  const needed = getCritChance();
  if (roll < needed) {
    console.log("Crit!", "Effectiveness:", getCritEffectiveness(), "x");
  } else return roll < needed;
}

export function calculateTime(cooldownFunction, clickTimeVariable) {
  const cooldownMs = cooldownFunction() * 1000;
  const elapsed = Date.now() - clickTimeVariable;
  const progress = Math.min(elapsed / cooldownMs, 1);
  return { cooldownMs, elapsed, progress };
}
// Synergy helpers moved to modules/synergy.js to avoid circular imports.

// logic.js
// handles resource gain, upgrade buying

import {
  renderButtonText,
  renderStats,
  updateUpgradeDisplay,
} from "./render.js";
import { state } from "./state.js";
import { slamoData, upgrades } from "./data.js";

// ===================
// * 1. Stat increases
// ===================

// Example parameters: increaseStat(state, "amoeba", 1, true)
// The code above states "Find an array called state, find a property called amoeba, and add it by 1."
export function increaseStat(target, stat, amount, add) {
  if (add === true) {
    target[stat] += amount;
  } else {
    target[stat] = target[stat] * amount;
  }
}

export function buyUpgrade(upgrade) {
  const U17a = upgrades.find((upg) => upg.ID === "U17a");
  const U17b = upgrades.find((upg) => upg.ID === "U17b");
  const U12 = upgrades.find((upg) => upg.ID === "U12");
  if (upgrade === U12 && U12.level <= 0) {
    state.g1EffectFormula += 0.01;
  }
  if (upgrade === U17a) {
    if (U17b.level >= 1) {
      console.log("you already bought u17b.");
      return;
    }
  }

  if (upgrade === U17b) {
    if (U17a.level >= 1) {
      console.log("you already bought u17a.");
      return;
    }
  }

  if (
    upgrade.level < upgrade.maxLevel &&
    state[upgrade.costCurrency] >= upgrade.costFormula(upgrade.level + 1)
  ) {
    state[upgrade.costCurrency] -= upgrade.costFormula(upgrade.level + 1);

    if (upgrade.effects === "critIIGuarantee") {
      state.critIIGuarantee = getCritIIGuarantee();
    }

    if (upgrade.effects === "slamoClickCooldown") {
      state.slamoClickCooldown = getSlamoClickCooldown();
    }

    upgrade.level++;

    if (upgrade.effects) {
      upgrade.effects
        .filter((e) => e.name === "amoeba")
        .forEach((e) => {
          const value = e.effectFormula(upgrade.level);
          if (e.type === "multiply") {
            state.amoeba *= value;
          } else if (e.type === "add") {
            state.amoeba += value;
          } else if (e.type === "subtract") state.amoeba -= value;
        });
    }

    renderStats();
    updateUpgradeDisplay(upgrade);
    console.log("Bought upgrade:", upgrade.name);

    if (upgrade.unlock) {
      state.unlocked[upgrade.unlock] = true;
    }
  } else {
    console.log("couldn't buy upgrade:", upgrade.name);
  }
}

// * This is a source of truth.
// Recalculates stat from scratch.
// Generic function; you can repurpose it into getCritChance, getCritEffectiveness,...

export function getEffectsFor(target, baseStat) {
  let stat = baseStat;

  upgrades.forEach((upgrade) => {
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

export function getClickPower(baseClickPower, M1Boost) {
  return getEffectsFor("clickPower", baseClickPower * M1Boost);
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
  } else console.log("Roll:", roll, "Needed:", needed);
  return roll < needed;
}

// synergy overrides the previous formula (ex. u7 overrides u3.)
export function getSynergyMultiplier() {
  const u3 = upgrades.find((upg) => upg.ID === "U3");
  const u7 = upgrades.find((upg) => upg.ID === "U7");
  const u18 = upgrades.find((upg) => upg.ID === "U18");
  let multiplier;

  if (u3.level >= 1) {
    multiplier = 1 + Math.log10(1 + Math.sqrt(state.amoeba)) / Math.log10(100);
  }

  if (u7.level >= 1) {
    multiplier = 1 + Math.log10(1 + state.amoeba ** 0.6) / Math.log10(70);
  }

  if (u18.level >= 1) {
    multiplier = 1 + Math.log10(1 + state.amoeba ** 0.75) / Math.log10(40);
  }

  return multiplier;
}

export function getRNASynergyMultiplier() {
  const u14 = upgrades.find((upg) => upg.ID === "U14");

  let multiplier;

  if (u14.level >= 1) {
    // placeholder multiplier; replace soon
    multiplier = 1 + Math.log10(1 + Math.sqrt(state.amoeba)) / Math.log10(100);
  }

  return multiplier;
}

export function checkSlamoMilestones(milestones, clicks) {
  // claimed === false to stop M2's effect from infinitely compounding
  if (clicks >= milestones[0].clicks) {
    milestones[0].claimed = true;
    state.M1Boost = getSlamoBoost(clicks);
    console.log("Found milestone:", milestones[0]);
  }
  if (clicks >= milestones[1].clicks && milestones[1].claimed === false) {
    milestones[1].claimed = true;
    upgrades.find((u) => u.ID === "U2").maxLevel += 2;
    console.log("Found milestone:", milestones[1]);
  }
  if (clicks >= milestones[2].clicks && milestones[2].claimed === false) {
    state.clickCooldown * 0.95;
    milestones[2].claimed = true;
    console.log("Found milestone:", milestones[2]);
  }
}

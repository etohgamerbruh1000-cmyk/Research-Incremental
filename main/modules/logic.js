// logic.js
// handles resource gain, upgrade buying

import {
  renderMilestoneText,
  renderDNAUpgradeCounter,
  renderStats,
  updateUpgradeDisplay,
  editUpgradeDetails,
} from "./render.js";
import { state } from "./state.js";
import { milestones, upgrades } from "./data.js";

// ===================
// * 1. Stat increases
// ===================

export function increaseStat(target, stat, amount, add) {
  console.log("keyedStat:", keyedStat);

  let keyedStat = target[stat];
  if (add === true) {
    // slamoData.slamoClicks
    keyedStat += amount;
  } else {
    keyedStat = target[stat] * amount;
  }

  milestones.forEach((milestone) => {
    if (milestone.claimed) {
      if (milestone.stat === stat) {
        checkMilestoneEffect(milestone, keyedStat);
      }
    }
  });
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
      console.log("You already bought u17b.");
      return;
    }
  }

  if (upgrade === U17b) {
    if (U17a.level >= 1) {
      console.log("You already bought u17a.");
      return;
    }
  }

  if (upgrade.ID.startsWith("DNA")) {
    renderDNAUpgradeCounter();
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
    editUpgradeDetails(upgrade, upgrade.costFormula(upgrade.level + 1));
    console.log("Bought upgrade:", upgrade.name);

    if (upgrade.unlock) {
      state.unlocked[upgrade.unlock] = true;
    }
  } else {
    console.log("Failed to purchase:", upgrade.name, `(${upgrade.ID})`);
  }
}

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

export function getClickPower(baseClickPower) {
  return getEffectsFor("clickPower", baseClickPower);
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
    // TODO: placeholder multiplier; replace soon
    multiplier = 1 + Math.log10(1 + Math.sqrt(state.amoeba)) / Math.log10(100);
  }
  return multiplier;
}

// ==============
//! 1. MILESTONES
// ==============

// * runs ONLY when the milestone isn't dynamic.
export function calculateMilestoneEffect(milestone) {
  if (!milestone.effect) return;
  if (!milestone.target || !milestone.value || !milestone.array) return;

  let effectedStat = milestone.array[milestone.target];
  let value = milestone.value;

  if (milestone.effect.type === "multiply") {
    effectedStat *= value;
  }
  if (milestone.effect.type === "divide") {
    effectedStat /= value;
  }
  if (milestone.effect.type === "add") {
    effectedStat += value;
  }
  if (milestone.effect.type === "subtract") {
    effectedStat -= value;
  }
}

// TODO: make milestone.currency
export function applyDynamicMilestoneEffect(milestone, currency) {
  clampDynamicEffect(milestone);
}

export function clampDynamicEffect(milestone) {
  const clamped = Math.min(milestone.currency, milestone.effect.cap);
  milestone.currentEffect = clamped;
  return clamped;
}

// checks what milestone type is and calculates milestone effect accordingly
// MAIN
export function checkMilestoneEffect(milestone, currency) {
  if (milestone.type === "dynamic") {
    applyDynamicMilestoneEffect(milestone, currency);
  }
  if (milestone.claimed) return;
  calculateMilestoneEffect(milestone);
}

// * checks milestone claim,
// ex. checkMilestone(slamoMilestones, slamoClicks)
export function checkMilestoneClaim(milestoneType, currency) {
  for (let i = 0; i < milestoneType.length; i++) {
    const forgedID = "milestone-" + milestoneType[i].ID;
    const milestoneLi = document.getElementById(forgedID);
    const data = {
      needed: milestoneType[i].needed,
      claimed: milestoneType[i].claimed,
      type: milestoneType[i].type,
    };
    if (data.type === "dynamic") {
    }
    if (currency >= data.needed && data.claimed === false) {
      milestoneType[i].claimed = true;
      console.log("Unlocked milestone:", milestoneType[i]);
      checkMilestoneEffect(milestoneType[i], currency);
      renderMilestoneText(milestoneLi, milestoneType[i]);
    }
  }
}

export function RENAME_THIS_I_JUST_CAME_BACK_AFTER_A_MONTH_OF_NOT_PROGRAMMING(state) {
  let keyedStat = milestones.forEach((milestone) => {
    if (milestone.claimed) {
      if (milestone.stat === stat) {
        checkMilestoneEffect(milestone, keyedStat);
      }
    }
  });
}

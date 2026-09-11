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
import { milestones, slamoData, upgradeLibrary } from "./data.js";

// ===================
// * 1. Stat increases
// ===================

export function increaseStat(target, stat, amount, add) {
  if (add === true) {
    // slamoData.slamoClicks
    target[stat] += amount;
  } else {
    target[stat] = target[stat] * amount;
  }

  const dynamicMilestones = milestones.filter(
    (milestone) => milestone.type === "dynamic",
  );

  for (let i = 0; i < dynamicMilestones.length; i++) {
    if (dynamicMilestones[i].claimed) {
      const nextState = calculateDynamicMilestoneEffect(dynamicMilestones[i]);
      if (nextState) {
        Object.assign(state, nextState);
      }
    }
  }
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

  next.upgradeState.find((upg) => upg.ID === upgrade.ID)
    .level++;
}

export function evaluateConditionalUnlocks(next, upgrade) {
  const U17a = upgradeLibrary.find((upg) => upg.ID === "U17a");
  const U17b = upgradeLibrary.find((upg) => upg.ID === "U17b");
  const U12 = upgradeLibrary.find((upg) => upg.ID === "U12");
  if (upgrade === U12 && U12.level <= 0) {
    next.stats.g1EffectFormula += 0.01;
  }
  if (upgrade === U17a && U17b.level >= 1) {
    console.log("You already bought u17b.");
    return false;
  }

  if (upgrade === U17b && U17a.level >= 1) {
    console.log("You already bought u17a.");
    return false;
  }

  if (upgrade.effects === "critIIGuarantee") {
    next.stats.critIIGuarantee = getCritIIGuarantee();
  }

  if (upgrade.effects === "slamoClickCooldown") {
    next.stats.slamoClickCooldown = getSlamoClickCooldown();
  }

  if (upgrade.unlock) {
    next.flags.unlocked[upgrade.unlock] = true;
  }
  if (upgrade.ID.startsWith("DNA")) {
    renderDNAUpgradeCounter();
  }
  return true;
}
export function updateUpgradeRendering(upgrade) {
  renderStats();
  updateUpgradeDisplay(upgrade);
  editUpgradeDetails(upgrade, upgrade.costFormula(upgrade.level + 1));
  console.log("Bought upgrade:", upgrade.name);
}
export function calculateUpgradeEffect(next, upgrade) {
  if (upgrade.effects) {
    upgrade.effects
      .filter((e) => e.name === "amoeba")
      .forEach((e) => {
        const value = e.effectFormula(upgrade.level);
        if (e.type === "multiply") {
          next.resources.amoeba *= value;
        } else if (e.type === "add") {
          next.resources.amoeba += value;
        } else if (e.type === "subtract") next.resources.amoeba -= value;
      });
  }
}

export function buyUpgrade(next, upgrade) {
  if (evaluateConditionalUnlocks(next, upgrade)) {
    if (canBuyPurchase(next, upgrade)) {
      purchaseUpgrade(next, upgrade);
      calculateUpgradeEffect(next, upgrade);
      updateUpgradeRendering(upgrade);
    }
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

// synergy overrides the previous formula (ex. u7 overrides u3.)
// Synergy helpers moved to modules/synergy.js to avoid circular imports.

// Milestone logic

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

    if (currency >= data.needed && !data.claimed) {
      milestoneType[i].claimed = true;

      // dynamic milestone checking is inside increaseStat.
      applyMilestoneEffect(milestoneType[i]);

      console.log("Unlocked milestone:", milestoneType[i]);
      renderMilestoneText(milestoneLi, milestoneType[i]);
    }
  }
}

// not with dynamic effects
// TODO: Please change order if neccessaey
export function applyMilestoneEffect(milestoneType) {
  if (typeof milestoneType.effect !== "function") return;
  const nextState = calculateDynamicMilestoneEffect(milestoneType);
  if (nextState) {
    Object.assign(state, nextState);
  }
}

// recalculates milestone effects from scratch
// TODO: Create effect functionality.
export function calculateDynamicMilestoneEffect(milestoneType) {
  if (typeof milestoneType.effect !== "function") return;
  const effect = milestoneType.effect({
    state,
    slamoData,
    upgrades: upgradeLibrary,
    // add more
  });

  return effect;
}

//ex. {type: buyUpgrade, ID: "U17a"}
export function reducer(state, action) {
  switch (action.type) {
    case "buyUpgrade": {
      const next = structuredClone(state);
      const upgradeID = action.ID;
      const upg = upgradeLibrary.find((u) => u.ID === upgradeID);
      buyUpgrade(next, upg);
      return next;
    }
    case "claimMilestone": {
      return state;
    }
    case "cellsReset": {
      return state;
    }

    default:
      console.warn("Invalid prompt:", action);
  }
}

// formulas.js
// Pure calculation helpers for click, crit, cooldown, and synergy values.

import { milestones, slamoData, upgradeLibrary } from "./data.js";
import { state } from "./state.js";

export function getEffectsFor(target, baseStat) {
  let stat = baseStat;

  upgradeLibrary.forEach((upgrade) => {
    if (upgrade.level < 1) return;

    if (upgrade.effects) {
      upgrade.effects
        .filter((e) => e.name === target)
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
  return false;
}

export function getSynergyMultiplier() {
  const u3 = upgradeLibrary.find((upg) => upg.ID === "U3");
  const u7 = upgradeLibrary.find((upg) => upg.ID === "U7");
  const u18 = upgradeLibrary.find((upg) => upg.ID === "U18");
  let multiplier;

  if (u3 && u3.level >= 1) {
    multiplier =
      1 + Math.log10(1 + Math.sqrt(state.resources.amoeba)) / Math.log10(100);
  }
  if (u7 && u7.level >= 1) {
    multiplier =
      1 + Math.log10(1 + state.resources.amoeba ** 0.6) / Math.log10(70);
  }
  if (u18 && u18.level >= 1) {
    multiplier =
      1 + Math.log10(1 + state.resources.amoeba ** 0.75) / Math.log10(40);
  }

  return multiplier;
}

export function getRNASynergyMultiplier() {
  const u14 = upgradeLibrary.find((upg) => upg.ID === "U14");
  let multiplier;

  if (u14 && u14.level >= 1) {
    multiplier =
      1 + Math.log10(1 + Math.sqrt(state.resources.amoeba)) / Math.log10(100);
  }
  return multiplier;
}

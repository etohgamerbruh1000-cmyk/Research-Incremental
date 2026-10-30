// logic.js
// handles resource gain, upgrade buying

import { milestones, upgradeLibrary } from "./data.js";
import { state, State, Upgrade } from "./imports.js";

// We declare <T> right before the arguments list
export function increaseStat<T extends Record<string | number, any>>({
  target,
  stat,
  amount,
  operation,
}: {
  target: T;
  stat: keyof T; // This guarantees 'stat' is a valid property name of 'target'
  amount: number;
  operation: "add" | "multiply";
}): boolean {
  // 1. Structural Check
  if (!target || stat === undefined || amount === undefined || !operation) {
    console.error("Didn't find increaseStat params :(");
    return false;
  }

  // 2. Target Check: Cast target[stat] as any to bypass dynamic assignment limits
  if ((target as any)[stat] === undefined) {
    (target as any)[stat] = 0;
  }

  // 3. Mathematical Evaluation
  if (operation === "add") {
    (target as any)[stat] += amount;
  } else if (operation === "multiply") {
    (target as any)[stat] *= amount;
  } else {
    console.error(`Incorrect operation in increaseStat: "${operation}"`);
    return false;
  }

  return true;
}

// Recalculates stat from scratch.
// Generic function; you can repurpose it into getCritChance, getCritEffectiveness,...

export function getEffectsFor(target: string, baseStat: number, state: State) {
  let stat = baseStat;

  upgradeLibrary.forEach((upgrade: Upgrade) => {
    if (state.upgradeState[upgrade.ID].level < 1) return; // not owned yet

    if (upgrade.effects) {
      upgrade.effects
        // find all upgrades which effects boost stat
        .filter((e) => e.name === target)
        // for each of the upgrades that boost stat, apply its effect
        .forEach((e) => {
          const value = e.effectFormula(levelOf(state, upgrade.ID));
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

export function getSlamoMilestoneBoost(state: State) {
  const m1 = milestones.find((milestone) => milestone.ID === "M1");
  if (!m1 || !state.milestones["M1"].claimed) return 1;
  return 1 + state.resources.slamoClicks * 0.01;
}

export function getClickPower(state: State, baseClickPower: number) {
  const clickPowerMultiplier = getEffectsFor(
    "clickPower",
    baseClickPower,
    state,
  );
  return clickPowerMultiplier * getSlamoMilestoneBoost(state);
}

export function getClickCooldown(state: State) {
  return Math.max(getEffectsFor("clickCooldown", 0.5, state), 0.25);
}

export function getSlamoClickCooldown(state: State) {
  return Math.max(getEffectsFor("slamoClickCooldown", 3, state), 1);
}

export function getSlamoClickPower(state: State) {
  return getEffectsFor("slamoClickPower", 1, state);
}
// The function returns clicks.
export function getSlamoBoost(clicks: number) {
  if (clicks >= 250) {
    clicks = 250;
  }
  return 1 + clicks / 100;
}

export function getCritChance(state: State) {
  return getEffectsFor("critChance", 1, state);
}

export function getCritEffectiveness(state: State) {
  return getEffectsFor("critEffectiveness", 1, state);
}

export function getCritIIGuarantee(state: State) {
  return getEffectsFor("critIIGuarantee", 0, state);
}

export function getEntropyPerSecond(state: State) {
  return getEffectsFor("entropy", 1, state);
}

export function rollCrit(state: State) {
  const roll = Math.random() * 100;
  const needed = getCritChance(state);
  if (roll < needed) {
    console.log("Crit!", "Effectiveness:", getCritEffectiveness(state), "x");
  } else return roll < needed;
}

export function calculateTime(
  cooldownFunction: () => number,
  clickTimeVariable: number,
) {
  const cooldownMs = cooldownFunction() * 1000;
  const elapsed = Date.now() - clickTimeVariable;
  const progress = Math.min(elapsed / cooldownMs, 1);
  return { cooldownMs, elapsed, progress };
}
// Synergy helpers moved to modules/synergy.js to avoid circular imports.

const SYNERGY_HIERARCHY = [
  {
    id: "U18",
    formula: (amoeba: number) =>
      1 + Math.log10(1 + amoeba ** 0.75) / Math.log10(40),
  },
  {
    id: "U7",
    formula: (amoeba: number) =>
      1 + Math.log10(1 + amoeba ** 0.6) / Math.log10(70),
  },
  {
    id: "U3",
    formula: (amoeba: number) =>
      1 + Math.log10(1 + Math.sqrt(amoeba)) / Math.log10(100),
  },
];

export function getSynergyMultiplier(state: State) {
  const amoebaCount = state.resources.amoeba || 0;

  // Scan from top to bottom; return the first matching formula found
  for (const config of SYNERGY_HIERARCHY) {
    const playerUpgrade = state.upgradeState[config.id];

    if (playerUpgrade && playerUpgrade.level >= 1) {
      return config.formula(amoebaCount);
    }
  }

  // Baseline multiplier if no synergy upgrades are owned yet
  return 1;
}

export function getU2Mult(level: number, state: State): number {
  // 1. Provide a default fallback value directly upon declaration
  let base = level ? 1.15 ** level : 1.15;

  // 2. Safely read deeply nested properties with optional chaining and a fallback
  const hasU16 = (state?.upgradeState?.["U16"]?.level ?? 0) >= 1;
  const amoebaCount = state?.resources?.amoeba ?? 0;

  if (hasU16) {
    base += Math.log10(1 + amoebaCount) / 100;
  }

  return base;
}

// adds

export const levelOf = (state: State, id: string): number => {
  return state.upgradeState[id]?.level ?? 0;
};

export const maxLevelOf = (state: State, upgrade: Upgrade): number => {
  return upgrade.maxLevel + state.upgradeState[upgrade.ID].bonusMax;
};

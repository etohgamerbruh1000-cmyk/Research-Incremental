// logic.js
// handles resource gain, upgrade buying

import { upgradeLibrary, Upgrade } from "./data.js";
import { milestones } from "./data/milestones/milestoneData.js";
import { State } from "./state.js";

export function increaseStat<T extends Record<string | number, unknown>>({
  target,
  stat,
  amount,
  operation,
}: {
  target: T;
  // This guarantees 'stat' can ONLY be a property that holds a number
  stat: { [K in keyof T]: T[K] extends number ? K : never }[keyof T];
  amount: number;
  operation: "add" | "multiply";
}): boolean {
  // 1. Structural Check
  if (!target || stat === undefined || amount === undefined || !operation) {
    console.error("Didn't find increaseStat params :(");
    return false;
  }

  // 2. Read the value safely as a number
  // This satisfies the compiler so we can do clean math
  const currentValue = (target[stat] ?? 0) as number;

  // 3. Mathematical Evaluation & Re-assignment
  if (operation === "add") {
    target[stat] = (currentValue + amount) as T[typeof stat];
  } else if (operation === "multiply") {
    target[stat] = (currentValue * amount) as T[typeof stat];
  } else {
    console.error(`Incorrect operation in increaseStat: "${operation}"`);
    return false;
  }

  return true;
}

// Recalculates stat from scratch.
// Generic function; you can repurpose it into getCritChance, getCritEffectiveness,...

// 1. Map operations to functions that calculate and return the new stat
const effectOperations: Record<
  "add" | "subtract" | "multiply",
  (stat: number, value: number) => number
> = {
  add: (stat, value) => stat + value,
  subtract: (stat, value) => stat - value,
  multiply: (stat, value) => stat * value,
};

// 2. Define the exact execution order you want (e.g., flat modifiers before multipliers)
const priorityOrder: Array<"add" | "subtract" | "multiply"> = [
  "add",
  "subtract",
  "multiply",
];

export function getEffectsFor(target: string, baseStat: number, state: State) {
  let stat = baseStat;

  // Gather all active effects across all owned upgrades first
  const activeEffects: Array<{
    type: "add" | "subtract" | "multiply";
    value: number;
  }> = [];

  Object.values(upgradeLibrary).forEach((upgrade: Upgrade) => {
    if (levelOf(state, upgrade.ID) < 1) return;

    if (upgrade.effects) {
      upgrade.effects
        .filter((e) => e.name === target)
        .forEach((e) => {
          const value = e.effectFormula(levelOf(state, upgrade.ID), state);
          if (typeof value === "number") {
            activeEffects.push({ type: e.type, value });
          }
        });
    }
  });

  // 3. Process the accumulated effects strictly matching your priority order!
  priorityOrder.forEach((currentPriority) => {
    activeEffects
      .filter((e) => e.type === currentPriority)
      .forEach((e) => {
        // Run the math function for this operation type
        stat = effectOperations[e.type](stat, e.value);
      });
  });

  return stat;
}

// ====================
// * 2. get effects for
// ====================

export function getSlamoMilestoneBoost(state: State): number {
  const m1 = milestones.M1;

  if (state.milestoneState["M1"]) {
    if (!m1 || !state.milestoneState["M1"].claimed) {
      return 1;
    }
  } else {
    state.milestoneState["M1"] = { claimed: false };
  }
  return 1 + state.resources.slamoClicks * 0.01;
}

export function getClickPower(state: State, baseClickPower: number): number {
  const clickPowerMultiplier = getEffectsFor(
    "clickPower",
    baseClickPower,
    state,
  );

  return clickPowerMultiplier * getSlamoMilestoneBoost(state);
}

export function getClickCooldown(state: State): number {
  return Math.max(
    getEffectsFor("clickCooldown", state.stats.clickCooldown, state),
    0.25,
  );
}

export function getSlamoClickCooldown(state: State) {
  return Math.max(
    getEffectsFor("slamoClickCooldown", state.stats.slamoClickCooldown, state),
    1,
  );
}

export function getSlamoClickPower(state: State) {
  return getEffectsFor("slamoClickPower", state.stats.slamoClickPower, state);
}
// The function returns clicks.
export function getSlamoBoost(clicks: number) {
  if (clicks >= 250) {
    clicks = 250;
  }
  return 1 + clicks / 100;
}

export function getCritChance(state: State): number {
  return getEffectsFor("critChance", state.stats.critChance, state);
}

export function getCritEffectiveness(state: State): number {
  return getEffectsFor(
    "critEffectiveness",
    state.stats.critEffectiveness,
    state,
  );
}

export function getCritIIGuarantee(state: State): number {
  return getEffectsFor("critIIGuarantee", state.stats.critIIGuarantee, state);
}

export function getEntropyPerSecond(state: State): number {
  return getEffectsFor(
    "kineticEnergy",
    state.stats.entropyPerSecondPower,
    state,
  );
}

export function rollCrit(state: State): boolean {
  const roll = Math.random() * 100;
  const needed = getCritChance(state);
  const isCrit = roll < needed;
  if (isCrit) {
    console.log("Crit!", "Effectiveness:", getCritEffectiveness(state), "x");
  }
  return isCrit;
}

export function calculateTime(
  cooldownSeconds: number,
  clickTimeVariable: number,
) {
  const cooldownMs = cooldownSeconds * 1000;
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

export function getSynergyMultiplier(state: State): number {
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

// adds

export const levelOf = (state: State, id: string): number => {
  return state.upgradeState[id]?.level ?? 0;
};

export const maxLevelOf = (state: State, upgrade: Upgrade): number => {
  const upg = state.upgradeState[upgrade.ID];

  if (upg) {
    return upgrade.maxLevel + upg.bonusMax;
  } else {
    return upgrade.maxLevel;
  }
};

export const isMilestoneClaimed = (
  state: State,
  id: string,
): number | boolean => {
  return state.milestoneState[id]?.claimed ?? 0;
};

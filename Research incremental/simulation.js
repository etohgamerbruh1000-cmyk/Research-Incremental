// simulation.js
// Dynamic pacing simulator — imports live from your real project files.
// Run from your project root: node simulation.js
//
// Fixes vs the previous version:
//  - amoeba-effect application now happens AFTER level increments (matches
//    logic.js's buyUpgrade ordering) — fixes U17b zeroing amoeba on purchase.
//  - automatorEffectiveness now starts from state.automatorEffectiveness (0.33)
//    as its true neutral base, not a hardcoded 1.
//  - automator income is divided by 5, matching "the automator clicks every 5s"
//    instead of contributing a full click's worth every second.
//
// NOTE: this resets state.amoeba and every upgrade's level to 0 before running
// — it simulates a fresh playthrough, not your current save.

import { slamoObj, upgrades } from "./modules/data.js";
import { state } from "./modules/state.js";
import {
  getClickPower,
  getClickCooldown,
  getSlamoBoost,
} from "./modules/logic.js";

const BASE_CRIT_CHANCE = state.critChance;
const BASE_CRIT_EFFECTIVENESS = state.critEffectiveness;
const BASE_AUTOMATOR_EFFECTIVENESS = state.automatorEffectiveness; // 0.33 — real neutral base

// Generic recompute, same shape as your real getEffectsFor.
function sumEffect(target, base) {
  let total = base;
  upgrades.forEach((upgrade) => {
    if (upgrade.level < 1) return;
    if (!upgrade.effects) return;
    upgrade.effects
      .filter((e) => e.name === target)
      .forEach((e) => {
        const value = e.effectFormula(upgrade.level);
        if (e.type === "multiply") total *= value;
        else if (e.type === "add") total += value;
        else if (e.type === "subtract") total -= value;
      });
  });
  return total;
}

function avgAmoebaPerClick(clickPower, critChance, critEffectiveness) {
  const critProb = Math.min(critChance, 100) / 100;
  return (
    clickPower * (1 - critProb) + clickPower * critEffectiveness * critProb
  );
}

// Automator ticks once every 5s — express as a per-second average rate.
function getAutomatorIncomePerSecond() {
  if (!state.unlocked.theAutomator) return 0;
  const automatorEffectiveness = sumEffect(
    "automatorEffectiveness",
    BASE_AUTOMATOR_EFFECTIVENESS,
  );
  const clickPower = getClickPower(
    state.clickPower * automatorEffectiveness,
    getSlamoBoost(slamoObj.slamoClicks),
  );
  return clickPower / 5;
}

// Applies any "amoeba"-targeted effects on an upgrade, AFTER its level has
// already been incremented — matches buyUpgrade's real ordering.
function applyAmoebaEffects(upgrade) {
  if (!upgrade.effects) return;
  upgrade.effects
    .filter((e) => e.name === "amoeba")
    .forEach((e) => {
      const value = e.effectFormula(upgrade.level);
      if (e.type === "multiply") state.amoeba *= value;
      else if (e.type === "add") state.amoeba += value;
      else if (e.type === "subtract") state.amoeba -= value;
    });
}

function simulate() {
  state.amoeba = 0;
  upgrades.forEach((u) => (u.level = 0));

  let time = 0;
  let slamoClicks = 0;

  while (upgrades.some((u) => u.level < u.maxLevel)) {
    const clickPowerBefore =
      (state.clickPower, getSlamoBoost(slamoObj.slamoClicks));
    const clickPower = getClickPower(
      state.clickPower,
      getSlamoBoost(slamoObj.slamoClicks),
    );
    const clickCooldown = getClickCooldown();
    const critChance = sumEffect("critChance", BASE_CRIT_CHANCE);
    const critEffectiveness = sumEffect(
      "critEffectiveness",
      BASE_CRIT_EFFECTIVENESS,
    );

    const perClick = avgAmoebaPerClick(
      clickPower,
      critChance,
      critEffectiveness,
    );
    const perSecond =
      (clickCooldown > 0 ? perClick / clickCooldown : 0) +
      getAutomatorIncomePerSecond();

    let best = null;
    for (const u of upgrades) {
      if (u.level >= u.maxLevel) continue;
      const cost = u.costFormula(u.level + 1);
      if (!best || cost < best.cost) best = { u, cost };
    }

    const needed = Math.max(0, best.cost - state.amoeba);
    const timeToAfford = perSecond > 0 ? needed / perSecond : Infinity;

    if (!isFinite(timeToAfford)) {
      console.log(
        `STALLED trying to buy ${best.u.ID} — income hit 0. Total time so far: ${(time / 60).toFixed(1)} min`,
      );
      console.log({
        clickPower,
        clickCooldown,
        critChance,
        critEffectiveness,
        perSecond,
      });
      return;
    }

    time += timeToAfford;

    if (state.unlocked.slamo) {
      const slamoProdPerSecond = sumEffect("slamoProduction", 0);
      slamoClicks += slamoProdPerSecond * timeToAfford;
    }

    state.amoeba = Math.max(0, state.amoeba - best.cost);
    best.u.level += 1; // level incremented FIRST now
    applyAmoebaEffects(best.u); // then amoeba effects use the correct new level

    if (best.u.unlock) {
      state.unlocked[best.u.unlock] = true;
    }

    const clickPowerAfter = getClickPower(
      state.clickPower,
      getSlamoBoost(slamoObj.slamoClicks),
    );
    const ratio = clickPowerBefore > 0 ? clickPowerAfter / clickPowerBefore : 0;

    console.log(
      `Bought ${best.u.ID} (lvl ${best.u.level}) — cost ${Math.round(best.cost)}, ` +
        `took ${timeToAfford.toFixed(1)}s, total ${(time / 60).toFixed(2)} min,
        Ratio: ${clickPowerBefore.toFixed(2)} -> ${clickPowerAfter.toFixed(2)} (x${ratio.toFixed(2)})`,
    );
  }

  console.log("\n--- Final stats ---");
  console.log(`Total time: ${(time / 60).toFixed(2)} minutes`);
  console.log(
    `Click power: ${getClickPower(state.clickPower, getSlamoBoost(slamoObj.slamoClicks)).toFixed(2)}`,
  );
  console.log(
    `Crit chance: ${sumEffect("critChance", BASE_CRIT_CHANCE).toFixed(1)}%`,
  );
  console.log(
    `Crit effectiveness: ${sumEffect("critEffectiveness", BASE_CRIT_EFFECTIVENESS).toFixed(2)}x`,
  );
  console.log(`Click cooldown: ${getClickCooldown().toFixed(3)}s`);
}

simulate();

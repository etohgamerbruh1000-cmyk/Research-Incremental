// upgradeSystem.js
// Upgrade rules extracted out of logic.js so the file can shrink safely.

import { state } from "./state.js";
import { upgradeLibrary } from "./data.js";

export function increaseStat(target, stat, amount, add) {
  if (add === true) {
    target[stat] += amount;
  } else {
    target[stat] *= amount;
  }
}

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

  const targetUpgrade = next.upgradeState.find((upg) => upg.ID === upgrade.ID);
  if (targetUpgrade) {
    targetUpgrade.level += 1;
  }
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

export function calculateUpgradeEffect(next, upgrade) {
  if (!upgrade.effects) return;

  upgrade.effects.forEach((e) => {
    const currentLvl =
      next.upgradeState.find((u) => u.ID === upgrade.ID)?.level ??
      upgrade.level;
    const value = e.effectFormula(currentLvl);
    const statName = e.name;

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
    return next;
  }

  return next;
}

//ex. {type: buyUpgrade, ID: "U17a"}
export function reducer(state, action) {
  const next = structuredClone(state);
  switch (action.type) {
    case "gameTick": {
      return next;
    }

    case "increaseStat": {
      // ex. reducer(next, {target: next.resources,
      // stat: amoeba,...})
      const destructured = next[action.target];
      increaseStat(...action, destructured);
      const dynamicMilestones = milestones.filter(
        (milestone) => milestone.type === "dynamic",
      );

      for (let i = 0; i < dynamicMilestones.length; i++) {
        if (dynamicMilestones[i].claimed) {
          const nextState = calculateDynamicMilestoneEffect(
            dynamicMilestones[i],
          );
          if (nextState) {
            Object.assign(next, nextState);
          }
        }
      }
      return next;
    }
    case "buyUpgrade": {
      const upgradeID = action.ID;
      const upg = upgradeLibrary.find((u) => u.ID === upgradeID);
      buyUpgrade(next, upg);
      return next;
    }
    case "claimMilestone": {
      const milestoneID = 10;

      return next;
    }
    case "cellsReset": {
      return next;
    }

    default:
      console.warn("Invalid prompt:", action);
  }
}

export function dispatch(action) {
  state = reducer(state, action);
  replaceState(next);
}

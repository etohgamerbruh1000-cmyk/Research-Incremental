// logic.js
// Thin barrel that keeps the old import surface stable while the logic lives in focused modules.

export {
  increaseStat,
  canBuyPurchase,
  purchaseUpgrade,
  evaluateConditionalUnlocks,
  calculateUpgradeEffect,
  buyUpgrade,
} from "./upgradeSystem.js";

export {
  getEffectsFor,
  getSlamoMilestoneBoost,
  getClickPower,
  getClickCooldown,
  getSlamoClickCooldown,
  getSlamoClickPower,
  getSlamoBoost,
  getCritChance,
  getCritEffectiveness,
  getCritIIGuarantee,
  getEntropyPerSecond,
  rollCrit,
} from "./formulas.js";

export {
  checkMilestoneClaim,
  applyMilestoneEffect,
  calculateDynamicMilestoneEffect,
} from "./milestones.js";

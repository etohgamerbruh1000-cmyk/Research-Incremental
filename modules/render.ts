// render.js
// Handles rendering the HTML
// This is not the source of truth.

import {
  calculateTime,
  getClickCooldown,
  getClickPower,
  getCritChance,
  getCritEffectiveness,
  getCritIIGuarantee,
  getEntropyPerSecond,
  getSlamoClickCooldown,
  getSlamoClickPower,
  levelOf,
} from "./calculations.js";

import { upgradeLibrary } from "./data.js";
import {
  calculateEntropyToAmoebaBoost,
  checkREUnlocks,
  getRNABurst,
} from "./cells.js";
import { dispatch } from "./reducer.js";
import { State, Upgrade } from "./imports.js";

// ===================
// * 1. Stat rendering
// ===================

export const doc = <T extends HTMLElement = HTMLElement>(id: string): T => {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" not found.`);
  }
  return element as T;
};

// Main function
export function render(state: State, upgrade: Upgrade): Boolean {
  renderStats(state);
  if (!upgrade) {
    console.error("No upgrade found");
    return false;
  }
  // TODo: Fix now :DDD
  upgradeLibrary.forEach(renderUpgrade(state, upgrade));
  return true;
}

export function renderStats(state: State) {
  renderAmoebaStats(state);
  renderCooldowns(state);
  renderCrits(state);
  renderCellsStats(state);
}

export function renderAmoebaStats(state) {
  const amoebaText = document.getElementById("amoebaText");
  const slamoText = document.getElementById("slamoText");
  amoebaText.textContent = `Amoeba: ${state.resources.amoeba} Click power: ${getClickPower(state, state.stats.clickPower).toFixed(3)}`;
  slamoText.textContent = `Slamo clicks: ${state.resources.slamoClicks}, slamo click power:
${getSlamoClickPower()}`;
}

export function renderCooldowns(state) {
  const clickCooldownText = document.getElementById("clickCooldownText");

  clickCooldownText.textContent = `Click cooldown: ${getClickCooldown(state).toFixed(3)}s, Slamo click cooldown: 
${getSlamoClickCooldown(state).toFixed(3)}s`;
}

export function renderCrits(state) {
  const critText = document.getElementById("critText");
  critText.textContent = `Crit chance: ${getCritChance(state)}% chance, 
  Crit effectiveness: ${getCritEffectiveness(state)}x,
  Crit II Guarantee: ${getCritIIGuarantee(state)}`;
}

export function renderCellsStats(state) {
  const cellResetBtn = document.getElementById("cellResetBtn");
  const RNAText = document.getElementById("RNAText");
  const entropyText = document.getElementById("entropyText");
  const entropyBoostText = document.getElementById("entropyBoostText");

  const u20 = upgradeLibrary.find((u) => u.ID === "U20");
  if (u20.level >= 1) {
    cellResetBtn.textContent = `Reset everything, in exchange for \n
${getRNABurst()} RNA. Additionally, unlocks ${checkREUnlocks()}`;
  }

  RNAText.textContent = `RNA: ${state.resources.RNA.toFixed(5)} RNA power: ${state.stats.RNAPower}`;
  entropyText.textContent = `Entropy: ${state.resources.entropy} Entropy per second: ${getEntropyPerSecond()}/s`;
  entropyBoostText.textContent = `Entropy boost: ${calculateEntropyToAmoebaBoost()}x amoeba!`;
}

export function renderProgressBar(state) {
  const progress = Math.min(state.resources.amoeba / 250000, 1);

  document.getElementById("amoebaProgress").style.width = `${progress * 100}%`;

  document.getElementById("progressText").textContent =
    `${state.resources.amoeba.toLocaleString()} / 250,000 Amoeba`;
}

export function renderClasses(state) {
  const u20 = upgradeLibrary.U20;
  const u10 = upgradeLibrary.U10;
  // the function renders a class conditionally
  document.getElementById("slamo").classList.toggle("hide", u10.level < 1);

  document.getElementById("milestones").classList.toggle("hide", u10.level < 1);

  document
    .getElementById("cellResetBtn")
    .classList.toggle("hide", levelOf(state, u20.id) < 1);
}

// renders the text in <button> elements
export function renderButtonText(upgrade, state) {
  // TODO: Fix costs not increasing after repeatable buy
  let effectLines = [];

  if (upgrade.effects) {
    effectLines = upgrade.effects.map(
      (e) => `${e.name}: ${e.effectFormula(levelOf(state, upgrade.ID) + 1)}`,
    );
  }
  if (upgrade.effectFormula) {
    effectLines = [
      `${upgrade.currencyEffect}: ${upgrade.effectFormula(upgrade.level + 1)}`,
    ];
  }
  if (upgrade.unlock) {
    effectLines = [`unlocks: ${upgrade.unlock}`];
  }

  return `Effect: ${effectLines.join("\n")},\nLevel: ${levelOf(state, upgrade.ID)}/${upgrade.maxLevel}`;
}

export function createUpgradeDetails(upgrade: Upgrade, cost) {
  const summary = document.createElement("div");
  summary.className = "summary";
  summary.textContent = `${editUpgradeDetails(upgrade, cost)}`;

  const details = document.createElement("div");
  details.className = "details";
  details.id = `details-${upgrade.ID}`;
  details.textContent = renderButtonText(upgrade);

  return { summary, details };
}

export function editUpgradeDetails(upgrade, cost) {
  if (upgrade === null || cost === null) {
    console.log("No upgrade of cost @ editUpgradeDetails");
    return false;
  }
  return `${upgrade.name} (${upgrade.ID}), Cost: ${cost.toFixed(3)}`;
}

export function appendDNAUpgradeCards(upgrade, card) {
  if (upgrade.ID.includes("AGG")) {
    const aggressivenessUpgradeButton = document.getElementById(
      "aggressivenessUpgradeButton",
    );
    aggressivenessUpgradeButton.appendChild(card);
  } else if (upgrade.ID.includes("ACTIVE")) {
    const activeUpgradeButton = document.getElementById("activeUpgradeButton");
    activeUpgradeButton.appendChild(card);
  } else if (upgrade.ID.includes("IDLE")) {
    const idleUpgradeButton = document.getElementById("idleUpgradeButton");
    idleUpgradeButton.appendChild(card);
  }
}

export function checkUpgradeClasses(upgrade, card) {
  if (upgrade.unlock) {
    card.classList.add("unlock");
  }
  if (upgrade.optional) {
    card.classList.add("optional");
  }
}

// =============
// * 2. Upgrades
// =============

const upgParamExceptions = {
  U20: "state",
};
// Takes in an upgrade object from upgradeLibrary
export function renderUpgrade(state, upgrade) {
  const card = document.createElement("div");
  const isDNAUpgrade = upgrade.ID.includes("DNA");
  card.className = "upgrade-card";
  card.id = `card-${upgrade.ID}`;

  const upgradeList = document.getElementById("upgradeList");

  // 1. Get the actual rule for this specific upgrade ("state", "both", or undefined)
  const rule = upgParamExceptions[upgrade.ID];

  // 2. Resolve the target values safely
  const nextLevel = (state.upgradeState[upgrade.ID]?.level || 0) + 1;

  let cost;
  if (rule === "state") {
    cost = upgrade.costFormula(state);
  } else if (rule === "both") {
    cost = upgrade.costFormula(nextLevel, state);
  } else {
    // Safe default fallback for 95% of your upgrades
    cost = upgrade.costFormula(nextLevel);
  }

  checkUpgradeClasses(upgrade, card);

  const { summary, details } = createUpgradeDetails(upgrade, cost);

  card.append(summary, details);
  card.addEventListener("click", () =>
    dispatch({ type: "buyUpgrade", ID: upgrade.id }),
  );
  if (!isDNAUpgrade) {
    upgradeList.appendChild(card);
  } else {
    appendDNAUpgradeCards(upgrade, card);
  }

  if (upgrade.ID.startsWith("RE")) {
    card.classList.add("hide");
  }
}

export function updateUpgradeDisplay(upgrade, state) {
  const details = document.getElementById(`details-${upgrade.ID}`);
  const card = document.getElementById(`card-${upgrade.ID}`);
  if (details) {
    details.textContent = renderButtonText(upgrade);
  }
  if (card) {
    const summary = card.querySelector(".summary");
    if (summary) {
      const nextCost = upgrade.costFormula(
        upgrade.levelOf(state, upgrade.ID) + 1,
      );
      summary.textContent = editUpgradeDetails(upgrade, nextCost);
    }
  }
}

// ===============
// * 3. Milestones
// ===============

const milestoneList = document.getElementById("milestones");
export const renderMilestone = (milestone) => {
  if (!milestone) {
    console.warn("No milestone supplied @ renderMilestone");
    return;
  }
  const htmlMilestone = document.createElement("li");
  htmlMilestone.id = `milestone-${milestone.ID}`;

  renderMilestoneText(htmlMilestone, milestone);
  milestoneList.appendChild(htmlMilestone);
};

export function renderMilestoneText(text, foundMilestone) {
  const noEmoji = "\u{274C}";
  const yesEmoji = "\u{2705}";

  if (foundMilestone.claimed) {
    text.textContent = `required: ${foundMilestone.needed}, description: ${foundMilestone.description}, found: ${yesEmoji}`;
  } else {
    text.textContent = `description: ${foundMilestone.description}, found: ${noEmoji}`;
  }
}

// ==============
// * 4. Slamo DNA
// ==============

export function renderDNAMachine() {
  // p elements
  const aggressiveness = document.getElementById("aggressiveness");
  const active = document.getElementById("active");
  const idle = document.getElementById("idle");
  // upgrades
  // TODO: account for level, and cost formula
  const DNAAgg = upgradeLibrary.find((u) => u.ID === "DNA_AGG");
  const DNAActive = upgradeLibrary.find((u) => u.ID === "DNA_ACTIVE");
  const DNAIdle = upgradeLibrary.find((u) => u.ID === "DNA_IDLE");

  aggressiveness.textContent = `+1 power - costs ${DNAAgg.costFormula(DNAAgg.level + 1)} entropy.`;
  active.textContent = `+1 power - costs ${DNAActive.costFormula(DNAActive.level + 1)} entropy.`;
  idle.textContent = `+1 power - costs ${DNAIdle.costFormula(DNAIdle.level + 1)} entropy.`;
}
function renderUpgradeCounter(element, level, symbol) {
  element.textContent = symbol.repeat(level);
}
export function renderDNAUpgradeCounter() {
  const aggressivenessUpgradesCounter = document.getElementById(
    "aggressivenessUpgradesCounter",
  );
  const activeUpgradesCounter = document.getElementById(
    "activeUpgradesCounter",
  );
  const idleUpgradesCounter = document.getElementById("idleUpgradesCounter");
  // upgrades
  const DNAAgg = upgradeLibrary.find((u) => u.ID === "DNA_AGG");
  const DNAActive = upgradeLibrary.find((u) => u.ID === "DNA_ACTIVE");
  const DNAIdle = upgradeLibrary.find((u) => u.ID === "DNA_IDLE");

  renderUpgradeCounter(aggressivenessUpgradesCounter, DNAAgg.level, "🟥");
  renderUpgradeCounter(activeUpgradesCounter, DNAActive.level, "🟩");
  renderUpgradeCounter(idleUpgradesCounter, DNAIdle.level, "🟧");
}

// ===========
// * 5. Other
// ===========

// dynamically updates button brightness based on cooldown.
export function updateButtonBrightness(
  element,
  cooldownFunction,
  clickTimeVariable,
) {
  const calculatedTime = calculateTime(cooldownFunction, clickTimeVariable);
  const brightness = 0.5 + calculatedTime.progress * 0.5;
  element.style.filter = `brightness(${brightness})`;
}

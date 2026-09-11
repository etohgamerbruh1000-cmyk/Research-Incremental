// render.js
// Handles rendering the HTML
// This is not the source of truth.

import {
  buyUpgrade,
  getClickCooldown,
  getClickPower,
  getCritChance,
  getCritEffectiveness,
  getCritIIGuarantee,
  getEntropyPerSecond,
  getSlamoClickCooldown,
  getSlamoClickPower,
} from "./logic.js";
import { state } from "./state.js";
import { milestones, slamoData, upgradeLibrary } from "./data.js";
import {
  calculateEntropyToAmoebaBoost,
  checkREUnlocks,
  getRNABurst,
} from "./cells.js";

// ===================
// * 1. Stat rendering
// ===================

export function renderStats() {
  renderAmoebaStats();
  renderCooldowns();
  renderCrits();
  renderCellsStats();
}

export function renderAmoebaStats() {
  const amoebaText = document.getElementById("amoebaText");
  const slamoText = document.getElementById("slamoText");
  amoebaText.textContent = `Amoeba: ${state.resources.amoeba} Click power: ${getClickPower(state.stats.clickPower).toFixed(3)}`;
  slamoText.textContent = `Slamo clicks: ${slamoData.slamoClicks}, slamo click power:
${getSlamoClickPower()}`;
}

export function renderCooldowns() {
  const clickCooldownText = document.getElementById("clickCooldownText");

  clickCooldownText.textContent = `Click cooldown: ${getClickCooldown().toFixed(3)}s, Slamo click cooldown: 
${getSlamoClickCooldown().toFixed(3)}s`;
}

export function renderCrits() {
  const critText = document.getElementById("critText");
  critText.textContent = `Crit chance: ${getCritChance()}% chance, 
  Crit effectiveness: ${getCritEffectiveness()}x,
  Crit II Guarantee: ${getCritIIGuarantee()}`;
}

export function renderCellsStats() {
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

export function renderProgressBar() {
  const progress = Math.min(state.resources.amoeba / 250000, 1);

  document.getElementById("amoebaProgress").style.width = `${progress * 100}%`;

  document.getElementById("progressText").textContent =
    `${state.resources.amoeba.toLocaleString()} / 250,000 Amoeba`;
}

export function renderClasses() {
  const u20 = upgradeLibrary.find((upg) => upg.ID === "U20");
  const u10 = upgradeLibrary.find((upg) => upg.ID === "U10");
  // the function renders a class conditionally
  document.getElementById("slamo").classList.toggle("hide", !u10.level >= 1);

  document
    .getElementById("milestones")
    .classList.toggle("hide", !u10.level >= 1);

  document
    .getElementById("cellResetBtn")
    .classList.toggle("hide", !u20.level >= 1);
}

// renders the text in <button> elements
export function renderButtonText(upgrade) {
  // TODO: Fix costs not increasing after repeatable buy
  let effectLines = [];

  if (upgrade.effects) {
    effectLines = upgrade.effects.map(
      (e) => `${e.name}: ${e.effectFormula(upgrade.level + 1)}`,
    );
  } else if (upgrade.effectFormula) {
    effectLines = [
      `${upgrade.currencyEffect}: ${upgrade.effectFormula(upgrade.level + 1)}`,
    ];
  } else if (upgrade.unlock) {
    effectLines = [`unlocks: ${upgrade.unlock}`];
  }

  return `Effect: ${effectLines.join("\n")},\nLevel: ${upgrade.level}/${upgrade.maxLevel}`;
}

export function updateCostVariable(upgrade) {
  const cost = upgrade.costFormula(upgrade.level + 1);
  return cost;
}

export function createUpgradeDetails(upgrade, cost) {
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
  return `${upgrade.name} (${upgrade.ID}), Cost: ${cost.toFixed(3)}`;
}

// TODO: Fix the upgrades not appending child.
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

// * Main
export function renderUpgrade(upgrade) {
  const next = structuredClone(state);
  const card = document.createElement("div");
  const isDNAUpgrade = upgrade.ID.includes("DNA");
  card.className = "upgrade-card";
  card.id = `card-${upgrade.ID}`;

  const upgradeList = document.getElementById("upgradeList");
  const cost = updateCostVariable(upgrade);
  checkUpgradeClasses(upgrade, card);

  const summary = createUpgradeDetails(upgrade, cost).summary;
  const details = createUpgradeDetails(upgrade, cost).details;

  card.append(summary, details);
  card.addEventListener("click", () => buyUpgrade(next, upgrade));
  if (!isDNAUpgrade) {
    upgradeList.appendChild(card);
  }

  if (isDNAUpgrade) {
    appendDNAUpgradeCards(upgrade, card);
  }

  if (upgrade.ID.startsWith("RE")) {
    card.classList.add("hide");
  }
}

export function updateUpgradeDisplay(upgrade) {
  const details = document.getElementById(`details-${upgrade.ID}`);
  if (details) {
    details.textContent = renderButtonText(upgrade);
  }
}

const milestoneList = document.getElementById("milestones");
export const renderMilestone = (ID) => {
  // * this renders one milestone

  let htmlMilestone = document.createElement("li");
  htmlMilestone.id = "milestone-" + ID;

  let foundMilestone = milestones.find((entry) => entry.ID === ID);

  renderMilestoneText(htmlMilestone, foundMilestone);
  milestoneList.appendChild(htmlMilestone);
  document.body.appendChild(milestoneList);
  console.log("rendered milestone:", htmlMilestone, foundMilestone);
};

export function renderMilestoneText(text, foundMilestone) {
  const noEmoji = "\u{274C}";
  const yesEmoji = "\u{2705}";

  if (foundMilestone.claimed) {
    text.textContent = `required: ${foundMilestone.needed}, description: ${foundMilestone.description}, found: ${yesEmoji}`;
  } else {
    text.textContent = `required: ${foundMilestone.needed}, description: ${foundMilestone.description}, found: ${noEmoji}`;
  }
}

// dynamically updates button brightness based on cooldown.
export function updateButtonBrightness(
  element,
  cooldownFunction,
  clickTimeVariable,
) {
  let calculatedTime;
  calculatedTime = calculateTime(cooldownFunction, clickTimeVariable);

  const brightness = 0.5 + calculatedTime.progress * 0.5;
  element.style.filter = `brightness(${brightness})`;
  requestAnimationFrame(() =>
    updateButtonBrightness(element, cooldownFunction, clickTimeVariable),
  );
}

export function calculateTime(cooldownFunction, clickTimeVariable) {
  let cooldownMs;
  let elapsed;
  let progress;

  cooldownMs = cooldownFunction() * 1000;

  elapsed = Date.now() - clickTimeVariable;
  progress = Math.min(elapsed / cooldownMs, 1);
  return { cooldownMs, elapsed, progress };
}

// TODO: Create slamo DNA Rendering

// ==============
// * 1. Slamo DNA
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

  aggressivenessUpgradesCounter.textContent = "";
  for (let i = 0; i < DNAAgg.level; i++) {
    aggressivenessUpgradesCounter.textContent += "\u{1F7E5}";
  }
  activeUpgradesCounter.textContent = "";
  for (let i = 0; i < DNAActive.level; i++) {
    activeUpgradesCounter.textContent += "\u{1F7E9}";
  }
  idleUpgradesCounter.textContent = "";
  for (let i = 0; i < DNAIdle.level; i++) {
    idleUpgradesCounter.textContent += "\u{1F7EB}";
  }
}

export function unhideElement(element) {
  //*  takes in one element like a div or a button.
  element.classList.remove("hide");
  console.log("Unhid element:", element);
}

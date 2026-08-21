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
  getSynergyMultiplier,
} from "./logic.js";
import { state } from "./state.js";
import { filteredMilestones, slamoData, upgrades } from "./data.js";
import { lastClickTime } from "../app.js";
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
  amoebaText.textContent = `Amoeba: ${state.amoeba} Click power: ${getClickPower(1, state.M1Boost).toFixed(3)}`;
  slamoText.textContent = `Slamo clicks: ${slamoData.find((entry) => entry.ID === "slamo").slamoClicks}, slamo click power:
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
  const u20 = upgrades.find((u) => u.ID === "U20");

  if (u20.level >= 1) {
    cellResetBtn.textContent = `Reset everything, in exchange for \n
${getRNABurst()} RNA. Additionally, unlocks ${checkREUnlocks()}`;
  }

  RNAText.textContent = `RNA: ${state.RNA.toFixed(5)} RNA power: ${state.RNAPower}`;
  entropyText.textContent = `Entropy: ${state.entropy} Entropy per second: ${getEntropyPerSecond()}/s`;
  entropyBoostText.textContent = `Entropy boost: ${calculateEntropyToAmoebaBoost()}x amoeba!`;
}

export function renderProgressBar() {
  const progress = Math.min(state.amoeba / 250000, 1);

  document.getElementById("amoebaProgress").style.width = `${progress * 100}%`;

  document.getElementById("progressText").textContent =
    `${state.amoeba.toLocaleString()} / 250,000 Amoeba`;
}

export function renderClasses() {
  const u20 = upgrades.find((upg) => upg.ID === "U20");
  const u10 = upgrades.find((upg) => upg.ID === "U10");
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
  const cost = upgrade.costFormula(upgrade.level + 1);
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

// * Creates a <div> element

export function renderUpgrade(upgrade) {
  // TODO: ADD THE BUY BUTTON AND PUT IT IN SLAMO DNA. LOGIC WORKS, JUSTB PUT IT SMWHERE ELSE
  const card = document.createElement("div");

  card.className = "upgrade-card";
  card.id = `card-${upgrade.ID}`;

  const fixedCost = upgrade.costFormula(upgrade.level + 1);

  if (upgrade.unlock) {
    card.classList.add("unlock");
  }
  if (upgrade.optional) {
    card.classList.add("optional");
  }

  const summary = document.createElement("div");
  summary.className = "summary";
  summary.textContent = `${upgrade.name} (${upgrade.ID}), Cost: ${fixedCost.toFixed(3)}`;

  const details = document.createElement("div");
  details.className = "details";
  details.id = `details-${upgrade.ID}`;
  details.textContent = renderButtonText(upgrade); // your existing effects/cost text

  card.append(summary, details);
  card.addEventListener("click", () => buyUpgrade(upgrade));

  document.getElementById("upgradeList").appendChild(card);
  if (upgrade.ID.startsWith("RE")) {
    card.classList.add("hide");
    console.log("HIDDEN:", upgrade.ID);
  }
}

export function updateUpgradeDisplay(upgrade) {
  const details = document.getElementById(`details-${upgrade.ID}`);
  if (details) {
    details.textContent = renderButtonText(upgrade);
  }
}

// TODO: do this bruh :(
let milestoneList = document.createElement("ul");
milestoneList.id = "milestones";
export const renderMilestone = (ID) => {
  // * this renders one milestone

  let htmlMilestone = document.createElement("li");
  htmlMilestone.id = "milestone-" + ID;
  // example: milestone-M2
  let foundMilestone = slamoData.find((entry) => entry.ID === ID);

  renderSlamoText(htmlMilestone, foundMilestone, slamoData.slamoClicks);
  milestoneList.appendChild(htmlMilestone);
  document.body.appendChild(milestoneList);
};

export function renderSlamoText(text, foundMilestone, clicks) {
  const noEmoji = "\u{274C}";
  const yesEmoji = "\u{2705}";

  if (!foundMilestone.claimed) {
    text.textContent = `required: ${foundMilestone.clicks}, description: ${foundMilestone.description}, found: ${noEmoji}`;
  } else {
    text.textContent = `required: ${foundMilestone.clicks}, description: ${foundMilestone.description}, found: ${yesEmoji}`;
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

export function renderSlamoDNA() {}
export function renderDNAMachine() {
  // p elements
  const aggressiveness = document.getElementById("aggressiveness");
  const active = document.getElementById("active");
  const idle = document.getElementById("idle");
  // upgrades
  // TODO: account for level, and cost formula
  const DNAAgg = upgrades.find((u) => u.ID === "DNA_AGG");
  const DNAActive = upgrades.find((u) => u.ID === "DNA_ACTIVE");
  const DNAIdle = upgrades.find((u) => u.ID === "DNA_IDLE");

  aggressiveness.textContent = `+1 power - costs ${DNAAgg.cost} entropy.`;
  active.textContent = `+1 power - costs ${DNAActive.cost} entropy.`;
  idle.textContent = `+1 power - costs ${DNAIdle.cost} entropy.`;
}

export function renderSlamoUpgradeCounter() {
  const aggressivenessUpgradesCounter = document.getElementById(
    "aggressivenessUpgradesCounter",
  );
  const activeUpgradesCounter = document.getElementById(
    "activeUpgradesCounter",
  );
  const idleUpgradesCounter = document.getElementById("idleUpgradesCounter");
  // upgrades
  const DNAAgg = upgrades.find((u) => u.ID === "DNA_AGG");
  const DNAActive = upgrades.find((u) => u.ID === "DNA_ACTIVE");
  const DNAIdle = upgrades.find((u) => u.ID === "DNA_IDLE");

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

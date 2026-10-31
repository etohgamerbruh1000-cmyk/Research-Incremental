// render.js
// Handles rendering the HTML based on game state
// Global state serves as the source of truth.

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
  reThresholds,
} from "./cells.js";
import { dispatch } from "./reducer.js";
import {
  entropyMilestones,
  isMilestoneClaimed,
  MilestoneBlueprint,
  State,
  Upgrade,
} from "./imports.js";

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

//* Main function
export function render(state: State, upgrade: Upgrade): Boolean {
  renderStats(state);

  return true;
}
export function renderAllUpgrades(state: State, upgrade: Upgrade) {
  Object.values(upgradeLibrary).forEach((upgrade) => {
    renderUpgrade(state, upgrade);
  });
}
export function renderStats(state: State) {
  renderAmoebaStats(state);
  renderCooldowns(state);
  renderCrits(state);
  renderCellsStats(state);
}

export function renderAmoebaStats(state: State) {
  const amoebaText = doc("amoebaText");
  const slamoText = doc("slamoText");
  amoebaText.textContent = `Amoeba: ${state.resources.amoeba} Click power: ${getClickPower(state, state.stats.clickPower).toFixed(3)}`;
  slamoText.textContent = `Slamo clicks: ${state.resources.slamoClicks}, slamo click power:
${getSlamoClickPower(state)}`;
}

export function renderCooldowns(state: State) {
  const clickCooldownText = doc("clickCooldownText");

  clickCooldownText.textContent = `Click cooldown: ${getClickCooldown(state).toFixed(3)}s, Slamo click cooldown: 
${getSlamoClickCooldown(state).toFixed(3)}s`;
}

export function renderCrits(state: State) {
  const critText = doc("critText");
  critText.textContent = `Crit chance: ${getCritChance(state)}% chance, 
  Crit effectiveness: ${getCritEffectiveness(state)}x,
  Crit II Guarantee: ${getCritIIGuarantee(state)}`;
}

export function renderCellsStats(state: State) {
  const cellResetBtn = doc("cellResetBtn");
  const RNAText = doc("RNAText");
  const entropyText = doc("entropyText");
  const entropyBoostText = doc("entropyBoostText");

  const u20 = upgradeLibrary.U20;
  if (levelOf(state, u20.ID) >= 1) {
    cellResetBtn.textContent = `Reset everything, in exchange for \n
${getRNABurst(state)} RNA. Additionally, unlocks ${checkREUnlocks(state, reThresholds)}`;
  }

  RNAText.textContent = `RNA: ${state.resources.RNA.toFixed(5)} RNA power: ${state.stats.RNAPower}`;
  entropyText.textContent = `Entropy: ${state.resources.entropy} Entropy per second: ${getEntropyPerSecond(state)}/s`;
  entropyBoostText.textContent = `Entropy boost: ${calculateEntropyToAmoebaBoost(state, entropyMilestones)}x amoeba!`;
}

export function renderProgressBar(state: State) {
  const progress = Math.min(state.resources.amoeba / 250000, 1);

  doc("amoebaProgress").style.width = `${progress * 100}%`;

  doc("progressText").textContent =
    `${state.resources.amoeba.toLocaleString()} / 250,000 Amoeba`;
}

export function renderClasses(state: State) {
  const u20 = upgradeLibrary.U20;
  const u10 = upgradeLibrary.U10;
  // the function renders a class conditionally
  doc("slamo").classList.toggle("hide", levelOf(state, u10.ID) < 1);
  doc("milestones").classList.toggle("hide", levelOf(state, u10.ID) < 1);

  doc("cellResetBtn").classList.toggle("hide", levelOf(state, u20.ID) < 1);
}

// renders the text in <button> elements
export function renderButtonText(upgrade: Upgrade, state: State) {
  // TODO: Fix costs not increasing after repeatable buy
  let effectLines: Array<string> = [];

  if (upgrade.effects) {
    effectLines = upgrade.effects.map(
      (e) => `${e.name}: ${e.effectFormula(levelOf(state, upgrade.ID) + 1)}`,
    );
  }
  const doesUpgHaveEffectFormula = upgrade.effects.some((e) => e.effectFormula);

  if (doesUpgHaveEffectFormula) {
    effectLines = [
      `${upgrade.effects[0].name}: ${upgrade.effects[0].effectFormula(levelOf(state, upgrade.ID) + 1)}`,
    ];
  }
  if (upgrade.unlock) {
    effectLines = [`unlocks: ${upgrade.unlock}`];
  }

  return `Effect: ${effectLines.join("\n")},\nLevel: ${levelOf(state, upgrade.ID)}/${upgrade.maxLevel}`;
}

export function createUpgradeDetails(
  state: State,
  upgrade: Upgrade,
  cost: number,
) {
  const summary = document.createElement("div");
  summary.className = "summary";
  summary.textContent = `${editUpgradeDetails(upgrade, cost)}`;

  const details = document.createElement("div");
  details.className = "details";
  details.id = `details-${upgrade.ID}`;
  details.textContent = renderButtonText(upgrade, state);

  return { summary, details };
}

export function editUpgradeDetails(upgrade: Upgrade, cost: number) {
  if (upgrade === null || cost === null) {
    console.log("No upgrade of cost @ editUpgradeDetails");
    return "Upgrade text unavailable";
  }
  return `${upgrade.name} (${upgrade.ID}), Cost: ${cost.toFixed(3)}`;
}

export function appendDNAUpgradeCards(upgrade: Upgrade, card: HTMLDivElement) {
  if (upgrade.ID.includes("AGG")) {
    const aggressivenessUpgradeButton = doc("aggressivenessUpgradeButton");
    if (aggressivenessUpgradeButton) {
      aggressivenessUpgradeButton.appendChild(card);
    }
  } else if (upgrade.ID.includes("ACTIVE")) {
    const activeUpgradeButton = doc("activeUpgradeButton");
    if (activeUpgradeButton) {
      activeUpgradeButton.appendChild(card);
    } else if (upgrade.ID.includes("IDLE")) {
    }
    const idleUpgradeButton = doc("idleUpgradeButton");
    if (idleUpgradeButton) {
      idleUpgradeButton.appendChild(card);
    }
  }
}

export function checkUpgradeClasses(upgrade: Upgrade, card: HTMLDivElement) {
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

// Takes in an upgrade object from upgradeLibrary
export function renderUpgrade(state: State, upgrade: Upgrade) {
  const card = document.createElement("div");
  const isDNAUpgrade = upgrade.ID.includes("DNA");
  card.className = "upgrade-card";
  card.id = `card-${upgrade.ID}`;

  const upgradeList = doc("upgradeList");

  // 2. Resolve the target values safely
  const nextLevel = (state.upgradeState[upgrade.ID]?.level || 0) + 1;

  //* TS does not care about if extra params are passed :DDDD
  const cost = upgrade.costFormula(nextLevel, state);

  checkUpgradeClasses(upgrade, card);

  const { summary, details } = createUpgradeDetails(state, upgrade, cost);

  card.append(summary, details);
  card.addEventListener("click", () =>
    dispatch({ type: "buyUpgrade", ID: upgrade.ID }),
  );
  if (!isDNAUpgrade && upgradeList) {
    upgradeList.appendChild(card);
  } else {
    appendDNAUpgradeCards(upgrade, card);
  }

  if (upgrade.ID.startsWith("RE")) {
    card.classList.add("hide");
  }
}

export function updateUpgradeDisplay(upgrade: Upgrade, state: State) {
  const details = doc(`details-${upgrade.ID}`);
  const card = doc(`card-${upgrade.ID}`);
  if (details) {
    details.textContent = renderButtonText(upgrade, state);
  }
  if (card) {
    const summary = card.querySelector(".summary");
    if (summary) {
      const nextCost = upgrade.costFormula(
        levelOf(state, upgrade.ID) + 1,
        state,
      );
      summary.textContent = editUpgradeDetails(upgrade, nextCost);
    }
  }
}

// ===============
// * 3. Milestones
// ===============

const milestoneList = doc("milestones");
export const renderMilestone = (
  state: State,
  milestone: MilestoneBlueprint,
): Boolean => {
  if (!milestone) {
    console.warn("No milestone supplied @ renderMilestone");
    return false;
  }
  const htmlMilestone = document.createElement("li");
  htmlMilestone.id = `milestone-${milestone.ID}`;

  renderMilestoneText(state, htmlMilestone, milestone);
  milestoneList.appendChild(htmlMilestone);
  return true;
};

export function renderMilestoneText(
  state: State,
  text: HTMLElement,
  milestone: MilestoneBlueprint,
) {
  const noEmoji = "\u{274C}";
  const yesEmoji = "\u{2705}";

  if (isMilestoneClaimed(state, milestone.ID)) {
    text.textContent = `required: ${milestone.needed}, description: ${milestone.description}, found: ${yesEmoji}`;
  } else {
    text.textContent = `description: ${milestone.description}, found: ${noEmoji}`;
  }
}

// ==============
// * 4. Slamo DNA
// ==============

export function renderDNAMachine(state: State) {

  const aggressiveness = doc("aggressiveness");
  const active = doc("active");
  const idle = doc("idle");

  // TODO: account for level and cost formula while rendering upgrade text
  const DNAAgg = upgradeLibrary.DNA_AGG;
  const DNAActive = upgradeLibrary.DNA_ACTIVE;
  const DNAIdle = upgradeLibrary.DNA_IDLE;

  aggressiveness.textContent = `+1 power - costs ${DNAAgg.costFormula(levelOf(state, DNAAgg.ID) + 1, state)} entropy.`;
  active.textContent = `+1 power - costs ${DNAActive.costFormula(levelOf(state, DNAActive.ID) + 1, state)} entropy.`;
  idle.textContent = `+1 power - costs ${DNAIdle.costFormula(levelOf(state, DNAIdle.ID) + 1, state)} entropy.`;
}
function renderUpgradeCounter(
  element: HTMLElement,
  level: number,
  symbol: string,
) {
  element.textContent = symbol.repeat(level);
}
export function renderDNAUpgradeCounter(state: State) {
  const aggressivenessUpgradesCounter = doc("aggressivenessUpgradesCounter");
  const activeUpgradesCounter = doc("activeUpgradesCounter");
  const idleUpgradesCounter = doc("idleUpgradesCounter");
  // upgrades
  const DNAAgg = upgradeLibrary.DNA_AGG;
  const DNAActive = upgradeLibrary.DNA_ACTIVE;
  const DNAIdle = upgradeLibrary.DNA_IDLE;

  renderUpgradeCounter(
    aggressivenessUpgradesCounter,
    levelOf(state, DNAAgg.ID),
    "",
  );
  renderUpgradeCounter(activeUpgradesCounter, levelOf(state, DNAActive.ID), "");

  renderUpgradeCounter(idleUpgradesCounter, levelOf(state, DNAIdle.ID), "");
}
// ===========
// * 5. Other
// ===========
// dynamically updates button brightness based on cooldown.
export function updateButtonBrightness(
  element: HTMLElement,
  cooldownFunction: (...args: any[]) => any, // Correct type for a function
  clickTimeVariable: number, // Assuming your time variable is a timestamp/number
) {
  const calculatedTime = calculateTime(cooldownFunction, clickTimeVariable);
  const brightness = 0.5 + calculatedTime.progress * 0.5;

  // Fixed: Added quotes / backticks back to make it a valid CSS string
  element.style.filter = `brightness(${brightness})`;
}

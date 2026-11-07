// milestoneData.ts
import { Upgrade } from "../../data";
import { State } from "../../state";

export interface MilestoneBlueprint {
  ID: string;
  needed: number;
  description: string;
  type: "dynamic" | "static";
  category: "slamoMilestone" | "entropyMilestone" | "discoveryTier";
  stat: "slamoClicks" | "kineticEnergy";
  // Single function type that provides everything the milestone might want
  effect:
    | ((ctx: { state: State; upgradeLibrary: Record<string, Upgrade> }) => void)
    | null;
}

export const milestones: Record<string, MilestoneBlueprint> = {
  // * SLAMO MILESTONES
  M1: {
    ID: "M1",
    needed: 10,
    description: "+1% click power per slamo click, cap at 250.",
    type: "dynamic",
    category: "slamoMilestone",
    stat: "slamoClicks",

    // The linear slamo boost is calculated in getClickPower() so it cannot
    // compound by re-multiplying the already modified clickPower value.
    effect: null,
  },
  M2: {
    ID: "M2",
    needed: 25,
    description: "+3 U2 max levels",
    type: "static",
    category: "slamoMilestone",
    stat: "slamoClicks",

    // ✅ Destructures state from the shared context object
    effect: ({ state }) => {
      if (state.upgradeState.U2) {
        state.upgradeState.U2.bonusMax += 3;
      } else {
        console.error("state.upgradeState.U2 not found. reset U2 :(");
        state.upgradeState.U2 = { level: 0, bonusMax: 0 };
      }
    },
  },

  M3: {
    ID: "M3",
    needed: 100,
    description: "-0.25s click cooldown",
    type: "static",
    category: "slamoMilestone",
    stat: "slamoClicks",

    // ✅ Destructures state from the shared context object
    effect: ({ state }) => {
      state.stats.clickCooldown -= 0.25;
    },
  },
  // * ENTROPY MILESTONES
  // TODO: Add more milestones past M3 after e20 amoeba, possibly unlocked by Discovery Tiers.
};

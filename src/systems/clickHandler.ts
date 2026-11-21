import { State } from "@/core/types";
import {
    calculateTime,
    getClickCooldown,
    getClickPower,
    getCritEffectiveness,
    getCritIIGuarantee,
    getSlamoClickCooldown,
    getSlamoClickPower,
    increaseStat,
    levelOf,
    rollCrit
} from "../calculations";
import { upgradeLibrary } from "../data";


type ClickTimeVariable = "lastClickTime" | "lastSlamoClickTime";


function isClickReady(state: State, clickTimeVariable: ClickTimeVariable, cooldown: number): boolean {
  const timing = calculateTime(cooldown, state.runtime[clickTimeVariable]);
  return timing.elapsed >= timing.cooldownMs;
}

function calculateCritsInAmoebaClick(state: State, baseClickPower: number): number {

  const { U9: critIIUpgrade, U17b: slamoCritUpgrade } = upgradeLibrary;

  if (!critIIUpgrade || !slamoCritUpgrade) return 0;

  const basePower = state.stats.clickPower ?? baseClickPower;
  const critMultiplier = getCritEffectiveness(state);
  const hasCritII = levelOf(state, critIIUpgrade.ID) >= 1;
  const isCritII = state.runtime.timesClicked % getCritIIGuarantee(state) === 0;

  if (hasCritII && isCritII) {
    console.log("CRIT II");
    return basePower * critMultiplier * 2;
  }

  if (rollCrit(state)) {
    if (levelOf(state, slamoCritUpgrade.ID) >= 1) {
      grantSlamoClickBonus(state);
    }
    return basePower * critMultiplier;
  }
  return basePower;
}

function grantSlamoClickBonus(state: State): void {
  increaseStat({
    target: state.resources,
    stat: "slamoClicks",
    amount: getSlamoClickPower(state),
    operation: "add",
  });
}

export function handleAmoebaClick(state: State): void {

  if (!isClickReady(state, "lastClickTime", getClickCooldown(state))) return;
  state.runtime.lastClickTime = Date.now();
  state.runtime.timesClicked++;

  const appliedClickPower = calculateCritsInAmoebaClick(state, state.stats.clickPower);
  increaseStat({
    target: state.resources,
    stat: "amoeba",
    amount: getClickPower(state, appliedClickPower),
    operation: "add",
  });
    

}

export function handleSlamoClick(state: State): void {

  if (!isClickReady(state, "lastSlamoClickTime", getSlamoClickCooldown(state))) return;

  state.runtime.lastSlamoClickTime = Date.now();
  grantSlamoClickBonus(state);
}

// backup

// import { State } from "@/core/types";
// import {
//   calculateTime,
//   getClickCooldown,
//   getClickPower,
//   getCritEffectiveness,
//   getCritIIGuarantee,
//   getSlamoClickCooldown,
//   getSlamoClickPower,
//   increaseStat,
//   levelOf,
//   rollCrit,
// } from "../calculations";
// import { upgradeLibrary } from "../data";

// export function handleAmoebaClick(state: State) {
//   const time = getClickCooldown(state);
//   const timing = calculateTime(time, state.runtime.lastClickTime);

//   if (timing.elapsed >= timing.cooldownMs) {
//     state.runtime.lastClickTime = Date.now();
//     const u9 = upgradeLibrary.U9;
//     const u17b = upgradeLibrary.U17b;

//     if (u9 && u17b) {
//       let baseClickPower = state.stats.clickPower;
//       const critEffectiveness = getCritEffectiveness(state);
//       state.runtime.timesClicked++;

//       if (
//         state.runtime.timesClicked % getCritIIGuarantee(state) === 0 &&
//         levelOf(state, u9.ID) >= 1
//       ) {
//         console.log("CRIT II, x2 click power+crit applied");
//         baseClickPower *= critEffectiveness * 2;
//       } else if (rollCrit(state)) {
//         if (levelOf(state, u17b.ID) >= 1) {
//           increaseStat({
//             target: state.resources,
//             stat: "slamoClicks",
//             amount: getSlamoClickPower(state),
//             operation: "add",
//           });
//         }
//         baseClickPower *= critEffectiveness;
//       }

//       // normal amoeba click
//       increaseStat({
//         target: state.resources,
//         stat: "amoeba",
//         amount: getClickPower(state, baseClickPower),
//         operation: "add",
//       });
//     }
//   }
// }

// export function handleSlamoClick(state: State) {
//   const cooldownSeconds = getSlamoClickCooldown(state);
//   const timing = calculateTime(
//     cooldownSeconds,
//     state.runtime.lastSlamoClickTime,
//   );

//   if (timing.elapsed >= timing.cooldownMs) {
//     state.runtime.lastSlamoClickTime = Date.now();

//     increaseStat({
//       target: state.resources,
//       stat: "slamoClicks",
//       amount: getSlamoClickPower(state),
//       operation: "add",
//     });
//   }
// }

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
  rollCrit,
} from "../calculations";
import { upgradeLibrary, slamoMilestones } from "../data";
import { checkMilestoneClaims } from "../milestones";
import { render, renderProgressBar } from "../render";
import { createNext } from "../save";
import { State } from "../state";

// clickHandler.ts

export function handleAmoebaClick(state: State) {
  const time = getClickCooldown(state);
  const timing = calculateTime(time, state.runtime.lastClickTime);

  if (timing.elapsed >= timing.cooldownMs) {
    state.runtime.lastClickTime = Date.now();
    const u9 = upgradeLibrary.U9;
    const u17b = upgradeLibrary.U17b;
    if (u9 && u17b) {
      let baseClickPower = state.stats.clickPower;
      const critEffectiveness = getCritEffectiveness(state);
      state.runtime.timesClicked++;

      if (
        state.runtime.timesClicked % getCritIIGuarantee(state) === 0 &&
        levelOf(state, u9.ID) >= 1
      ) {
        console.log("CRIT II, x2 click power+crit applied");
        baseClickPower *= critEffectiveness * 2;
      } else if (rollCrit(state)) {
        if (levelOf(state, u17b.ID) >= 1) {
          increaseStat({
            target: state.resources,
            stat: "slamoClicks",
            amount: getSlamoClickPower(state),
            operation: "add",
          });
        }
        baseClickPower *= critEffectiveness;
      }

      // normal amoeba click
      increaseStat({
        target: state.resources,
        stat: "amoeba",
        amount: getClickPower(state, baseClickPower),
        operation: "add",
      });
      render(state);
      renderProgressBar(state);
    }
  }
}

export function handleSlamoClick(state: State) {
  const cooldownSeconds = getSlamoClickCooldown(state);
  const timing = calculateTime(
    cooldownSeconds,
    state.runtime.lastSlamoClickTime,
  );

  if (timing.elapsed >= timing.cooldownMs) {
    state.runtime.lastSlamoClickTime = Date.now();

    increaseStat({
      target: state.resources,
      stat: "slamoClicks",
      amount: getSlamoClickPower(state),
      operation: "add",
    });
    render(state);

    const next = createNext(state);
    checkMilestoneClaims(next, slamoMilestones);
  }
}

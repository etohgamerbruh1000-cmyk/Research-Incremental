import { State } from "./state";

export function updateCellEntropyMultiplier(state: State, deltaTime: number) {
  state.runtime.formulaicEntropyClicks -= 0.05 * deltaTime;
  state.runtime.formulaicEntropyClicks = Math.max(
    0,
    state.runtime.formulaicEntropyClicks,
  );
}

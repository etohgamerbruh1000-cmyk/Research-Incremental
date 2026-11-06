// upgradeFormulas.ts

import { State } from "../state";

export function getU2Mult(level: number, state: State): number {
  // 1. Provide a default fallback value directly upon declaration
  let base = level ? 1.15 ** level : 1.15;

  // 2. Safely read deeply nested properties with optional chaining and a fallback
  const hasU16 = (state?.upgradeState?.["U16"]?.level ?? 0) >= 1;
  const amoebaCount = state?.resources?.amoeba ?? 0;

  if (hasU16) {
    base += Math.log10(1 + amoebaCount) / 100;
  }

  return base;
}
export function getRNABurst(state: State) {
  // TODO: Implement formula, change and debug accordingly
  const predictedRNABurst =
    state.stats.cellResets ** 1.67 *
    (10 + Math.sqrt(state.resources.amoeba ** 0.3));

  return predictedRNABurst;
}

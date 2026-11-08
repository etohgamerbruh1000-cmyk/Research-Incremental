// upgradeFormulas.ts

export function getU2Mult(
  level: number,
  hasU16: boolean,
  amoebaCount: number,
): number {
  // 1. Provide a default fallback value directly upon declaration
  let base = level ? 1.15 ** level : 1.15;

  if (hasU16) {
    base += Math.log10(1 + amoebaCount) / 100;
  }

  return base;
}
export function getRNABurst(cellResets: number, amoebaCount: number) {
  // TODO: Implement formula, change and debug accordingly
  const predictedRNABurst =
    cellResets ** 1.67 * (10 + Math.sqrt(amoebaCount ** 0.3));

  return predictedRNABurst;
}

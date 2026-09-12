// import barrel for shared module access
// Keep this as a thin re-export layer so the app can import from one place
// without having to change the underlying module layout.

import { state } from "./state.js";

export * from "./audio.js";
export * from "./cells.js";
export * from "./data.js";
export * from "./gameLoop.js";
export * from "./logic.js";
export * from "./render.js";
export * from "./save.js";
export * from "./state.js";
export * from "./synergy.js";
export * from "./upgradeSystem.js";

export function createNext() {
  return structuredClone(state);
}

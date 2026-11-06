// src/ui/bindings.ts
import { state } from "../state";
import { dispatch } from "../reducer";
import { doc } from "../render";

export function initializeButtonBindings() {
  const amoebaButton = doc("amoebaButton");
  const slamo = doc("slamo");
  const cellResetBtn = doc("cellResetBtn");
  const cell = doc("cell");

  // Clean, action-based UI signals!
  amoebaButton.addEventListener("click", () => {
    dispatch(state, { type: "amoebaClick" });
  });

  slamo.addEventListener("click", () => {
    dispatch(state, { type: "slamoClick" });
  });

  cellResetBtn.addEventListener("click", () => {
    dispatch(state, { type: "resetCells", resettableKeys: ["cells"] });
    cellResetBtn.classList.add("hide");
  });

  cell.addEventListener("click", () => {
    dispatch(state, {
      type: "increaseStat",
      payload: {
        target: "runtime",
        stat: "totalEntropyClicks",
        amount: 1,
        operation: "add",
      },
    });
  });
}

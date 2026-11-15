// src/ui/bindings.ts
import { dispatch } from "../reducer";
import { doc } from "../render";
import { state } from "../state";

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

  const upgradeList = doc("upgradeList");
  upgradeList.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const clickedCard = target.closest<HTMLElement>(".upgrade-card");
    const id = clickedCard?.dataset.upgradeId;
    if (id) {
      dispatch(state, { type: "buyUpgrade", ID: id });
    }
  });

}



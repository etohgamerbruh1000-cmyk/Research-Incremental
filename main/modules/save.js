// save.js
// handles browser reload saving
// will handle cloud save soon

import { state, updateState } from './logic.js'

const SAVE_KEY = "rir-save";

export function saveGame(input) {
  const save = JSON.stringify(input);
  localStorage.setItem(SAVE_KEY, save);
}

export function loadGame() {
  const saveData = localStorage.getItem(SAVE_KEY);
  if (saveData === null) {
    return null;
  }
  return JSON.parse(saveData);
}

export function loadGameIntoState() {
  const loadedState = loadGame();
  if (loadedState === null) {
    return;
  }
   updateState({loadedState}) 
}




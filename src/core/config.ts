// configHandler.ts
import type { state } from "@/state";

export const GAME_TICK_INTERVAL = 1000; // ms
export const SAVE_KEY = "rir-save-v0.0.0";
export const MAX_DELTA_TIME = 10000; // ms

export type SoftcapExpectation = keyof typeof state.resources;

export const softcapThresholds: Partial<Record<SoftcapExpectation, readonly number[]>> = {
  amoeba: [1e6, 1e50],
};

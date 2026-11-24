// save.ts
// handles browser reload saving
// will handle cloud save soon

import { State } from "@/core/types";
import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate";
import { SAVE_KEY } from "./core/config";

// --- HELPER: Convert Uint8Array to a Base64 string ---
function uint8ToBase64(u8: Uint8Array): string {
  let binary = "";
  if (!u8 || u8.byteLength === 0) {
    console.warn("uint8ToBase64: Input Uint8Array is empty/undefined.");
    return "";
  }
  
  // Using a for...of loop avoids index typing errors completely!
  for (const byte of u8) {
    binary += String.fromCharCode(byte);
  }
  
  return btoa(binary);
}

// --- HELPER: Convert Base64 string back to Uint8Array ---
 function base64ToUint8(b64: string): Uint8Array {
  const binary = atob(b64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function saveGame(state: State): boolean {
  if (!state || Object.keys(state).length === 0) {
    console.error("Save aborted: state object is missing or empty.");
    return false;
  }

  try {
    const jsonString = JSON.stringify(state);
    
    // 1. Convert JSON string to raw bytes
    const utf8Bytes = strToU8(jsonString);
    
    // 2. Compress the bytes using fflate
    const compressedBytes = zlibSync(utf8Bytes);
    
    // 3. Store as Base64 in localStorage so binary bytes save cleanly as text
    const base64Save = uint8ToBase64(compressedBytes);
    localStorage.setItem(SAVE_KEY, base64Save);
    
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to write save to localStorage:", errorMessage);
    return false;
  }
}

export function loadGame(): State | null {
  const saveData = localStorage.getItem(SAVE_KEY);

  if (saveData === null) {
    return null;
  }

  try {
    // 1. Convert stored Base64 back into compressed bytes
    const compressedBytes = base64ToUint8(saveData);
    
    // 2. Decompress bytes back to original UTF-8 bytes
    const utf8Bytes = unzlibSync(compressedBytes);
    
    // 3. Bytes back to string, then parse JSON
    const jsonString = strFromU8(utf8Bytes);
    const parsedState = JSON.parse(jsonString);

    if (
      !parsedState ||
      typeof parsedState !== "object" ||
      !parsedState.resources
    ) {
      console.warn("Save data layout is malformed or corrupted.");
      return null;
    }

    return parsedState;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to load save from localStorage:", errorMessage);
    return null;
  }
}

export function createNext(state: State) {
  const next = structuredClone(state);
  return next;
}

export function exportb64Encoded(state: State): string {
  const jsonString = JSON.stringify(state);
  
  // Compress first, then convert to Base64 export string
  const utf8Bytes = strToU8(jsonString);
  const compressedBytes = zlibSync(utf8Bytes);
  
  return uint8ToBase64(compressedBytes);
}

export function importb64Encoded(encoded: string): State | null {
  try {
    // Decode Base64 to compressed bytes, then decompress
    const compressedBytes = base64ToUint8(encoded);
    const utf8Bytes = unzlibSync(compressedBytes);
    const jsonString = strFromU8(utf8Bytes);
    const parsedState = JSON.parse(jsonString);
    
    const saveEligible = parsedState && typeof parsedState === "object" && parsedState.resources;

    if (!saveEligible) {
      console.warn("Imported save data layout is malformed or corrupted.");
      return null;
    }
    return parsedState;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to import save data:", errorMessage);
    return null;
  }
}
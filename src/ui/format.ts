const SUFFIXES = [
  "", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No",
  "Dc", // normal cutoff
  "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc", "SpDc", "OcDc", "NoDc",
  "Vg", "UVg", "DVg", "TVg", "QaVg", "QiVg", "SxVg", "SpVg", "OcVg", "NoVg",
  "Tg", "UTg", "DTg", "TTg", "QaTg", "QiTg", "SxTg", "SpTg", "OcTg", "NoTg",
  "Qag", "UQag", "DQag", "TQag", "QaQag", "QiQag", "SxQag", "SpQag", "OcQag", "NoQag",
  "Qig", "UQig", "DQig", "TQig", "QaQig", "QiQig", "SxQig", "SpQig", "OcQig", "NoQig",
  "Sxg", "USxg", "DSxg", "TSxg", "QaSxg", "QiSxg", "SxSxg", "SpSxg", "OcSxg", "NoSxg",
  "Spg", "USpg", "DSpg", "TSpg", "QaSpg", "QiSpg", "SxSpg", "SpSpg", "OcSpg", "NoSpg",
  "Ocg", "UOcg", "DOcg", "TOcg", "QaOcg", "QiOcg", "SxOcg", "SpOcg", "OcOcg", "NoOcg",
  "Nog", "UNog", "DNog", "TNog", "QaNog", "QiNog", "SxNog", "SpNog", "OcNog", "NoNog",
  "Ce", "UCe"
];

import { state } from "@/state";
export type NotationType = "mixed" | "scientific" | "engineering" | "standard";

export function formatNumber(
  num: number,
  notation: NotationType = state.config.notation,
  scientificOoMs: number = state.config.scientificNotationOoMs,
  decimals: number = 2
): string {
  if (num < 1000) return Math.floor(num).toString();

  const exponent = Math.floor(Math.log10(num));
  const useScientific =
    notation === "scientific" ||
    (notation === "mixed" && exponent >= scientificOoMs);

  if (useScientific) {
    const mantissa = num / Math.pow(10, exponent);
    return `${mantissa.toFixed(decimals)}e${exponent}`;
  }

  const tier = Math.floor(exponent / 3);
  const scaled = num / Math.pow(10, tier * 3);

  if (notation === "engineering" || tier >= SUFFIXES.length) {
    return `${scaled.toFixed(decimals)}e${tier * 3}`;
  }

  return `${scaled.toFixed(decimals)} ${SUFFIXES[tier]}`;
}

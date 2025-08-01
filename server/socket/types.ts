export type plinkoModeTypes = "low" | "medium" | "high";
export type plinkoLines = 8 | 10 | 12 | 14 | 16;

export interface IPlinkoGame {
  lines: plinkoLines;
  mode: plinkoModeTypes;
  betValue: number;
  device: string;
}
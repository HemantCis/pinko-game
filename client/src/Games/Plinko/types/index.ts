export type LinesType =
  | "low8"
  | "medium8"
  | "high8"
  | "low9"
  | "medium9"
  | "high9"
  | "low10"
  | "medium10"
  | "high10"
  | "low11"
  | "medium11"
  | "high11"
  | "low12"
  | "medium12"
  | "high12"
  | "low13"
  | "medium13"
  | "high13"
  | "low14"
  | "medium14"
  | "high14"
  | "low15"
  | "medium15"
  | "high15"
  | "low16"
  | "medium16"
  | "high16";
export type LinesTypes = 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
export type Mode = "low" | "medium" | "high";

export interface IMultiplier {
  id: number;
  value: number;
  background: string;
}

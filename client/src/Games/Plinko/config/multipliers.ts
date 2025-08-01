import lowmultiplieraudio from "../sounds/LowMultiplier.wav";
import mediummultiplieraudio from "../sounds/MediumMultiplier.wav";
import highmultiplieraudio from "../sounds/HighMultiplier.wav";
import ultimatemultiplieraudio from "../sounds/UltimateMultiplier.wav";

import { Howl } from "howler";
import { LinesType, LinesTypes, Mode } from "../types";

const UltimateAudio = new Howl({
  src: [ultimatemultiplieraudio],
  volume: 0.2,
  html5: true,
});
const HighAudio = new Howl({
  src: [highmultiplieraudio],
  volume: 0.2,
  html5: true,
});
const MediumAudio = new Howl({
  src: [mediummultiplieraudio],
  volume: 0.2,
  html5: true,
});
const LowAudio = new Howl({
  src: [lowmultiplieraudio],
  volume: 0.2,
  html5: true,
});

export const getMultiplierSound = (multiplier: number) => {
  if (multiplier >= 25) {
    return UltimateAudio;
  } else if (multiplier >= 5) {
    return HighAudio;
  } else if (multiplier >= 1) {
    return MediumAudio;
  } else {
    return LowAudio;
  }
};

export function getMultiplier(value: number) {
  // return multipliers[value];
  return { label: `block-${value}` };
}

export const low8Lines = [
  getMultiplier(5.6),
  getMultiplier(2.1),
  getMultiplier(1.1),
  getMultiplier(1),
  getMultiplier(0.5),
  getMultiplier(1),
  getMultiplier(1.1),
  getMultiplier(2.1),
  getMultiplier(5.6),
];

export const low9Lines = [
  getMultiplier(5.6),
  getMultiplier(2),
  getMultiplier(1.6),
  getMultiplier(1),
  getMultiplier(0.7),
  getMultiplier(0.7),
  getMultiplier(1),
  getMultiplier(1.6),
  getMultiplier(2),
  getMultiplier(5.6),
];

export const low10Lines = [
  getMultiplier(8.9),
  getMultiplier(3),
  getMultiplier(1.4),
  getMultiplier(1.1),
  getMultiplier(1),
  getMultiplier(0.5),
  getMultiplier(1),
  getMultiplier(1.1),
  getMultiplier(1.4),
  getMultiplier(3),
  getMultiplier(8.9),
];

export const low11Lines = [
  getMultiplier(8.4),
  getMultiplier(3),
  getMultiplier(1.9),
  getMultiplier(1.3),
  getMultiplier(1),
  getMultiplier(0.7),
  getMultiplier(0.7),
  getMultiplier(1),
  getMultiplier(1.3),
  getMultiplier(1.9),
  getMultiplier(3),
  getMultiplier(8.3),
];

export const low12Lines = [
  getMultiplier(10),
  getMultiplier(3),
  getMultiplier(1.6),
  getMultiplier(1.4),
  getMultiplier(1.1),
  getMultiplier(1),
  getMultiplier(0.5),
  getMultiplier(1),
  getMultiplier(1.1),
  getMultiplier(1.4),
  getMultiplier(1.6),
  getMultiplier(3),
  getMultiplier(10),
];

export const low13Lines = [
  getMultiplier(8.1),
  getMultiplier(4),
  getMultiplier(3),
  getMultiplier(1.9),
  getMultiplier(1.2),
  getMultiplier(0.9),
  getMultiplier(0.7),
  getMultiplier(0.7),
  getMultiplier(0.9),
  getMultiplier(1.2),
  getMultiplier(1.9),
  getMultiplier(3),
  getMultiplier(4),
  getMultiplier(8.1),
];

export const low14Lines = [
  getMultiplier(7.1),
  getMultiplier(4),
  getMultiplier(1.9),
  getMultiplier(1.4),
  getMultiplier(1.3),
  getMultiplier(1.1),
  getMultiplier(1),
  getMultiplier(0.5),
  getMultiplier(1),
  getMultiplier(1.1),
  getMultiplier(1.3),
  getMultiplier(1.4),
  getMultiplier(1.9),
  getMultiplier(4),
  getMultiplier(7.1),
];

export const low15Lines = [
  getMultiplier(15),
  getMultiplier(8),
  getMultiplier(3),
  getMultiplier(2),
  getMultiplier(1.5),
  getMultiplier(1.1),
  getMultiplier(1),
  getMultiplier(0.7),
  getMultiplier(0.7),
  getMultiplier(1),
  getMultiplier(1.1),
  getMultiplier(1.5),
  getMultiplier(2),
  getMultiplier(3),
  getMultiplier(8),
  getMultiplier(15),
];

export const low16Lines = [
  getMultiplier(16),
  getMultiplier(9),
  getMultiplier(2),
  getMultiplier(1.4),
  getMultiplier(1.4),
  getMultiplier(1.2),
  getMultiplier(1.1),
  getMultiplier(1),
  getMultiplier(0.5),
  getMultiplier(1),
  getMultiplier(1.1),
  getMultiplier(1.2),
  getMultiplier(1.4),
  getMultiplier(1.4),
  getMultiplier(2),
  getMultiplier(9),
  getMultiplier(16),
];

export const medium8Lines = [
  getMultiplier(13),
  getMultiplier(3),
  getMultiplier(1.3),
  getMultiplier(0.7),
  getMultiplier(0.4),
  getMultiplier(0.7),
  getMultiplier(1.3),
  getMultiplier(3),
  getMultiplier(13),
];

export const medium9Lines = [
  getMultiplier(18),
  getMultiplier(4),
  getMultiplier(1.7),
  getMultiplier(0.9),
  getMultiplier(0.5),
  getMultiplier(0.5),
  getMultiplier(0.9),
  getMultiplier(1.7),
  getMultiplier(4),
  getMultiplier(18),
];

export const medium10Lines = [
  getMultiplier(22),
  getMultiplier(5),
  getMultiplier(2),
  getMultiplier(1.4),
  getMultiplier(0.6),
  getMultiplier(0.4),
  getMultiplier(0.6),
  getMultiplier(1.4),
  getMultiplier(2),
  getMultiplier(5),
  getMultiplier(22),
];

export const medium11Lines = [
  getMultiplier(24),
  getMultiplier(6),
  getMultiplier(3),
  getMultiplier(1.8),
  getMultiplier(0.7),
  getMultiplier(0.5),
  getMultiplier(0.5),
  getMultiplier(0.7),
  getMultiplier(1.8),
  getMultiplier(3),
  getMultiplier(6),
  getMultiplier(24),
];

export const medium12Lines = [
  getMultiplier(33),
  getMultiplier(11),
  getMultiplier(4),
  getMultiplier(2),
  getMultiplier(1.1),
  getMultiplier(0.6),
  getMultiplier(0.3),
  getMultiplier(0.6),
  getMultiplier(1.1),
  getMultiplier(2),
  getMultiplier(4),
  getMultiplier(11),
  getMultiplier(33),
];

export const medium13Lines = [
  getMultiplier(43),
  getMultiplier(13),
  getMultiplier(6),
  getMultiplier(3),
  getMultiplier(1.3),
  getMultiplier(0.7),
  getMultiplier(0.4),
  getMultiplier(0.4),
  getMultiplier(0.7),
  getMultiplier(1.3),
  getMultiplier(3),
  getMultiplier(6),
  getMultiplier(13),
  getMultiplier(43),
];

export const medium14Lines = [
  getMultiplier(58),
  getMultiplier(15),
  getMultiplier(7),
  getMultiplier(4),
  getMultiplier(1.9),
  getMultiplier(1),
  getMultiplier(0.5),
  getMultiplier(0.2),
  getMultiplier(0.5),
  getMultiplier(1),
  getMultiplier(1.9),
  getMultiplier(4),
  getMultiplier(7),
  getMultiplier(15),
  getMultiplier(58),
];

export const medium15Lines = [
  getMultiplier(88),
  getMultiplier(18),
  getMultiplier(11),
  getMultiplier(5),
  getMultiplier(3),
  getMultiplier(1.3),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(1.3),
  getMultiplier(3),
  getMultiplier(5),
  getMultiplier(11),
  getMultiplier(18),
  getMultiplier(88),
];

export const medium16Lines = [
  getMultiplier(110),
  getMultiplier(41),
  getMultiplier(10),
  getMultiplier(5),
  getMultiplier(3),
  getMultiplier(1.5),
  getMultiplier(1),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(1),
  getMultiplier(1.5),
  getMultiplier(3),
  getMultiplier(5),
  getMultiplier(10),
  getMultiplier(41),
  getMultiplier(110),
];

export const high8Lines = [
  getMultiplier(29),
  getMultiplier(4),
  getMultiplier(1.5),
  getMultiplier(0.3),
  getMultiplier(0.2),
  getMultiplier(0.3),
  getMultiplier(1.5),
  getMultiplier(4),
  getMultiplier(29),
];

export const high9Lines = [
  getMultiplier(43),
  getMultiplier(7),
  getMultiplier(2),
  getMultiplier(0.6),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.6),
  getMultiplier(2),
  getMultiplier(7),
  getMultiplier(43),
];

export const high10Lines = [
  getMultiplier(76),
  getMultiplier(10),
  getMultiplier(3),
  getMultiplier(0.9),
  getMultiplier(0.3),
  getMultiplier(0.2),
  getMultiplier(0.3),
  getMultiplier(0.9),
  getMultiplier(3),
  getMultiplier(10),
  getMultiplier(76),
];

export const high11Lines = [
  getMultiplier(120),
  getMultiplier(14),
  getMultiplier(5.2),
  getMultiplier(1.4),
  getMultiplier(0.4),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.4),
  getMultiplier(1.4),
  getMultiplier(5.2),
  getMultiplier(14),
  getMultiplier(120),
];

export const high12Lines = [
  getMultiplier(170),
  getMultiplier(24),
  getMultiplier(8.1),
  getMultiplier(2),
  getMultiplier(0.7),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.7),
  getMultiplier(2),
  getMultiplier(8.1),
  getMultiplier(24),
  getMultiplier(170),
];

export const high13Lines = [
  getMultiplier(260),
  getMultiplier(37),
  getMultiplier(11),
  getMultiplier(4),
  getMultiplier(1),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(1),
  getMultiplier(4),
  getMultiplier(11),
  getMultiplier(37),
  getMultiplier(260),
];

export const high14Lines = [
  getMultiplier(420),
  getMultiplier(56),
  getMultiplier(18),
  getMultiplier(5),
  getMultiplier(1.9),
  getMultiplier(0.3),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.3),
  getMultiplier(1.9),
  getMultiplier(5),
  getMultiplier(18),
  getMultiplier(56),
  getMultiplier(420),
];

export const high15Lines = [
  getMultiplier(620),
  getMultiplier(83),
  getMultiplier(27),
  getMultiplier(8),
  getMultiplier(3),
  getMultiplier(0.5),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.5),
  getMultiplier(3),
  getMultiplier(8),
  getMultiplier(27),
  getMultiplier(83),
  getMultiplier(620),
];

export const high16Lines = [
  getMultiplier(1000),
  getMultiplier(130),
  getMultiplier(26),
  getMultiplier(9),
  getMultiplier(4),
  getMultiplier(2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(0.2),
  getMultiplier(2),
  getMultiplier(4),
  getMultiplier(9),
  getMultiplier(26),
  getMultiplier(130),
  getMultiplier(1000),
];

export const config8 = [7, 5, 4, 2, 1, 2, 4, 5, 7];

export const config9 = [7, 5, 4, 2, 1, 1, 2, 4, 5, 7];

export const config10 = [7, 6, 5, 4, 2, 1, 2, 4, 5, 6, 7];

export const config11 = [7, 6, 5, 4, 2, 1, 1, 2, 4, 5, 6, 7];

export const config12 = [7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7];

export const config13 = [7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7];

export const config14 = [8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8];

export const config15 = [8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 8];

export const config16 = [9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const multiplyBlocksByLinesQnt = {
  low8: low8Lines,
  medium8: medium8Lines,
  high8: high8Lines,
  low9: low9Lines,
  medium9: medium9Lines,
  high9: high9Lines,
  low10: low10Lines,
  medium10: medium10Lines,
  high10: high10Lines,
  low11: low11Lines,
  medium11: medium11Lines,
  high11: high11Lines,
  low12: low12Lines,
  medium12: medium12Lines,
  high12: high12Lines,
  low13: low13Lines,
  medium13: medium13Lines,
  high13: high13Lines,
  low14: low14Lines,
  medium14: medium14Lines,
  high14: high14Lines,
  low15: low15Lines,
  medium15: medium15Lines,
  high15: high15Lines,
  low16: low16Lines,
  medium16: medium16Lines,
  high16: high16Lines,
};

export function getMultiplierByLinesQnt(value: LinesTypes, mode: Mode) {
  const query: LinesType = `${mode}${value}`;
  return multiplyBlocksByLinesQnt[query];
}

export function getMultiplierColorConfig(lines: LinesTypes) {
  if (lines === 8) {
    return config8;
  } else if (lines === 9) {
    return config9;
  } else if (lines === 10) {
    return config10;
  } else if (lines === 11) {
    return config11;
  } else if (lines === 12) {
    return config12;
  } else if (lines === 13) {
    return config13;
  } else if (lines === 14) {
    return config14;
  } else if (lines === 15) {
    return config15;
  } else {
    return config16;
  }
}

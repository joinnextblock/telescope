import { HALVING_BLOCK } from "../constants";

export const BLOCKS_IN_SOLAR_CYCLE = HALVING_BLOCK;
export const BLOCKS_IN_SOLAR_SEASON = BLOCKS_IN_SOLAR_CYCLE / 4;

export const SOLAR_SEASONS = [
  { name: "Spring", emoji: "🌱", suffix: "Equinox" },
  { name: "Summer", emoji: "🌞", suffix: "Solstice" },
  { name: "Autumn", emoji: "🍂", suffix: "Equinox" },
  { name: "Winter", emoji: "❄️", suffix: "Solstice" }
];

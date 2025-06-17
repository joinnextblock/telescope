import { DIFFICULTY_ADJUSTMENT_BLOCK } from "../constants";

export const LUNAR_PHASES = [
  { name: 'full', emoji: '🌕' },
  { name: 'waning gibbous', emoji: '🌖' },
  { name: 'last quarter', emoji: '🌗' },
  { name: 'waning crescent', emoji: '🌘' },
  { name: 'new', emoji: '🌑' },
  { name: 'waxing crescent', emoji: '🌒' },
  { name: 'first quarter', emoji: '🌓' },
  { name: 'waxing gibbous', emoji: '🌔' },
];

export const LUNAR_CYCLES = [
  { emoji: '🍊', name: 'Orange' },
  { emoji: '🪶', name: 'Bird' },
  { emoji: '🫂', name: 'Friend' },
  { emoji: '🐳', name: 'Whale' },
  { emoji: '🐂', name: 'Bull' },
  { emoji: '🐻', name: 'Bear' },
  { emoji: '🌽', name: 'Corn' },
  { emoji: '⚡', name: 'Lightning' },
  { emoji: '🥜', name: 'Squirrel' },
  { emoji: '🌊', name: 'Wave' },
  { emoji: '🧊', name: 'Ice' },
  { emoji: '💎', name: 'Diamond' },
  { emoji: '₿', name: "Satoshi's" },
];


export const BLOCKS_IN_LUNAR_PHASE = DIFFICULTY_ADJUSTMENT_BLOCK / 4
export const BLOCKS_IN_LUNAR_CYCLE = DIFFICULTY_ADJUSTMENT_BLOCK * 2;
export const BLOCKS_IN_LUNAR_YEAR = BLOCKS_IN_LUNAR_CYCLE * LUNAR_CYCLES.length;

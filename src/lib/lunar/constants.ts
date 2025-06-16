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
  { emoji: '🍊', name: 'Orange Moon' },
  { emoji: '🪶', name: 'Bird Moon' },
  { emoji: '🫂', name: 'Friend Moon' },
  { emoji: '🐳', name: 'Whale Moon' },
  { emoji: '🐂', name: 'Bull Moon' },
  { emoji: '🐻', name: 'Bear Moon' },
  { emoji: '🌽', name: 'Corn Moon' },
  { emoji: '⚡', name: 'Lightning Moon' },
  { emoji: '🥜', name: 'Squirrel Moon' },
  { emoji: '🌊', name: 'Wave Moon' },
  { emoji: '🧊', name: 'Ice Moon' },
  { emoji: '💎', name: 'Diamond Moon' },
  { emoji: '₿', name: "Satoshi's Moon" },
];


export const BLOCKS_IN_LUNAR_PHASE = DIFFICULTY_ADJUSTMENT_BLOCK / 4
export const BLOCKS_IN_LUNAR_CYCLE = DIFFICULTY_ADJUSTMENT_BLOCK * 2;

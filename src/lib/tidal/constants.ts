import { BLOCKS_IN_LUNAR_CYCLE } from "../lunar/constants";

/**
 * Tidal system constants based on Bitcoin block height
 * These create a deterministic tidal system synchronized with lunar cycles
 */

export const BLOCKS_PER_LUNAR_CYCLE = BLOCKS_IN_LUNAR_CYCLE; // 4032 blocks

export const TIDAL_EVENTS_PER_CYCLE = 42; // 21 high tides + 21 low tides

export const BLOCKS_PER_TIDAL_EVENT = BLOCKS_PER_LUNAR_CYCLE / TIDAL_EVENTS_PER_CYCLE; // 96 blocks

export const COMPLETE_TIDAL_CYCLES = 21; // 21 high-low pairs

export const BLOCKS_PER_COMPLETE_CYCLE = BLOCKS_PER_TIDAL_EVENT * 2; // 192 blocks

/**
 * Slack water detection window
 * Blocks 44-52 are considered slack water (peak/trough of tide)
 */
export const SLACK_WATER_START = 44;
export const SLACK_WATER_END = 52;
export const SLACK_WATER_MIDPOINT = 48;

/**
 * Maximum tide heights
 * High tide peaks at +21 blocks, low tide bottoms at -21 blocks
 */
export const MAX_HIGH_TIDE = 21;
export const MAX_LOW_TIDE = -21;

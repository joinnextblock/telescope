import { BLOCKS_IN_LUNAR_CYCLE } from "../lunar/constants";

/**
 * Tidal system constants based on Bitcoin block height
 * These create a deterministic tidal system with a continuous 72-block cycle
 */

export const BLOCKS_PER_LUNAR_CYCLE = BLOCKS_IN_LUNAR_CYCLE; // 4032 blocks

/**
 * Tidal height cycle constants
 * The system uses a continuous 72-block cycle that repeats
 * Block 0 = +18 (high tide), decreases to block 36 = -18 (low tide), then increases back to +18 at block 72
 */
export const TIDAL_HEIGHT_CYCLE_LENGTH = 72; // 36 blocks down + 36 blocks up

/**
 * Slack water detection window
 * Based on position in 72-block cycle
 * Blocks 18-27: SLACK_HIGH (peak of high tide)
 * Blocks 45-54: SLACK_LOW (trough of low tide)
 */
export const SLACK_HIGH_START = 18;
export const SLACK_HIGH_END = 27;
export const SLACK_LOW_START = 45;
export const SLACK_LOW_END = 54;
export const SLACK_HIGH_MIDPOINT = 22;
export const SLACK_LOW_MIDPOINT = 49;

/**
 * Maximum tide heights
 * High tide peaks at +18 blocks, low tide bottoms at -18 blocks
 * System starts at high tide (+18 at block 0)
 */
export const MAX_HIGH_TIDE = 18;
export const MAX_LOW_TIDE = -18;

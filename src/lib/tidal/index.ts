import { GENESIS_BLOCK_HEIGHT } from "../constants";
import { Delta, InvalidBlockheightError } from "../delta";
import { create_lunar, Lunar } from "../lunar";
import { LUNAR_PHASES } from "../lunar/constants";
import {
  BLOCKS_PER_LUNAR_CYCLE,
  TIDAL_HEIGHT_CYCLE_LENGTH,
  SLACK_HIGH_START,
  SLACK_HIGH_END,
  SLACK_LOW_START,
  SLACK_LOW_END,
  SLACK_HIGH_MIDPOINT,
  SLACK_LOW_MIDPOINT,
  MAX_HIGH_TIDE,
  MAX_LOW_TIDE,
} from "./constants";

/**
 * Tide type enumeration
 */
export enum TideType {
  HIGH = "high",
  LOW = "low",
}

/**
 * Tide phase enumeration
 */
export enum TidePhase {
  RISING = "rising",
  FALLING = "falling",
  SLACK_HIGH = "slack_high", // Peak of high tide
  SLACK_LOW = "slack_low", // Bottom of low tide
}

/**
 * Complete tidal state for a given block height
 */
export interface TidalState {
  // Position tracking
  blocksIntoCycle: number; // 0-71 (position within 72-block cycle)
  blocksUntilNext: number; // Blocks remaining to next high/low point

  // Tide characteristics
  type: TideType; // 'high' or 'low'
  phase: TidePhase; // 'rising', 'falling', 'slack_high', 'slack_low'
  height: number; // -18 to +18 (tide height in blocks)

  // Timing
  nextTideBlock: number; // Absolute block height of next high/low point
  previousTideBlock: number; // Absolute block height of previous high/low point

  // Special conditions
  isSpringTide: boolean; // Aligns with new/full moon
  isNeapTide: boolean; // Aligns with quarter moons
}

/**
 * Information about the tidal height cycle
 */
export interface TidalCycleInfo {
  cycleLength: number; // Always 72 blocks
  maxHighTide: number; // Always +18
  maxLowTide: number; // Always -18
  currentCycleStart: number; // First block of current 72-block cycle
  currentCycleEnd: number; // Last block of current 72-block cycle
}

/**
 * Emoji representations for different tide states
 */
const TIDE_EMOJIS: Record<string, string> = {
  high_rising: "🌊⬆️",
  high_slack: "🌊",
  high_falling: "🌊⬇️",
  low_rising: "🏖️⬆️",
  low_slack: "🏖️",
  low_falling: "🏖️⬇️",
};

/**
 * Tidal class for calculating tidal states based on Bitcoin block height
 * Uses a continuous 72-block cycle: +18 at block 0, decreases to -18 at block 36, increases back to +18 at block 72
 * System starts at high tide (+18 at block 0)
 * Extends Delta to inherit blockheight management
 */
export class Tidal extends Delta {
  private lunar: Lunar;

  constructor(blockheight?: number) {
    if (blockheight !== undefined) {
      if (!Number.isInteger(blockheight)) {
        throw new InvalidBlockheightError("Blockheight must be an integer");
      }
    } else {
      throw new InvalidBlockheightError("Blockheight must be an integer");
    }
    super(blockheight ?? GENESIS_BLOCK_HEIGHT);
    this.lunar = create_lunar(blockheight ?? GENESIS_BLOCK_HEIGHT);
  }

  /**
   * Get the current tidal state for the block height
   */
  get_tidal_state(): TidalState {
    const blockHeight = this.get_blockheight();
    const blocksIntoCycle = blockHeight % TIDAL_HEIGHT_CYCLE_LENGTH;
    const tideHeight = this.get_tide_height();

    // Determine tide type from height
    const type = tideHeight > 0 ? TideType.HIGH : tideHeight < 0 ? TideType.LOW : TideType.HIGH;

    // Calculate phase based on position in cycle
    const phase = this.get_tide_phase();

    // Calculate blocks until next high/low point
    let blocksUntilNext: number;
    let nextTideBlock: number;
    let previousTideBlock: number;

    if (blocksIntoCycle < 36) {
      // In first half: heading to low tide at block 36
      blocksUntilNext = 36 - blocksIntoCycle;
      nextTideBlock = blockHeight + blocksUntilNext;
      previousTideBlock = blockHeight - blocksIntoCycle; // Previous high at cycle start
    } else {
      // In second half: heading to high tide at block 72 (which is block 0 of next cycle)
      blocksUntilNext = TIDAL_HEIGHT_CYCLE_LENGTH - blocksIntoCycle;
      nextTideBlock = blockHeight + blocksUntilNext;
      previousTideBlock = blockHeight - (blocksIntoCycle - 36); // Previous low at block 36
    }

    return {
      blocksIntoCycle,
      blocksUntilNext,
      type,
      phase,
      height: tideHeight,
      nextTideBlock,
      previousTideBlock,
      isSpringTide: this.is_spring_tide_internal(),
      isNeapTide: this.is_neap_tide_internal(),
    };
  }

  /**
   * Calculate tide height in blocks
   * Returns -18 to +18 blocks (integer values)
   * Pattern: +18 at block 0, decrease by 1 each block to -18, then increase by 1 back to +18
   * System starts at high tide (+18 at block 0)
   * Each block changes by exactly 1 block value
   */
  get_tide_height(): number {
    const blockHeight = this.get_blockheight();
    const positionInCycle = blockHeight % TIDAL_HEIGHT_CYCLE_LENGTH;

    if (positionInCycle <= 36) {
      // First 36 blocks: +18 down to -18
      // Block 0 = +18, block 36 = -18
      return MAX_HIGH_TIDE - positionInCycle;
    } else {
      // Next 36 blocks: -18 up to +18
      // Block 37 = -17, block 72 = +18 (then repeats)
      return MAX_LOW_TIDE + (positionInCycle - 36);
    }
  }

  /**
   * Get the type of tide (high/low) for the current block
   * Determined by height: positive = HIGH, negative = LOW, zero = HIGH (transition point)
   */
  get_tide_type(): TideType {
    const height = this.get_tide_height();
    return height > 0 ? TideType.HIGH : height < 0 ? TideType.LOW : TideType.HIGH;
  }

  /**
   * Get the tidal phase (rising/falling/slack) for the current block
   * Based on position in 72-block cycle
   */
  get_tide_phase(): TidePhase {
    const blockHeight = this.get_blockheight();
    const blocksIntoCycle = blockHeight % TIDAL_HEIGHT_CYCLE_LENGTH;
    const height = this.get_tide_height();

    // Slack high: around blocks 18-27 (near peak of high tide)
    if (blocksIntoCycle >= SLACK_HIGH_START && blocksIntoCycle <= SLACK_HIGH_END) {
      return TidePhase.SLACK_HIGH;
    }

    // Slack low: around blocks 45-54 (near trough of low tide)
    if (blocksIntoCycle >= SLACK_LOW_START && blocksIntoCycle <= SLACK_LOW_END) {
      return TidePhase.SLACK_LOW;
    }

    // Rising phase: first 18 blocks (high tide rising) or blocks 54-72 (low to high transition)
    if (blocksIntoCycle < 18 || blocksIntoCycle >= 54) {
      return TidePhase.RISING;
    }

    // Falling phase: blocks 27-45 (high to low transition)
    return TidePhase.FALLING;
  }

  /**
   * Calculate blocks until the next high/low point
   */
  get_blocks_until_next_tide(): number {
    const blockHeight = this.get_blockheight();
    const blocksIntoCycle = blockHeight % TIDAL_HEIGHT_CYCLE_LENGTH;

    if (blocksIntoCycle < 36) {
      // In first half: heading to low tide at block 36
      return 36 - blocksIntoCycle;
    } else {
      // In second half: heading to high tide at block 72 (which is block 0 of next cycle)
      return TIDAL_HEIGHT_CYCLE_LENGTH - blocksIntoCycle;
    }
  }

  /**
   * Get the block height of the next high/low point
   */
  get_next_tide_block(): number {
    return this.get_blockheight() + this.get_blocks_until_next_tide();
  }

  /**
   * Get information about the current tidal height cycle
   */
  get_tidal_cycle_info(): TidalCycleInfo {
    const blockHeight = this.get_blockheight();
    const blocksIntoCycle = blockHeight % TIDAL_HEIGHT_CYCLE_LENGTH;
    const cycleStartBlock = blockHeight - blocksIntoCycle;
    const cycleEndBlock = cycleStartBlock + TIDAL_HEIGHT_CYCLE_LENGTH - 1;

    return {
      cycleLength: TIDAL_HEIGHT_CYCLE_LENGTH,
      maxHighTide: MAX_HIGH_TIDE,
      maxLowTide: MAX_LOW_TIDE,
      currentCycleStart: cycleStartBlock,
      currentCycleEnd: cycleEndBlock,
    };
  }

  /**
   * Check if current tide aligns with spring tide conditions
   * (new moon or full moon phases)
   */
  is_spring_tide(): boolean {
    return this.is_spring_tide_internal();
  }

  /**
   * Internal helper for spring tide detection
   */
  private is_spring_tide_internal(): boolean {
    const moonPhase = this.lunar.get_phase();
    return moonPhase.name === "new" || moonPhase.name === "full";
  }

  /**
   * Check if current tide aligns with neap tide conditions
   * (first quarter or last quarter moon phases)
   */
  is_neap_tide(): boolean {
    return this.is_neap_tide_internal();
  }

  /**
   * Internal helper for neap tide detection
   */
  private is_neap_tide_internal(): boolean {
    const moonPhase = this.lunar.get_phase();
    return (
      moonPhase.name === "first quarter" || moonPhase.name === "last quarter"
    );
  }

  /**
   * Get a human-readable description of the current tide
   */
  get_tide_description(): string {
    const state = this.get_tidal_state();
    const phaseDescriptions: Record<TidePhase, string> = {
      [TidePhase.RISING]: "rising",
      [TidePhase.FALLING]: "falling",
      [TidePhase.SLACK_HIGH]: "at peak",
      [TidePhase.SLACK_LOW]: "at ebb",
    };

    const typeDescription =
      state.type === TideType.HIGH ? "high tide" : "low tide";
    const phaseDescription = phaseDescriptions[state.phase];
    const specialConditions: string[] = [];

    if (state.isSpringTide) {
      specialConditions.push("spring tide");
    }
    if (state.isNeapTide) {
      specialConditions.push("neap tide");
    }

    let description = `${typeDescription} ${phaseDescription}`;
    if (specialConditions.length > 0) {
      description += ` (${specialConditions.join(", ")})`;
    }

    return description;
  }

  /**
   * Get emoji representation of current tide
   */
  get_tide_emoji(): string {
    const state = this.get_tidal_state();
    const key = `${state.type}_${state.phase}`;
    return (
      TIDE_EMOJIS[key] ||
      (state.type === TideType.HIGH ? "🌊" : "🏖️")
    );
  }

  /**
   * Get a formatted display string for the current tide
   * Special handling for extreme values (+18/-18): simplified format
   * Special handling for slack tide values (+17/-17): slack tide format
   * Otherwise: full format with emoji, description, and height
   */
  get_tide_display(): string {
    try {
      const tideHeight = this.get_tide_height();

      // Special case for extreme values
      if (tideHeight === MAX_HIGH_TIDE) {
        return "🌊 High Tide (+18)";
      }
      if (tideHeight === MAX_LOW_TIDE) {
        return "🏖️ Low Tide (-18)";
      }

      // Special case for slack tide values
      if (tideHeight === 17) {
        return "🌊 Slack Tide (+17)";
      }
      if (tideHeight === -17) {
        return "🏖️ Slack Tide (-17)";
      }

      // Standard format for all other values
      const tideEmoji = this.get_tide_emoji();
      const tideDescription = this.get_tide_description();
      const tideHeightFormatted = tideHeight > 0 ? `+${tideHeight}` : `${tideHeight}`;
      return `${tideEmoji} Tide: ${tideDescription} (${tideHeightFormatted} blocks)`;
    } catch (error) {
      // Re-throw with more context if needed
      throw new Error(`Failed to get tide display: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Standalone functions for tidal calculations (pure functions)
 * These can be used without creating a Tidal instance
 */

/**
 * Get the type of tide (high/low) for a given block
 * Determined by height: positive = HIGH, negative = LOW, zero = HIGH (transition point)
 */
export function getTideType(blockHeight: number): TideType {
  const height = getTideHeight(blockHeight);
  return height > 0 ? TideType.HIGH : height < 0 ? TideType.LOW : TideType.HIGH;
}

/**
 * Calculate tide height in blocks
 * Returns -18 to +18 blocks (integer values)
 * Pattern: +18 at block 0, decrease by 1 each block to -18, then increase by 1 back to +18
 * System starts at high tide (+18 at block 0)
 * Each block changes by exactly 1 block value
 */
export function getTideHeight(blockHeight: number): number {
  const positionInCycle = blockHeight % TIDAL_HEIGHT_CYCLE_LENGTH;

  if (positionInCycle <= 36) {
    // First 36 blocks: +18 down to -18
    // Block 0 = +18, block 36 = -18
    return MAX_HIGH_TIDE - positionInCycle;
  } else {
    // Next 36 blocks: -18 up to +18
    // Block 37 = -17, block 72 = +18 (then repeats)
    return MAX_LOW_TIDE + (positionInCycle - 36);
  }
}

/**
 * Get the tidal phase (rising/falling/slack) for a given block
 * Based on position in 72-block cycle
 */
export function getTidePhase(blockHeight: number): TidePhase {
  const blocksIntoCycle = blockHeight % TIDAL_HEIGHT_CYCLE_LENGTH;

  // Slack high: around blocks 18-27 (near peak of high tide)
  if (blocksIntoCycle >= SLACK_HIGH_START && blocksIntoCycle <= SLACK_HIGH_END) {
    return TidePhase.SLACK_HIGH;
  }

  // Slack low: around blocks 45-54 (near trough of low tide)
  if (blocksIntoCycle >= SLACK_LOW_START && blocksIntoCycle <= SLACK_LOW_END) {
    return TidePhase.SLACK_LOW;
  }

  // Rising phase: first 18 blocks (high tide rising) or blocks 54-72 (low to high transition)
  if (blocksIntoCycle < 18 || blocksIntoCycle >= 54) {
    return TidePhase.RISING;
  }

  // Falling phase: blocks 27-45 (high to low transition)
  return TidePhase.FALLING;
}

/**
 * Calculate blocks until the next high/low point
 */
export function getBlocksUntilNextTide(blockHeight: number): number {
  const blocksIntoCycle = blockHeight % TIDAL_HEIGHT_CYCLE_LENGTH;

  if (blocksIntoCycle < 36) {
    // In first half: heading to low tide at block 36
    return 36 - blocksIntoCycle;
  } else {
    // In second half: heading to high tide at block 72 (which is block 0 of next cycle)
    return TIDAL_HEIGHT_CYCLE_LENGTH - blocksIntoCycle;
  }
}

/**
 * Get the block height of the next high/low point
 */
export function getNextTideBlock(blockHeight: number): number {
  return blockHeight + getBlocksUntilNextTide(blockHeight);
}

/**
 * Get the current tidal state for a given block height
 */
export function getTidalState(blockHeight: number): TidalState {
  const tidal = new Tidal(blockHeight);
  return tidal.get_tidal_state();
}

/**
 * Get information about the current tidal height cycle
 */
export function getTidalCycleInfo(blockHeight: number): TidalCycleInfo {
  const blocksIntoCycle = blockHeight % TIDAL_HEIGHT_CYCLE_LENGTH;
  const cycleStartBlock = blockHeight - blocksIntoCycle;
  const cycleEndBlock = cycleStartBlock + TIDAL_HEIGHT_CYCLE_LENGTH - 1;

  return {
    cycleLength: TIDAL_HEIGHT_CYCLE_LENGTH,
    maxHighTide: MAX_HIGH_TIDE,
    maxLowTide: MAX_LOW_TIDE,
    currentCycleStart: cycleStartBlock,
    currentCycleEnd: cycleEndBlock,
  };
}

/**
 * Check if current tide aligns with spring tide conditions
 * (new moon or full moon phases)
 */
export function isSpringTide(blockHeight: number): boolean {
  const lunar = create_lunar(blockHeight);
  const moonPhase = lunar.get_phase();
  return moonPhase.name === "new" || moonPhase.name === "full";
}

/**
 * Check if current tide aligns with neap tide conditions
 * (first quarter or last quarter moon phases)
 */
export function isNeapTide(blockHeight: number): boolean {
  const lunar = create_lunar(blockHeight);
  const moonPhase = lunar.get_phase();
  return (
    moonPhase.name === "first quarter" || moonPhase.name === "last quarter"
  );
}

/**
 * Get a human-readable description of the current tide
 */
export function getTideDescription(blockHeight: number): string {
  const tidal = new Tidal(blockHeight);
  return tidal.get_tide_description();
}

/**
 * Get emoji representation of current tide
 */
export function getTideEmoji(blockHeight: number): string {
  const tidal = new Tidal(blockHeight);
  return tidal.get_tide_emoji();
}

/**
 * Get a formatted display string for the current tide
 * Special handling for extreme values (+18/-18): simplified format
 * Special handling for slack tide values (+17/-17): slack tide format
 * Otherwise: full format with emoji, description, and height
 */
export function getTideDisplay(blockHeight: number): string {
  const tidal = new Tidal(blockHeight);
  return tidal.get_tide_display();
}

/**
 * create_tidal is a factory function that creates a new Tidal object.
 * @param blockheight - The blockheight to create a Tidal object from.
 * @returns A new Tidal object.
 */
export const create_tidal = (blockheight?: number): Tidal => {
  return new Tidal(blockheight);
};

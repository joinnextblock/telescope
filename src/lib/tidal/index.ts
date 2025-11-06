import { GENESIS_BLOCK_HEIGHT } from "../constants";
import { Delta, InvalidBlockheightError } from "../delta";
import { create_lunar, Lunar } from "../lunar";
import { LUNAR_PHASES } from "../lunar/constants";
import {
  BLOCKS_PER_LUNAR_CYCLE,
  BLOCKS_PER_TIDAL_EVENT,
  TIDAL_EVENTS_PER_CYCLE,
  COMPLETE_TIDAL_CYCLES,
  SLACK_WATER_START,
  SLACK_WATER_END,
  SLACK_WATER_MIDPOINT,
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
  eventNumber: number; // 0-41 (which tidal event in the lunar cycle)
  cycleNumber: number; // 0-20 (which complete high-low cycle)
  blocksIntoEvent: number; // 0-95 (position within current event)
  blocksUntilNext: number; // 1-96 (blocks remaining to next event)

  // Tide characteristics
  type: TideType; // 'high' or 'low'
  phase: TidePhase; // 'rising', 'falling', 'slack_high', 'slack_low'
  height: number; // 0.0 to 1.0 (normalized sine wave)

  // Timing
  nextTideBlock: number; // Absolute block height of next tide
  previousTideBlock: number; // Absolute block height of previous tide

  // Special conditions
  isSpringTide: boolean; // Aligns with new/full moon
  isNeapTide: boolean; // Aligns with quarter moons
}

/**
 * Information about a complete tidal cycle within a lunar month
 */
export interface TidalCycleInfo {
  startBlock: number; // First block of this lunar cycle
  endBlock: number; // Last block of this lunar cycle
  totalEvents: number; // Always 42
  highTides: number; // Always 21
  lowTides: number; // Always 21
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
    const positionInCycle = blockHeight % BLOCKS_PER_LUNAR_CYCLE;
    const eventNumber = Math.floor(positionInCycle / BLOCKS_PER_TIDAL_EVENT);
    const blocksIntoEvent = positionInCycle % BLOCKS_PER_TIDAL_EVENT;
    const cycleNumber = Math.floor(eventNumber / 2);
    const isHighTide = eventNumber % 2 === 0;

    const blocksUntilNext = BLOCKS_PER_TIDAL_EVENT - blocksIntoEvent;

    // Calculate next and previous tide blocks
    const nextTideBlock = blockHeight + blocksUntilNext;
    const previousTideBlock =
      blocksIntoEvent === 0
        ? blockHeight - BLOCKS_PER_TIDAL_EVENT
        : blockHeight - blocksIntoEvent;

    return {
      eventNumber,
      cycleNumber,
      blocksIntoEvent,
      blocksUntilNext,
      type: isHighTide ? TideType.HIGH : TideType.LOW,
      phase: this.get_tide_phase_internal(blocksIntoEvent, isHighTide),
      height: this.get_tide_height(), // Use the new simple calculation
      nextTideBlock,
      previousTideBlock,
      isSpringTide: this.is_spring_tide_internal(),
      isNeapTide: this.is_neap_tide_internal(),
    };
  }

  /**
   * Calculate tide height in blocks
   * Returns -21 to +21 blocks (integer values)
   * Pattern: +21 at block 0, decrease by 1 each block to -21, then increase by 1 back to +21
   * Each block changes by exactly 1 block value
   */
  get_tide_height(): number {
    return this.get_tide_height_internal(0, false); // Parameters not used with new calculation
  }

  /**
   * Internal helper for tide height calculation
   * Returns height in blocks: -21 to +21 (integer values)
   * Simple pattern: +21 at block 0, decrease by 1 each block to -21, then increase by 1 back to +21
   * Pattern: block 0 = +21, block 1 = +20, ..., block 42 = -21, block 43 = -20, ..., block 84 = +21 (then repeats)
   * Each block changes by exactly 1 block value
   */
  private get_tide_height_internal(
    blocksIntoEvent: number,
    isHighTide: boolean
  ): number {
    // Calculate position within the 84-block cycle (+21 to -21 to +21)
    // First 42 blocks: +21 down to -21
    // Next 42 blocks: -21 up to +21
    const positionInCycle = this.get_blockheight() % 84;

    if (positionInCycle <= 42) {
      // Going down from +21 to -21
      return MAX_HIGH_TIDE - positionInCycle;
    } else {
      // Going up from -21 to +21
      return MAX_LOW_TIDE + (positionInCycle - 42);
    }
  }

  /**
   * Get the type of tide (high/low) for the current block
   */
  get_tide_type(): TideType {
    const positionInCycle = this.get_blockheight() % BLOCKS_PER_LUNAR_CYCLE;
    const eventNumber = Math.floor(positionInCycle / BLOCKS_PER_TIDAL_EVENT);
    return eventNumber % 2 === 0 ? TideType.HIGH : TideType.LOW;
  }

  /**
   * Get the tidal phase (rising/falling/slack) for the current block
   */
  get_tide_phase(): TidePhase {
    const positionInCycle = this.get_blockheight() % BLOCKS_PER_LUNAR_CYCLE;
    const eventNumber = Math.floor(positionInCycle / BLOCKS_PER_TIDAL_EVENT);
    const blocksIntoEvent = positionInCycle % BLOCKS_PER_TIDAL_EVENT;
    const isHighTide = eventNumber % 2 === 0;

    return this.get_tide_phase_internal(blocksIntoEvent, isHighTide);
  }

  /**
   * Internal helper for tide phase calculation
   */
  private get_tide_phase_internal(
    blocksIntoEvent: number,
    isHighTide: boolean
  ): TidePhase {
    // Slack water occurs at peaks and troughs (around blocks 44-52 in each event)
    if (blocksIntoEvent >= SLACK_WATER_START && blocksIntoEvent <= SLACK_WATER_END) {
      return isHighTide ? TidePhase.SLACK_HIGH : TidePhase.SLACK_LOW;
    }

    // Rising in first half, falling in second half
    if (blocksIntoEvent < SLACK_WATER_MIDPOINT) {
      return isHighTide ? TidePhase.RISING : TidePhase.FALLING;
    } else {
      return isHighTide ? TidePhase.FALLING : TidePhase.RISING;
    }
  }

  /**
   * Calculate blocks until the next tidal event
   */
  get_blocks_until_next_tide(): number {
    const positionInCycle = this.get_blockheight() % BLOCKS_PER_LUNAR_CYCLE;
    const blocksIntoEvent = positionInCycle % BLOCKS_PER_TIDAL_EVENT;
    return BLOCKS_PER_TIDAL_EVENT - blocksIntoEvent;
  }

  /**
   * Get the block height of the next tidal event
   */
  get_next_tide_block(): number {
    return this.get_blockheight() + this.get_blocks_until_next_tide();
  }

  /**
   * Get information about the full tidal cycle for a lunar month
   */
  get_tidal_cycle_info(): TidalCycleInfo {
    const blockHeight = this.get_blockheight();
    const positionInCycle = blockHeight % BLOCKS_PER_LUNAR_CYCLE;
    const cycleStartBlock = blockHeight - positionInCycle;
    const cycleEndBlock = cycleStartBlock + BLOCKS_PER_LUNAR_CYCLE - 1;

    return {
      startBlock: cycleStartBlock,
      endBlock: cycleEndBlock,
      totalEvents: TIDAL_EVENTS_PER_CYCLE,
      highTides: COMPLETE_TIDAL_CYCLES,
      lowTides: COMPLETE_TIDAL_CYCLES,
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
   * Special handling for extreme values (+21/-21): simplified format
   * Otherwise: full format with emoji, description, and height
   */
  get_tide_display(): string {
    try {
      const tideHeight = this.get_tide_height();

      // Special case for extreme values
      if (tideHeight === MAX_HIGH_TIDE) {
        return "🌊 High Tide (+21)";
      }
      if (tideHeight === MAX_LOW_TIDE) {
        return "🏖️ Low Tide (-21)";
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
 */
export function getTideType(blockHeight: number): TideType {
  const positionInCycle = blockHeight % BLOCKS_PER_LUNAR_CYCLE;
  const eventNumber = Math.floor(positionInCycle / BLOCKS_PER_TIDAL_EVENT);
  return eventNumber % 2 === 0 ? TideType.HIGH : TideType.LOW;
}

/**
 * Calculate tide height in blocks
 * Returns -21 to +21 blocks (integer values)
 * Pattern: +21 at block 0, decrease by 1 each block to -21, then increase by 1 back to +21
 * Pattern: block 0 = +21, block 1 = +20, ..., block 42 = -21, block 43 = -20, ..., block 84 = +21 (then repeats)
 * Each block changes by exactly 1 block value
 */
export function getTideHeight(blockHeight: number): number {
  const positionInCycle = blockHeight % 84; // 84-block cycle: 42 down + 42 up

  if (positionInCycle <= 42) {
    // Going down from +21 to -21
    return MAX_HIGH_TIDE - positionInCycle;
  } else {
    // Going up from -21 to +21
    return MAX_LOW_TIDE + (positionInCycle - 42);
  }
}

/**
 * Get the tidal phase (rising/falling/slack) for a given block
 */
export function getTidePhase(blockHeight: number): TidePhase {
  const positionInCycle = blockHeight % BLOCKS_PER_LUNAR_CYCLE;
  const eventNumber = Math.floor(positionInCycle / BLOCKS_PER_TIDAL_EVENT);
  const blocksIntoEvent = positionInCycle % BLOCKS_PER_TIDAL_EVENT;
  const isHighTide = eventNumber % 2 === 0;

  // Slack water occurs at peaks and troughs
  if (
    blocksIntoEvent >= SLACK_WATER_START &&
    blocksIntoEvent <= SLACK_WATER_END
  ) {
    return isHighTide ? TidePhase.SLACK_HIGH : TidePhase.SLACK_LOW;
  }

  // Rising in first half, falling in second half
  if (blocksIntoEvent < SLACK_WATER_MIDPOINT) {
    return isHighTide ? TidePhase.RISING : TidePhase.FALLING;
  } else {
    return isHighTide ? TidePhase.FALLING : TidePhase.RISING;
  }
}

/**
 * Calculate blocks until the next tidal event
 */
export function getBlocksUntilNextTide(blockHeight: number): number {
  const positionInCycle = blockHeight % BLOCKS_PER_LUNAR_CYCLE;
  const blocksIntoEvent = positionInCycle % BLOCKS_PER_TIDAL_EVENT;
  return BLOCKS_PER_TIDAL_EVENT - blocksIntoEvent;
}

/**
 * Get the block height of the next tidal event
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
 * Get information about the full tidal cycle for a lunar month
 */
export function getTidalCycleInfo(blockHeight: number): TidalCycleInfo {
  const positionInCycle = blockHeight % BLOCKS_PER_LUNAR_CYCLE;
  const cycleStartBlock = blockHeight - positionInCycle;
  const cycleEndBlock = cycleStartBlock + BLOCKS_PER_LUNAR_CYCLE - 1;

  return {
    startBlock: cycleStartBlock,
    endBlock: cycleEndBlock,
    totalEvents: TIDAL_EVENTS_PER_CYCLE,
    highTides: COMPLETE_TIDAL_CYCLES,
    lowTides: COMPLETE_TIDAL_CYCLES,
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
 * Special handling for extreme values (+21/-21): simplified format
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

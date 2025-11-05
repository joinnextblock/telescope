import * as constants from "../constants";
/**
 * Delta is a class that represents a blockheight.
 * It is used to perform calculations based on blockheight.
 */
export class Delta {
  private blockheight: number;

  /**
   * @param input - The blockheight to create a Delta object from.
   * @throws {InvalidBlockheightError} If the blockheight is not an integer
   */
  constructor(blockheight?: number) {
    if (blockheight !== undefined) {
      if (!Number.isInteger(blockheight)) {
        throw new InvalidBlockheightError('Blockheight must be an integer');
      }
    }
    this.blockheight = blockheight ?? constants.GENESIS_BLOCK_HEIGHT;
  }

  get_blockheight(): number {
    return this.blockheight;
  }

  get_blockheight_from_date(date: Date): number {
    const milliseconds_difference = date.getTime() - constants.GENESIS_BLOCK_DATE.getTime();
    const minutes_difference = milliseconds_difference / (1000 * 60);
    const estimated_blockheight = Math.floor(minutes_difference / 10);
    return estimated_blockheight;
  }

  t(value: number | Delta): number {
    if (value instanceof Delta) {
      return this.blockheight - value.get_blockheight();
    } else {
      return this.blockheight - new Delta(value).get_blockheight();
    }
  }

  /**
   * Formats the blockheight into an astronomical date string.
   * Format: AG_{halving}_{season}_{moon}_{position_in_cycle} (using _ for hashtag support)
   * AG represents After Genesis, BG would represent Before Genesis
   * Uses underscores instead of pipes to make it a valid hashtag
   * Position in cycle is always 4 digits (padded with zeros)
   * Note: Services should add # prefix if they want to make it a hashtag
   * @param season_index - The solar season index (0-based)
   * @param cycle_index - The lunar cycle index (0-based)
   * @param position_in_cycle - The position within the lunar cycle (0-4032)
   * @returns Formatted astronomical date string
   */
  get_formatted_date(season_index: number, cycle_index: number, position_in_cycle: number): string {
    const halving = Math.floor(this.blockheight / constants.HALVING_BLOCK);
    const paddedPosition = String(position_in_cycle).padStart(4, '0');
    // All blocks are after genesis (AG), BG would be for negative block heights
    const era = this.blockheight >= 0 ? 'AG' : 'BG';
    return `${era}_${halving}_${season_index + 1}_${cycle_index + 1}_${paddedPosition}`;
  }

}

/**
 * delta is a factory function that creates a new Delta object.
 * @param blockheight - The blockheight to create a Delta object from.
 * @returns A new Delta object.
 */
export const create_delta = (blockheight?: number): Delta => {
  return new Delta(blockheight);
}

export class InvalidBlockheightError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBlockheightError';
  }
}

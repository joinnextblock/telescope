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

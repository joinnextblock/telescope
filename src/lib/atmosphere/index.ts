import { MAX_BLOCK_WEIGHT } from "../constants";

/**
 * Atmosphere is a class that represents a blockweight and transaction count.
 * It is used to perform calculations based on blockweight and transaction count.
 */
export class Atmosphere {
  private weight: number;
  private transaction_count: number;
  /**
   * @param weight - The weight of the atmosphere.
   * @param transaction_count - The transaction count of the atmosphere.
   */
  constructor(weight: number, transaction_count: number) {
    this.weight = weight;
    this.transaction_count = transaction_count;
  }

  get_weight(): number {
    return this.weight;
  }

  get_transaction_count(): number {
    return this.transaction_count;
  }

  get_conditions(): number {
    const utilization = this.weight / MAX_BLOCK_WEIGHT;
    const conditions = this.transaction_count / utilization;
    return Number(conditions.toFixed(2));
  }
}

/**
 * create_atmosphere is a factory function that creates a new Atmosphere object.
 * @param weight - The weight of the atmosphere.
 * @param transaction_count - The transaction count of the atmosphere.
 * @returns A new Atmosphere object.
 */
export const create_atmosphere = (weight: number, transaction_count: number): Atmosphere => {
  return new Atmosphere(weight, transaction_count);
}
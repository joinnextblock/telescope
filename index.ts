import { Atmosphere, create_atmosphere } from "./src/lib/atmosphere";
import { create_delta, Delta } from "./src/lib/delta";
import { create_lunar, Lunar } from "./src/lib/lunar";
import { create_solar, Solar } from "./src/lib/solar";
import { BITCOIN } from "./index.d";

export interface Telescope {
  delta: Delta;
  lunar: Lunar;
  solar: Solar;
  atmosphere: Atmosphere;
}

/**
 * create_telescope is a factory function that creates a new Telescope object.
 * @param block - The block to create a Telescope object from.
 * @returns A new Telescope object.
 */
export const create_telescope = (block: BITCOIN.Block): Telescope => {
  return {
    delta: create_delta(block.height),
    lunar: create_lunar(block.height),
    solar: create_solar(block.height),
    atmosphere: create_atmosphere(block.weight, block.tx_count),
  };
};

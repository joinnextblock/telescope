import { Atmosphere, create_atmosphere } from "./src/lib/atmosphere";
import { create_delta, Delta } from "./src/lib/delta";
import { create_lunar, Lunar } from "./src/lib/lunar";
import { create_solar, Solar } from "./src/lib/solar";
import { create_tidal, Tidal } from "./src/lib/tidal";
import { BITCOIN, NEXTBLOCK } from "./index.d";

// Re-export type namespaces for public API
export { BITCOIN, NEXTBLOCK };

export interface Telescope {
  delta: Delta;
  lunar: Lunar;
  solar: Solar;
  atmosphere: Atmosphere;
  tidal: Tidal;
  get_formatted_date(): string;
}

/**
 * create_telescope is a factory function that creates a new Telescope object.
 * @param block - The block to create a Telescope object from.
 * @returns A new Telescope object.
 */
export const create_telescope = (block: BITCOIN.Block): Telescope => {
  const delta = create_delta(block.height);
  const lunar = create_lunar(block.height);
  const solar = create_solar(block.height);
  const atmosphere = create_atmosphere(block.weight ?? 0, block.tx_count ?? 0);
  const tidal = create_tidal(block.height);

  return {
    delta,
    lunar,
    solar,
    atmosphere,
    tidal,
    get_formatted_date(): string {
      return delta.get_formatted_date(
        solar.get_season_index(),
        lunar.get_cycle_index(),
        lunar.get_position_in_cycle()
      );
    },
  };
};

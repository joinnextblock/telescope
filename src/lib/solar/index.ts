export * as constants from "./constants";

import { BLOCKS_IN_SOLAR_CYCLE, BLOCKS_IN_SOLAR_SEASON, SOLAR_SEASONS } from "./constants";
import { Delta } from "../delta";
import { GENESIS_BLOCK_HEIGHT } from "../constants";


export class Solar extends Delta {

  constructor(blockheight?: number) {
    super(blockheight ?? GENESIS_BLOCK_HEIGHT);
  }

  get_position_in_cycle(): number {
    return this.get_blockheight() % BLOCKS_IN_SOLAR_CYCLE;
  }

  get_season_index(): number {
    const solar_cycle_phase_index = Math.floor((this.get_position_in_cycle() * SOLAR_SEASONS.length) / BLOCKS_IN_SOLAR_CYCLE);
    return solar_cycle_phase_index;
  }

  get_next_season_index(): number {
    const solar_season_index = this.get_season_index();
    const next_solar_season_index = solar_season_index === SOLAR_SEASONS.length - 1 ? 0 : solar_season_index + 1;
    return next_solar_season_index;
  }

  get_season(): { name: string, emoji: string, suffix: string } {
    return SOLAR_SEASONS[this.get_season_index()];
  }

  get_next_season(): { name: string, emoji: string, suffix: string } {
    return SOLAR_SEASONS[this.get_next_season_index()];
  }

  get_blocks_until_next_season(): number {
    return BLOCKS_IN_SOLAR_SEASON - (this.get_position_in_cycle() % BLOCKS_IN_SOLAR_SEASON);
  }

  get_blocks_until_next_cycle(): number {
    return BLOCKS_IN_SOLAR_CYCLE - this.get_position_in_cycle();
  }

  get_season_block_height(): number {
    return this.get_blockheight() % BLOCKS_IN_SOLAR_SEASON;
  }

  get_cycle_block_height(): number {
    return this.get_blockheight() % BLOCKS_IN_SOLAR_CYCLE;
  }

  get_season_position(): number {
    return this.get_position_in_cycle() % BLOCKS_IN_SOLAR_SEASON;
  }
}

/**
 * create_solar is a factory function that creates a new Solar object.
 * @param blockheight - The blockheight to create a Solar object from.
 * @returns A new Solar object.
 */
export const create_solar = (blockheight?: number): Solar => {
  return new Solar(blockheight);
}

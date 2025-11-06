import { GENESIS_BLOCK_HEIGHT } from "../constants";
import {
  LUNAR_CYCLES,
  LUNAR_PHASES,
  BLOCKS_IN_LUNAR_PHASE,
  BLOCKS_IN_LUNAR_CYCLE,
  BLOCKS_IN_LUNAR_YEAR
} from "./constants";
import { Delta, InvalidBlockheightError } from "../delta";
import { NEXTBLOCK } from "../../../index.d";

export class Lunar extends Delta {

  constructor(blockheight?: number) {
    if (blockheight !== undefined) {
      if (!Number.isInteger(blockheight)) {
        throw new InvalidBlockheightError('Blockheight must be an integer');
      }
    } else {
      throw new InvalidBlockheightError('Blockheight must be an integer');
    }
    super(blockheight ?? GENESIS_BLOCK_HEIGHT);
  }

  get_position_in_year(): number {
    return this.get_blockheight() % BLOCKS_IN_LUNAR_YEAR;
  }
  get_position_in_cycle(): number {
    return this.get_blockheight() % BLOCKS_IN_LUNAR_CYCLE;
  }
  get_position_in_phase(): number {
    return this.get_blockheight() % BLOCKS_IN_LUNAR_PHASE;
  }

  // PHASE FUNCTIONS
  get_phase(): NEXTBLOCK.MODEL.LunarPhase {
    return LUNAR_PHASES[this.get_phase_index()];
  }

  get_next_phase(): NEXTBLOCK.MODEL.LunarPhase {
    return LUNAR_PHASES[this.get_next_phase_index()];
  }

  get_phase_index(): number {
    const lunar_phase_index = Math.floor((this.get_position_in_cycle() * LUNAR_PHASES.length) / BLOCKS_IN_LUNAR_CYCLE);
    return lunar_phase_index;
  }

  get_next_phase_index(): number {
    const lunar_phase_index = this.get_phase_index();
    return lunar_phase_index === LUNAR_PHASES.length - 1 ? 0 : lunar_phase_index + 1;
  }

  get_blocks_until_next_phase(): number {
    return BLOCKS_IN_LUNAR_PHASE - (this.get_position_in_cycle() % BLOCKS_IN_LUNAR_PHASE);
  }


  get_phase_block_height(): number {
    return this.get_blockheight() % BLOCKS_IN_LUNAR_PHASE;
  }

  // CYCLE FUNCTIONS
  get_cycle_index(): number {
    const lunar_cycle_index = Math.floor((this.get_position_in_year() / BLOCKS_IN_LUNAR_CYCLE));
    return lunar_cycle_index;
  }

  get_blocks_until_next_cycle(): number {
    return BLOCKS_IN_LUNAR_CYCLE - this.get_position_in_cycle();
  }

  get_cycle_block_height(): number {
    return this.get_blockheight() % BLOCKS_IN_LUNAR_CYCLE;
  }

  get_next_cycle_index(): number {
    const lunar_cycle_index = Math.floor((this.get_position_in_year() / BLOCKS_IN_LUNAR_CYCLE));
    return lunar_cycle_index === LUNAR_CYCLES.length - 1 ? 0 : lunar_cycle_index + 1;
  }

  get_cycle(): NEXTBLOCK.MODEL.LunarCycle {
    return LUNAR_CYCLES[this.get_cycle_index()];
  }

  get_next_cycle(): NEXTBLOCK.MODEL.LunarCycle {
    return LUNAR_CYCLES[this.get_next_cycle_index()];
  }
}

/**
 * delta is a factory function that creates a new Delta object.
 * @param blockheight - The blockheight to create a Delta object from.
 * @returns A new Delta object.
 */
export const create_lunar = (blockheight?: number): Lunar => {
  return new Lunar(blockheight);
}

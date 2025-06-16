export declare namespace BITCOIN {
  export interface Block {
    id: string;
    height: number;
    version: number;
    timestamp: number;
    tx_count: number;
    size: number;
    weight: number;
    merkle_root: string;
    previousblockhash: string;
    mediantime: number;
    nonce: number;
    bits: number;
    difficulty: number;
  }
}

export declare namespace NEXTBLOCK {
  export namespace MODEL {
    interface LunarCycle {
      name: string;
      emoji: string;
    }
    interface LunarPhase {
      name: string;
      emoji: string;
    }
    interface SolarPhase {
      name: string;
      emoji: string;
      suffix: string;
    }
    interface Observation {
      blocks_until_next_phase: number;
      blocks_until_next_cycle: number;
      phase_block_height: number;
      cycle_block_height: number;
    }
    interface LunarObservations extends Observation {
      current_phase: LunarPhase;
      current_cycle: LunarCycle;
      next_phase: LunarPhase;
      next_cycle: LunarCycle;
    }
    interface SolarObservations extends Observation {
      current_phase: SolarPhase;
      next_phase: SolarPhase;
    }
    interface Observations {
      lunar_observations: LunarObservations;
      solar_observations: SolarObservations;
    }
  }
}

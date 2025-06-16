# Solar Module

A TypeScript module for calculating solar seasons and cycles based on Bitcoin blockheight.

## Overview

The Solar module extends the Delta class to provide functionality for tracking and calculating solar seasons and cycles based on Bitcoin blockheight. It uses the Bitcoin halving period (210,000 blocks) as a base unit for calculations.

## Features

- Calculate current solar season and position
- Track solar cycles (4 seasons)
- Calculate blocks until next season or cycle
- Get current and next season indices
- Emoji support for seasons

## Usage

```typescript
import { solar } from '@joinnextblock/delta';

// Create a new Solar instance with a blockheight
const solarInstance = solar(100000);

// Get current season information
const seasonIndex = solarInstance.get_cycle_phase_index();
const nextSeasonIndex = solarInstance.get_next_cycle_phase_index();
const blocksUntilNextSeason = solarInstance.get_blocks_until_next_phase();
const seasonBlockHeight = solarInstance.get_phase_block_height(); // Returns 0-52499

// Get cycle information
const blocksUntilNextCycle = solarInstance.get_blocks_until_next_cycle();
const cycleBlockHeight = solarInstance.get_cycle_block_height();
const position = solarInstance.get_position_in_cycle();
const seasonalPosition = solarInstance.get_seasonal_position();
```

## Solar Seasons

The module tracks 4 solar seasons, each lasting 52,500 blocks (210,000/4):
- 🌱 Spring Equinox (0-52499 blocks)
- 🌞 Summer Solstice (52500-104999 blocks)
- 🍂 Autumn Equinox (105000-157499 blocks)
- ❄️ Winter Solstice (157500-209999 blocks)

## API Reference

### Constructor

```typescript
solar(blockheight?: number): Solar
```

Creates a new Solar instance.
- `blockheight` (optional): A non-negative integer representing the Bitcoin blockheight
- Returns: A new Solar instance

### Season Functions

- `get_cycle_phase_index(): number` - Returns the current season index (0-3)
- `get_next_cycle_phase_index(): number` - Returns the next season index
- `get_blocks_until_next_phase(): number` - Returns blocks until the next season (0-52500)
- `get_phase_block_height(): number` - Returns the block height within the current season (0-52499)
- `get_seasonal_position(): number` - Returns the position within the current season (0-52499)

### Cycle Functions

- `get_blocks_until_next_cycle(): number` - Returns blocks until the next cycle
- `get_cycle_block_height(): number` - Returns the block height within the current cycle
- `get_position_in_cycle(): number` - Returns the position within the current cycle

## Constants

- `BLOCKS_IN_SOLAR_SEASON`: Number of blocks in a solar season (52,500 blocks)
- `BLOCKS_IN_SOLAR_CYCLE`: Number of blocks in a solar cycle (210,000 blocks)
- `SOLAR_SEASONS`: Array of solar season objects with names, emojis, and suffixes

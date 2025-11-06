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
import { create_telescope } from '@joinnextblock/telescope';

// Create a Telescope instance from a Bitcoin block
const block = { height: 100000, difficulty: 1 };
const telescope = create_telescope(block);
const solarInstance = telescope.solar;

// Get current season information
const season = solarInstance.get_season(); // Returns { name: string, emoji: string, suffix: string }
const nextSeason = solarInstance.get_next_season();
const seasonIndex = solarInstance.get_season_index();
const nextSeasonIndex = solarInstance.get_next_season_index();
const blocksUntilNextSeason = solarInstance.get_blocks_until_next_season();
const seasonBlockHeight = solarInstance.get_season_block_height(); // Returns 0-52499

// Get cycle information
const blocksUntilNextCycle = solarInstance.get_blocks_until_next_cycle();
const cycleBlockHeight = solarInstance.get_cycle_block_height();
const position = solarInstance.get_position_in_cycle();
const seasonalPosition = solarInstance.get_season_position();
```

## Solar Seasons

The module tracks 4 solar seasons, each lasting 52,500 blocks (210,000/4):
- 🌱 Spring Equinox (0-52499 blocks)
- 🌞 Summer Solstice (52500-104999 blocks)
- 🍂 Autumn Equinox (105000-157499 blocks)
- ❄️ Winter Solstice (157500-209999 blocks)

## API Reference

### Accessing Solar Module

The Solar module is accessed through a Telescope instance:

```typescript
import { create_telescope } from '@joinnextblock/telescope';

const block = { height: 100000, difficulty: 1 };
const telescope = create_telescope(block);
const solar = telescope.solar;
```

### Season Functions

- `get_season(): { name: string, emoji: string, suffix: string }` - Returns the current season object
- `get_next_season(): { name: string, emoji: string, suffix: string }` - Returns the next season object
- `get_season_index(): number` - Returns the current season index (0-3)
- `get_next_season_index(): number` - Returns the next season index
- `get_blocks_until_next_season(): number` - Returns blocks until the next season (1-52500)
- `get_season_block_height(): number` - Returns the block height within the current season (0-52499)
- `get_season_position(): number` - Returns the position within the current season (0-52499)

### Cycle Functions

- `get_blocks_until_next_cycle(): number` - Returns blocks until the next cycle
- `get_cycle_block_height(): number` - Returns the block height within the current cycle (0-209999)
- `get_position_in_cycle(): number` - Returns the position within the current cycle (0-209999)

## Constants

- `BLOCKS_IN_SOLAR_SEASON`: Number of blocks in a solar season (52,500 blocks)
- `BLOCKS_IN_SOLAR_CYCLE`: Number of blocks in a solar cycle (210,000 blocks)
- `SOLAR_SEASONS`: Array of solar season objects with names, emojis, and suffixes

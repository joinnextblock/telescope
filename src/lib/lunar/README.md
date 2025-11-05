# Lunar Module

A TypeScript module for calculating lunar phases and cycles based on Bitcoin blockheight.

## Overview

The Lunar module extends the Delta class to provide functionality for tracking and calculating lunar phases and cycles based on Bitcoin blockheight. It uses the Bitcoin difficulty adjustment period (2016 blocks) as a base unit for calculations.

## Features

- Calculate current lunar phase and position
- Track lunar cycles (13 named moons)
- Calculate blocks until next phase or cycle
- Get current and next phase/cycle indices
- Emoji support for phases and cycles

## Usage

```typescript
import { create_telescope } from '@joinnextblock/telescope';

// Create a Telescope instance from a Bitcoin block
const block = { height: 100000, difficulty: 1 };
const telescope = create_telescope(block);
const lunarInstance = telescope.lunar;

// Get current phase information
const phase = lunarInstance.get_phase(); // Returns { name: string, emoji: string }
const nextPhase = lunarInstance.get_next_phase();
const phaseIndex = lunarInstance.get_phase_index();
const nextPhaseIndex = lunarInstance.get_next_phase_index();
const blocksUntilNextPhase = lunarInstance.get_blocks_until_next_phase();
const phaseBlockHeight = lunarInstance.get_phase_block_height(); // Returns 0-503

// Get cycle information
const cycle = lunarInstance.get_cycle(); // Returns { name: string, emoji: string }
const nextCycle = lunarInstance.get_next_cycle();
const cycleIndex = lunarInstance.get_cycle_index();
const nextCycleIndex = lunarInstance.get_next_cycle_index();
const blocksUntilNextCycle = lunarInstance.get_blocks_until_next_cycle();
const cycleBlockHeight = lunarInstance.get_cycle_block_height();
const position = lunarInstance.get_position_in_cycle();
const positionInYear = lunarInstance.get_position_in_year();
```

## Lunar Phases

The module tracks 8 lunar phases, each lasting 504 blocks (2016/4):
- 🌕 Full Moon (0-503 blocks)
- 🌖 Waning Gibbous (504-1007 blocks)
- 🌗 Last Quarter (1008-1511 blocks)
- 🌘 Waning Crescent (1512-2015 blocks)
- 🌑 New Moon (2016-2519 blocks)
- 🌒 Waxing Crescent (2520-3023 blocks)
- 🌓 First Quarter (3024-3527 blocks)
- 🌔 Waxing Gibbous (3528-4031 blocks)

## Lunar Cycles

The module tracks 13 named moons:
- 🍊 Orange Moon
- 🪶 Bird Moon
- 🫂 Friend Moon
- 🐳 Whale Moon
- 🐂 Bull Moon
- 🐻 Bear Moon
- 🌽 Corn Moon
- ⚡ Lightning Moon
- 🥜 Squirrel Moon
- 🌊 Wave Moon
- 🧊 Ice Moon
- 💎 Diamond Moon
- ₿ Satoshi's Moon

## API Reference

### Accessing Lunar Module

The Lunar module is accessed through a Telescope instance:

```typescript
import { create_telescope } from '@joinnextblock/telescope';

const block = { height: 100000, difficulty: 1 };
const telescope = create_telescope(block);
const lunar = telescope.lunar;
```

### Phase Functions

- `get_phase(): NEXTBLOCK.MODEL.LunarPhase` - Returns the current lunar phase object with `name` and `emoji`
- `get_next_phase(): NEXTBLOCK.MODEL.LunarPhase` - Returns the next lunar phase object
- `get_phase_index(): number` - Returns the current lunar phase index (0-7)
- `get_next_phase_index(): number` - Returns the next lunar phase index
- `get_blocks_until_next_phase(): number` - Returns blocks until the next phase (1-504)
- `get_phase_block_height(): number` - Returns the block height within the current phase (0-503)
- `get_position_in_phase(): number` - Returns the position within the current phase (0-503)

### Cycle Functions

- `get_cycle(): NEXTBLOCK.MODEL.LunarCycle` - Returns the current lunar cycle object with `name` and `emoji`
- `get_next_cycle(): NEXTBLOCK.MODEL.LunarCycle` - Returns the next lunar cycle object
- `get_cycle_index(): number` - Returns the current lunar cycle index (0-12)
- `get_next_cycle_index(): number` - Returns the next lunar cycle index
- `get_blocks_until_next_cycle(): number` - Returns blocks until the next cycle
- `get_cycle_block_height(): number` - Returns the block height within the current cycle (0-4031)
- `get_position_in_cycle(): number` - Returns the position within the current cycle (0-4031)
- `get_position_in_year(): number` - Returns the position within the current lunar year

## Constants

- `BLOCKS_IN_LUNAR_PHASE`: Number of blocks in a lunar phase (504 blocks = 2016/4)
- `BLOCKS_IN_LUNAR_CYCLE`: Number of blocks in a lunar cycle (4032 blocks = 2016*2)
- `BLOCKS_IN_LUNAR_YEAR`: Number of blocks in a lunar year (52416 blocks = 4032*13)
- `LUNAR_PHASES`: Array of 8 lunar phase objects with names and emojis
- `LUNAR_CYCLES`: Array of 13 lunar cycle objects with names and emojis

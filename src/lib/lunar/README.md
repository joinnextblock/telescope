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
import { lunar } from '@joinnextblock/delta';

// Create a new Lunar instance with a blockheight
const lunarInstance = lunar(100000);

// Get current phase information
const phaseIndex = lunarInstance.get_phase_index();
const nextPhaseIndex = lunarInstance.get_next_phase_index();
const blocksUntilNextPhase = lunarInstance.get_blocks_until_next_phase();
const phaseBlockHeight = lunarInstance.get_phase_block_height(); // Returns 0-504

// Get cycle information
const cycleIndex = lunarInstance.get_cycle_index();
const nextCycleIndex = lunarInstance.get_next_cycle_index();
const blocksUntilNextCycle = lunarInstance.get_blocks_until_next_cycle();
const cycleBlockHeight = lunarInstance.get_cycle_block_height();
const position = lunarInstance.get_position_in_cycle();
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
- 🐺 Wolf Moon
- ❄️ Snow Moon
- 🪱 Worm Moon
- 🌸 Pink Moon
- 🌺 Flower Moon
- 🍓 Strawberry Moon
- 🦌 Buck Moon
- 🐟 Sturgeon Moon
- 🌾 Harvest Moon
- ₿ Satoshi's Moon
- 🦫 Beaver Moon
- ❄️ Cold Moon
- 🔵 Blue Moon

## API Reference

### Constructor

```typescript
lunar(blockheight: number): Lunar
```

Creates a new Lunar instance.
- `blockheight`: A non-negative integer representing the Bitcoin blockheight
- Returns: A new Lunar instance
- Throws: `InvalidBlockheightError` if the blockheight is not provided or is not an integer

### Phase Functions

- `get_phase_index(): number` - Returns the current lunar phase index (0-7)
- `get_next_phase_index(): number` - Returns the next lunar phase index
- `get_blocks_until_next_phase(): number` - Returns blocks until the next phase (0-504)
- `get_phase_block_height(): number` - Returns the block height within the current phase (0-504)

### Cycle Functions

- `get_cycle_index(): number` - Returns the current lunar cycle index (0-12)
- `get_next_cycle_index(): number` - Returns the next lunar cycle index
- `get_blocks_until_next_cycle(): number` - Returns blocks until the next cycle
- `get_cycle_block_height(): number` - Returns the block height within the current cycle
- `get_position_in_cycle(): number` - Returns the position within the current cycle

## Constants

- `BLOCKS_IN_LUNAR_PHASE`: Number of blocks in a lunar phase (504 blocks)
- `BLOCKS_IN_LUNAR_PERIOD`: Number of blocks in a lunar period (2016 blocks)
- `LUNAR_PHASES`: Array of lunar phase objects with names and emojis
- `LUNAR_CYCLES`: Array of lunar cycle objects with names and emojis

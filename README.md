[![Test](https://github.com/joinnextblock/telescope/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/joinnextblock/telescope/actions/workflows/test.yml)

# Telescope

A TypeScript library for tracking astronomical cycles based on Bitcoin blockheight.

## Overview

Telescope is a library that provides functionality for working with Bitcoin blockheights and time. It offers a simple and type-safe way to create and manipulate blockheight values, including calculations and date-based estimations. The library maps Bitcoin's blockchain to astronomical cycles, creating a deterministic calendar synchronized with Bitcoin's block production.

The library requires a `BITCOIN.Block` object containing at minimum a `height` property. The `weight` and `tx_count` properties are optional but recommended for full functionality.

## Installation

```bash
# Using Bun (recommended)
bun add @joinnextblock/telescope

# Using npm
npm install @joinnextblock/telescope
```

## Quick Start

```typescript
import { create_telescope } from '@joinnextblock/telescope';
import { BITCOIN } from '@joinnextblock/telescope';

// Create a Telescope instance from a Bitcoin block
const block: BITCOIN.Block = {
  height: 901152,
  difficulty: 126411437451912.23,
  weight: 3997853,
  tx_count: 2330,
  // ... other block properties
};

const telescope = create_telescope(block);

// Get formatted astronomical date
const date = telescope.get_formatted_date(); // "AG_4_1_1_0000"

// Access individual modules
const blockHeight = telescope.delta.get_blockheight();
const currentPhase = telescope.lunar.get_phase();
const currentSeason = telescope.solar.get_season();
const tideType = telescope.tidal.get_tide_type();
const conditions = telescope.atmosphere.get_conditions();
```

## Observatory Service Integration

Telescope powers the [Observatory](http://observatory.nextblock.city) service, which tracks astronomical cycles for every new Bitcoin block. The library provides the astronomical context for each block, allowing the Observatory to:

1. Track the current lunar phase and cycle for each block
2. Monitor solar seasons and their transitions
3. Calculate precise block-based timing for astronomical events
4. Maintain a consistent astronomical calendar synchronized with Bitcoin's blockchain
5. Monitor block weight and transaction metrics

### Block-by-Block Tracking

The Observatory service uses Telescope to:

- Calculate the exact lunar phase for each new block
- Determine the current solar season
- Track transitions between phases and seasons
- Record astronomical events with precise block heights
- Maintain a historical record of astronomical events in Bitcoin time
- Monitor block utilization and transaction conditions

## Modules

### Delta Module
The Delta module provides basic blockheight calculations and date-based estimations. It includes:
- Block height calculations
- Date to block height conversions (estimates based on 10-minute block intervals)
- Time difference calculations between blocks using the `t()` method
- Formatted astronomical date generation (AG/BG format with halving, season, cycle, and position)

### Lunar Module
The Lunar module tracks and calculates lunar phases and cycles based on Bitcoin blockheight. Features include:
- Current moon phase tracking
- Next phase predictions
- Lunar cycle calculations
- Blocks until next phase/cycle

### Solar Module
The Solar module tracks and calculates solar seasons and cycles based on Bitcoin blockheight. Features include:
- Current season tracking
- Next season predictions
- Solar cycle calculations
- Blocks until next season/cycle

### Atmosphere Module
The Atmosphere module monitors block metrics and conditions. Features include:
- Block weight tracking
- Transaction count monitoring
- Block utilization calculations
- Condition metrics based on weight and transactions

### Tidal Module
The Tidal module tracks and calculates tidal cycles based on Bitcoin blockheight. Features include:
- Current tide type (high/low) tracking
- Tide height calculations using linear mapping (-18 to +18 blocks)
- Tidal phase detection (rising/falling/slack_high/slack_low)
- Blocks until next high/low point
- Spring and neap tide detection aligned with moon phases
- Complete tidal cycle information and state
- Human-readable descriptions and emoji representations
- Formatted tide display strings with special handling for extreme values (+18/-18)

#### Tidal System

The tidal system uses a continuous 72-block cycle that repeats indefinitely. The system starts at high tide (+18 at block 0), decreases to low tide (-18 at block 36), then increases back to high tide (+18 at block 72), creating two high tides per cycle.

This creates a natural rhythm where each 72-block cycle (~12 hours at 10-minute block intervals) contains two high tides and one low tide, giving the system a predictable pattern that repeats continuously.

##### Tidal Calculations

The tidal system uses a simple linear mapping to represent block height in tidal form - it's a deterministic representation, not a physical simulation.

- **First 36 blocks**: Linear decrease from +18 blocks (block 0) to -18 blocks (block 36)
- **Next 36 blocks**: Linear increase from -18 blocks (block 37) to +18 blocks (block 72, then repeats)
- **Slack water**: Occurs at blocks 18-27 (slack high) and blocks 45-54 (slack low)

**API Methods:**
- Current tide type: `getTideType(blockHeight)` or `tidal.get_tide_type()`
- Tide height (-18 to +18 blocks): `getTideHeight(blockHeight)` or `tidal.get_tide_height()`
- Tide phase: `getTidePhase(blockHeight)` or `tidal.get_tide_phase()`
- Complete tidal state: `getTidalState(blockHeight)` or `tidal.get_tidal_state()`
- Blocks until next tide: `getBlocksUntilNextTide(blockHeight)` or `tidal.get_blocks_until_next_tide()`
- Tide display string: `getTideDisplay(blockHeight)` or `tidal.get_tide_display()` - Returns formatted display with simplified format for +18/-18 extremes
- Special conditions: Spring tides align with new/full moons, neap tides with quarter moons

## Development

### Prerequisites

- Node.js (v20.11.1 LTS or higher) or Bun (v1.0.0 or higher)
- npm (v10.2.4 or higher) if not using Bun

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Using Bun (recommended)
   bun install

   # Using npm
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Run tests:
   ```bash
   npm test
   ```

## API Reference

### `create_telescope(block: BITCOIN.Block): Telescope`

Factory function that creates a new Telescope instance from a Bitcoin block object.

**Parameters:**
- `block`: A `BITCOIN.Block` object with at minimum:
  - `height` (required): The block height number
  - `difficulty` (required): The block difficulty
  - `weight` (optional): Block weight for atmosphere calculations
  - `tx_count` (optional): Transaction count for atmosphere calculations

**Returns:** A `Telescope` object with the following modules:
- `delta`: Delta module for blockheight calculations
- `lunar`: Lunar module for moon phase and cycle tracking
- `solar`: Solar module for season tracking
- `atmosphere`: Atmosphere module for block metrics
- `tidal`: Tidal module for tidal calculations
- `get_formatted_date()`: Returns formatted astronomical date string

**Example:**
```typescript
import { create_telescope, BITCOIN } from '@joinnextblock/telescope';

const block: BITCOIN.Block = {
  height: 901152,
  difficulty: 126411437451912.23,
  weight: 3997853,
  tx_count: 2330,
};

const telescope = create_telescope(block);
```


## Project Status

Telescope is an open-source project maintained by NextBlock for company use. While the code is publicly available and we welcome contributions through pull requests, the project is primarily developed to serve NextBlock's needs. For more information about contributing, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT


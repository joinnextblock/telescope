# Tidal Module

The Tidal module provides deterministic tidal calculations based on Bitcoin block height. The tidal system integrates with the existing lunar cycle (4,032 blocks) to create a finer temporal resolution.

## Core Tidal Mathematics

### Constants

- `BLOCKS_PER_LUNAR_CYCLE`: 4032 blocks
- `TIDAL_EVENTS_PER_CYCLE`: 42 (21 high tides + 21 low tides)
- `BLOCKS_PER_TIDAL_EVENT`: 96 blocks (4032 / 42)
- `COMPLETE_TIDAL_CYCLES`: 21 (21 high-low pairs)
- `BLOCKS_PER_COMPLETE_CYCLE`: 192 blocks (96 * 2)

### Mathematical Relationships

- **Tidal event number (0-41):** `Math.floor((blockHeight % BLOCKS_PER_LUNAR_CYCLE) / BLOCKS_PER_TIDAL_EVENT)`
- **Position within tidal event (0-95):** `blockHeight % BLOCKS_PER_TIDAL_EVENT`
- **Tide type:** Even event numbers = high tide, odd = low tide
- **Complete cycle number (0-20):** `Math.floor(tidalEventNumber / 2)`
- **Tide height (linear mapping):** High tides decrease linearly from +21 to 0, low tides decrease linearly from 0 to -21

## Types

### TideType
```typescript
enum TideType {
  HIGH = 'high',
  LOW = 'low'
}
```

### TidePhase
```typescript
enum TidePhase {
  RISING = 'rising',
  FALLING = 'falling',
  SLACK_HIGH = 'slack_high',  // Peak of high tide
  SLACK_LOW = 'slack_low'     // Bottom of low tide
}
```

### TidalState
Complete tidal state for a given block height, including position tracking, tide characteristics, timing, and special conditions.

### TidalCycleInfo
Information about a complete tidal cycle within a lunar month.

## Usage

### Class-based API

```typescript
import { create_telescope } from '@joinnextblock/telescope';

// Create a Telescope instance from a Bitcoin block
const block = { height: 100000, difficulty: 1 };
const telescope = create_telescope(block);
const tidal = telescope.tidal;

// Get complete tidal state
const state = tidal.get_tidal_state();

// Get individual properties
const tideType = tidal.get_tide_type();
const tideHeight = tidal.get_tide_height();
const tidePhase = tidal.get_tide_phase();
const blocksUntilNext = tidal.get_blocks_until_next_tide();
const isSpring = tidal.is_spring_tide();
const isNeap = tidal.is_neap_tide();
const description = tidal.get_tide_description();
const emoji = tidal.get_tide_emoji();
```

### Standalone Functions

```typescript
import {
  getTideType,
  getTideHeight,
  getTidePhase,
  getBlocksUntilNextTide,
  getNextTideBlock,
  getTidalState,
  getTidalCycleInfo,
  isSpringTide,
  isNeapTide,
  getTideDescription,
  getTideEmoji
} from '@joinnextblock/telescope';

const blockHeight = 100000;
const tideType = getTideType(blockHeight);
const height = getTideHeight(blockHeight);
const phase = getTidePhase(blockHeight);
```

## Tide Height Calculation

Tide heights use a simple linear mapping of block position within each event:
- **High tides**: Linear decrease from +21 blocks (start of event, block 0) to 0 blocks (end of event, block 95)
- **Low tides**: Linear decrease from 0 blocks (start of event, block 0) to -21 blocks (end of event, block 95)

The calculation is:
- High tide: `MAX_HIGH_TIDE * (1 - blocksIntoEvent / BLOCKS_PER_TIDAL_EVENT)`
- Low tide: `MAX_LOW_TIDE * (blocksIntoEvent / BLOCKS_PER_TIDAL_EVENT)`

This is a simple representation of block height in tidal form, not a physical simulation.

## Spring and Neap Tides

- **Spring tides** occur during new and full moon phases (highest/lowest tides)
- **Neap tides** occur during first quarter and last quarter moon phases (moderate tides)

## Phase Detection

Tide phases are determined by position within the event:
- **Rising**: First half of event (blocks 0-47 for high tide)
- **Slack**: Peak/trough window (blocks 44-52)
- **Falling**: Second half of event (blocks 53-95 for high tide)

## Integration with Observatory

The tidal system works alongside existing moon phase calculations and is included in the Telescope interface, providing deterministic calculations requiring only block height as input.


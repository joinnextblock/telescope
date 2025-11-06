# Tidal Module

The Tidal module provides deterministic tidal calculations based on Bitcoin block height. The system uses a continuous 72-block cycle that repeats indefinitely, creating a simple and predictable tidal rhythm.

## Core Tidal Mathematics

### Constants

- `BLOCKS_PER_LUNAR_CYCLE`: 4032 blocks (for reference)
- `TIDAL_HEIGHT_CYCLE_LENGTH`: 72 blocks (continuous cycle)
- `MAX_HIGH_TIDE`: +18 blocks
- `MAX_LOW_TIDE`: -18 blocks

### Mathematical Relationships

- **Position in cycle (0-71):** `blockHeight % TIDAL_HEIGHT_CYCLE_LENGTH`
- **Tide height:** Determined by position in 72-block cycle
  - Blocks 0-36: Decreases from +18 to -18
  - Blocks 37-72: Increases from -18 to +18
- **Tide type:** Determined by height (positive = HIGH, negative = LOW)
- **System starts at high tide:** Block 0 = +18

### Height Calculation Pattern

The system uses a simple linear pattern:
- **Block 0**: +18 (high tide, system start)
- **Block 18**: 0 (transition point)
- **Block 36**: -18 (low tide)
- **Block 54**: 0 (transition point)
- **Block 72**: +18 (high tide, cycle repeats)

Each block changes by exactly 1 block value, creating a smooth transition.

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
Information about the current 72-block tidal height cycle.

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
const display = tidal.get_tide_display(); // Formatted display string
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
  getTideEmoji,
  getTideDisplay
} from '@joinnextblock/telescope';

const blockHeight = 100000;
const tideType = getTideType(blockHeight);
const height = getTideHeight(blockHeight);
const phase = getTidePhase(blockHeight);
const display = getTideDisplay(blockHeight); // Formatted display string
```

## Tide Height Calculation

Tide heights use a simple linear mapping based on position in the 72-block cycle:
- **First 36 blocks**: Linear decrease from +18 to -18
  - Block 0 = +18, Block 18 = 0, Block 36 = -18
- **Next 36 blocks**: Linear increase from -18 to +18
  - Block 37 = -17, Block 54 = 0, Block 72 = +18 (repeats)

The calculation is:
- If `positionInCycle <= 36`: `MAX_HIGH_TIDE - positionInCycle`
- If `positionInCycle > 36`: `MAX_LOW_TIDE + (positionInCycle - 36)`

This creates a continuous cycle with two high tides per 72-block period (at blocks 0 and 72) and one low tide (at block 36).

## Spring and Neap Tides

- **Spring tides** occur during new and full moon phases (highest/lowest tides)
- **Neap tides** occur during first quarter and last quarter moon phases (moderate tides)

These are determined by the lunar phase, not by the tidal height cycle itself.

## Phase Detection

Tide phases are determined by position in the 72-block cycle:
- **Rising**: Blocks 0-17 (high tide rising) or blocks 54-72 (low to high transition)
- **Slack High**: Blocks 18-27 (peak of high tide)
- **Falling**: Blocks 27-45 (high to low transition)
- **Slack Low**: Blocks 45-54 (trough of low tide)

## Tide Display Formatting

The `get_tide_display()` method (and standalone `getTideDisplay()`) returns a formatted string representation of the current tide state. For extreme tide values, it provides a simplified format:

### Simplified Format (Extreme Values)

- **+18 (Maximum High Tide)**: `"🌊 High Tide (+18)"`
- **-18 (Maximum Low Tide)**: `"🏖️ Low Tide (-18)"`

These simplified formats are used when the tide height is exactly at the maximum or minimum values.

### Slack Tide Format

- **+17 (Slack High Tide)**: `"🌊 Slack Tide (+17)"`
- **-17 (Slack Low Tide)**: `"🏖️ Slack Tide (-17)"`

### Full Format (All Other Values)

For all other tide heights, the format includes:
- Emoji representation (🌊⬆️, 🌊⬇️, 🌊, 🏖️⬆️, 🏖️⬇️, 🏖️)
- Tide type and phase description
- Tide height in blocks with sign

Example: `"🌊⬆️ Tide: high tide rising (spring tide) (+15 blocks)"`

### Usage Examples

```typescript
// At maximum high tide (block 0, 72, 144, etc.)
const displayHigh = getTideDisplay(0);
// Returns: "🌊 High Tide (+18)"

// At maximum low tide (block 36, 108, 180, etc.)
const displayLow = getTideDisplay(36);
// Returns: "🏖️ Low Tide (-18)"

// At slack high tide (block 1, 73, 145, etc.)
const displaySlackHigh = getTideDisplay(1);
// Returns: "🌊 Slack Tide (+17)"

// At intermediate tide height
const displayMid = getTideDisplay(18);
// Returns: "🌊⬆️ Tide: high tide rising (0 blocks)" or similar

// Using class instance
const tidal = create_tidal(0);
const display = tidal.get_tide_display();
// Returns: "🌊 High Tide (+18)"
```

## Integration with Observatory

The tidal system works alongside existing moon phase calculations and is included in the Telescope interface, providing deterministic calculations requiring only block height as input. The formatted display strings are particularly useful for user-facing interfaces and event publishing.

The continuous 72-block cycle creates a natural rhythm with two high tides per cycle, giving the system a predictable pattern that repeats every 72 blocks (~12 hours at 10-minute block intervals).

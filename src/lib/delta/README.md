# Delta Library

The Delta library provides functionality for working with block heights in a blockchain system. It allows for creating, comparing, and calculating differences between block heights, as well as estimating block heights from dates.

## Usage

```typescript
import { create_telescope, BITCOIN } from '@joinnextblock/telescope';

// Create a Telescope instance from a Bitcoin block
const block: BITCOIN.Block = {
  height: 901152,
  difficulty: 126411437451912.23,
};

const telescope = create_telescope(block);

// Get the current block height
const blockHeight = telescope.delta.get_blockheight();

// Calculate the difference between two block heights
const difference = telescope.delta.t(500); // Returns difference between current and block 500

// Compare with another block height
const anotherBlock: BITCOIN.Block = { height: 1000, difficulty: 1 };
const anotherTelescope = create_telescope(anotherBlock);
const difference2 = telescope.delta.t(anotherTelescope.delta); // Returns difference between two Delta instances

// Estimate block height from a date (based on 10-minute block intervals)
const date = new Date('2024-01-01');
const estimatedBlockHeight = telescope.delta.get_blockheight_from_date(date);

// Get formatted astronomical date
const formattedDate = telescope.get_formatted_date(); // "AG_4_1_1_0000"
```

## API Reference

### Accessing Delta Module

The Delta module is accessed through a Telescope instance:

```typescript
import { create_telescope, BITCOIN } from '@joinnextblock/telescope';

const block: BITCOIN.Block = { height: 901152, difficulty: 1 };
const telescope = create_telescope(block);
const delta = telescope.delta;
```

### `create_delta(blockheight?: number): Delta`

Factory function that creates a new Delta instance directly (for standalone use).

- `blockheight` (optional): The block height to initialize the Delta with. If not provided, uses the genesis block height (0).

### `Delta` Class

#### Constructor

```typescript
new Delta(blockheight?: number)
```

Creates a new Delta instance.

- `blockheight` (optional): The block height to initialize with. If not provided, uses the genesis block height (0).
- Throws `InvalidBlockheightError` if the block height is not an integer.

#### Methods

- `get_blockheight(): number`
  Returns the current block height.

- `get_blockheight_from_date(date: Date): number`
  Estimates the block height for a given date based on the genesis block date (2009-01-03T18:15:05Z).
  - `date`: The date to estimate the block height for.
  - Calculation: Assumes 10-minute block intervals (600,000ms per block)
  - Returns: Estimated block height as an integer

- `get_formatted_date(season_index: number, cycle_index: number, position_in_cycle: number): string`
  Formats the blockheight into an astronomical date string.
  - Format: `AG_{halving}_{season}_{moon}_{position_in_cycle}` (using underscores for hashtag support)
  - `season_index`: The solar season index (0-based)
  - `cycle_index`: The lunar cycle index (0-based)
  - `position_in_cycle`: The position within the lunar cycle (0-4032), will be padded to 4 digits
  - Returns: Formatted string like "AG_4_1_1_0000"
  - Note: Services should add # prefix if they want to make it a hashtag

- `t(value: number | Delta): number`
  Calculates the difference between the current block height and another block height.
  - `value`: Either a number representing a block height or another Delta instance.
  - Returns: The difference in block heights (current - value).
  - Example: If current is 1000 and value is 500, returns 500.
  - Example: If current is 1000 and value is 1500, returns -500.

### `InvalidBlockheightError`

Custom error class thrown when an invalid block height is provided.

## Error Handling

The library throws `InvalidBlockheightError` in the following cases:
- When a non-integer block height is provided
- When an invalid value is passed to the `t()` method

```typescript
import { create_telescope, BITCOIN } from '@joinnextblock/telescope';
import { InvalidBlockheightError } from '@joinnextblock/telescope/src/lib/delta';

try {
  const block: BITCOIN.Block = { height: 100.5, difficulty: 1 };
  const telescope = create_telescope(block); // Throws InvalidBlockheightError
} catch (error) {
  if (error instanceof InvalidBlockheightError) {
    console.error('Invalid block height:', error.message);
  }
}
```

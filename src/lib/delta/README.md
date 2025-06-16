# Delta Library

The Delta library provides functionality for working with block heights in a blockchain system. It allows for creating, comparing, and calculating differences between block heights, as well as estimating block heights from dates.

## Usage

```typescript
import { create_telescope } from '@joinnextblock/telescope';

// Create a new Telescope instance with current block height
const telescope = create_telescope();

// Create a Telescope instance with a specific block height
const specificTelescope = create_telescope(1000);

// Get the current block height
const blockHeight = telescope.delta.get_blockheight();

// Calculate the difference between two block heights
const difference = telescope.delta.t(500); // Returns difference between current and block 500
const difference2 = telescope.delta.t(specificTelescope); // Returns difference between two Telescope instances

// Estimate block height from a date
const date = new Date('2024-01-01');
const estimatedBlockHeight = telescope.delta.get_blockheight_from_date(date);
```

## API Reference

### `create_telescope(blockheight?: number): Telescope`

Factory function that creates a new Telescope instance.

- `blockheight` (optional): The block height to initialize the Delta with. If not provided, uses the genesis block height.

### `Delta` Class

#### Constructor

```typescript
new Delta(blockheight?: number)
```

Creates a new Delta instance.

- `blockheight` (optional): The block height to initialize with. If not provided, uses the genesis block height.
- Throws `InvalidBlockheightError` if the block height is not an integer.

#### Methods

- `get_blockheight(): number`
  Returns the current block height.

- `get_blockheight_from_date(date: Date): number`
  Estimates the block height for a given date based on the genesis block date.
  - `date`: The date to estimate the block height for.

- `t(value: number | Delta): number`
  Calculates the difference between the current block height and another block height.
  - `value`: Either a number representing a block height or another Delta instance.
  - Returns the difference in block heights.
  - Throws `InvalidBlockheightError` if the input is invalid.

### `InvalidBlockheightError`

Custom error class thrown when an invalid block height is provided.

## Error Handling

The library throws `InvalidBlockheightError` in the following cases:
- When a non-integer block height is provided
- When an invalid value is passed to the `t()` method

```typescript
try {
  const delta = create_delta(100.5); // Throws InvalidBlockheightError
} catch (error) {
  if (error instanceof InvalidBlockheightError) {
    console.error('Invalid block height:', error.message);
  }
}
```

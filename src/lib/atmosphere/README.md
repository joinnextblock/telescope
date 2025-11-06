# Atmosphere

The Atmosphere module provides functionality for calculating and managing block weight and transaction count metrics in a blockchain context.

## Overview

Atmosphere is a utility class that helps calculate conditions based on block weight and transaction count. It's particularly useful for analyzing blockchain performance and utilization metrics.

## Features

- Track block weight and transaction count
- Calculate utilization conditions
- Factory function for easy instance creation

## Usage

```typescript
import { create_telescope, BITCOIN } from '@joinnextblock/telescope';

// Create a Telescope instance from a Bitcoin block
const block: BITCOIN.Block = {
  height: 901152,
  difficulty: 126411437451912.23,
  weight: 3997853,
  tx_count: 2330,
};

const telescope = create_telescope(block);
const atmosphere = telescope.atmosphere;

// Get the current weight
const weight = atmosphere.get_weight();

// Get the transaction count
const txCount = atmosphere.get_transaction_count();

// Calculate conditions based on utilization
const conditions = atmosphere.get_conditions();
```

## API Reference

### Accessing Atmosphere Module

The Atmosphere module is accessed through a Telescope instance:

```typescript
import { create_telescope, BITCOIN } from '@joinnextblock/telescope';

const block: BITCOIN.Block = { 
  height: 901152, 
  difficulty: 1,
  weight: 3997853,
  tx_count: 2330,
};
const telescope = create_telescope(block);
const atmosphere = telescope.atmosphere;
```

### `Atmosphere` Class

#### Constructor
```typescript
constructor(weight: number, transaction_count: number)
```
- `weight`: The block weight (0 to MAX_BLOCK_WEIGHT = 4,000,000)
- `transaction_count`: The number of transactions in the block

#### Methods

- `get_weight(): number` - Returns the current block weight
- `get_transaction_count(): number` - Returns the current transaction count
- `get_conditions(): number` - Calculates and returns the conditions based on utilization (rounded to 2 decimal places)

### Factory Function

#### `create_atmosphere`
```typescript
create_atmosphere(weight: number, transaction_count: number): Atmosphere
```
Creates a new Atmosphere instance with the specified weight and transaction count. This is typically called internally by `create_telescope`.

## Implementation Details

The module uses `MAX_BLOCK_WEIGHT` from the constants module to calculate utilization conditions. The conditions are calculated as:

```
conditions = transaction_count / (weight / MAX_BLOCK_WEIGHT)
```

Results are rounded to 2 decimal places for precision.
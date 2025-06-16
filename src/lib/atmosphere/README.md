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
import { create_atmosphere } from './atmosphere';

// Create a new atmosphere instance
const atmosphere = create_atmosphere(weight, transaction_count);

// Get the current weight
const weight = atmosphere.get_weight();

// Get the transaction count
const txCount = atmosphere.get_transaction_count();

// Calculate conditions based on utilization
const conditions = atmosphere.get_conditions();
```

## API Reference

### `Atmosphere` Class

#### Constructor
```typescript
constructor(weight: number, transaction_count: number)
```
- `weight`: The weight of the atmosphere
- `transaction_count`: The number of transactions

#### Methods

- `get_weight()`: Returns the current weight
- `get_transaction_count()`: Returns the current transaction count
- `get_conditions()`: Calculates and returns the conditions based on utilization

### Factory Function

#### `create_atmosphere`
```typescript
create_atmosphere(weight: number, transaction_count: number): Atmosphere
```
Creates a new Atmosphere instance with the specified weight and transaction count.

## Implementation Details

The module uses `MAX_BLOCK_WEIGHT` from the constants module to calculate utilization conditions. The conditions are calculated as:

```
conditions = transaction_count / (weight / MAX_BLOCK_WEIGHT)
```

Results are rounded to 2 decimal places for precision.
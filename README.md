[![Test](https://github.com/joinnextblock/telescope/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/joinnextblock/telescope/actions/workflows/test.yml)

# Telescope

A TypeScript library for tracking astronomical cycles based on Bitcoin blockheight.

## Overview

Telescope is a library that provides functionality for working with Bitcoin blockheights and time. It offers a simple and type-safe way to create and manipulate blockheight values, including calculations and date-based estimations. The library maps Bitcoin's blockchain to astronomical cycles, creating a deterministic calendar synchronized with Bitcoin's block production.

## Installation

```bash
# Using Bun (recommended)
bun add @joinnextblock/telescope

# Using npm
npm install @joinnextblock/telescope
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
- Date to block height conversions
- Time difference calculations between blocks

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

## Development

### Prerequisites

- Node.js (v20.11.1 LTS or higher) or Bun (v1.0.0 or higher)
- npm (v10.2.4 or higher) if not using Bun

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Using Bun (recommended)
   cd code
   bun install

   # Using npm
   cd code
   npm install
   ```


## License

MIT


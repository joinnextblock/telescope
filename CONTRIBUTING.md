# Contributing to Telescope

Thank you for your interest in contributing to Telescope! This document provides guidelines and instructions for contributing to the project.

## Project Maintenance

Telescope is an open-source project maintained by NextBlock for company use. While we welcome contributions from the community through pull requests, please note that:

- NextBlock maintains the project and has final say on all contributions
- The project is primarily developed to serve NextBlock's needs
- Pull requests that align with NextBlock's goals and maintain code quality are most likely to be accepted
- We appreciate all contributions, whether they're bug fixes, documentation improvements, or feature additions

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js (v20.11.1 LTS or higher) or Bun (v1.0.0 or higher)
- npm (v10.2.4 or higher) if not using Bun
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/telescope.git
   cd telescope
   ```
3. Install dependencies:
   ```bash
   # Using Bun (recommended)
   bun install
   
   # Using npm
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Run tests:
   ```bash
   npm test
   ```

## Development Workflow

### Making Changes

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Ensure your code follows the project's style guidelines (run `npm run lint` and `npm run format`)
4. Write or update tests as needed
5. Ensure all tests pass: `npm test`
6. Build the project to verify TypeScript compilation: `npm run build`

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Run `npm run lint` to check for linting issues
- Run `npm run format` to format your code

### Testing

- Write tests for new features and bug fixes
- Ensure all existing tests pass
- Aim for high test coverage
- Tests should be clear and descriptive

### Commit Messages

- Use clear, descriptive commit messages
- Reference issue numbers when applicable
- Follow conventional commit format when possible

### Pull Requests

1. Update the CHANGELOG.md if your changes affect the public API
2. Ensure your branch is up to date with `main`
3. Push your branch to your fork
4. Create a Pull Request with:
   - A clear title and description
   - Reference to any related issues
   - Description of changes and testing performed

### Review Process

- All PRs require review by NextBlock maintainers before merging
- Address review comments promptly
- Maintain a friendly and professional tone in discussions
- NextBlock maintainers will evaluate PRs based on:
  - Alignment with project goals and NextBlock's needs
  - Code quality and maintainability
  - Test coverage and documentation
  - Backward compatibility considerations

## Project Structure

- `src/` - Source code organized by module
- `dist/` - Compiled output (generated)
- `index.ts` - Main entry point
- `index.d.ts` - Type definitions
- `*.test.ts` - Test files

## Module Guidelines

Telescope is organized into modules:
- `delta` - Blockheight calculations
- `lunar` - Lunar phase and cycle tracking
- `solar` - Solar season tracking
- `atmosphere` - Block metrics and conditions
- `tidal` - Tidal calculations

When adding new functionality:
- Keep modules focused and independent
- Follow existing patterns and conventions
- Update relevant README files in module directories
- Export types and interfaces appropriately

## Questions?

If you have questions or need help, please:
- Open an issue for discussion
- Check existing issues and discussions
- Review the README.md for project documentation

Thank you for contributing to Telescope!


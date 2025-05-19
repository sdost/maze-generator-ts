# Maze Generator

A TypeScript-based maze generator and solver with WebGL rendering.

## Live Demo

Visit the [live demo](https://sdost.github.io/maze-generator-ts/) to see the maze generator in action.

## Features

- Generate random mazes with customizable width, height, and seed
- Solve mazes using A* pathfinding algorithm
- WebGL-based rendering for smooth performance
- Animated maze generation and solving process
- GitHub Pages deployment with automatic CI/CD

## Development

### Prerequisites

- Node.js (v18.x or v20.x)
- npm (v7 or higher)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/sdost/maze-generator-ts.git
   cd maze-generator-ts
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Building

To build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory and will be automatically deployed to GitHub Pages when pushed to the main branch.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

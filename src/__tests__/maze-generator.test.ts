import { describe, expect, it } from '@jest/globals';
import { SquareMazeGrid } from '../objects/square-maze-grid';
import { MazeConfig } from '../types/maze';
import { InvalidConfigError, MazeGenerationError } from '../errors/maze-errors';
import { SquareWall } from '../objects/square-maze-cell';

describe('SquareMazeGrid', () => {
  const createConfig = (overrides: Partial<MazeConfig> = {}): MazeConfig => ({
    width: 10,
    height: 10,
    algorithm: 'kruskal',
    renderer: 'webgl',
    animationSpeed: 100,
    cellSize: 20,
    ...overrides
  });

  describe('constructor', () => {
    it('should create a valid maze grid', () => {
      const config = createConfig();
      const grid = new SquareMazeGrid(config);
      expect(grid.width).toBe(config.width);
      expect(grid.height).toBe(config.height);
      expect(grid.cells.length).toBe(config.width * config.height);
    });

    it('should throw error for invalid width', () => {
      const config = createConfig({ width: 1 });
      expect(() => new SquareMazeGrid(config)).toThrow(InvalidConfigError);
    });

    it('should throw error for invalid height', () => {
      const config = createConfig({ height: 1 });
      expect(() => new SquareMazeGrid(config)).toThrow(InvalidConfigError);
    });

    it('should throw error for invalid cell size', () => {
      const config = createConfig({ cellSize: 2 });
      expect(() => new SquareMazeGrid(config)).toThrow(InvalidConfigError);
    });
  });

  describe('getCell', () => {
    it('should return null for out of bounds coordinates', () => {
      const grid = new SquareMazeGrid(createConfig());
      expect(grid.getCell(-1, 0)).toBeNull();
      expect(grid.getCell(0, -1)).toBeNull();
      expect(grid.getCell(10, 0)).toBeNull();
      expect(grid.getCell(0, 10)).toBeNull();
    });

    it('should return cell for valid coordinates', () => {
      const grid = new SquareMazeGrid(createConfig());
      const cell = grid.getCell(0, 0);
      expect(cell).not.toBeNull();
      expect(cell?.position).toEqual({ x: 0, y: 0 });
    });
  });

  describe('iterate', () => {
    it('should return false while maze is being generated', () => {
      const grid = new SquareMazeGrid(createConfig());
      expect(grid.iterate()).toBe(false);
    });

    it('should return true when maze generation is complete', () => {
      const grid = new SquareMazeGrid(createConfig({ width: 2, height: 2 }));
      while (!grid.iterate()) {
        // Keep iterating until complete
      }
      expect(grid.iterate()).toBe(true);
    });
  });

  describe('static generate', () => {
    it('should generate a maze with the same seed', () => {
      const config = createConfig({ seed: 123 });
      const grid1 = SquareMazeGrid.generate(config);
      const grid2 = SquareMazeGrid.generate(config);

      // Compare wall configurations
      for (let i = 0; i < grid1.cells.length; i++) {
        const cell1 = grid1.cells[i];
        const cell2 = grid2.cells[i];
        expect(cell1.walls).toEqual(cell2.walls);
      }
    });

    it('should generate different mazes with different seeds', () => {
      const config1 = createConfig({ seed: 123 });
      const config2 = createConfig({ seed: 456 });
      const grid1 = SquareMazeGrid.generate(config1);
      const grid2 = SquareMazeGrid.generate(config2);

      // Compare wall configurations
      let different = false;
      for (let i = 0; i < grid1.cells.length; i++) {
        const cell1 = grid1.cells[i];
        const cell2 = grid2.cells[i];
        if (JSON.stringify(cell1.walls) !== JSON.stringify(cell2.walls)) {
          different = true;
          break;
        }
      }
      expect(different).toBe(true);
    });
  });

  describe('wall connections', () => {
    it('should properly connect adjacent cells', () => {
      const grid = new SquareMazeGrid(createConfig({ width: 2, height: 2 }));
      const cell00 = grid.getCell(0, 0)!;
      const cell01 = grid.getCell(0, 1)!;
      const cell10 = grid.getCell(1, 0)!;
      const cell11 = grid.getCell(1, 1)!;

      // Test initial wall configuration
      expect(cell00.hasWall(SquareWall.Right)).toBe(true);
      expect(cell00.hasWall(SquareWall.Bottom)).toBe(true);
      expect(cell01.hasWall(SquareWall.Top)).toBe(true);
      expect(cell01.hasWall(SquareWall.Right)).toBe(true);
      expect(cell10.hasWall(SquareWall.Left)).toBe(true);
      expect(cell10.hasWall(SquareWall.Bottom)).toBe(true);
      expect(cell11.hasWall(SquareWall.Top)).toBe(true);
      expect(cell11.hasWall(SquareWall.Left)).toBe(true);
    });

    it('should remove walls between connected cells', () => {
      const grid = new SquareMazeGrid(createConfig({ width: 2, height: 2 }));
      const cell00 = grid.getCell(0, 0)!;
      const cell01 = grid.getCell(0, 1)!;

      // Remove wall between cells
      cell00.removeWall(SquareWall.Bottom);
      cell01.removeWall(SquareWall.Top);

      expect(cell00.hasWall(SquareWall.Bottom)).toBe(false);
      expect(cell01.hasWall(SquareWall.Top)).toBe(false);
    });
  });

  describe('start and end cells', () => {
    it('should throw error when accessing unset start cell', () => {
      const grid = new SquareMazeGrid(createConfig());
      expect(() => grid.getStartCell()).toThrow(MazeGenerationError);
    });

    it('should throw error when accessing unset end cell', () => {
      const grid = new SquareMazeGrid(createConfig());
      expect(() => grid.getEndCell()).toThrow(MazeGenerationError);
    });
  });

  describe('maze generation', () => {
    it('should generate a valid maze with no cycles', () => {
      const grid = SquareMazeGrid.generate(createConfig({ width: 5, height: 5 }));
      const visited = new Set<string>();

      const dfs = (x: number, y: number, fromX: number, fromY: number): boolean => {
        const key = `${x},${y}`;
        if (visited.has(key)) return true; // Found a cycle
        visited.add(key);

        const cell = grid.getCell(x, y)!;
        for (let wall = 0; wall < 4; wall++) {
          if (!cell.hasWall(wall)) {
            const nextPos = cell.getNeighborPosition(wall);
            if (nextPos.x !== fromX || nextPos.y !== fromY) {
              if (dfs(nextPos.x, nextPos.y, x, y)) return true;
            }
          }
        }
        return false;
      };

      expect(dfs(0, 0, -1, -1)).toBe(false); // No cycles should exist
    });
  });
});
import { IMazeRenderer, MazeGrid, Solution } from '../types/maze';
import { SquareMazeCell, SquareWall } from '../objects/square-maze-cell';
import { BaseWebGLRenderer, RendererConfig } from './webgl/base-webgl-renderer';

export class WebGLMazeRenderer extends BaseWebGLRenderer implements IMazeRenderer {
  private static readonly DEFAULT_CONFIG: RendererConfig = {
    backgroundColor: [1, 1, 1, 1],
    defaultColor: [0, 0, 0, 1],
  };

  constructor(canvas: HTMLCanvasElement, config: Partial<RendererConfig> = {}) {
    super(canvas, { ...WebGLMazeRenderer.DEFAULT_CONFIG, ...config });
  }

  public render(maze: MazeGrid): void {
    this.setupRender();
    this.renderWalls(maze);
    this.renderCells(maze);
  }

  public renderSolution(solution: Solution): void {
    this.setupRender();
    this.renderPath(solution);
  }

  private renderWalls(maze: MazeGrid): void {
    const positions: number[] = [];
    const colors: number[] = [];

    for (const cell of maze.cells) {
      const squareCell = cell as SquareMazeCell;
      const { x, y } = squareCell.position;
      const cellSize = this.calculateCellSize(maze.width, maze.height);

      if (squareCell.hasWall(SquareWall.Top)) {
        this.addWallToBuffers(positions, colors, x, y, x + 1, y, cellSize);
      }
      if (squareCell.hasWall(SquareWall.Right)) {
        this.addWallToBuffers(positions, colors, x + 1, y, x + 1, y + 1, cellSize);
      }
      if (squareCell.hasWall(SquareWall.Bottom)) {
        this.addWallToBuffers(positions, colors, x, y + 1, x + 1, y + 1, cellSize);
      }
      if (squareCell.hasWall(SquareWall.Left)) {
        this.addWallToBuffers(positions, colors, x, y, x, y + 1, cellSize);
      }
    }

    this.drawBuffers(positions, colors, [0, 0, 0, 1]); // Black walls
  }

  private renderCells(maze: MazeGrid): void {
    const positions: number[] = [];
    const colors: number[] = [];

    for (const cell of maze.cells) {
      const squareCell = cell as SquareMazeCell;
      const { x, y } = squareCell.position;
      const cellSize = this.calculateCellSize(maze.width, maze.height);

      // Add cell rectangle
      positions.push(
        x * cellSize,
        y * cellSize,
        (x + 1) * cellSize,
        y * cellSize,
        x * cellSize,
        (y + 1) * cellSize,
        (x + 1) * cellSize,
        (y + 1) * cellSize
      );

      // Add cell color (white)
      for (let i = 0; i < 4; i++) {
        colors.push(1, 1, 1, 1);
      }
    }

    this.drawBuffers(positions, colors, [1, 1, 1, 1]); // White cells
  }

  private renderPath(solution: Solution): void {
    const positions: number[] = [];
    const colors: number[] = [];
    const maxX = Math.max(...solution.path.map((p) => p.x));
    const maxY = Math.max(...solution.path.map((p) => p.y));
    const cellSize = this.calculateCellSize(maxX + 1, maxY + 1);

    for (const point of solution.path) {
      const { x, y } = point;
      positions.push(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
      colors.push(1, 0, 0, 1); // Red path
    }

    this.drawBuffers(positions, colors, [1, 0, 0, 1]); // Red path
  }

  private addWallToBuffers(
    positions: number[],
    colors: number[],
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    cellSize: number
  ): void {
    positions.push(x1 * cellSize, y1 * cellSize, x2 * cellSize, y2 * cellSize);
    colors.push(0, 0, 0, 1, 0, 0, 0, 1); // Black wall
  }
}

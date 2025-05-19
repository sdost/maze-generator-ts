import { MazeGrid, Solution, Position } from '../types/maze';
import { BaseMazeCell } from './base-maze-cell';

export class MazeRenderer {
  private ctx: CanvasRenderingContext2D;
  private cellSize: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private maze: MazeGrid
  ) {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = context;
    this.calculateDimensions();
  }

  private calculateDimensions(): void {
    const padding = 20;
    this.cellSize = Math.min(
      (this.canvas.width - padding * 2) / this.maze.width,
      (this.canvas.height - padding * 2) / this.maze.height
    );
    this.offsetX = (this.canvas.width - this.maze.width * this.cellSize) / 2;
    this.offsetY = (this.canvas.height - this.maze.height * this.cellSize) / 2;
  }

  public render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMaze();
  }

  public renderSolution(solution: Solution): void {
    this.render();
    this.drawPath(solution.path, '#ff0000', 3);
  }

  public renderSolvingProgress(
    currentPath: Position[],
    openSet: Position[],
    closedSet: Position[]
  ): void {
    this.render();

    // Draw closed set (visited cells)
    this.drawCells(closedSet, '#cccccc', 0.5);

    // Draw open set (frontier)
    this.drawCells(openSet, '#90EE90', 0.5);

    // Draw current path
    this.drawPath(currentPath, '#ff0000', 2);
  }

  private drawMaze(): void {
    // Draw background
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw cells and walls
    for (let y = 0; y < this.maze.height; y++) {
      for (let x = 0; x < this.maze.width; x++) {
        const cell = this.maze.getCell(x, y);
        if (cell) {
          this.drawCell(cell);
        }
      }
    }

    // Draw start and end cells
    this.drawCell(this.maze.getStartCell(), '#00ff00');
    this.drawCell(this.maze.getEndCell(), '#ff0000');
  }

  private drawCell(cell: BaseMazeCell, color: string = '#000000'): void {
    const { x, y } = cell.position;
    const cellX = this.offsetX + x * this.cellSize;
    const cellY = this.offsetY + y * this.cellSize;

    // Draw cell walls
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;

    if (cell.hasWall(0)) {
      // Top
      this.ctx.beginPath();
      this.ctx.moveTo(cellX, cellY);
      this.ctx.lineTo(cellX + this.cellSize, cellY);
      this.ctx.stroke();
    }
    if (cell.hasWall(1)) {
      // Right
      this.ctx.beginPath();
      this.ctx.moveTo(cellX + this.cellSize, cellY);
      this.ctx.lineTo(cellX + this.cellSize, cellY + this.cellSize);
      this.ctx.stroke();
    }
    if (cell.hasWall(2)) {
      // Bottom
      this.ctx.beginPath();
      this.ctx.moveTo(cellX, cellY + this.cellSize);
      this.ctx.lineTo(cellX + this.cellSize, cellY + this.cellSize);
      this.ctx.stroke();
    }
    if (cell.hasWall(3)) {
      // Left
      this.ctx.beginPath();
      this.ctx.moveTo(cellX, cellY);
      this.ctx.lineTo(cellX, cellY + this.cellSize);
      this.ctx.stroke();
    }
  }

  private drawPath(path: Position[], color: string, lineWidth: number): void {
    if (path.length < 2) return;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();

    const start = path[0];
    this.ctx.moveTo(
      this.offsetX + (start.x + 0.5) * this.cellSize,
      this.offsetY + (start.y + 0.5) * this.cellSize
    );

    for (let i = 1; i < path.length; i++) {
      const point = path[i];
      this.ctx.lineTo(
        this.offsetX + (point.x + 0.5) * this.cellSize,
        this.offsetY + (point.y + 0.5) * this.cellSize
      );
    }

    this.ctx.stroke();
  }

  private drawCells(cells: Position[], color: string, alpha: number): void {
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = alpha;

    for (const cell of cells) {
      this.ctx.fillRect(
        this.offsetX + cell.x * this.cellSize,
        this.offsetY + cell.y * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    }

    this.ctx.globalAlpha = 1;
  }
}

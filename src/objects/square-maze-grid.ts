import { MazeGrid } from '../types/maze';
import { SquareMazeCell, SquareWall } from './square-maze-cell';
import { MazeWall } from './maze-wall';
import { DisjointSet } from '../data-structures/disjoint-set';
import { PseudoRandom } from '../helpers/pseudo-random';
import { ConfigValidator } from '../utils/config-validator';
import { MazeConfig } from '../types/maze';
import { MazeGenerationError } from '../errors/maze-errors';

export class SquareMazeGrid implements MazeGrid {
  private readonly _cells: SquareMazeCell[];
  private readonly wallList: MazeWall[];
  private readonly sets: DisjointSet;
  private startCell: SquareMazeCell | null = null;
  private endCell: SquareMazeCell | null = null;

  constructor(config: MazeConfig) {
    ConfigValidator.validate(config);
    this._cells = new Array<SquareMazeCell>(config.width * config.height);
    this.wallList = [];
    this.sets = new DisjointSet(config.width * config.height);
    this.initializeGrid(config);
  }

  public get cells(): ReadonlyArray<SquareMazeCell> {
    return this._cells;
  }

  public get width(): number {
    return this._cells.length > 0 ? Math.sqrt(this._cells.length) : 0;
  }

  public get height(): number {
    return this.width;
  }

  public getCell(x: number, y: number): SquareMazeCell | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return this._cells[x + y * this.width];
  }

  public getStartCell(): SquareMazeCell {
    if (!this.startCell) {
      throw new MazeGenerationError('Start cell not set');
    }
    return this.startCell;
  }

  public getEndCell(): SquareMazeCell {
    if (!this.endCell) {
      throw new MazeGenerationError('End cell not set');
    }
    return this.endCell;
  }

  private initializeGrid(config: MazeConfig): void {
    // Initialize cells
    for (let y = 0; y < config.height; y++) {
      for (let x = 0; x < config.width; x++) {
        const cell = new SquareMazeCell({ x, y });
        this._cells[x + y * config.width] = cell;
        this.sets.createSet(x + y * config.width);
      }
    }

    // Initialize walls
    for (const cell of this._cells) {
      for (let wall = 0; wall < 4; wall++) {
        const neighborPos = cell.getNeighborPosition(wall);
        const neighbor = this.getCell(neighborPos.x, neighborPos.y);
        if (neighbor) {
          this.addWall(cell, neighbor);
        }
      }
    }
  }

  private addWall(cellA: SquareMazeCell, cellB: SquareMazeCell): void {
    const wall = MazeWall.create(cellA, cellB);
    if (!this.wallList.some((w) => w.equals(wall))) {
      this.wallList.push(wall);
    } else {
      MazeWall.release(wall);
    }
  }

  public iterate(): boolean {
    if (this.wallList.length === 0) {
      return true;
    }

    const wall = this.wallList.pop()!;
    const cellAIndex = wall.cellA.position.x + wall.cellA.position.y * this.width;
    const cellBIndex = wall.cellB.position.x + wall.cellB.position.y * this.width;
    if (this.sets.findSet(cellAIndex) !== this.sets.findSet(cellBIndex)) {
      this.sets.mergeSet(cellAIndex, cellBIndex);
      this.removeWallsBetween(wall.cellA, wall.cellB);
    }

    MazeWall.release(wall);
    return false;
  }

  private removeWallsBetween(cellA: SquareMazeCell, cellB: SquareMazeCell): void {
    const { x: x1, y: y1 } = cellA.position;
    const { x: x2, y: y2 } = cellB.position;

    if (x1 === x2) {
      if (y1 < y2) {
        cellA.removeWall(SquareWall.Bottom);
        cellB.removeWall(SquareWall.Top);
      } else {
        cellA.removeWall(SquareWall.Top);
        cellB.removeWall(SquareWall.Bottom);
      }
    } else {
      if (x1 < x2) {
        cellA.removeWall(SquareWall.Right);
        cellB.removeWall(SquareWall.Left);
      } else {
        cellA.removeWall(SquareWall.Left);
        cellB.removeWall(SquareWall.Right);
      }
    }
  }

  public static generate(config: MazeConfig): SquareMazeGrid {
    const grid = new SquareMazeGrid(config);
    const prng = new PseudoRandom(config.seed || Date.now());

    // Shuffle walls using Fisher-Yates algorithm with seeded random
    for (let i = grid.wallList.length - 1; i > 0; i--) {
      const j = Math.floor(prng.nextDouble() * (i + 1));
      [grid.wallList[i], grid.wallList[j]] = [grid.wallList[j], grid.wallList[i]];
    }

    // Complete the maze generation
    while (!grid.iterate()) {
      // Keep iterating until complete
    }

    grid.createExitCells(prng);
    return grid;
  }

  private createExitCells(prng: PseudoRandom): void {
    const outerWall: SquareWall = prng.nextIntRange(0, 3);
    let xPos = 0;
    let yPos = 0;

    // Set start cell
    switch (outerWall) {
      case SquareWall.Top:
        xPos = prng.nextIntRange(0, this.width - 1);
        yPos = 0;
        break;
      case SquareWall.Right:
        yPos = prng.nextIntRange(0, this.height - 1);
        xPos = this.width - 1;
        break;
      case SquareWall.Bottom:
        xPos = prng.nextIntRange(0, this.width - 1);
        yPos = this.height - 1;
        break;
      case SquareWall.Left:
        yPos = prng.nextIntRange(0, this.height - 1);
        xPos = 0;
        break;
    }

    this.startCell = this.getCell(xPos, yPos);

    // Set end cell on opposite wall
    switch (outerWall) {
      case SquareWall.Top:
        xPos = prng.nextIntRange(0, this.width - 1);
        yPos = this.height - 1;
        break;
      case SquareWall.Right:
        yPos = prng.nextIntRange(0, this.height - 1);
        xPos = 0;
        break;
      case SquareWall.Bottom:
        xPos = prng.nextIntRange(0, this.width - 1);
        yPos = 0;
        break;
      case SquareWall.Left:
        yPos = prng.nextIntRange(0, this.height - 1);
        xPos = this.width - 1;
        break;
    }

    this.endCell = this.getCell(xPos, yPos);
  }
}

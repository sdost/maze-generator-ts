import { SquareMazeCell } from './square-maze-cell';

interface MutableMazeWall extends MazeWall {
  cellA: SquareMazeCell;
  cellB: SquareMazeCell;
}

export class MazeWall {
  private static readonly wallPool: MazeWall[] = [];
  private static readonly MAX_POOL_SIZE = 10000;

  private constructor(
    public readonly cellA: SquareMazeCell,
    public readonly cellB: SquareMazeCell
  ) {}

  public static create(cellA: SquareMazeCell, cellB: SquareMazeCell): MazeWall {
    if (this.wallPool.length > 0) {
      const wall = this.wallPool.pop()! as MutableMazeWall;
      wall.cellA = cellA;
      wall.cellB = cellB;
      return wall;
    }
    return new MazeWall(cellA, cellB);
  }

  public static release(wall: MazeWall): void {
    if (this.wallPool.length < this.MAX_POOL_SIZE) {
      this.wallPool.push(wall);
    }
  }

  public equals(other: MazeWall): boolean {
    return (
      (this.cellA === other.cellA && this.cellB === other.cellB) ||
      (this.cellA === other.cellB && this.cellB === other.cellA)
    );
  }

  public toString(): string {
    return `Wall(${this.cellA.toString()} - ${this.cellB.toString()})`;
  }
}

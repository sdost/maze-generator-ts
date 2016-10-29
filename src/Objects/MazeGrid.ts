import { IComparable } from "../DataStructures/IComparable";

export abstract class MazeCell implements IComparable {
  public xPos: number;
  public yPos: number;

  protected wallList: Array<Boolean>;

  constructor(x: number, y: number) {
    this.xPos = x;
    this.yPos = y;
    this.wallList = new Array<Boolean>();
    this.initialize();
  }

  public equals(other: MazeCell): Boolean {
    return this === other;
  }

  public abstract removeWall(ind: number): void;

  public abstract hasWall(ind: number): Boolean;

  public walls(): number {
    return this.wallList.length;
  }

  protected abstract initialize(): void;
}

export class MazeWall implements IComparable {
  public cellA: MazeCell;
  public cellB: MazeCell;

  constructor(cellA: MazeCell, cellB: MazeCell) {
    this.cellA = cellA;
    this.cellB = cellB;
  }

  public equals(wall: MazeWall): Boolean {
    if ( this.cellA === wall.cellA && this.cellB === wall.cellB ) {
      return true;
    }

    if ( this.cellB === wall.cellA && this.cellA === wall.cellB ) {
      return true;
    }

    return false;
  }
}

export abstract class MazeGrid {
  protected shift: number;
  protected gridWidth: number;
  protected gridHeight: number;

  protected grid: Array<MazeCell>;

  protected gridStartCell: MazeCell;
  protected gridEndCell: MazeCell;

  public abstract getCell(x: number, a: number): MazeCell;

  public get startCell(): MazeCell { return this.gridStartCell; }

  public get endCell(): MazeCell { return this.gridEndCell; }

  public get width(): number { return this.gridWidth; }

  public get height(): number { return this.gridHeight; }

  protected abstract initGrid(): void;
}

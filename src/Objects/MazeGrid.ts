import { IComparable } from "../DataStructures/IComparable";

export abstract class MazeCell implements IComparable {
  public xPos: number;
  public yPos: number;
  public visited: boolean;

  protected wallList: Array<Boolean>;

  constructor(x: number, y: number) {
    this.xPos = x;
    this.yPos = y;
    this.visited = false;
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

export abstract class MazeGrid {
  protected shift: number;
  protected gridWidth: number;
  protected gridHeight: number;

  protected grid: Array<MazeCell>;

  protected gridStartCell: MazeCell;
  protected gridEndCell: MazeCell;

  protected gridSeed: number;

  public abstract iterate(): void;

  public abstract getCell(x: number, a: number): MazeCell;

  public get startCell(): MazeCell { return this.gridStartCell; }

  public get endCell(): MazeCell { return this.gridEndCell; }

  public get width(): number { return this.gridWidth; }

  public get height(): number { return this.gridHeight; }
}

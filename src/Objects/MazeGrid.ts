import { DisjointSet } from "../DataStructures/DisjointSet";
import { MazeCell } from "./MazeCell";

export abstract class MazeGrid {
  protected shift: number;
  protected gridWidth: number;
  protected gridHeight: number;

  protected grid: Array<MazeCell>;
  protected ds: DisjointSet;

  protected gridStartCell: MazeCell;
  protected gridEndCell: MazeCell;

  public abstract render(context: CanvasRenderingContext2D, scale: number): void;

  public abstract getCell(x: number, a: number): MazeCell;

  public abstract generate(seed: number): void;

  public get startCell(): MazeCell { return this.gridStartCell; }

  public get endCell(): MazeCell { return this.gridEndCell; }

  public get width(): number { return this.gridWidth; }

  public get height(): number { return this.gridHeight; }

  protected abstract initGrid(): void;
}

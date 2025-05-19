import { Position, MazeCell } from '../types/maze';

export abstract class BaseMazeCell implements MazeCell {
  private readonly _walls: boolean[];
  private _visited: boolean = false;

  constructor(
    private readonly _position: Position,
    wallCount: number
  ) {
    this._walls = new Array(wallCount).fill(true);
  }

  public get position(): Position {
    return this._position;
  }

  public get walls(): ReadonlyArray<boolean> {
    return this._walls;
  }

  public get visited(): boolean {
    return this._visited;
  }

  public set visited(value: boolean) {
    this._visited = value;
  }

  public removeWall(index: number): void {
    if (index >= 0 && index < this._walls.length) {
      this._walls[index] = false;
    }
  }

  public hasWall(index: number): boolean {
    return index >= 0 && index < this._walls.length ? this._walls[index] : false;
  }

  public equals(other: BaseMazeCell): boolean {
    return (
      this._position.x === other._position.x && this._position.y === other._position.y
    );
  }

  public toString(): string {
    return `Cell(${this._position.x}, ${this._position.y})`;
  }
}
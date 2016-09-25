module Maze.Objects
{
  export class MazeGrid
  {
    protected _shift:number;
    protected _gridWidth:number;
    protected _gridHeight:number;

    protected _grid:Array<MazeCell>;
    protected _ds:DataStructures.DisjointSet;

    protected _startCell:MazeCell;
    protected _endCell:MazeCell;

    constructor()
    {

    }

    protected initGrid():void
    {
      // For override.
    }

    public get startCell():MazeCell
    {
      return this._startCell;
    }

    public get endCell():MazeCell
    {
      return this._endCell;
    }

    public render(a_g:CanvasRenderingContext2D, a_scale:number):void
    {
      // For override.
    }

    public getCell(a_x:number, a_y:number):MazeCell
    {
      // For override.
      return null;
    }

    public generate(a_seed:number = 1):void
    {
      // For override?
    }

    public get width():number
    {
      return this._gridWidth;
    }

    public get height():number
    {
      return this._gridHeight;
    }
  }
}
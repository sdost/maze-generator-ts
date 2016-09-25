module Maze.Objects
{
  export class MazeSolver
  {
    protected _maze:MazeGrid;
    protected _path:DataStructures.LinkedList;

    constructor(a_maze:MazeGrid)
    {
      this._maze = a_maze;
      this._path = new DataStructures.LinkedList();

      this._path.append(this._maze.startCell);
    }

    public solve():void
    {
      // For override.
    }

    public render(a_g:CanvasRenderingContext2D, a_scale:number):void
    {
      // For override.
    }
  }
}
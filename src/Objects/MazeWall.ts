module Maze.Objects
{
  export class MazeWall
  {
    private _cellA:MazeCell;
    private _cellB:MazeCell;

    constructor(a_cellA:MazeCell, a_cellB:MazeCell)
    {
      this._cellA = a_cellA;
      this._cellB = a_cellB;
    }

    public get cellA():MazeCell
    {
      return this._cellA;
    }

    public get cellB():MazeCell
    {
      return this._cellB;
    }

    public equals(a_wall:MazeWall):Boolean
    {
      if ( this._cellA == a_wall.cellA && this._cellB == a_wall.cellB ) return true;

      if ( this._cellB == a_wall.cellA && this._cellA == a_wall.cellB ) return true;

      return false;
    }
  }
}
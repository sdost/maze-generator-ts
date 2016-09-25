module Maze.Objects
{
  export class SquareMazeSolver extends MazeSolver
  {
    public static RIGHT_HAND:number = 0;
    public static LEFT_HAND:number = 1;

    private static SCALE:number = 10;

    private _facing:number;

    constructor(a_maze:MazeGrid)
    {
      super(a_maze);
    }

    public solve():void
    {
      if(this._maze.startCell.yPos == 0)
      {
        this._facing = SquareWall.Bottom;
      }
      else if(this._maze.startCell.xPos == this._maze.width-1)
      {
        this._facing = SquareWall.Left;
      }
      else if(this._maze.startCell.yPos == this._maze.height-1)
      {
        this._facing = SquareWall.Top;
      }
      else
      {
        this._facing = SquareWall.Right; 
      }

      var cell:SquareMazeCell, lastCell:SquareMazeCell, nextCell:SquareMazeCell;
      var x:number, y:number;
      while ( !this._path.contains(this._maze.endCell) )
      {
        lastCell = cell;
        cell = this._path.tail.data;

        var w:number = this.getRightHandWall();
        if ( cell.hasWall(w) )
        {
          if ( cell.hasWall(this._facing) )
          {
            this._facing = this.getLeftHandWall();
          }
          else
          {
            x = cell.xPos;
            y = cell.yPos;

            if ( this._facing == SquareWall.Top )
            {
              y--;
            }
            else if ( this._facing == SquareWall.Bottom )
            {
              y++;
            }
            else if ( this._facing == SquareWall.Left )
            {
              x--;
            }
            else if ( this._facing == SquareWall.Right )
            {
              x++;
            }
            nextCell = this._maze.getCell(x, y) as SquareMazeCell;

            if (nextCell != null)
            {
              if (this._path.contains(nextCell))
              {
                this._path.tail.unlink();
              }
              else if ( nextCell == lastCell )
              {
                this._path.tail.unlink();
              }
              else
              {
                this._path.append(nextCell);
              }
            }
          }
        }
        else
        {
          this._facing = this.getRightHandWall();
          x = cell.xPos;
          y = cell.yPos;

          if ( this._facing == SquareWall.Top )
          {
            y--;
          }
          else if ( this._facing == SquareWall.Bottom )
          {
            y++;
          }
          else if ( this._facing == SquareWall.Left )
          {
            x--;
          }
          else if ( this._facing == SquareWall.Right )
          {
            x++;
          }
          nextCell = this._maze.getCell(x, y) as SquareMazeCell;

          if (nextCell != null)
          {
            if (this._path.contains(nextCell))
            {
              this._path.tail.unlink();
            }
            else if ( nextCell == lastCell )
            {
              this._path.tail.unlink();
            }
            else
            {
              this._path.append(nextCell);
            }
          }
        }
      }
    }

    private getRightHandWall():number
    {
      if (this._facing == SquareWall.Top)
      {
        return SquareWall.Right
      }

      if (this._facing == SquareWall.Right)
      {
        return SquareWall.Bottom
      }

      if (this._facing == SquareWall.Bottom)
      {
        return SquareWall.Left
      }

      if (this._facing == SquareWall.Left)
      {
        return SquareWall.Top;
      }

      return Number.NaN;
    }

    private getLeftHandWall():number
    {
      if (this._facing == SquareWall.Top)
      {
        return SquareWall.Left
      }

      if (this._facing == SquareWall.Left)
      {
        return SquareWall.Bottom
      }

      if (this._facing == SquareWall.Bottom)
      {
        return SquareWall.Right
      }

      if (this._facing == SquareWall.Right)
      {
        return SquareWall.Top;
      }

      return Number.NaN;
    }

    public render(a_g:CanvasRenderingContext2D, a_scale:number):void
    {
      a_g.fillStyle = "#33888866";
      
      a_g.beginPath();

      var itr:DataStructures.ListIterator = this._path.iterator;
      while (itr.hasNext())
      {
        var cell:MazeCell = itr.next();
        cell.render(a_g, a_scale);
      }

      a_g.fill();
    }
  }
}
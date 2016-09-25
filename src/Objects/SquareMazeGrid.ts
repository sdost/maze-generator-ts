module Maze.Objects
{
  export class SquareMazeGrid extends MazeGrid
  {
    private _wallList:DataStructures.LinkedList;

    constructor(a_width:number, a_height:number)
    {
      super()
      this._gridWidth = a_width;
      this._gridHeight = a_height;

      this.initGrid();
    }

    protected initGrid():void
    {
      this._shift = 0;
      var minLength:number = this._gridWidth * this._gridHeight;
      var powOfTwo:number = 1;
      while ( powOfTwo < minLength )
      {
        powOfTwo *= 2;
        this._shift++;
      }

      this._grid = new Array<MazeCell>(this._gridWidth << this._shift);
      for ( var i:number = 0; i < this._grid.length; i++)
      {
        this._grid[i] = null;
      }

      this._ds = new DataStructures.DisjointSet(this._gridWidth * this._gridHeight);

      for ( var x:number = 0; x < this._gridWidth; x++ )
      {
        for ( var y:number = 0; y < this._gridHeight; y++ )
        {
          var ind:number = (x << this._shift) | y;

          this._grid[ind] = new SquareMazeCell(x, y);
          this._ds.createSet(ind);
        }
      }
    }

    public generate(a_seed:number = 1):void
    {
      this._wallList = new WallList();

      var ind:number;
      var wall:MazeWall;
      for ( var x:number = 0; x < this._gridWidth; x++ )
      {
        for ( var y:number = 0; y < this._gridHeight; y++ )
        {
          ind = (x << this._shift) | y;
          var cellA:SquareMazeCell = this._grid[ind] as SquareMazeCell;
          var cellB:SquareMazeCell;

          if ( x > 0 )
          {
            ind = ((x - 1) << this._shift) | y;
            cellB = this._grid[ind] as SquareMazeCell;

            if ( cellB != null )
            {
              wall = new MazeWall(cellA, cellB);

              if (!this._wallList.contains(wall))
                this._wallList.append(wall);
            }
          }

          if ( y > 0 )
          {
            ind = (x << this._shift) | (y - 1);
            cellB = this._grid[ind] as SquareMazeCell;

            if ( cellB != null )
            {
              wall = new MazeWall(cellA, cellB);

              if (!this._wallList.contains(wall))
                this._wallList.append(wall);
            }
          }

          if ( x < (this._gridWidth - 1) )
          {
            ind = ((x + 1) << this._shift) | y;
            cellB = this._grid[ind] as SquareMazeCell;

            if ( cellB != null )
            {
              wall = new MazeWall(cellA, cellB);

              if (!this._wallList.contains(wall))
                this._wallList.append(wall);
            }
          }

          if ( y < (this._gridHeight - 1) )
          {
            ind = (x << this._shift) | (y + 1);
            cellB = this._grid[ind] as SquareMazeCell;

            if ( cellB != null )
            {
              wall = new MazeWall(cellA, cellB);

              if (!this._wallList.contains(wall))
                this._wallList.append(wall);
            }
          }
        }
      }

      var prng:Helpers.PseudoRandom = new Helpers.PseudoRandom();
      prng.seed =  a_seed > 0 ? a_seed : new Date().getTime();

      this._wallList.shuffle(prng);

      while ( this._wallList.size > 0 )
      {
        wall = this._wallList.removeHead();

        var indA:number = (wall.cellA.xPos << this._shift) | wall.cellA.yPos;
        var indB:number = (wall.cellB.xPos << this._shift) | wall.cellB.yPos;

        if (this._ds.findSet(indA) === this._ds.findSet(indB))
        {
          continue;
        }

        this._ds.mergeSet(indA, indB);

        if ( wall.cellA.xPos > wall.cellB.xPos )
        {
          wall.cellA.removeWall(SquareWall.Left);
          wall.cellB.removeWall(SquareWall.Right);
        }
        else if ( wall.cellA.yPos > wall.cellB.yPos )
        {
          wall.cellA.removeWall(SquareWall.Top);
          wall.cellB.removeWall(SquareWall.Bottom);
        }
        else if ( wall.cellA.xPos < wall.cellB.xPos )
        {
          wall.cellA.removeWall(SquareWall.Right);
          wall.cellB.removeWall(SquareWall.Left);
        }
        else if ( wall.cellA.yPos < wall.cellB.yPos )
        {
          wall.cellA.removeWall(SquareWall.Bottom);
          wall.cellB.removeWall(SquareWall.Top);
        }
      }

      var outerWall:SquareWall = prng.nextIntRange(0, 3); 
      
      switch(outerWall)
      {
        case SquareWall.Top:
          break;
        case SquareWall.Right:
          break;
        case SquareWall.Bottom:
          break;
        case SquareWall.Left:
          break;
      }

      // Add start.
      this._startCell = this.createExitCell(prng);

      // Add finish.
      this._endCell = this.createExitCell(prng);
      while(this._startCell == this._endCell)
      {
        this._endCell = this.createExitCell(prng);
      }
    }

    private createExitCell(a_prng:Helpers.PseudoRandom):MazeCell
    {
      var outerWall:SquareWall = a_prng.nextIntRange(0, 3); 
      
      switch(outerWall)
      {
        case SquareWall.Top:
          var xPos = a_prng.nextIntRange(0, this._gridWidth-1);
          return this.getCell(xPos, 0);
        case SquareWall.Right:
          var yPos = a_prng.nextIntRange(0, this._gridHeight-1);
          return this.getCell(this._gridWidth-1, yPos);
        case SquareWall.Bottom:
          var xPos = a_prng.nextIntRange(0, this._gridWidth-1);
          return this.getCell(xPos, this._gridHeight-1);
        case SquareWall.Left:
          var yPos = a_prng.nextIntRange(0, this._gridHeight-1);
          return this.getCell(0, yPos);
      }
    }

    public render(a_g:CanvasRenderingContext2D, a_scale:number):void
    {
      a_g.strokeStyle = "#000000";
      a_g.lineWidth = 0.5;

      a_g.beginPath();

      for ( var x:number = 0; x < this._gridWidth; x++ )
      {
        for ( var y:number = 0; y < this._gridHeight; y++ )
        {
          var cell:SquareMazeCell = this.getCell(x, y) as SquareMazeCell;
          this.renderWalls(a_g, cell, a_scale);
        }
      }

      a_g.stroke();

      if(this.startCell)
      {
        a_g.fillStyle = "#008800";
        a_g.beginPath();
        this.startCell.render(a_g, a_scale);
        a_g.fill();
      }

      if(this.endCell)
      {
        a_g.fillStyle = "#880000";
        a_g.beginPath();
        this.endCell.render(a_g, a_scale);
        a_g.fill();
      }
    }

    public getCell(a_x:number, a_y:number):MazeCell
    {
      var ind:number = (a_x << this._shift) | a_y;
      return this._grid[ind];
    }//end getCell()

    private renderWalls(a_g:CanvasRenderingContext2D, a_cell:MazeCell, a_scale:number):void
    {
      var xOffset:number = a_cell.xPos * a_scale;
      var yOffset:number = a_cell.yPos * a_scale;

      var penX:number = xOffset;
      var penY:number = yOffset;

      a_g.moveTo(penX, penY);

      penX += a_scale;
      if ( a_cell.hasWall(SquareWall.Top) )
      {
        a_g.lineTo(penX, penY);
      }
      else
      {
        a_g.moveTo(penX, penY);
      }

      penY += a_scale;
      if ( a_cell.hasWall(SquareWall.Right) )
      {
        a_g.lineTo(penX, penY);
      }
      else
      {
        a_g.moveTo(penX, penY);
      }

      penX = xOffset;
      if ( a_cell.hasWall(SquareWall.Bottom) )
      {
        a_g.lineTo(penX, penY);
      }
      else
      {
        a_g.moveTo(penX, penY);
      }

      penY = yOffset;
      if ( a_cell.hasWall(SquareWall.Left) )
      {
        a_g.lineTo(penX, penY);
      }
      else
      {
        a_g.moveTo(penX, penY);
      }

    }
  }

  class WallList extends DataStructures.LinkedList
  {
    public contains(a_data:any):Boolean
    {
      var node:DataStructures.ListNode = this.head;

      while (node != null)
      {
        if (node.data.equals(a_data))
          return true;
        node = node.next;
      }
      return false;
    }

    public nodeOf(a_data:any, a_from:DataStructures.ListNode = null):DataStructures.ListNode
    {
      var node:DataStructures.ListNode = a_from == null ? this.head : a_from;

      while (node != null)
      {
        if (node.data.equals(a_data)) break;
        node = node.next;
      }
      return node;
    }
  }
}
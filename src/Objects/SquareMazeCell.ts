module Maze.Objects
{
  export const enum SquareWall
  {
    Top = 0,
    Right = 1,
    Bottom = 2,
    Left = 3
  }

  export class SquareMazeCell extends MazeCell
  {
    constructor(a_x:number, a_y:number)
    {
      super();

      this.xPos = a_x;
      this.yPos = a_y;
    }

    protected initialize():void
    {
      // TOP
      this._wallList.push(true);

      // RIGHT
      this._wallList.push(true);

      // BOTTOM
      this._wallList.push(true);

      // LEFT
      this._wallList.push(true);
    }

    public removeWall(a_ind:number):void
    {
      if ( a_ind >= 0 && a_ind < this._wallList.length )
      {
        this._wallList[a_ind] = false;
      }
    }

    public hasWall(a_ind:number):Boolean
    {
      if ( a_ind >= 0 && a_ind < this._wallList.length )
      {
        return this._wallList[a_ind];
      }
      else return false;
    }

    public render(a_g:CanvasRenderingContext2D, a_scale:number):void
    {
      var xOffset:number = this.xPos * a_scale;
      var yOffset:number = this.yPos * a_scale;

      var penX:number = xOffset;
      var penY:number = yOffset;

      a_g.moveTo(penX, penY);

      penX += a_scale;
      a_g.lineTo(penX, penY);

      penY += a_scale;
      a_g.lineTo(penX, penY);

      penX = xOffset;
      a_g.lineTo(penX, penY);

      penY = yOffset;
      a_g.lineTo(penX, penY);
    }
  }
}
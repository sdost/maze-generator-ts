module Maze.Objects
{
  export class MazeCell
  {
    public xPos:number;
    public yPos:number;

    protected _wallList:Array<Boolean>;

    constructor()
    {
      this._wallList = new Array<Boolean>();
      this.initialize();
    }

    protected initialize():void
    {
      // For override.
    }

    public removeWall(a_ind:number):void
    {
      // For override.
    }

    public hasWall(a_ind:number):Boolean
    {
      // For override.
      return false;
    }

    public render(a_g:CanvasRenderingContext2D, a_scale:number):void
    {
      // For override
    }

    public walls():number
    {
      return this._wallList.length;
    }
  }
}
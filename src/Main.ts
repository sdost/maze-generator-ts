module Maze
{
  export class Main
  {
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;

    private _maze:Objects.MazeGrid;
    private _solver:Objects.MazeSolver;

    constructor(a_canvas: HTMLCanvasElement)
    {
      this._canvas = a_canvas;
      this._context = this._canvas.getContext("2d");
    }

    public generateMaze(a_width:number, a_height:number, a_seed:number):void
    {
      this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

      this._maze = new Objects.SquareMazeGrid(a_width, a_height);
      this._maze.generate(a_seed);

      var scale:number = 1;
      if (a_height < a_width) scale = this._canvas.width / a_width;
      else scale = this._canvas.height / a_height;

      this._maze.render(this._context, scale);
    }

    public solveMaze():void
    {
      this._solver = new Objects.SquareMazeSolver(this._maze);
      this._solver.solve();

      var scale:number = 1;
      if (this._maze.height < this._maze.width) scale = this._canvas.width / this._maze.width;
      else scale = this._canvas.height / this._maze.height;

      this._solver.render(this._context, scale);
    }
  }
}
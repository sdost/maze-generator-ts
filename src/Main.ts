import { MazeGrid } from "./Objects/MazeGrid";
import { MazeSolver } from "./Objects/MazeSolver";
import { SquareMazeGrid } from "./Objects/SquareMazeGrid";
import { SquareMazeSolver } from "./Objects/SquareMazeSolver";

export default class Main {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private maze: MazeGrid;
  private solver: MazeSolver;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
  }

  public generateMaze(width: number, height: number, seed: number): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.maze = new SquareMazeGrid(width, height);
    this.maze.generate(seed);

    let scale: number = 1;
    if (height < width) {
      scale = this.canvas.width / width;
    } else {
      scale = this.canvas.height / height;
    }

    this.maze.render(this.context, scale);
  }

  public solveMaze(): void {
    this.solver = new SquareMazeSolver(this.maze);
    this.solver.solve();

    let scale: number = 1;
    if (this.maze.height < this.maze.width) {
      scale = this.canvas.width / this.maze.width;
    } else {
      scale = this.canvas.height / this.maze.height;
    }

    this.solver.render(this.context, scale);
  }
}

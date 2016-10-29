import { LinkedList } from "./DataStructures/LinkedList";
import { SquareMazeCell, SquareMazeGrid } from "./Objects/SquareMazeGrid";
import { SquareMazeRenderer } from "./Objects/SquareMazeRenderer";
import { SquareMazeSolver } from "./Objects/SquareMazeSolver";

export default class Main {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private maze: SquareMazeGrid;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
  }

  public generateMaze(width: number, height: number, seed: number): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.maze = SquareMazeGrid.generate(width, height, seed);

    let scale: number = 1;
    if (height < width) {
      scale = this.canvas.width / width;
    } else {
      scale = this.canvas.height / height;
    }

    SquareMazeRenderer.renderGrid(this.context, this.maze, scale);
  }

  public solveMaze(): void {
    let path: LinkedList<SquareMazeCell> = SquareMazeSolver.solve(this.maze);

    let scale: number = 1;
    if (this.maze.height < this.maze.width) {
      scale = this.canvas.width / this.maze.width;
    } else {
      scale = this.canvas.height / this.maze.height;
    }

    SquareMazeRenderer.renderPath(this.context, path, scale);
  }
}

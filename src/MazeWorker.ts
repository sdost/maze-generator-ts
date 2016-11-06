import { SquareMazeGrid } from "./Objects/SquareMazeGrid";
import { SquareMazeRenderer } from "./Objects/SquareMazeRenderer";
import { SquareMazeSolver } from "./Objects/SquareMazeSolver";

export class MazeWorker {
  private maze: SquareMazeGrid;
  private solution: SquareMazeSolver;

  public generateMaze(width: number, height: number, seed: number): void {
    this.solution = null;
    this.maze = SquareMazeGrid.generate(width, height, seed);
  }

  public iterateMaze(): boolean {
    if (this.maze) {
      return this.maze.iterate();
    } else {
      return false;
    }
  }

  public solveMaze(): void {
    if (this.maze) {
      this.solution = SquareMazeSolver.solve(this.maze);
    }
  }

  public iterateSolution(): boolean {
    if (this.solution) {
      return this.solution.iterate();
    } else {
      return false;
    }
  }

  public render(img: ImageData): ImageData {
    if (this.maze) {
      let hScale = Math.floor(img.width / this.maze.width);
      let vScale = Math.floor(img.height / this.maze.height);

      SquareMazeRenderer.renderGrid(img, this.maze, (hScale < vScale) ? hScale : vScale);

      if (this.solution) {
        SquareMazeRenderer.renderPath(img, this.solution.path, (hScale < vScale) ? hScale : vScale);
      }
    }

    return img;
  }
}

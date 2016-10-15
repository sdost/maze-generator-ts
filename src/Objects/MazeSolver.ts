import { LinkedList } from "../DataStructures/LinkedList";
import { MazeGrid } from "./MazeGrid";

export abstract class MazeSolver {
  protected maze: MazeGrid;
  protected path: LinkedList;

  constructor(maze: MazeGrid) {
    this.maze = maze;
    this.path = new LinkedList();

    this.path.append(this.maze.startCell);
  }

  public abstract solve(): void;

  public abstract render(context: CanvasRenderingContext2D, scale: number): void;
}

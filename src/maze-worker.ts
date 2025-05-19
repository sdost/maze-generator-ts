import { SquareMazeGrid } from './objects/square-maze-grid';
import { MazeConfig } from './types/maze';
import { MazeSolver } from './objects/maze-solver';
import { MazeRenderer } from './objects/maze-renderer';
import { Solution } from './types/maze';
import { MazeGenerationError } from './errors/maze-errors';

export class MazeWorker {
  private maze: SquareMazeGrid | null = null;
  private solver: MazeSolver | null = null;
  private solution: Solution | null = null;
  private renderer: MazeRenderer | null = null;
  private isGenerating: boolean = false;

  constructor(private canvas: HTMLCanvasElement) {}

  public generateMaze(width: number, height: number, seed: number): void {
    this.solver = null;
    this.solution = null;
    this.isGenerating = true;
    const config: MazeConfig = {
      width,
      height,
      seed,
      algorithm: 'kruskal',
      renderer: 'webgl',
      animationSpeed: 100,
      cellSize: 20
    };
    this.maze = SquareMazeGrid.generate(config);
    this.renderer = new MazeRenderer(this.canvas, this.maze);
  }

  public iterateMaze(): boolean {
    if (this.maze) {
      const done = this.maze.iterate();
      if (this.renderer) {
        this.renderer.render();
      }
      if (done) {
        this.isGenerating = false;
      }
      return done;
    }
    return false;
  }

  public solveMaze(): void {
    if (!this.maze) {
      throw new MazeGenerationError('Maze not generated');
    }
    if (this.isGenerating) {
      throw new MazeGenerationError('Maze generation not complete');
    }
    this.solver = new MazeSolver(this.maze);
  }

  public iterateSolution(): boolean {
    if (this.solver) {
      const done = this.solver.iterate();
      if (this.renderer) {
        this.renderer.renderSolvingProgress(
          this.solver.getCurrentPath(),
          this.solver.getOpenSet(),
          this.solver.getClosedSet()
        );
      }
      if (done) {
        this.solution = this.solver.getSolution();
        if (this.solution && this.renderer) {
          this.renderer.renderSolution(this.solution);
        }
        this.solver = null;
      }
      return done;
    }
    return false;
  }

  public render(): void {
    if (this.renderer) {
      this.renderer.render();
      if (this.solution) {
        this.renderer.renderSolution(this.solution);
      }
    }
  }
}

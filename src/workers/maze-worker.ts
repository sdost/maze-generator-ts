import { MazeConfig, Solution } from '../types/maze';
import { SquareMazeGrid } from '../objects/square-maze-grid';
import { MazeSolver } from '../objects/maze-solver';

interface WorkerMessage {
  type: 'generate' | 'iterate' | 'solve' | 'iterateSolution';
  payload?: any;
}

interface WorkerResponse {
  type: 'progress' | 'complete' | 'error';
  payload: any;
}

export class MazeWorker {
  private maze: SquareMazeGrid | null = null;
  private solver: MazeSolver | null = null;
  private solution: Solution | null = null;
  private isGenerating: boolean = false;

  constructor(private worker: Worker) {
    this.setupMessageHandler();
  }

  private setupMessageHandler(): void {
    this.worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      try {
        const { type, payload } = event.data;
        switch (type) {
          case 'generate':
            this.handleGenerate(payload);
            break;
          case 'iterate':
            this.handleIterate();
            break;
          case 'solve':
            this.handleSolve();
            break;
          case 'iterateSolution':
            this.handleIterateSolution();
            break;
          default:
            this.sendError(`Unknown message type: ${type}`);
        }
      } catch (error) {
        this.sendError(error instanceof Error ? error.message : 'Unknown error');
      }
    };
  }

  private handleGenerate(config: MazeConfig): void {
    try {
      this.solver = null;
      this.solution = null;
      this.isGenerating = true;
      this.maze = SquareMazeGrid.generate(config);
      this.sendProgress('generate', { done: false });
    } catch (error) {
      this.sendError(error instanceof Error ? error.message : 'Failed to generate maze');
    }
  }

  private handleIterate(): void {
    if (!this.maze) {
      this.sendError('Maze not generated');
      return;
    }

    const done = this.maze.iterate();
    this.sendProgress('iterate', {
      done
    });

    if (done) {
      this.isGenerating = false;
      this.sendComplete('generate', { maze: this.maze });
    }
  }

  private handleSolve(): void {
    if (!this.maze) {
      this.sendError('Maze not generated');
      return;
    }
    if (this.isGenerating) {
      this.sendError('Maze generation not complete');
      return;
    }

    this.solver = new MazeSolver(this.maze);
    this.sendProgress('solve', { done: false });
  }

  private handleIterateSolution(): void {
    if (!this.solver) {
      this.sendError('Solver not initialized');
      return;
    }

    const done = this.solver.iterate();
    this.sendProgress('iterateSolution', {
      done,
      currentPath: this.solver.getCurrentPath(),
      openSet: this.solver.getOpenSet(),
      closedSet: this.solver.getClosedSet()
    });

    if (done) {
      this.solution = this.solver.getSolution();
      this.sendComplete('solve', { solution: this.solution });
      this.solver = null;
    }
  }

  private sendProgress(type: string, payload: any): void {
    this.worker.postMessage({
      type: 'progress',
      payload: { type, ...payload }
    } as WorkerResponse);
  }

  private sendComplete(type: string, payload: any): void {
    this.worker.postMessage({
      type: 'complete',
      payload: { type, ...payload }
    } as WorkerResponse);
  }

  private sendError(message: string): void {
    this.worker.postMessage({
      type: 'error',
      payload: { message }
    } as WorkerResponse);
  }
}
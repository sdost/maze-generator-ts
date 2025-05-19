import { MazeConfig, Solution } from '../types/maze';
import { MazeRenderer } from '../objects/maze-renderer';
import { SquareMazeGrid } from '../objects/square-maze-grid';

interface WorkerResponse {
  type: 'progress' | 'complete' | 'error';
  payload: {
    type?: string;
    currentState?: SquareMazeGrid;
    currentPath?: Solution;
    openSet?: Set<string>;
    closedSet?: Set<string>;
    maze?: SquareMazeGrid;
    solution?: Solution;
    message?: string;
  };
}

export class MazeWorkerManager {
  private worker: Worker;
  private renderer: MazeRenderer | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private onError: (error: string) => void
  ) {
    this.worker = new Worker(new URL('./maze-worker.ts', import.meta.url));
    this.setupMessageHandler();
  }

  private setupMessageHandler(): void {
    this.worker.onmessage = (event: MessageEvent<WorkerResponse>): void => {
      const { type, payload } = event.data;
      switch (type) {
        case 'progress':
          this.handleProgress(payload);
          break;
        case 'complete':
          this.handleComplete(payload);
          break;
        case 'error':
          this.onError(payload.message || 'Unknown error');
          break;
      }
    };
  }

  private handleProgress(payload: WorkerResponse['payload']): void {
    const { type, currentState, currentPath, openSet, closedSet } = payload;

    if (this.renderer) {
      switch (type) {
        case 'generate':
          // Handle generation progress
          break;
        case 'iterate':
          if (currentState) {
            this.renderer.render();
          }
          break;
        case 'solve':
          // Handle solving progress
          break;
        case 'iterateSolution':
          if (currentPath && openSet && closedSet) {
            this.renderer.renderSolvingProgress(currentPath, openSet, closedSet);
          }
          break;
      }
    }
  }

  private handleComplete(payload: WorkerResponse['payload']): void {
    const { type, maze, solution } = payload;

    if (this.renderer) {
      switch (type) {
        case 'generate':
          if (maze) {
            this.renderer = new MazeRenderer(this.canvas, maze);
            this.renderer.render();
          }
          break;
        case 'solve':
          if (solution) {
            this.renderer.renderSolution(solution);
          }
          break;
      }
    }
  }

  public generateMaze(config: MazeConfig): void {
    this.worker.postMessage({ type: 'generate', payload: config });
  }

  public iterateMaze(): void {
    this.worker.postMessage({ type: 'iterate' });
  }

  public solveMaze(): void {
    this.worker.postMessage({ type: 'solve' });
  }

  public iterateSolution(): void {
    this.worker.postMessage({ type: 'iterateSolution' });
  }

  public terminate(): void {
    this.worker.terminate();
  }
}

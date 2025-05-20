import { MazeConfig, Solution, Position } from '../types/maze';
import { MazeRenderer } from '../objects/maze-renderer';
import { SquareMazeGrid } from '../objects/square-maze-grid';

interface WorkerResponse {
  type: 'progress' | 'complete' | 'error';
  payload: {
    type?: string;
    currentState?: {
      _cells: Array<{
        position: Position;
        walls: boolean[];
      }>;
      startCell?: { position: Position };
      endCell?: { position: Position };
    };
    currentPath?: Position[];
    openSet?: Position[];
    closedSet?: Position[];
    maze?: {
      _cells: Array<{
        position: Position;
        walls: boolean[];
      }>;
      startCell?: { position: Position };
      endCell?: { position: Position };
    };
    solution?: Solution;
    message?: string;
  };
}

export class MazeWorkerManager {
  private worker: Worker | null = null;
  private renderer: MazeRenderer | null = null;
  private currentConfig: MazeConfig | null = null;
  private animationFrameId: number | null = null;
  private isAnimating = false;
  private isSolving = false;
  public onGenerationComplete?: () => void;
  public onSolveComplete?: () => void;
  private onError?: (error: string) => void;

  constructor(
    private canvas: HTMLCanvasElement,
    onError: (error: string) => void
  ) {
    this.onError = onError;
    this.initializeWorker();
  }

  private initializeWorker(): void {
    // Use a relative path that Vite will handle during build
    this.worker = new Worker(new URL('./maze-worker.ts', import.meta.url), {
      type: 'module',
      name: 'maze-worker',
    });
    this.setupMessageHandler();
  }

  private setupMessageHandler(): void {
    if (!this.worker) return;

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
          console.error('Worker error:', payload.message);
          this.onError?.(payload.message || 'An error occurred during maze generation');
          break;
      }
    };

    this.worker.onerror = (error: ErrorEvent): void => {
      console.error('Worker error event:', error);
      this.onError?.(error.message || 'An error occurred in the worker');
    };
  }

  private reconstructMaze(mazeData: WorkerResponse['payload']['currentState']): SquareMazeGrid {
    if (!this.currentConfig) {
      throw new Error('No current config available for maze reconstruction');
    }

    const maze = new SquareMazeGrid(this.currentConfig);

    // Copy the cells and their walls
    if (Array.isArray(mazeData?._cells)) {
      for (let i = 0; i < mazeData._cells.length; i++) {
        const cellData = mazeData._cells[i];
        if (!cellData || !cellData.position) {
          console.error('Invalid cell data at index', i, cellData);
          continue;
        }

        const cell = maze.getCell(cellData.position.x, cellData.position.y);
        if (cell && Array.isArray(cellData.walls)) {
          // Remove walls that are not present in the original cell
          for (let wall = 0; wall < 4; wall++) {
            if (!cellData.walls[wall]) {
              cell.removeWall(wall);
            }
          }
        }
      }
    } else {
      console.error('Invalid cells array in maze data:', mazeData?._cells);
    }

    // Set start and end cells
    if (mazeData?.startCell?.position) {
      const startCell = maze.getCell(mazeData.startCell.position.x, mazeData.startCell.position.y);
      if (startCell) {
        maze.setStartCell(startCell);
      }
    }

    if (mazeData?.endCell?.position) {
      const endCell = maze.getCell(mazeData.endCell.position.x, mazeData.endCell.position.y);
      if (endCell) {
        maze.setEndCell(endCell);
      }
    }

    return maze;
  }

  private handleProgress(payload: WorkerResponse['payload']): void {
    const { type, currentState, currentPath, openSet, closedSet } = payload;

    switch (type) {
      case 'generate':
        if (currentState) {
          const maze = this.reconstructMaze(currentState);
          if (!this.renderer) {
            this.renderer = new MazeRenderer(this.canvas, maze);
          } else {
            this.renderer.updateMaze(maze);
          }
          this.renderer.render();
        }
        break;
      case 'iterate':
        if (currentState) {
          const maze = this.reconstructMaze(currentState);
          if (this.renderer) {
            this.renderer.updateMaze(maze);
            this.renderer.render();
          }
        }
        break;
      case 'solve':
      case 'iterateSolution':
        if (this.renderer && currentPath && openSet && closedSet) {
          this.renderer.renderSolvingProgress(currentPath, openSet, closedSet);
        }
        break;
    }
  }

  private handleComplete(payload: WorkerResponse['payload']): void {
    const { type, maze, solution } = payload;

    switch (type) {
      case 'generate':
        if (maze) {
          const reconstructedMaze = this.reconstructMaze(maze);
          if (!this.renderer) {
            this.renderer = new MazeRenderer(this.canvas, reconstructedMaze);
          } else {
            this.renderer.updateMaze(reconstructedMaze);
          }
          this.renderer.render();
          this.isAnimating = false;
          if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
          }
          if (this.onGenerationComplete) {
            this.onGenerationComplete();
          }
        }
        break;
      case 'solve':
        if (solution && this.renderer) {
          this.renderer.renderSolution(solution);
          this.isSolving = false;
          if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
          }
          if (this.onSolveComplete) {
            this.onSolveComplete();
          }
        }
        break;
    }
  }

  public generateMaze(config: MazeConfig): void {
    this.currentConfig = config;
    this.isAnimating = true;
    this.worker?.postMessage({ type: 'generate', payload: config });
    this.startAnimation();
  }

  private startAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const animate = (): void => {
      if (this.isAnimating) {
        this.worker?.postMessage({ type: 'iterate' });
        this.animationFrameId = requestAnimationFrame(animate);
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  public solveMaze(): void {
    if (this.isSolving) {
      return;
    }
    this.isSolving = true;
    this.worker?.postMessage({ type: 'solve' });
    this.startSolvingAnimation();
  }

  private startSolvingAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const animate = (): void => {
      if (this.isSolving) {
        this.worker?.postMessage({ type: 'iterateSolution' });
        this.animationFrameId = requestAnimationFrame(animate);
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  public terminate(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.isAnimating = false;
    this.isSolving = false;
    this.worker?.terminate();
  }
}

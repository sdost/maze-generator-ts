import { MazeConfig, Solution, Position } from '../types/maze';
import { SquareMazeGrid } from '../objects/square-maze-grid';
import { MazeSolver } from '../objects/maze-solver';

interface WorkerMessage {
  type: 'generate' | 'iterate' | 'solve' | 'iterateSolution';
  payload?: MazeConfig;
}

interface WorkerResponse {
  type: 'progress' | 'complete' | 'error';
  payload: {
    type?: string;
    done?: boolean;
    maze?: {
      _cells: Array<{
        position: Position;
        walls: boolean[];
      }>;
      startCell?: { position: Position };
      endCell?: { position: Position };
    };
    solution?: Solution;
    currentPath?: Position[];
    openSet?: Position[];
    closedSet?: Position[];
    message?: string;
    currentState?: {
      _cells: Array<{
        position: Position;
        walls: boolean[];
      }>;
      startCell?: { position: Position };
      endCell?: { position: Position };
    };
  };
}

class MazeWorker {
  private maze: SquareMazeGrid | null = null;
  private solver: MazeSolver | null = null;
  private isGenerating: boolean = false;

  constructor() {
    this.setupMessageHandler();
  }

  private setupMessageHandler(): void {
    self.onmessage = (event: MessageEvent<WorkerMessage>): void => {
      try {
        const { type, payload } = event.data;
        switch (type) {
          case 'generate':
            this.handleGenerate(payload as MazeConfig);
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
        console.error('Worker error:', error);
        this.sendError(error instanceof Error ? error.message : 'Unknown error');
      }
    };
  }

  private serializeMaze(maze: SquareMazeGrid): WorkerResponse['payload']['maze'] {
    return {
      _cells: maze.cells.map((cell) => ({
        position: { x: cell.position.x, y: cell.position.y },
        walls: Array.from(cell.walls),
      })),
      startCell: maze.getStartCell()
        ? {
            position: { x: maze.getStartCell().position.x, y: maze.getStartCell().position.y },
          }
        : undefined,
      endCell: maze.getEndCell()
        ? {
            position: { x: maze.getEndCell().position.x, y: maze.getEndCell().position.y },
          }
        : undefined,
    };
  }

  private handleGenerate(config: MazeConfig): void {
    try {
      this.solver = null;
      this.isGenerating = true;
      this.maze = SquareMazeGrid.generate(config);
      const serializedMaze = this.serializeMaze(this.maze);
      this.sendProgress('generate', {
        done: false,
        currentState: serializedMaze,
      });
    } catch (error) {
      console.error('Error generating maze:', error);
      this.sendError(error instanceof Error ? error.message : 'Failed to generate maze');
    }
  }

  private handleIterate(): void {
    if (!this.maze) {
      this.sendError('Maze not generated');
      return;
    }

    try {
      const done = this.maze.iterate();
      const serializedMaze = this.serializeMaze(this.maze);
      this.sendProgress('iterate', {
        done,
        currentState: serializedMaze,
      });

      if (done) {
        this.isGenerating = false;
        this.sendComplete('generate', { maze: serializedMaze });
      }
    } catch (error) {
      console.error('Error during iteration:', error);
      this.sendError(error instanceof Error ? error.message : 'Failed to iterate maze');
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

    try {
      this.solver = new MazeSolver(this.maze);

      // Send initial state
      const currentPath = this.solver.getCurrentPath();
      const openSet = this.solver.getOpenSet();
      const closedSet = this.solver.getClosedSet();

      this.sendProgress('solve', {
        done: false,
        currentPath,
        openSet,
        closedSet,
      });
    } catch (error) {
      console.error('Error initializing solver:', error);
      this.sendError(error instanceof Error ? error.message : 'Failed to initialize solver');
    }
  }

  private handleIterateSolution(): void {
    if (!this.solver) {
      this.sendError('Solver not initialized');
      return;
    }

    try {
      const done = this.solver.iterate();

      // Always send progress, even if done
      const currentPath = this.solver.getCurrentPath();
      const openSet = this.solver.getOpenSet();
      const closedSet = this.solver.getClosedSet();

      this.sendProgress('iterateSolution', {
        done,
        currentPath,
        openSet,
        closedSet,
      });

      if (done) {
        try {
          const solution = this.solver.getSolution();
          this.sendComplete('solve', { solution });
          this.solver = null;
        } catch (error) {
          console.error('Error getting solution:', error);
          this.sendError(error instanceof Error ? error.message : 'Failed to get solution');
        }
      }
    } catch (error) {
      console.error('Error during solution iteration:', error);
      this.sendError(error instanceof Error ? error.message : 'Failed to iterate solution');
    }
  }

  private sendProgress(type: string, payload: WorkerResponse['payload']): void {
    self.postMessage({
      type: 'progress',
      payload: { type, ...payload },
    } as WorkerResponse);
  }

  private sendComplete(type: string, payload: WorkerResponse['payload']): void {
    self.postMessage({
      type: 'complete',
      payload: { type, ...payload },
    } as WorkerResponse);
  }

  private sendError(message: string): void {
    console.error('Sending error:', message);
    self.postMessage({
      type: 'error',
      payload: { message },
    } as WorkerResponse);
  }
}

// Initialize the worker
new MazeWorker();

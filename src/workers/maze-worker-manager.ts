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
  private worker: Worker;
  private renderer: MazeRenderer | null = null;
  private currentConfig: MazeConfig | null = null;
  private animationFrameId: number | null = null;
  private isAnimating: boolean = false;
  private isSolving: boolean = false;
  public onGenerationComplete: (() => void) | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private onError: (error: string) => void
  ) {
    console.log('Creating worker manager');
    const workerUrl = new URL('./maze-worker.ts', import.meta.url);
    console.log('Worker URL:', workerUrl.toString());
    this.worker = new Worker(workerUrl, { type: 'module' });
    this.setupMessageHandler();
  }

  private setupMessageHandler(): void {
    console.log('Setting up worker message handler');
    this.worker.onmessage = (event: MessageEvent<WorkerResponse>): void => {
      console.log('Received worker message:', event.data);
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
          this.onError(payload.message || 'Unknown error');
          break;
      }
    };

    this.worker.onerror = (error: ErrorEvent): void => {
      console.error('Worker error event:', error);
      this.onError(error.message);
    };
  }

  private reconstructMaze(mazeData: WorkerResponse['payload']['currentState']): SquareMazeGrid {
    if (!this.currentConfig) {
      throw new Error('No current config available for maze reconstruction');
    }

    console.log('Reconstructing maze from data:', mazeData);
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
        console.log('Start cell position:', startCell.position);
      }
    }

    if (mazeData?.endCell?.position) {
      const endCell = maze.getCell(mazeData.endCell.position.x, mazeData.endCell.position.y);
      if (endCell) {
        maze.setEndCell(endCell);
        console.log('End cell position:', endCell.position);
      }
    }

    return maze;
  }

  private handleProgress(payload: WorkerResponse['payload']): void {
    console.log('Handling progress:', payload);
    const { type, currentState, currentPath, openSet, closedSet } = payload;

    switch (type) {
      case 'generate':
        if (currentState) {
          console.log('Creating renderer for generation progress');
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
          console.log('Updating renderer for iteration');
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
          console.log('Rendering solving progress:', { currentPath, openSet, closedSet });
          this.renderer.renderSolvingProgress(currentPath, openSet, closedSet);
        }
        break;
    }
  }

  private handleComplete(payload: WorkerResponse['payload']): void {
    console.log('Handling complete:', payload);
    const { type, maze, solution } = payload;

    switch (type) {
      case 'generate':
        if (maze) {
          console.log('Creating renderer for completed maze');
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
          console.log('Rendering solution:', solution);
          this.renderer.renderSolution(solution);
          this.isSolving = false;
          if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
          }
        }
        break;
    }
  }

  public generateMaze(config: MazeConfig): void {
    console.log('Sending generate message to worker:', config);
    this.currentConfig = config;
    this.isAnimating = true;
    this.worker.postMessage({ type: 'generate', payload: config });
    this.startAnimation();
  }

  private startAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const animate = (): void => {
      if (this.isAnimating) {
        this.worker.postMessage({ type: 'iterate' });
        this.animationFrameId = requestAnimationFrame(animate);
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  public solveMaze(): void {
    console.log('Starting maze solving');
    if (this.isSolving) {
      console.log('Already solving');
      return;
    }
    this.isSolving = true;
    this.worker.postMessage({ type: 'solve' });
    this.startSolvingAnimation();
  }

  private startSolvingAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const animate = (): void => {
      if (this.isSolving) {
        this.worker.postMessage({ type: 'iterateSolution' });
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
    this.worker.terminate();
  }
}

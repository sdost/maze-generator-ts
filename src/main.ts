import { MazeWorkerManager } from './workers/maze-worker-manager';
import { MazeGenerationError } from './errors/maze-errors';

class App {
  private workerManager: MazeWorkerManager;
  private isGenerating = false;
  private isSolving = false;

  constructor() {
    console.log('App constructor called');
    const canvas = document.getElementById('mazeCanvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    // Set canvas size
    canvas.width = 800;
    canvas.height = 800;

    this.workerManager = new MazeWorkerManager(canvas, (error: string): void => {
      console.error('Worker error:', error);
      alert(error);
      this.isGenerating = false;
      this.isSolving = false;
    });

    // Add callback for maze generation completion
    this.workerManager.onGenerationComplete = (): void => {
      console.log('Maze generation complete');
      this.isGenerating = false;
    };

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    console.log('Setting up event listeners');
    const generateBtn = document.getElementById('generate');
    const solveBtn = document.getElementById('solve');

    if (generateBtn) {
      console.log('Generate button found');
      generateBtn.addEventListener('click', (): void => {
        console.log('Generate button clicked');
        this.handleGenerate();
      });
    } else {
      console.error('Generate button not found');
    }
    if (solveBtn) {
      console.log('Solve button found');
      solveBtn.addEventListener('click', (): void => {
        console.log('Solve button clicked');
        this.handleSolve();
      });
    } else {
      console.error('Solve button not found');
    }
  }

  private handleGenerate(): void {
    console.log('handleGenerate called');
    if (this.isGenerating || this.isSolving) {
      console.log('Already generating or solving');
      return;
    }

    const width = parseInt((document.getElementById('width') as HTMLInputElement).value);
    const height = parseInt((document.getElementById('height') as HTMLInputElement).value);
    const seed = parseInt((document.getElementById('seed') as HTMLInputElement).value);

    console.log('Maze config:', { width, height, seed });

    if (isNaN(width) || isNaN(height) || isNaN(seed)) {
      alert('Please enter valid numbers for width, height, and seed');
      return;
    }

    try {
      this.isGenerating = true;
      console.log('Sending generate message to worker');
      this.workerManager.generateMaze({
        width,
        height,
        seed,
        algorithm: 'kruskal',
        renderer: 'canvas',
        animationSpeed: 100,
        cellSize: 20,
      });
    } catch (error) {
      console.error('Error in handleGenerate:', error);
      this.isGenerating = false;
      alert(error instanceof Error ? error.message : 'Failed to generate maze');
    }
  }

  private handleSolve(): void {
    console.log('handleSolve called');
    if (this.isGenerating || this.isSolving) {
      console.log('Already generating or solving');
      return;
    }

    try {
      console.log('Starting maze solving');
      this.isSolving = true;
      this.workerManager.solveMaze();
    } catch (error) {
      console.error('Error in handleSolve:', error);
      this.isSolving = false;
      if (error instanceof MazeGenerationError) {
        alert(error.message);
      } else {
        alert('Failed to solve maze');
      }
    }
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', (): void => {
  console.log('DOM loaded, initializing app');
  new App();
});

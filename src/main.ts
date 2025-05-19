import { MazeWorkerManager } from './workers/maze-worker-manager';
import { MazeGenerationError } from './errors/maze-errors';

class App {
  private workerManager: MazeWorkerManager;
  private isGenerating = false;
  private isSolving = false;

  constructor() {
    const canvas = document.getElementById('mazeCanvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    // Set canvas size
    canvas.width = 800;
    canvas.height = 800;

    this.workerManager = new MazeWorkerManager(canvas, (error) => {
      alert(error);
      this.isGenerating = false;
      this.isSolving = false;
    });
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    const generateBtn = document.getElementById('generate');
    const solveBtn = document.getElementById('solve');

    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.handleGenerate());
    }
    if (solveBtn) {
      solveBtn.addEventListener('click', () => this.handleSolve());
    }
  }

  private handleGenerate(): void {
    if (this.isGenerating || this.isSolving) return;

    const width = parseInt((document.getElementById('width') as HTMLInputElement).value);
    const height = parseInt((document.getElementById('height') as HTMLInputElement).value);
    const seed = parseInt((document.getElementById('seed') as HTMLInputElement).value);

    if (isNaN(width) || isNaN(height) || isNaN(seed)) {
      alert('Please enter valid numbers for width, height, and seed');
      return;
    }

    try {
      this.isGenerating = true;
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
      this.isGenerating = false;
      alert(error instanceof Error ? error.message : 'Failed to generate maze');
    }
  }

  private handleSolve(): void {
    if (this.isGenerating || this.isSolving) return;

    try {
      this.isSolving = true;
      this.workerManager.solveMaze();
    } catch (error) {
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
document.addEventListener('DOMContentLoaded', () => {
  new App();
});

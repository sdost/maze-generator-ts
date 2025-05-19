import { MazeWorker } from './maze-worker';
import { MazeGenerationError } from './errors/maze-errors';

class App {
  private worker: MazeWorker;
  private animationFrameId: number | null = null;
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

    this.worker = new MazeWorker(canvas);
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
      this.worker.generateMaze(width, height, seed);
      this.animateGeneration();
    } catch (error) {
      this.isGenerating = false;
      alert(error instanceof Error ? error.message : 'Failed to generate maze');
    }
  }

  private handleSolve(): void {
    if (this.isGenerating || this.isSolving) return;

    try {
      this.isSolving = true;
      this.worker.solveMaze();
      this.animateSolution();
    } catch (error) {
      this.isSolving = false;
      if (error instanceof MazeGenerationError) {
        alert(error.message);
      } else {
        alert('Failed to solve maze');
      }
    }
  }

  private animateGeneration(): void {
    try {
      const done = this.worker.iterateMaze();
      if (done) {
        this.isGenerating = false;
        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }
      } else {
        this.animationFrameId = requestAnimationFrame(() => this.animateGeneration());
      }
    } catch (error) {
      this.isGenerating = false;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      alert(error instanceof Error ? error.message : 'Failed to generate maze');
    }
  }

  private animateSolution(): void {
    try {
      const done = this.worker.iterateSolution();
      if (done) {
        this.isSolving = false;
        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }
      } else {
        this.animationFrameId = requestAnimationFrame(() => this.animateSolution());
      }
    } catch (error) {
      this.isSolving = false;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      alert(error instanceof Error ? error.message : 'Failed to solve maze');
    }
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
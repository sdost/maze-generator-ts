export interface Position {
  readonly x: number;
  readonly y: number;
}

export interface MazeConfig {
  readonly width: number;
  readonly height: number;
  readonly seed?: string | null;
  readonly algorithm: 'recursive' | 'kruskal' | 'prim';
  readonly renderer: 'canvas' | 'webgl';
  readonly animationSpeed: number;
  readonly cellSize: number;
}

export interface IMazeGenerator {
  generate(config: MazeConfig): Promise<MazeGrid>;
  iterate(): boolean;
}

export interface IMazeSolver {
  solve(maze: MazeGrid): Promise<Solution>;
  iterate(): boolean;
}

export interface IMazeRenderer {
  render(maze: MazeGrid, canvas: HTMLCanvasElement): void;
  renderSolution(solution: Solution, canvas: HTMLCanvasElement): void;
}

export interface Solution {
  readonly path: Position[];
  readonly start: Position;
  readonly end: Position;
}

export interface MazeCell {
  readonly position: Position;
  readonly walls: ReadonlyArray<boolean>;
  readonly visited: boolean;
  removeWall(index: number): void;
  hasWall(index: number): boolean;
}

export interface MazeGrid {
  readonly width: number;
  readonly height: number;
  readonly cells: ReadonlyArray<MazeCell>;
  getCell(x: number, y: number): MazeCell | null;
  getStartCell(): MazeCell;
  getEndCell(): MazeCell;
}

export interface IComparable {
  equals(other: IComparable): boolean;
}

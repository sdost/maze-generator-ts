import { MazeGrid, Position, Solution } from '../types/maze';
import { SquareMazeCell } from './square-maze-cell';
import { MazeSolvingError } from '../errors/maze-errors';

interface Node {
  cell: SquareMazeCell;
  parent: Node | null;
  g: number; // Cost from start to current
  h: number; // Heuristic (estimated cost from current to end)
  f: number; // Total cost (g + h)
}

export class MazeSolver {
  private openSet: Node[] = [];
  private closedSet: Set<SquareMazeCell> = new Set();
  private startCell: SquareMazeCell;
  private endCell: SquareMazeCell;
  private current: Node | null = null;
  private solutionFound: boolean = false;
  private currentPath: Position[] = [];

  constructor(private maze: MazeGrid) {
    this.startCell = maze.getStartCell() as SquareMazeCell;
    this.endCell = maze.getEndCell() as SquareMazeCell;
    this.initialize();
  }

  private initialize(): void {
    // Create initial node for start cell
    const startNode: Node = {
      cell: this.startCell,
      parent: null,
      g: 0,
      h: this.heuristic(this.startCell),
      f: this.heuristic(this.startCell),
    };

    this.openSet = [startNode];
    this.closedSet.clear();
    this.current = null;
    this.solutionFound = false;
    this.currentPath = [this.startCell.position];
  }

  private heuristic(cell: SquareMazeCell): number {
    // Manhattan distance to end cell
    return (
      Math.abs(cell.position.x - this.endCell.position.x) +
      Math.abs(cell.position.y - this.endCell.position.y)
    );
  }

  private getNeighbors(node: Node): SquareMazeCell[] {
    const neighbors: SquareMazeCell[] = [];
    const { cell } = node;

    // Check all four directions
    for (let wall = 0; wall < 4; wall++) {
      // If there's no wall in this direction, we can move there
      if (!cell.hasWall(wall)) {
        const neighborPos = cell.getNeighborPosition(wall);
        const neighbor = this.maze.getCell(neighborPos.x, neighborPos.y);

        // Only add valid neighbors that haven't been visited
        if (neighbor && !this.closedSet.has(neighbor as SquareMazeCell)) {
          neighbors.push(neighbor as SquareMazeCell);
        }
      }
    }

    return neighbors;
  }

  private updateCurrentPath(): void {
    this.currentPath = [];
    let node: Node | null = this.current;
    while (node) {
      this.currentPath.unshift(node.cell.position);
      node = node.parent;
    }
  }

  public getCurrentPath(): Position[] {
    return this.currentPath;
  }

  public getOpenSet(): Position[] {
    return this.openSet.map((node) => node.cell.position);
  }

  public getClosedSet(): Position[] {
    return Array.from(this.closedSet).map((cell) => cell.position);
  }

  public iterate(): boolean {
    // If we've already found a solution, return true
    if (this.solutionFound) {
      return true;
    }

    // If there are no more nodes to explore, no solution exists
    if (this.openSet.length === 0) {
      throw new MazeSolvingError('No solution exists for this maze');
    }

    // Get node with lowest f score
    this.current = this.openSet.reduce(
      (min, node) => (node.f < min.f ? node : min),
      this.openSet[0]
    );

    // Remove current from open set
    this.openSet = this.openSet.filter((node) => node !== this.current);

    // Add current to closed set
    this.closedSet.add(this.current.cell);

    // Update current path for animation
    this.updateCurrentPath();

    // Check if we reached the end
    if (this.current.cell === this.endCell) {
      this.solutionFound = true;
      return true;
    }

    // Process neighbors
    for (const neighbor of this.getNeighbors(this.current)) {
      const gScore = this.current.g + 1;
      const hScore = this.heuristic(neighbor);
      const fScore = gScore + hScore;

      // Check if this path to neighbor is better than previous ones
      const existingNode = this.openSet.find((n) => n.cell === neighbor);
      if (!existingNode || gScore < existingNode.g) {
        const newNode: Node = {
          cell: neighbor,
          parent: this.current,
          g: gScore,
          h: hScore,
          f: fScore,
        };

        if (!existingNode) {
          this.openSet.push(newNode);
        } else {
          Object.assign(existingNode, newNode);
        }
      }
    }

    return false;
  }

  public getSolution(): Solution {
    if (!this.solutionFound || !this.current || this.current.cell !== this.endCell) {
      throw new MazeSolvingError('No solution has been found yet');
    }

    return {
      path: this.currentPath,
      start: this.startCell.position,
      end: this.endCell.position,
    };
  }
}

import { LinkedList } from "../DataStructures/LinkedList";
import { MazeGrid } from "./MazeGrid";
import { SquareMazeCell, SquareWall } from "./SquareMazeGrid";

export class SquareMazeSolver {
  public static RIGHT_HAND: number = 0;
  public static LEFT_HAND: number = 1;

  public static solve(maze: MazeGrid): SquareMazeSolver {
    let solver = new SquareMazeSolver(maze);
    return solver;
  }

  private maze: MazeGrid;
  private facing: SquareWall;
  private currentPath: LinkedList<SquareMazeCell>;
  private currentCell: SquareMazeCell;

  constructor(maze: MazeGrid) {
    this.maze = maze;
    this.currentPath = new LinkedList<SquareMazeCell>();
    this.currentPath.append(this.maze.startCell as SquareMazeCell);

    if (this.maze.startCell.yPos === 0) {
      this.facing = SquareWall.Bottom;
    } else if (this.maze.startCell.xPos === this.maze.width - 1) {
      this.facing = SquareWall.Left;
    } else if (this.maze.startCell.yPos === this.maze.height - 1) {
      this.facing = SquareWall.Top;
    } else {
      this.facing = SquareWall.Right;
    }
  }

  public iterate(): boolean {
    if ( this.currentPath.contains(this.maze.endCell as SquareMazeCell) ) {
      return true;
    }

    let lastCell = this.currentCell;
    this.currentCell = this.currentPath.tail.data;

    let w: number = getRightHandWall(this.facing);
    if (!this.currentCell.hasWall(w)) {
      this.facing = w;
    } else if (this.currentCell.hasWall(this.facing)) {
        this.facing = getLeftHandWall(this.facing);
        return false;
    }

    this.advance(lastCell);
    return false;
  }

  public get path(): LinkedList<SquareMazeCell> {
    return this.currentPath;
  }

  private advance(lastCell: SquareMazeCell): void {
    let x = this.currentCell.xPos;
    let y = this.currentCell.yPos;

    switch (this.facing) {
      case SquareWall.Top:
        y--;
        break;
      case SquareWall.Bottom:
        y++;
        break;
      case SquareWall.Left:
        x--;
        break;
      case SquareWall.Right:
        x++;
        break;
      default:
        break;
    }
    let nextCell = this.maze.getCell(x, y) as SquareMazeCell;

    if (nextCell != null) {
      if (this.currentPath.contains(nextCell)) {
        this.currentPath.tail.unlink();
      } else if ( nextCell === lastCell ) {
        this.currentPath.tail.unlink();
      } else {
        this.currentPath.append(nextCell);
      }
    }
  }
}

function getRightHandWall(facing: SquareWall): SquareWall {
  switch (facing) {
    case SquareWall.Top:
      return SquareWall.Right;
    case SquareWall.Right:
      return SquareWall.Bottom;
    case SquareWall.Bottom:
      return SquareWall.Left;
    case SquareWall.Left:
      return SquareWall.Top;
    default:
      throw new Error();
  }
}

function getLeftHandWall(facing: SquareWall): SquareWall {
  switch (facing) {
    case SquareWall.Top:
      return SquareWall.Left;
    case SquareWall.Left:
      return SquareWall.Bottom;
    case SquareWall.Bottom:
      return SquareWall.Right;
    case SquareWall.Right:
      return SquareWall.Top;
    default:
      throw new Error();
  }
}

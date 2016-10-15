import { ListIterator } from "../DataStructures/LinkedList";
import { MazeCell } from "./MazeCell";
import { MazeGrid } from "./MazeGrid";
import { MazeSolver } from "./MazeSolver";
import { SquareMazeCell, SquareWall } from "./SquareMazeCell";

export class SquareMazeSolver extends MazeSolver {
  public static RIGHT_HAND: number = 0;
  public static LEFT_HAND: number = 1;

  private facing: number;

  constructor(maze: MazeGrid) {
    super(maze);
  }

  public solve(): void {
    if (this.maze.startCell.yPos === 0) {
      this.facing = SquareWall.Bottom;
    } else if (this.maze.startCell.xPos === this.maze.width - 1) {
      this.facing = SquareWall.Left;
    } else if (this.maze.startCell.yPos === this.maze.height - 1) {
      this.facing = SquareWall.Top;
    } else {
      this.facing = SquareWall.Right;
    }

    let cell: SquareMazeCell;
    let lastCell: SquareMazeCell;
    let nextCell: SquareMazeCell;
    let x: number;
    let y: number;
    while ( !this.path.contains(this.maze.endCell) ) {
      lastCell = cell;
      cell = this.path.tail.data;

      let w: number = this.getRightHandWall();
      if ( cell.hasWall(w) ) {
        if ( cell.hasWall(this.facing) ) {
          this.facing = this.getLeftHandWall();
        } else {
          x = cell.xPos;
          y = cell.yPos;

          if ( this.facing === SquareWall.Top ) {
            y--;
          } else if ( this.facing === SquareWall.Bottom ) {
            y++;
          } else if ( this.facing === SquareWall.Left ) {
            x--;
          } else if ( this.facing === SquareWall.Right ) {
            x++;
          }
          nextCell = this.maze.getCell(x, y) as SquareMazeCell;

          if (nextCell != null) {
            if (this.path.contains(nextCell)) {
              this.path.tail.unlink();
            } else if ( nextCell === lastCell ) {
              this.path.tail.unlink();
            } else {
              this.path.append(nextCell);
            }
          }
        }
      } else {
        this.facing = this.getRightHandWall();
        x = cell.xPos;
        y = cell.yPos;

        if ( this.facing === SquareWall.Top ) {
          y--;
        } else if ( this.facing === SquareWall.Bottom ) {
          y++;
        } else if ( this.facing === SquareWall.Left ) {
          x--;
        } else if ( this.facing === SquareWall.Right ) {
          x++;
        }
        nextCell = this.maze.getCell(x, y) as SquareMazeCell;

        if (nextCell != null) {
          if (this.path.contains(nextCell)) {
            this.path.tail.unlink();
          } else if ( nextCell === lastCell ) {
            this.path.tail.unlink();
          } else {
            this.path.append(nextCell);
          }
        }
      }
    }
  }

  public render(context: CanvasRenderingContext2D, scale: number): void {
    context.fillStyle = "#33888866";

    context.beginPath();

    let itr: ListIterator = this.path.iterator;
    while (itr.hasNext()) {
      let cell: MazeCell = itr.next();
      cell.render(context, scale);
    }

    context.fill();
  }

  private getRightHandWall(): number {
    if (this.facing === SquareWall.Top) {
      return SquareWall.Right;
    }

    if (this.facing === SquareWall.Right) {
      return SquareWall.Bottom;
    }

    if (this.facing === SquareWall.Bottom) {
      return SquareWall.Left;
    }

    if (this.facing === SquareWall.Left) {
      return SquareWall.Top;
    }

    return Number.NaN;
  }

  private getLeftHandWall(): number {
    if (this.facing === SquareWall.Top) {
      return SquareWall.Left;
    }

    if (this.facing === SquareWall.Left) {
      return SquareWall.Bottom;
    }

    if (this.facing === SquareWall.Bottom) {
      return SquareWall.Right;
    }

    if (this.facing === SquareWall.Right) {
      return SquareWall.Top;
    }

    return Number.NaN;
  }
}

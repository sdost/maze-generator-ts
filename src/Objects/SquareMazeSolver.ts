import { LinkedList } from "../DataStructures/LinkedList";
import { MazeGrid } from "./MazeGrid";
import { SquareMazeCell, SquareWall } from "./SquareMazeGrid";

export class SquareMazeSolver {
  public static RIGHT_HAND: number = 0;
  public static LEFT_HAND: number = 1;

  public static solve(maze: MazeGrid): LinkedList<SquareMazeCell> {
    let facing: SquareWall;
    let path: LinkedList<SquareMazeCell> = new LinkedList<SquareMazeCell>();
    path.append(maze.startCell as SquareMazeCell);

    if (maze.startCell.yPos === 0) {
      facing = SquareWall.Bottom;
    } else if (maze.startCell.xPos === maze.width - 1) {
      facing = SquareWall.Left;
    } else if (maze.startCell.yPos === maze.height - 1) {
      facing = SquareWall.Top;
    } else {
      facing = SquareWall.Right;
    }

    let cell: SquareMazeCell;
    let lastCell: SquareMazeCell;
    let nextCell: SquareMazeCell;
    let x: number;
    let y: number;
    while ( !path.contains(maze.endCell as SquareMazeCell) ) {
      lastCell = cell;
      cell = path.tail.data;

      let w: number = SquareMazeSolver.getRightHandWall(facing);
      if ( cell.hasWall(w) ) {
        if ( cell.hasWall(facing) ) {
          facing = SquareMazeSolver.getLeftHandWall(facing);
        } else {
          x = cell.xPos;
          y = cell.yPos;

          switch (facing) {
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
          nextCell = maze.getCell(x, y) as SquareMazeCell;

          if (nextCell != null) {
            if (path.contains(nextCell)) {
              path.tail.unlink();
            } else if ( nextCell === lastCell ) {
              path.tail.unlink();
            } else {
              path.append(nextCell);
            }
          }
        }
      } else {
        facing = SquareMazeSolver.getRightHandWall(facing);
        x = cell.xPos;
        y = cell.yPos;

        switch (facing) {
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
        nextCell = maze.getCell(x, y) as SquareMazeCell;

        if (nextCell != null) {
          if (path.contains(nextCell)) {
            path.tail.unlink();
          } else if ( nextCell === lastCell ) {
            path.tail.unlink();
          } else {
            path.append(nextCell);
          }
        }
      }
    }

    return path;
  }

  private static getRightHandWall(facing: SquareWall): SquareWall {
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

  private static getLeftHandWall(facing: SquareWall): SquareWall {
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
}

import { Position } from '../types/maze';
import { BaseMazeCell } from './base-maze-cell';

export enum SquareWall {
  Top = 0,
  Right = 1,
  Bottom = 2,
  Left = 3,
}

export class SquareMazeCell extends BaseMazeCell {
  private static readonly WALL_COUNT = 4;

  constructor(position: Position) {
    super(position, SquareMazeCell.WALL_COUNT);
  }

  public removeWall(wall: SquareWall): void {
    super.removeWall(wall);
  }

  public hasWall(wall: SquareWall): boolean {
    return super.hasWall(wall);
  }

  public getNeighborPosition(wall: SquareWall): Position {
    const { x, y } = this.position;
    switch (wall) {
      case SquareWall.Top:
        return { x, y: y - 1 };
      case SquareWall.Right:
        return { x: x + 1, y };
      case SquareWall.Bottom:
        return { x, y: y + 1 };
      case SquareWall.Left:
        return { x: x - 1, y };
      default:
        throw new Error(`Invalid wall direction: ${wall}`);
    }
  }

  public static getOppositeWall(wall: SquareWall): SquareWall {
    switch (wall) {
      case SquareWall.Top:
        return SquareWall.Bottom;
      case SquareWall.Right:
        return SquareWall.Left;
      case SquareWall.Bottom:
        return SquareWall.Top;
      case SquareWall.Left:
        return SquareWall.Right;
      default:
        throw new Error(`Invalid wall direction: ${wall}`);
    }
  }
}

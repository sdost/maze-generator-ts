import { MazeCell } from "./MazeCell";

export class MazeWall {
  public cellA: MazeCell;
  public cellB: MazeCell;

  constructor(cellA: MazeCell, cellB: MazeCell) {
    this.cellA = cellA;
    this.cellB = cellB;
  }

  public equals(wall: MazeWall): Boolean {
    if ( this.cellA === wall.cellA && this.cellB === wall.cellB ) {
      return true;
    }

    if ( this.cellB === wall.cellA && this.cellA === wall.cellB ) {
      return true;
    }

    return false;
  }
}

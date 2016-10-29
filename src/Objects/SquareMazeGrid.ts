import { DisjointSet } from "../DataStructures/DisjointSet";
import { LinkedList } from "../DataStructures/LinkedList";
import { PseudoRandom } from "../Helpers/PseudoRandom";
import { MazeCell, MazeGrid, MazeWall } from "./MazeGrid";

export const enum SquareWall {
  Top = 0,
  Right = 1,
  Bottom = 2,
  Left = 3
}

export class SquareMazeCell extends MazeCell {
  public removeWall(ind: SquareWall): void {
    if ( ind >= 0 && ind < this.wallList.length ) {
      this.wallList[ind] = false;
    }
  }

  public hasWall(ind: SquareWall): Boolean {
    if ( ind >= 0 && ind < this.wallList.length ) {
      return this.wallList[ind];
    } else {
      return false;
    }
  }

  protected initialize(): void {
    // TOP
    this.wallList.push(true);

    // RIGHT
    this.wallList.push(true);

    // BOTTOM
    this.wallList.push(true);

    // LEFT
    this.wallList.push(true);
  }
}

export class SquareMazeGrid extends MazeGrid {
  public static generate(width: number, height: number, seed: number = 1): SquareMazeGrid {
    let mazeGrid: SquareMazeGrid = new SquareMazeGrid(width, height);

    let wallList = new LinkedList<MazeWall>();

    let wall: MazeWall;
    for ( let x: number = 0; x < mazeGrid.width; x++ ) {
      for ( let y: number = 0; y < mazeGrid.height; y++ ) {
        let cellA: SquareMazeCell = mazeGrid.getCell(x, y) as SquareMazeCell;
        let cellB: SquareMazeCell;

        if ( x > 0 ) {
          cellB = mazeGrid.getCell(x - 1, y) as SquareMazeCell;

          if ( cellB != null ) {
            wall = new MazeWall(cellA, cellB);

            if (!wallList.contains(wall)) {
              wallList.append(wall);
            }
          }
        }

        if ( y > 0 ) {
          cellB = mazeGrid.getCell(x, y - 1) as SquareMazeCell;

          if ( cellB != null ) {
            wall = new MazeWall(cellA, cellB);

            if (!wallList.contains(wall)) {
              wallList.append(wall);
            }
          }
        }

        if ( x < (mazeGrid.width - 1) ) {
          cellB = mazeGrid.getCell(x + 1, y) as SquareMazeCell;

          if ( cellB != null ) {
            wall = new MazeWall(cellA, cellB);

            if (!wallList.contains(wall)) {
              wallList.append(wall);
            }
          }
        }

        if ( y < (mazeGrid.height - 1) ) {
          cellB = mazeGrid.getCell(x, y + 1) as SquareMazeCell;

          if ( cellB != null ) {
            wall = new MazeWall(cellA, cellB);

            if (!wallList.contains(wall)) {
              wallList.append(wall);
            }
          }
        }
      }

      return mazeGrid;
    }

    let sets = new DisjointSet(mazeGrid.width * mazeGrid.height);

    for ( let x: number = 0; x < mazeGrid.width; x++ ) {
      for ( let y: number = 0; y < mazeGrid.height; y++ ) {
        let cell: MazeCell = mazeGrid.getCell(x, y);
        sets.createSet(cell);
      }
    }

    let prng: PseudoRandom = new PseudoRandom();
    prng.seed =  seed > 0 ? seed : new Date().getTime();

    wallList.shuffle(prng);

    while ( wallList.size > 0 ) {
      wall = wallList.removeHead();

      if (sets.findSet(wall.cellA) === sets.findSet(wall.cellB)) {
        continue;
      }

      sets.mergeSet(wall.cellA, wall.cellB);

      if ( wall.cellA.xPos > wall.cellB.xPos ) {
        wall.cellA.removeWall(SquareWall.Left);
        wall.cellB.removeWall(SquareWall.Right);
      } else if ( wall.cellA.yPos > wall.cellB.yPos ) {
        wall.cellA.removeWall(SquareWall.Top);
        wall.cellB.removeWall(SquareWall.Bottom);
      } else if ( wall.cellA.xPos < wall.cellB.xPos ) {
        wall.cellA.removeWall(SquareWall.Right);
        wall.cellB.removeWall(SquareWall.Left);
      } else if ( wall.cellA.yPos < wall.cellB.yPos ) {
        wall.cellA.removeWall(SquareWall.Bottom);
        wall.cellB.removeWall(SquareWall.Top);
      }
    }

    // Add start and end.
    mazeGrid.createExitCells(prng);
  }

  constructor(width: number, height: number) {
    super();
    this.gridWidth = width;
    this.gridHeight = height;

    this.initGrid();
  }

  public getCell(x: number, y: number): MazeCell {
    let ind: number = (x << this.shift) | y;
    return this.grid[ind];
  }

  public createExitCells(prng: PseudoRandom): void {
    let outerWall: SquareWall = prng.nextIntRange(0, 3);
    let xPos = 0;
    let yPos = 0;

    switch (outerWall) {
      case SquareWall.Top:
        xPos = prng.nextIntRange(0, this.gridWidth - 1);
        yPos = 0;
      case SquareWall.Right:
        yPos = prng.nextIntRange(0, this.gridHeight - 1);
        xPos = this.gridWidth - 1;
      case SquareWall.Bottom:
        xPos = prng.nextIntRange(0, this.gridWidth - 1);
        yPos = this.gridHeight - 1;
      case SquareWall.Left:
        yPos = prng.nextIntRange(0, this.gridHeight - 1);
        xPos = 0;
      default:
        break;
    }

    this.gridStartCell = this.getCell(xPos, yPos);

    switch (outerWall) {
      case SquareWall.Top:
        xPos = prng.nextIntRange(0, this.gridWidth - 1);
        yPos = this.gridHeight - 1;
      case SquareWall.Right:
        yPos = prng.nextIntRange(0, this.gridHeight - 1);
        xPos = 0;
      case SquareWall.Bottom:
        xPos = prng.nextIntRange(0, this.gridWidth - 1);
        yPos = 0;
      case SquareWall.Left:
        yPos = prng.nextIntRange(0, this.gridHeight - 1);
        xPos = this.gridWidth - 1;
      default:
        break;
    }

    this.gridEndCell = this.getCell(xPos, yPos);
  }

  protected initGrid(): void {
    this.shift = 0;
    let minLength: number = this.gridWidth * this.gridHeight;
    let powOfTwo: number = 1;
    while ( powOfTwo < minLength ) {
      powOfTwo *= 2;
      this.shift++;
    }

    this.grid = new Array<MazeCell>(this.gridWidth << this.shift);
    for ( let x: number = 0; x < this.gridWidth; x++ ) {
      for ( let y: number = 0; y < this.gridHeight; y++ ) {
        let ind: number = (x << this.shift) | y;
        this.grid[ind] = new SquareMazeCell(x, y);
      }
    }
  }
}

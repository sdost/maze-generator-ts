import { DisjointSet } from "../DataStructures/DisjointSet";
import { PseudoRandom } from "../Helpers/PseudoRandom";
import { MazeCell, MazeGrid } from "./MazeGrid";

export const enum SquareWall {
  Top = 0,
  Right = 1,
  Bottom = 2,
  Left = 3
}

export class SquareMazeCell extends MazeCell {
  public removeWall(ind: number): void {
    if ( ind >= 0 && ind < this.wallList.length ) {
      this.wallList[ind] = false;
    }
  }

  public hasWall(ind: number): Boolean {
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

class SquareMazeWall {
  public cellA: SquareMazeCell;
  public cellB: SquareMazeCell;

  constructor(cellA: SquareMazeCell, cellB: SquareMazeCell) {
    this.cellA = cellA;
    this.cellB = cellB;
  }

  public equals(wall: SquareMazeWall): boolean {
    if ( this.cellA === wall.cellA && this.cellB === wall.cellB ) {
      return true;
    }

    if ( this.cellB === wall.cellA && this.cellA === wall.cellB ) {
      return true;
    }

    return false;
  }
}

export class SquareMazeGrid extends MazeGrid {
  public static generate(width: number, height: number, seed: number = 1): SquareMazeGrid {
    let mazeGrid: SquareMazeGrid = new SquareMazeGrid(width, height);
    let prng: PseudoRandom = new PseudoRandom();
    prng.seed =  seed > 0 ? seed : new Date().getTime();
    mazeGrid.initGrid(prng);
    mazeGrid.createExitCells(prng);

    return mazeGrid;
  }

  private wallList: Array<SquareMazeWall>;
  private sets: DisjointSet<SquareMazeCell>;

  constructor(width: number, height: number) {
    super();
    this.gridWidth = width;
    this.gridHeight = height;
  }

  public initGrid(prng: PseudoRandom): void {
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

    // this.wallList = new LinkedList<SquareMazeWall>();
    this.wallList = new Array<SquareMazeWall>();

    let wall: SquareMazeWall;
    for ( let x: number = 0; x < this.width; x++ ) {
      for ( let y: number = 0; y < this.height; y++ ) {
        let cellA: SquareMazeCell = this.getCell(x, y) as SquareMazeCell;
        let cellB: SquareMazeCell;

        if ( x > 0 ) {
          cellB = this.getCell(x - 1, y) as SquareMazeCell;

          if ( cellB != null ) {
            wall = new SquareMazeWall(cellA, cellB);

            if (!this.wallList.some(val => wall.equals(val))) {
              this.wallList.push(wall);
            }
          }
        }

        if ( y > 0 ) {
          cellB = this.getCell(x, y - 1) as SquareMazeCell;

          if ( cellB != null ) {
            wall = new SquareMazeWall(cellA, cellB);

            if (!this.wallList.some(val => wall.equals(val))) {
              this.wallList.push(wall);
            }
          }
        }

        if ( x < (this.width - 1) ) {
          cellB = this.getCell(x + 1, y) as SquareMazeCell;

          if ( cellB != null ) {
            wall = new SquareMazeWall(cellA, cellB);

            if (!this.wallList.some(val => wall.equals(val))) {
              this.wallList.push(wall);
            }
          }
        }

        if ( y < (this.height - 1) ) {
          cellB = this.getCell(x, y + 1) as SquareMazeCell;

          if ( cellB != null ) {
            wall = new SquareMazeWall(cellA, cellB);

            if (!this.wallList.some(val => wall.equals(val))) {
              this.wallList.push(wall);
            }
          }
        }
      }
    }

    let s: number = this.wallList.length;
    while (s > 1) {
      s--;
      let i: number = prng.nextIntRange(0, s);
      let temp: SquareMazeWall = this.wallList[s];
      this.wallList[s] = this.wallList[i];
      this.wallList[i] = temp;
    }

    this.sets = new DisjointSet<SquareMazeCell>(this.width * this.height);

    for ( let x: number = 0; x < this.width; x++ ) {
      for ( let y: number = 0; y < this.height; y++ ) {
        let cell: SquareMazeCell = this.getCell(x, y) as SquareMazeCell;
        this.sets.createSet(cell);
      }
    }
  }

  public iterate(): boolean {
    let wall = this.getNextWall();
    if (wall != null) {
      this.sets.mergeSet(wall.cellA, wall.cellB);

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

      wall.cellA.visited = true;
      wall.cellB.visited = true;

      return false;
    } else {
      return true;
    }
  }

  public getCell(x: number, y: number): MazeCell {
    let ind: number = (x << this.shift) | y;
    return this.grid[ind];
  }

  private getNextWall(): SquareMazeWall {
    if (this.wallList.length > 0) {
      let wall: SquareMazeWall = this.wallList.pop();
      while (this.sets.findSet(wall.cellA) === this.sets.findSet(wall.cellB)) {
        if (this.wallList.length > 0) {
          wall = this.wallList.pop();
        } else {
          return null;
        }
      }
      return wall;
    } else {
      return null;
    }
  }

  private createExitCells(prng: PseudoRandom): void {
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
}

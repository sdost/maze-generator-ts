import { DisjointSet } from "../DataStructures/DisjointSet";
import { LinkedList, ListNode } from "../DataStructures/LinkedList";
import { PseudoRandom } from "../Helpers/PseudoRandom";
import { MazeCell } from "./MazeCell";
import { MazeGrid } from "./MazeGrid";
import { MazeWall } from "./MazeWall";
import { SquareMazeCell, SquareWall } from "./SquareMazeCell";

export class SquareMazeGrid extends MazeGrid {
  private wallList: LinkedList;

  constructor(width: number, height: number) {
    super();
    this.gridWidth = width;
    this.gridHeight = height;

    this.initGrid();
  }

  public generate(seed: number = 1): void {
    this.wallList = new WallList();

    let ind: number;
    let wall: MazeWall;
    for ( let x: number = 0; x < this.gridWidth; x++ ) {
      for ( let y: number = 0; y < this.gridHeight; y++ ) {
        ind = (x << this.shift) | y;
        let cellA: SquareMazeCell = this.grid[ind] as SquareMazeCell;
        let cellB: SquareMazeCell;

        if ( x > 0 ) {
          ind = ((x - 1) << this.shift) | y;
          cellB = this.grid[ind] as SquareMazeCell;

          if ( cellB != null ) {
            wall = new MazeWall(cellA, cellB);

            if (!this.wallList.contains(wall)) {
              this.wallList.append(wall);
            }
          }
        }

        if ( y > 0 )
        {
          ind = (x << this.shift) | (y - 1);
          cellB = this.grid[ind] as SquareMazeCell;

          if ( cellB != null )
          {
            wall = new MazeWall(cellA, cellB);

            if (!this.wallList.contains(wall)) {
              this.wallList.append(wall);
            }
          }
        }

        if ( x < (this.gridWidth - 1) )
        {
          ind = ((x + 1) << this.shift) | y;
          cellB = this.grid[ind] as SquareMazeCell;

          if ( cellB != null ) {
            wall = new MazeWall(cellA, cellB);

            if (!this.wallList.contains(wall)) {
              this.wallList.append(wall);
            }
          }
        }

        if ( y < (this.gridHeight - 1) ) {
          ind = (x << this.shift) | (y + 1);
          cellB = this.grid[ind] as SquareMazeCell;

          if ( cellB != null ) {
            wall = new MazeWall(cellA, cellB);

            if (!this.wallList.contains(wall)) {
              this.wallList.append(wall);
            }
          }
        }
      }
    }

    let prng: PseudoRandom = new PseudoRandom();
    prng.seed =  seed > 0 ? seed : new Date().getTime();

    this.wallList.shuffle(prng);

    while ( this.wallList.size > 0 ) {
      wall = this.wallList.removeHead();

      let indA: number = (wall.cellA.xPos << this.shift) | wall.cellA.yPos;
      let indB: number = (wall.cellB.xPos << this.shift) | wall.cellB.yPos;

      if (this.ds.findSet(indA) === this.ds.findSet(indB)) {
        continue;
      }

      this.ds.mergeSet(indA, indB);

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

    // Add start.
    this.gridStartCell = this.createExitCell(prng);

    // Add finish.
    this.gridEndCell = this.createExitCell(prng);
    while(this.gridStartCell === this.gridEndCell) {
      this.gridEndCell = this.createExitCell(prng);
    }
  }

  public render(context: CanvasRenderingContext2D, scale: number): void {
    context.strokeStyle = "#000000";
    context.lineWidth = 0.5;

    context.beginPath();

    for ( let x: number = 0; x < this.gridWidth; x++ ) {
      for ( let y: number = 0; y < this.gridHeight; y++ ) {
        let cell: SquareMazeCell = this.getCell(x, y) as SquareMazeCell;
        this.renderWalls(context, cell, scale);
      }
    }

    context.stroke();

    if(this.startCell) {
      context.fillStyle = "#008800";
      context.beginPath();
      this.startCell.render(context, scale);
      context.fill();
    }

    if(this.endCell) {
      context.fillStyle = "#880000";
      context.beginPath();
      this.endCell.render(context, scale);
      context.fill();
    }
  }

  public getCell(x: number, y: number): MazeCell {
    let ind: number = (x << this.shift) | y;
    return this.grid[ind];
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
    for ( let i: number = 0; i < this.grid.length; i++) {
      this.grid[i] = null;
    }

    this.ds = new DisjointSet(this.gridWidth * this.gridHeight);

    for ( let x: number = 0; x < this.gridWidth; x++ ) {
      for ( let y: number = 0; y < this.gridHeight; y++ ) {
        let ind: number = (x << this.shift) | y;

        this.grid[ind] = new SquareMazeCell(x, y);
        this.ds.createSet(ind);
      }
    }
  }

  private createExitCell(prng: PseudoRandom): MazeCell {
    let outerWall: SquareWall = prng.nextIntRange(0, 3);
    let xPos = 0;
    let yPos = 0;

    switch(outerWall) {
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

    return this.getCell(xPos, yPos);
  }

  private renderWalls(context: CanvasRenderingContext2D, cell: MazeCell, scale: number): void {
    let xOffset: number = cell.xPos * scale;
    let yOffset: number = cell.yPos * scale;

    let penX: number = xOffset;
    let penY: number = yOffset;

    context.moveTo(penX, penY);

    penX += scale;
    if ( cell.hasWall(SquareWall.Top) ) {
      context.lineTo(penX, penY);
    } else {
      context.moveTo(penX, penY);
    }

    penY += scale;
    if ( cell.hasWall(SquareWall.Right) ) {
      context.lineTo(penX, penY);
    } else {
      context.moveTo(penX, penY);
    }

    penX = xOffset;
    if ( cell.hasWall(SquareWall.Bottom) ) {
      context.lineTo(penX, penY);
    } else {
      context.moveTo(penX, penY);
    }

    penY = yOffset;
    if ( cell.hasWall(SquareWall.Left) ) {
      context.lineTo(penX, penY);
    } else {
      context.moveTo(penX, penY);
    }
  }
}

class WallList extends LinkedList {
  public contains(data: any): Boolean {
    let node: ListNode = this.head;

    while (node != null) {
      if (node.data.equals(data)) {
        return true;
      }
      node = node.next;
    }
    return false;
  }

  public nodeOf(data: any, from: ListNode = null): ListNode {
    let node: ListNode = from == null ? this.head : from;

    while (node != null) {
      if (node.data.equals(data)) { break; }
      node = node.next;
    }
    return node;
  }
}

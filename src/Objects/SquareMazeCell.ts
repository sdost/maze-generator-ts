import { MazeCell } from "./MazeCell";

export const enum SquareWall {
  Top = 0,
  Right = 1,
  Bottom = 2,
  Left = 3
}

export class SquareMazeCell extends MazeCell {
  constructor(x: number, y: number) {
    super();

    this.xPos = x;
    this.yPos = y;
  }

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

  public render(context: CanvasRenderingContext2D, scale: number): void {
    const xOffset: number = this.xPos * scale;
    const yOffset: number = this.yPos * scale;

    let penX: number = xOffset;
    let penY: number = yOffset;

    context.moveTo(penX, penY);

    penX += scale;
    context.lineTo(penX, penY);

    penY += scale;
    context.lineTo(penX, penY);

    penX = xOffset;
    context.lineTo(penX, penY);

    penY = yOffset;
    context.lineTo(penX, penY);
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

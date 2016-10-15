export abstract class MazeCell {
  public xPos: number;
  public yPos: number;

  protected wallList: Array<Boolean>;

  constructor() {
    this.wallList = new Array<Boolean>();
    this.initialize();
  }

  public abstract removeWall(ind: number): void;

  public abstract hasWall(ind: number): Boolean;

  public abstract render(context: CanvasRenderingContext2D, scale: number): void;

  public walls(): number {
    return this.wallList.length;
  }

  protected abstract initialize(): void;
}

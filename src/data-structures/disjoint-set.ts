export class DisjointSet<T> {
  private parent: Map<T, T> = new Map();
  private rank: Map<T, number> = new Map();

  constructor(private readonly capacity: number) {}

  public createSet(x: T): void {
    this.parent.set(x, x);
    this.rank.set(x, 0);
  }

  public findSet(x: T): T {
    if (!this.parent.has(x)) {
      throw new Error('Element not found in any set');
    }

    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.findSet(this.parent.get(x)!));
    }

    return this.parent.get(x)!;
  }

  public mergeSet(x: T, y: T): void {
    const rootX = this.findSet(x);
    const rootY = this.findSet(y);

    if (rootX === rootY) {
      return;
    }

    const rankX = this.rank.get(rootX)!;
    const rankY = this.rank.get(rootY)!;

    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }
  }
}
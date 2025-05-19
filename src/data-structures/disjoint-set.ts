export class DisjointSet {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array(size).fill(0);
  }

  public createSet(x: number): void {
    this.parent[x] = x;
    this.rank[x] = 0;
  }

  public findSet(x: number): number {
    if (x < 0 || x >= this.parent.length) {
      throw new Error('Element not found in any set');
    }

    if (this.parent[x] !== x) {
      this.parent[x] = this.findSet(this.parent[x]);
    }

    return this.parent[x];
  }

  public mergeSet(x: number, y: number): void {
    const rootX = this.findSet(x);
    const rootY = this.findSet(y);

    if (rootX === rootY) {
      return;
    }

    const rankX = this.rank[rootX];
    const rankY = this.rank[rootY];

    if (rankX < rankY) {
      this.parent[rootX] = rootY;
    } else if (rankX > rankY) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX] = rankX + 1;
    }
  }
}

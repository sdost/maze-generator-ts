import { LinkedList, ListNode } from "./LinkedList";

export class DisjointSet {
  private index: number;
  private list: Array<ListNode>;

  constructor(size: number) {
    this.list = new Array<ListNode>(size);
    this.index = 0;
  }

  public createSet(data: any): void {
    let newSet: LinkedList = new LinkedList();
    let node: ListNode = newSet.append(data);
    this.list[this.index++] = node;
  }

  public findSet(data: any): LinkedList {
    for (let node of this.list) {
      if ( node && node.data === data ) {
        return node.list;
      }
    }

    return null;
  }

  public mergeSet(dataA: any, dataB: any): void {
    let setA: LinkedList = this.findSet(dataA);
    let setB: LinkedList = this.findSet(dataB);

    if (setA.size > setB.size) {
      setA.merge(setB);
    } else {
      setB.merge(setA);
    }
  }
}

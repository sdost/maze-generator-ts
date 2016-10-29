import { IComparable } from "./IComparable";
import { LinkedList, ListNode } from "./LinkedList";

export class DisjointSet<T extends IComparable> {
  private index: number;
  private list: Array<ListNode<T>>;

  constructor(size: number) {
    this.list = new Array<ListNode<T>>(size);
    this.index = 0;
  }

  public createSet(data: any): void {
    let newSet: LinkedList<T> = new LinkedList<T>();
    let node: ListNode<T> = newSet.append(data);
    this.list[this.index++] = node;
  }

  public findSet(data: T): LinkedList<T> {
    for (let node of this.list) {
      if ( node && node.data.equals(data) ) {
        return node.list;
      }
    }

    return null;
  }

  public mergeSet(dataA: T, dataB: T): void {
    let setA: LinkedList<T> = this.findSet(dataA);
    let setB: LinkedList<T> = this.findSet(dataB);

    if (setA.size > setB.size) {
      setA.merge(setB);
    } else {
      setB.merge(setA);
    }
  }
}

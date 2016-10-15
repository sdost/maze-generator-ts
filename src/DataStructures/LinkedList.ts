import { PseudoRandom } from "../Helpers/PseudoRandom";

export class ListNode {
  public data: any;

  public prev: ListNode;
  public next: ListNode;

  public list: LinkedList;

  constructor(data: any, list: LinkedList) {
    this.next = this.prev = null;
    this.data = data;
    this.list = list;
  }

  public unlink(): void {
    this.list.unlink(this);
  }
}

export class LinkedList {
  public head: ListNode;
  public tail: ListNode;
  public size: number;

  constructor() {
    this.head = this.tail = null;
    this.size = 0;
  }

  public append(data: any): ListNode {
    let node: ListNode = this.createNode(data);

    if ( this.tail != null ) {
      node.prev = this.tail;
      this.tail.next = node;
    } else {
      this.head = node;
    }

    this.tail = node;
    this.size++;

    return node;
  }

  public prepend(data: any): void {
    let node: ListNode = this.createNode(data);

    if ( this.head != null ) {
      node.next = this.head;
      this.head.prev = node;
    } else {
      this.tail = node;
    }

    this.head = node;
    this.size++;
  }

  public createNode(data: any): ListNode {
    return new ListNode(data, this);
  }

  public removeHead(): any {
    let node: ListNode = this.head;
    if (this.size > 1) {
      this.head = this.head.next;
      if (this.head == null) {
        this.tail = null;
      }
      this.size--;
    } else {
      this.head = this.tail = null;
      this.size = 0;
    }

    return node.data;
  }

  public removeTail(): any {
    let node: ListNode = this.tail;
    if (this.size > 1) {
      this.tail = this.tail.prev;
      if (this.tail == null) {
        this.head = null;
      }
      this.size--;
    } else {
      this.head = this.tail = null;
      this.size = 0;
    }

    return node.data;
  }

  public unlink(node: ListNode): ListNode {
    if (node === this.head) {
      this.head = this.head.next;
    } else if (node === this.tail) {
      this.tail = this.tail.prev;
    }

    let temp: ListNode = node.next;
    if (node.prev != null) {
      node.prev.next = node.next;
    }

    if (node.next != null) {
      node.next.prev = node.prev;
    }

    if ( this.head == null ) {
      this.tail = null;
    }
    this.size--;

    return temp;
  }

  public merge(list: LinkedList): void {
    if (list.head != null) {
      let node: ListNode = list.head;
      for (let i: number = 0; i < list.size; i++) {
        node.list = this;
        node = node.next;
      }

      if (this.head != null) {
        this.tail.next = list.head;
        this.tail = list.tail;
      } else {
        this.head = list.head;
        this.tail = list.tail;
      }

      this.size += list.size;
    }
  }

  public clear(): void {
    this.head = this.tail = null;
  }

  public get iterator(): ListIterator {
    return new ListIterator(this);
  }

  public nodeOf(data: any, from: ListNode = null): ListNode {
    let node: ListNode = from == null ? this.head : from;

    while (node != null) {
      if (node.data === data) {
        break;
      }
      node = node.next;
    }
    return node;
  }

  public contains(data: any): Boolean {
    let node: ListNode = this.head;
    while (node != null) {
      if (node.data === data) {
        return true;
      }
      node = node.next;
    }
    return false;
  }

  public shuffle(prng: PseudoRandom): void {
    let s: number = this.size;
    while (s > 1) {
      s--;
      let i: number = prng.nextIntRange(0, s);
      let node1: ListNode = this.head;

      let j: number;
      for (j = 0; j < s; j++) {
        node1 = node1.next;
      }

      let t: any = node1.data;

      let node2: ListNode = this.head;
      for (j = 0; j < i; j++) {
        node2 = node2.next;
      }

      node1.data = node2.data;
      node2.data = t;
    }
  }
}

export class ListIterator {
  private list: LinkedList;
  private walker: ListNode;

  constructor(list: LinkedList) {
    this.list = list;
    this.reset();
  }

  public reset(): void {
    this.walker = this.list.head;
  }

  public hasNext(): Boolean {
    return this.walker != null;
  }

  public next(): any {
    let data: any = this.walker.data;
    this.walker = this.walker.next;
    return data;
  }
}

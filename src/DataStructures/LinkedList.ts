module Maze.DataStructures
{
  export class LinkedList
  {
    private _size:number;

    public head:ListNode;
    public tail:ListNode;

    constructor()
    {
      this.head = this.tail = null;
      this._size = 0;
    }

    public append(a_data:any):ListNode
    {
      var node:ListNode = this.createNode(a_data);

      if ( this.tail != null )
      {
        node.prev = this.tail;
        this.tail.next = node;
      }
      else this.head = node;
      this.tail = node;
      this._size++;

      return node;
    }

    public prepend(a_data:any):void
    {
      var node:ListNode = this.createNode(a_data);

      if ( this.head != null )
      {
        node.next = this.head;
        this.head.prev = node;
      }
      else this.tail = node;
      this.head = node;
      this._size++;
    }

    public createNode(a_data:any):ListNode
    {
      return new ListNode(a_data, this);
    }

    public removeHead():any
    {
      var node:ListNode = this.head;
      if (this._size > 1)
      {
        this.head = this.head.next;
        if (this.head == null) this.tail = null;
        this._size--;
      }
      else
      {
        this.head = this.tail = null;
        this._size = 0;
      }

      return node.data;
    }

    public removeTail():any
    {
      var node:ListNode = this.tail;
      if (this._size > 1)
      {
        this.tail = this.tail.prev;
        if (this.tail == null) this.head = null;
        this._size--;
      }
      else
      {
        this.head = this.tail = null;
        this._size = 0;
      }

      return node.data;
    }

    public unlink(node:ListNode):ListNode
    {
      if (node == this.head)
      {
        this.head = this.head.next;
      }
      else if (node == this.tail)
      {
        this.tail = this.tail.prev;
      }

      var temp:ListNode = node.next;
      if (node.prev != null) node.prev.next = node.next;
      if (node.next != null) node.next.prev = node.prev;
      //node.next = node.prev = null;
      if ( this.head == null ) this.tail == null;
      this._size--;

      return temp;
    }

    public get size():number
    {
      return this._size;
    }

    public merge(a_list:LinkedList):void
    {
      if (a_list.head != null)
      {
        var node:ListNode = a_list.head;
        for (var i:number = 0; i < a_list.size; i++)
        {
          node.list = this;
          node = node.next;
        }

        if (this.head != null)
        {
          this.tail.next = a_list.head;
          this.tail = a_list.tail;
        }
        else
        {
          this.head = a_list.head;
          this.tail = a_list.tail;
        }

        this._size += a_list.size;
      }
    }

    public clear():void
    {
      this.head = this.tail = null;
    }

    public get iterator():ListIterator
    {
      return new ListIterator(this);
    }

    public nodeOf(a_data:any, a_from:ListNode = null):ListNode
    {
      var node:ListNode = a_from == null ? this.head : a_from;

      while (node != null)
      {
        if (node.data == a_data) break;
        node = node.next;
      }
      return node;
    }

    public contains(a_data:any):Boolean
    {
      var node:ListNode = this.head;
      while (node != null)
      {
        if (node.data == a_data)
          return true;
        node = node.next;
      }
      return false;
    }

    public shuffle(a_prng:Helpers.PseudoRandom):void
    {
      var s:number = this._size;
      while (s > 1)
      {
        s--;
        var i:number = a_prng.nextIntRange(0, s);
        var node1:ListNode = this.head;

        var j:number;
        for (j = 0; j < s; j++)
          node1 = node1.next;

        var t:any = node1.data;

        var node2:ListNode = this.head;
        for (j = 0; j < i; j++)
          node2 = node2.next;

        node1.data = node2.data;
        node2.data = t;
      }
    }
  }
}
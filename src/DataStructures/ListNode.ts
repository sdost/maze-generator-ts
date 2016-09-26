module Maze.DataStructures
{
  export class ListNode
  {
    public data:any;

    public prev:ListNode;
    public next:ListNode;

    protected _list:LinkedList;

    constructor(a_data:any, a_list:LinkedList)
    {
      this.next = this.prev = null;
      this.data = a_data;
      this._list = a_list;
    }

    public set list(a_list:LinkedList)
    {
      this._list = a_list;
    }

    public get list():LinkedList
    {
      return this._list;
    }

    public unlink():void
    {
      this._list.unlink(this);
    }
  }
}
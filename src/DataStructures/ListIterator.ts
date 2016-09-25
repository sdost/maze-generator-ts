module Maze.DataStructures
{
  export class ListIterator
  {
    private _list:LinkedList;
    private _walker:ListNode;

    constructor(a_list:LinkedList)
    {
      this._list = a_list;
      this.reset();
    }

    public reset():void
    {
      this._walker = this._list.head;
    }

    public hasNext():Boolean
    {
      return this._walker != null;
    }

    public next():any
    {
      var data:any = this._walker.data;
      this._walker = this._walker.next;
      return data;
    }
  }
}
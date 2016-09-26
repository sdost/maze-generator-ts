module Maze.DataStructures
{
  export class DisjointSet
  {
    private _index:number;
    private _list:Array<ListNode>;

    constructor(a_size:number)
    {
      this._list = new Array<ListNode>(a_size);
      this._index = 0;
    }

    public createSet(a_data:any):void
    {
      var newSet:LinkedList = new LinkedList();
      var node:ListNode = newSet.append(a_data);
      this._list[this._index++] = node;
    }

    public findSet(a_data:any):LinkedList
    {
      for (let node of this._list )
      {
        if ( node && node.data == a_data )
        {
          return node.list;
        }
      }

      return null;
    }

    public mergeSet(a_dataA:any, a_dataB:any):void
    {
      var setA:LinkedList = this.findSet(a_dataA);
      var setB:LinkedList = this.findSet(a_dataB);

      if (setA.size > setB.size)
      {
        setA.merge(setB);
      }
      else
      {
        setB.merge(setA);
      }
    }
  }
}
module Maze.Helpers
{
  export class PseudoRandom
  {
    public seed:number;

    constructor()
    {
      this.seed = 1;
    }

    public nextInt():number
    {
      return this.gen();
    }

    public nextDouble():number
    {
      return (this.gen() / 2147483647);
    }

    public nextIntRange(min:number, max:number):number
    {
      min -= .4999;
      max += .4999;

      return Math.round(min + ((max - min) * this.nextDouble()));
    }

    public nextDoubleRange(min:number, max:number):number
    {
      return min + ((max - min) * this.nextDouble());
    }

    private gen():number
    {
      var hi:number = 16807 * (this.seed >> 16);
      var lo:number = 16807 * (this.seed & 0xFFFF) + ((hi & 0x7FFF) << 16) + (hi >> 15);
      return this.seed = (lo > 0x7FFFFFFF ? lo - 0x7FFFFFFF : lo);
    }
  }
}
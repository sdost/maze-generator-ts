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
      //integer version 1, for max int 2^46 - 1 or larger.
      return this.seed = (this.seed * 16807) % 2147483647;

      /**
       * integer version 2, for max int 2^31 - 1 (slowest)
       */
      //var test:int = 16807 * (seed % 127773 >> 0) - 2836 * (seed / 127773 >> 0);
      //return seed = (test > 0 ? test : test + 2147483647);

      /**
       * david g. carta's optimisation is 15% slower than integer version 1
       */
      //var hi:uint = 16807 * (seed >> 16);
      //var lo:uint = 16807 * (seed & 0xFFFF) + ((hi & 0x7FFF) << 16) + (hi >> 15);
      //return seed = (lo > 0x7FFFFFFF ? lo - 0x7FFFFFFF : lo);
    }
  }
}
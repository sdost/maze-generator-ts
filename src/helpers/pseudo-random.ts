export class PseudoRandom {
  private static readonly MULTIPLIER = 1664525;
  private static readonly INCREMENT = 1013904223;
  private static readonly MODULUS = 4294967296; // 2^32

  private seed: number;

  constructor(seed: number = Date.now()) {
    this.seed = seed;
  }

  public nextInt(): number {
    this.seed = (this.seed * PseudoRandom.MULTIPLIER + PseudoRandom.INCREMENT) % PseudoRandom.MODULUS;
    return this.seed;
  }

  public nextIntRange(min: number, max: number): number {
    return min + (this.nextInt() % (max - min + 1));
  }

  public nextDouble(): number {
    return this.nextInt() / PseudoRandom.MODULUS;
  }

  public nextDoubleRange(min: number, max: number): number {
    return min + (this.nextDouble() * (max - min));
  }
}
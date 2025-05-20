export class PseudoRandom {
  private static readonly MULTIPLIER = 1664525;
  private static readonly INCREMENT = 1013904223;
  private static readonly MODULUS = 4294967296; // 2^32

  private seed: number;

  constructor(seed: string | number | null = Date.now()) {
    if (seed === null) {
      this.seed = Date.now();
    } else if (typeof seed === 'string') {
      // Convert string to number using a simple hash function
      this.seed = this.hashString(seed);
    } else {
      this.seed = seed;
    }
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  public nextInt(): number {
    this.seed =
      (this.seed * PseudoRandom.MULTIPLIER + PseudoRandom.INCREMENT) % PseudoRandom.MODULUS;
    return this.seed;
  }

  public nextIntRange(min: number, max: number): number {
    const range = max - min + 1;
    const maxValue = PseudoRandom.MODULUS - (PseudoRandom.MODULUS % range);
    let value: number;
    do {
      value = this.nextInt();
    } while (value >= maxValue);
    return min + (value % range);
  }

  public nextDouble(): number {
    return this.nextInt() / PseudoRandom.MODULUS;
  }

  public nextDoubleRange(min: number, max: number): number {
    return min + this.nextDouble() * (max - min);
  }
}

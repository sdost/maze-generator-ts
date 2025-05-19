import { MazeConfig } from '../types/maze';
import { InvalidConfigError } from '../errors/maze-errors';

export class ConfigValidator {
  private static readonly MIN_DIMENSION = 2;
  private static readonly MAX_DIMENSION = 1000;
  private static readonly MIN_CELL_SIZE = 4;
  private static readonly MAX_CELL_SIZE = 100;
  private static readonly MIN_ANIMATION_SPEED = 1;
  private static readonly MAX_ANIMATION_SPEED = 1000;

  public static validate(config: MazeConfig): void {
    this.validateDimensions(config);
    this.validateCellSize(config);
    this.validateAnimationSpeed(config);
  }

  private static validateDimensions(config: MazeConfig): void {
    if (config.width < this.MIN_DIMENSION || config.width > this.MAX_DIMENSION) {
      throw new InvalidConfigError(
        `Width must be between ${this.MIN_DIMENSION} and ${this.MAX_DIMENSION}`
      );
    }

    if (config.height < this.MIN_DIMENSION || config.height > this.MAX_DIMENSION) {
      throw new InvalidConfigError(
        `Height must be between ${this.MIN_DIMENSION} and ${this.MAX_DIMENSION}`
      );
    }
  }

  private static validateCellSize(config: MazeConfig): void {
    if (config.cellSize < this.MIN_CELL_SIZE || config.cellSize > this.MAX_CELL_SIZE) {
      throw new InvalidConfigError(
        `Cell size must be between ${this.MIN_CELL_SIZE} and ${this.MAX_CELL_SIZE}`
      );
    }
  }

  private static validateAnimationSpeed(config: MazeConfig): void {
    if (
      config.animationSpeed < this.MIN_ANIMATION_SPEED ||
      config.animationSpeed > this.MAX_ANIMATION_SPEED
    ) {
      throw new InvalidConfigError(
        `Animation speed must be between ${this.MIN_ANIMATION_SPEED} and ${this.MAX_ANIMATION_SPEED}`
      );
    }
  }
}

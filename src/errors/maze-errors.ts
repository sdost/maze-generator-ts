export class MazeError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'MazeError';
  }
}

export class MazeGenerationError extends MazeError {
  constructor(message: string) {
    super(message, 'MAZE_GENERATION_ERROR');
    this.name = 'MazeGenerationError';
  }
}

export class MazeSolvingError extends MazeError {
  constructor(message: string) {
    super(message, 'MAZE_SOLVING_ERROR');
    this.name = 'MazeSolvingError';
  }
}

export class MazeRenderingError extends MazeError {
  constructor(message: string) {
    super(message, 'MAZE_RENDERING_ERROR');
    this.name = 'MazeRenderingError';
  }
}

export class InvalidConfigError extends MazeError {
  constructor(message: string) {
    super(message, 'INVALID_CONFIG_ERROR');
    this.name = 'InvalidConfigError';
  }
}

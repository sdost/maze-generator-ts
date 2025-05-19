import { MazeRenderingError } from '../../errors/maze-errors';
import { ShaderManager } from './shader-manager';
import { BufferManager } from './buffer-manager';

export interface RendererConfig {
  backgroundColor: [number, number, number, number];
  defaultColor: [number, number, number, number];
}

export class BaseWebGLRenderer {
  protected gl: WebGLRenderingContext;
  protected shaderManager: ShaderManager;
  protected bufferManager: BufferManager;
  protected resolutionLocation: WebGLUniformLocation;
  protected colorLocation: WebGLUniformLocation;

  constructor(
    protected readonly canvas: HTMLCanvasElement,
    protected readonly config: RendererConfig
  ) {
    this.gl = this.initializeWebGL();
    this.shaderManager = new ShaderManager(this.gl);
    this.bufferManager = new BufferManager(this.gl);
    this.resolutionLocation = this.shaderManager.getUniformLocation('u_resolution');
    this.colorLocation = this.shaderManager.getUniformLocation('u_color');
  }

  protected initializeWebGL(): WebGLRenderingContext {
    const gl = this.canvas.getContext('webgl');
    if (!gl) {
      throw new MazeRenderingError('WebGL not supported');
    }
    return gl;
  }

  protected setupRender(): void {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(...this.config.backgroundColor);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.shaderManager.getProgram());
    this.gl.uniform2f(this.resolutionLocation, this.canvas.width, this.canvas.height);
  }

  protected drawBuffers(
    positions: number[],
    colors: number[],
    defaultColor: [number, number, number, number]
  ): void {
    this.bufferManager.setPositionData(new Float32Array(positions));
    this.bufferManager.setColorData(new Float32Array(colors));
    this.gl.uniform4fv(this.colorLocation, defaultColor);
    this.gl.drawArrays(this.gl.LINES, 0, positions.length / 2);
  }

  protected calculateCellSize(width: number, height: number): number {
    return Math.min(
      this.canvas.width / width,
      this.canvas.height / height
    );
  }
}
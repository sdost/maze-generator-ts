import { MazeRenderingError } from '../../errors/maze-errors';

export class BufferManager {
  private positionBuffer: WebGLBuffer;
  private colorBuffer: WebGLBuffer;

  constructor(private gl: WebGLRenderingContext) {
    this.positionBuffer = this.createBuffer();
    this.colorBuffer = this.createBuffer();
  }

  public getPositionBuffer(): WebGLBuffer {
    return this.positionBuffer;
  }

  public getColorBuffer(): WebGLBuffer {
    return this.colorBuffer;
  }

  public setPositionData(data: Float32Array): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
  }

  public setColorData(data: Float32Array): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
  }

  private createBuffer(): WebGLBuffer {
    const buffer = this.gl.createBuffer();
    if (!buffer) {
      throw new MazeRenderingError('Failed to create WebGL buffer');
    }
    return buffer;
  }
}
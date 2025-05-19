import { MazeRenderingError } from '../../errors/maze-errors';

export class ShaderManager {
  private program: WebGLProgram;

  constructor(private gl: WebGLRenderingContext) {
    this.program = this.createShaderProgram();
  }

  public getProgram(): WebGLProgram {
    return this.program;
  }

  public getUniformLocation(name: string): WebGLUniformLocation {
    const location = this.gl.getUniformLocation(this.program, name);
    if (!location) {
      throw new MazeRenderingError(`Uniform location not found: ${name}`);
    }
    return location;
  }

  public getAttribLocation(name: string): number {
    const location = this.gl.getAttribLocation(this.program, name);
    if (location === -1) {
      throw new MazeRenderingError(`Attribute location not found: ${name}`);
    }
    return location;
  }

  private createShaderProgram(): WebGLProgram {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, `
      attribute vec2 a_position;
      attribute vec4 a_color;
      uniform vec2 u_resolution;
      varying vec4 v_color;
      void main() {
        vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        v_color = a_color;
      }
    `);

    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, `
      precision mediump float;
      varying vec4 v_color;
      uniform vec4 u_color;
      void main() {
        gl_FragColor = v_color * u_color;
      }
    `);

    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new MazeRenderingError('Failed to link shader program');
    }

    return program;
  }

  private createShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new MazeRenderingError(
        `Failed to compile shader: ${this.gl.getShaderInfoLog(shader)}`
      );
    }

    return shader;
  }
}
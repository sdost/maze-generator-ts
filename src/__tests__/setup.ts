// Mock WebGL context
class MockWebGLRenderingContext {
  // Constants
  COLOR_BUFFER_BIT = 0x00004000;
  VERTEX_SHADER = 0x8b31;
  FRAGMENT_SHADER = 0x8b30;
  ARRAY_BUFFER = 0x8892;
  STATIC_DRAW = 0x88e4;
  LINES = 0x0001;
  LINK_STATUS = 0x8b82;
  COMPILE_STATUS = 0x8b81;

  // Mock methods
  viewport(): void {}
  clearColor(): void {}
  clear(): void {}
  useProgram(): void {}
  uniform2f(): void {}
  uniform4fv(): void {}
  bindBuffer(): void {}
  bufferData(): void {}
  drawArrays(): void {}
  createProgram(): Record<string, unknown> {
    return {};
  }
  createShader(): Record<string, unknown> {
    return {};
  }
  attachShader(): void {}
  linkProgram(): void {}
  getProgramParameter(): boolean {
    return true;
  }
  getUniformLocation(): Record<string, unknown> {
    return {};
  }
  createBuffer(): Record<string, unknown> {
    return {};
  }
  shaderSource(): void {}
  compileShader(): void {}
  getShaderParameter(): boolean {
    return true;
  }
  getShaderInfoLog(): string {
    return '';
  }
}

// Mock canvas
class MockCanvas {
  width = 800;
  height = 600;
  getContext(): MockWebGLRenderingContext {
    return new MockWebGLRenderingContext();
  }
}

// Add mocks to global scope
Object.defineProperty(globalThis, 'WebGLRenderingContext', {
  value: MockWebGLRenderingContext,
  writable: true,
  configurable: true,
});

Object.defineProperty(globalThis, 'HTMLCanvasElement', {
  value: MockCanvas,
  writable: true,
  configurable: true,
});

declare const global: any;

// Mock WebGL context
class MockWebGLRenderingContext {
  // Constants
  COLOR_BUFFER_BIT = 0x00004000;
  VERTEX_SHADER = 0x8B31;
  FRAGMENT_SHADER = 0x8B30;
  ARRAY_BUFFER = 0x8892;
  STATIC_DRAW = 0x88E4;
  LINES = 0x0001;
  LINK_STATUS = 0x8B82;
  COMPILE_STATUS = 0x8B81;

  // Mock methods
  viewport() {}
  clearColor() {}
  clear() {}
  useProgram() {}
  uniform2f() {}
  uniform4fv() {}
  bindBuffer() {}
  bufferData() {}
  drawArrays() {}
  createProgram() { return {}; }
  createShader() { return {}; }
  attachShader() {}
  linkProgram() {}
  getProgramParameter() { return true; }
  getUniformLocation() { return {}; }
  createBuffer() { return {}; }
  shaderSource() {}
  compileShader() {}
  getShaderParameter() { return true; }
  getShaderInfoLog() { return ''; }
}

// Mock canvas
class MockCanvas {
  width = 800;
  height = 600;
  getContext() {
    return new MockWebGLRenderingContext();
  }
}

// Add mocks to global scope
global.WebGLRenderingContext = MockWebGLRenderingContext;
global.HTMLCanvasElement = MockCanvas;
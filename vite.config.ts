import { defineConfig } from 'vite';
import { resolve } from 'path';
import type { PluginOption } from 'vite';

export default defineConfig({
  base: '/maze-generator-ts/',
  build: {
    outDir: 'dist',
    target: 'esnext',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        manualChunks: {
          vendor: ['typescript'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'favicon.ico') {
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    strictPort: true,
    hmr: {
      overlay: true,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['typescript'],
  },
  esbuild: {
    target: 'es2020',
    supported: {
      'top-level-await': true,
    },
  },
  publicDir: 'public',
  appType: 'spa',
  worker: {
    format: 'es',
    plugins: (): PluginOption[] => [],
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
});

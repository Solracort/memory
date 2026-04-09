import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // jsdom simula el DOM del navegador para poder usar Web Components en tests
    environment: 'jsdom',
    // Se ejecuta antes de cada archivo de test (polyfills para LitElement)
    setupFiles: ['./test/setup.js'],
    // Cobertura de código con el proveedor v8 (nativo de Node)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.js'],
      // Excluimos el punto de entrada y los archivos que solo re-exportan
      exclude: ['src/main.js'],
    },
  },
});

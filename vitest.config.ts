import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/vitest.setup.ts',
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules', 'build']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
});

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    // Use setupFiles (correct option name)
    setupFiles: ['./src/tests/setup.js'],
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 30000,
    // Use forks pool
    pool: 'forks',
    maxWorkers: 1,
    minWorkers: 1,
    isolate: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.test.js',
        '**/*.test.jsx',
        '**/*.spec.js',
        '**/*.spec.jsx',
      ],
    },
    exclude: ['**/node_modules/**', '**/dist/**'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
})
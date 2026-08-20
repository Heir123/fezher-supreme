 import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.js'],  // Add this
    testTimeout: 120000,
    hookTimeout: 120000,
    teardownTimeout: 120000,
    pool: 'forks',
    maxWorkers: 1,
    minWorkers: 1,
    isolate: false,
    fileParallelism: false,
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
})
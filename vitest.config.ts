import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    environment: 'jsdom', // or 'node' for server-only tests
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
    alias: {
      // If you use @/ for src, otherwise use tsconfigPaths() plugin
      '@': '/src',
    },
    // Uncomment if you want to ignore node_modules except for specific packages
    // deps: { inline: ['nanoid', '@t3-oss/env-nextjs'] },
  },
  plugins: [tsconfigPaths()],
}); 
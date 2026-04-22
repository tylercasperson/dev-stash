import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    include: ['src/actions/**/*.test.ts', 'src/lib/**/*.test.ts'],
    exclude: ['src/**/*.test.tsx', 'node_modules'],
    coverage: {
      provider: 'v8',
      include: ['src/actions/**', 'src/lib/**'],
      exclude: ['src/lib/mock-data.ts', 'src/lib/prisma.ts'],
    },
  },
});

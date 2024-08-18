import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    alias: {
      '@src': './src',
      '@tests': './__tests__',
      '@filters': './src/filters',
      '@services': './src/services',
      '@modules': './src/modules',
      '@decorators': './src/decorators',
      '@middlewares': './src/middlewares',
      '@guards': './src/guards',
      '@interceptors': './src/interceptors',
      '@configurations': './src/configurations',
      '@constants': './src/constants',
    },
  },
  resolve: {
    alias: {
      '@src': './src',
      '@tests': './__tests__',
      '@filters': './src/filters',
      '@services': './src/services',
      '@modules': './src/modules',
      '@decorators': './src/decorators',
      '@middlewares': './src/middlewares',
      '@guards': './src/guards',
      '@interceptors': './src/interceptors',
      '@configurations': './src/configurations',
      '@constants': './src/constants',
    },
  },
  plugins: [swc.vite(), tsconfigPaths()],
});

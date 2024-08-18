import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
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
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
    tsconfigPaths(),
  ],
});

import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: 'public',
  plugins: [{ name: 'copy-auth-setup', apply: 'build', closeBundle() { copyFileSync(resolve('AUTH_SETUP.md'), resolve('dist/AUTH_SETUP.md')); } }],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});

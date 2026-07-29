import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const here = (path: string): string => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  /**
   * Relative base, deliberately.
   *
   * A GitHub Pages *project* page is served from a subdirectory
   * (username.github.io/the-second-self/), not the domain root — and shipping
   * root-absolute asset paths is the single most common way a Pages deploy
   * breaks: everything works locally and 404s in production.
   *
   * Pinning `base: '/the-second-self/'` would fix that but hard-codes the
   * deployment path. './' emits genuinely relative paths, so the same build
   * runs from the project subpath, a user page, a custom domain, or a local
   * `vite preview` with no config change. `npm run check:paths` enforces it.
   */
  base: './',

  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        main: here('index.html'),
        privacy: here('privacy/index.html'),
      },
    },
  },

  server: {
    host: '127.0.0.1',
  },
});

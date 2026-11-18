import { defineConfig } from 'vitest/config';
import { loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// The GitHub account that owns the repository. GitHub Actions sets GITHUB_REPOSITORY_OWNER,
// so a username change only needs DEFAULT_GITHUB_USER updated for local builds.
const DEFAULT_GITHUB_USER = 'charan-reddy-dev';

function githubUserHtml(user: string): Plugin {
  return {
    name: 'github-user-html',
    transformIndexHtml: (html) => html.replaceAll('__GITHUB_USER__', user),
  };
}

// Served as a GitHub Pages project site: https://<github-user>.github.io/portfolio/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const githubUser = (env.PORTFOLIO_GITHUB_USER || env.GITHUB_REPOSITORY_OWNER || DEFAULT_GITHUB_USER).toLowerCase();

  return {
    base: '/portfolio/',
    plugins: [react(), githubUserHtml(githubUser)],
    define: {
      __GITHUB_USER__: JSON.stringify(githubUser),
    },
    build: {
      outDir: 'dist',
      target: 'es2022',
    },
    test: {
      environment: 'node',
      include: ['tests/**/*.test.ts'],
    },
  };
});

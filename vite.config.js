import { defineConfig } from 'vite';

export default defineConfig({
  // Use root base '/' for Vercel deployments, relative './' for GitHub Pages
  base: process.env.VERCEL ? '/' : './',
  server: {
    port: 5173,
    host: true
  }
});

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // './' keeps the site working from any host path (GitHub Pages sub-folders included).
  base: process.env.VITE_BASE || './',
  plugins: [
    react(),
    tailwindcss(),
    {
      // Copies src/assets into dist/ so image paths like "/src/assets/images/..." resolve in production.
      name: 'copy-unbundled-src-assets',
      apply: 'build',
      closeBundle(error?: Error): void {
        if (error) return;
        const distDir = path.resolve(rootDir, 'dist');
        const srcAssets = path.resolve(rootDir, 'src/assets');
        const distAssets = path.resolve(distDir, 'src/assets');
        if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
          fs.cpSync(srcAssets, distAssets, { recursive: true, force: true });
        }
      },
    },
  ],
  resolve: { alias: { '@': rootDir } },
  build: { chunkSizeWarningLimit: 1500 },
});

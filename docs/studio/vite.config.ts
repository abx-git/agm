import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so GitHub Pages and local static servers work without a fixed path.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})

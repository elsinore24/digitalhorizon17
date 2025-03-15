import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure audio files are copied to build
    assetsInclude: ['**/*.mp3'],
  },
  // Properly handle public directory
  publicDir: 'public',
})

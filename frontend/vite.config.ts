/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    alias: {
      'leaflet/dist/leaflet.css': path.resolve(__dirname, 'src/test/__mocks__/emptyModule.ts'),
      'leaflet': path.resolve(__dirname, 'src/test/__mocks__/leaflet.ts'),
      'react-leaflet': path.resolve(__dirname, 'src/test/__mocks__/react-leaflet.tsx'),
    },
  },
})

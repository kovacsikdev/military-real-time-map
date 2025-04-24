import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/military-real-time-map/',
  build: {
    chunkSizeWarningLimit: 160000000000,
  }
})

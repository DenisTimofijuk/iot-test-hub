import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // your backend port
        changeOrigin: true,
        // optional: rewrite paths
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

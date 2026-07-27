import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const backend_url = new URL(import.meta.env.VITE_BACKEND_URL).origin ;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      '/api': {
        target: backend_url,
        changeOrigin: true,
      }
    }
  }
})

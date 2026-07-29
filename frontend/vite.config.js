import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  
  const env = loadEnv(mode, process.cwd(), '');  
  const backend_url = env.VITE_BACKEND_URL ;

  return {
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
  }
})
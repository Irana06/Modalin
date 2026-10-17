import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Same origin as the API during development, so no CORS setup is needed.
    proxy: { '/api': 'http://127.0.0.1:8000' },
  },
})

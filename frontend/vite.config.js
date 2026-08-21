import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Routes /api/openai requests to the local backend proxy,
      // which avoids the OpenAI CORS restriction in the browser.
      '/api': 'http://localhost:5000',
    },
  },
})

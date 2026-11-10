import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Two pages: the project landing page at / and the system design docs at /system-design/.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        docs: resolve(__dirname, 'system-design/index.html'),
      },
    },
  },
})

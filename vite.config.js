import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    open: false, // 새 탭 자동 열기 방지
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  base: "/", // 这里的斜杠非常重要
  build: {
    rollupOptions: { input: { portfolio: 'index.html', ardor: 'ardor/index.html' } },
  },
})

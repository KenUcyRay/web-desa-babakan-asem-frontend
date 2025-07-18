import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// ✅ Tambahin fallback supaya route SPA (React Router) jalan saat refresh
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
    open: true,
    fs: {
      strict: false
    },
    // ✅ Ini penting buat React Router
    historyApiFallback: true 
  }
})

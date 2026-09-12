import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
   build: {
    sourcemap: false,   // disables source maps in production build
  },
  server: {
    port: 5173,
    // Proxy API requests to the Express backend during development.
    // This avoids CORS issues and keeps the frontend unaware of the backend port.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/client': 'http://localhost:5001',
      '/general': 'http://localhost:5001',
      // Add other routes if necessary
    },
  },
});

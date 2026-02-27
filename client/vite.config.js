import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: ['client.image-to-ascii.orb.local'],
    proxy: {
      '/api': {
        target: 'http://server:3038',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: ['client.image-to-ascii.orb.local']
  }
});

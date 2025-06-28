// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: 3000,
    allowedHosts: ['candycrushvite-production.up.railway.app']
  }
});

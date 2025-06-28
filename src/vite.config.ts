// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 可选别名，用于简化导入路径
    },
  },
  server: {
    port: 5173, // 默认端口，可自定义
  },
});

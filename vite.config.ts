import react from '@vitejs/plugin-react';
import fs from 'fs';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  server: {
    https: {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.cert'),
    },
    host: '192.168.0.100',
    port: 5173,
  },
});

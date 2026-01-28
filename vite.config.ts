
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load biến môi trường từ root
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Đảm bảo biến API_KEY luôn được ánh xạ dù mode là gì
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY)
    },
    server: {
      port: 3000,
      host: '0.0.0.0'
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});

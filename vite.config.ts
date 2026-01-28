
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load biến môi trường từ Vercel
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Ánh xạ chính xác biến API_KEY từ Vercel vào trong code
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    server: {
      port: 3000,
      host: '0.0.0.0'
    }
  };
});

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  const isProduction = mode === 'production';
  
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    
    base: '/',
    
    build: {
      outDir: 'dist',
      sourcemap: false,
      emptyOutDir: true,
      minify: isProduction ? 'terser' : false,
    },
    
    server: {
      port: 3000,
      host: true,
    },
    
    preview: {
      port: 3000,
      host: true,
    },
    
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL || 'https://protfolio-backend-8p47.onrender.com'
      ),
      'import.meta.env.VITE_FRONTEND_URL': JSON.stringify(
        env.VITE_FRONTEND_URL || 'https://protfolio-frontend-ytfj.onrender.com'
      ),
    },
  };
});
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'terser' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom', 'react-router-dom'],
            'mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
            'animations': ['framer-motion', 'react-type-animation']
          }
        }
      }
    },
    server: {
      port: 3000,
      host: true,
      proxy: mode === 'development' ? {
        '/api': {
          target: env.VITE_API_URL || 'https://protfolio-backend-8p47.onrender.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      } : undefined
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'https://protfolio-backend-8p47.onrender.com')
    }
  };
});
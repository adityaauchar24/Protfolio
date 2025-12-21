import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

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
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'mui-vendor': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
            'animation-vendor': ['framer-motion', 'react-type-animation'],
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
    },
    
    server: {
      port: 3000,
      host: true,
    },
    
    preview: {
      port: 3000,
      host: true,
    },
    
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'https://protfolio-backend-8p47.onrender.com'),
      'import.meta.env.VITE_FRONTEND_URL': JSON.stringify(env.VITE_FRONTEND_URL || 'https://protfolio-frontend-ytfj.onrender.com'),
    },
  };
});
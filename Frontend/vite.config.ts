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
    
    // Base URL for Render deployment
    base: '/',
    
    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: isProduction ? 'terser' : false,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
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
    
    // Server configuration
    server: {
      port: 3000,
      host: true,
    },
    
    // Preview server for Render
    preview: {
      port: 3000,
      host: true,
    },
    
    // Resolve configuration
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
      },
    },
    
    // Define global constants
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'https://protfolio-backend-8p47.onrender.com'),
      'import.meta.env.VITE_FRONTEND_URL': JSON.stringify(env.VITE_FRONTEND_URL || 'https://protfolio-frontend-ytfj.onrender.com'),
      'import.meta.env.VITE_NODE_ENV': JSON.stringify(mode),
    },
  };
});
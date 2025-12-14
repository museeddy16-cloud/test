import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'public'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react'],
        },
      },
      onwarn(warning, warn) {
        // Suppress CSS parsing warnings
        if (warning.message?.includes('Unexpected') || warning.message?.includes('css-syntax')) {
          return;
        }
        warn(warning);
      },
    },
    chunkSizeWarningLimit: 600,
    minify: 'esbuild',
    cssMinify: false,
  },
  esbuild: {
    logOverride: {
      'css-syntax-error': 'silent',
    },
  },
})

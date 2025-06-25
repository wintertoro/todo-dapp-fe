import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      stream: 'stream-browserify',
      buffer: 'buffer',
      crypto: 'crypto-browserify',
      assert: 'assert',
      http: 'stream-http',
      https: 'https-browserify',
      os: 'os-browserify',
      url: 'url',
      events: 'events'
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Improved chunking strategy with better module detection
        manualChunks: (id) => {
          // React and related libraries
          if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
            return 'react-vendor';
          }
          
          // Ant Design and its dependencies
          if (id.includes('antd') || id.includes('@ant-design') || id.includes('rc-')) {
            return 'antd-vendor';
          }
          
          // Aptos SDK (large library, separate chunk)
          if (id.includes('@aptos-labs/ts-sdk')) {
            return 'aptos-sdk';
          }
          
          // Aptos Wallet adapters (separate from SDK)
          if (id.includes('@aptos-labs/wallet-adapter')) {
            return 'aptos-wallet';
          }
          
          // Crypto libraries (usually large)
          if (id.includes('crypto-js') || 
              id.includes('noble-') || 
              id.includes('ed25519') || 
              id.includes('secp256k1') ||
              id.includes('@noble/') ||
              id.includes('elliptic') ||
              id.includes('bn.js') ||
              id.includes('crypto-browserify') ||
              id.includes('stream-browserify') ||
              id.includes('buffer') ||
              id.includes('events')) {
            return 'crypto-vendor';
          }
          
          // Split large vendor libraries for better caching
          if (id.includes('node_modules')) {
            // Group polyfills and utilities
            if (id.includes('core-js') || 
                id.includes('regenerator-runtime') ||
                id.includes('tslib') ||
                id.includes('@babel/runtime')) {
              return 'polyfills';
            }
            
            // Group utility libraries
            if (id.includes('lodash') || 
                id.includes('moment') || 
                id.includes('date-fns') ||
                id.includes('ramda')) {
              return 'utils';
            }
            
            // Default vendor chunk
            return 'vendor';
          }
        },
        
        // Organize output files into directories
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/css/[name].[hash].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        },
      },
    },
  },
  
  preview: {
    port: 3000,
  },
}) 
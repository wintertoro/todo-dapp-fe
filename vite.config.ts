import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': {},
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
      events: 'events',
      util: 'util',
      path: 'path-browserify',
      process: 'process/browser',
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  optimizeDeps: {
    include: [
      'buffer',
      'process',
      'crypto-browserify',
      'stream-browserify', 
      'events',
      'util',
      'assert',
      'path-browserify',
      'os-browserify',
      'https-browserify',
      'stream-http',
      'url'
    ],
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
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'aptos-sdk': ['@aptos-labs/ts-sdk'],
          'aptos-wallet': ['@aptos-labs/wallet-adapter-react', '@aptos-labs/wallet-adapter-ant-design'],
          'antd-vendor': ['antd'],
          'crypto-vendor': ['crypto-browserify', 'buffer', 'stream-browserify', 'events', 'util', 'assert', 'process']
        },
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
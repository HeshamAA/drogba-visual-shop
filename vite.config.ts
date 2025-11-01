import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: [
      {
        find: "@/components",
        replacement: path.resolve(__dirname, "./src/shared/components"),
      },
      {
        find: "@/hooks",
        replacement: path.resolve(__dirname, "./src/shared/hooks"),
      },
      {
        find: "@/i18n",
        replacement: path.resolve(__dirname, "./src/shared/i18n"),
      },
      {
        find: "@/lib",
        replacement: path.resolve(__dirname, "./src/lib"),
      },
      {
        find: "@/shared",
        replacement: path.resolve(__dirname, "./src/shared"),
      },
      {
        find: "@/features",
        replacement: path.resolve(__dirname, "./src/features"),
      },
      {
        find: "@/api",
        replacement: path.resolve(__dirname, "./src/api"),
      },
      {
        find: "@/contexts",
        replacement: path.resolve(__dirname, "./src/contexts"),
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React vendor chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI libraries chunk
          'ui-vendor': [
            'framer-motion',
            'lucide-react',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-toast',
          ],
          
          // Redux chunk
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          
          // i18n chunk
          'i18n-vendor': ['i18next', 'react-i18next'],
          
          // Other utilities
          'utils-vendor': ['axios', 'react-hot-toast', 'react-helmet-async'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    
    // Minify with terser for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'i18next',
      'react-i18next',
    ],
  },
}));

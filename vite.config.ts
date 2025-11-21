import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// ✅ CODEPILOT TASK 1.1: Production Config (Vercel Deployment)
// STRATEGY: Optimized for Vercel, local dev on 5173 (Vite default)
export default defineConfig({
  base: '/',

  plugins: [react()],

  // Development Server (localhost)
  server: {
    host: '0.0.0.0',
    port: 5173, // ✅ Vite default port (avoid Replit legacy)
    strictPort: false, // ✅ Flexible for dev
    open: false, // ✅ Don't auto-open browser
    hmr: {
      overlay: true, // ✅ Show build errors in browser
    },
  },

  // Preview Server (local production test)
  preview: {
    host: '0.0.0.0',
    port: 4173, // ✅ Vite default preview port
    strictPort: false,
    open: false,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ✅ CODEPILOT TASK 1.1: Dependency Pre-Bundling Optimization
  // STRATEGY: Pre-bundle heavy dependencies for faster HMR
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'date-fns',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@tanstack/react-query',
    ],
    // Exclude problematic dependencies
    exclude: ['@vite-pwa/assets-generator'],
  },

  // ✅ CODEPILOT TASK 1.1: Production Build Optimization (Vercel)
  build: {
    target: 'es2020', // ✅ Modern browsers (95%+ support)
    minify: 'terser', // ✅ Best compression
    cssCodeSplit: true, // ✅ Split CSS per route
    sourcemap: false, // ✅ PRODUCTION: No sourcemaps (security)
    chunkSizeWarningLimit: 1000, // ✅ Allow large chunks for export libs

    // ✅ Terser Options (Production)
    terserOptions: {
      compress: {
        drop_console: true, // ✅ Remove console.log in production
        drop_debugger: true, // ✅ Remove debugger statements
        pure_funcs: ['console.log', 'console.info'], // ✅ Additional cleanup
      },
      mangle: {
        safari10: true, // ✅ Safari 10 compatibility
      },
      format: {
        comments: false, // ✅ Remove all comments
      },
    },

    rollupOptions: {
      output: {
        format: 'es',
        // Optimized for production
        compact: true,
        // Module bundling for better tree-shaking
        preserveModules: false,

        // ✅ PHASE 15: Code-Splitting & Manual Chunks
        manualChunks: {
          // React Core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // UI Libraries
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],

          // Charts & Visualization
          'charts': ['recharts'],

          // Forms
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],

          // Supabase
          'supabase': ['@supabase/supabase-js'],

          // Export Libraries (Heavy)
          'export-libs': ['exceljs', 'jspdf', 'html2canvas'],

          // Date & Time
          'date-libs': ['date-fns'],

          // Icons
          'icons': ['lucide-react'],
        },
      },
    },
  },
});

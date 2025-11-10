import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// PRODUCTION CONFIG: Optimized for Vercel deployment
export default defineConfig(({ mode }) => {
  // Allow overriding base path via env for subpath deployments (e.g. /master/)
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE_PATH && env.VITE_BASE_PATH.trim() !== ""
    ? env.VITE_BASE_PATH
    : "/";

  return {
    base,
    
    plugins: [react()],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@sentry/react": path.resolve(__dirname, "./src/lib/sentry-shim.ts"),
    },
  },
  
  // ✅ Dependency Pre-Bundling Optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'date-fns',
      'lucide-react',
      '@sentry/react',
    ],
    exclude: ['@sentry/node'],
  },
  
  // ✅ External dependencies for build
  build: {
    target: 'es2020',
    minify: 'terser', // PRODUCTION MINIFICATION
    cssCodeSplit: true,
    sourcemap: false, // PRODUCTION: No sourcemaps
    chunkSizeWarningLimit: 1000, // Increase limit for large export libraries
    
    rollupOptions: {
      external: ['@sentry/node'],
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
    
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },
  };
});

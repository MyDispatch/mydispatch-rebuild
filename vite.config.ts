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

        // ✅ PHASE 15: Code-Splitting & Manual Chunks (OPTIMIZED)
        manualChunks: (id) => {
          // React Core Vendor (always loaded)
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
            return 'react-vendor';
          }

          // Supabase (core functionality)
          if (id.includes('@supabase/supabase-js')) {
            return 'supabase';
          }

          // UI Components (Radix UI)
          if (id.includes('@radix-ui/')) {
            return 'ui-vendor';
          }

          // Charts (heavy, split into separate chunk)
          if (id.includes('recharts')) {
            return 'charts';
          }

          // Forms (zod + react-hook-form)
          if (id.includes('react-hook-form') || id.includes('@hookform/resolvers') || id.includes('zod')) {
            return 'forms';
          }

          // Date utilities
          if (id.includes('date-fns')) {
            return 'date-libs';
          }

          // Icons
          if (id.includes('lucide-react')) {
            return 'icons';
          }

          // ✅ SPLIT EXPORT LIBS INTO SMALLER CHUNKS (1.5MB → 3x ~500KB)
          
          // PDF Export (jsPDF + dependencies)
          if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify')) {
            return 'pdf-export';
          }

          // Excel Export (exceljs)
          if (id.includes('exceljs')) {
            return 'excel-export';
          }

          // PDF Make (alternative PDF generator)
          if (id.includes('pdfmake')) {
            return 'pdfmake-export';
          }

          // Calendar utilities
          if (id.includes('react-big-calendar') || id.includes('react-calendar')) {
            return 'calendar';
          }

          // TanStack Query (React Query)
          if (id.includes('@tanstack/react-query')) {
            return 'react-query';
          }

          // Stripe
          if (id.includes('@stripe/stripe-js')) {
            return 'stripe';
          }

          // Testing libraries (should not be in production, but just in case)
          if (id.includes('@testing-library/') || id.includes('vitest')) {
            return 'testing';
          }

          // Everything else goes into default chunk
          return undefined;
        },
      },
    },
  },
});

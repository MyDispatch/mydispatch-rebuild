import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// PRODUCTION CONFIG: Performance-Optimized
export default defineConfig({
  base: '/',
  
  plugins: [react()],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    target: 'esnext',
    minify: 'terser',
    cssCodeSplit: true,
    sourcemap: true,
    chunkSizeWarningLimit: 600, // Warn at 600 KB instead of 500 KB
    
    rollupOptions: {
      output: {
        format: 'es',
        compact: true,
        
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
  
  // ✅ Dependency Pre-Bundling Optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'date-fns',
      'lucide-react',
    ],
  },
});

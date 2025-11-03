import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// FIX #1: Remove problematic modulepreload links
const removeModulePreloadPlugin = () => ({
  name: 'remove-modulepreload',
  transformIndexHtml(html: string) {
    // Remove ALL modulepreload links - they cause race conditions
    return html.replace(/<link\s+rel="modulepreload"[^>]*>/g, '');
  },
});

export default defineConfig(({ mode }) => ({
  base: '/',
  
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      '.manusvm.computer',
      'localhost',
    ],
  },
  
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
    ],
    esbuildOptions: {
      target: 'es2020',
      define: {
        global: 'globalThis',
      },
    },
  },
  
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    minify: 'esbuild',
    sourcemap: mode === 'development',
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    
    // FIX: Disable modulePreload polyfill
    modulePreload: {
      polyfill: false,
    },
    
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // CORE REACT - ALL in one chunk
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/scheduler/') ||
              id.includes('/@radix-ui/') ||
              id.includes('/react-router') ||
              id.includes('/react-hook-form/') ||
              id.includes('/@hookform/')
            ) {
              return 'vendor-react-core';
            }
            
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            
            if (id.includes('@tanstack')) {
              return 'vendor-query';
            }
            
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            
            if (id.includes('zod')) {
              return 'vendor-validation';
            }
            
            if (id.includes('date-fns')) {
              return 'vendor-date';
            }
            
            if (
              id.includes('clsx') || 
              id.includes('tailwind-merge') || 
              id.includes('class-variance-authority')
            ) {
              return 'vendor-utils';
            }
            
            return 'vendor-other';
          }
        },
        
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        format: 'es',
        experimentalMinChunkSize: 20000,
      },
      
      treeshake: {
        preset: 'recommended',
        moduleSideEffects: 'no-external',
      },
    },
  },
  
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: 'react',
    }),
    removeModulePreloadPlugin(), // FIX #1: Remove modulepreload
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
}));

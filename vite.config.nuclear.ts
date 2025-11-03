import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// NUCLEAR OPTION: Absolute minimum configuration
// NO optimizations, NO chunking, NO nothing
export default defineConfig({
  base: '/',
  
  server: {
    host: "::",
    port: 8080,
  },
  
  plugins: [react()],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: {
    target: 'esnext',
    minify: false, // NO minification
    cssCodeSplit: false, // NO CSS splitting
    sourcemap: true, // Full sourcemaps
    
    rollupOptions: {
      output: {
        // NO manual chunks - let Vite decide
        manualChunks: undefined,
        format: 'es',
        // Put EVERYTHING in one file
        inlineDynamicImports: true,
      },
    },
  },
  
  // Minimal optimizations
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});

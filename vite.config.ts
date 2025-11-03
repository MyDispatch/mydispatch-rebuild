import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// DEBUG CONFIG: NO optimizations, NO minification
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
    minify: false, // NO MINIFICATION
    cssCodeSplit: false,
    sourcemap: true,
    
    rollupOptions: {
      output: {
        format: 'es',
        // Keep everything readable
        compact: false,
        // No mangling
        preserveModules: false,
      },
    },
  },
});

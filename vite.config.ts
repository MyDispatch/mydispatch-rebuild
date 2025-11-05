import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa';

// DEBUG CONFIG: NO optimizations, NO minification
export default defineConfig({
  base: '/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'MyDispatch',
        short_name: 'MyDispatch',
        description: 'Führende Software für Taxi- & Mietwagenunternehmen',
        theme_color: '#334155',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    target: 'esnext',
    minify: 'terser', // PRODUCTION MINIFICATION
    cssCodeSplit: true,
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

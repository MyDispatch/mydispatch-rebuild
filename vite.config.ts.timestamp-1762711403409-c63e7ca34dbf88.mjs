// vite.config.ts
import { defineConfig } from "file:///C:/Users/pcour/Desktop/MyDispatch_ALL/mydispatch-rebuild/mydispatch-rebuild/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/pcour/Desktop/MyDispatch_ALL/mydispatch-rebuild/mydispatch-rebuild/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\pcour\\Desktop\\MyDispatch_ALL\\mydispatch-rebuild\\mydispatch-rebuild";
var vite_config_default = defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  // ✅ Dependency Pre-Bundling Optimization
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@supabase/supabase-js",
      "date-fns",
      "lucide-react"
    ],
    exclude: ["@sentry/node", "@sentry/core", "@sentry/browser"]
  },
  // ✅ External dependencies for build
  build: {
    target: "es2020",
    minify: "terser",
    // PRODUCTION MINIFICATION
    cssCodeSplit: true,
    sourcemap: false,
    // PRODUCTION: No sourcemaps
    chunkSizeWarningLimit: 1e3,
    // Increase limit for large export libraries
    rollupOptions: {
      external: ["@sentry/node", "@sentry/core", "@sentry/browser"],
      output: {
        format: "es",
        // Optimized for production
        compact: true,
        // Module bundling for better tree-shaking
        preserveModules: false,
        // ✅ PHASE 15: Code-Splitting & Manual Chunks
        manualChunks: {
          // React Core
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // UI Libraries
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip"
          ],
          // Charts & Visualization
          "charts": ["recharts"],
          // Forms
          "forms": ["react-hook-form", "@hookform/resolvers", "zod"],
          // Supabase
          "supabase": ["@supabase/supabase-js"],
          // Export Libraries (Heavy)
          "export-libs": ["exceljs", "jspdf", "html2canvas"],
          // Date & Time
          "date-libs": ["date-fns"],
          // Icons
          "icons": ["lucide-react"]
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        // Remove console.log in production
        drop_debugger: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxwY291clxcXFxEZXNrdG9wXFxcXE15RGlzcGF0Y2hfQUxMXFxcXG15ZGlzcGF0Y2gtcmVidWlsZFxcXFxteWRpc3BhdGNoLXJlYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHBjb3VyXFxcXERlc2t0b3BcXFxcTXlEaXNwYXRjaF9BTExcXFxcbXlkaXNwYXRjaC1yZWJ1aWxkXFxcXG15ZGlzcGF0Y2gtcmVidWlsZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvcGNvdXIvRGVza3RvcC9NeURpc3BhdGNoX0FMTC9teWRpc3BhdGNoLXJlYnVpbGQvbXlkaXNwYXRjaC1yZWJ1aWxkL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG4vLyBQUk9EVUNUSU9OIENPTkZJRzogT3B0aW1pemVkIGZvciBWZXJjZWwgZGVwbG95bWVudFxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYmFzZTogJy8nLFxuICBcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICBcbiAgLy8gXHUyNzA1IERlcGVuZGVuY3kgUHJlLUJ1bmRsaW5nIE9wdGltaXphdGlvblxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXG4gICAgICAncmVhY3QnLFxuICAgICAgJ3JlYWN0LWRvbScsXG4gICAgICAncmVhY3Qtcm91dGVyLWRvbScsXG4gICAgICAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJyxcbiAgICAgICdkYXRlLWZucycsXG4gICAgICAnbHVjaWRlLXJlYWN0JyxcbiAgICBdLFxuICAgIGV4Y2x1ZGU6IFsnQHNlbnRyeS9ub2RlJywgJ0BzZW50cnkvY29yZScsICdAc2VudHJ5L2Jyb3dzZXInXSxcbiAgfSxcbiAgXG4gIC8vIFx1MjcwNSBFeHRlcm5hbCBkZXBlbmRlbmNpZXMgZm9yIGJ1aWxkXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXMyMDIwJyxcbiAgICBtaW5pZnk6ICd0ZXJzZXInLCAvLyBQUk9EVUNUSU9OIE1JTklGSUNBVElPTlxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLCAvLyBQUk9EVUNUSU9OOiBObyBzb3VyY2VtYXBzXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLCAvLyBJbmNyZWFzZSBsaW1pdCBmb3IgbGFyZ2UgZXhwb3J0IGxpYnJhcmllc1xuICAgIFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbJ0BzZW50cnkvbm9kZScsICdAc2VudHJ5L2NvcmUnLCAnQHNlbnRyeS9icm93c2VyJ10sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZm9ybWF0OiAnZXMnLFxuICAgICAgICAvLyBPcHRpbWl6ZWQgZm9yIHByb2R1Y3Rpb25cbiAgICAgICAgY29tcGFjdDogdHJ1ZSxcbiAgICAgICAgLy8gTW9kdWxlIGJ1bmRsaW5nIGZvciBiZXR0ZXIgdHJlZS1zaGFraW5nXG4gICAgICAgIHByZXNlcnZlTW9kdWxlczogZmFsc2UsXG4gICAgICAgIFxuICAgICAgICAvLyBcdTI3MDUgUEhBU0UgMTU6IENvZGUtU3BsaXR0aW5nICYgTWFudWFsIENodW5rc1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAvLyBSZWFjdCBDb3JlXG4gICAgICAgICAgJ3JlYWN0LXZlbmRvcic6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBVSSBMaWJyYXJpZXNcbiAgICAgICAgICAndWktdmVuZG9yJzogW1xuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1kaWFsb2cnLFxuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1kcm9wZG93bi1tZW51JyxcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3Qtc2VsZWN0JyxcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtdGFicycsXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LXRvYXN0JyxcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtdG9vbHRpcCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBDaGFydHMgJiBWaXN1YWxpemF0aW9uXG4gICAgICAgICAgJ2NoYXJ0cyc6IFsncmVjaGFydHMnXSxcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBGb3Jtc1xuICAgICAgICAgICdmb3Jtcyc6IFsncmVhY3QtaG9vay1mb3JtJywgJ0Bob29rZm9ybS9yZXNvbHZlcnMnLCAnem9kJ10sXG4gICAgICAgICAgXG4gICAgICAgICAgLy8gU3VwYWJhc2VcbiAgICAgICAgICAnc3VwYWJhc2UnOiBbJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcyddLFxuICAgICAgICAgIFxuICAgICAgICAgIC8vIEV4cG9ydCBMaWJyYXJpZXMgKEhlYXZ5KVxuICAgICAgICAgICdleHBvcnQtbGlicyc6IFsnZXhjZWxqcycsICdqc3BkZicsICdodG1sMmNhbnZhcyddLFxuICAgICAgICAgIFxuICAgICAgICAgIC8vIERhdGUgJiBUaW1lXG4gICAgICAgICAgJ2RhdGUtbGlicyc6IFsnZGF0ZS1mbnMnXSxcbiAgICAgICAgICBcbiAgICAgICAgICAvLyBJY29uc1xuICAgICAgICAgICdpY29ucyc6IFsnbHVjaWRlLXJlYWN0J10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLCAvLyBSZW1vdmUgY29uc29sZS5sb2cgaW4gcHJvZHVjdGlvblxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlhLFNBQVMsb0JBQW9CO0FBQzliLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBRU4sU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBRWpCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBR0EsY0FBYztBQUFBLElBQ1osU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVMsQ0FBQyxnQkFBZ0IsZ0JBQWdCLGlCQUFpQjtBQUFBLEVBQzdEO0FBQUE7QUFBQSxFQUdBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQTtBQUFBLElBQ1IsY0FBYztBQUFBLElBQ2QsV0FBVztBQUFBO0FBQUEsSUFDWCx1QkFBdUI7QUFBQTtBQUFBLElBRXZCLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxnQkFBZ0IsZ0JBQWdCLGlCQUFpQjtBQUFBLE1BQzVELFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQTtBQUFBLFFBRVIsU0FBUztBQUFBO0FBQUEsUUFFVCxpQkFBaUI7QUFBQTtBQUFBLFFBR2pCLGNBQWM7QUFBQTtBQUFBLFVBRVosZ0JBQWdCLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBO0FBQUEsVUFHekQsYUFBYTtBQUFBLFlBQ1g7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFVBQ0Y7QUFBQTtBQUFBLFVBR0EsVUFBVSxDQUFDLFVBQVU7QUFBQTtBQUFBLFVBR3JCLFNBQVMsQ0FBQyxtQkFBbUIsdUJBQXVCLEtBQUs7QUFBQTtBQUFBLFVBR3pELFlBQVksQ0FBQyx1QkFBdUI7QUFBQTtBQUFBLFVBR3BDLGVBQWUsQ0FBQyxXQUFXLFNBQVMsYUFBYTtBQUFBO0FBQUEsVUFHakQsYUFBYSxDQUFDLFVBQVU7QUFBQTtBQUFBLFVBR3hCLFNBQVMsQ0FBQyxjQUFjO0FBQUEsUUFDMUI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBRUEsZUFBZTtBQUFBLE1BQ2IsVUFBVTtBQUFBLFFBQ1IsY0FBYztBQUFBO0FBQUEsUUFDZCxlQUFlO0FBQUEsTUFDakI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

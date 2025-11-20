import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "/",

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    target: "es2020",
    minify: "esbuild",
    sourcemap: true,

    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.minimal.html"),
      },
      output: {
        format: "es",
      },
    },
  },
});

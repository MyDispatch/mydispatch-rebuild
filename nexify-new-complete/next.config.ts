import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    // Erlaube Imports außerhalb des Projektverzeichnisses (z. B. aus ../src)
    externalDir: true,
  },
  // Silence workspace root warnings by explicitly setting roots
  turbopack: {
    root: __dirname,
  },
  outputFileTracingRoot: __dirname,
  webpack: (config) => {
    // Alias 'legacy/*' -> '../src/*' für direkte Nutzung der Originaldateien
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      legacy: path.resolve(__dirname, "../src"),
    };
    return config;
  },
};

export default nextConfig;

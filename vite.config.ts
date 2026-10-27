import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "node:url";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Large libraries that nothing else depends on get their own chunks:
        // keeps every chunk under Vite's 500 kB warning and lets browsers cache
        // them across deploys. Do not split out React, react-router or Radix:
        // the vendor chunk needs them and they need it back, and that circular
        // chunk import breaks the site at runtime (checked 2026-10-27).
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("@supabase")) return "supabase";
          // recharts and the libraries only it uses (its redux store, immer, d3)
          if (/[/](recharts|victory-vendor|d3-[^/]+|@reduxjs|react-redux|immer|reselect|decimal\.js-light|es-toolkit)[/]/.test(id)) return "charts";
          // libraries that import nothing, so they cannot form a cycle
          if (/[/](zod|date-fns|tailwind-merge|@tanstack[/]query-core)[/]/.test(id)) return "libs";
          return "vendor";
        },
      },
    },
  },
  // This ensures that all routes are handled by the SPA
  preview: {
    port: 8080,
  },
}));

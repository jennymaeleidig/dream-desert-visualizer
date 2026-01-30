import { defineConfig } from "vite";

// Disable HMR / hot reload for local dev server
export default defineConfig({
  server: {
    hmr: false,
  },
});

import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      buffer: "buffer/",
    },
  },
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});

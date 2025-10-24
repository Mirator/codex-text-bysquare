import { defineConfig } from "vite";

export default defineConfig({
  // Use a relative base path so the bundle works with GitHub Pages default
  // workflows regardless of whether the site is published at the root domain
  // (e.g. https://example.github.io/) or under a repository path
  // (e.g. https://example.github.io/project/).
  base: "./",
});

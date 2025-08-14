// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";
import handlebars from "vite-plugin-handlebars";
import copy from "rollup-plugin-copy";

export default defineConfig({
  base: "./", // Ensure relative paths for assets
  root: "src",
  build: {
    outDir: "../dist", // Output to project root dist directory
    emptyOutDir: true, // Clean the output directory before building
  },
  
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "src/partials"),
    }),
    copy({
      targets: [
        { src: "../optimized-assets/**/*", dest: "../dist/assets" }, // Copy optimized assets to dist/assets
        { src: "resume.pdf", dest: "../dist" }, // Copy resume.pdf to the dist folder
        { src: "src/game.html", dest: "../dist" }, // Correctly copy game.html from src to dist
      ],
      hook: "writeBundle", // Ensure this runs after the build
    }),
  ],
});

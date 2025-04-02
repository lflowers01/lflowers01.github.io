// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";
import handlebars from "vite-plugin-handlebars";
import copy from "rollup-plugin-copy";

export default defineConfig({
  base: "./", // Ensure relative paths for assets
  root: "src",
  build: {
    outDir: "../dist", // Output directory for build
    emptyOutDir: true, // Automatically purge the dist folder before building
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
      },
      output: {
        assetFileNames: "assets/[name][extname]", // Ensure assets are placed in the correct folder
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "src/partials"),
    }),
    copy({
      targets: [
        { src: "../optimized-assets/**/*", dest: "../dist/assets" }, // Copy optimized assets to dist/assets
        { src: "src/resume.pdf", dest: "../dist" } // Copy resume.pdf to the dist folder
      ],
      hook: "writeBundle", // Ensure this runs after the build
    }),
  ],
});

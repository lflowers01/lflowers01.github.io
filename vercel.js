// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";
import handlebars from "vite-plugin-handlebars";
import copy from "rollup-plugin-copy";

export default defineConfig({
  base: "/", // Changed to root-relative paths for Vercel
  root: "src",
  assetsInclude: ["**/*.htm"], // Add .htm files as assets
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        portfolio: resolve(__dirname, "src/portfolio.html"),
        projectile: resolve(__dirname, "src/projectile-sim.html"),
        game: resolve(__dirname, "src/game.htm"),
        sadgrl: resolve(__dirname, "src/sadgrl.online.html"),
        test: resolve(__dirname, "src/test.html")
      },
      output: {
        assetFileNames: (assetInfo) => {
          // Keep .htm files in the root directory
          if (assetInfo.name.endsWith('.htm')) {
            return '[name][extname]';
          }
          // Put other assets in the assets directory
          return 'assets/[name][extname]';
        },
      },
    },
  },
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "src/partials"),
    }),
    copy({
      targets: [
        { src: "optimized-assets/**/*", dest: "dist/assets" },
        { src: "src/resume.pdf", dest: "dist" },
        { src: "src/password-tool/**/*", dest: "dist/password-tool" }
      ],
      hook: "writeBundle",
    }),
  ],
});
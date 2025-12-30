import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import copy from "rollup-plugin-copy";

export default defineConfig({
  base: "/",
  assetsInclude: ["**/*.htm"], // <-- add this
  resolve: {
    alias: [
      { find: /^\/js\/(.*)$/, replacement: "/src/js/$1" },
      { find: /^\/scss\/(.*)$/, replacement: "/src/scss/$1" },
      { find: /^\/assets\/(.*)$/, replacement: "/src/assets/$1" }
    ]
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "src/index.html",
        portfolio: "src/portfolio.html",
        projectile: "src/projectile-sim.html",
        game: "src/game.htm",
        test: "src/test.html",
        upload: "src/upload.html"
      }
    }
  },
  plugins: [
    handlebars({ partialDirectory: "src/partials" }),
    copy({
      targets: [
        { src: "optimized-assets/**/*", dest: "dist/assets" },
        { src: "src/resume.pdf", dest: "dist" },
        { src: "src/password-tool/**/*", dest: "dist/password-tool" }
      ],
      hook: "writeBundle"
    })
  ]
});

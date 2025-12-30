// vite.config.js
export default defineConfig({
    base: "/", 
    root: "src",
    assetsInclude: ["**/*.htm"], 
    build: {
      outDir: "dist",  // <-- make it project-root-relative
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
            if (assetInfo.name.endsWith(".htm")) return "[name][extname]";
            return "assets/[name][extname]";
          }
        }
      }
    },
    plugins: [
      handlebars({
        partialDirectory: resolve(__dirname, "src/partials")
      }),
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
  
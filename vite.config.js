import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import { resolve } from "path";
import fs from "fs";

const ROOT_DIR = process.cwd();

/**
 * Find all .html / .htm files in the root directory
 */
function getHtmlInputs() {
  const inputs = {};
  const rootFiles = fs.readdirSync(ROOT_DIR);

  for (const file of rootFiles) {
    const fullPath = resolve(ROOT_DIR, file);
    const stat = fs.statSync(fullPath);

    // Only process HTML files in the root directory, excluding game.htm
    if (stat.isFile() && file.endsWith(".html")) {
      const name = file.replace(/\.html$/, "");
      inputs[name] = fullPath;
    }
  }

  return inputs;
}

/**
 * Plugin to copy static assets to dist
 */
function copyStaticAssets() {
  return {
    name: "copy-static-assets",
    closeBundle: async () => {
      const { default: fs } = await import("fs-extra");
      
      // Copy optimized assets (or fallback to assets)
      const assetsSource = fs.existsSync("optimized-assets") ? "optimized-assets" : "assets";
      await fs.copy(assetsSource, "dist/assets", { overwrite: true });
      
      // Copy game.htm as static file
      if (fs.existsSync("game.htm")) {
        await fs.copy("game.htm", "dist/game.htm");
      }
      
      // Copy PDFs
      if (fs.existsSync("resume.pdf")) {
        await fs.copy("resume.pdf", "dist/resume.pdf");
      }
      if (fs.existsSync("portfolio.pdf")) {
        await fs.copy("portfolio.pdf", "dist/portfolio.pdf");
      }
      
      // Copy password-tool directory
      if (fs.existsSync("password-tool")) {
        await fs.copy("password-tool", "dist/password-tool", { overwrite: true });
      }
      
      // Copy CNAME for custom domain
      if (fs.existsSync("CNAME")) {
        await fs.copy("CNAME", "dist/CNAME");
      }

      console.log("✅ Static assets copied to dist/");
    },
  };
}

export default defineConfig({
  base: "/",
  
  publicDir: "public",

  // Treat .htm files as static assets
  assetsInclude: ["**/*.htm"],

  resolve: {
    alias: {
      "/js": resolve(ROOT_DIR, "js"),
      "/scss": resolve(ROOT_DIR, "scss"),
      "/assets": resolve(ROOT_DIR, "assets"),
    },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlInputs(),
    },
  },

  plugins: [
    handlebars({
      partialDirectory: resolve(ROOT_DIR, "partials"),
    }),
    copyStaticAssets(),
  ],
});

import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import copy from "rollup-plugin-copy";
import { resolve } from "path";
import fs from "fs";

const ROOT_DIR = process.cwd();

/**
 * Find all .html / .htm files EXCEPT legacy folders
 */
function getHtmlInputs(dir = ROOT_DIR) {
  const inputs = {};

  for (const file of fs.readdirSync(dir)) {
    if (
      ["node_modules", "dist", ".git", "password-tool"].includes(file)
    ) continue;

    const fullPath = resolve(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      Object.assign(inputs, getHtmlInputs(fullPath));
    } else if (file.endsWith(".html") || file.endsWith(".htm")) {
      const name = fullPath
        .replace(ROOT_DIR + "\\", "")
        .replace(ROOT_DIR + "/", "")
        .replace(/\.(html|htm)$/, "")
        .replace(/[\\/]/g, "-");

      inputs[name] = fullPath;
    }
  }

  return inputs;
}

export default defineConfig({
  base: "/",

  // ✅ THIS FIXES game.htm
  assetsInclude: ["**/*.htm"],

  resolve: {
    alias: [
      { find: /^\/js\/(.*)$/, replacement: "/js/$1" },
      { find: /^\/scss\/(.*)$/, replacement: "/scss/$1" },
      { find: /^\/assets\/(.*)$/, replacement: "/assets/$1" }
    ]
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlInputs()
    }
  },

  plugins: [
    handlebars({
      partialDirectory: resolve(ROOT_DIR, "partials")
    }),

    copy({
      targets: [
        { src: "optimized-assets/**/*", dest: "dist/assets" },
        { src: "resume.pdf", dest: "dist" },
        { src: "password-tool/**/*", dest: "dist/password-tool" }
      ],
      hook: "writeBundle"
    })
  ]
});

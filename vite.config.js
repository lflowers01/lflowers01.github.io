import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import copy from "rollup-plugin-copy";
import { resolve } from "path";
import fs from "fs";

/**
 * Automatically find all .html / .htm files in src/
 */
function getHtmlInputs(dir = "src") {
  const inputs = {};

  for (const file of fs.readdirSync(dir)) {
    const fullPath = `${dir}/${file}`;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      Object.assign(inputs, getHtmlInputs(fullPath));
    } else if (file.endsWith(".html") || file.endsWith(".htm")) {
      const name = fullPath
        .replace(/^src\//, "")
        .replace(/\.(html|htm)$/, "")
        .replace(/\//g, "-");

      inputs[name] = resolve(__dirname, fullPath);
    }
  }

  return inputs;
}

export default defineConfig({
  base: "/",

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
      input: getHtmlInputs()
    }
  },

  plugins: [
    handlebars({
      partialDirectory: "src/partials"
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

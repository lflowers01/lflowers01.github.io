// vercel.js
export default {
    builds: [
      {
        src: "package.json",
        use: "@vercel/static-build",
        config: {
          distDir: "dist" // matches your Vite output
        }
      }
    ],
    routes: [

      { src: "/", dest: "src/index.html" },
      { src: "/portfolio", dest: "src/portfolio.html" },
      { src: "/projectile", dest: "src/projectile-sim.html" },
      { src: "/game", dest: "src/game.htm" },
      { src: "/sadgrl", dest: "src/sadgrl.online.html" },
      { src: "/test", dest: "src/test.html" },
      { src: "/upload", dest: "src/upload.html" },
      { src: "/projectile-sim", dest: "src/projectile-sim.html" }
    ]
  };
  
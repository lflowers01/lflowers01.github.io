// vercel.js
export default {
    builds: [
      {
        src: "vite.config.js", // your build config
        use: "@vercel/static-build",
        config: {
          distDir: "dist" // Vite output directory
        }
      }
    ],
    routes: [
      { src: "/", dest: "/index.html" },
      { src: "/portfolio", dest: "/portfolio.html" },
      { src: "/projectile", dest: "/projectile-sim.html" },
      { src: "/game", dest: "/game.htm" },
      { src: "/sadgrl", dest: "/sadgrl.online.html" },
      { src: "/test", dest: "/test.html" }
    ]
  };
  
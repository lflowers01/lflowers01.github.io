// vercel.js
export default {
    builds: [
      {
        src: "package.json",       // project root
        use: "@vercel/static-build",
        config: {
          distDir: "dist"          // matches your Vite build output
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
  
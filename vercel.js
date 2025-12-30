// vercel.js
export default {
    build: {
      // Run Vite build
      command: "vite build",
      // Output directory of Vite
      outputDirectory: "dist"
    },
    routes: [
      { src: "/", dest: "/index.html" },
      { src: "/portfolio", dest: "/portfolio.html" },
      { src: "/projectile", dest: "/projectile-sim.html" },
      { src: "/game", dest: "/game.htm" },
      { src: "/sadgrl", dest: "/sadgrl.online.html" },
      { src: "/test", dest: "/test.html" }
    ]
  };
  
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

      { src: "/", dest: "/index.html" },
      { src: "/projectile", dest: "/projectile-sim.html" },
      { src: "/game", dest: "/game.htm" },
      { src: "/test", dest: "/test.html" },
      { src: "/upload", dest: "/upload.html" },
      { src: "/projectile-sim", dest: "/projectile-sim.html" },
      { src: "/portfolio", dest: "/portfolio.pdf" },
      { src: "/resume", dest: "/resume.pdf" },
    ]
  };
  
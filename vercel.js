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
      { src: "/test", dest: "/test.html" }
    ]

  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    { "source": "/portfolio", "destination": "/portfolio.html" },
    { "source": "/projectile", "destination": "/projectile-sim.html" },
    { "source": "/game", "destination": "/game.htm" },
    { "source": "/sadgrl", "destination": "/sadgrl.online.html" },
    { "source": "/test", "destination": "/test.html" },
    { "source": "/upload", "destination": "/upload.html" }
  ]
};
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
    
  };
  
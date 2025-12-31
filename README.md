# Personal Portfolio Website

A retro-styled personal portfolio website built with Vite and styled with 98.css.

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view your site locally.

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory.

## 📦 Deploy to Vercel

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### Option 2: Using Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Vercel will automatically detect Vite and use the correct settings
6. Click "Deploy"

Your site will be live in minutes! Vercel will automatically redeploy whenever you push changes to your main branch.

## 📁 Project Structure

```
├── index.html              # Main page
├── portfolio.html          # Portfolio page
├── projectile-sim.html     # Physics simulator
├── game.htm                # Squirrel Simulator game
├── assets/                 # Static assets (images, fonts, icons)
├── optimized-assets/       # Optimized versions of assets
├── js/                     # JavaScript modules
├── scss/                   # Sass stylesheets
├── partials/               # Handlebars partial templates
├── password-tool/          # Password generator tool
├── dist/                   # Build output (generated)
└── vite.config.js          # Vite configuration
```

## 🛠️ Built With

- **Vite** - Fast build tool and dev server
- **98.css** - Windows 98 style CSS framework
- **Sass** - CSS preprocessor
- **Handlebars** - Template engine for partials

## ✨ Features

- ✅ Optimized Vite build configuration
- ✅ Automatic asset copying and optimization
- ✅ Handlebars partials support
- ✅ All internal links working correctly
- ✅ Dark mode toggle
- ✅ Responsive design
- ✅ Ready for Vercel deployment

## 📝 Notes

- The `dist/` directory is gitignored and regenerated on each build
- All assets from `optimized-assets/` (or `assets/` as fallback) are automatically copied to the build
- PDFs (resume.pdf, portfolio.pdf) are included in the build
- The password-tool is copied as a standalone directory
- Custom domain support via CNAME file

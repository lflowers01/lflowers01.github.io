# Deployment Checklist & Guide

## Pre-Deployment Setup

### 1. Environment Variables
- `.env` file is in `.gitignore` ✅ (won't be committed)
- Password is stored securely in `.env` locally only
- Production won't have upload functionality (it's dev-only)

### 2. Build Process
```bash
npm run build
```
This runs the Python build script which:
1. Optimizes images
2. Builds with Vite
3. Copies carousel images to dist/assets/carousel/
4. Copies carousel-metadata.json to dist/
5. Copies resume.pdf and other assets to dist/

### 3. Files That Get Deployed

**HTML Pages (built by Vite):**
- index.html
- portfolio.html
- projectile-sim.html
- upload.html
- game.htm
- sadgrl.online.html
- test.html

**Static Assets (copied to dist/):**
- resume.pdf
- carousel-metadata.json
- assets/carousel/* (all carousel images)
- assets/* (all optimized images)
- password-tool/* (entire directory)

**Served by Vercel (vercel.json):**
- All routes with clean URLs
- All HTML files accessible
- Asset files served correctly
- PDF served correctly

### 4. Carousel System

**Development:**
- Uses local `carousel-metadata.json` for both dev and upload server
- Upload server updates both files automatically
- Changes are instant during development

**Production:**
- Static `carousel-metadata.json` included in build
- Carousel reads from metadata and displays images
- No upload functionality (that's dev-only on localhost:3001)
- Images are optimized and included in dist/assets/carousel/

### 5. Vercel Routes (vercel.json)

```
/upload.html → Upload management page (dev-only)
/carousel-metadata.json → Served as static file
/assets/carousel/* → Served as static files
/resume.pdf → Served as static file
```

### 6. Deploy Steps

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Add carousel upload system"
   git push
   ```

2. **Vercel auto-deploys** when you push to main

3. **Verify deployment:**
   - Check carousel displays all images at `https://yourdomain.com`
   - Visit `/upload.html` (shows dev-only message, won't connect to server)
   - All images load correctly
   - Dark/Forest themes work
   - Resume link works

### 7. After Deployment

If you want to add/remove carousel images:
1. Locally run: `npm run dev` and `npm run upload-server`
2. Go to `http://localhost:5173/upload.html`
3. Upload/delete/reorder images
4. Both `carousel-metadata.json` files update automatically
5. Commit and push the updated metadata and images
6. Vercel rebuilds and deploys with new carousel content

## Files Modified for Deployment

- ✅ `vite.config.js` - Added upload.html to build, carousel-metadata.json to copy targets
- ✅ `build.py` - Added carousel-metadata.json and carousel images to copy steps
- ✅ `.gitignore` - Added dist/ and uploads/ to prevent committing build artifacts
- ✅ `upload.html` - Added development-only notice
- ✅ `src/carousel-metadata.json` - Synced with actual carousel images
- ✅ `upload-server.js` - Updates both metadata files on changes
- ✅ `carousel.js` - Uses multiple paths to find metadata (works in prod)

## No Breaking Changes

All existing functionality preserved:
- ✅ Index page works
- ✅ Portfolio page works
- ✅ All other pages work
- ✅ Dark/Forest themes work
- ✅ Resume download works
- ✅ All assets load correctly
- ✅ Password tool works
- ✅ New carousel system works
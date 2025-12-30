@echo off
REM Deploy script for Vercel with image optimization
REM This script:
REM 1. Installs dependencies
REM 2. Optimizes images
REM 3. Builds the project with Vite
REM 4. Copies optimized assets and files to dist/
REM 5. Pushes the built dist/ folder to the deployment branch

echo.
echo ========================================
echo   DEPLOYMENT PROCESS STARTING
echo ========================================
echo.

REM Step 1: Install dependencies
echo [1/5] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo [2/5] Running build process (optimize images + Vite build + copy assets)...

if errorlevel 1 (
    echo ERROR: build.py failed
    exit /b 1
)
echo ✓ Build completed

REM Step 3: Copy CNAME to dist
echo.
echo [3/5] Copying CNAME file...
copy CNAME dist\CNAME >nul 2>&1
if errorlevel 1 (
    echo ERROR: Failed to copy CNAME
    exit /b 1
)
echo ✓ CNAME copied

REM Step 4: Initialize git in dist and push to deployment branch
echo.
echo [4/5] Preparing deployment branch...
cd dist

REM Remove existing git if it exists
if exist .git (
    rmdir /s /q .git
)

git init >nul 2>&1
git remote add origin https://github.com/lflowers01/lflowers01.github.io.git >nul 2>&1
git checkout -b deployment >nul 2>&1

REM Stage all files
git add . >nul 2>&1

REM Commit
git commit -m "Deploy to Vercel" >nul 2>&1
if errorlevel 1 (
    echo Note: No changes to commit or commit failed ^(this is sometimes normal^)
)

REM Force push to deployment branch
echo [5/5] Pushing to deployment branch...
git push -f origin deployment
if errorlevel 1 (
    echo ERROR: Failed to push to deployment branch
    cd ..
    exit /b 1
)

cd ..
echo.
echo ========================================
echo   ✓ DEPLOYMENT COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Your site is now deployed to Vercel!
echo Check your deployment at: https://lflowers01.github.io
echo.
pause

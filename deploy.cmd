@echo off
REM Build and deploy script for GitHub Pages

echo Starting deployment process...

:: Step 1: Run the build.py script
echo Running build.py...
python build.py
if %ERRORLEVEL% NEQ 0 (
    echo build.py failed. Exiting deployment process.
    exit /b %ERRORLEVEL%
)

:: Step 2: Navigate to the dist folder
cd dist
:: Step 3: Initialize a new Git repository in the dist folder
echo Initializing Git repository in the dist folder...
git init
git remote add origin https://github.com/lflowers01/lflowers01.github.io.git
git checkout -b deployment

:: Step 4: Add and commit all files
echo Adding and committing files...
git add .
git commit -m "Deploy to GitHub Pages"

:: Step 5: Force push to the deployment branch
echo Pushing to deployment branch...
git push -f origin deployment

:: Step 6: Clean up
echo Cleaning up...
cd ..
:: Removed the line that deletes the dist folder
:: rd /s /q dist

echo Deployment completed successfully!
pause

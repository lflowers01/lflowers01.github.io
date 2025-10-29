@echo off
REM Build and deploy script for GitHub Pages

echo Starting deployment process...

:: Step 1: Clean any existing dist folder
if exist dist (
    echo Cleaning existing dist folder...
    rmdir /s /q dist
)

:: Step 2: Run the build.py script
echo Running build.py...
python build.py
if %ERRORLEVEL% NEQ 0 (
    echo build.py failed. Exiting deployment process.
    exit /b %ERRORLEVEL%
)

:: Step 2.1: Copy CNAME file to the dist folder
echo Copying CNAME file to the dist folder...
copy CNAME dist\CNAME
if %ERRORLEVEL% NEQ 0 (
    echo Failed to copy CNAME file. Exiting deployment process.
    exit /b %ERRORLEVEL%
)

:: Step 3: Navigate to the dist folder
cd dist

:: Step 4: Initialize a new Git repository in the dist folder
echo Initializing Git repository in the dist folder...
git init
git remote add origin https://github.com/lflowers01/lflowers01.github.io.git
git checkout -b deployment

:: Step 5: Add and commit all files
echo Adding and committing files...
git add .
git commit -m "Deploy to GitHub Pages - %date% %time%"

:: Step 6: Force push to the deployment branch
echo Pushing to deployment branch...
git push -f origin deployment

:: Step 7: Clean up and return to root
echo Cleaning up...
cd ..

echo Deployment completed successfully!
echo Your site should be available at: https://lflowers01.github.io
pause

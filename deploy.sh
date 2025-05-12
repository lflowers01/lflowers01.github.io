#!/bin/bash

# Build and deploy script for GitHub Pages
npm install
echo "Starting deployment process..."

# Step 1: Run the build.py script
echo "Running build.py..."
python3 build.py
if [ $? -ne 0 ]; then
    echo "build.py failed. Exiting deployment process."
    exit 1
fi

# Step 1.1: Copy CNAME file to the dist folder
echo "Copying CNAME file to the dist folder..."
cp CNAME dist/CNAME
if [ $? -ne 0 ]; then
    echo "Failed to copy CNAME file. Exiting deployment process."
    exit 1
fi

# Step 2: Navigate to the dist folder
cd dist || exit 1

# Step 3: Initialize a new Git repository in the dist folder
echo "Initializing Git repository in the dist folder..."
git init
git remote add origin https://github.com/lflowers01/lflowers01.github.io.git
git checkout -b deployment

# Step 4: Add and commit all files
echo "Adding and committing files..."
git add .
git commit -m "Deploy to GitHub Pages"

# Step 5: Force push to the deployment branch
echo "Pushing to deployment branch..."
git push -f origin deployment

# Step 6: Clean up
echo "Cleaning up..."
cd ..
rm -rf dist

echo "Deployment completed successfully!"

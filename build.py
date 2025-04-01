import os
import shutil
import subprocess
import threading

def run_build():
    """Run the Vite build command."""
    print("Building the project with Vite...")
    result = subprocess.run("npm run build", shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        print("Build failed.")
        print(result.stderr)
        exit(1)
    print("Build completed successfully.")

def copy_optimized_assets():
    """Copy optimized assets to the dist folder without overwriting .css or .js files and flatten the structure."""
    src = "optimized-assets"
    dest = "dist/assets"
    print("Copying optimized assets to dist folder...")

    # Ensure the destination folder exists
    if not os.path.exists(dest):
        os.makedirs(dest)

    # Walk through the source directory
    for root, _, files in os.walk(src):
        for file in files:
            src_file = os.path.join(root, file)
            dest_file = os.path.join(dest, file)

            # Skip overwriting .css and .js files
            if (file.endswith(".css") or file.endswith(".js")) and os.path.exists(dest_file):
                print(f"Skipping existing file: {dest_file}")
                continue

            # Move the file to the destination folder
            shutil.copy2(src_file, dest_file)
            print(f"Copied: {src_file} -> {dest_file}")

if __name__ == "__main__":
    # Step 1: Optimize images
    print("Optimizing images...")
    result = subprocess.run("node optimize-images.js", shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if result.returncode != 0:
        print("Failed to optimize images.")
        print(result.stderr)
        exit(1)
    print("Image optimization completed.")

    # Step 2: Run the build command in a separate thread
    build_thread = threading.Thread(target=run_build)
    build_thread.start()
    build_thread.join()  # Wait for the build thread to complete

    # Step 3: Copy optimized assets
    copy_optimized_assets()

    print("Build process completed successfully.")

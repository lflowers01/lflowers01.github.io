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
    """Copy optimized assets to the dist folder without overwriting .css, .js files and skipping .html files entirely."""
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

            # Skip copying .html files entirely
            if file.endswith(".html"):
                print(f"Skipping .html file: {src_file}")
                continue

            # Skip overwriting .css and .js files
            if (file.endswith(".css") or file.endswith(".js")) and os.path.exists(dest_file):
                print(f"Skipping existing file: {dest_file}")
                continue

            # Move the file to the destination folder
            shutil.copy2(src_file, dest_file)
            print(f"Copied: {src_file} -> {dest_file}")

def copy_src_excluding_assets():
    """Copy everything from src to dist, excluding the assets folder, without overwriting existing files."""
    src = "src"
    dest = "dist"
    print("Copying files from src to dist, excluding the assets folder...")

    # Walk through the source directory
    for root, dirs, files in os.walk(src):
        # Skip the assets folder
        if "assets" in dirs:
            dirs.remove("assets")

        for file in files:
            src_file = os.path.join(root, file)
            relative_path = os.path.relpath(root, src)
            dest_dir = os.path.join(dest, relative_path)
            dest_file = os.path.join(dest_dir, file)

            # Ensure the destination directory exists
            if not os.path.exists(dest_dir):
                os.makedirs(dest_dir)

            # Skip overwriting existing files
            if os.path.exists(dest_file):
                print(f"Skipping existing file: {dest_file}")
                continue

            # Copy the file
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

    # Step 4: Copy everything from src excluding assets
    copy_src_excluding_assets()

    print("Build process completed successfully.")

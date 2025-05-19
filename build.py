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
    """Copy everything from src to dist, excluding the assets, scss, and partials folders, without overwriting existing files."""
    src = "src"
    dest = "dist"
    print("Copying files from src to dist, excluding the assets, scss, and partials folders...")

    # Walk through the source directory
    for root, dirs, files in os.walk(src):
        # Skip the assets, scss, and partials folders
        for skip_dir in ["assets", "scss", "partials"]:
            if skip_dir in dirs:
                dirs.remove(skip_dir)

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

def copy_all_html_files():
    """Copy all .html and .htm files from the entire project (excluding dist, node_modules, src, scss, and partials) into dist/, preserving their relative paths."""
    print("Copying all .html and .htm files from the project to dist/... (excluding dist, node_modules, src, scss, partials)")
    project_root = os.getcwd()
    dist_dir = os.path.join(project_root, "dist")
    for root, dirs, files in os.walk(project_root):
        # Skip dist, node_modules, src, scss, and partials folders
        rel_root = os.path.relpath(root, project_root)
        skip = any(rel_root.startswith(skip_dir) for skip_dir in ["dist", "node_modules", "src", "scss", "partials"])
        if skip:
            continue
        for file in files:
            if file.endswith(".html") or file.endswith(".htm"):
                src_file = os.path.join(root, file)
                rel_path = os.path.relpath(src_file, project_root)
                dest_file = os.path.join(dist_dir, rel_path)
                dest_folder = os.path.dirname(dest_file)
                if not os.path.exists(dest_folder):
                    os.makedirs(dest_folder)
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

    # Step 5: Copy all .html and .htm files from the project
    copy_all_html_files()

    print("Build process completed successfully.")

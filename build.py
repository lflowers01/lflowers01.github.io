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

            # Copy files that are not .png or .jpg normally
            if not (file.endswith(".png") or file.endswith(".jpg")):
                shutil.copy2(src_file, dest_file)
                print(f"Copied non-image file: {src_file} -> {dest_file}")
                continue

            # Move the file to the destination folder
            shutil.copy2(src_file, dest_file)
            print(f"Copied: {src_file} -> {dest_file}")

def copy_src_to_dist():
    """Copy specific files from the src folder to the dist folder, but don't overwrite built files."""
    src = "src"
    dest = "dist"
    print("Copying additional files from src to dist...")

    # Ensure the destination folder exists
    if not os.path.exists(dest):
        os.makedirs(dest)

    # List of files we DO want to copy
    copy_files = ['resume.pdf', 'game.htm', 'sadgrl.online.html', 'test.html', 'carousel-metadata.json']

    for file in copy_files:
        src_file = os.path.join(src, file)
        dest_file = os.path.join(dest, file)
        
        if os.path.exists(src_file):
            shutil.copy2(src_file, dest_file)
            print(f"Copied: {src_file} -> {dest_file}")
        else:
            print(f"Source file not found: {src_file}")

    # Also copy carousel-metadata.json from root if it exists
    root_meta = 'carousel-metadata.json'
    if os.path.exists(root_meta):
        shutil.copy2(root_meta, os.path.join(dest, root_meta))
        print(f"Copied: {root_meta} -> {os.path.join(dest, root_meta)}")

    # Copy the password-tool directory
    password_tool_src = os.path.join(src, "password-tool")
    password_tool_dest = os.path.join(dest, "password-tool")
    
    if os.path.exists(password_tool_src):
        if os.path.exists(password_tool_dest):
            shutil.rmtree(password_tool_dest)
        shutil.copytree(password_tool_src, password_tool_dest)
        print(f"Copied directory: {password_tool_src} -> {password_tool_dest}")

    # Copy carousel assets to dist
    carousel_src = os.path.join(src, "assets/carousel")
    carousel_dest = os.path.join(dest, "assets/carousel")
    
    if os.path.exists(carousel_src):
        if os.path.exists(carousel_dest):
            shutil.rmtree(carousel_dest)
        shutil.copytree(carousel_src, carousel_dest)
        print(f"Copied carousel assets: {carousel_src} -> {carousel_dest}")

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

    # Step 4: Copy files from src to dist root
    copy_src_to_dist()

    print("Build process completed successfully.")

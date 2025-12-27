import subprocess
import sys

def run_build():
    """Run the Vite build command."""
    print("Building the project with Vite...")
    result = subprocess.run("npx vite build", shell=True)
    if result.returncode != 0:
        print("Build failed.")
        sys.exit(1)
    print("Build completed successfully.")

if __name__ == "__main__":
    run_build()

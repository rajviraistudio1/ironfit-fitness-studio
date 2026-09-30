import os
import zipfile

def make_zip(output_filename="ironfit-deployment.zip"):
    ignore_dirs = {"node_modules", ".git", "dist", "build", ".idea", ".vscode"}
    ignore_files = {".DS_Store", "ironfit-deployment.zip", "data/leads.json"}

    with zipfile.ZipFile(output_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk("."):
            dirs[:] = [d for d in dirs if d not in ignore_dirs and not d.startswith(".")]
            for file in files:
                filepath = os.path.join(root, file)
                relpath = os.path.relpath(filepath, ".")
                if relpath in ignore_files or file.startswith(".env.") or (file == ".env"):
                    continue
                zipf.write(filepath, relpath)
                print(f"Added: {relpath}")

    print(f"\nSuccessfully created {output_filename} ({os.path.getsize(output_filename)} bytes)")

if __name__ == "__main__":
    make_zip()

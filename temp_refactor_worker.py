import os

root_dir = r"e:\SIRA-PROJECTS\BAC-GROUP\documents\BA-V4"

def rename_paths():
    for dirpath, dirnames, filenames in os.walk(root_dir, topdown=False):
        for filename in filenames:
            if "Worker" in filename:
                old_path = os.path.join(dirpath, filename)
                new_path = os.path.join(dirpath, filename.replace("Worker", "KyThuat"))
                os.rename(old_path, new_path)
                print(f"Renamed {old_path} -> {new_path}")
                
        for dirname in dirnames:
            if "Worker" in dirname:
                old_path = os.path.join(dirpath, dirname)
                new_path = os.path.join(dirpath, dirname.replace("Worker", "KyThuat"))
                os.rename(old_path, new_path)
                print(f"Renamed {old_path} -> {new_path}")

rename_paths()

def replace_in_files():
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if not filename.endswith(('.md', '.jsx', '.tsx', '.ts')): continue
            file_path = os.path.join(dirpath, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                original_content = content
                
                # Replace paths and file names separately
                content = content.replace("Worker/README.md", "KyThuat/README.md")
                content = content.replace("/Worker/", "/KyThuat/")
                content = content.replace("Worker_v4", "KyThuat_v4")
                content = content.replace("Worker_v", "KyThuat_v")
                
                # Replace textual references
                content = content.replace("Worker", "Kỹ thuật")
                content = content.replace("worker", "kỹ thuật")
                content = content.replace("WORKER", "KỸ THUẬT")
                
                # Fix up any path mismatches that were affected by the text replace
                content = content.replace("Kỹ thuật/README.md", "KyThuat/README.md")
                content = content.replace("/Kỹ thuật/", "/KyThuat/")
                content = content.replace("Kỹ thuật_v4", "KyThuat_v4")
                
                if content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated content: {file_path}")
            except Exception as e:
                print(f"Error {file_path}: {e}")

replace_in_files()

import os
import glob
import shutil

base_dir = r"C:\laragon\www\mbg\Super_Merged_Dataset_Final"
splits = ["train", "valid", "test"]

count = 0
for split in splits:
    img_dir = os.path.join(base_dir, split, "images")
    lbl_dir = os.path.join(base_dir, split, "labels")
    
    if not os.path.exists(img_dir):
        continue
        
    images = glob.glob(os.path.join(img_dir, "*.*"))
    for img_path in images:
        filename = os.path.basename(img_path)
        name, ext = os.path.splitext(filename)
        
        # Kaggle limit is ~248. We keep it under 100 to be very safe.
        if len(name) > 100:
            count += 1
            # Hash or truncate. We'll truncate and add a unique ID
            new_name = f"renamed_long_{count}_{name[:20]}"
            new_img_path = os.path.join(img_dir, new_name + ext)
            
            lbl_path = os.path.join(lbl_dir, name + ".txt")
            new_lbl_path = os.path.join(lbl_dir, new_name + ".txt")
            
            os.rename(img_path, new_img_path)
            if os.path.exists(lbl_path):
                os.rename(lbl_path, new_lbl_path)
            print(f"Renamed to: {new_name}")

print(f"Total renamed files: {count}")

print("Creating new ZIP file...")
zip_path = r"C:\laragon\www\mbg\Super_Merged_Dataset_Kaggle"
shutil.make_archive(zip_path, 'zip', r'C:\laragon\www\mbg', 'Super_Merged_Dataset_Final')
print("✅ New ZIP created successfully!")

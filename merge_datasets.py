import os
import shutil
import yaml

# Paths
DS1_DIR = r"c:\laragon\www\mbg\Mbg Detection.yolov8"
DS2_DIR = r"c:\laragon\www\mbg\MBG_AI.yolov8"
OUTPUT_DIR = r"c:\laragon\www\mbg\Merged_MBG_Dataset"

# Dataset 2 Classes (The master list)
DS2_CLASSES = [
    'bean', 'bread', 'cassava', 'cheese', 'chicken', 'corn', 'cracker', 'egg', 'empty', 'fish',
    'fritter', 'fruit', 'juice', 'meat', 'meatball', 'milk', 'noodle', 'nugget', 'oat', 'omelet',
    'potato', 'rice', 'sauce', 'shredded_chicken', 'shredded_fish', 'shrimp', 'tempe', 'tofu', 'tray', 'vegetable'
]

# Mapping Dataset 1 to Dataset 2 index
# DS1 classes:
# 0: anggur -> fruit (11)
# 1: ayam -> chicken (4)
# 2: bakso -> meatball (14)
# 3: cap_cai -> vegetable (29)
# 4: daging_sapi -> meat (13)
# 5: jeruk -> fruit (11)
# 6: kacang_panjang -> vegetable (29)
# 7: kentang -> potato (20)
# 8: lengkeng -> fruit (11)
# 9: mie -> noodle (16)
# 10: nasi -> rice (21)
# 11: pisang -> fruit (11)
# 12: selada -> vegetable (29)
# 13: semangka -> fruit (11)
# 14: tahu -> tofu (27)
# 15: telur -> egg (7)
# 16: tempe -> tempe (26)
# 17: timun -> vegetable (29)

MAPPING = {
    0: 11,
    1: 4,
    2: 14,
    3: 29,
    4: 13,
    5: 11,
    6: 29,
    7: 20,
    8: 11,
    9: 16,
    10: 21,
    11: 11,
    12: 29,
    13: 11,
    14: 27,
    15: 7,
    16: 26,
    17: 29
}

def create_dirs():
    if os.path.exists(OUTPUT_DIR):
        print("Clearing existing Output Dir...")
        shutil.rmtree(OUTPUT_DIR)
    
    os.makedirs(OUTPUT_DIR)
    for split in ['train', 'valid', 'test']:
        os.makedirs(os.path.join(OUTPUT_DIR, split, 'images'), exist_ok=True)
        os.makedirs(os.path.join(OUTPUT_DIR, split, 'labels'), exist_ok=True)

def copy_dataset_2():
    print("Copying Dataset 2 (MBG_AI)...")
    for split in ['train', 'valid', 'test']:
        for sub in ['images', 'labels']:
            src_dir = os.path.join(DS2_DIR, split, sub)
            dst_dir = os.path.join(OUTPUT_DIR, split, sub)
            if os.path.exists(src_dir):
                for file in os.listdir(src_dir):
                    shutil.copy2(os.path.join(src_dir, file), os.path.join(dst_dir, file))

def merge_dataset_1():
    print("Merging Dataset 1 (Mbg Detection)...")
    for split in ['train', 'valid', 'test']:
        img_src_dir = os.path.join(DS1_DIR, split, 'images')
        lbl_src_dir = os.path.join(DS1_DIR, split, 'labels')
        
        if not os.path.exists(img_src_dir):
            continue
            
        for file in os.listdir(img_src_dir):
            # Copy Image
            src_img = os.path.join(img_src_dir, file)
            dst_img = os.path.join(OUTPUT_DIR, split, 'images', f"ds1_{file}")
            shutil.copy2(src_img, dst_img)
            
            # Map and Copy Label
            base_name, _ = os.path.splitext(file)
            src_lbl = os.path.join(lbl_src_dir, f"{base_name}.txt")
            dst_lbl = os.path.join(OUTPUT_DIR, split, 'labels', f"ds1_{base_name}.txt")
            
            if os.path.exists(src_lbl):
                with open(src_lbl, 'r') as f_in, open(dst_lbl, 'w') as f_out:
                    for line in f_in:
                        parts = line.strip().split()
                        if not parts:
                            continue
                        class_id = int(parts[0])
                        new_class_id = MAPPING.get(class_id)
                        if new_class_id is not None:
                            parts[0] = str(new_class_id)
                            f_out.write(" ".join(parts) + "\n")

def write_data_yaml():
    yaml_content = {
        'train': '../train/images',
        'val': '../valid/images',
        'test': '../test/images',
        'nc': len(DS2_CLASSES),
        'names': DS2_CLASSES
    }
    with open(os.path.join(OUTPUT_DIR, 'data.yaml'), 'w') as f:
        yaml.dump(yaml_content, f, sort_keys=False)
    print("data.yaml created.")

if __name__ == "__main__":
    create_dirs()
    copy_dataset_2()
    merge_dataset_1()
    write_data_yaml()
    print("Dataset merge completed successfully!")

import os
import shutil
import yaml

# Path konfigurasi
OLD_DS_DIR = r"c:\laragon\www\mbg\Merged_MBG_Dataset"
NEW_DS_DIR = r"c:\laragon\www\mbg\Super_Merged_Dataset"

# 1. Definisi Master Kelas Baru (29 Kelas, penambahan 'buah' di akhir)
MASTER_CLASSES = [
    'ayam',             # 0
    'nasi',             # 1
    'sate',             # 2
    'tempe',            # 3
    'ayam_pop',         # 4
    'cabai',            # 5
    'dendeng_batokok',  # 6
    'gulai_ikan',       # 7
    'gulai_tunjang',    # 8
    'kentang_balado',   # 9
    'petai',            # 10
    'rendang',          # 11
    'sambal_ijo',       # 12
    'sambal_merah',     # 13
    'sauce',            # 14
    'telur_balado',     # 15
    'telur_dadar',      # 16
    'udang_balado',     # 17
    'bakso',            # 18
    'bika_ambon',       # 19
    'dadar_gulung',     # 20
    'kue_cubit',        # 21
    'nasi_goreng',      # 22
    'pepes_ikan',       # 23
    'putu_ayu',         # 24
    'tahu',             # 25
    'cah_kangkung',     # 26 (Sayuran hijau)
    'lainnya',          # 27
    'buah'              # 28 (Baru: semangka, pisang, jeruk dari tray)
]

# 2. Pemetaan dari Merged_MBG_Dataset (30 kelas) ke Master (29 kelas)
MAPPING_MBG = {
    0: 27,   # bean -> lainnya
    1: 27,   # bread -> lainnya
    2: 27,   # cassava -> lainnya
    3: 27,   # cheese -> lainnya
    4: 0,    # chicken -> ayam
    5: 27,   # corn -> lainnya
    6: 27,   # cracker -> lainnya
    7: 16,   # egg -> telur_dadar
    8: None, # empty -> ABAIKAN (hapus bounding box)
    9: 7,    # fish -> gulai_ikan/ikan
    10: 27,  # fritter -> lainnya
    11: 28,  # fruit -> buah (KELAS BARU)
    12: 27,  # juice -> lainnya
    13: 11,  # meat -> rendang/daging
    14: 18,  # meatball -> bakso
    15: 27,  # milk -> lainnya
    16: 27,  # noodle -> lainnya
    17: 0,   # nugget -> ayam
    18: 27,  # oat -> lainnya
    19: 16,  # omelet -> telur_dadar
    20: 9,   # potato -> kentang
    21: 1,   # rice -> nasi
    22: 14,  # sauce -> sauce
    23: 0,   # shredded_chicken -> ayam
    24: 7,   # shredded_fish -> ikan
    25: 17,  # shrimp -> udang
    26: 3,   # tempe -> tempe
    27: 25,  # tofu -> tahu
    28: None,# tray -> ABAIKAN (kita hanya butuh deteksi makanannya)
    29: 26   # vegetable -> cah_kangkung/sayur
}

def copy_and_map():
    print(f"Memproses {os.path.basename(OLD_DS_DIR)}...")
    for split in ['train', 'valid', 'test']:
        img_src = os.path.join(OLD_DS_DIR, split, 'images')
        lbl_src = os.path.join(OLD_DS_DIR, split, 'labels')
        
        if not os.path.exists(img_src):
            continue
            
        print(f"  -> Memproses split: {split}")
        for file in os.listdir(img_src):
            # Salin gambar dengan prefix
            src_img_file = os.path.join(img_src, file)
            new_img_name = f"mbgtray_{file}"
            dst_img_file = os.path.join(NEW_DS_DIR, split, 'images', new_img_name)
            
            # Cek jika sudah pernah dicopy sebelumnya, lewati
            if os.path.exists(dst_img_file):
                continue
                
            shutil.copy2(src_img_file, dst_img_file)
            
            # Salin & Map Label
            base_name, _ = os.path.splitext(file)
            src_lbl_file = os.path.join(lbl_src, f"{base_name}.txt")
            dst_lbl_file = os.path.join(NEW_DS_DIR, split, 'labels', f"mbgtray_{base_name}.txt")
            
            if os.path.exists(src_lbl_file):
                with open(src_lbl_file, 'r') as f_in, open(dst_lbl_file, 'w') as f_out:
                    for line in f_in:
                        parts = line.strip().split()
                        if not parts:
                            continue
                        class_id = int(parts[0])
                        new_class_id = MAPPING_MBG.get(class_id)
                        
                        # Jika new_class_id bukan None (tidak diabaikan)
                        if new_class_id is not None:
                            parts[0] = str(new_class_id)
                            f_out.write(" ".join(parts) + "\n")
            else:
                open(dst_lbl_file, 'w').close()

def update_yaml():
    yaml_path = os.path.join(NEW_DS_DIR, 'data.yaml')
    yaml_content = {
        'path': 'C:/laragon/www/mbg/Super_Merged_Dataset',
        'train': 'train/images',
        'val': 'valid/images',
        'test': 'test/images',
        'nc': len(MASTER_CLASSES),
        'names': MASTER_CLASSES
    }
    with open(yaml_path, 'w') as f:
        yaml.dump(yaml_content, f, sort_keys=False)
    print("✅ data.yaml di Super_Merged_Dataset berhasil diupdate menjadi 29 kelas (termasuk 'buah')!")

if __name__ == "__main__":
    print("Memulai penggabungan Merged_MBG_Dataset (Baki) ke Super_Merged_Dataset...")
    copy_and_map()
    update_yaml()
    print("✅ Penggabungan Selesai Sukses!")

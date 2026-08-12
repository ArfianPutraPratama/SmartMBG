import os
import shutil
import yaml

# Path folder dataset asal di folder Downloads Anda
DS1_DIR = r"c:\Users\ASUS\Downloads\indonesian foods.v1i.yolov8"
DS2_DIR = r"c:\Users\ASUS\Downloads\Traditional Indonesia Food.v1i.yolov8"
DS3_DIR = r"c:\Users\ASUS\Downloads\deteksi makanan indonesia.v1i.yolov8"
DS4_DIR = r"c:\Users\ASUS\Downloads\Indonesia-Food.v1i.yolov8"

# Folder output hasil penggabungan
OUTPUT_DIR = r"c:\laragon\www\mbg\Super_Merged_Dataset"

# 1. Definisi Master Kelas Terpadu (Unified Classes)
MASTER_CLASSES = [
    'ayam',             # index 0 (DS1: ayam, DS2: ayam goreng, DS2: gulai ayam)
    'nasi',             # index 1 (DS1: nasi, DS4: Nasi Putih)
    'sate',             # index 2 (DS1: sate, DS3: sate_ayam)
    'tempe',            # index 3 (DS1: tempe, DS4: Tempe Goreng, tempe)
    'ayam_pop',         # index 4 (DS2: ayam pop)
    'cabai',            # index 5 (DS2: cabai)
    'dendeng_batokok',  # index 6 (DS2: dendeng batokok)
    'gulai_ikan',       # index 7 (DS2: gulai ikan, gulai_ikan, gulai tambusu)
    'gulai_tunjang',    # index 8 (DS2: gulai tunjang)
    'kentang_balado',   # index 9 (DS2: kentang balado)
    'petai',            # index 10 (DS2: petai)
    'rendang',          # index 11 (DS2: rendang, DS3: rendang, DS4: rendang sapi)
    'sambal_ijo',       # index 12 (DS2: sambal ijo)
    'sambal_merah',     # index 13 (DS2: sambal merah)
    'sauce',            # index 14 (DS2: sauce)
    'telur_balado',     # index 15 (DS2: telur balado, DS3: telur_balado, DS4: Telur Balado)
    'telur_dadar',      # index 16 (DS2: telur dadar)
    'udang_balado',     # index 17 (DS2: udang balado)
    'bakso',            # index 18 (DS3: bakso)
    'bika_ambon',       # index 19 (DS3: bika_ambon)
    'dadar_gulung',     # index 20 (DS3: dadar_gulung)
    'kue_cubit',        # index 21 (DS3: kue_cubit)
    'nasi_goreng',      # index 22 (DS3: nasi_goreng)
    'pepes_ikan',       # index 23 (DS3: pepes_ikan)
    'putu_ayu',         # index 24 (DS3: putu_ayu)
    'tahu',             # index 25 (DS4: tahu, tahu goreng)
    'cah_kangkung',     # index 26 (DS4: Cah Kangkung)
    'lainnya'           # index 27 (DS3: '10')
]

# 2. Pemetaan Index Kelas dari Masing-Masing Dataset ke Master Index
# DS1 mapping
MAPPING_DS1 = {
    0: 0,   # ayam -> ayam
    1: 1,   # nasi -> nasi
    2: 2,   # sate -> sate
    3: 3    # tempe -> tempe
}

# DS2 mapping
MAPPING_DS2 = {
    0: 0,   # ayam goreng -> ayam
    1: 4,   # ayam pop -> ayam_pop
    2: 5,   # cabai -> cabai
    3: 6,   # dendeng batokok -> dendeng_batokok
    4: 0,   # gulai ayam -> ayam (dikelompokkan ke ayam)
    5: 7,   # gulai ikan -> gulai_ikan
    6: 7,   # gulai tambusu -> gulai_ikan (dikelompokkan ke gulai_ikan)
    7: 8,   # gulai tunjang -> gulai_tunjang
    8: 7,   # gulai_ikan -> gulai_ikan
    9: 9,   # kentang balado -> kentang_balado
    10: 10, # petai -> petai
    11: 11, # rendang -> rendang
    12: 12, # sambal ijo -> sambal_ijo
    13: 13, # sambal merah -> sambal_merah
    14: 14, # sauce -> sauce
    15: 15, # telur balado -> telur_balado
    16: 16, # telur dadar -> telur_dadar
    17: 17  # udang balado -> udang_balado
}

# DS3 mapping
MAPPING_DS3 = {
    0: 27,  # 10 -> lainnya
    1: 18,  # bakso -> bakso
    2: 19,  # bika_ambon -> bika_ambon
    3: 20,  # dadar_gulung -> dadar_gulung
    4: 21,  # kue_cubit -> kue_cubit
    5: 22,  # nasi_goreng -> nasi_goreng
    6: 23,  # pepes_ikan -> pepes_ikan
    7: 24,  # putu_ayu -> putu_ayu
    8: 11,  # rendang -> rendang
    9: 2,   # sate_ayam -> sate
    10: 15  # telur_balado -> telur_balado
}

# DS4 mapping (Indonesia-Food.v1i.yolov8)
MAPPING_DS4 = {
    0: 26,  # Cah Kangkung -> cah_kangkung
    1: 1,   # Nasi Putih -> nasi
    2: 15,  # Telur Balado -> telur_balado
    3: 3,   # Tempe Goreng -> tempe
    4: 11,  # rendang sapi -> rendang
    5: 25,  # tahu -> tahu
    6: 25,  # tahu goreng -> tahu
    7: 3    # tempe -> tempe
}

def create_output_dirs():
    if os.path.exists(OUTPUT_DIR):
        print("Membersihkan folder output lama...")
        shutil.rmtree(OUTPUT_DIR)
    
    os.makedirs(OUTPUT_DIR)
    for split in ['train', 'valid', 'test']:
        os.makedirs(os.path.join(OUTPUT_DIR, split, 'images'), exist_ok=True)
        os.makedirs(os.path.join(OUTPUT_DIR, split, 'labels'), exist_ok=True)
    print("Folder output siap!")

def copy_and_map(src_dir, mapping, prefix):
    print(f"Memproses {os.path.basename(src_dir)}...")
    for split in ['train', 'valid', 'test']:
        img_src = os.path.join(src_dir, split, 'images')
        lbl_src = os.path.join(src_dir, split, 'labels')
        
        if not os.path.exists(img_src):
            continue
            
        for file in os.listdir(img_src):
            # Salin gambar dengan prefix agar nama unik
            src_img_file = os.path.join(img_src, file)
            new_img_name = f"{prefix}_{file}"
            shutil.copy2(src_img_file, os.path.join(OUTPUT_DIR, split, 'images', new_img_name))
            
            # Salin & Map Label
            base_name, _ = os.path.splitext(file)
            src_lbl_file = os.path.join(lbl_src, f"{base_name}.txt")
            dst_lbl_file = os.path.join(OUTPUT_DIR, split, 'labels', f"{prefix}_{base_name}.txt")
            
            # Jika file label ada, lakukan mapping index kelas
            if os.path.exists(src_lbl_file):
                with open(src_lbl_file, 'r') as f_in, open(dst_lbl_file, 'w') as f_out:
                    for line in f_in:
                        parts = line.strip().split()
                        if not parts:
                            continue
                        class_id = int(parts[0])
                        new_class_id = mapping.get(class_id)
                        if new_class_id is not None:
                            parts[0] = str(new_class_id)
                            f_out.write(" ".join(parts) + "\n")
            else:
                # Jika tidak ada label, buat file teks kosong (background image)
                open(dst_lbl_file, 'w').close()

def write_yaml():
    yaml_content = {
        'train': '../train/images',
        'val': '../valid/images',
        'test': '../test/images',
        'nc': len(MASTER_CLASSES),
        'names': MASTER_CLASSES
    }
    with open(os.path.join(OUTPUT_DIR, 'data.yaml'), 'w') as f:
        yaml.dump(yaml_content, f, sort_keys=False)
    print("data.yaml berhasil dibuat!")

def main():
    create_output_dirs()
    copy_and_map(DS1_DIR, MAPPING_DS1, "ds1")
    copy_and_map(DS2_DIR, MAPPING_DS2, "ds2")
    copy_and_map(DS3_DIR, MAPPING_DS3, "ds3")
    copy_and_map(DS4_DIR, MAPPING_DS4, "ds4")
    write_yaml()
    print("\nSeluruh 4 dataset berhasil digabungkan dengan sukses!")

if __name__ == "__main__":
    main()

import os
import time
import pandas as pd
import numpy as np
import yaml
import torch
from ultralytics import RTDETR

# ==========================================
# KONFIGURASI EKSPERIMEN PENELITIAN
# ==========================================
PROJECT_DIR = "/content/drive/MyDrive/RTDETR_MBG_Project"  # Atau 'C:/laragon/www/mbg/runs' jika di lokal
DATA_YAML = "/content/dataset/data.yaml"
PRETRAINED_MODEL = "rtdetr-l.pt"

RESOLUTIONS = [512, 640, 800, 960]
EPOCHS = 100
DEFAULT_BATCH = 8

# Daftar 29 Kelas Makanan SmartMBG
CLASS_NAMES = [
    'ayam', 'nasi', 'sate', 'tempe', 'ayam_pop', 'cabai', 'dendeng_batokok', 
    'gulai_ikan', 'gulai_tunjang', 'kentang_balado', 'petai', 'rendang', 
    'sambal_ijo', 'sambal_merah', 'sauce', 'telur_balado', 'telur_dadar', 
    'udang_balado', 'bakso', 'bika_ambon', 'dadar_gulung', 'kue_cubit', 
    'nasi_goreng', 'pepes_ikan', 'putu_ayu', 'tahu', 'cah_kangkung', 
    'lainnya', 'buah'
]

def get_hardware_info():
    if torch.cuda.is_available():
        return torch.cuda.get_device_name(0)
    return "CPU"

def run_all_experiments():
    summary_results = []
    per_class_all_records = []
    
    hardware_name = get_hardware_info()
    print(f"==================================================")
    print(f"Memulai Rangkaian Eksperimen Resolusi RT-DETR-L")
    print(f"Hardware: {hardware_name}")
    print(f"Resolusi yang diuji: {RESOLUTIONS}")
    print(f"==================================================\n")

    for res in RESOLUTIONS:
        exp_name = f"rtdetr_l_res_{res}"
        exp_save_dir = os.path.join(PROJECT_DIR, exp_name)
        
        print(f"\n>>> [1/3] Memulai Training Resolusi: {res}x{res} <<<")
        batch_size = DEFAULT_BATCH
        
        # Penanganan memori untuk resolusi tinggi
        if res >= 800 and torch.cuda.is_available():
            vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024**3)
            if vram_gb < 16:  # Jika VRAM terbatas, turunkan batch agar tidak OOM
                batch_size = 4
                print(f"ℹ️ Info: Batch size disesuaikan ke {batch_size} untuk resolusi {res} guna mencegah Out-Of-Memory.")

        start_time = time.time()
        train_success = False
        error_msg = ""
        
        try:
            model = RTDETR(PRETRAINED_MODEL)
            train_results = model.train(
                data=DATA_YAML,
                epochs=EPOCHS,
                imgsz=res,
                batch=batch_size,
                device=0 if torch.cuda.is_available() else 'cpu',
                project=PROJECT_DIR,
                name=exp_name,
                exist_ok=True
            )
            training_duration_mins = round((time.time() - start_time) / 60, 2)
            train_success = True
            print(f"✅ Training Resolusi {res} Selesai dalam {training_duration_mins} menit.")
        except Exception as e:
            training_duration_mins = round((time.time() - start_time) / 60, 2)
            error_msg = str(e)
            print(f"❌ Gagal training pada resolusi {res}: {error_msg}")
            summary_results.append({
                'resolution': f"{res}x{res}",
                'status': 'FAILED',
                'error': error_msg,
                'precision': 0, 'recall': 0, 'mAP50': 0, 'mAP50_95': 0, 'f1': 0,
                'inference_ms': 0, 'fps': 0, 'training_time_min': training_duration_mins,
                'batch_size': batch_size, 'hardware': hardware_name
            })
            continue

        # ==========================================
        # EVALUASI PADA TEST SET (FAIR COMPARISON)
        # ==========================================
        print(f">>> [2/3] Evaluasi pada Test Set (Resolusi: {res}x{res}) <<<")
        best_weight_path = os.path.join(exp_save_dir, "weights", "best.pt")
        
        if os.path.exists(best_weight_path):
            eval_model = RTDETR(best_weight_path)
            
            # Validasi pada split 'test'
            metrics = eval_model.val(
                data=DATA_YAML,
                split='test',
                imgsz=res,
                batch=batch_size,
                device=0 if torch.cuda.is_available() else 'cpu',
                plots=True
            )
            
            # Ekstraksi Metrik Global
            precision = float(metrics.box.mp)
            recall = float(metrics.box.mr)
            map50 = float(metrics.box.map50)
            map50_95 = float(metrics.box.map)
            f1 = 2 * (precision * recall) / (precision + recall + 1e-8)
            
            # Kecepatan Inferensi
            speed = metrics.speed  # dict: {'preprocess': ms, 'inference': ms, 'loss': ms, 'postprocess': ms}
            inference_ms = speed.get('inference', 0.0) + speed.get('postprocess', 0.0)
            fps = round(1000.0 / inference_ms, 2) if inference_ms > 0 else 0
            
            summary_results.append({
                'resolution': f"{res}x{res}",
                'status': 'SUCCESS',
                'precision': round(precision, 4),
                'recall': round(recall, 4),
                'mAP50': round(map50, 4),
                'mAP50_95': round(map50_95, 4),
                'f1': round(f1, 4),
                'inference_ms': round(inference_ms, 2),
                'fps': fps,
                'training_time_min': training_duration_mins,
                'batch_size': batch_size,
                'epochs': EPOCHS,
                'hardware': hardware_name
            })
            
            # Ekstraksi Metrik Per-Class (29 Kelas)
            print(f">>> [3/3] Menyimpan Metrik Per-Class <<<")
            per_class_maps = metrics.box.maps  # mAP50-95 per class
            per_class_p = metrics.box.p        # Precision per class
            per_class_r = metrics.box.r        # Recall per class
            
            for idx, c_name in enumerate(CLASS_NAMES):
                c_p = float(per_class_p[idx]) if idx < len(per_class_p) else 0.0
                c_r = float(per_class_r[idx]) if idx < len(per_class_r) else 0.0
                c_map50_95 = float(per_class_maps[idx]) if idx < len(per_class_maps) else 0.0
                c_f1 = 2 * (c_p * c_r) / (c_p + c_r + 1e-8)
                
                per_class_all_records.append({
                    'resolution': f"{res}x{res}",
                    'class_id': idx,
                    'class_name': c_name,
                    'precision': round(c_p, 4),
                    'recall': round(c_r, 4),
                    'f1': round(c_f1, 4),
                    'mAP50_95': round(c_map50_95, 4)
                })

    # ==========================================
    # SIMPAN LAPORAN CSV
    # ==========================================
    df_summary = pd.DataFrame(summary_results)
    summary_csv_path = os.path.join(PROJECT_DIR, "rtdetr_experiments_summary.csv")
    df_summary.to_csv(summary_csv_path, index=False)
    print(f"\n📊 Ringkasan seluruh eksperimen disimpan di: {summary_csv_path}")
    print(df_summary.to_string(index=False))

    if per_class_all_records:
        df_per_class = pd.DataFrame(per_class_all_records)
        per_class_csv_path = os.path.join(PROJECT_DIR, "rtdetr_per_class_results.csv")
        df_per_class.to_csv(per_class_csv_path, index=False)
        print(f"📋 Rincian hasil per-class disimpan di: {per_class_csv_path}")

if __name__ == "__main__":
    run_all_experiments()

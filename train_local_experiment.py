import os
import time
import csv
import yaml
import torch
from ultralytics import YOLO

# ==========================================
# KONFIGURASI TRAINING LOKAL (GTX 1660 Ti 6GB)
# ==========================================
DATA_YAML = r"C:\laragon\www\mbg\Super_Merged_Dataset_Final\data.yaml"
OUTPUT_DIR = r"C:\laragon\www\mbg\runs_local"

CLASS_NAMES = [
    'ayam', 'nasi', 'sate', 'tempe', 'ayam_pop', 'cabai', 'dendeng_batokok', 
    'gulai_ikan', 'gulai_tunjang', 'kentang_balado', 'petai', 'rendang', 
    'sambal_ijo', 'sambal_merah', 'sauce', 'telur_balado', 'telur_dadar', 
    'udang_balado', 'bakso', 'bika_ambon', 'dadar_gulung', 'kue_cubit', 
    'nasi_goreng', 'pepes_ikan', 'putu_ayu', 'tahu', 'cah_kangkung', 
    'lainnya', 'buah'
]

def train_yolov8_local():
    """
    Melatih YOLOv8-L Baseline di Laptop Lokal (GTX 1660 Ti)
    Menggunakan library bawaan Python (csv) tanpa perlu dependency tambahan.
    """
    hardware_name = torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU"
    print("==================================================")
    print("🚀 Memulai Training YOLOv8-L Baseline di GPU Lokal")
    print(f"Device: {hardware_name}")
    print("==================================================")
    
    epochs = 100
    batch_size = 4  # Batch 4 sangat aman & optimal untuk VRAM 6GB
    imgsz = 640
    exp_name = "yolov8_l_baseline_local"
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # 1. Mulai Training
    t0 = time.time()
    model = YOLO("yolov8l.pt")
    
    model.train(
        data=DATA_YAML,
        epochs=epochs,
        imgsz=imgsz,
        batch=batch_size,
        device=0 if torch.cuda.is_available() else 'cpu',
        project=OUTPUT_DIR,
        name=exp_name,
        exist_ok=True,
        workers=2
    )
    
    duration = round((time.time() - t0) / 60, 2)
    print(f"✅ Training YOLOv8-L lokal selesai dalam {duration} menit.")
    
    # 2. Evaluasi pada Test Set
    best_pt = os.path.join(OUTPUT_DIR, exp_name, "weights", "best.pt")
    if os.path.exists(best_pt):
        eval_model = YOLO(best_pt)
        metrics = eval_model.val(
            data=DATA_YAML,
            split='test',
            imgsz=imgsz,
            batch=batch_size,
            device=0 if torch.cuda.is_available() else 'cpu',
            plots=True
        )
        
        # Ekstraksi Metrik
        p, r = float(metrics.box.mp), float(metrics.box.mr)
        map50, map_all = float(metrics.box.map50), float(metrics.box.map)
        f1 = 2 * (p * r) / (p + r + 1e-8)
        inf_ms = metrics.speed.get('inference', 0.0) + metrics.speed.get('postprocess', 0.0)
        fps = round(1000.0 / inf_ms, 2) if inf_ms > 0 else 0
        
        # Simpan Summary CSV
        summary_csv = os.path.join(OUTPUT_DIR, "yolov8_baseline_results.csv")
        with open(summary_csv, mode='w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['model', 'image_size', 'epochs', 'batch_size', 'precision', 'recall', 'mAP50', 'mAP50_95', 'f1', 'inference_ms', 'fps', 'training_time_min', 'hardware'])
            writer.writerow(['YOLOv8-L (Local)', f"{imgsz}x{imgsz}", epochs, batch_size, round(p, 4), round(r, 4), round(map50, 4), round(map_all, 4), round(f1, 4), round(inf_ms, 2), fps, duration, hardware_name])
            
        print(f"📊 Ringkasan hasil disimpan di: {summary_csv}")
        
        # Simpan Per-Class CSV
        per_class_csv = os.path.join(OUTPUT_DIR, "yolov8_per_class_results.csv")
        with open(per_class_csv, mode='w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['model', 'class_id', 'class_name', 'precision', 'recall', 'f1', 'mAP50_95'])
            maps, ps, rs = metrics.box.maps, metrics.box.p, metrics.box.r
            for idx, c_name in enumerate(CLASS_NAMES):
                cp = float(ps[idx]) if idx < len(ps) else 0.0
                cr = float(rs[idx]) if idx < len(rs) else 0.0
                cmap = float(maps[idx]) if idx < len(maps) else 0.0
                writer.writerow(['YOLOv8-L', idx, c_name, round(cp, 4), round(cr, 4), round(2 * (cp * cr) / (cp + cr + 1e-8), 4), round(cmap, 4)])
        print(f"📋 Rincian per-class disimpan di: {per_class_csv}")

if __name__ == "__main__":
    train_yolov8_local()

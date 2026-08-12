import os
import time
import pandas as pd
import yaml
import torch
from ultralytics import YOLO

# ==========================================
# KONFIGURASI BASELINE YOLOV8-L (FAIR COMPARISON)
# ==========================================
PROJECT_DIR = "/content/drive/MyDrive/RTDETR_MBG_Project"
DATA_YAML = "/content/dataset/data.yaml"
YOLO_MODEL_PRETRAINED = "yolov8l.pt"  # YOLOv8 Large (Setara dengan RT-DETR-L)

IMAGE_SIZE = 640
EPOCHS = 100
BATCH_SIZE = 8

CLASS_NAMES = [
    'ayam', 'nasi', 'sate', 'tempe', 'ayam_pop', 'cabai', 'dendeng_batokok', 
    'gulai_ikan', 'gulai_tunjang', 'kentang_balado', 'petai', 'rendang', 
    'sambal_ijo', 'sambal_merah', 'sauce', 'telur_balado', 'telur_dadar', 
    'udang_balado', 'bakso', 'bika_ambon', 'dadar_gulung', 'kue_cubit', 
    'nasi_goreng', 'pepes_ikan', 'putu_ayu', 'tahu', 'cah_kangkung', 
    'lainnya', 'buah'
]

def run_yolo_baseline():
    exp_name = "yolov8_l_baseline_640"
    exp_dir = os.path.join(PROJECT_DIR, exp_name)
    hardware_name = torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU"
    
    print(f"==================================================")
    print(f"🚀 Memulai Training YOLOv8-L Baseline (640x640, 29 Kelas)")
    print(f"Hardware: {hardware_name}")
    print(f"==================================================")
    
    # 1. Simpan konfigurasi training ke YAML
    config_data = {
        'model': 'YOLOv8-L (yolov8l.pt)',
        'task': 'detect',
        'dataset': DATA_YAML,
        'num_classes': len(CLASS_NAMES),
        'image_size': IMAGE_SIZE,
        'epochs': EPOCHS,
        'batch_size': BATCH_SIZE,
        'device': hardware_name,
        'optimizer': 'auto',
        'notes': 'Baseline comparison against RT-DETR-L on identical test split'
    }
    os.makedirs(exp_dir, exist_ok=True)
    config_yaml_path = os.path.join(PROJECT_DIR, "yolov8_training_config.yaml")
    with open(config_yaml_path, 'w') as f:
        yaml.dump(config_data, f, sort_keys=False)
    print(f"Konfigurasi disimpan di: {config_yaml_path}")
    
    # 2. Mulai Training YOLOv8-L
    t0 = time.time()
    model = YOLO(YOLO_MODEL_PRETRAINED)
    model.train(
        data=DATA_YAML,
        epochs=EPOCHS,
        imgsz=IMAGE_SIZE,
        batch=BATCH_SIZE,
        device=0 if torch.cuda.is_available() else 'cpu',
        project=PROJECT_DIR,
        name=exp_name,
        exist_ok=True
    )
    training_duration_mins = round((time.time() - t0) / 60, 2)
    print(f"✅ Training YOLOv8-L selesai dalam {training_duration_mins} menit.")
    
    # 3. Evaluasi pada TEST SET yang sama persis
    print(f"\n>>> Evaluasi YOLOv8-L pada Test Set <<<")
    best_weight = os.path.join(exp_dir, "weights", "best.pt")
    eval_model = YOLO(best_weight)
    
    metrics = eval_model.val(
        data=DATA_YAML,
        split='test',
        imgsz=IMAGE_SIZE,
        batch=BATCH_SIZE,
        device=0 if torch.cuda.is_available() else 'cpu',
        plots=True
    )
    
    # 4. Simpan Hasil Ringkasan Baseline
    p, r = float(metrics.box.mp), float(metrics.box.mr)
    map50, map_all = float(metrics.box.map50), float(metrics.box.map)
    f1 = 2 * (p * r) / (p + r + 1e-8)
    
    inf_ms = metrics.speed.get('inference', 0.0) + metrics.speed.get('postprocess', 0.0)
    fps = round(1000.0 / inf_ms, 2) if inf_ms > 0 else 0
    
    summary_data = [{
        'model': 'YOLOv8-L',
        'image_size': f"{IMAGE_SIZE}x{IMAGE_SIZE}",
        'epochs': EPOCHS,
        'batch_size': BATCH_SIZE,
        'precision': round(p, 4),
        'recall': round(r, 4),
        'mAP50': round(map50, 4),
        'mAP50_95': round(map_all, 4),
        'f1': round(f1, 4),
        'inference_ms': round(inf_ms, 2),
        'fps': fps,
        'training_time_min': training_duration_mins,
        'hardware': hardware_name
    }]
    
    df_summary = pd.DataFrame(summary_data)
    summary_csv_path = os.path.join(PROJECT_DIR, "yolov8_baseline_results.csv")
    df_summary.to_csv(summary_csv_path, index=False)
    print(f"\n📊 Ringkasan hasil YOLOv8 baseline disimpan di: {summary_csv_path}")
    print(df_summary.to_string(index=False))
    
    # 5. Simpan Hasil Per-Class (29 Kelas)
    per_class_records = []
    maps, ps, rs = metrics.box.maps, metrics.box.p, metrics.box.r
    for idx, c_name in enumerate(CLASS_NAMES):
        cp = float(ps[idx]) if idx < len(ps) else 0.0
        cr = float(rs[idx]) if idx < len(rs) else 0.0
        cmap = float(maps[idx]) if idx < len(maps) else 0.0
        per_class_records.append({
            'model': 'YOLOv8-L',
            'class_id': idx,
            'class_name': c_name,
            'precision': round(cp, 4),
            'recall': round(cr, 4),
            'f1': round(2 * (cp * cr) / (cp + cr + 1e-8), 4),
            'mAP50_95': round(cmap, 4)
        })
        
    df_per_class = pd.DataFrame(per_class_records)
    per_class_csv_path = os.path.join(PROJECT_DIR, "yolov8_per_class_results.csv")
    df_per_class.to_csv(per_class_csv_path, index=False)
    print(f"📋 Rincian hasil per-class disimpan di: {per_class_csv_path}")

if __name__ == "__main__":
    run_yolo_baseline()

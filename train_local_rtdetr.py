import os
import time
import csv
import torch
from ultralytics import RTDETR

# ==========================================
# KONFIGURASI EKSPERIMEN RT-DETR-L LOKAL
# ==========================================
DATA_YAML = r"C:\laragon\www\mbg\Super_Merged_Dataset_Final\data.yaml"
OUTPUT_DIR = r"C:\laragon\www\mbg\runs_local"

# Kita batasi resolusi yang masuk akal untuk VRAM 6GB agar tidak Error OOM.
# Jika ingin mencoba 960, pastikan VRAM cukup.
RESOLUTIONS = [512, 640, 800]
EPOCHS = 100

CLASS_NAMES = [
    'ayam', 'nasi', 'sate', 'tempe', 'ayam_pop', 'cabai', 'dendeng_batokok', 
    'gulai_ikan', 'gulai_tunjang', 'kentang_balado', 'petai', 'rendang', 
    'sambal_ijo', 'sambal_merah', 'sauce', 'telur_balado', 'telur_dadar', 
    'udang_balado', 'bakso', 'bika_ambon', 'dadar_gulung', 'kue_cubit', 
    'nasi_goreng', 'pepes_ikan', 'putu_ayu', 'tahu', 'cah_kangkung', 
    'lainnya', 'buah'
]

def run_rtdetr_local():
    hardware_name = torch.cuda.get_device_name(0) if torch.cuda.is_available() else "CPU"
    print("==================================================")
    print("🚀 Memulai Eksperimen RT-DETR-L di GPU Lokal")
    print(f"Device: {hardware_name}")
    print("==================================================")
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    summary_results = []
    per_class_records = []
    
    for res in RESOLUTIONS:
        exp_name = f"rtdetr_l_res_{res}_local"
        exp_dir = os.path.join(OUTPUT_DIR, exp_name)
        
        # Batch disesuaikan untuk GTX 1660 Ti (6GB VRAM)
        # Jika resolusi tinggi (800), batch harus sangat kecil (2) agar tidak OOM
        batch = 4 if res <= 640 else 2  
        
        print(f"\n==================================================")
        print(f"🚀 Training RT-DETR-L Resolusi: {res}x{res} (Batch: {batch})")
        print(f"==================================================")
        
        t0 = time.time()
        try:
            model = RTDETR('rtdetr-l.pt')
            model.train(
                data=DATA_YAML,
                epochs=EPOCHS,
                imgsz=res,
                batch=batch,
                device=0 if torch.cuda.is_available() else 'cpu',
                project=OUTPUT_DIR,
                name=exp_name,
                exist_ok=True,
                workers=2
            )
            duration = round((time.time() - t0) / 60, 2)
            
            # 2. Evaluasi pada Test Set
            best_pt = os.path.join(exp_dir, "weights", "best.pt")
            eval_model = RTDETR(best_pt)
            metrics = eval_model.val(
                data=DATA_YAML, split='test', imgsz=res, 
                batch=batch, device=0 if torch.cuda.is_available() else 'cpu', plots=True
            )
            
            # Ekstraksi Global Metrik
            p, r = float(metrics.box.mp), float(metrics.box.mr)
            map50, map_all = float(metrics.box.map50), float(metrics.box.map)
            f1 = 2 * (p * r) / (p + r + 1e-8)
            inf_ms = metrics.speed.get('inference', 0.0) + metrics.speed.get('postprocess', 0.0)
            fps = round(1000.0 / inf_ms, 2) if inf_ms > 0 else 0
            
            summary_results.append([
                'RT-DETR-L (Local)', f"{res}x{res}", 'SUCCESS', EPOCHS, batch, 
                round(p, 4), round(r, 4), round(map50, 4), round(map_all, 4), 
                round(f1, 4), round(inf_ms, 2), fps, duration, hardware_name
            ])
            
            # Ekstraksi Per-Class Metrik
            maps, ps, rs = metrics.box.maps, metrics.box.p, metrics.box.r
            for idx, c_name in enumerate(CLASS_NAMES):
                cp = float(ps[idx]) if idx < len(ps) else 0.0
                cr = float(rs[idx]) if idx < len(rs) else 0.0
                cmap = float(maps[idx]) if idx < len(maps) else 0.0
                per_class_records.append([
                    'RT-DETR-L', f"{res}x{res}", c_name, round(cp, 4), round(cr, 4), 
                    round(2 * (cp * cr) / (cp + cr + 1e-8), 4), round(cmap, 4)
                ])
                
        except Exception as e:
            print(f"❌ Gagal pada resolusi {res}: {e}")
            summary_results.append([
                'RT-DETR-L (Local)', f"{res}x{res}", f'FAILED: {e}', EPOCHS, batch, 
                0, 0, 0, 0, 0, 0, 0, 0, hardware_name
            ])

    # ==========================================
    # SIMPAN KE CSV (Tanpa Pandas agar aman)
    # ==========================================
    summary_csv = os.path.join(OUTPUT_DIR, "rtdetr_local_summary_results.csv")
    with open(summary_csv, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['model', 'resolution', 'status', 'epochs', 'batch_size', 'precision', 'recall', 'mAP50', 'mAP50_95', 'f1', 'inference_ms', 'fps', 'training_time_min', 'hardware'])
        writer.writerows(summary_results)

    per_class_csv = os.path.join(OUTPUT_DIR, "rtdetr_local_per_class_results.csv")
    with open(per_class_csv, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['model', 'resolution', 'class_name', 'precision', 'recall', 'f1', 'mAP50_95'])
        writer.writerows(per_class_records)

    print("\n🎉 Semua eksperimen RT-DETR lokal selesai!")
    print(f"📊 Ringkasan hasil disimpan di: {summary_csv}")
    print(f"📋 Rincian per-class disimpan di: {per_class_csv}")

if __name__ == "__main__":
    run_rtdetr_local()

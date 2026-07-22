from ultralytics import YOLO

def main():
    print("Memulai proses training YOLOv8 untuk Deteksi Makanan MBG...")
    
    # Memuat model dasar YOLOv8m (Medium) - Lebih akurat dibanding Small
    model = YOLO("yolov8m.pt") 

    # Memulai proses training
    # Path dataset mengarah ke file data.yaml dari dataset Mbg Detection
    results = model.train(
        data="Merged_MBG_Dataset/data.yaml",
        epochs=100,      # 100 Epoch agar model lebih paham membedakan 30 kelas
        imgsz=640,       # Ukuran gambar standar YOLO
        batch=8,         # Ukuran batch dikurangi jadi 8 agar muat di VRAM 6GB
        project="runs/detect",
        name="mbg_model_medium", # Nama folder untuk menyimpan hasil
        exist_ok=True
    )
    
    print("\nTraining selesai! File model terbaik Anda (best.pt) akan tersimpan di dalam folder:")
    print("runs/detect/mbg_model_small/weights/best.pt")

if __name__ == '__main__':
    main()

from ultralytics import YOLO

def main():
    print("Memulai proses training YOLOv8 untuk Deteksi Makanan MBG...")
    
    # Memuat model dasar YOLOv8n (Nano) - Paling ringan & super kilat
    model = YOLO("yolov8n.pt") 

    # Memulai proses training
    # Path dataset mengarah ke file data.yaml dari dataset Mbg Detection
    results = model.train(
        data="Merged_MBG_Dataset/data.yaml",
        epochs=30,       # 30 Epoch adalah titik tengah yang ideal untuk kecepatan & akurasi
        imgsz=640,       # Ukuran gambar standar YOLO
        batch=16,        # Ukuran batch
        project="runs/detect",
        name="mbg_model_nano", # Nama folder untuk menyimpan hasil
        exist_ok=True
    )
    
    print("\nTraining selesai! File model terbaik Anda (best.pt) akan tersimpan di dalam folder:")
    print("runs/detect/mbg_model_nano/weights/best.pt")

if __name__ == '__main__':
    main()

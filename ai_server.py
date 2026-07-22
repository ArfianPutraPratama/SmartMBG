from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import io
from PIL import Image
import uvicorn
import os
import base64

app = FastAPI(title="SmartMBG AI Microservice")

# Izinkan CORS agar Laravel/React bisa mengakses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inisialisasi model (Akan error jika best.pt belum selesai dibuat, jadi kita gunakan try-except)
MODEL_PATH = "best.pt"
model = None
try:
    if os.path.exists(MODEL_PATH):
        model = YOLO(MODEL_PATH)
        print(f"Model berhasil dimuat dari {MODEL_PATH}")
    else:
        print(f"WARNING: Model {MODEL_PATH} belum ditemukan. Tunggu proses training selesai.")
except Exception as e:
    print(f"Gagal memuat model: {e}")

# Database Gizi Sederhana (Estimasi per 1 porsi standar / gram tertentu)
# Database Gizi Standar TKPI (Per 100 gram)
NUTRITION_DB = {
    # Karbohidrat
    'nasi': {'kalori': 130, 'protein': 2.7, 'lemak': 0.3, 'karbo': 28, 'serat': 0.4, 'vit': 0},
    'rice': {'kalori': 130, 'protein': 2.7, 'lemak': 0.3, 'karbo': 28, 'serat': 0.4, 'vit': 0},
    'mie': {'kalori': 138, 'protein': 4.5, 'lemak': 2.1, 'karbo': 25, 'serat': 1.2, 'vit': 0},
    'noodle': {'kalori': 138, 'protein': 4.5, 'lemak': 2.1, 'karbo': 25, 'serat': 1.2, 'vit': 0},
    'kentang': {'kalori': 87, 'protein': 1.9, 'lemak': 0.1, 'karbo': 20.1, 'serat': 1.8, 'vit': 20},
    'potato': {'kalori': 87, 'protein': 1.9, 'lemak': 0.1, 'karbo': 20.1, 'serat': 1.8, 'vit': 20},
    
    # Lauk Hewani
    'ayam': {'kalori': 295, 'protein': 37, 'lemak': 15, 'karbo': 0, 'serat': 0, 'vit': 0},
    'chicken': {'kalori': 295, 'protein': 37, 'lemak': 15, 'karbo': 0, 'serat': 0, 'vit': 0},
    'daging_sapi': {'kalori': 250, 'protein': 26, 'lemak': 15, 'karbo': 0, 'serat': 0, 'vit': 0},
    'meat': {'kalori': 250, 'protein': 26, 'lemak': 15, 'karbo': 0, 'serat': 0, 'vit': 0},
    'telur': {'kalori': 155, 'protein': 13, 'lemak': 11, 'karbo': 1.1, 'serat': 0, 'vit': 0},
    'egg': {'kalori': 155, 'protein': 13, 'lemak': 11, 'karbo': 1.1, 'serat': 0, 'vit': 0},
    'ikan': {'kalori': 205, 'protein': 22, 'lemak': 12, 'karbo': 0, 'serat': 0, 'vit': 0},
    'fish': {'kalori': 205, 'protein': 22, 'lemak': 12, 'karbo': 0, 'serat': 0, 'vit': 0},
    
    # Lauk Nabati
    'tempe': {'kalori': 193, 'protein': 19, 'lemak': 11, 'karbo': 9, 'serat': 5, 'vit': 0},
    'tahu': {'kalori': 76, 'protein': 8, 'lemak': 4.8, 'karbo': 1.9, 'serat': 0.3, 'vit': 0},
    'tofu': {'kalori': 76, 'protein': 8, 'lemak': 4.8, 'karbo': 1.9, 'serat': 0.3, 'vit': 0},
    
    # Sayur & Buah
    'sayur': {'kalori': 30, 'protein': 2.0, 'lemak': 0.2, 'karbo': 6.0, 'serat': 2.5, 'vit': 35},
    'vegetable': {'kalori': 30, 'protein': 2.0, 'lemak': 0.2, 'karbo': 6.0, 'serat': 2.5, 'vit': 35},
    'pisang': {'kalori': 89, 'protein': 1.1, 'lemak': 0.3, 'karbo': 22.8, 'serat': 2.6, 'vit': 10},
    'jeruk': {'kalori': 43, 'protein': 0.9, 'lemak': 0.1, 'karbo': 8.3, 'serat': 2.4, 'vit': 53},
    'fruit': {'kalori': 60, 'protein': 1.0, 'lemak': 0.2, 'karbo': 15.0, 'serat': 2.5, 'vit': 40},
    
    # Lainnya
    'susu': {'kalori': 42, 'protein': 3.4, 'lemak': 1.0, 'karbo': 5, 'serat': 0, 'vit': 20},
    'milk': {'kalori': 42, 'protein': 3.4, 'lemak': 1.0, 'karbo': 5, 'serat': 0, 'vit': 20}
}

# Kalibrasi: Persentase Luas Kompartemen Standar pada Baki MBG (Total = 1.0 atau 100% foto)
COMPARTMENT_AREA_RATIO = {
    'karbohidrat': 0.25, # Nasi, Mie, Kentang
    'lauk': 0.15,        # Ayam, Daging, Telur, Ikan, Tempe, Tahu
    'sayur': 0.20,       # Sayuran
    'buah': 0.15,        # Buah-buahan
    'susu': 0.10         # Susu
}

# Kalibrasi: Berat Penuh per Kompartemen dalam Gram (Jika terisi 100%)
FULL_WEIGHT_GRAMS = {
    'karbohidrat': 180, # Gram
    'lauk': 70,         # Gram
    'sayur': 60,        # Gram
    'buah': 90,         # Gram
    'susu': 150         # Gram (ml)
}

def get_food_category(class_name):
    name = class_name.lower()
    if name in ['nasi', 'rice', 'mie', 'noodle', 'kentang', 'potato', 'cassava', 'bread', 'oat', 'corn']: return 'karbohidrat'
    if name in ['sayur', 'vegetable', 'kacang_panjang', 'bean', 'cap_cai', 'selada', 'timun']: return 'sayur'
    if name in ['buah', 'fruit', 'jeruk', 'pisang', 'semangka', 'anggur', 'lengkeng']: return 'buah'
    if name in ['susu', 'milk', 'juice']: return 'susu'
    return 'lauk' # Default to lauk for ayam, daging, ikan, telur, tempe, tahu, dll.

ID_TRANSLATION = {
    'bean': 'Buncis/Kacang',
    'bread': 'Roti',
    'cassava': 'Singkong',
    'cheese': 'Keju',
    'chicken': 'Ayam',
    'corn': 'Jagung',
    'cracker': 'Kerupuk',
    'egg': 'Telur',
    'empty': 'Kosong',
    'fish': 'Ikan',
    'fritter': 'Gorengan',
    'fruit': 'Buah',
    'juice': 'Jus',
    'meat': 'Daging',
    'meatball': 'Bakso',
    'milk': 'Susu',
    'noodle': 'Mie',
    'nugget': 'Nugget',
    'oat': 'Oat/Gandum',
    'omelet': 'Telur Dadar',
    'potato': 'Kentang',
    'rice': 'Nasi',
    'sauce': 'Saus',
    'shredded_chicken': 'Ayam Suwir',
    'shredded_fish': 'Ikan Suwir',
    'shrimp': 'Udang',
    'tempe': 'Tempe',
    'tofu': 'Tahu',
    'tray': 'Nampan',
    'vegetable': 'Sayur'
}

@app.get("/")
def read_root():
    return {"message": "SmartMBG AI Microservice is running!"}

@app.post("/analyze-food")
async def analyze_food(file: UploadFile = File(...)):
    global model
    if not model:
        # Coba muat model lagi
        try:
            if os.path.exists(MODEL_PATH):
                model = YOLO(MODEL_PATH)
        except Exception as e:
            pass
            
    # MOCK RESPONSE UNTUK TESTING SEMENTARA TRAINING BELUM SELESAI
    if not model:
        import asyncio
        await asyncio.sleep(2) # Simulasi loading AI 2 detik
        return {
            "status": "success",
            "menu_terdeteksi": ["Nasi", "Ayam", "Tempe", "Sayur Bayam"],
            "detail_deteksi": [
                {"name": "Nasi", "confidence": 95.4},
                {"name": "Ayam", "confidence": 88.2},
                {"name": "Tempe", "confidence": 91.5},
                {"name": "Sayur Bayam", "confidence": 82.1}
            ],
            "gizi": {
                "kalori": 577.0,
                "protein": 49.0,
                "lemak": 25.0,
                "karbo": 40.0,
                "serat": 6.7,
                "vitamin_mineral": 72.0
            },
            "rekomendasi": "[MODE SIMULASI] Model aslinya sedang dilatih ulang menggunakan versi Nano (Sangat Cepat) dengan 30 Epoch. Ini adalah hasil simulasi sementara agar Anda bisa mencoba fitur Upload!"
        }

    # Membaca gambar yang diunggah
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))

    # Melakukan deteksi dengan YOLO
    results = model(image)
    
    detected_classes = []
    total_gizi = {'kalori': 0, 'protein': 0, 'lemak': 0, 'karbo': 0, 'serat': 0, 'vit': 0}

    # Menguraikan hasil deteksi
    for r in results:
        boxes = r.boxes
        for box in boxes:
            class_id = int(box.cls[0].item())
            confidence = box.conf[0].item()
            class_name = model.names[class_id]
            
            # Filter deteksi dengan akurasi di atas 30% (bisa disesuaikan)
            # Sebelumnya 1% (0.01), sehingga banyak noise/salah deteksi
            if confidence > 0.30:
                display_name = ID_TRANSLATION.get(class_name, class_name)
                
                # MENGAMBIL POTONGAN GAMBAR (CROP)
                img_str = None
                try:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    crop = image.crop((x1, y1, x2, y2))
                    crop.thumbnail((150, 150)) # Perkecil ukuran agar tidak berat
                    if crop.mode != 'RGB':
                        crop = crop.convert('RGB')
                    buffered = io.BytesIO()
                    crop.save(buffered, format="JPEG")
                    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
                except Exception as e:
                    print("Gagal crop gambar:", repr(e))

                detected_classes.append({
                    "name": display_name.replace("_", " ").title(),
                    "confidence": round(confidence * 100, 2),
                    "image_base64": img_str
                })
                
                # PENGHITUNGAN PORSI BERDASARKAN RASIO KOMPARTEMEN BAKI (METODE 2)
                img_width, img_height = image.size
                total_image_area = img_width * img_height
                
                # Mendapatkan kategori makanan untuk mencari rasio kompartemen
                category = get_food_category(class_name)
                compartment_ratio = COMPARTMENT_AREA_RATIO.get(category, 0.15)
                full_weight = FULL_WEIGHT_GRAMS.get(category, 100)
                
                # Luas Kompartemen Baki (Standar)
                compartment_area = total_image_area * compartment_ratio
                
                # Mengambil titik koordinat kotak (bounding box)
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                box_width = x2 - x1
                box_height = y2 - y1
                
                # Luas Makanan menggunakan Geometri Elips
                import math
                food_area = math.pi * (box_width / 2.0) * (box_height / 2.0)
                
                # Menghitung Persentase Luas Makanan terhadap Luas Kompartemen
                fill_ratio = food_area / compartment_area
                if fill_ratio > 1.0:
                    fill_ratio = 1.0 # Maksimal 100% penuh
                
                # Estimasi Berat (Gram)
                estimated_weight_g = fill_ratio * full_weight
                
                # Menghitung Nilai Gizi berdasarkan Estimasi Berat (Gram)
                if class_name in NUTRITION_DB:
                    gizi_item = NUTRITION_DB[class_name]
                    # Rumus: (Berat / 100) * Nilai Gizi per 100g
                    weight_multiplier = estimated_weight_g / 100.0
                    total_gizi['kalori'] += gizi_item['kalori'] * weight_multiplier
                    total_gizi['protein'] += gizi_item['protein'] * weight_multiplier
                    total_gizi['lemak'] += gizi_item['lemak'] * weight_multiplier
                    total_gizi['karbo'] += gizi_item['karbo'] * weight_multiplier
                    total_gizi['serat'] += gizi_item['serat'] * weight_multiplier
                    total_gizi['vit'] += gizi_item['vit'] * weight_multiplier

    # Jika tidak ada yang terdeteksi
    if not detected_classes:
         return {
            "status": "success",
            "menu_terdeteksi": [],
            "gizi": total_gizi,
            "rekomendasi": "Tidak dapat mendeteksi makanan yang spesifik dari foto ini."
        }

    return {
        "status": "success",
        "menu_terdeteksi": [item['name'] for item in detected_classes],
        "detail_deteksi": detected_classes,
        "gizi": {
            "kalori": round(total_gizi['kalori'], 1),
            "protein": round(total_gizi['protein'], 1),
            "lemak": round(total_gizi['lemak'], 1),
            "karbo": round(total_gizi['karbo'], 1),
            "serat": round(total_gizi['serat'], 1),
            "vitamin_mineral": round(total_gizi['vit'], 1)
        },
        "rekomendasi": "Menu ini telah dianalisis berdasarkan deteksi visual. Hasil mungkin bervariasi bergantung pada ukuran porsi aslinya."
    }

if __name__ == "__main__":
    uvicorn.run("ai_server:app", host="0.0.0.0", port=8001, reload=True)

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import io
from PIL import Image
import uvicorn
import os
import base64
import math

app = FastAPI(title="SmartMBG AI Microservice (YOLO11)")

# Izinkan CORS agar Laravel/React bisa mengakses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inisialisasi model YOLO11 Terbaru (Mega Dataset 1.181 Kelas)
MODEL_PATH = r"yolo11v2\best_new.pt"
model = None
try:
    if os.path.exists(MODEL_PATH):
        model = YOLO(MODEL_PATH)
        print(f"✅ Model YOLO11 ({len(model.names)} Kelas) berhasil dimuat dari: {MODEL_PATH}")
    else:
        print(f"WARNING: Model {MODEL_PATH} belum ditemukan.")
except Exception as e:
    print(f"Gagal memuat model: {e}")

# Database Gizi Standar TKPI (Per 100 gram)
NUTRITION_DB = {
    # Karbohidrat
    'nasi': {'kalori': 130, 'protein': 2.7, 'lemak': 0.3, 'karbo': 28, 'serat': 0.4, 'vit': 0},
    'rice': {'kalori': 130, 'protein': 2.7, 'lemak': 0.3, 'karbo': 28, 'serat': 0.4, 'vit': 0},
    'nasi_goreng': {'kalori': 168, 'protein': 4.0, 'lemak': 6.2, 'karbo': 24, 'serat': 0.8, 'vit': 0},
    'bread': {'kalori': 265, 'protein': 9.0, 'lemak': 3.2, 'karbo': 49.0, 'serat': 2.7, 'vit': 0},
    'noodle': {'kalori': 138, 'protein': 4.5, 'lemak': 2.1, 'karbo': 25.0, 'serat': 1.2, 'vit': 0},
    'potato': {'kalori': 87, 'protein': 1.9, 'lemak': 0.1, 'karbo': 20.0, 'serat': 1.8, 'vit': 19},
    'cassava': {'kalori': 160, 'protein': 1.4, 'lemak': 0.3, 'karbo': 38.0, 'serat': 1.8, 'vit': 20},
    'corn': {'kalori': 96, 'protein': 3.4, 'lemak': 1.5, 'karbo': 21.0, 'serat': 2.4, 'vit': 7},
    'oat': {'kalori': 68, 'protein': 2.4, 'lemak': 1.4, 'karbo': 12.0, 'serat': 1.7, 'vit': 0},
    'kentang_balado': {'kalori': 110, 'protein': 2.0, 'lemak': 4.5, 'karbo': 16.5, 'serat': 1.5, 'vit': 12},
    
    # Lauk Hewani
    'ayam': {'kalori': 295, 'protein': 37, 'lemak': 15, 'karbo': 0, 'serat': 0, 'vit': 0},
    'chicken': {'kalori': 295, 'protein': 37, 'lemak': 15, 'karbo': 0, 'serat': 0, 'vit': 0},
    'ayam_pop': {'kalori': 260, 'protein': 30, 'lemak': 16, 'karbo': 0, 'serat': 0, 'vit': 0},
    'dendeng_batokok': {'kalori': 240, 'protein': 28, 'lemak': 12, 'karbo': 2.0, 'serat': 0, 'vit': 0},
    'gulai_ayam': {'kalori': 275, 'protein': 24, 'lemak': 19, 'karbo': 3.5, 'serat': 0.5, 'vit': 0},
    'gulai_ikan': {'kalori': 180, 'protein': 18, 'lemak': 11, 'karbo': 2.0, 'serat': 0.2, 'vit': 0},
    'gulai_tunjang': {'kalori': 251, 'protein': 15, 'lemak': 21, 'karbo': 0.8, 'serat': 0, 'vit': 0},
    'rendang': {'kalori': 193, 'protein': 22.6, 'lemak': 7.9, 'karbo': 7.8, 'serat': 0.5, 'vit': 0},
    'meat': {'kalori': 250, 'protein': 26, 'lemak': 15, 'karbo': 0, 'serat': 0, 'vit': 0},
    'meatball': {'kalori': 202, 'protein': 15.0, 'lemak': 14.2, 'karbo': 3.2, 'serat': 0.3, 'vit': 0},
    'bakso': {'kalori': 202, 'protein': 15.0, 'lemak': 14.2, 'karbo': 3.2, 'serat': 0.3, 'vit': 0},
    'fish': {'kalori': 120, 'protein': 20.0, 'lemak': 4.0, 'karbo': 0, 'serat': 0, 'vit': 0},
    'pepes_ikan': {'kalori': 140, 'protein': 16.5, 'lemak': 6.8, 'karbo': 3.0, 'serat': 0.5, 'vit': 0},
    'shrimp': {'kalori': 99, 'protein': 24.0, 'lemak': 0.3, 'karbo': 0.2, 'serat': 0, 'vit': 0},
    'udang_balado': {'kalori': 142, 'protein': 19.4, 'lemak': 6.0, 'karbo': 1.5, 'serat': 0.2, 'vit': 0},
    'egg': {'kalori': 155, 'protein': 13.0, 'lemak': 11.0, 'karbo': 1.1, 'serat': 0, 'vit': 0},
    'telur_balado': {'kalori': 175, 'protein': 12.5, 'lemak': 13.0, 'karbo': 2.0, 'serat': 0, 'vit': 0},
    'telur_dadar': {'kalori': 251, 'protein': 12.4, 'lemak': 21.3, 'karbo': 1.2, 'serat': 0, 'vit': 0},
    'omelet': {'kalori': 154, 'protein': 11.0, 'lemak': 12.0, 'karbo': 0.6, 'serat': 0, 'vit': 0},
    'sate': {'kalori': 225, 'protein': 21.0, 'lemak': 14.5, 'karbo': 3.6, 'serat': 0, 'vit': 0},
    'nugget': {'kalori': 296, 'protein': 15.0, 'lemak': 20.0, 'karbo': 14.0, 'serat': 0.5, 'vit': 0},
    'shredded_chicken': {'kalori': 220, 'protein': 25.0, 'lemak': 11.0, 'karbo': 2.0, 'serat': 0, 'vit': 0},
    'shredded_fish': {'kalori': 210, 'protein': 24.0, 'lemak': 10.0, 'karbo': 2.0, 'serat': 0, 'vit': 0},
    
    # Lauk Nabati
    'tempe': {'kalori': 193, 'protein': 19, 'lemak': 11, 'karbo': 9, 'serat': 5, 'vit': 0},
    'tahu': {'kalori': 76, 'protein': 8, 'lemak': 4.8, 'karbo': 1.9, 'serat': 0.3, 'vit': 0},
    'tofu': {'kalori': 76, 'protein': 8, 'lemak': 4.8, 'karbo': 1.9, 'serat': 0.3, 'vit': 0},
    'bean': {'kalori': 127, 'protein': 9.0, 'lemak': 0.5, 'karbo': 23.0, 'serat': 7.0, 'vit': 0},
    'fritter': {'kalori': 200, 'protein': 4.0, 'lemak': 12.0, 'karbo': 19.0, 'serat': 1.5, 'vit': 0},
    'cheese': {'kalori': 402, 'protein': 25.0, 'lemak': 33.0, 'karbo': 1.3, 'serat': 0, 'vit': 0},
    'cracker': {'kalori': 500, 'protein': 7.0, 'lemak': 25.0, 'karbo': 60.0, 'serat': 1.0, 'vit': 0},
    
    # Sayur & Buah
    'cah_kangkung': {'kalori': 45, 'protein': 2.5, 'lemak': 2.1, 'karbo': 4.2, 'serat': 2.0, 'vit': 42},
    'vegetable': {'kalori': 40, 'protein': 2.0, 'lemak': 0.5, 'karbo': 7.0, 'serat': 2.5, 'vit': 50},
    'cabai': {'kalori': 40, 'protein': 1.9, 'lemak': 0.4, 'karbo': 9.0, 'serat': 1.5, 'vit': 140},
    'petai': {'kalori': 92, 'protein': 5.4, 'lemak': 1.6, 'karbo': 15.0, 'serat': 2.0, 'vit': 20},
    'sambal_ijo': {'kalori': 85, 'protein': 1.2, 'lemak': 8.0, 'karbo': 3.0, 'serat': 0.8, 'vit': 30},
    'sambal_merah': {'kalori': 90, 'protein': 1.4, 'lemak': 8.5, 'karbo': 3.2, 'serat': 0.8, 'vit': 35},
    'buah': {'kalori': 60, 'protein': 0.8, 'lemak': 0.2, 'karbo': 15.0, 'serat': 2.5, 'vit': 45},
    'fruit': {'kalori': 60, 'protein': 0.8, 'lemak': 0.2, 'karbo': 15.0, 'serat': 2.5, 'vit': 45},
    
    # Susu & Minuman (MBG)
    'milk': {'kalori': 65, 'protein': 3.3, 'lemak': 3.6, 'karbo': 4.8, 'serat': 0, 'vit': 10},
    'juice': {'kalori': 45, 'protein': 0.5, 'lemak': 0.1, 'karbo': 11.0, 'serat': 0.2, 'vit': 30},
    
    # Jajanan Pasar & Lainnya
    'bika_ambon': {'kalori': 290, 'protein': 3.5, 'lemak': 7.5, 'karbo': 52.0, 'serat': 0.5, 'vit': 0},
    'dadar_gulung': {'kalori': 180, 'protein': 2.8, 'lemak': 4.2, 'karbo': 32.0, 'serat': 1.0, 'vit': 0},
    'kue_cubit': {'kalori': 150, 'protein': 3.0, 'lemak': 5.0, 'karbo': 23.0, 'serat': 0.5, 'vit': 0},
    'putu_ayu': {'kalori': 130, 'protein': 2.0, 'lemak': 3.5, 'karbo': 22.0, 'serat': 0.8, 'vit': 0},
    'sauce': {'kalori': 80, 'protein': 1.0, 'lemak': 0.2, 'karbo': 18.0, 'serat': 0.5, 'vit': 0},
    'lainnya': {'kalori': 50, 'protein': 1.0, 'lemak': 0.5, 'karbo': 10.0, 'serat': 0.5, 'vit': 0}
}

import csv
try:
    with open('nutrition.csv', mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name_key = row['name'].lower()
            if name_key not in NUTRITION_DB:
                NUTRITION_DB[name_key] = {
                    'kalori': float(row['calories'] or 0),
                    'protein': float(row['proteins'] or 0),
                    'lemak': float(row['fat'] or 0),
                    'karbo': float(row['carbohydrate'] or 0),
                    'serat': 1.0, # Default
                    'vit': 0
                }
except Exception as e:
    print("WARNING: Gagal memuat nutrition.csv tambahan:", e)

# Kalibrasi: Persentase Luas Kompartemen Standar pada Baki MBG (Total = 1.0 atau 100% foto)
COMPARTMENT_AREA_RATIO = {
    'karbohidrat': 0.25, 
    'lauk': 0.15,        
    'sayur': 0.20,       
    'buah': 0.15,        
    'susu': 0.10         
}

# Kalibrasi: Berat Penuh per Kompartemen dalam Gram (Jika terisi 100%)
FULL_WEIGHT_GRAMS = {
    'karbohidrat': 180, 
    'lauk': 70,         
    'sayur': 60,        
    'buah': 90,         
    'susu': 150         
}

def get_food_category(class_name):
    name = class_name.lower()
    if name in ['nasi', 'nasi_goreng', 'kentang_balado', 'rice', 'bread', 'noodle', 'potato', 'cassava', 'corn', 'oat']: return 'karbohidrat'
    if name in ['cah_kangkung', 'cabai', 'petai', 'sambal_ijo', 'sambal_merah', 'vegetable']: return 'sayur'
    if name in ['buah', 'fruit']: return 'buah'
    if name in ['milk', 'juice']: return 'susu'
    return 'lauk' # Default ke lauk untuk ayam, sate, tempe, tahu, rendang, telur, bakso, kue, dll.

ID_TRANSLATION = {
    'ayam': 'Ayam',
    'chicken': 'Ayam',
    'nasi': 'Nasi',
    'rice': 'Nasi',
    'sate': 'Sate',
    'tempe': 'Tempe',
    'ayam_pop': 'Ayam Pop',
    'cabai': 'Cabai',
    'dendeng_batokok': 'Dendeng Batokok',
    'gulai_ikan': 'Gulai Ikan',
    'gulai_tunjang': 'Gulai Tunjang',
    'kentang_balado': 'Kentang Balado',
    'petai': 'Petai',
    'rendang': 'Rendang',
    'sambal_ijo': 'Sambal Ijo',
    'sambal_merah': 'Sambal Merah',
    'sauce': 'Saus',
    'telur_balado': 'Telur Balado',
    'telur_dadar': 'Telur Dadar',
    'omelet': 'Telur Dadar',
    'egg': 'Telur',
    'udang_balado': 'Udang Balado',
    'shrimp': 'Udang',
    'bakso': 'Bakso',
    'meatball': 'Bakso',
    'meat': 'Daging',
    'fish': 'Ikan',
    'pepes_ikan': 'Pepes Ikan',
    'bika_ambon': 'Bika Ambon',
    'dadar_gulung': 'Dadar Gulung',
    'kue_cubit': 'Kue Cubit',
    'nasi_goreng': 'Nasi Goreng',
    'putu_ayu': 'Putu Ayu',
    'tahu': 'Tahu',
    'tofu': 'Tahu',
    'cah_kangkung': 'Cah Kangkung',
    'vegetable': 'Sayur',
    'buah': 'Buah',
    'fruit': 'Buah',
    'milk': 'Susu MBG',
    'juice': 'Jus',
    'bread': 'Roti',
    'noodle': 'Mie',
    'nugget': 'Nugget',
    'cracker': 'Kerupuk',
    'cheese': 'Keju',
    'bean': 'Kacang',
    'fritter': 'Gorengan',
    'corn': 'Jagung',
    'potato': 'Kentang',
    'cassava': 'Singkong',
    'oat': 'Oat',
    'shredded_chicken': 'Ayam Suwir',
    'shredded_fish': 'Abon Ikan',
    'tray': 'Baki MBG',
    'empty': 'Kosong',
    'lainnya': 'Lainnya'
}

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "SmartMBG AI Microservice",
        "model": "YOLO11 Small (72 Indonesian Food Classes)",
        "model_file": MODEL_PATH
    }

@app.post("/analyze-food")
async def analyze_food(file: UploadFile = File(...)):
    global model
    if not model:
        try:
            if os.path.exists(MODEL_PATH):
                model = YOLO(MODEL_PATH)
        except Exception as e:
            pass

    if not model:
        return {
            "status": "error",
            "message": f"Model {MODEL_PATH} tidak dapat dimuat."
        }

    # Membaca gambar yang diunggah
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))
    if image.mode != 'RGB':
        image = image.convert('RGB')

    # Melakukan deteksi dengan YOLO11
    results = model(image, conf=0.20, imgsz=640)
    
    detected_classes = []
    total_gizi = {'kalori': 0, 'protein': 0, 'lemak': 0, 'karbo': 0, 'serat': 0, 'vit': 0}

    # Menguraikan hasil deteksi
    for r in results:
        boxes = r.boxes
        for box in boxes:
            class_id = int(box.cls[0].item())
            confidence = box.conf[0].item()
            class_name = model.names[class_id]
            
            # Filter deteksi dengan akurasi di atas 20%
            if confidence >= 0.20:
                display_name = ID_TRANSLATION.get(class_name, class_name)
                
                # MENGAMBIL POTONGAN GAMBAR (CROP)
                img_str = None
                try:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    crop = image.crop((x1, y1, x2, y2))
                    crop.thumbnail((150, 150)) # Perkecil ukuran agar tidak berat
                    buffered = io.BytesIO()
                    crop.save(buffered, format="JPEG", quality=85)
                    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
                except Exception as e:
                    print("Gagal crop gambar:", repr(e))

                detected_classes.append({
                    "name": display_name.replace("_", " ").title(),
                    "class_raw": class_name,
                    "confidence": round(confidence * 100, 2),
                    "box": [int(v) for v in box.xyxy[0]],
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
                box_width = max(1, x2 - x1)
                box_height = max(1, y2 - y1)
                
                # Luas Makanan menggunakan Geometri Elips
                food_area = math.pi * (box_width / 2.0) * (box_height / 2.0)
                
                # Menghitung Persentase Luas Makanan terhadap Luas Kompartemen
                fill_ratio = food_area / compartment_area if compartment_area > 0 else 0.5
                if fill_ratio > 1.0:
                    fill_ratio = 1.0 # Maksimal 100% penuh
                
                # Estimasi Berat (Gram)
                estimated_weight_g = fill_ratio * full_weight
                
                # Menghitung Nilai Gizi berdasarkan Estimasi Berat (Gram)
                lookup_name = class_name.lower()
                gizi_item = NUTRITION_DB.get(lookup_name)
                
                if not gizi_item:
                    for db_key, db_val in NUTRITION_DB.items():
                        if lookup_name in db_key:
                            gizi_item = db_val
                            break

                if gizi_item:
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
            "detail_deteksi": [],
            "gizi": {
                "kalori": 0,
                "protein": 0,
                "lemak": 0,
                "karbo": 0,
                "serat": 0,
                "vitamin_mineral": 0
            },
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
        "rekomendasi": "Menu bergizi ini telah dianalisis menggunakan YOLO11 (72 Kelas Makanan Indonesia) dengan kalkulasi nutrisi terstandarisasi."
    }

if __name__ == "__main__":
    uvicorn.run("ai_server:app", host="0.0.0.0", port=8001, reload=True)

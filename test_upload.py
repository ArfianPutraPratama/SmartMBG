import requests
import json

url = "http://127.0.0.1:8001/analyze-food"
image_path = "c:\\laragon\\www\\mbg\\Merged_MBG_Dataset\\valid\\images\\21_jpg.rf.ZBWNA4DqTjnwIkX2DkoJ.jpg"

try:
    with open(image_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(url, files=files)
        
    data = response.json()
    print("Status:", data.get('status'))
    print("Menu terdeteksi:", data.get('menu_terdeteksi'))
    
    det = data.get('detail_deteksi', [])
    if det:
        for i, item in enumerate(det):
            has_b64 = bool(item.get('image_base64'))
            print(f"Item {i}: {item.get('name')} | Has base64: {has_b64}")
            if has_b64:
                print(f"  Base64 length: {len(item.get('image_base64'))}")
    else:
        print("No detail_deteksi found.")
        
except Exception as e:
    print("Error:", e)

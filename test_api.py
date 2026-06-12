import requests

url = 'http://127.0.0.1:8001/analyze-food'
files = {'file': open('c:/laragon/www/mbg/smartmbg-frontend/src/assets/nasi_putih.png', 'rb')}

try:
    response = requests.post(url, files=files)
    print("STATUS:", response.status_code)
    print("RESPONSE:", response.json())
except Exception as e:
    print("ERROR:", e)

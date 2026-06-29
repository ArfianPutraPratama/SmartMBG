# Gunakan Python 3.9 (atau versi lain yang kompatibel)
FROM python:3.9-slim

# Install dependensi sistem yang dibutuhkan (seperti OpenCV)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Atur working directory
WORKDIR /app

# Salin file requirements dan install dependensi Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Salin seluruh kode aplikasi (termasuk folder runs yang berisi model)
COPY . .

# Buat direktori dengan akses tulis yang mungkin dibutuhkan
RUN mkdir -p /.cache && chmod -R 777 /.cache
RUN chmod -R 777 /app

# Ekspos port 7860 untuk HuggingFace Spaces
EXPOSE 7860

# Jalankan uvicorn server
CMD ["uvicorn", "ai_server:app", "--host", "0.0.0.0", "--port", "7860"]

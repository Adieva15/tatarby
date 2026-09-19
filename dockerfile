FROM python:3.13-slim

# Системные зависимости: Tesseract для OCR, postgres-клиент для psycopg2
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-rus \
    tesseract-ocr-eng \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Сначала зависимости — кэшируется, если requirements.txt не менялся
COPY tessdata/tat_cyrl.traineddata /usr/share/tesseract-ocr/5/tessdata/
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Потом код
COPY . .

# Папка для загрузок OCR (создастся, если нет)
RUN mkdir -p /app/static/uploads

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
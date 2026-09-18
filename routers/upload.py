
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel

from utils import get_current_user


# from 


router = APIRouter(prefix="/api", tags=["ocr"])

UPLOAD_DIR = Path(__file__).parent.parent / "static" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"}
MAX_SIZE = 20 * 1024 * 1024


class OcrResponse(BaseModel):
    text: str


@router.post("/ocr", response_model=OcrResponse)
def ocr_endpoint(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
):
    # 1. Проверки
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(415, f"Неподдерживаемый тип: {file.content_type}")

    content = file.file.read()
    size = len(content)
    if size > MAX_SIZE:
        raise HTTPException(413, "Файл слишком большой")
    if size == 0:
        raise HTTPException(400, "Пустой файл")

    # 2. Временное сохранение на диск — OCR работает с путём
    ext = Path(file.filename or "").suffix.lower() or ".bin"
    saved_path = UPLOAD_DIR / f"{uuid.uuid4().hex}{ext}"
    saved_path.write_bytes(content)

    # 3. Вызов OCR 
    try:
        text = recognize(str(saved_path))   
    except Exception as e:
        raise HTTPException(500, f"Ошибка OCR: {e}")

    # 4. Возврат текста
    return OcrResponse(text=text)
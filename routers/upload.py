
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel

# Импорт зависимости авторизации из utils.py Димы
from utils import get_current_user

router = APIRouter(prefix="/api", tags=["upload"])

UPLOAD_DIR = Path(__file__).parent.parent / "static" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "application/pdf",
}

MAX_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB


class UploadResponse(BaseModel):
    file_id: str
    filename: str
    file_path: str
    size_bytes: int
    content_type: str


@router.post("/upload", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),   # ← защита
):

    # 1. Проверяем тип
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Неподдерживаемый тип: {file.content_type}. "
                   f"Разрешены: {', '.join(ALLOWED_CONTENT_TYPES)}",
        )

    # 2. Читаем в память
    content = await file.read()
    size = len(content)

    # 3. Проверяем размер
    if size > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Файл слишком большой: {size} байт. Максимум: {MAX_SIZE_BYTES}",
        )

    if size == 0:
        raise HTTPException(status_code=400, detail="Пустой файл")

    # 4. Уникальное имя
    ext = Path(file.filename or "").suffix.lower() or ".bin"
    file_id = uuid.uuid4().hex
    saved_name = f"{file_id}{ext}"
    saved_path = UPLOAD_DIR / saved_name

    # 5. Сохраняем
    saved_path.write_bytes(content)

    # 6. Возвращаем
    return UploadResponse(
        file_id=file_id,
        filename=file.filename or saved_name,
        file_path=f"/static/uploads/{saved_name}",
        size_bytes=size,
        content_type=file.content_type or "application/octet-stream",
    )
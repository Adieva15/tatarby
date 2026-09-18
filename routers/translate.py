
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from utils import get_current_user
from services.translate import translate


router = APIRouter(prefix="/api", tags=["translate"])


class TranslateRequest(BaseModel):
    text: str


class TranslateResponse(BaseModel):
    original: str
    translated: str


@router.post("/translate", response_model=TranslateResponse)
async def translate_endpoint(
    req: TranslateRequest,
    user_id: str = Depends(get_current_user),
):
    if not req.text or not req.text.strip():
        raise HTTPException(400, "Пустой текст")

    try:
        translated = await translate(req.text)
    except Exception as e:
        raise HTTPException(500, f"Ошибка перевода: {e}")

    return TranslateResponse(original=req.text, translated=translated)
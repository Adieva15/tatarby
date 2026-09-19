# schemas/word.py
from pydantic import BaseModel, Field
from typing import Any


class WordRequest(BaseModel):
    word: str = Field(..., min_length=1, max_length=100)

class WordResponse(BaseModel):
    """Тело ответа — что бэк возвращает."""
    word: str
    translation: str
    morph: list[dict[str, Any]] = []
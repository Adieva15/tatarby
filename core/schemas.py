# core/schemas.py
from pydantic import BaseModel, Field
from typing import Literal

AgeGroup = Literal["child_7_10", "teen_11_15", "adult_16_plus"]
CEFRLevel = Literal["A1", "A2", "B1", "B2", "C1"]
Style = Literal["simple", "poetic", "prose", "academic"]


class UserProfile(BaseModel):
    """Профиль пользователя"""
    user_id: str
    age_group: AgeGroup
    language_level: CEFRLevel
    preferred_style: Style = "simple"
    native_language: Literal["ru"] = "ru"


class AdaptRequest(BaseModel):
    """Полный запрос на адаптацию """
    profile: UserProfile
    russian_text: str = Field(..., min_length=1, max_length=2000)


class VocabNote(BaseModel):
    original: str
    replacement: str
    reason: str


class AdaptResponse(BaseModel):
    """Ответ агента"""
    adapted_text: str
    difficulty_score: float = Field(ge=0.0, le=1.0)
    vocabulary_notes: list[VocabNote] = Field(default_factory=list)
    level_check: dict
    attempts: int
    fallback: bool
    cached: bool = False
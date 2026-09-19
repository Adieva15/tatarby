
from pydantic import BaseModel, Field
from typing import Literal


QuestionType = Literal["fact", "inference", "opinion"]


class QuestionCard(BaseModel):
    type: QuestionType
    question: str
    options: list[str] = Field(default_factory=list)
    correct_index: int | None = None
    explanation: str | None = None


class QuestionsResponse(BaseModel):
    questions: list[QuestionCard]
    source_text_length: int
    fallback: bool = False
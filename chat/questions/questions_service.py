
# import json
# import logging


# from pydantic import BaseModel, Field
# from typing import Literal

# from tatarby.core.schemas import QuestionsResponse


# logger = logging.getLogger(__name__)

# VALID_TYPES = {"fact", "inference", "opinion"}


# class QuestionService:
#     def __init__(self, llm, max_retries: int = 2):
#         self.llm = llm
#         self.max_retries = max_retries

#     def generate(
#         self,
#         text: str,
#         age_group: str,
#         level: str,
#         n: int = 5,
#     ) -> QuestionsResponse:
#         prompt = build_questions_prompt(text, age_group, level, n)
#         last_result = None

#         for attempt in range(self.max_retries + 1):
#             try:
#                 raw_text = self.llm.generate(prompt)
#             except Exception as e:
#                 logger.warning("LLM failed on attempt %s: %s", attempt, e)
#                 break

#             parsed = self._parse_raw(raw_text)
#             if not parsed:
#                 continue

#             cards = self._parse_questions(parsed)
#             validated = self._validate(cards)
#             if validated:
#                 last_result = QuestionsResponse(
#                     questions=validated,
#                     source_text_length=len(text),
#                     fallback=False,
#                 )
#                 break

#         if last_result is None:
#             last_result = QuestionsResponse(
#                 questions=[],
#                 source_text_length=len(text),
#                 fallback=True,
#             )

#         return last_result

#     @staticmethod
#     def _parse_raw(raw: str) -> dict | None:
#         if not isinstance(raw, str):
#             return None
#         raw = raw.strip()
#         if raw.startswith("```"):
#             raw = raw.strip("`")
#             if raw.startswith("json"):
#                 raw = raw[4:]
#             raw = raw.strip()
#         try:
#             return json.loads(raw)
#         except json.JSONDecodeError as e:
#             logger.warning("invalid json: %s", e)
#             return None

#     def _parse_questions(self, raw: dict) -> list[QuestionCard]:
#         items = raw.get("questions", [])
#         if not isinstance(items, list):
#             return []

#         result = []
#         for item in items:
#             if not isinstance(item, dict):
#                 continue
#             qtype = item.get("type")
#             if qtype not in VALID_TYPES:
#                 continue
#             question = str(item.get("question", "")).strip()
#             if len(question) < 5:
#                 continue

#             options = [str(o).strip() for o in (item.get("options") or []) if str(o).strip()]
#             correct_index = item.get("correct_index")
#             explanation = item.get("explanation")

#             if qtype == "opinion":
#                 options = []
#                 correct_index = None
#                 explanation = None
#             else:
#                 if len(options) < 2:
#                     continue
#                 if not isinstance(correct_index, int):
#                     continue
#                 if not (0 <= correct_index < len(options)):
#                     continue

#             result.append(QuestionCard(
#                 type=qtype,
#                 question=question,
#                 options=options,
#                 correct_index=correct_index,
#                 explanation=str(explanation) if explanation else None,
#             ))

#         return result

#     @staticmethod
#     def _validate(cards: list[QuestionCard]) -> list[QuestionCard]:
#         seen, unique = set(), []
#         for c in cards:
#             k = c.question.lower().strip()
#             if k in seen:
#                 continue
#             seen.add(k)
#             unique.append(c)

#         if len(unique) < 2:
#             return []
#         if not any(c.type in ("fact", "inference") for c in unique):
#             return []

#         return unique

# class GeneratedQuestion(BaseModel):
    
#     text: str
#     option_a: str
#     option_b: str
#     option_c: str
#     option_d: str
#     correct_option: Literal["A", "B", "C", "D"]
#     difficulty: int = Field(ge=1, le=5)


# class GeneratedQuestions(BaseModel):
   
#     questions: list[GeneratedQuestion]
#     source_text_length: int
#     fallback: bool = False

# chat/questions/service.py
import json
import logging
from os import getenv

from openai import OpenAI

from chat.questions.questions_prompt import build_questions_prompt


logger = logging.getLogger(__name__)

VALID_LETTERS = {"A", "B", "C", "D"}


def _parse_raw(raw) -> dict | None:
    if not isinstance(raw, str):
        return None
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.strip("`")
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()
    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        logger.warning("bad json: %s", e)
        return None


def _parse_questions(raw: dict) -> list[dict]:
    items = raw.get("questions", [])
    if not isinstance(items, list):
        return []

    result = []
    for item in items:
        if not isinstance(item, dict):
            continue

        text = str(item.get("text", "")).strip()
        if len(text) < 5:
            continue

        options = {
            "option_a": str(item.get("option_a", "")).strip(),
            "option_b": str(item.get("option_b", "")).strip(),
            "option_c": str(item.get("option_c", "")).strip(),
            "option_d": str(item.get("option_d", "")).strip(),
        }
        if any(not v for v in options.values()):
            continue

        correct = str(item.get("correct_option", "")).strip().upper()
        if correct not in VALID_LETTERS:
            continue

        difficulty = item.get("difficulty")
        if not isinstance(difficulty, int) or not (1 <= difficulty <= 5):
            difficulty = 3

        result.append({
            "text": text,
            "correct_option": correct,
            "difficulty": difficulty,
            **options,
        })

    return result


def generate_questions(
    text: str,
    age_group: str,
    level: str,
    n: int = 5,
    max_retries: int = 2,
) -> dict:
    """
    Возвращает dict:
      {
        "questions": [...],
        "source_text_length": int,
        "fallback": bool,
      }
    """
    client = OpenAI(
        base_url=getenv("OPENAI_BASE_URL"),
        api_key=getenv("OPENAI_API_KEY"),
    )

    prompt = build_questions_prompt(text, age_group, level, n)
    last_result = None

    for attempt in range(max_retries + 1):
        try:
            raw = client.chat.completions.create(
                model="gemini-3.8-flash",
                messages=[{"role": "user", "content": prompt}],
            ).choices[0].message.content
        except Exception as e:
            logger.warning("LLM failed on attempt %s: %s", attempt, e)
            break

        parsed = _parse_raw(raw)
        if not parsed:
            continue

        cards = _parse_questions(parsed)

        seen, unique = set(), []
        for c in cards:
            k = c["text"].lower()
            if k in seen:
                continue
            seen.add(k)
            unique.append(c)

        if len(unique) >= 2:
            last_result = {
                "questions": unique,
                "source_text_length": len(text),
                "fallback": False,
            }
            break

    if last_result is None:
        last_result = {
            "questions": [],
            "source_text_length": len(text),
            "fallback": True,
        }

    return last_result
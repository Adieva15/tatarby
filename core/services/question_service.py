
import json
import logging

from core.schemas import QuestionsResponse, QuestionCard
from core.prompts.questions_v1 import build_questions_prompt

logger = logging.getLogger(__name__)

VALID_TYPES = {"fact", "inference", "opinion"}


class QuestionService:
    def __init__(self, llm, max_retries: int = 2):
        self.llm = llm
        self.max_retries = max_retries

    def generate(
        self,
        text: str,
        age_group: str,
        level: str,
        n: int = 5,
    ) -> QuestionsResponse:
        prompt = build_questions_prompt(text, age_group, level, n)
        last_result = None

        for attempt in range(self.max_retries + 1):
            try:
                raw_text = self.llm.generate(prompt)
            except Exception as e:
                logger.warning("LLM failed on attempt %s: %s", attempt, e)
                break

            parsed = self._parse_raw(raw_text)
            if not parsed:
                continue

            cards = self._parse_questions(parsed)
            validated = self._validate(cards)
            if validated:
                last_result = QuestionsResponse(
                    questions=validated,
                    source_text_length=len(text),
                    fallback=False,
                )
                break

        if last_result is None:
            last_result = QuestionsResponse(
                questions=[],
                source_text_length=len(text),
                fallback=True,
            )

        return last_result

    @staticmethod
    def _parse_raw(raw: str) -> dict | None:
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
            logger.warning("invalid json: %s", e)
            return None

    def _parse_questions(self, raw: dict) -> list[QuestionCard]:
        items = raw.get("questions", [])
        if not isinstance(items, list):
            return []

        result = []
        for item in items:
            if not isinstance(item, dict):
                continue
            qtype = item.get("type")
            if qtype not in VALID_TYPES:
                continue
            question = str(item.get("question", "")).strip()
            if len(question) < 5:
                continue

            options = [str(o).strip() for o in (item.get("options") or []) if str(o).strip()]
            correct_index = item.get("correct_index")
            explanation = item.get("explanation")

            if qtype == "opinion":
                options = []
                correct_index = None
                explanation = None
            else:
                if len(options) < 2:
                    continue
                if not isinstance(correct_index, int):
                    continue
                if not (0 <= correct_index < len(options)):
                    continue

            result.append(QuestionCard(
                type=qtype,
                question=question,
                options=options,
                correct_index=correct_index,
                explanation=str(explanation) if explanation else None,
            ))

        return result

    @staticmethod
    def _validate(cards: list[QuestionCard]) -> list[QuestionCard]:
        seen, unique = set(), []
        for c in cards:
            k = c.question.lower().strip()
            if k in seen:
                continue
            seen.add(k)
            unique.append(c)

        if len(unique) < 2:
            return []
        if not any(c.type in ("fact", "inference") for c in unique):
            return []

        return unique
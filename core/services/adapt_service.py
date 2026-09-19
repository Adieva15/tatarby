# core/services/adapt_service.py
import hashlib, json, logging
from typing import Optional

from core.schemas import AdaptRequest, AdaptResponse, VocabNote
from core.llm.client import LLMClient
from core.llm.exceptions import LLMUnavailable, InvalidResponse
from core.services.level_checker import check_level
from core.services.cache import CacheBackend

logger = logging.getLogger(__name__)


class AdaptService:
    """
    Агент адаптации. Оркестрирует: валидация → кэш → LLM → проверка → retry → fallback.
    """

    def __init__(
        self,
        llm: LLMClient,
        cache: CacheBackend,
        max_retries: int = 2,
    ):
        self.llm = llm
        self.cache = cache
        self.max_retries = max_retries

    @staticmethod
    def _cache_key(req: AdaptRequest) -> str:
        raw = json.dumps({
            "text": req.russian_text,
            "age": req.profile.age_group,
            "level": req.profile.language_level,
            "style": req.profile.preferred_style,
        }, sort_keys=True, ensure_ascii=False)
        return "adapt:" + hashlib.sha256(raw.encode()).hexdigest()

    async def run(self, req: AdaptRequest) -> AdaptResponse:
        # 1. Кэш
        key = self._cache_key(req)
        cached = await self.cache.get(key)
        if cached:
            payload = json.loads(cached)
            payload["cached"] = True
            return AdaptResponse(**payload)

        # 2. Agentic loop: попытки с усилением
        last_payload: Optional[dict] = None
        last_check: Optional[dict] = None

        for attempt in range(self.max_retries + 1):
            try:
                raw = await self.llm.raw_adapt(req)
            except LLMUnavailable as e:
                logger.warning("LLM unavailable on attempt %s: %s", attempt, e)
                break  # дальше пробовать бессмысленно — сразу в fallback
            except InvalidResponse as e:
                logger.warning("Invalid response on attempt %s: %s", attempt, e)
                continue  # модель ответила, но криво — можно повторить

            # Валидация структуры
            adapted_text = str(raw.get("adapted_text", "")).strip()
            if not adapted_text:
                continue

            # Проверка уровня — кодом, а не моделью
            check = check_level(adapted_text, req.profile.language_level)

            payload = {
                "adapted_text": adapted_text,
                "difficulty_score": float(raw.get("difficulty_score", 0.5)),
                "vocabulary_notes": [
                    VocabNote(**n) for n in raw.get("vocabulary_notes", [])
                    if isinstance(n, dict) and {"original", "replacement", "reason"} <= n.keys()
                ],
                "level_check": check,
                "attempts": attempt + 1,
                "fallback": False,
                "cached": False,
            }
            last_payload = payload
            last_check = check

            if check["passed"]:
                await self.cache.set(key, json.dumps({
                    **payload,
                    "vocabulary_notes": [n.model_dump() for n in payload["vocabulary_notes"]],
                }, ensure_ascii=False), ttl=3600 * 24)
                return AdaptResponse(**payload)

            # Не прошло — просим модель упростить уже адаптированный текст
            req = req.model_copy(update={"russian_text": adapted_text})

        # 3. Fallback: возвращаем лучшее из того, что было
        if last_payload is None:
            last_payload = {
                "adapted_text": req.russian_text,
                "difficulty_score": 1.0,
                "vocabulary_notes": [],
                "level_check": check_level(req.russian_text, req.profile.language_level),
                "attempts": self.max_retries + 1,
                "fallback": True,
                "cached": False,
            }
        else:
            last_payload["fallback"] = True

        return AdaptResponse(**last_payload)
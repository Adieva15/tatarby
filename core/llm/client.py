# core/llm/client.py
import httpx, json, logging
from core.schemas import AdaptRequest, VocabNote
from core.prompts.adapt_v1 import build_adapt_prompt
from core.llm.exceptions import LLMUnavailable, InvalidResponse

logger = logging.getLogger(__name__)


class LLMClient:
    def __init__(self, token: str, base_url: str, model: str, timeout: float = 10.0):
        self.token = token
        self.base_url = base_url
        self.model = model
        self.timeout = timeout

    async def raw_adapt(self, req: AdaptRequest) -> dict:
        """Возвращает сырой распарсенный JSON от модели или кидает ошибку."""
        prompt = build_adapt_prompt(req)
        temperature = 0.7 if req.profile.preferred_style == "poetic" else 0.3

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={"Authorization": f"Bearer {self.token}"},
                    json={
                        "model": self.model,
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": temperature,
                        "max_tokens": 1024,
                        "response_format": {"type": "json_object"},
                    },
                )
                resp.raise_for_status()
                content = resp.json()["choices"][0]["message"]["content"]
        except httpx.HTTPError as e:
            raise LLMUnavailable(str(e)) from e

        try:
            parsed = json.loads(content)
        except json.JSONDecodeError as e:
            raise InvalidResponse(f"bad json: {content[:200]}") from e

        return parsed
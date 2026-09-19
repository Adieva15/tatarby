
from fastapi import APIRouter, HTTPException
from core.config import settings
from core.schemas import AdaptRequest, AdaptResponse
from core.llm.client import LLMClient
from core.services.adapt_service import AdaptService

router = APIRouter(prefix="/api/adapt", tags=["adapt"])


class NoCache:
    async def get(self, key): return None
    async def set(self, key, value, ttl=3600): pass


_llm = LLMClient(
    token=settings.hf_token,
    base_url=settings.hf_base_url,
    model=settings.hf_model,
    timeout=settings.hf_timeout,
)

_service = AdaptService(llm=_llm, cache=NoCache(), max_retries=2)


@router.post("", response_model=AdaptResponse)
async def adapt_text(req: AdaptRequest):
    try:
        return await _service.run(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from typing import Optional, Protocol

class CacheBackend(Protocol):
    async def get(self, key: str) -> Optional[str]: ...
    async def set(self, key: str, value: str, ttl: int = 3600) -> None: ...


class RedisCache:
    def __init__(self, redis_client):
        self.redis = redis_client

    async def get(self, key: str) -> Optional[str]:
        return await self.redis.get(key)

    async def set(self, key: str, value: str, ttl: int = 3600) -> None:
        await self.redis.set(key, value, ex=ttl)
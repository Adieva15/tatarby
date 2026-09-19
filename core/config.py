# core/config.py
import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    hf_token: str
    hf_base_url: str
    hf_model: str
    hf_timeout: float
    redis_url: str


def load_settings() -> Settings:
    return Settings(
        hf_token=os.environ["HF_TOKEN"],
        hf_base_url=os.getenv("HF_BASE_URL", "https://api-inference.huggingface.co/v1"),
        hf_model=os.getenv("HF_MODEL", "unsloth/Llama-3.1-8B-Instruct"),
        hf_timeout=float(os.getenv("HF_TIMEOUT", "10")),
        redis_url=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    )


settings = load_settings()
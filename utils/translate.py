import httpx
import os
from dotenv import load_dotenv

load_dotenv()

MT_URL = os.getenv("MT")


def translate(text: str, direction: str = "tat2rus") -> str:
    if not text or not text.strip():
        return ""

    with httpx.Client(timeout=30) as client:
        r = client.get(
            f"{MT_URL}",
            params={"lang": direction, "text": text},
        )
        r.raise_for_status()
        data = r.json()

        if isinstance(data, str):
            return data
        if isinstance(data, dict):
            return data.get("translation") or data.get("text") or str(data)
        return str(data)
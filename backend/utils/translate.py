import httpx
import os
from typing import Any
from dotenv import load_dotenv

load_dotenv()

MT_URL = os.getenv("MT")
MORPH_API_URL = os.getenv("MORPH_API_URL")


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


def analyze_morphology(text: str) -> list[dict[str, Any]]:
    """
    Отправляет текст на морфологический анализ в API «Туган тел».
    
    :param text: Текст на татарском языке для анализа.
    :return: JSON-массив с полями 'source' и 'analyzed'.
    :raises httpx.HTTPStatusError: Если API вернул ошибку.
    """
    if not text or not text.strip():
        return []

    try:
        with httpx.Client(timeout=30) as client:
            response = client.post(
                MORPH_API_URL,
                data={"text": text.strip()},  # Параметр 'text' в теле запроса
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            response.raise_for_status()
            return response.json()
    except httpx.TimeoutException:
        print("Ошибка: Превышено время ожидания ответа от морфоанализатора.")
        raise
    except httpx.HTTPStatusError as e:
        print(f"Ошибка API морфоанализатора: {e.response.status_code} - {e.response.text}")
        raise
    except Exception as e:
        print(f"Неизвестная ошибка при запросе к морфоанализатору: {e}")
        raise
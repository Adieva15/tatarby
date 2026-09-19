from os import getenv
from dotenv import load_dotenv

from openai import OpenAI
from .prompt import prompt

_ = load_dotenv()

OPENAI_BASE_URL = str(getenv("OPENAI_BASE_URL"))
OPENAI_API_KEY = str(getenv("OPENAI_API_KEY"))


class ChatService:
    def __init__(self, base_url: str, api_key: str):
        self.client: OpenAI = OpenAI(base_url=base_url, api_key=api_key) if (base_url or api_key) else None

    
    def validate_task(self, text_ru: str, text_tat: str):
        if client == None:
            return {"output_text": "[Ошибка] Не удалось инициализировать ИИ клиент"}
        res = client.chat.completions.create(model="gemini-3.7-flash", messages=[{"role": "user", "content": f"{prompt}\n{text_ru}\n{text_tat}"}])
        return res.to_dict()


client = ChatService(base_url=OPENAI_BASE_URL, api_key=OPENAI_API_KEY)
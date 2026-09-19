from os import getenv
from dotenv import load_dotenv

from openai import OpenAI
from .prompt import build_prompt, build_essay_check_prompt

_ = load_dotenv()

OPENAI_BASE_URL = str(getenv("OPENAI_BASE_URL"))
OPENAI_API_KEY = str(getenv("OPENAI_API_KEY"))


class ChatService:
    def __init__(self, base_url: str, api_key: str):
        self.client: OpenAI = OpenAI(base_url=base_url, api_key=api_key)

    
    def validate_task(self, text_ru: str, text_tat: str, lang_level: int):
        if self.client == None:
            return {"output_text": "[Ошибка] Не удалось инициализировать ИИ клиент"}
        res = self.client.chat.completions.create(model="gemini-3.8-flash", messages=[{"role": "user", "content": build_prompt(text_ru, text_tat, lang_level)}])
        return res.to_dict()

    def check_essay(self, text_ru: str, text_tat: str, lang_level: int):
        if self.client == None:
            return {"output_text": "[Ошибка] Не удалось инициализировать ИИ клиент"}
        res = self.client.chat.completions.create(model="gemini-3.8-flash", messages=[{"role": "user", "content": build_essay_check_prompt(text_ru, text_tat, lang_level)}])
        return res.to_dict()


client = ChatService(base_url=OPENAI_BASE_URL, api_key=OPENAI_API_KEY)
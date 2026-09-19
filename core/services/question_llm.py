
from os import getenv
from openai import OpenAI


class QuestionLLM:
    def __init__(self):
        self.client = OpenAI(
            base_url=getenv("OPENAI_BASE_URL"),
            api_key=getenv("OPENAI_API_KEY"),
        )

    def generate(self, prompt: str) -> str:
        res = self.client.chat.completions.create(
            model="gemini-3.7-flash",
            messages=[{"role": "user", "content": prompt}],
        )
        return res.choices[0].message.content
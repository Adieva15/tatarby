# core/prompts/questions_v1.py

AGE_HUMAN = {
    "child_7_10": "ребёнок 7–10 лет",
    "teen_11_15": "подросток 11–15 лет",
    "adult_16_plus": "взрослый",
}

LEVEL_HUMAN = {
    "1": "A1 — начинающий, топ-1000 слов",
    "2": "A2 — элементарный, топ-2000 слов",
    "3": "B1 — средний, топ-5000 слов",
    "4": "B2 — выше среднего",
    "5": "C1 — продвинутый",
}


def build_questions_prompt(text: str, age_group: str, level: str, n: int = 5) -> str:
    n_fact = max(1, n - 2)
    n_inference = 1 if n >= 3 else 0
    n_opinion = n - n_fact - n_inference

    return f"""# ЗАДАЧА
Составь ровно {n} вопросов на понимание текста.

# АУДИТОРИЯ
- Возраст: {AGE_HUMAN.get(age_group, age_group)}
- Уровень русского: {LEVEL_HUMAN.get(level, level)}

# СОСТАВ
- {n_fact} вопроса типа "fact" — о фактах (кто, что, где, когда).
- {n_inference} вопрос типа "inference" — вывод (почему, зачем).
- {n_opinion} вопрос типа "opinion" — личное мнение.

# ПРАВИЛА
- Вопросы на русском, в рамках уровня {level}.
- К каждому fact/inference — 3 варианта ответа, ровно один правильный.
- Дистракторы похожи на правду, но противоречат тексту.
- Для opinion: correct_index = null, options = [].
- Не спрашивай то, чего нет в тексте.

# ФОРМАТ (строго JSON)
{{
  "questions": [
    {{
      "type": "fact",
      "question": "строка",
      "options": ["A", "B", "C"],
      "correct_index": 0,
      "explanation": "почему правильный"
    }},
    {{
      "type": "opinion",
      "question": "строка",
      "options": [],
      "correct_index": null,
      "explanation": null
    }}
  ]
}}

# ТЕКСТ
{text}
"""

import re

LEVEL_LIMITS = {
    "A1": {"max_sent": 7,  "max_word": 6.5,  "max_rare": 0.05},
    "A2": {"max_sent": 10, "max_word": 7.5,  "max_rare": 0.15},
    "B1": {"max_sent": 15, "max_word": 8.5,  "max_rare": 0.30},
    "B2": {"max_sent": 25, "max_word": 10.0, "max_rare": 0.50},
    "C1": {"max_sent": 40, "max_word": 12.0, "max_rare": 0.80},
}

# Заглушки
FREQ = {
    "A1": set(),  # топ-1000
    "A2": set(),  # топ-2000
    "B1": set(),  # топ-5000
}


def check_level(text: str, level: str) -> dict:
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    words = re.findall(r'\b[а-яёА-ЯЁ]+\b', text.lower())

    if not sentences or not words:
        return {"passed": False, "reason": "empty_text"}

    avg_sent = sum(len(s.split()) for s in sentences) / len(sentences)
    avg_word = sum(len(w) for w in words) / len(words)

    freq_set = FREQ.get(level)
    rare_ratio = 0.0
    if freq_set:
        rare = sum(1 for w in words if w not in freq_set)
        rare_ratio = rare / len(words)

    lim = LEVEL_LIMITS[level]
    passed = (
        avg_sent <= lim["max_sent"]
        and avg_word <= lim["max_word"]
        and rare_ratio <= lim["max_rare"]
    )

    return {
        "passed": passed,
        "avg_sentence_len": round(avg_sent, 2),
        "avg_word_len": round(avg_word, 2),
        "rare_ratio": round(rare_ratio, 3),
        "declared_level": level,
    }
 
class LLMError(Exception):
    """Базовое исключение для всего, что связано с LLM."""
    pass


class LLMUnavailable(LLMError):
    """Модель недоступна: сеть, таймаут, 5xx от провайдера."""
    pass


class InvalidResponse(LLMError):
    """Модель ответила, но формат не тот: не JSON, нет нужных полей."""
    pass
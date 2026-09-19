 
import pytest
from core.services.level_checker import check_level


def test_a1_passes_simple_text():
    text = "Мама мыла раму. Папа пил чай. Дети спали."
    result = check_level(text, "A1")
    assert result["passed"] is True
    assert result["avg_sentence_len"] <= 7


def test_a1_fails_complex_text():
    text = (
        "Резонанс представляет собой явление резкого возрастания "
        "амплитуды вынужденных колебаний, которое наступает при "
        "совпадении частоты внешнего воздействия с собственной частотой системы."
    )
    result = check_level(text, "A1")
    assert result["passed"] is False
    assert result["avg_sentence_len"] > 7


def test_empty_text_fails():
    result = check_level("", "A2")
    assert result["passed"] is False
    assert result["reason"] == "empty_text"


@pytest.mark.parametrize("level,text,expected", [
    ("A1", "Кот спит. Пёс ест.", True),
    ("B2", "Резонанс — это явление, которое возникает при совпадении частот.", True),
])
def test_levels_parametrized(level, text, expected):
    assert check_level(text, level)["passed"] is expected
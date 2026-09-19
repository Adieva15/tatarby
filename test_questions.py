# scripts/test_questions.py
from core.services.question_service import QuestionService
from core.services.question_llm import QuestionLLM

service = QuestionService(llm=QuestionLLM())

result = service.generate(
    text="Резонанс — это явление резкого возрастания амплитуды вынужденных колебаний, которое наступает при совпадении частоты внешнего воздействия с собственной частотой системы.",
    age_group="teen_11_15",
    level="B1",
    n=5,
)

print(f"fallback: {result.fallback}")
for q in result.questions:
    print(f"\n[{q.type}] {q.question}")
    for i, opt in enumerate(q.options):
        mark = "✓" if i == q.correct_index else " "
        print(f"  {mark} {opt}")
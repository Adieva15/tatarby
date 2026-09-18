import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.config import SessionLocal
from database.models.questions import Question


def seed():
    db = SessionLocal()
    try:
        existing = db.query(Question).count()
        if existing > 0:
            print(f"В БД уже {existing} вопросов — пропускаю")
            return

        questions = [
            Question(
                text="Как сказать 'привет' по-татарски?",
                option_a="Исәнмесез",
                option_b="Сау бул",
                option_c="Рәхмәт",
                option_d="Зинһар",
                correct_option="a",
                difficulty=1,
            ),
            Question(
                text="Что значит 'Рәхмәт'?",
                option_a="Привет",
                option_b="Спасибо",
                option_c="Пока",
                option_d="Пожалуйста",
                correct_option="b",
                difficulty=2,
            ),
            Question(
                text="Как спросить 'Как дела?'",
                option_a="Син кем?",
                option_b="Хәлләрең ничек?",
                option_c="Кая барасың?",
                option_d="Ничә яшьтәсең?",
                correct_option="b",
                difficulty=3,
            ),
            Question(
                text="Выбери правильную форму: 'Мин китап...'",
                option_a="укыйм",
                option_b="укый",
                option_c="укыйбыз",
                option_d="укыйсың",
                correct_option="a",
                difficulty=4,
            ),
            Question(
                text="Что означает фразеологизм 'Күз карасыдай саклау'?",
                option_a="Беречь как зеницу ока",
                option_b="Смотреть в оба",
                option_c="Отводить глаза",
                option_d="Хлопать глазами",
                correct_option="a",
                difficulty=5,
            ),
        ]

        db.add_all(questions)
        db.commit()
        print(f"Добавлено {len(questions)} вопросов")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
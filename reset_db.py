# scripts/reset_db.py
from database.config import Base, engine
from database import models  # noqa — регистрирует ВСЕ модели в SQLAlchemy

print("Удаляю таблицы...")
Base.metadata.drop_all(bind=engine)

print("Создаю заново...")
Base.metadata.create_all(bind=engine)

print("Готово. Таблицы пересозданы с новыми колонками.")
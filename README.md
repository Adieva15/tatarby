# 📖 Tatar Learning Platform

Интеллектуальная платформа для изучения татарского языка русскоязычными пользователями.

Пользователь может определить свой уровень владения языком, распознавать татарский текст с изображений, получать перевод и морфологический разбор, адаптировать сложные тексты под свой уровень, проверять сочинения с помощью искусственного интеллекта и отслеживать собственный прогресс через систему достижений.

---

# ✨ Основные возможности

* 📷 Распознавание татарского текста с изображений (OCR)
* 🌐 Перевод татарский ↔ русский
* 📖 Морфологический анализ слов
* 🎯 Тестирование уровня владения языком
* 🤖 Адаптация текстов под уровень пользователя
* ✍️ Проверка сочинений с помощью LLM
* 📚 Личный словарь
* 🔥 Стрики, XP, достижения и статистика обучения
* 🔐 Безопасная JWT-аутентификация с Refresh Token

---

# 📸 Возможности платформы

## 📷 OCR

Пользователь загружает фотографию с татарским текстом.

Система:

* распознаёт текст при помощи **Tesseract OCR**
* автоматически извлекает татарский текст
* передаёт его дальше для перевода и адаптации.

---

## 🎯 Адаптация текста

После определения уровня пользователя система автоматически упрощает текст.

Например:

> Уровень 1 — максимально простые предложения

↓

> Уровень 5 — оригинальный текст без изменений

Это позволяет читать настоящие татарские тексты даже начинающим.

---

## 🌐 Перевод

Поддерживается перевод:

* татарский → русский
* русский → татарский

Используется API TatSoft.

---

## 📖 Морфологический анализ

Для любого слова можно получить:

* основу слова;
* часть речи;
* грамматические характеристики;
* словоформы.

Используется морфологический сервис **«Туган Тел»**.

---

## 📝 Проверка сочинений

Пользователь отправляет сочинение на татарском языке.

LLM оценивает работу по нескольким критериям:

* грамматика;
* орфография;
* словарный запас;
* логика;
* соответствие теме.

После проверки пользователь получает рекомендации по улучшению текста.

---

## 🎓 Тест уровня языка

Перед использованием платформы пользователь проходит небольшой тест.

На основе результатов определяется один из пяти уровней владения татарским языком.

Полученный уровень затем используется при адаптации всех текстов.

---

## 🔥 Геймификация

Во время обучения пользователь получает:

* XP;
* достижения;
* серию ежедневных занятий (Streak);
* статистику активности;
* уровень аккаунта.

Это помогает поддерживать регулярность обучения.

---

# 🏗 Архитектура

```
React (Frontend)

        │

        ▼

FastAPI (REST API)

        │

 ┌──────┴────────┐
 │               │
 ▼               ▼

PostgreSQL     Redis
данные        кэш / refresh JWT

        │

        ▼

Сервисы

• OCR (Tesseract)
• LLM
• TatSoft Translate
• Туган Тел Morphology
```

---

# ⚙ Используемые технологии

| Категория      | Технологии                     |
| -------------- | ------------------------------ |
| Backend        | FastAPI, Python 3.13           |
| Frontend       | React, Vite                    |
| ORM            | SQLAlchemy                     |
| Миграции       | Alembic                        |
| База данных    | PostgreSQL 16                  |
| Кэш            | Redis 7                        |
| Аутентификация | JWT (Access + Refresh Token)   |
| OCR            | Tesseract OCR (`tat_cyrl`)     |
| AI             | Gemini (OpenAI Compatible API) |

---

# 📂 Структура проекта

```text
tatar_sborka
│
├── app
│   ├── chat
│   ├── database
│   ├── schemas
│   ├── static
│   ├── tessdata
│   ├── utils
│   └── main.py
│
├── frontend
│
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

# 🚀 Быстрый запуск

## 1. Клонирование

```bash
git clone https://github.com/Adieva15/tatarby.git
cd tatarby
```

---

## 2. Создание `.env`

```env
SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTE=30

REFRESH_TOKEN_EXPIRE_DAYS=7

DATABASE_URL=postgresql://myuser:password@postgres:5432/mydb

REDIS_URL=redis://:password@redis:6379/0

OPENAI_API_KEY=your_api_key

OPENAI_BASE_URL=https://api.openai.com/v1

MT=https://v2.api.translate.tatar/listening/

MORPH_API_URL=https://tugantel.tatar/new2022/morph?json=data

SECURE_COOKIE=false
```

---

## 3. Запуск проекта

```bash
docker compose up -d --build
```

---

## 4. Применение миграций

```bash
docker compose exec app alembic upgrade head
```

---

## 5. Заполнение тестовых вопросов

```bash
docker compose exec app python scripts/seed_questions.py
```

---

# 🌍 Доступные сервисы

| Сервис     | Адрес                      |
| ---------- | -------------------------- |
| Swagger    | http://localhost:8000/docs |
| Backend    | http://localhost:8000      |
| Frontend   | http://localhost:4173      |
| PostgreSQL | localhost:5433             |
| Redis      | localhost:6379             |

---

# 🔐 Авторизация

Используется современная схема JWT.

```
Регистрация

↓

Логин

↓

Access Token

+

Refresh Token (HttpOnly Cookie)

↓

При окончании Access Token

↓

Автоматическое обновление через Refresh Token
```

Refresh-токен хранится только в HttpOnly Cookie, что значительно повышает безопасность приложения.

---

# 📡 Основные API

| Метод | Endpoint                        | Описание                  |
| ----- | ------------------------------- | ------------------------- |
| POST  | `/api/register`                 | Регистрация               |
| POST  | `/api/login`                    | Авторизация               |
| POST  | `/auth/refresh`                 | Обновление Access Token   |
| POST  | `/auth/logout`                  | Выход                     |
| GET   | `/api/me/profile`               | Профиль пользователя      |
| GET   | `/api/me/level`                 | Получение уровня          |
| GET   | `/api/level-test/questions`     | Получение вопросов        |
| POST  | `/api/level-test/submit`        | Отправка ответов          |
| POST  | `/api/translate-and-adapt-text` | OCR + перевод + адаптация |
| POST  | `/api/word`                     | Перевод слова             |
| GET   | `/api/morph`                    | Морфологический анализ    |
| POST  | `/api/essay`                    | Проверка сочинения        |

---

# 🐳 Полезные Docker-команды

### Просмотр логов

```bash
docker compose logs -f app
```

---

### Войти в контейнер

```bash
docker compose exec app bash
```

---

### Остановить проект

```bash
docker compose down
```

---

### Полная очистка

```bash
docker compose down -v
```

---

### Пересборка

```bash
docker compose build --no-cache
docker compose up -d
```

---

# 🔄 Alembic

Создание миграции

```bash
docker compose exec app alembic revision --autogenerate -m "message"
```

Применение

```bash
docker compose exec app alembic upgrade head
```

Откат

```bash
docker compose exec app alembic downgrade -1
```

---

# 🛠 Возможные проблемы

### PostgreSQL не подключается

Проверьте `DATABASE_URL`.

В Docker вместо `localhost` должно использоваться имя сервиса:

```
postgres
```

---

### Redis недоступен

Проверьте значение `REDIS_URL`.

---

### Не работают JWT Cookie

Для локальной разработки необходимо использовать

```
SECURE_COOKIE=false
```

---

### Не найден язык `tat_cyrl`

Проверьте список языков:

```bash
docker compose exec app tesseract --list-langs
```

---


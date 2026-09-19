from fastapi import FastAPI, Depends, UploadFile, File, HTTPException, Response, Cookie
from fastapi.security import OAuth2AuthorizationCodeBearer
from sqlalchemy.orm import Session
from redis import Redis
from sqlalchemy import func
from pathlib import Path
from datetime import date, timedelta, datetime
import uuid
from utils.translate import translate
from utils.level import level_description
from utils.ocr import ocr_image, OcrResponse
from database.config import getdb, create_tables, get_redis
from database.models.user import User, RegUsersModels, LoginUserModels
from database.models.dailyActivity import DailyActivity
from chat.openai import client
from database.models.questions import Question, QuestionOut, LevelTestSubmit
from utils.pass_and_jwt import hashed_password, verify_password, decode_access_token, create_access_token, create_refresh_token, verify_refresh_token, get_current_user

app = FastAPI()
create_tables()

UPLOAD_DIR = Path(__file__).parent.parent / "static" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"}
MAX_SIZE = 20 * 1024 * 1024

@app.post("/api/register")
def registration(form: RegUsersModels, db: Session = Depends(getdb)):
    user_exists = db.query(User).filter(User.email == form.email).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")
    new_user = User(
        email=form.email,
        hash_password=hashed_password(form.password),
        name=form.name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.id}



@app.post("/api/login")
def login(response: Response, form: LoginUserModels, db: Session = Depends(getdb), redis: Redis = Depends(get_redis)):
    user = db.query(User).filter(User.email == form.email).first()
    if not user or not verify_password(form.password, user.hash_password):
        raise HTTPException(status_code=404, detail="Ошибка в почте или пароле")
    access, refresh = create_access_token(user.id), create_refresh_token(user.id, redis)
    response.set_cookie(
            key='refresh_token',
            value=refresh,
            httponly=True,
            secure=True,
            samesite='Strict',
            max_age=7 * 24 * 60 * 60,
            path='/auth'
        )
    return {"access_token": access, "token_type": "bearer"}


@app.post("/auth/refresh")
def refresh_session(response: Response, refresh_token: str | None = Cookie(default=None, alias="refresh_token"), redis: Redis = Depends(get_redis)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Токен отсутсвует")

    data = verify_refresh_token(refresh_token)
    if not data:
        raise HTTPException(status_code=401, detail="Невалидный токен")

    user_id = data.get("sub")
    old_jti = data.get("jti")

    red_key = f"refresh_token:{user_id}:{old_jti}"
    
    if not redis.exists(red_key):
        # ✅ ПРАВИЛЬНО: удаляем ТОЛЬКО этот скомпрометированный токен
        # Он уже не существует в Redis (был использован), но на всякий случай удаляем
        redis.delete(red_key)  # Просто удаляем конкретный ключ
        
        raise HTTPException(
            status_code=401, 
            detail="Попытка повторного использования токена! Доступ запрещён."
        )

    # Удаляем использованный токен (он валидный, но больше не нужен)
    redis.delete(red_key)

    access = create_access_token(user_id)
    refresh = create_refresh_token(user_id, redis)

    response.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True,
        secure=True, #временно 
        samesite="strict",
        max_age=7 * 24 * 60 * 60,
        path="/auth"
    )

    return {
        "access_token": access,
        "token_type": "bearer"
     }


@app.post("/auth/logout")
def logout(response: Response, refresh_token: str | None = Cookie(default=None, alias="refresh_token"),
    redis: Redis = Depends(get_redis)):
    if not refresh_token:
        raise HTTPException( status_code=401, detail="No active session to logout")

    data = verify_refresh_token(refresh_token)
    if not data:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    user_id = data.get("sub")
    old_jti = data.get('jti')
    red_key = f"refresh_token:{user_id}:{old_jti}"

    if not redis.exists(red_key):
        raise HTTPException(status_code=401, detail="Session alredy expired")


    redis.delete(red_key)


    response.delete_cookie(
        key="access_token", 
        httponly=True, 
        secure=True,       # Обязательно True для HTTPS в продакшене
        samesite="lax"
    )
    
    # Удаляем refresh токен
    response.delete_cookie(
        key="refresh_token", 
        httponly=True, 
        secure=True, 
        samesite="lax",
        path="/auth"  # Укажите path, если refresh-кука ставилась на конкретный эндпоинт
    )
    
    return {"status": "success", "message": "Logged out successfully"}



@app.get("/api/me/profile")
def get_stats(user_id: int = Depends(get_current_user), db: Session = Depends(getdb)):
    year_ago = date.today() - timedelta(days=364)
    activ_year = db.query(DailyActivity).filter(DailyActivity.user_id == user_id, DailyActivity.date >= year_ago).all()
    user = db.query(User).filter(User.id == user_id).first()

    by_date = {d: xp for d, xp in activ_year}

    activity = []
    for i in range(365):
        d = year_ago + timedelta(days=i)
        activity.append({
            "date": d.isoformat(),
            "xp": by_date.get(d, 0),
        })
    level = user.total_xp // 100 + 1
    return {"current_streak": user.current_streak,
        "longest_streak": user.longest_streak,
        "total_xp": user.total_xp,
        "total_lessons": user.total_lessons,
        "total_words": user.total_words_learned,
        "level": level,
        "xp_to_next_level": 100 - (user.total_xp % 100),
        "activity": activity,
    }

@app.get("/api/me/level")
def get_my_level(user_id: int = Depends(get_current_user), db: Session = Depends(getdb)):
    user = db.query(User).filter(User.id == user_id).first()
    return {
        "language_level": user.language_level,
        "needs_test": user.language_level is None,
    }

@app.get("/api/level-test/questions", response_model=list[QuestionOut])
def get_level_test_questions(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(getdb),
):
    user = db.query(User).filter(User.id == user_id).first()
    if user.language_level is not None:
        raise HTTPException(400, "Уровень уже определён")

    questions = []
    for difficulty in range(1, 6):
        q = (
            db.query(Question)
            .filter(Question.difficulty == difficulty)
            .order_by(func.random())
            .first()
        )
        if q:
            questions.append(q)

    if len(questions) < 5:
        raise HTTPException(500, "В БД не хватает вопросов (нужно по одному на уровень 1..5)")

    return questions

@app.post("/api/level-test/submit")
def submit_level_test(
    payload: LevelTestSubmit,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(getdb),
):
    user = db.query(User).filter(User.id == user_id).first()
    if user.language_level is not None:
        raise HTTPException(400, "Уровень уже определён")

    if not payload.answers:
        raise HTTPException(400, "Пустой список ответов")

    question_ids = [int(qid) for qid in payload.answers.keys()]
    questions = db.query(Question).filter(Question.id.in_(question_ids)).all()
    questions_by_id = {q.id: q for q in questions}

    correct = 0
    for qid, chosen in payload.answers.items():
        q = questions_by_id.get(int(qid))
        if q and chosen == q.correct_option:
            correct += 1

    total = len(payload.answers)

    level = max(1, correct)

    user.language_level = level
    user.level_determined_at = datetime.utcnow()
    db.commit()

    return {
        "correct": correct,
        "total": total,
        "level": level,
        "message": level_description(level),
    }


@app.post("/api/me/level/reset")
def reset_level(user_id: int = Depends(get_current_user), db: Session = Depends(getdb)):
    user = db.query(User).filter(User.id == user_id).first()
    user.language_level = None
    user.level_determined_at = None
    db.commit()
    return {"status": "ok"}


#начинание перевода с фотки и основной части с изображемнием и адаптированным текстом
@app.post("api/translate-and-adapt-text", response_model=OcrResponse)
def ocr_endpoint(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
    db: Session = Depends(getdb)
):
    user = db.query(User).filter(User.id == user_id).first()
    # 1. Проверки
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(415, f"Неподдерживаемый тип: {file.content_type}")

    content = file.file.read()
    size = len(content)
    if size > MAX_SIZE:
        raise HTTPException(413, "Файл слишком большой")
    if size == 0:
        raise HTTPException(400, "Пустой файл")

    # 2. Временное сохранение на диск — OCR работает с путём
    ext = Path(file.filename or "").suffix.lower() or ".bin"
    saved_path = UPLOAD_DIR / f"{uuid.uuid4().hex}{ext}"
    saved_path.write_bytes(content)

    # 3. Вызов OCR 
    try:
        text_tat = ocr_image(str(saved_path))   
    except Exception as e:
        raise HTTPException(500, f"Ошибка OCR: {e}")

    text_ru = translate(text_tat)
    ans = client.validate_task(text_ru, text_tat, user.language_level)
    result_text = ans["choices"][0]["message"]["content"]
    return {"text": result_text}

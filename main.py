from fastapi import FastAPI, Depends, HTTPException, Response, Cookie
from fastapi.security import OAuth2AuthorizationCodeBearer
from sqlalchemy.orm import Session
from redis import Redis
import uuid
from database.config import getdb, create_tables, get_redis
from database.models.user import User, RegUsersModels, LoginUserModels
from utils import hashed_password, verify_password, decode_access_token, create_access_token, create_refresh_token, verify_refresh_token, get_current_user

from routers.upload import router as upload_router
from routers.translate import router as translate_router

from pydantic import BaseModel, Field
from huggingface_hub import AsyncInferenceClient

import os 

app = FastAPI()
create_tables()
app.include_router(upload_router)
app.include_router(translate_router)

HF_TOKEN = os.getenv("HF_TOKEN")
client = AsyncInferenceClient(token=HF_TOKEN)

class AdaptationRequest(BaseModel):
    text: str = Field(..., description="Исходный текст для адаптации")
    style: str = Field(..., description="Стиль: по-простому, поэтично, прозаично, академически")
    age: str = Field(..., description="Возраст: ребенок, подросток, взрослый")
    language_level: str = Field(..., description="Уровень: начинающий (A1-A2), средний (B1-B2), носитель (C1-C2)")



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

    # Удаляем использованный токен 
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
        secure=True,       
        samesite="lax"
    )
    
    # Удаляем refresh токен
    response.delete_cookie(
        key="refresh_token", 
        httponly=True, 
        secure=True, 
        samesite="lax",
        path="/auth"  
    )
    
    return {"status": "success", "message": "Logged out successfully"}


# @app.post("/api/adapt")
# async def adapt_text(request: AdaptationRequest):
#     try:
#         
#         temperature = 0.7 if "поэтич" in request.style.lower() else 0.2
#         response = await client.chat_completion(
#             model="Qwen/Qwen2.5-72B-Instruct",
#             messages=[
#                 {
#                     "role": "system",
#                     "content": (
#                         "Ты — профессиональный лингвистический агент-редактор. Твоя единственная задача — "
#                         "переписать входной текст строго под заданные параметры стиля, возраста и уровня языка.\n\n"
#                         "ПРАВИЛА:\n"
#                         "- Выдавай ТОЛЬКО адаптированный текст.\n"
#                         "- Никаких вводных слов, приветствий, пояснений или кавычек на выходе.\n"
#                         "- Сохраняй исходный смысл на 100%, меняй только форму подачи."
#                     )
#                 },
#                 {
#                     "role": "user",
#                     "content": f"Параметры адаптации:\n- Стиль: {request.style}\n- Возраст: {request.age}\n- Уровень языка: {request.language_level}\n\nИсходный текст: \"{request.text}\""
#                 }
#             ],
#             max_tokens=1024,
#             temperature=temperature
#         )
        
#         # Извлекаем чистый текст из ответа ИИ
#         adapted_text = response.choices[0].message.content.strip()
#         return {"success": True, "adapted_text": adapted_text}

#     except Exception as e:
#         # Если Hugging Face вернул ошибку, корректно сообщаем об этом
#         raise HTTPException(status_code=500, detail=f"Ошибка ИИ-агента: {str(e)}")



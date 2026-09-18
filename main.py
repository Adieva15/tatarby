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


app = FastAPI()
create_tables()
app.include_router(upload_router)
app.include_router(translate_router)


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

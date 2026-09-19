from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean
from database.config import Base
from datetime import datetime
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hash_password = Column(String(60), nullable=False)
    name = Column(String, nullable=False)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_activity_date = Column(Date, nullable=True)
    total_xp = Column(Integer, default=0)
    total_lessons = Column(Integer, default=0)
    total_words_learned = Column(Integer, default=0)
    language_level = Column(Integer, nullable=True, default=1)
    level_determined_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    activities = relationship("DailyActivity", back_populates="user", cascade="all, delete-orphan")




class RegUsersModels(BaseModel):
    email: EmailStr
    password: str
    name: str



class LoginUserModels(BaseModel):
    email: EmailStr
    password: str
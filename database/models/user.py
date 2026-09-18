from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
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
    created_at = Column(DateTime, default=datetime.utcnow)




class RegUsersModels(BaseModel):
    email: EmailStr
    password: str
    name: str



class LoginUserModels(BaseModel):
    email: EmailStr
    password: str
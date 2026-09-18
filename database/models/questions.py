from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from database.config import Base
from pydantic import BaseModel


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)
    text = Column(Text, nullable=False)              
    option_a = Column(String(255), nullable=False)
    option_b = Column(String(255), nullable=False)
    option_c = Column(String(255), nullable=False)
    option_d = Column(String(255), nullable=False)
    correct_option = Column(String(1), nullable=False)
    difficulty = Column(Integer, nullable=False) 

    
class QuestionOut(BaseModel):
    id: int
    text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

    class Config:
        from_attributes = True


class LevelTestSubmit(BaseModel):
    answers: dict[int, str]
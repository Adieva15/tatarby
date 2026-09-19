from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean, ForeignKey
from database.config import Base
from sqlalchemy.orm import relationship

class DailyActivity(Base):
    __tablename__ = "daily_activity"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    xp_earned = Column(Integer, default=0)            
    lessons_completed = Column(Integer, default=0)    
    words_learned = Column(Integer, default=0)        

    user = relationship("User", back_populates="activities")
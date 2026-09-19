from sqlalchemy import create_engine
import redis
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://myuser:password@postgres:5432/mydb"


engine = create_engine(DATABASE_URL)

Base = declarative_base()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def getdb():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)

# redis

r = client = redis.Redis(host='redis', port=6379, decode_responses=True, password="mypassword")

def get_redis():
    return r

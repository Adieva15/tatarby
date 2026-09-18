from sqlalchemy import create_engine
import redis
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://myuser:password@localhost:5433/mydb"


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

r = client = redis.Redis(host='localhost', port=6379, decode_responses=True, password="mypassword")

print("Подключение успешно:", r.ping())

def get_redis():
    return r

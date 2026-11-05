# database.py

import os
import tempfile
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ✅ load .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    try:
        test_path = "./.write_test"
        with open(test_path, "w") as f:
            f.write("ok")
        os.remove(test_path)
        DATABASE_URL = "sqlite:///./toxiguard.db"
    except Exception:
        db_dir = os.environ.get("HF_HOME", tempfile.gettempdir())
        DATABASE_URL = f"sqlite:///{os.path.join(db_dir, 'toxiguard.db')}"

# Fix for Render (postgres)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite fix
connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

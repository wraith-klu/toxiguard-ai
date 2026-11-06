from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, field_validator
import secrets
import bcrypt

from database import get_db
from models import User
from auth_utils import create_access_token, generate_api_key

# ──────────────────────────────────────────────────────────────────────────────
# ROUTER
# ──────────────────────────────────────────────────────────────────────────────

router = APIRouter(prefix="/auth", tags=["Auth"])

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


# ──────────────────────────────────────────────────────────────────────────────
# SCHEMAS
# ──────────────────────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class LoginRequest(BaseModel):
    email: str
    password: str


# ──────────────────────────────────────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    """Hash password using bcrypt directly."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    """Verify password against bcrypt hash."""
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


# ──────────────────────────────────────────────────────────────────────────────
# SIGNUP
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/signup", status_code=201)
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    """Register a new user (or update password if re-registering) and return their token and API key."""
    try:
        user = db.query(User).filter(User.email == req.email).first()
        if user:
            # If user already exists, update password to chosen password
            user.password_hash = hash_password(req.password)
            db.commit()
            db.refresh(user)
            token = create_access_token({"sub": user.email})
            return {
                "message": "Account password updated successfully",
                "token": token,
                "api_key": user.api_key,
                "plan": user.plan,
            }

        user = User(
            email=req.email,
            password_hash=hash_password(req.password),
            api_key=generate_api_key(),
            plan="free",
            usage_count=0,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_access_token({"sub": user.email})
        return {
            "message": "Account created successfully",
            "token": token,
            "api_key": user.api_key,
            "plan": user.plan,
        }
    except HTTPException:
        raise
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database or server error: {exc!s}")


# ──────────────────────────────────────────────────────────────────────────────
# LOGIN
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate and return a JWT token + API key."""
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})

    return {
        "token": token,
        "api_key": user.api_key,
        "plan": user.plan,
        "usage_count": user.usage_count,
    }


# ──────────────────────────────────────────────────────────────────────────────
# API KEY AUTH DEPENDENCY
# ──────────────────────────────────────────────────────────────────────────────

def get_api_user(
    x_api_key: str = Security(api_key_header),
    db: Session = Depends(get_db),
) -> User:
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key missing")

    user = db.query(User).filter(User.api_key == x_api_key).first()
    if not user:
        raise HTTPException(status_code=403, detail="Invalid API key")

    return user


# ──────────────────────────────────────────────────────────────────────────────
# PROFILE
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/me")
def get_me(user: User = Depends(get_api_user)):
    """Return the authenticated user's profile and usage stats."""
    return {
        "email": user.email,
        "plan": user.plan,
        "usage_count": user.usage_count,
        "api_key": user.api_key,
        "last_used": user.last_used.isoformat() if user.last_used else None,
    }


# ──────────────────────────────────────────────────────────────────────────────
# ROTATE API KEY
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/reset-key")
def reset_api_key(
    user: User = Depends(get_api_user),
    db: Session = Depends(get_db),
):
    """
    Generate and store a new API key for the authenticated user.
    The old key is immediately invalidated.
    """
    user.api_key = generate_api_key()
    db.commit()
    db.refresh(user)

    return {
        "message": "API key rotated successfully",
        "api_key": user.api_key,
    }

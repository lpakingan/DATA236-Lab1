from datetime import datetime, timedelta
import secrets
from sqlalchemy.orm import Session
from ..models import SessionToken
from fastapi import Depends, HTTPException, Request
from ..database.database import  get_db

SESSION_TTL_MINUTES = 30

def require_session(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("session_id")
    if not token:
        raise HTTPException(status_code=401, detail="Not logged in")
    s = get_session(db, token)
    if not s:
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    return s  

def create_session(db: Session, role: str, reviewer_id: int | None = None, owner_id: int | None = None) -> SessionToken:
    token = secrets.token_hex(32)
    expires = datetime.utcnow() + timedelta(minutes=SESSION_TTL_MINUTES)  

    row = SessionToken(id=token, role=role, reviewer_id=reviewer_id, owner_id=owner_id, expires_at=expires)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row

def get_session(db: Session, token: str) -> SessionToken | None:
    s = db.query(SessionToken).filter(SessionToken.id == token).first()
    if not s:
        return None

    if s.expires_at < datetime.utcnow():
        db.delete(s)
        db.commit()
        return None

    return s

def delete_session(db: Session, token: str) -> bool:
    s = db.query(SessionToken).filter(SessionToken.id == token).first()
    if not s:
        return False
    db.delete(s)
    db.commit()
    return True
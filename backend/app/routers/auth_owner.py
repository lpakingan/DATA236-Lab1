from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext
from ..session_dependencies import create_session, delete_session, require_session

from ..database import get_db
from .. import schemas
from ..models import Owner

router = APIRouter(prefix="/auth/owners", tags=["owners-auth"])

# ensure that the user's password is hashed prior to storing in db
hash_password = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/signup", response_model=schemas.OwnerOut, status_code=status.HTTP_201_CREATED)
def create_owner(payload: schemas.OwnerCreate, db: Session = Depends(get_db)):
    owner = Owner(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=str(payload.email).lower(),
        password=hash_password.hash(payload.password),
        restaurant_location=payload.restaurant_location
    )
    db.add(owner)
    try:
        db.commit()
        db.refresh(owner)
        return owner
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="User email must be unique.")


@router.post("/login")
def login(email: str, password: str, response: Response, db: Session = Depends(get_db)):
    owner = db.query(Owner).filter(Owner.email == email.lower()).first()
    if not owner or not hash_password.verify(password, owner.password):
        raise HTTPException(status_code=401, detail="Invalid email/password.")

    session = create_session(db, role="owner", owner_id=owner.id)

    response.set_cookie(
        key="session_id",
        value=session.id,
        httponly=True,
        samesite="lax",
        max_age=30 * 60,
        path="/"
    )
    return {"message": "logged in", "role": "owner", "owner_id": owner.id}

@router.get("/me")
def me(session = Depends(require_session)):
    if session.role != "owner" or not session.owner_id:
        raise HTTPException(status_code=403, detail="Access for owners only!")
    return {"logged_in": True, "role": "owner", "owner_id": session.owner_id}

@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get("session_id")
    if token:
        delete_session(db, token)
    response.delete_cookie("session_id")
    return {"message": "logged out"}
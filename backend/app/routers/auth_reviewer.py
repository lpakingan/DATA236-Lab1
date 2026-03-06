from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext
from ..session_dependencies import create_session, delete_session, require_session

from ..database import get_db
from .. import schemas
from ..models import Reviewer

router = APIRouter(prefix="/auth/reviewers", tags=["reviewers-auth"])

# ensure that the user's password is hashed prior to storing in db
hash_password = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/signup", response_model=schemas.ReviewerOut, status_code=status.HTTP_201_CREATED)
def create_reviewer(payload: schemas.ReviewerCreate, db: Session = Depends(get_db)):
    reviewer = Reviewer(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=str(payload.email).lower(),
        password=hash_password.hash(payload.password)
    )
    db.add(reviewer)
    try:
        db.commit()
        db.refresh(reviewer)
        return reviewer
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="User email must be unique.")


@router.post("/login")
def login(email: str, password: str, response: Response, db: Session = Depends(get_db)):
    reviewer = db.query(Reviewer).filter(Reviewer.email == email.lower()).first()
    if not reviewer or not hash_password.verify(password, reviewer.password):
        raise HTTPException(status_code=401, detail="Invalid email/password.")

    session = create_session(db, role="reviewer", reviewer_id=reviewer.id)

    response.set_cookie(
        key="session_id",
        value=session.id,
        httponly=True,
        samesite="lax",
        max_age=30 * 60,
        path = "/"
    )
    return {"message": "logged in", "role": "reviewer", "reviewer_id": reviewer.id}

@router.get("/me")
def me(session = Depends(require_session)):
    if session.role != "reviewer" or not session.reviewer_id:
        raise HTTPException(status_code=403, detail="Access for reviewers only!")
    return {"logged_in": True, "role": "reviewer", "reviewer_id": session.reviewer_id}

@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    token = request.cookies.get("session_id")
    if token:
        delete_session(db, token)
    response.delete_cookie("session_id")
    return {"message": "logged out"}
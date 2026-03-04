from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from ..database import get_db
from .. import models, schemas
from ..session_dependencies import require_session

router = APIRouter(prefix="/reviewers", tags=["reviewers"])

# check the user role of the current session being used (make sure its a reviewer)
def check_reviewer(_session = Depends(require_session)):
    if getattr(_session, "role", None) != "reviewer" or not getattr(_session, "reviewer_id", None):
        raise HTTPException(status_code=403, detail="Must be reviewer to access page.")
    return _session

# get current reviewer's details
@router.get("/me", response_model=schemas.ReviewerOut)
def get_current_reviewer(_session=Depends(check_reviewer), db: Session = Depends(get_db)):
    reviewer = db.get(models.Reviewer, _session.reviewer_id)
    if not reviewer:
        raise HTTPException(status_code=404, detail="Reviewer not found!")
    return reviewer

# update current reviewer's details
@router.put("/me", response_model=schemas.ReviewerOut)
def update_current_reviewer(payload: schemas.ReviewerUpdate, _session=Depends(check_reviewer), db: Session = Depends(get_db)):
    reviewer = db.get(models.Reviewer, _session.reviewer_id)
    if not reviewer:
        raise HTTPException(status_code=404, detail="Reviewer not found!")
   
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(reviewer, k, v)

    db.commit()
    db.refresh(reviewer)
    return reviewer


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas
from ..models import ReviewerPreference
from .reviewers import check_reviewer

router = APIRouter(prefix="/reviewers/me/preferences", tags=["preferences"])

# get current reviewer's preferences; if none are available create default
@router.get("", response_model=schemas.ReviewerPreferenceOut)
def get_current_reviewer_prefs(db: Session = Depends(get_db), session=Depends(check_reviewer)):
    prefs = db.get(ReviewerPreference, session.reviewer_id)
    if not prefs:
        prefs = ReviewerPreference(reviewer_id = session.reviewer_id)
        db.add(prefs)
        db.commit()
        db.refresh(prefs)
    return prefs

# update current reviewer's preferences
@router.put("", response_model=schemas.ReviewerPreferenceOut)
def update_current_reviewer_prefs(payload: schemas.ReviewerPreferenceUpdate, db: Session = Depends(get_db), session=Depends(check_reviewer)):
    prefs = db.get(ReviewerPreference, session.reviewer_id)
    if not prefs:
        prefs = ReviewerPreference(reviewer_id = session.reviewer_id)
        db.add(prefs)
   
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(prefs, k, v)

    db.commit()
    db.refresh(prefs)
    return prefs


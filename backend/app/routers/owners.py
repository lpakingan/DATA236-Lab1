from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import schemas
from ..models import Owner
from ..session_dependencies import require_session

router = APIRouter(prefix="/owners", tags=["owners"])

# check the user role of the current session being used (make sure its a owner)
def check_owner(session = Depends(require_session)):
    if getattr(session, "role", None) != "owner" or not getattr(session, "owner_id", None):
        raise HTTPException(status_code=403, detail="Must be owner to access page.")
    return session

# get current owner's details
@router.get("/me", response_model=schemas.OwnerOut)
def get_current_owner(session=Depends(check_owner), db: Session = Depends(get_db)):
    owner = db.get(Owner, session.owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found!")
    return owner


from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from ..database.database import get_db
from .. import schemas
from ..models import Favorite, Restaurant
from ..dependencies.session import require_session

router = APIRouter(prefix="/reviewers/me/favorites", tags=["favorites"])

# check the user role of the current session being used (make sure its a reviewer)
def check_reviewer(session = Depends(require_session)):
    if getattr(session, "role", None) != "reviewer" or not getattr(session, "reviewer_id", None):
        raise HTTPException(status_code=403, detail="Must be reviewer for favoriting functionality!")
    return session

# add a restaurant to a user's favorites
@router.post("/{restaurant_id}",  status_code=status.HTTP_201_CREATED)
def add_favorite(restaurant_id: int, db: Session = Depends(get_db), session = Depends(check_reviewer)):
    if not db.get(Restaurant, restaurant_id):
        raise HTTPException(status_code=404, detail="Restaurant not found.")

    favorited = db.get(Favorite, {"reviewer_id": session.reviewer_id, "restaurant_id": restaurant_id})
    if favorited:
        return {"message": "Already favorited!"}
    
    favorite = Favorite(reviewer_id=session.reviewer_id, restaurant_id=restaurant_id)
    db.add(favorite)
    db.commit()
    return {"message": "Favorited!"}
  
# get all user's favorites
@router.get("", response_model=list[schemas.RestaurantOut])
def get_favorites(db: Session = Depends(get_db), session = Depends(check_reviewer)):
    return (db.query(Restaurant).join(Favorite, Favorite.restaurant_id == Restaurant.id).filter(Favorite.reviewer_id == session.reviewer_id).order_by(Restaurant.id.desc()).all())

# delete a favorite 
@router.delete("/{restaurant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_favorite(restaurant_id: int, db: Session = Depends(get_db), session=Depends(check_reviewer)):
    favorite = db.get(Favorite, {"reviewer_id": session.reviewer_id, "restaurant_id": restaurant_id})
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found!")
    db.delete(favorite)
    db.commit()
    return 


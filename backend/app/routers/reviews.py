from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from ..database.database import get_db
from .. import schemas
from ..models import Review, Restaurant
from ..dependencies.session import require_session

router = APIRouter(tags=["reviews"])

# check the user role of the current session being used (make sure its a reviewer)
def check_reviewer(session = Depends(require_session)):
    if getattr(session, "role", None) != "reviewer" or not getattr(session, "reviewer_id", None):
        raise HTTPException(status_code=403, detail="Must be reviewer for review functionality!")
    return session

# create a new review (must be logged in as a reviewer)
@router.post("/restaurants/{restaurant_id}/reviews", response_model=schemas.ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(restaurant_id: int, payload: schemas.ReviewCreate, db: Session = Depends(get_db), session = Depends(check_reviewer)):
    if not db.get(Restaurant, restaurant_id):
        raise HTTPException(status_code=404, detail="Restaurant not found.")

    review = Review(**payload.model_dump(), restaurant_id=restaurant_id, reviewer_id=session.reviewer_id)
    
    db.add(review)
    try:
        db.commit()
        db.refresh(review)
        return review
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Review already created for this restaurant!")

# get all restaurant's reviews
@router.get("/restaurants/{restaurant_id}/reviews", response_model=list[schemas.ReviewOut])
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.get(Restaurant, restaurant_id)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found!")
    return (db.query(Review).filter(Review.restaurant_id == restaurant_id).order_by(Review.id.desc()).all())

# get all reviews written by a reviewer
@router.get("/reviews/me", response_model=list[schemas.ReviewOut])
def get_reviewer_reviews(db: Session = Depends(get_db), session=Depends(check_reviewer)):
    return(db.query(Review).filter(Review.reviewer_id == session.reviewer_id).order_by(Review.id.desc()).all())

# update a review (as the reviewer who posted it)
@router.put("/reviews/{review_id}", response_model=schemas.ReviewOut)
def update_restaurant(review_id: int, payload: schemas.ReviewUpdate, db: Session = Depends(get_db), session=Depends(check_reviewer)):
    review = db.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found!")
    if review.reviewer_id != session.reviewer_id:
        raise HTTPException(status_code=403, detail="Only reviews you have posted can be edited!")
    
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(review, k, v)

    db.commit()
    db.refresh(review)
    return review

# delete a review (as the reviewer who posted it)
@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(review_id: int, db: Session = Depends(get_db), session=Depends(check_reviewer)):
    review = db.get(Review, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found!")
    if review.reviewer_id != session.reviewer_id:
        raise HTTPException(status_code=403, detail="Only reviews you have posted can be deleted!")

    db.delete(review)
    db.commit()
    return 
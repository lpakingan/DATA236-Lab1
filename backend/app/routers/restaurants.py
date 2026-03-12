from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, String

from ..database.database import get_db
from .. import schemas
from ..models import Restaurant
from ..dependencies.session import require_session

router = APIRouter(prefix="/restaurants", tags=["restaurants"])

# create a new restaurant (must be logged in as either a reviewer or owner)
@router.post("", response_model=schemas.RestaurantOut, status_code=status.HTTP_201_CREATED)
def create_restaurant(payload: schemas.RestaurantCreate, db: Session = Depends(get_db), session = Depends(require_session)):
    restaurant = Restaurant(**payload.model_dump())

    if session.role == "reviewer":
        restaurant.created_by_reviewer_id = session.reviewer_id
    elif session.role == "owner":
        restaurant.created_by_owner_id = session.owner_id
        restaurant.claimed_by_owner_id = session.owner_id
        restaurant.claim_status = "claimed"

    db.add(restaurant)
    db.commit()
    db.refresh(restaurant)
    return restaurant

# get all restaurants that match search parameters
@router.get("", response_model=list[schemas.RestaurantOut])
def get_restaurants(
    name: str | None=Query(default=None), 
    cuisine: str | None=Query(default=None), 
    keyword: str | None=Query(default=None), 
    city: str | None=Query(default=None), 
    db: Session = Depends(get_db)):
    query = db.query(Restaurant)

    if name:
        query = query.filter(Restaurant.name.ilike(f"%{name}%"))
    if cuisine:
        query = query.filter(Restaurant.cuisine.ilike(f"%{cuisine}%"))
    if keyword:
        query = query.filter(func.cast(Restaurant.keywords, String).ilike(f"%{keyword}%"))
    if city:
        query = query.filter(Restaurant.city.ilike(f"%{city}%"))

    return query.order_by(Restaurant.id.desc()).all()

# get a restaurant's information
@router.get("/{restaurant_id}", response_model=schemas.RestaurantOut)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.get(Restaurant, restaurant_id)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found!")
    return restaurant

# update a restaurant's information
@router.put("/{restaurant_id}", response_model=schemas.RestaurantOut)
def update_restaurant(restaurant_id: int, payload: schemas.RestaurantUpdate, db: Session = Depends(get_db), session=Depends(require_session)):
    restaurant = db.get(Restaurant, restaurant_id)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found!")
    
    if restaurant.claim_status == "claimed":
        if restaurant.claimed_by_owner_id != session.owner_id or session.role != "owner":
            raise HTTPException(status_code=403, detail="Must be restaurant's owner to edit!")
    else:
        if session.role == "reviewer" and restaurant.created_by_reviewer_id != session.reviewer_id:
            raise HTTPException(status_code=403, detail="Must be restaurant posting creator/owner to edit!")
        if session.role == "owner" and restaurant.claimed_by_owner_id != session.owner_id:
            raise HTTPException(status_code=403, detail="Must claim restaurant to edit!")
    
    data = payload.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(restaurant, k, v)

    db.commit()
    db.refresh(restaurant)
    return restaurant

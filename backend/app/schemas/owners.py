from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

from .restaurants import RestaurantOut

class OwnerCreate(BaseModel):
    first_name: str = Field(min_length=2, max_length=100)
    last_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=5)
    restaurant_location: str = Field(min_length=1)

class OwnerOut(BaseModel):
    id: int
    first_name: str 
    last_name: str 
    email: EmailStr
    restaurant_location: str 
    restaurants_posted: list[RestaurantOut] = []
    claimed_restaurants: list[RestaurantOut] = []
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewCreate(BaseModel):
    rating: int = Field( ge=1, le=5)
    comment: str = Field(min_length=5, max_length=500)
    photos: Optional[list[str]] = Field(default=None)

class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    comment: Optional[str] = Field(default=None, max_length=500)
    photos: Optional[list[str]] = Field(default=None)

class ReviewOut(BaseModel):
    id: int
    rating: int
    comment: str
    photos: list[str] | None
    date: datetime
    restaurant_id: int
    reviewer_id: int
    updated_at: datetime
    class Config:
        from_attributes = True

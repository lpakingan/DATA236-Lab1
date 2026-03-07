from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

from .enums import StateAbbreviation, Country

class RestaurantCreate(BaseModel):
    name: str = Field(max_length=100)
    cuisine: str = Field(max_length=100)
    description: Optional[str] = Field(default=None)
    address: str = Field(min_length=2, max_length=100)
    city: Optional[str] = Field(default=None)
    state: Optional[StateAbbreviation] = Field(default=None)
    country: Optional[Country] = Field(default=None)
    contact_info: Optional[str] = Field(default=None)
    hours: Optional[str] = Field(default=None)
    photos: Optional[list[str]] = Field(default=None)
    pricing: Optional[Literal["$", "$$","$$$", "$$$$"]] = Field(default="$")

class RestaurantUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=100)
    cuisine: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = Field(default=None)
    address: Optional[str] = Field(default=None, min_length=2, max_length=100)
    city: Optional[str] = Field(default=None)
    state: Optional[StateAbbreviation] = Field(default=None)
    country: Optional[Country] = Field(default=None)
    contact_info: Optional[str] = Field(default=None)
    hours: Optional[str] = Field(default=None)
    photos: Optional[list[str]] = Field(default=None)
    pricing: Optional[Literal["$", "$$","$$$", "$$$$"]] = Field(default=None)
    keywords: Optional[list[str]] = Field(default=None)

class RestaurantOut(BaseModel):
    id: int
    name: str
    cuisine: str
    description: str | None
    address: str 
    city: str | None
    state: str | None
    country: str | None
    contact_info: str | None
    hours: str | None
    photos: list[str] | None
    pricing: str
    keywords: list[str] | None
    claim_status: str
    claimed_by_owner_id: int | None
    created_by_reviewer_id: int | None
    created_by_owner_id: int | None
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
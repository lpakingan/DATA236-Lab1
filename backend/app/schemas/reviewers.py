from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

from .enums import StateAbbreviation, Country

class ReviewerCreate(BaseModel):
    first_name: str = Field(min_length=2, max_length=100)
    last_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=5)

class ReviewerUpdate(BaseModel):
    first_name: Optional[str] = Field(default=None, min_length=2)
    last_name: Optional[str] = Field(default=None, min_length=2)
    email: Optional[EmailStr] = Field(default=None)
    phone: Optional[str] = Field(default=None)
    about_me: Optional[str] = Field(default=None)
    profile_picture: Optional[str] = Field(default=None)
    city: Optional[str] = Field(default=None)
    state: Optional[StateAbbreviation] = Field(default=None)
    country: Optional[Country] = Field(default=None)
    languages: Optional[list[str]] = Field(default=None)
    gender: Optional[str] = Field(default=None)

class ReviewerOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: str | None
    about_me: str | None
    gender: str | None
    profile_picture: str | None
    city: str | None
    state: str | None
    country: str | None
    languages: list[str] | None
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
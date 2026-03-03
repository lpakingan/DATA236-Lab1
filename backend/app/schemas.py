from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime
from enum import Enum

# -------- Dropdowns --------
class StateAbbreviation(str, Enum):
    AL = "AL"; AK = "AK"; AZ = "AZ"; AR = "AR"; CA = "CA"; CO = "CO"; CT = "CT"; DE = "DE"
    FL = "FL"; GA = "GA"; HI = "HI"; ID = "ID"; IL = "IL"; IN = "IN"; IA = "IA"; KS = "KS"
    KY = "KY"; LA = "LA"; ME = "ME"; MD = "MD"; MA = "MA"; MI = "MI"; MN = "MN"; MS = "MS"
    MO = "MO"; MT = "MT"; NE = "NE"; NV = "NV"; NH = "NH"; NJ = "NJ"; NM = "NM"; NY = "NY"
    NC = "NC"; ND = "ND"; OH = "OH"; OK = "OK"; OR = "OR"; PA = "PA"; RI = "RI"; SC = "SC"
    SD = "SD"; TN = "TN"; TX = "TX"; UT = "UT"; VT = "VT"; VA = "VA"; WA = "WA"; WV = "WV"
    WI = "WI"; WY = "WY"
    DC = "DC"

class Country(str, Enum):
    US = "United States"; CANADA = "Canada"; MEXICO = "Mexico"

# -------- Reviewers --------
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

# -------- Reviewer Preferences --------
class ReviewerPreferenceUpdate(BaseModel):
    cuisines: Optional[list[str]] = Field(default=None)
    price_range: Optional[Literal["$", "$$","$$$", "$$$$"]] = Field(default=None)
    preferred_locations: Optional[list[str]] = Field(default=None)
    search_radius: Optional[int] = Field(default=None, ge=0, le=100)
    dietary_needs: Optional[list[str]] = Field(default=None)
    ambiance: Optional[list[str]] = Field(default=None)
    sort_preference: Optional[Literal["rating", "distance", "price", "popularity"]] = Field(default=None)

class ReviewerPreferenceOut(BaseModel):
    reviewer_id: int
    cuisines: list[str] | None
    price_range: str
    preferred_locations: list[str] | None
    search_radius: int | None
    dietary_needs: list[str] | None
    ambiance: list[str] | None
    sort_preference: str
    class Config:
        from_attributes = True

# -------- Owners --------
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
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# -------- Restaurants --------
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

# -------- Reviews --------
class ReviewCreate(BaseModel):
    restaurant_id: int = Field(gt=0)
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

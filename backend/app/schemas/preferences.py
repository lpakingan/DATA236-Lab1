from pydantic import BaseModel, Field
from typing import Optional, Literal

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
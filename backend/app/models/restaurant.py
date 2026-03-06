from sqlalchemy import String, Integer, ForeignKey, DateTime, func, Enum
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base
from datetime import datetime

from ..schemas import StateAbbreviation, Country

class Restaurant(Base):
    __tablename__ = "restaurants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    cuisine: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)
    address: Mapped[str] = mapped_column(String(100), nullable=False)
    city: Mapped[str | None] = mapped_column(String(100), nullable = True)
    state: Mapped[StateAbbreviation | None] = mapped_column(Enum(StateAbbreviation), nullable = True)
    country: Mapped[Country | None] = mapped_column(Enum(Country), nullable = True)
    contact_info: Mapped[str | None] = mapped_column(String(100), nullable=True)
    hours: Mapped[str | None] = mapped_column(String(100), nullable=True)
    photos: Mapped[list[str] | None] = mapped_column(MutableList.as_mutable(JSON), nullable=True)
    pricing: Mapped[str | None] = mapped_column(Enum("$", "$$", "$$$", "$$$$"), nullable=True)
    keywords: Mapped[list[str] | None] = mapped_column(MutableList.as_mutable(JSON), nullable=True)
    claim_status: Mapped[str] = mapped_column(Enum("unclaimed", "claimed"), nullable = False, default = "unclaimed")
    claimed_by_owner_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("owners.id", ondelete = "SET NULL"), nullable = True)
    created_by_reviewer_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("reviewers.id", ondelete = "SET NULL"), nullable = True)
    created_by_owner_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("owners.id", ondelete = "SET NULL"), nullable = True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # relationships
    created_by_reviewer: Mapped["Reviewer | None"] = relationship("Reviewer", back_populates = "restaurants_posted", foreign_keys = [created_by_reviewer_id])
    created_by_owner: Mapped["Owner | None"] = relationship("Owner", back_populates = "restaurants_posted", foreign_keys = [created_by_owner_id])
    reviews: Mapped[list["Review"]] = relationship("Review", back_populates = "restaurant", cascade = "all, delete-orphan")
    reviewers_favorited: Mapped[list["Favorite"]] = relationship("Favorite", back_populates = "restaurant", cascade = "all, delete-orphan")
    claimed_by_owner: Mapped["Owner | None"] = relationship("Owner", back_populates = "claimed_restaurants", foreign_keys = [claimed_by_owner_id])
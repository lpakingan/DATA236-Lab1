from sqlalchemy import String, Integer, ForeignKey, DateTime, func, UniqueConstraint, Enum
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base
from datetime import datetime

from .schemas import StateAbbreviation, Country

class Reviewer(Base):
    __tablename__ = "reviewers"
    __table_args__ = (UniqueConstraint("email", name="uq_reviewer_email"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(10), nullable = True)
    about_me: Mapped[str | None] = mapped_column(String(255), nullable = True)
    gender: Mapped[str | None] = mapped_column(String(255), nullable = True)
    profile_picture: Mapped[str | None] = mapped_column(String(255), nullable = True)
    city: Mapped[str | None] = mapped_column(String(100), nullable = True)
    state: Mapped[StateAbbreviation | None] = mapped_column(Enum(StateAbbreviation), nullable = True)
    country: Mapped[Country | None] = mapped_column(Enum(Country), nullable = True)
    languages: Mapped[list[str] | None] = mapped_column(MutableList.as_mutable(JSON), nullable = True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # relationships
    reviews: Mapped[list["Review"]] = relationship("Review", back_populates = "reviewer", cascade = "all, delete-orphan")
    preferences: Mapped["ReviewerPreference | None"] = relationship("ReviewerPreference", back_populates = "reviewer", uselist = False, cascade = "all, delete-orphan")
    restaurants_posted: Mapped[list["Restaurant"]] = relationship("Restaurant", back_populates = "created_by_reviewer", foreign_keys = "Restaurant.created_by_reviewer_id")
    favorites: Mapped[list["Favorite"]] = relationship("Favorite", back_populates = "reviewer",  cascade = "all, delete-orphan")

class ReviewerPreference(Base):
    __tablename__ = "preferences"
    
    reviewer_id: Mapped[int] = mapped_column(Integer, ForeignKey("reviewers.id", ondelete="CASCADE"), primary_key=True)
    cuisines: Mapped[list[str] | None] = mapped_column(MutableList.as_mutable(JSON), nullable = True)
    price_range: Mapped[str] = mapped_column(Enum("$", "$$","$$$", "$$$$"), nullable = False, default = "$")
    preferred_locations: Mapped[list[str] | None] = mapped_column(MutableList.as_mutable(JSON), nullable = True)
    search_radius: Mapped[int | None] = mapped_column(Integer, nullable = True, default = 10)
    dietary_needs: Mapped[list[str] | None] = mapped_column(MutableList.as_mutable(JSON), nullable = True)
    ambiance: Mapped[list[str] | None] = mapped_column(MutableList.as_mutable(JSON), nullable = True)
    sort_preference: Mapped[str] = mapped_column(Enum("rating", "distance", "price", "popularity"), nullable = False, default = "price")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # relationships
    reviewer: Mapped["Reviewer"] = relationship("Reviewer", back_populates="preferences")

class Owner(Base):
    __tablename__ = "owners"
    __table_args__ = (UniqueConstraint("email", name="uq_owner_email"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    restaurant_location: Mapped[str] = mapped_column(String(100), nullable = False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # relationships
    restaurants_posted: Mapped[list["Restaurant"]] = relationship("Restaurant", back_populates="created_by_owner", foreign_keys="Restaurant.created_by_owner_id")
    claimed_restaurants: Mapped[list["Restaurant"]] = relationship("Restaurant", back_populates = "claimed_by_owner", foreign_keys ="Restaurant.claimed_by_owner_id" )

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

class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = (UniqueConstraint("restaurant_id", "reviewer_id", name="uq_review_reviewer_restaurant"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    rating: Mapped[int] = mapped_column(Enum(1, 2, 3, 4, 5), nullable=False)
    comment: Mapped[str | None] = mapped_column(String(500), nullable=False)
    photos: Mapped[list[str] | None] = mapped_column(MutableList.as_mutable(JSON), nullable = True)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    restaurant_id: Mapped[int] = mapped_column(Integer, ForeignKey("restaurants.id", ondelete="CASCADE"), nullable = False)
    reviewer_id: Mapped[int] = mapped_column(Integer, ForeignKey("reviewers.id", ondelete="CASCADE"), nullable = False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # relationships
    restaurant: Mapped["Restaurant"] = relationship("Restaurant", back_populates = "reviews")
    reviewer: Mapped["Reviewer"] = relationship("Reviewer", back_populates = "reviews")

class Favorite(Base):
    __tablename__ = "favorites"

    reviewer_id: Mapped[int] = mapped_column(Integer, ForeignKey("reviewers.id", ondelete = "CASCADE"), primary_key = True)
    restaurant_id: Mapped[int] = mapped_column(Integer, ForeignKey("restaurants.id", ondelete = "CASCADE"), primary_key = True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # relationships
    reviewer: Mapped["Reviewer"] = relationship("Reviewer", back_populates = "favorites")
    restaurant: Mapped["Restaurant"] = relationship("Restaurant", back_populates = "reviewers_favorited")

    
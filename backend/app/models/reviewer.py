from sqlalchemy import String, Integer, DateTime, func, UniqueConstraint, Enum
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database.database import Base
from datetime import datetime

from ..schemas import StateAbbreviation, Country

class Reviewer(Base):
    __tablename__ = "reviewers"
    __table_args__ = (UniqueConstraint("email", name="uq_reviewer_email"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False)
    password: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(20), nullable = True)
    about_me: Mapped[str | None] = mapped_column(String(255), nullable = True)
    gender: Mapped[str | None] = mapped_column(String(100), nullable = True)
    profile_picture: Mapped[str | None] = mapped_column(String(100), nullable = True)
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
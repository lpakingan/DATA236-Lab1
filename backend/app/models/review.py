from sqlalchemy import String, Integer, ForeignKey, DateTime, func, UniqueConstraint, CheckConstraint
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base
from datetime import datetime

class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = (UniqueConstraint("restaurant_id", "reviewer_id", name="uq_review_reviewer_restaurant"), CheckConstraint("rating >= 1 AND rating <= 5", name="check_rating_range"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str | None] = mapped_column(String(500), nullable=False)
    photos: Mapped[list[str] | None] = mapped_column(MutableList.as_mutable(JSON), nullable = True)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    restaurant_id: Mapped[int] = mapped_column(Integer, ForeignKey("restaurants.id", ondelete="CASCADE"), nullable = False)
    reviewer_id: Mapped[int] = mapped_column(Integer, ForeignKey("reviewers.id", ondelete="CASCADE"), nullable = False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # relationships
    restaurant: Mapped["Restaurant"] = relationship("Restaurant", back_populates = "reviews")
    reviewer: Mapped["Reviewer"] = relationship("Reviewer", back_populates = "reviews")
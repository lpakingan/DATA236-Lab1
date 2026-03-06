from sqlalchemy import Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database import Base
from datetime import datetime

class Favorite(Base):
    __tablename__ = "favorites"

    reviewer_id: Mapped[int] = mapped_column(Integer, ForeignKey("reviewers.id", ondelete = "CASCADE"), primary_key = True)
    restaurant_id: Mapped[int] = mapped_column(Integer, ForeignKey("restaurants.id", ondelete = "CASCADE"), primary_key = True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # relationships
    reviewer: Mapped["Reviewer"] = relationship("Reviewer", back_populates = "favorites")
    restaurant: Mapped["Restaurant"] = relationship("Restaurant", back_populates = "reviewers_favorited")
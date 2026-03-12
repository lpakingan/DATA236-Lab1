from sqlalchemy import Integer, DateTime, func, ForeignKey, Enum
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database.database import Base
from datetime import datetime

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
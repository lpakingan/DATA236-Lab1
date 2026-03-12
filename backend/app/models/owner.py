from sqlalchemy import String, Integer, ForeignKey, DateTime, func, UniqueConstraint, Enum
from sqlalchemy.dialects.mysql import JSON
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database.database import Base
from datetime import datetime


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